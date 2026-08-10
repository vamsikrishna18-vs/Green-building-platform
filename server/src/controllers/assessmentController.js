const Assessment = require('../models/Assessment');
const mongoose = require('mongoose');
const { calculateScoring } = require('../services/scoringEngine');
const { generateRecommendations } = require('../services/recommendationEngine');

// In-Memory Storage Fallback when MongoDB connection is unavailable
const memoryStore = [];

/**
 * Helper to check if Mongoose DB is connected
 */
function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * CREATE a new assessment and save to DB
 */
exports.createAssessment = async (req, res, next) => {
  try {
    const inputData = req.body;

    if (!inputData.buildingInfo || !inputData.buildingInfo.name) {
      return res.status(400).json({ error: 'Building name and basic information are required.' });
    }

    // 1. Calculate Scores
    const scores = calculateScoring(inputData);

    // 2. Generate Recommendations & Top 3 Priority Actions
    const recResult = generateRecommendations(inputData, scores);
    const recommendations = recResult.recommendations || recResult;
    const top3RecommendedActions = recResult.top3RecommendedActions || [];

    // 3. Attach owner userId if authenticated
    const userId = req.user ? req.user._id : null;

    // 4. Assemble document payload
    const assessmentPayload = {
      ...inputData,
      userId,
      scores,
      recommendations,
      top3RecommendedActions,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let result;
    if (isDbConnected()) {
      const doc = new Assessment(assessmentPayload);
      result = await doc.save();
    } else {
      // In-Memory fallback
      result = {
        _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        ...assessmentPayload
      };
      memoryStore.unshift(result);
    }

    return res.status(201).json({
      success: true,
      message: 'Assessment calculated and saved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * SIMULATE an assessment (Stateless, no DB write)
 */
exports.simulateAssessment = async (req, res, next) => {
  try {
    const inputData = req.body;

    // Calculate Scores & Recommendations
    const scores = calculateScoring(inputData);
    const recResult = generateRecommendations(inputData, scores);
    const recommendations = recResult.recommendations || recResult;
    const top3RecommendedActions = recResult.top3RecommendedActions || [];

    return res.status(200).json({
      success: true,
      isSimulation: true,
      scores,
      recommendations,
      top3RecommendedActions,
      data: {
        ...inputData,
        scores,
        recommendations,
        top3RecommendedActions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET ALL assessments (with search & user filtering + legacy support)
 */
exports.getAllAssessments = async (req, res, next) => {
  try {
    const { search, buildingType, limit = 50 } = req.query;

    if (isDbConnected()) {
      const filter = {};

      // Filter by user ownership OR include legacy records without userId
      if (req.user) {
        filter.$or = [
          { userId: req.user._id },
          { userId: null },
          { userId: { $exists: false } }
        ];
      }

      if (buildingType && buildingType !== 'All') {
        filter['buildingInfo.buildingType'] = buildingType;
      }
      if (search) {
        filter['buildingInfo.name'] = { $regex: search, $options: 'i' };
      }

      const assessments = await Assessment.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit));

      return res.status(200).json({
        success: true,
        count: assessments.length,
        data: assessments
      });
    } else {
      // In-Memory query fallback
      let filtered = [...memoryStore];
      if (req.user) {
        filtered = filtered.filter(
          item => !item.userId || item.userId.toString() === req.user._id.toString()
        );
      }
      if (buildingType && buildingType !== 'All') {
        filtered = filtered.filter(item => item.buildingInfo?.buildingType === buildingType);
      }
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(item => item.buildingInfo?.name?.toLowerCase().includes(query));
      }

      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered.slice(0, Number(limit))
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * GET SINGLE assessment by ID
 */
exports.getAssessmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && !id.startsWith('mem_')) {
      const assessment = await Assessment.findById(id);
      if (!assessment) {
        return res.status(404).json({ error: 'Assessment not found.' });
      }
      return res.status(200).json({ success: true, data: assessment });
    } else {
      const found = memoryStore.find(item => item._id === id);
      if (!found) {
        return res.status(404).json({ error: 'Assessment not found.' });
      }
      return res.status(200).json({ success: true, data: found });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE assessment by ID
 */
exports.deleteAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && !id.startsWith('mem_')) {
      const assessment = await Assessment.findById(id);
      if (!assessment) {
        return res.status(404).json({ error: 'Assessment not found.' });
      }

      // Allow deletion if owner, or legacy record, or admin
      if (
        assessment.userId &&
        req.user &&
        assessment.userId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ error: 'Unauthorized to delete this assessment.' });
      }

      await Assessment.findByIdAndDelete(id);
    } else {
      const index = memoryStore.findIndex(item => item._id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Assessment not found.' });
      }
      memoryStore.splice(index, 1);
    }

    return res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully.',
      deletedId: id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET Dashboard Aggregate Analytics
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    let list = [];
    if (isDbConnected()) {
      const filter = {};
      if (req.user) {
        filter.$or = [
          { userId: req.user._id },
          { userId: null },
          { userId: { $exists: false } }
        ];
      }
      list = await Assessment.find(filter).sort({ createdAt: -1 });
    } else {
      list = [...memoryStore];
    }

    const totalCount = list.length;
    if (totalCount === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalAssessments: 0,
          averageScore: 0,
          highestScore: 0,
          ratingCounts: { Excellent: 0, Good: 0, Moderate: 0, 'Needs Improvement': 0 },
          categoryAverages: { energy: 0, water: 0, materials: 0, waste: 0, renewable: 0, greenFeatures: 0 }
        }
      });
    }

    const ratingCounts = { Excellent: 0, Good: 0, Moderate: 0, 'Needs Improvement': 0 };
    let sumScore = 0;
    let maxScore = 0;
    let minScore = 100;
    let sumRenewablePct = 0;
    let totalCO2Red = 0;
    let needingImpCount = 0;

    const catSums = { energy: 0, water: 0, materials: 0, waste: 0, renewable: 0, greenFeatures: 0 };

    list.forEach(item => {
      const score = item.scores?.overallScore || 0;
      const rating = item.scores?.rating || 'Needs Improvement';
      
      sumScore += score;
      if (score > maxScore) maxScore = score;
      if (score < minScore) minScore = score;

      if (rating === 'Needs Improvement') needingImpCount++;

      if (ratingCounts[rating] !== undefined) {
        ratingCounts[rating]++;
      }

      const renewPct = Number(item.renewableEnergy?.renewableEnergyPercent) || 0;
      sumRenewablePct += renewPct;

      const co2Red = Number(item.scores?.carbonFootprint?.potentialCO2Reduction) || 0;
      totalCO2Red += co2Red;

      const cats = item.scores?.categoryScores || {};
      catSums.energy += cats.energy || 0;
      catSums.water += cats.water || 0;
      catSums.materials += cats.materials || 0;
      catSums.waste += cats.waste || 0;
      catSums.renewable += cats.renewable || 0;
      catSums.greenFeatures += cats.greenFeatures || 0;
    });

    const categoryAverages = {
      energy: Math.round(catSums.energy / totalCount),
      water: Math.round(catSums.water / totalCount),
      materials: Math.round(catSums.materials / totalCount),
      waste: Math.round(catSums.waste / totalCount),
      renewable: Math.round(catSums.renewable / totalCount),
      greenFeatures: Math.round(catSums.greenFeatures / totalCount)
    };

    return res.status(200).json({
      success: true,
      data: {
        totalAssessments: totalCount,
        averageScore: Math.round(sumScore / totalCount),
        highestScore: maxScore,
        lowestScore: minScore === 100 && totalCount === 0 ? 0 : minScore,
        averageRenewablePercent: Math.round(sumRenewablePct / totalCount),
        totalCO2Reduction: Number(totalCO2Red.toFixed(1)),
        projectsNeedingImprovement: needingImpCount,
        ratingCounts,
        categoryAverages
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET Assessment Benchmarks
 */
const { calculateBenchmarks } = require('../services/benchmarkService');

exports.getBenchmarks = async (req, res, next) => {
  try {
    const { id } = req.query;
    let list = [];
    if (isDbConnected()) {
      const filter = {};
      if (req.user) {
        filter.$or = [
          { userId: req.user._id },
          { userId: null },
          { userId: { $exists: false } }
        ];
      }
      list = await Assessment.find(filter).sort({ createdAt: -1 });
    } else {
      list = [...memoryStore];
    }

    const targetDoc = id ? list.find(a => a._id.toString() === id.toString()) : list[0];
    const benchmarks = calculateBenchmarks(targetDoc || list[0] || {}, list);

    return res.status(200).json({
      success: true,
      data: benchmarks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST Calculate Custom ROI & Financial Return Analysis
 */
const { calculateCostImpactAnalysis } = require('../services/costEngine');

exports.calculateRoi = async (req, res, next) => {
  try {
    const { assessmentData, assumptions } = req.body;
    const result = calculateCostImpactAnalysis(assessmentData || {}, assumptions || {});

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

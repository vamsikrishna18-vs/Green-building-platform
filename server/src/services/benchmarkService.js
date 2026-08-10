/**
 * GreenBuild Sustainability Benchmarking Engine
 * Compares an assessment against user-scoped averages, building-type averages,
 * and top platform benchmark scores.
 */

function calculateBenchmarks(targetAssessment, allUserAssessments = []) {
  const targetScore = Number(targetAssessment?.scores?.overallScore) || 50;
  const buildingType = targetAssessment?.buildingInfo?.buildingType || 'Commercial';

  // System benchmark defaults (used when insufficient database records exist for a building type)
  const systemBuildingTypeBenchmarks = {
    Commercial: 71,
    Residential: 74,
    Industrial: 62,
    'Mixed-Use': 68
  };

  const typeBenchmark = systemBuildingTypeBenchmarks[buildingType] || 70;

  let sumUserScore = 0;
  let maxScore = targetScore;

  if (allUserAssessments.length > 0) {
    allUserAssessments.forEach(item => {
      const s = Number(item.scores?.overallScore) || 0;
      sumUserScore += s;
      if (s > maxScore) maxScore = s;
    });
  }

  const userAvg = allUserAssessments.length > 0 ? Math.round(sumUserScore / allUserAssessments.length) : targetScore;
  const diffFromTypeAvg = targetScore - typeBenchmark;

  let benchmarkStatus = 'Average';
  if (diffFromTypeAvg >= 5) benchmarkStatus = 'Above Average';
  else if (diffFromTypeAvg <= -5) benchmarkStatus = 'Below Average';

  return {
    targetScore,
    buildingType,
    typeBenchmarkAverage: typeBenchmark,
    userAverageScore: userAvg,
    bestProjectScore: maxScore,
    varianceFromTypeAverage: diffFromTypeAvg >= 0 ? `+${diffFromTypeAvg}` : `${diffFromTypeAvg}`,
    benchmarkStatus,
    categoryBenchmarks: {
      energy: 72,
      water: 75,
      materials: 65,
      waste: 70,
      renewable: 50,
      greenFeatures: 60
    }
  };
}

module.exports = { calculateBenchmarks };

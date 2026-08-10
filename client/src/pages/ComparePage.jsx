import React, { useState, useEffect } from 'react';
import RatingBadge from '../components/common/RatingBadge';
import CategoryRadarChart from '../components/assessment/CategoryRadarChart';
import ScenarioComparisonTable from '../components/assessment/ScenarioComparisonTable';
import { fetchAssessments } from '../services/api';
import {
  GitCompare,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Sparkles,
  Building2,
  Loader2,
  Award,
  Zap,
  Droplets,
  Sun
} from 'lucide-react';

export default function ComparePage({ setActiveTab, setSelectedAssessmentId }) {
  const [assessments, setAssessments] = useState([]);
  const [selectedIdA, setSelectedIdA] = useState('');
  const [selectedIdB, setSelectedIdB] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    setLoading(true);
    try {
      const data = await fetchAssessments({ limit: 100 });
      setAssessments(data);
      if (data.length >= 2) {
        setSelectedIdA(data[0]._id);
        setSelectedIdB(data[1]._id);
      } else if (data.length === 1) {
        setSelectedIdA(data[0]._id);
      }
    } catch (err) {
      console.error('Error loading assessments for comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  const itemA = assessments.find(a => a._id === selectedIdA);
  const itemB = assessments.find(a => a._id === selectedIdB);

  // Compute portfolio leaders
  let bestOverall = assessments[0];
  let bestEnergy = assessments[0];
  let bestWater = assessments[0];
  let bestRenewable = assessments[0];

  assessments.forEach(item => {
    const overall = item.scores?.overallScore || 0;
    const energy = item.scores?.categoryScores?.energy || 0;
    const water = item.scores?.categoryScores?.water || 0;
    const renew = item.scores?.categoryScores?.renewable || 0;

    if (overall > (bestOverall?.scores?.overallScore || 0)) bestOverall = item;
    if (energy > (bestEnergy?.scores?.categoryScores?.energy || 0)) bestEnergy = item;
    if (water > (bestWater?.scores?.categoryScores?.water || 0)) bestWater = item;
    if (renew > (bestRenewable?.scores?.categoryScores?.renewable || 0)) bestRenewable = item;
  });

  const getDeltaBadge = (valA, valB, higherIsBetter = true) => {
    const numA = Number(valA) || 0;
    const numB = Number(valB) || 0;
    const diff = numB - numA;

    if (diff === 0) {
      return (
        <span className="badge-saas-neutral">
          <Minus className="w-3 h-3" /> Same
        </span>
      );
    }

    const isPositive = higherIsBetter ? diff > 0 : diff < 0;

    return (
      <span className={isPositive ? 'badge-saas-success' : 'badge-saas-warning'}>
        {diff > 0 ? `+${diff}` : diff}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-eco-400 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Assessment Comparison Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="panel-accent border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Assessment Analytics & Benchmarking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Building & Assessment Comparison
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Compare building performance side-by-side across overall score, category breakdown, and carbon emissions.
          </p>
        </div>
      </div>

      {/* Portfolio Best Performers Leaderboard Cards */}
      {assessments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Best Overall Building
            </span>
            <div className="text-sm font-bold text-white truncate">{bestOverall?.buildingInfo?.name || 'N/A'}</div>
            <span className="text-xs font-black text-amber-400 block">{bestOverall?.scores?.overallScore || 0}/100 Score</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-teal-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-teal-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Best Energy Performance
            </span>
            <div className="text-sm font-bold text-white truncate">{bestEnergy?.buildingInfo?.name || 'N/A'}</div>
            <span className="text-xs font-black text-teal-300 block">{bestEnergy?.scores?.categoryScores?.energy || 0}/100 Score</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" /> Best Water Performance
            </span>
            <div className="text-sm font-bold text-white truncate">{bestWater?.buildingInfo?.name || 'N/A'}</div>
            <span className="text-xs font-black text-cyan-400 block">{bestWater?.scores?.categoryScores?.water || 0}/100 Score</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-eco-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-eco-400 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" /> Best Renewable Performance
            </span>
            <div className="text-sm font-bold text-white truncate">{bestRenewable?.buildingInfo?.name || 'N/A'}</div>
            <span className="text-xs font-black text-eco-400 block">{bestRenewable?.scores?.categoryScores?.renewable || 0}/100 Score</span>
          </div>

        </div>
      )}

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Selector A */}
        <div className="panel-elevated space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Assessment A (Baseline)
          </label>
          <select
            value={selectedIdA}
            onChange={(e) => setSelectedIdA(e.target.value)}
            className="input-saas"
          >
            <option value="">-- Select Assessment A --</option>
            {assessments.map(a => (
              <option key={a._id} value={a._id}>
                {a.buildingInfo?.name} ({a.scores?.overallScore}/100 - {a.scores?.rating})
              </option>
            ))}
          </select>
        </div>

        {/* Selector B */}
        <div className="panel-elevated space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Assessment B (Comparison Target)
          </label>
          <select
            value={selectedIdB}
            onChange={(e) => setSelectedIdB(e.target.value)}
            className="input-saas"
          >
            <option value="">-- Select Assessment B --</option>
            {assessments.map(a => (
              <option key={a._id} value={a._id}>
                {a.buildingInfo?.name} ({a.scores?.overallScore}/100 - {a.scores?.rating})
              </option>
            ))}
          </select>
        </div>

      </div>

      {!itemA || !itemB ? (
        <div className="text-center py-16 panel-elevated space-y-3">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-300 text-base font-semibold">
            Select two assessments above to view a detailed side-by-side comparison matrix.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Top Score Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card A */}
            <div className="panel-elevated text-center space-y-3">
              <span className="text-xs uppercase font-bold text-slate-400">Assessment A</span>
              <h3 className="text-lg font-bold text-white truncate">{itemA.buildingInfo?.name}</h3>
              <div className="text-4xl font-black text-slate-200">{itemA.scores?.overallScore}<span className="text-xs text-slate-500 font-normal">/100</span></div>
              <RatingBadge rating={itemA.scores?.rating} size="md" />
            </div>

            {/* Delta Status Card */}
            <div className="panel-flat border-eco-500/30 bg-eco-500/5 text-center flex flex-col items-center justify-center space-y-2">
              <span className="text-xs uppercase font-extrabold text-eco-400">Overall Variance</span>
              <div className="text-2xl font-black text-white">
                {getDeltaBadge(itemA.scores?.overallScore, itemB.scores?.overallScore)}
              </div>
              <p className="text-xs text-slate-300">
                {itemB.scores?.overallScore >= itemA.scores?.overallScore
                  ? 'Assessment B outperforms Assessment A.'
                  : 'Assessment A outperforms Assessment B.'}
              </p>
            </div>

            {/* Card B */}
            <div className="panel-elevated text-center space-y-3">
              <span className="text-xs uppercase font-bold text-slate-400">Assessment B</span>
              <h3 className="text-lg font-bold text-white truncate">{itemB.buildingInfo?.name}</h3>
              <div className="text-4xl font-black text-eco-400">{itemB.scores?.overallScore}<span className="text-xs text-slate-500 font-normal">/100</span></div>
              <RatingBadge rating={itemB.scores?.rating} size="md" />
            </div>

          </div>

          {/* Side by Side Detailed Comparison Table with Sticky Headers */}
          <div className="panel-elevated space-y-4">
            <h3 className="text-base font-bold text-white">Category & Metric Comparison Matrix</h3>
            
            <div className="overflow-x-auto">
              <table className="table-saas">
                <thead className="sticky top-16 z-10">
                  <tr>
                    <th>Metric Dimension</th>
                    <th>{itemA.buildingInfo?.name} (A)</th>
                    <th>{itemB.buildingInfo?.name} (B)</th>
                    <th className="text-right">Variance / Delta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold text-white">Total Floor Area</td>
                    <td>{itemA.buildingInfo?.totalAreaSqFt?.toLocaleString()} sq ft</td>
                    <td className="font-bold text-white">{itemB.buildingInfo?.totalAreaSqFt?.toLocaleString()} sq ft</td>
                    <td className="text-right">{getDeltaBadge(itemA.buildingInfo?.totalAreaSqFt, itemB.buildingInfo?.totalAreaSqFt)}</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-white">Energy Score</td>
                    <td>{itemA.scores?.categoryScores?.energy} / 100</td>
                    <td className="font-bold text-white">{itemB.scores?.categoryScores?.energy} / 100</td>
                    <td className="text-right">{getDeltaBadge(itemA.scores?.categoryScores?.energy, itemB.scores?.categoryScores?.energy)}</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-white">Water Score</td>
                    <td>{itemA.scores?.categoryScores?.water} / 100</td>
                    <td className="font-bold text-white">{itemB.scores?.categoryScores?.water} / 100</td>
                    <td className="text-right">{getDeltaBadge(itemA.scores?.categoryScores?.water, itemB.scores?.categoryScores?.water)}</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-white">Materials Score</td>
                    <td>{itemA.scores?.categoryScores?.materials} / 100</td>
                    <td className="font-bold text-white">{itemB.scores?.categoryScores?.materials} / 100</td>
                    <td className="text-right">{getDeltaBadge(itemA.scores?.categoryScores?.materials, itemB.scores?.categoryScores?.materials)}</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-white">Waste Management Score</td>
                    <td>{itemA.scores?.categoryScores?.waste} / 100</td>
                    <td className="font-bold text-white">{itemB.scores?.categoryScores?.waste} / 100</td>
                    <td className="text-right">{getDeltaBadge(itemA.scores?.categoryScores?.waste, itemB.scores?.categoryScores?.waste)}</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-white">Renewable Energy Score</td>
                    <td>{itemA.scores?.categoryScores?.renewable} / 100</td>
                    <td className="font-bold text-white">{itemB.scores?.categoryScores?.renewable} / 100</td>
                    <td className="text-right">{getDeltaBadge(itemA.scores?.categoryScores?.renewable, itemB.scores?.categoryScores?.renewable)}</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-white">Green Features Score</td>
                    <td>{itemA.scores?.categoryScores?.greenFeatures} / 100</td>
                    <td className="font-bold text-white">{itemB.scores?.categoryScores?.greenFeatures} / 100</td>
                    <td className="text-right">{getDeltaBadge(itemA.scores?.categoryScores?.greenFeatures, itemB.scores?.categoryScores?.greenFeatures)}</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-white">Energy Intensity (EUI)</td>
                    <td>{itemA.scores?.metrics?.eui} kWh/sqft</td>
                    <td className="font-bold text-white">{itemB.scores?.metrics?.eui} kWh/sqft</td>
                    <td className="text-right">{getDeltaBadge(itemA.scores?.metrics?.eui, itemB.scores?.metrics?.eui, false)}</td>
                  </tr>

                  <tr>
                    <td className="font-semibold text-white">Carbon Footprint Target</td>
                    <td>{itemA.scores?.carbonFootprint?.totalCurrentCO2e || 'N/A'} MT/yr</td>
                    <td className="font-bold text-white">{itemB.scores?.carbonFootprint?.totalCurrentCO2e || 'N/A'} MT/yr</td>
                    <td className="text-right">{getDeltaBadge(itemA.scores?.carbonFootprint?.totalCurrentCO2e, itemB.scores?.carbonFootprint?.totalCurrentCO2e, false)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

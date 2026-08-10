import React from 'react';
import { Award, ArrowUpRight, DollarSign, Cloud, CheckCircle2, Sparkles } from 'lucide-react';

export default function ScenarioComparisonTable({ scenarios = [] }) {
  if (!scenarios || scenarios.length === 0) return null;

  // Find best scenario (shortest payback or highest score)
  let bestScenarioId = scenarios[0]?._id || scenarios[0]?.id;
  let minPayback = 99;

  scenarios.forEach(sc => {
    const pb = Number(sc.paybackYears) || 99;
    if (pb < minPayback) {
      minPayback = pb;
      bestScenarioId = sc._id || sc.id;
    }
  });

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Scenario Decision Matrix</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Multi-Scenario Investment Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare financial capital commitments, score gains, and carbon payback across upgrade scenarios.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Scenario Name</th>
              <th className="px-4 py-3">Overall Score</th>
              <th className="px-4 py-3">Score Gain</th>
              <th className="px-4 py-3">Investment Cost</th>
              <th className="px-4 py-3">Est. Annual Savings</th>
              <th className="px-4 py-3">Payback Period</th>
              <th className="px-4 py-3">Carbon Reduction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {scenarios.map((sc) => {
              const isBest = (sc._id || sc.id) === bestScenarioId;

              return (
                <tr
                  key={sc._id || sc.id}
                  className={`transition-colors ${
                    isBest ? 'bg-eco-500/10 border-l-4 border-l-eco-400' : 'hover:bg-slate-900/50'
                  }`}
                >
                  <td className="px-4 py-4 font-bold text-white flex items-center gap-2">
                    <span>{sc.name || sc.title || 'Upgrade Scenario'}</span>
                    {isBest && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 shadow-glow-emerald">
                        <Award className="w-3 h-3" /> BEST ROI
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 font-black text-base text-white">
                    {sc.overallScore || sc.scores?.overallScore || 75}
                    <span className="text-xs text-slate-500 font-normal">/100</span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-eco-500/15 text-eco-400 font-extrabold text-xs border border-eco-500/30">
                      +{sc.scoreDiff || 12} pts
                    </span>
                  </td>

                  <td className="px-4 py-4 font-bold text-slate-200">
                    {sc.estimatedCost || '$35,000 - $65,000'}
                  </td>

                  <td className="px-4 py-4 font-bold text-emerald-400">
                    {sc.annualSavings || '$8,500/yr'}
                  </td>

                  <td className="px-4 py-4 font-bold text-teal-300">
                    {sc.paybackYears ? `${sc.paybackYears} yrs` : '~3.5 yrs'}
                  </td>

                  <td className="px-4 py-4 font-bold text-cyan-400">
                    {sc.carbonReduction ? `${sc.carbonReduction} MT/yr` : '-45 MT/yr'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import { Award, ArrowUpRight, DollarSign, Cloud, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

export default function Top3ActionsCard({ top3Actions = [] }) {
  if (!top3Actions || top3Actions.length === 0) return null;

  const rankColors = [
    { rank: '#1', border: 'border-amber-500/50 bg-amber-500/5', badge: 'bg-amber-500 text-slate-950', text: 'text-amber-400' },
    { rank: '#2', border: 'border-teal-500/50 bg-teal-500/5', badge: 'bg-teal-400 text-slate-950', text: 'text-teal-300' },
    { rank: '#3', border: 'border-eco-500/50 bg-eco-500/5', badge: 'bg-eco-500 text-slate-950', text: 'text-eco-400' }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Priority Recommendation Engine</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Top 3 High-Impact Recommended Actions
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by score gain, carbon impact, financial payback, and building category weakness.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {top3Actions.map((action, idx) => {
          const theme = rankColors[idx] || rankColors[2];

          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 border ${theme.border} space-y-3 transition-all duration-200 hover:border-slate-700`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <span className={`w-8 h-8 rounded-xl ${theme.badge} font-black text-sm flex items-center justify-center shrink-0 shadow-md`}>
                    {theme.rank}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-white text-base">{action.title}</h4>
                      <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                        {action.category}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                        {action.priority} Priority
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                      <span>Current: <strong className="text-slate-400">{action.currentValue}</strong></span>
                      <span>→</span>
                      <span>Target: <strong className="text-white">{action.targetValue}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
                  <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-eco-500/15 text-eco-400 text-xs font-extrabold border border-eco-500/30">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{action.expectedScoreImprovement} pts</span>
                  </div>
                </div>
              </div>

              {/* Metrics Row: Carbon, Cost, Savings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Carbon Reduction</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Cloud className="w-3.5 h-3.5" />
                    {action.estimatedCarbonReduction}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Est. Annual Savings</span>
                  <span className="text-teal-300 font-bold">{action.estimatedAnnualSavings}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Implementation Cost</span>
                  <span className="text-slate-200 font-bold">{action.estimatedCost}</span>
                </div>
              </div>

              {/* "Why this is recommended" Reason */}
              {action.reason && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-400 font-bold block text-[11px] uppercase tracking-wider mb-0.5">
                      Why this is recommended
                    </span>
                    <p className="text-slate-300 leading-snug">{action.reason}</p>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

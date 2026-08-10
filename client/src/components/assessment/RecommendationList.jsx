import React, { useState } from 'react';
import { Lightbulb, ArrowUpRight, ShieldAlert, Sparkles, DollarSign, Clock } from 'lucide-react';

export default function RecommendationList({ recommendations = [], onSimulateClick }) {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? recommendations
    : recommendations.filter(rec => rec.priority === filter);

  const priorityStyles = {
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Low: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Smart Actionable Upgrades</h3>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">
            {recommendations.length} total
          </span>
        </div>

        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          {['All', 'High', 'Medium', 'Low'].map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filter === p
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-8 bg-slate-900/40 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">No recommendations match the selected priority.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((rec, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 transition-all duration-200 border border-slate-800 hover:border-slate-700 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 text-eco-400 mt-0.5 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-base">{rec.title}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                          priorityStyles[rec.priority]
                        }`}
                      >
                        {rec.priority} Priority
                      </span>
                      <span className="text-xs text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded-md">
                        {rec.category}
                      </span>
                      {rec.roadmapTier && (
                        <span className="text-[10px] text-teal-300 font-semibold bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                          {rec.roadmapTier}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {rec.potentialScoreIncrease && (
                    <div className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-eco-500/15 text-eco-400 text-xs font-extrabold border border-eco-500/30">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+{rec.potentialScoreIncrease} pts</span>
                    </div>
                  )}

                  {onSimulateClick && (
                    <button
                      onClick={() => onSimulateClick(rec)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                    >
                      Simulate
                    </button>
                  )}
                </div>
              </div>

              {/* Rich Details Grid: Action, Environmental Benefit, Cost */}
              {(rec.currentCondition || rec.recommendedAction || rec.environmentalBenefit) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  {rec.currentCondition && (
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Current State</span>
                      <span className="text-slate-300 font-medium">{rec.currentCondition}</span>
                    </div>
                  )}

                  {rec.recommendedAction && (
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <span className="text-[10px] uppercase font-bold text-eco-400 block mb-0.5">Recommended Action</span>
                      <span className="text-white font-semibold">{rec.recommendedAction}</span>
                    </div>
                  )}

                  {rec.environmentalBenefit && (
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-0.5">Environmental Benefit</span>
                      <span className="text-cyan-200 font-medium">{rec.environmentalBenefit}</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

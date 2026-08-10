import React from 'react';
import { Zap, Clock, ShieldAlert, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function ImprovementRoadmap({ recommendations = [] }) {
  const tiers = [
    {
      key: 'Quick Wins',
      title: 'Quick Wins (0 - 3 Months)',
      desc: 'Low effort & cost; immediate energy & score uplifts',
      color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: Zap
    },
    {
      key: 'Medium Term',
      title: 'Medium Term (3 - 12 Months)',
      desc: 'Moderate investment & procedural upgrades',
      color: 'border-teal-500/40 bg-teal-500/5 text-teal-300',
      badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
      icon: Clock
    },
    {
      key: 'Long Term',
      title: 'Long Term (1 - 3 Years)',
      desc: 'Major capital investments & infrastructure overhauls',
      color: 'border-purple-500/40 bg-purple-500/5 text-purple-300',
      badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      icon: ShieldAlert
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-eco-400" />
            Sustainability Improvement Roadmap
          </h3>
          <p className="text-xs text-slate-400">
            Sequential implementation timeline categorized by difficulty, capital commitment, and impact.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const TierIcon = tier.icon;
          const items = recommendations.filter(
            r => r.roadmapTier === tier.key || (!r.roadmapTier && tier.key === 'Quick Wins')
          );

          return (
            <div
              key={tier.key}
              className={`rounded-2xl p-5 border ${tier.color} flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <TierIcon className="w-4 h-4" />
                    <h4 className="font-bold text-sm text-white">{tier.key}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.badge}`}>
                    {items.length} items
                  </span>
                </div>
                <p className="text-xs text-slate-400">{tier.desc}</p>

                {items.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500 italic">
                    No recommendations pending in this timeframe.
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-white text-xs leading-snug">
                            {item.title}
                          </span>
                          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-eco-500/10 text-eco-400 border border-eco-500/20 flex items-center gap-0.5">
                            <ArrowUpRight className="w-3 h-3" />
                            +{item.potentialScoreIncrease} pts
                          </span>
                        </div>

                        {item.recommendedAction && (
                          <p className="text-[11px] text-slate-300">
                            {item.recommendedAction}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                          <span>Difficulty: <strong className="text-slate-200">{item.implementationDifficulty || 'Low'}</strong></span>
                          {item.estimatedPaybackYears && (
                            <span className="text-teal-400 font-semibold">Payback: ~{item.estimatedPaybackYears} yrs</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

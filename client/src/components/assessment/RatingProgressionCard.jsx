import React from 'react';
import RatingBadge from '../common/RatingBadge';
import { Award, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';

export default function RatingProgressionCard({ score = 0, rating = 'Needs Improvement' }) {
  // Rating threshold tiers
  // 0-49 Needs Improvement -> Target 50 (Moderate)
  // 50-69 Moderate -> Target 70 (Good)
  // 70-84 Good -> Target 85 (Excellent)
  // 85-100 Excellent (Platinum Peak)

  let nextTier = 'Moderate';
  let targetScore = 50;

  if (score >= 85) {
    nextTier = 'Platinum Peak (Top 1%)';
    targetScore = 100;
  } else if (score >= 70) {
    nextTier = 'Excellent';
    targetScore = 85;
  } else if (score >= 50) {
    nextTier = 'Good';
    targetScore = 70;
  }

  const pointsNeeded = Math.max(0, targetScore - score);
  const progressPct = score >= 100 ? 100 : Math.min(100, Math.max(0, (score / targetScore) * 100));

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-eco-400" />
          <h4 className="font-bold text-white text-sm">Rating Progression & Status</h4>
        </div>
        <RatingBadge rating={rating} size="sm" />
      </div>

      {/* Progression Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-300">Current: <strong className="text-white text-sm">{score}</strong>/100</span>
          <span className="text-eco-400">Target Level: <strong className="text-white text-sm">{targetScore}</strong> ({nextTier})</span>
        </div>

        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-eco-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
          <span>Current Rating: <strong>{rating}</strong></span>
          {score < 85 ? (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Need +{pointsNeeded} pts to reach {nextTier}
            </span>
          ) : (
            <span className="text-emerald-400 font-bold">Top Rating Achieved!</span>
          )}
        </div>
      </div>
    </div>
  );
}

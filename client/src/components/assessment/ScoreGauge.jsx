import React from 'react';
import RatingBadge from '../common/RatingBadge';

export default function ScoreGauge({ score = 0, rating = 'Needs Improvement', size = 'normal' }) {
  // Semi-circle SVG parameters
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let strokeGradientId = 'score-gradient-needs-improvement';
  let scoreColorText = 'text-rose-400';

  if (score >= 85) {
    strokeGradientId = 'score-gradient-excellent';
    scoreColorText = 'text-emerald-400';
  } else if (score >= 70) {
    strokeGradientId = 'score-gradient-good';
    scoreColorText = 'text-teal-400';
  } else if (score >= 50) {
    strokeGradientId = 'score-gradient-moderate';
    scoreColorText = 'text-amber-400';
  }

  return (
    <div className="flex flex-col items-center justify-center relative p-4">
      <div className="relative w-56 h-36 flex items-center justify-center">
        <svg className="w-56 h-56 transform -rotate-90 overflow-visible" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="score-gradient-excellent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="score-gradient-good" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#2DD4BF" />
            </linearGradient>
            <linearGradient id="score-gradient-moderate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
            <linearGradient id="score-gradient-needs-improvement" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#F87171" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20,100 A 80,80 0 0,1 180,100"
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Animated Progress Arc */}
          <path
            d="M 20,100 A 80,80 0 0,1 180,100"
            fill="none"
            stroke={`url(#${strokeGradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Text */}
        <div className="absolute top-10 flex flex-col items-center">
          <span className={`text-5xl font-black tracking-tight ${scoreColorText}`}>
            {score}
          </span>
          <span className="text-xs uppercase font-semibold tracking-wider text-slate-400 mt-1">
            Out of 100
          </span>
        </div>
      </div>

      <div className="mt-2">
        <RatingBadge rating={rating} size="lg" />
      </div>
    </div>
  );
}

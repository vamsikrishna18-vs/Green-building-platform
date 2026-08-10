import React from 'react';
import { CATEGORIES_CONFIG } from '../../utils/constants';

export default function CategoryBarChart({ categoryScores = {} }) {
  return (
    <div className="space-y-4">
      {CATEGORIES_CONFIG.map(cat => {
        const score = categoryScores[cat.key] || 0;
        let barColor = 'bg-rose-500';
        if (score >= 80) barColor = 'bg-emerald-500';
        else if (score >= 65) barColor = 'bg-teal-500';
        else if (score >= 50) barColor = 'bg-amber-500';

        return (
          <div key={cat.key} className="space-y-1.5">
            <div className="flex justify-between items-center text-sm font-medium">
              <div className="flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-200">{cat.label}</span>
                <span className="text-xs text-slate-400">({cat.weight})</span>
              </div>
              <span className="font-bold text-white">{score} / 100</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} transition-all duration-700 ease-out rounded-full`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'eco' }) {
  const colorMap = {
    eco: 'bg-eco-500/10 text-eco-400 border-eco-500/20',
    teal: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  return (
    <div className="glass-card rounded-2xl p-5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.eco}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold tracking-tight text-white">
          {value}
        </span>
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 font-medium">{subtitle}</p>
      )}
    </div>
  );
}

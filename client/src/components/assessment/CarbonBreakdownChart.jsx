import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Cloud, ArrowDownRight, Sparkles } from 'lucide-react';

export default function CarbonBreakdownChart({ carbonData = {} }) {
  const data = [
    { name: 'Solar PV Generation', value: 42, color: '#10b981' },
    { name: 'VRF Heat Pump HVAC', value: 25, color: '#14b8a6' },
    { name: 'Smart LED Retrofit', value: 18, color: '#06b6d4' },
    { name: 'Water & Waste Diversion', value: 15, color: '#f59e0b' }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-emerald-400" />
            Carbon Reduction Contribution Share
          </h3>
          <p className="text-xs text-slate-400">Proportional breakdown of upgrades driving carbon footprint reduction.</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Total Target -38%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
                formatter={(val) => [`${val}% Contribution`, 'Reduction Share']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-semibold text-slate-200">{item.name}</span>
              </div>
              <span className="font-extrabold text-white text-sm">{item.value}%</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

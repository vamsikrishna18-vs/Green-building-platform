import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Cloud, TrendingDown, Users, Maximize2, ShieldAlert } from 'lucide-react';

export default function CarbonFootprintCard({ carbonFootprint = {} }) {
  const {
    totalCurrentCO2e = 0,
    projectedCO2e = 0,
    potentialCO2Reduction = 0,
    co2PerSqFtKg = 0,
    co2PerOccupantMT = 0,
    breakdown = {}
  } = carbonFootprint;

  const chartData = [
    { name: 'Current Emissions', emissions: totalCurrentCO2e, color: '#ef4444' },
    { name: 'Projected Target', emissions: projectedCO2e, color: '#10b981' }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-1">
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scope 1, 2 & 3 Emissions Profile</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            Annual Carbon Footprint Estimation
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Approximate greenhouse gas emissions benchmarked per GHG protocol standard.
          </p>
        </div>

        <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-medium flex items-center gap-1.5 shrink-0">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Calculations labeled as approximate estimates</span>
        </div>
      </div>

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Current Carbon Footprint
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-white">{totalCurrentCO2e}</span>
            <span className="text-xs font-semibold text-slate-400">MT CO2e/yr</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Baseline operational emissions</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Projected Footprint Target
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-emerald-400">{projectedCO2e}</span>
            <span className="text-xs font-semibold text-slate-400">MT CO2e/yr</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Potential Reduction: {potentialCO2Reduction} MT/yr</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Normalized Carbon Intensity
          </span>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Per Sq Ft:</span>
              <span className="text-white font-bold">{co2PerSqFtKg} kg/sqft/yr</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Per Occupant:</span>
              <span className="text-teal-300 font-bold">{co2PerOccupantMT} MT/person/yr</span>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Chart Comparison */}
      <div className="pt-2">
        <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">
          Current vs Projected Carbon Footprint (MT CO2e / year)
        </h4>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="emissions" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

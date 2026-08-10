import React from 'react';
import { Leaf, Zap, Droplets, Recycle, TreePine, Cloud, ShieldAlert } from 'lucide-react';

export default function EnvironmentalImpactCard({ carbonFootprint = {}, energySavedKWh = 85000, waterSavedGallons = 350000 }) {
  const {
    totalCurrentCO2e = 180,
    projectedCO2e = 110,
    potentialCO2Reduction = 70
  } = carbonFootprint;

  // Conversion: ~45 mature trees planted per Metric Ton of CO2 reduced annually
  const treesEquiv = Math.round(potentialCO2Reduction * 45);
  const wasteDivertedTons = Number((potentialCO2Reduction * 0.25).toFixed(1));

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1">
            <Leaf className="w-3.5 h-3.5" />
            <span>Tangible Environmental Metrics</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Environmental Impact Equivalencies
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Translating sustainability performance into real-world environmental savings.
          </p>
        </div>

        <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-medium flex items-center gap-1.5 shrink-0">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>APPROXIMATE ESTIMATES</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* CO2 Savings */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Annual CO2 Reduction</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Cloud className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">{potentialCO2Reduction} <span className="text-xs text-slate-400 font-medium">MT/yr</span></div>
          <span className="text-[11px] text-slate-400 block">Scope 1 & 2 carbon avoided</span>
        </div>

        {/* Trees Planted */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Equivalent Trees Planted</span>
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
              <TreePine className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-teal-300">{treesEquiv.toLocaleString()} <span className="text-xs text-slate-400 font-medium">Trees</span></div>
          <span className="text-[11px] text-slate-400 block">Carbon absorption equivalent</span>
        </div>

        {/* Water Saved */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Annual Water Saved</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-cyan-400">{waterSavedGallons.toLocaleString()} <span className="text-xs text-slate-400 font-medium">gal/yr</span></div>
          <span className="text-[11px] text-slate-400 block">Potable municipal water preserved</span>
        </div>

        {/* Waste Diverted */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Waste Diverted</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400">{wasteDivertedTons} <span className="text-xs text-slate-400 font-medium">Tons/yr</span></div>
          <span className="text-[11px] text-slate-400 block">Diverted away from municipal landfills</span>
        </div>

      </div>

      {/* Current vs Projected Impact Row */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          CURRENT IMPACT vs PROJECTED IMPACT
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Current Emissions Profile:</span>
            <span className="text-rose-400 text-sm font-bold">{totalCurrentCO2e} MT CO2e/yr</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Projected Post-Upgrade Target:</span>
            <span className="text-emerald-400 text-sm font-bold">{projectedCO2e} MT CO2e/yr</span>
          </div>
        </div>
      </div>

    </div>
  );
}

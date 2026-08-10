import React from 'react';
import { Award, TrendingUp, TrendingDown, Minus, Building2, ShieldCheck } from 'lucide-react';

export default function BenchmarkingCard({ benchmarks = {} }) {
  const {
    targetScore = 78,
    buildingType = 'Commercial',
    typeBenchmarkAverage = 71,
    userAverageScore = 72,
    bestProjectScore = 88,
    varianceFromTypeAverage = '+7',
    benchmarkStatus = 'Above Average'
  } = benchmarks;

  const statusStyles = {
    'Above Average': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 icon:TrendingUp',
    'Average': 'bg-teal-500/15 text-teal-300 border-teal-500/30 icon:Minus',
    'Below Average': 'bg-rose-500/15 text-rose-400 border-rose-500/30 icon:TrendingDown'
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Peer & Sector Benchmarking</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Sustainability Benchmark Position
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Benchmarked against regional {buildingType} building averages & user portfolio metrics.
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full border text-xs font-extrabold flex items-center gap-1.5 ${
          statusStyles[benchmarkStatus] || statusStyles['Above Average']
        }`}>
          <ShieldCheck className="w-4 h-4" />
          <span>{benchmarkStatus}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Your Score</span>
          <div className="text-3xl font-black text-white">{targetScore}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Current Project</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{buildingType} Average</span>
          <div className="text-3xl font-black text-teal-400">{typeBenchmarkAverage}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Industry Sector Target</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Variance</span>
          <div className={`text-3xl font-black ${
            Number(varianceFromTypeAverage) >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {varianceFromTypeAverage} pts
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">vs Sector Average</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Portfolio Peak</span>
          <div className="text-3xl font-black text-amber-400">{bestProjectScore}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Your Best Project</span>
        </div>

      </div>

    </div>
  );
}

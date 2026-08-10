import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from '../services/auth';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Clock,
  Cloud,
  ShieldAlert,
  Sliders,
  CheckSquare,
  Square,
  Sparkles,
  Loader2,
  BarChart3,
  HelpCircle
} from 'lucide-react';

export default function RoiCalculatorPage() {
  const [upgrades, setUpgrades] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Financial Assumptions State
  const [areaSqFt, setAreaSqFt] = useState(85000);
  const [elecRate, setElecRate] = useState(0.15); // $/kWh
  const [waterRate, setWaterRate] = useState(8.50); // $/1k gal
  const [maintPct, setMaintPct] = useState(2.0); // %

  useEffect(() => {
    recalculateRoi();
  }, [areaSqFt, elecRate, waterRate, maintPct]);

  const recalculateRoi = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/assessments/roi-calculator'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          assumptions: {
            areaSqFt,
            elecRate,
            waterRate,
            maintPct
          }
        })
      });

      if (res.ok) {
        const json = await res.json();
        const list = json.data?.upgrades || [];
        setUpgrades(list);
        if (selectedIds.length === 0 && list.length > 0) {
          // Default select top 4 ROI upgrades
          setSelectedIds(list.slice(0, 4).map(u => u.id));
        }
      }
    } catch (err) {
      console.error('Error calculating ROI:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUpgrade = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectedUpgrades = upgrades.filter(u => selectedIds.includes(u.id));

  // Portfolio aggregates
  const totalCost = selectedUpgrades.reduce((sum, u) => sum + (u.estimatedCostNumber || 0), 0);
  const totalAnnualSavings = selectedUpgrades.reduce((sum, u) => sum + (u.annualSavingsNumber || 0), 0);
  const totalCarbonReduction = selectedUpgrades.reduce((sum, u) => sum + (u.carbonReductionMT || 0), 0);
  const portfolioPaybackYears = totalAnnualSavings > 0 ? Number((totalCost / totalAnnualSavings).toFixed(1)) : 0;
  const total5YrNetReturn = selectedUpgrades.reduce((sum, u) => sum + (u.fiveYearReturn || 0), 0);
  const total10YrNetReturn = selectedUpgrades.reduce((sum, u) => sum + (u.tenYearReturn || 0), 0);

  // Chart data
  const chartData = selectedUpgrades.map(u => ({
    name: u.name.split(' ')[0] + ' ' + (u.name.split(' ')[1] || ''),
    cost: u.estimatedCostNumber,
    fiveYearReturn: u.fiveYearReturn,
    tenYearReturn: u.tenYearReturn
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="panel-accent border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Financial Analysis & Capital Planning Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cost & ROI Financial Calculator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Simulate capex investment, annual operational savings, 5-year/10-year net financial returns, and payback timelines.
          </p>
        </div>

        <div className="badge-saas-warning flex items-center gap-1.5 shrink-0">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Financial outputs labeled as ESTIMATES</span>
        </div>
      </div>

      {/* Financial Assumptions Control Panel with Tooltips */}
      <div className="panel-elevated space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="badge-saas-info mb-1">
              FINANCIAL ASSUMPTIONS
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-eco-400" />
              Configurable Financial & Building Parameters
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Interactive Sliders</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          
          {/* Floor Area */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300 flex items-center gap-1">
                Total Floor Area
                <HelpCircle className="w-3 h-3 text-slate-500 cursor-help" title="Gross building floor area used to scale retrofit installation costs." />
              </span>
              <span className="text-eco-400 font-bold">{areaSqFt.toLocaleString()} sq ft</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(Number(e.target.value))}
              className="w-full accent-eco-500 cursor-pointer"
            />
          </div>

          {/* Electricity Rate */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300 flex items-center gap-1">
                Electricity Tariff Rate
                <HelpCircle className="w-3 h-3 text-slate-500 cursor-help" title="Commercial electricity grid cost per kilowatt-hour." />
              </span>
              <span className="text-teal-300 font-bold">${elecRate.toFixed(2)} / kWh</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.45"
              step="0.01"
              value={elecRate}
              onChange={(e) => setElecRate(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>

          {/* Water Rate */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300 flex items-center gap-1">
                Water Tariff Rate
                <HelpCircle className="w-3 h-3 text-slate-500 cursor-help" title="Municipal utility water tariff rate per 1,000 gallons." />
              </span>
              <span className="text-cyan-400 font-bold">${waterRate.toFixed(2)} / 1k gal</span>
            </div>
            <input
              type="range"
              min="2.00"
              max="20.00"
              step="0.50"
              value={waterRate}
              onChange={(e) => setWaterRate(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Maintenance % */}
          <div className="space-y-2">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300 flex items-center gap-1">
                Annual Maintenance
                <HelpCircle className="w-3 h-3 text-slate-500 cursor-help" title="Estimated annual equipment maintenance cost as a percentage of initial capex." />
              </span>
              <span className="text-amber-400 font-bold">{maintPct.toFixed(1)}% of Capex</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={maintPct}
              onChange={(e) => setMaintPct(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Portfolio Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Est. Capex Investment</span>
          <div className="text-3xl font-black text-white">${totalCost.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500 block">{selectedUpgrades.length} upgrades selected</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Annual Financial Savings</span>
          <div className="text-3xl font-black text-emerald-400">${totalAnnualSavings.toLocaleString()}<span className="text-xs text-slate-400 font-normal">/yr</span></div>
          <span className="text-[11px] text-emerald-400 font-semibold block">Operational cost reduction</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Portfolio Payback Period</span>
          <div className="text-3xl font-black text-teal-300">{portfolioPaybackYears} <span className="text-xs text-slate-400 font-normal">years</span></div>
          <span className="text-[11px] text-slate-500 block">Breakeven timeline</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">10-Year Est. Net Financial Return</span>
          <div className="text-3xl font-black text-cyan-300">${total10YrNetReturn.toLocaleString()}</div>
          <span className="text-[11px] text-cyan-400 font-semibold block">5-Yr Net: ${total5YrNetReturn.toLocaleString()}</span>
        </div>

      </div>

      {/* Upgrade Selection Grid & Recharts Bar Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upgrade Selection List */}
        <div className="lg:col-span-7 panel-elevated space-y-4">
          <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Select Clean Tech Retrofits</span>
            <span className="text-xs text-slate-400 font-normal">{selectedIds.length} Selected</span>
          </h3>

          <div className="space-y-3">
            {upgrades.map((u) => {
              const isSelected = selectedIds.includes(u.id);
              return (
                <div
                  key={u.id}
                  onClick={() => toggleUpgrade(u.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-900 border-eco-500/40 shadow-sm'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 text-eco-400">
                      {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-600" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{u.name}</span>
                        <span className="badge-saas-neutral">{u.category}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>Capex: <strong className="text-white">{u.costRange}</strong></span>
                        <span>•</span>
                        <span>Savings: <strong className="text-emerald-400">{u.estimatedAnnualSavings}</strong></span>
                        <span>•</span>
                        <span>Payback: <strong className="text-teal-300">{u.paybackYears} yrs</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-cyan-300 block">+{u.expectedScoreGain} pts</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{u.roiPercent}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recharts Bar Chart Visual */}
        <div className="lg:col-span-5 panel-elevated space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>5-Year vs 10-Year Net Financial Return</span>
            <BarChart3 className="w-4 h-4 text-eco-400" />
          </h3>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
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
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="fiveYearReturn" name="5-Year Net Return" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tenYearReturn" name="10-Year Net Return" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

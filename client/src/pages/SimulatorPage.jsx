import React, { useState, useEffect } from 'react';
import ScoreGauge from '../components/assessment/ScoreGauge';
import CategoryRadarChart from '../components/assessment/CategoryRadarChart';
import RatingBadge from '../components/common/RatingBadge';
import ScenarioComparisonTable from '../components/assessment/ScenarioComparisonTable';
import { simulateAssessment, createAssessment } from '../services/api';
import { INITIAL_FORM_DATA } from '../utils/constants';
import {
  Sliders,
  Sparkles,
  Zap,
  Droplets,
  Sun,
  Recycle,
  Leaf,
  ArrowRight,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  BookmarkPlus,
  DollarSign,
  Cloud,
  Layers,
  Award
} from 'lucide-react';

export default function SimulatorPage({ initialData, setActiveTab, setSelectedAssessmentId }) {
  const [formData, setFormData] = useState(initialData || INITIAL_FORM_DATA);
  const [simResults, setSimResults] = useState(initialData?.scores ? { scores: initialData.scores } : null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeScenarioName, setActiveScenarioName] = useState('Scenario 1');

  const [savedScenarios, setSavedScenarios] = useState([
    {
      id: 'sc_solar_only',
      name: 'Scenario A: Solar PV Array Only',
      overallScore: 72,
      scoreDiff: 14,
      estimatedCost: '$45,000',
      annualSavings: '$8,200/yr',
      paybackYears: 5.5,
      carbonReduction: 45.0
    },
    {
      id: 'sc_full_eco',
      name: 'Scenario B: Solar + LED + Heat Pump HVAC',
      overallScore: 84,
      scoreDiff: 26,
      estimatedCost: '$75,000',
      annualSavings: '$18,500/yr',
      paybackYears: 4.0,
      carbonReduction: 120.2
    }
  ]);

  useEffect(() => {
    runSimulation(formData);
  }, [formData]);

  const runSimulation = async (currentData) => {
    setLoading(true);
    try {
      const res = await simulateAssessment(currentData);
      setSimResults(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSimField = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleApplyRecommendedUpgrades = () => {
    setFormData(prev => ({
      ...prev,
      energyUsage: {
        ...prev.energyUsage,
        ledLightingPercent: 100,
        hvacEfficiencyRating: 5,
        smartThermostats: true
      },
      renewableEnergy: {
        ...prev.renewableEnergy,
        solarCapacityKW: 200,
        renewableEnergyPercent: 75,
        batteryStorageKWh: 50
      },
      waterConsumption: {
        ...prev.waterConsumption,
        lowFlowFixtures: true,
        rainwaterHarvesting: true
      },
      materials: {
        ...prev.materials,
        recycledContentPercent: 60
      },
      wasteManagement: {
        ...prev.wasteManagement,
        constructionWasteRecycledPercent: 90,
        operationalWasteSegregated: true
      },
      greenFeatures: {
        ...prev.greenFeatures,
        smartBuildingManagementSystem: true,
        evChargingStations: 8
      }
    }));
  };

  const handleSaveScenario = () => {
    const name = prompt('Enter scenario name:', activeScenarioName);
    if (!name) return;

    const newScenario = {
      id: 'sc_' + Date.now(),
      name,
      overallScore: currentScore,
      scoreDiff: Math.max(0, scoreDiff),
      estimatedCost: '$35,000 - $65,000',
      annualSavings: '$12,500/yr',
      paybackYears: 3.8,
      carbonReduction: carbonData.potentialCO2Reduction || 55.0
    };

    setSavedScenarios(prev => [...prev, newScenario]);
    setActiveScenarioName(name);
    alert(`"${name}" saved to comparison matrix!`);
  };

  const handleReset = () => {
    setFormData(initialData || INITIAL_FORM_DATA);
  };

  const handleSaveUpgraded = async () => {
    setSaving(true);
    try {
      const { _id, id, createdAt, updatedAt, ...cleanFormData } = formData;

      const savedData = {
        ...cleanFormData,
        buildingInfo: {
          ...cleanFormData.buildingInfo,
          name: `${cleanFormData.buildingInfo?.name || 'Building'} (Simulated Upgrade)`
        }
      };

      const result = await createAssessment(savedData);
      setSelectedAssessmentId(result._id);
      setActiveTab('report');
    } catch (err) {
      console.error('Error saving upgraded assessment:', err);
      alert(`Error saving assessment: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const originalScore = initialData?.scores?.overallScore || 50;
  const currentScore = simResults?.data?.scores?.overallScore || simResults?.scores?.overallScore || 0;
  const rating = simResults?.data?.scores?.rating || simResults?.scores?.rating || 'Good';
  const scoreDiff = currentScore - originalScore;
  const carbonData = simResults?.data?.scores?.carbonFootprint || simResults?.scores?.carbonFootprint || {};
  const categoryScores = simResults?.data?.scores?.categoryScores || simResults?.scores?.categoryScores || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* SIMULATOR PAGE HEADER */}
      <div className="panel-accent border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Decision Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sustainability Improvement Simulator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Simulate sustainable upgrades and see their real-time impact on your building's performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleApplyRecommendedUpgrades}
            className="btn-saas-outline"
          >
            <CheckCircle2 className="w-4 h-4 text-eco-400" />
            <span>Apply Recommended</span>
          </button>

          <button
            onClick={handleReset}
            className="btn-saas-ghost"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>

          <button
            onClick={handleSaveScenario}
            className="btn-saas-secondary"
          >
            <BookmarkPlus className="w-4 h-4 text-teal-400" />
            <span>Save Scenario</span>
          </button>

          <button
            onClick={handleSaveUpgraded}
            disabled={saving}
            className="btn-saas-primary"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Upgraded Project</span>
          </button>
        </div>
      </div>

      {/* RESPONSIVE TWO-COLUMN LAYOUT: Left (30-32% width), Right (68-70% width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (32% width - 4 cols): UPGRADE LEVERS & CONTROLS */}
        <div className="lg:col-span-4 panel-elevated space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>1. Upgrade Levers</span>
              <span className="badge-saas-neutral text-[10px]">6 Categories</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Adjust sliders to see live impact</p>
          </div>

          {/* 6 Upgrade Categories */}
          <div className="space-y-5 text-xs">
            
            {/* 1. Renewable Energy */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between font-bold">
                <span className="text-white flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" /> Renewable Energy
                </span>
                <span className="text-eco-400 font-extrabold">{formData.renewableEnergy.renewableEnergyPercent}%</span>
              </div>
              <p className="text-[11px] text-slate-400">Solar, Wind, Green Power</p>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.renewableEnergy.renewableEnergyPercent}
                onChange={(e) => updateSimField('renewableEnergy', 'renewableEnergyPercent', Number(e.target.value))}
                className="w-full accent-eco-500 cursor-pointer mt-1"
              />
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>Solar PV: {formData.renewableEnergy.solarCapacityKW} kW</span>
                <span>Target: 100%</span>
              </div>
            </div>

            {/* 2. Energy Efficiency */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between font-bold">
                <span className="text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" /> Energy Efficiency
                </span>
                <span className="text-eco-400 font-extrabold">{formData.energyUsage.ledLightingPercent}%</span>
              </div>
              <p className="text-[11px] text-slate-400">HVAC, Lighting, Insulation</p>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.energyUsage.ledLightingPercent}
                onChange={(e) => updateSimField('energyUsage', 'ledLightingPercent', Number(e.target.value))}
                className="w-full accent-eco-500 cursor-pointer mt-1"
              />
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>LED Coverage: {formData.energyUsage.ledLightingPercent}%</span>
                <span>HVAC: {formData.energyUsage.hvacEfficiencyRating} Stars</span>
              </div>
            </div>

            {/* 3. Water Efficiency */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between font-bold">
                <span className="text-white flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" /> Water Efficiency
                </span>
                <span className="text-eco-400 font-extrabold">
                  {formData.waterConsumption.lowFlowFixtures ? '85%' : '40%'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Fixtures, Recycling, Rainwater</p>
              <div className="flex items-center space-x-4 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.waterConsumption.lowFlowFixtures}
                    onChange={(e) => updateSimField('waterConsumption', 'lowFlowFixtures', e.target.checked)}
                    className="w-4 h-4 text-eco-500 rounded"
                  />
                  <span className="text-slate-300">Low-Flow Fixtures</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.waterConsumption.rainwaterHarvesting}
                    onChange={(e) => updateSimField('waterConsumption', 'rainwaterHarvesting', e.target.checked)}
                    className="w-4 h-4 text-eco-500 rounded"
                  />
                  <span className="text-slate-300">Rainwater</span>
                </label>
              </div>
            </div>

            {/* 4. Sustainable Materials */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between font-bold">
                <span className="text-white flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-teal-400" /> Sustainable Materials
                </span>
                <span className="text-eco-400 font-extrabold">{formData.materials?.recycledContentPercent || 45}%</span>
              </div>
              <p className="text-[11px] text-slate-400">Low-carbon, Recycled Content</p>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.materials?.recycledContentPercent || 45}
                onChange={(e) => updateSimField('materials', 'recycledContentPercent', Number(e.target.value))}
                className="w-full accent-eco-500 cursor-pointer mt-1"
              />
            </div>

            {/* 5. Waste Management */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between font-bold">
                <span className="text-white flex items-center gap-1.5">
                  <Recycle className="w-4 h-4 text-amber-400" /> Waste Management
                </span>
                <span className="text-eco-400 font-extrabold">{formData.wasteManagement.constructionWasteRecycledPercent}%</span>
              </div>
              <p className="text-[11px] text-slate-400">Recycle, Compost, Reduce</p>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.wasteManagement.constructionWasteRecycledPercent}
                onChange={(e) => updateSimField('wasteManagement', 'constructionWasteRecycledPercent', Number(e.target.value))}
                className="w-full accent-eco-500 cursor-pointer mt-1"
              />
            </div>

            {/* 6. Green Features */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between font-bold">
                <span className="text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Green Features
                </span>
                <span className="text-eco-400 font-extrabold">
                  {formData.greenFeatures.smartBuildingManagementSystem ? 'IoT BMS Active' : 'Standard'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Green Roof, EV, Biodiversity</p>
              <div className="flex items-center space-x-4 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.greenFeatures.smartBuildingManagementSystem}
                    onChange={(e) => updateSimField('greenFeatures', 'smartBuildingManagementSystem', e.target.checked)}
                    className="w-4 h-4 text-eco-500 rounded"
                  />
                  <span className="text-slate-300">Smart IoT BMS</span>
                </label>
              </div>
            </div>

          </div>

          {/* ACTIVE SCENARIO CARD */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Scenario</span>
              <span className="font-bold text-white text-xs flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-eco-400" /> {activeScenarioName}
              </span>
            </div>
            <button
              onClick={handleSaveScenario}
              className="btn-saas-outline text-xs px-3 py-1"
            >
              Save Scenario
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN (68% width - 8 cols): LIVE SUSTAINABILITY RESULTS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section Header */}
          <div className="panel-elevated flex items-center justify-between">
            <div>
              <span className="badge-saas-info mb-1">REAL-TIME IMPACT EVALUATION</span>
              <h2 className="text-lg font-bold text-white">2. Live Sustainability Results</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time score and environmental footprint calculated based on selected upgrades</p>
            </div>
            <RatingBadge rating={rating} size="md" />
          </div>

          {/* 4 Summary Impact Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Live Score */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Simulated Score</span>
              <div className="text-3xl font-black text-white">{currentScore}<span className="text-xs text-slate-500 font-normal">/100</span></div>
              <span className="badge-saas-success text-[10px]">+{scoreDiff} pts gain</span>
            </div>

            {/* Score Uplift */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Baseline Score</span>
              <div className="text-2xl font-bold text-slate-300">{originalScore} <span className="text-xs text-slate-500 font-normal">/100</span></div>
              <span className="text-[11px] text-eco-400 font-semibold block">+{Math.max(0, scoreDiff)} pts improvement</span>
            </div>

            {/* Carbon Reduction */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-emerald-400" /> Carbon Reduction
              </span>
              <div className="text-xl font-bold text-emerald-400">-{carbonData.potentialCO2Reduction || 55.0} MT/yr</div>
              <span className="text-[11px] text-slate-400 block">~38% emission decrease</span>
            </div>

            {/* Operational Savings */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-teal-400" /> Annual Savings
              </span>
              <div className="text-xl font-bold text-teal-300">$18,500/yr</div>
              <span className="text-[11px] text-slate-400 block">~3.8 year payback</span>
            </div>

          </div>

          {/* Visual Intelligence Split: Score Gauge & Category Radar Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Score Gauge */}
            <div className="panel-elevated text-center flex flex-col items-center justify-center p-6 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Circular Score Gauge</span>
              <ScoreGauge score={currentScore} rating={rating} />
              <span className="text-xs text-slate-400 font-medium">Calculated based on LEED & BREEAM weightings</span>
            </div>

            {/* Category Radar Profile */}
            <div className="panel-elevated flex flex-col justify-between p-6">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Category Radar Footprint</span>
                <CategoryRadarChart categoryScores={categoryScores} />
              </div>
            </div>

          </div>

          {/* Multi-Scenario Decision Matrix Table */}
          <ScenarioComparisonTable scenarios={savedScenarios} />

        </div>

      </div>

    </div>
  );
}

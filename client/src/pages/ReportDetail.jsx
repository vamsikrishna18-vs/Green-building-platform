import React, { useState, useEffect } from 'react';
import ScoreGauge from '../components/assessment/ScoreGauge';
import CategoryRadarChart from '../components/assessment/CategoryRadarChart';
import CategoryBarChart from '../components/assessment/CategoryBarChart';
import RecommendationList from '../components/assessment/RecommendationList';
import CarbonFootprintCard from '../components/assessment/CarbonFootprintCard';
import ImprovementRoadmap from '../components/assessment/ImprovementRoadmap';
import BadgeCard from '../components/assessment/BadgeCard';
import Top3ActionsCard from '../components/assessment/Top3ActionsCard';
import EnvironmentalImpactCard from '../components/assessment/EnvironmentalImpactCard';
import CarbonBreakdownChart from '../components/assessment/CarbonBreakdownChart';
import BenchmarkingCard from '../components/assessment/BenchmarkingCard';

import { fetchAssessmentById, fetchBenchmarks } from '../services/api';
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Maximize2,
  ArrowLeft,
  Printer,
  Sliders,
  Sparkles,
  Loader2,
  Share2,
  Zap,
  Droplets
} from 'lucide-react';

export default function ReportDetail({ assessmentId, assessmentData, setActiveTab, setSelectedSimData }) {
  const [data, setData] = useState(assessmentData || null);
  const [benchmarks, setBenchmarks] = useState(null);
  const [loading, setLoading] = useState(!assessmentData);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!data && assessmentId) {
      loadReport();
    } else if (data) {
      loadBenchmarks(data._id);
    }
  }, [assessmentId, data]);

  const loadReport = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAssessmentById(assessmentId);
      setData(res);
      loadBenchmarks(res._id);
    } catch (err) {
      setError(err.message || 'Failed to load assessment report.');
    } finally {
      setLoading(false);
    }
  };

  const loadBenchmarks = async (id) => {
    try {
      const bm = await fetchBenchmarks(id);
      setBenchmarks(bm);
    } catch (err) {
      console.error('Error loading report benchmarks:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-eco-400 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Generating Sustainability Audit Report...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center glass-panel rounded-3xl space-y-4 max-w-lg mx-auto my-12">
        <p className="text-rose-400 text-base font-semibold">{error || 'Report not found.'}</p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { buildingInfo, scores, recommendations, top3RecommendedActions } = data;
  const categoryScores = scores?.categoryScores || {};
  const carbonFootprint = scores?.carbonFootprint || {};

  return (
    <div className="space-y-8 animate-fadeIn printable-report">

      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Report link copied to clipboard!');
              }
            }}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4 text-teal-400" />
            <span>Share Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Export / Print PDF Report</span>
          </button>

          <button
            onClick={() => {
              setSelectedSimData(data);
              setActiveTab('simulator');
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-eco-500 to-teal-400 hover:from-eco-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold shadow-glow-emerald transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Simulate Improvements</span>
          </button>
        </div>
      </div>

      {/* Phase 3 Feature 7: Sustainability Badge */}
      <BadgeCard score={scores?.overallScore || 0} rating={scores?.rating} assessmentData={data} />

      {/* Main Report Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Building Information Meta */}
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official GreenBuild Sustainability Audit Report</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {buildingInfo?.name || 'Unnamed Building'}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                <div className="flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-eco-400" />
                  <span>{buildingInfo?.buildingType}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>{buildingInfo?.location || 'Unspecified'}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Year Built: {buildingInfo?.constructionYear}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Area</span>
                <span className="text-sm font-bold text-white">
                  {buildingInfo?.totalAreaSqFt?.toLocaleString()} sq ft
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Occupants</span>
                <span className="text-sm font-bold text-white">
                  {buildingInfo?.numOccupants?.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Energy Intensity</span>
                <span className="text-sm font-bold text-eco-400">
                  {scores?.metrics?.eui || 0} <span className="text-[10px] font-normal text-slate-400">kWh/sqft</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Water / Person</span>
                <span className="text-sm font-bold text-cyan-400">
                  {scores?.metrics?.waterPerOcc || 0} <span className="text-[10px] font-normal text-slate-400">gal/yr</span>
                </span>
              </div>
            </div>

          </div>

          {/* Score Gauge Visual */}
          <div className="shrink-0 flex flex-col items-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-inner">
            <span className="text-xs uppercase font-semibold text-slate-400 mb-2">Overall Sustainability Score</span>
            <ScoreGauge score={scores?.overallScore || 0} rating={scores?.rating} />
          </div>

        </div>
      </div>

      {/* Phase 3 Feature 2: Top 3 Recommended Actions */}
      <Top3ActionsCard top3Actions={top3RecommendedActions} />

      {/* Phase 3 Feature 3: Benchmarking Card */}
      {benchmarks && <BenchmarkingCard benchmarks={benchmarks} />}

      {/* Phase 3 Feature 4: Environmental Impact Equivalencies */}
      <EnvironmentalImpactCard carbonFootprint={carbonFootprint} />

      {/* Category Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Category Radar Footprint</h3>
          <CategoryRadarChart categoryScores={categoryScores} />
        </div>

        {/* Phase 3 Feature 5: Carbon Reduction Breakdown */}
        <CarbonBreakdownChart carbonData={carbonFootprint} />
      </div>

      {/* Feature 3: Carbon Footprint Baseline Card */}
      <CarbonFootprintCard carbonFootprint={carbonFootprint} />

      {/* Feature 2: Improvement Roadmap */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
        <ImprovementRoadmap recommendations={recommendations} />
      </div>

      {/* Feature 1: Recommendations Engine Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800">
        <RecommendationList
          recommendations={recommendations}
          onSimulateClick={() => {
            setSelectedSimData(data);
            setActiveTab('simulator');
          }}
        />
      </div>

    </div>
  );
}

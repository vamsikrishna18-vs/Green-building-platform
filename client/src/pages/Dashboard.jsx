import React, { useState, useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import RatingBadge from '../components/common/RatingBadge';
import CategoryRadarChart from '../components/assessment/CategoryRadarChart';
import CategoryBarChart from '../components/assessment/CategoryBarChart';
import QuickActions from '../components/dashboard/QuickActions';
import { fetchAnalytics, fetchAssessments } from '../services/api';
import {
  Building2,
  Award,
  TrendingUp,
  FileCheck2,
  Plus,
  ArrowRight,
  Loader2,
  Sparkles,
  Sliders,
  Sun,
  Cloud,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  Info
} from 'lucide-react';

export default function Dashboard({ setActiveTab, setSelectedAssessmentId, setSelectedSimData, onOpenAiModal }) {
  const [analytics, setAnalytics] = useState(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsData, list] = await Promise.all([
        fetchAnalytics(),
        fetchAssessments({ limit: 5 })
      ]);
      setAnalytics(analyticsData);
      setRecentAssessments(list);
    } catch (err) {
      console.error('Error loading dashboard analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-eco-400 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Executive Sustainability Dashboard...</p>
      </div>
    );
  }

  const categoryAverages = analytics?.categoryAverages || {
    energy: 65,
    water: 70,
    materials: 60,
    waste: 75,
    renewable: 55,
    greenFeatures: 68
  };

  const projectsNeedingAttention = analytics?.projectsNeedingImprovement || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Executive Header */}
      <div className="panel-accent border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Green Building Decision Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Executive Sustainability Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            Portfolio performance benchmarks, carbon reduction targets, and high-impact decarbonization opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('new-assessment')}
            className="btn-saas-primary"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Assess New Building</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className="btn-saas-secondary"
          >
            <Sliders className="w-4 h-4 text-eco-400" />
            <span>Score Simulator</span>
          </button>
        </div>
      </div>

      {/* High-Level Executive KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Average Sustainability Score"
          value={`${analytics?.averageScore || 0}/100`}
          subtitle="Cross-category portfolio average"
          icon={Award}
          color="teal"
        />
        <StatCard
          title="Total Assessed Buildings"
          value={analytics?.totalAssessments || 0}
          subtitle="Evaluated database records"
          icon={Building2}
          color="eco"
        />
        <StatCard
          title="Est. Annual CO2 Savings"
          value={`${analytics?.totalCO2Reduction || 0} MT`}
          subtitle="Potential annual CO2e reduction"
          icon={Cloud}
          color="teal"
        />
        <StatCard
          title="Avg Renewable Power"
          value={`${analytics?.averageRenewablePercent || 0}%`}
          subtitle="Clean grid & solar power share"
          icon={Sun}
          color="eco"
        />
      </div>

      {/* Compact "What Needs Attention" Priority Alert Section */}
      <div className="panel-flat border-l-4 border-l-amber-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Priority Decarbonization Opportunities
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {projectsNeedingAttention > 0
                ? `${projectsNeedingAttention} project(s) currently score below 50/100 (Needs Improvement threshold). Priority retrofits recommended for HVAC and Solar PV.`
                : 'Portfolio performance is operating above baseline. Focus on upgrading Renewable Energy share for top tier certification.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('simulator')}
          className="btn-saas-outline shrink-0 text-xs"
        >
          <span>Run Simulator Retrofits</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Actions Grid */}
      <QuickActions
        setActiveTab={setActiveTab}
        onOpenAiModal={onOpenAiModal}
      />

      {/* Visual Intelligence Split: Radar Diagram & Category Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Radar Diagram */}
        <div className="panel-elevated">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Sustainability Radar Profile</h3>
              <p className="text-xs text-slate-400">Mean score distribution across 6 environmental categories</p>
            </div>
            <span className="badge-saas-info">
              Portfolio Mean
            </span>
          </div>
          <CategoryRadarChart categoryScores={categoryAverages} />
        </div>

        {/* Category Progress Bars */}
        <div className="panel-elevated flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Category Benchmark Scores</h3>
                <p className="text-xs text-slate-400">Category averages relative to industry baseline</p>
              </div>
              <span className="badge-saas-neutral">Weighted Scale</span>
            </div>
            <CategoryBarChart categoryScores={categoryAverages} />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Weighting: Energy (25%) | Others (15% each)</span>
            <button
              onClick={() => setActiveTab('simulator')}
              className="text-eco-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Simulate Upgrade Delta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Assessments Table */}
      <div className="panel-elevated space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Recent Assessments</h3>
            <p className="text-xs text-slate-400">Latest building evaluations recorded in system</p>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs font-semibold text-eco-400 hover:text-eco-300 flex items-center gap-1"
          >
            <span>View All ({analytics?.totalAssessments || 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentAssessments.length === 0 ? (
          <div className="text-center py-10 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
            <p className="text-slate-400 text-sm">No building assessments recorded yet.</p>
            <button
              onClick={() => setActiveTab('new-assessment')}
              className="btn-saas-primary"
            >
              Create First Assessment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-saas">
              <thead>
                <tr>
                  <th>Building Name</th>
                  <th>Type</th>
                  <th>Overall Score</th>
                  <th>Rating</th>
                  <th>Date Assessed</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentAssessments.map(item => (
                  <tr key={item._id}>
                    <td className="font-bold text-white">
                      {item.buildingInfo?.name || 'Unnamed Building'}
                    </td>
                    <td>
                      <span className="badge-saas-neutral">
                        {item.buildingInfo?.buildingType || 'Commercial'}
                      </span>
                    </td>
                    <td className="font-black text-eco-400 text-sm">
                      {item.scores?.overallScore || 0}
                      <span className="text-xs text-slate-500 font-normal">/100</span>
                    </td>
                    <td>
                      <RatingBadge rating={item.scores?.rating} size="sm" />
                    </td>
                    <td className="text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAssessmentId(item._id);
                          setActiveTab('report');
                        }}
                        className="btn-saas-ghost"
                      >
                        <span>Report</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSimData(item);
                          setActiveTab('simulator');
                        }}
                        className="btn-saas-outline"
                      >
                        <span>Simulate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

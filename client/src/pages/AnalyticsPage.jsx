import React, { useState, useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import CategoryRadarChart from '../components/assessment/CategoryRadarChart';
import { fetchAnalytics, fetchAssessments } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Award,
  Building2,
  Filter,
  Calendar,
  Cloud,
  Loader2,
  Sparkles
} from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [anData, list] = await Promise.all([
        fetchAnalytics(),
        fetchAssessments({ limit: 100 })
      ]);
      setAnalytics(anData);
      setAssessments(list);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter assessment history
  const filteredList = assessments.filter(item => {
    if (typeFilter !== 'All' && item.buildingInfo?.buildingType !== typeFilter) return false;
    if (timeFilter === 'Recent') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000);
      if (new Date(item.createdAt) < thirtyDaysAgo) return false;
    }
    return true;
  });

  // Prepare chart timeline data
  const chartTimelineData = filteredList
    .slice()
    .reverse()
    .map(item => ({
      date: new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      name: item.buildingInfo?.name || 'Building',
      score: item.scores?.overallScore || 0,
      energy: item.scores?.categoryScores?.energy || 0,
      water: item.scores?.categoryScores?.water || 0,
      renewable: item.scores?.categoryScores?.renewable || 0,
      carbon: item.scores?.carbonFootprint?.totalCurrentCO2e || 0
    }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-eco-400 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Computing Advanced Portfolio Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Portfolio Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Advanced Analytics & Trends
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Historical score progression, energy trends, and carbon reduction telemetry.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-1.5 px-2">
            <Filter className="w-3.5 h-3.5 text-eco-400" />
            <span className="text-slate-400 font-bold uppercase">Filters</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-eco-500 font-medium"
          >
            <option value="All">All Building Types</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential">Residential</option>
            <option value="Industrial">Industrial</option>
            <option value="Mixed-Use">Mixed-Use</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-eco-500 font-medium"
          >
            <option value="All">All Time History</option>
            <option value="Recent">Recent (Last 30 Days)</option>
          </select>
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Evaluated Projects"
          value={filteredList.length}
          subtitle="Filtered assessment count"
          icon={Building2}
          color="eco"
        />
        <StatCard
          title="Average Portfolio Score"
          value={`${analytics?.averageScore || 0}/100`}
          subtitle="Mean performance index"
          icon={Award}
          color="teal"
        />
        <StatCard
          title="Peak Building Score"
          value={`${analytics?.highestScore || 0}/100`}
          subtitle="Highest rating recorded"
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Est. CO2 Reduction"
          value={`${analytics?.totalCO2Reduction || 0} MT`}
          subtitle="Cumulative potential savings"
          icon={Cloud}
          color="purple"
        />
      </div>

      {filteredList.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 space-y-3">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-300 text-base font-semibold">No historical assessment data matching selected filters.</p>
          <p className="text-xs text-slate-400">Create new building assessments to generate historical trend analytics.</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Score Progression Line Chart */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-eco-400" />
              Sustainability Score Progression Timeline
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartTimelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="score" name="Overall Score" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="energy" name="Energy Score" stroke="#14b8a6" strokeWidth={2} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="renewable" name="Renewable Score" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

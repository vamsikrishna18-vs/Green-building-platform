import React, { useState, useEffect } from 'react';
import RatingBadge from '../components/common/RatingBadge';
import { fetchAssessments } from '../services/api';
import {
  Trophy,
  Award,
  Building2,
  Zap,
  Droplets,
  Sun,
  Cloud,
  Loader2,
  Filter,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function LeaderboardPage() {
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [userAssessments, setUserAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchAssessments({ limit: 100 });
      setUserAssessments(data);
    } catch (err) {
      console.error('Error loading leaderboard assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sample Benchmark Data clearly labeled as "Sample Organization" / "Benchmark Sample"
  const sampleLeaderboard = [
    {
      _id: 'lb_sample_1',
      buildingInfo: { name: 'GreenTower Financial HQ', buildingType: 'Commercial' },
      organization: 'Verdant Global Properties (Sample Organization)',
      scores: { overallScore: 92, rating: 'Outstanding' },
      carbonReductionPct: 45,
      xpPoints: 9850,
      badgeTier: 'Platinum',
      isSample: true
    },
    {
      _id: 'lb_sample_2',
      buildingInfo: { name: 'EcoCenter Tech Campus', buildingType: 'Commercial' },
      organization: 'Horizon Tech Park (Sample Organization)',
      scores: { overallScore: 88, rating: 'Excellent' },
      carbonReductionPct: 40,
      xpPoints: 8920,
      badgeTier: 'Gold',
      isSample: true
    },
    {
      _id: 'lb_sample_3',
      buildingInfo: { name: 'Solaris Industrial Hub', buildingType: 'Industrial' },
      organization: 'Solaris Energy Group (Sample Organization)',
      scores: { overallScore: 86, rating: 'Excellent' },
      carbonReductionPct: 38,
      xpPoints: 8410,
      badgeTier: 'Gold',
      isSample: true
    },
    {
      _id: 'lb_sample_4',
      buildingInfo: { name: 'Lotus Eco Residences', buildingType: 'Residential' },
      organization: 'Lotus Living Group (Sample Organization)',
      scores: { overallScore: 82, rating: 'Excellent' },
      carbonReductionPct: 32,
      xpPoints: 7950,
      badgeTier: 'Gold',
      isSample: true
    }
  ];

  // Combine user assessments + sample benchmark records
  const userLeaderboardItems = userAssessments.map(u => ({
    _id: u._id,
    buildingInfo: u.buildingInfo || { name: 'User Building', buildingType: 'Commercial' },
    organization: `${u.buildingInfo?.name || 'Building'} (Assessed Project)`,
    scores: u.scores || { overallScore: 50, rating: 'Moderate' },
    carbonReductionPct: Math.round(((u.scores?.carbonFootprint?.potentialCO2Reduction || 20) / (u.scores?.carbonFootprint?.totalCurrentCO2e || 100)) * 100),
    xpPoints: (u.scores?.overallScore || 50) * 85,
    badgeTier: u.scores?.overallScore >= 90 ? 'Platinum' : u.scores?.overallScore >= 75 ? 'Gold' : u.scores?.overallScore >= 60 ? 'Silver' : 'Bronze',
    isSample: false
  }));

  const allItems = [...userLeaderboardItems, ...sampleLeaderboard];

  // Sort descending by score & XP
  allItems.sort((a, b) => b.scores.overallScore - a.scores.overallScore || b.xpPoints - a.xpPoints);

  const filteredItems = allItems.filter(item => {
    const matchesType = filterType === 'All' || item.buildingInfo?.buildingType === filterType;
    const matchesSearch = item.buildingInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.organization?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-eco-400 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Sustainability Leaderboard Standings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="panel-accent border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Global Building & Company Leaderboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sustainability Rankings & Performance Leaderboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Benchmark your building against top decarbonization leaders and earn performance XP points.
          </p>
        </div>

        <div className="badge-saas-info shrink-0">
          <span>{filteredItems.length} Ranked Buildings</span>
        </div>
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="panel-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Sector Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {['All', 'Commercial', 'Residential', 'Industrial'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === type
                  ? 'bg-eco-500/15 text-eco-300 border border-eco-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search building or company..."
            className="input-saas pl-9"
          />
        </div>

      </div>

      {/* Leaderboard Table */}
      <div className="panel-elevated space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-eco-400" />
            Official Standings Matrix
          </h3>
          <span className="text-xs text-slate-400">XP Weighted Rankings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-saas">
            <thead>
              <tr>
                <th className="w-16 text-center">Rank</th>
                <th>Building / Organization</th>
                <th>Type</th>
                <th>Sustainability Score</th>
                <th>Carbon Reduction</th>
                <th>XP Points</th>
                <th>Tier Badge</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                const rankBadgeClass = rank === 1
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : rank === 2
                  ? 'bg-slate-300/20 text-slate-200 border-slate-300/40'
                  : rank === 3
                  ? 'bg-amber-700/20 text-amber-400 border-amber-700/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700';

                return (
                  <tr key={item._id} className={item.isSample ? 'opacity-90' : 'bg-eco-500/5'}>
                    
                    {/* Rank */}
                    <td className="text-center font-black text-sm">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full border text-xs ${rankBadgeClass}`}>
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                      </span>
                    </td>

                    {/* Building Name & Org */}
                    <td>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{item.buildingInfo?.name}</span>
                        {!item.isSample && (
                          <span className="badge-saas-success text-[9px]">YOUR PROJECT</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-medium block">
                        {item.organization}
                      </span>
                    </td>

                    {/* Type */}
                    <td>
                      <span className="badge-saas-neutral">
                        {item.buildingInfo?.buildingType}
                      </span>
                    </td>

                    {/* Score */}
                    <td>
                      <span className="font-black text-eco-400 text-sm">
                        {item.scores?.overallScore}
                      </span>
                      <span className="text-xs text-slate-500 font-normal">/100</span>
                    </td>

                    {/* Carbon Reduction */}
                    <td className="font-bold text-emerald-400">
                      -{item.carbonReductionPct}% CO2e
                    </td>

                    {/* XP Points */}
                    <td className="font-bold text-teal-300">
                      {item.xpPoints?.toLocaleString()} XP
                    </td>

                    {/* Badge Tier */}
                    <td>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        item.badgeTier === 'Platinum'
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                          : item.badgeTier === 'Gold'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                      }`}>
                        {item.badgeTier}
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

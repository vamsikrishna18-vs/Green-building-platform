import React, { useState, useEffect } from 'react';
import RatingBadge from '../components/common/RatingBadge';
import { fetchAssessments, deleteAssessment } from '../services/api';
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  Sliders,
  Download,
  Building2,
  Loader2
} from 'lucide-react';

export default function HistoryPage({ setActiveTab, setSelectedAssessmentId, setSelectedSimData }) {
  const [assessments, setAssessments] = useState([]);
  const [search, setSearch] = useState('');
  const [buildingType, setBuildingType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, [search, buildingType]);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const data = await fetchAssessments({ search, buildingType, limit: 100 });
      setAssessments(data);
    } catch (err) {
      console.error('Error loading assessments history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete assessment for "${name}"?`)) {
      try {
        await deleteAssessment(id);
        setAssessments(prev => prev.filter(item => item._id !== id));
      } catch (err) {
        alert(`Failed to delete assessment: ${err.message}`);
      }
    }
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(assessments, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `GreenBuild_Assessments_Export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>MongoDB Atlas History</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Saved Assessments & Audit Records
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse, search, filter, and compare historical building sustainability reports.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          disabled={assessments.length === 0}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-eco-400" />
          <span>Export All Data (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-slate-800">
        
        {/* Search Box */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by building name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-eco-500"
          />
        </div>

        {/* Building Type Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
          {['All', 'Commercial', 'Residential', 'Industrial', 'Mixed-Use'].map(type => (
            <button
              key={type}
              onClick={() => setBuildingType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                buildingType === type
                  ? 'bg-eco-500 text-slate-950 shadow-glow-emerald'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table Data Grid */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 text-eco-400 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Fetching Saved Assessments...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-base font-semibold">No assessments match your criteria.</p>
            <p className="text-slate-500 text-xs">Try adjusting your search keyword or building type filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Building Name</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Floor Area</th>
                  <th className="px-4 py-3.5">Overall Score</th>
                  <th className="px-4 py-3.5">Rating</th>
                  <th className="px-4 py-3.5">Created At</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {assessments.map(item => (
                  <tr key={item._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-4 font-bold text-white">
                      {item.buildingInfo?.name || 'Unnamed Building'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                        {item.buildingInfo?.buildingType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-400">
                      {item.buildingInfo?.totalAreaSqFt?.toLocaleString()} sq ft
                    </td>
                    <td className="px-4 py-4 font-black text-eco-400 text-base">
                      {item.scores?.overallScore || 0}
                      <span className="text-xs text-slate-500 font-normal">/100</span>
                    </td>
                    <td className="px-4 py-4">
                      <RatingBadge rating={item.scores?.rating} size="sm" />
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button
                        title="View Full Report"
                        onClick={() => {
                          setSelectedAssessmentId(item._id);
                          setActiveTab('report');
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        title="Simulate Upgrade"
                        onClick={() => {
                          setSelectedSimData(item);
                          setActiveTab('simulator');
                        }}
                        className="p-2 rounded-lg bg-eco-500/10 hover:bg-eco-500/20 text-eco-400 border border-eco-500/30 transition-colors"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>

                      <button
                        title="Delete Assessment"
                        onClick={() => handleDelete(item._id, item.buildingInfo?.name)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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

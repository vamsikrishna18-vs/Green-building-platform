import React, { useState, useEffect } from 'react';
import { getAuthHeaders } from '../services/auth';
import {
  Target,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Sparkles,
  Loader2
} from 'lucide-react';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // New Goal Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Overall');
  const [currentValue, setCurrentValue] = useState(65);
  const [targetValue, setTargetValue] = useState(85);
  const [unit, setUnit] = useState('pts');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/goals'), { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        setGoals(json.data || []);
      }
    } catch (err) {
      console.error('Error loading goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const res = await fetch(getApiUrl('/api/goals'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title,
          category,
          currentValue: Number(currentValue),
          targetValue: Number(targetValue),
          unit,
          deadline: deadline || null
        })
      });

      if (res.ok) {
        setShowModal(false);
        setTitle('');
        loadGoals();
      }
    } catch (err) {
      alert(`Error creating goal: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Delete this sustainability goal?')) {
      try {
        const res = await fetch(`/api/goals/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (res.ok) {
          setGoals(prev => prev.filter(g => g._id !== id));
        }
      } catch (err) {
        alert('Failed to delete goal.');
      }
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Completed') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
        </span>
      );
    } else if (status === 'At Risk') {
      return (
        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" /> At Risk
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-eco-500/15 text-eco-400 border border-eco-500/30 text-xs font-bold flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" /> On Track
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Target Performance Milestones</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Sustainability Goals Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track key environmental metrics against defined target milestones and deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-eco-500 to-teal-400 hover:from-eco-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-glow-emerald transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 text-eco-400 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Fetching Sustainability Goals...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <Target className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-300 text-base font-semibold">No sustainability goals tracked yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-eco-500 text-slate-950 font-bold text-xs shadow-glow-emerald"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map(goal => {
              const current = Number(goal.currentValue) || 0;
              const target = Number(goal.targetValue) || 1;
              const pct = Math.min(100, Math.max(0, Math.round((current / target) * 100)));

              return (
                <div
                  key={goal._id}
                  className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-base">{goal.title}</span>
                        <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                          {goal.category}
                        </span>
                      </div>
                      {goal.deadline && (
                        <p className="text-xs text-slate-400 mt-1">
                          Deadline: {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(goal.status)}
                      <button
                        onClick={() => handleDeleteGoal(goal._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-300">
                        {current} {goal.unit} <span className="text-slate-500">→ Target {target} {goal.unit}</span>
                      </span>
                      <span className="text-eco-400 font-bold">{pct}% Achieved</span>
                    </div>

                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-eco-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-eco-400" />
                Define Sustainability Goal
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reach Score 85 or 80% Renewable Energy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-eco-500"
                >
                  <option value="Overall">Overall Score</option>
                  <option value="Energy">Energy Efficiency</option>
                  <option value="Water">Water Conservation</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Materials">Materials & Sourcing</option>
                  <option value="Waste">Waste Management</option>
                  <option value="Green Features">Green Features</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-300 mb-1">Current</label>
                  <input
                    type="number"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-300 mb-1">Target</label>
                  <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-300 mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-eco-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-eco-500 text-slate-950 font-bold text-xs shadow-glow-emerald"
                >
                  {saving ? 'Saving...' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

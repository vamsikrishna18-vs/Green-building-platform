import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Calendar, LogOut, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export default function ProfilePage({ setActiveTab }) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 text-center glass-panel p-8 rounded-3xl space-y-4">
        <p className="text-slate-400 text-sm">You are not logged in.</p>
        <button
          onClick={() => setActiveTab('login')}
          className="px-5 py-2.5 rounded-xl bg-eco-500 text-slate-950 font-bold text-xs"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setActiveTab('login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Profile Header Card */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          
          {/* Avatar Icon */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-eco-600 to-teal-400 p-1 shadow-glow-emerald shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <User className="w-10 h-10 text-eco-400" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">{user.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-eco-500/15 text-eco-400 border border-eco-500/30 uppercase">
                {user.role || 'User'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-eco-400" />
              Authentication Token
            </span>
            <span className="text-xs font-semibold text-slate-200">
              JWT Secured Session (7-Day Duration)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              Assessment Scope
            </span>
            <span className="text-xs font-semibold text-slate-200">
              Private User-Scoped Records
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import NotificationBell from './NotificationBell';
import { useAuth } from '../../context/AuthContext';
import {
  Leaf,
  LayoutDashboard,
  FilePlus,
  Sliders,
  History,
  GitCompare,
  Target,
  Calculator,
  Trophy,
  Bot,
  Sparkles,
  User,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-assessment', label: 'New Assessment', icon: FilePlus },
    { id: 'simulator', label: 'Simulator', icon: Sliders },
    { id: 'roi-calculator', label: 'ROI Calculator', icon: Calculator },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'history', label: 'History', icon: History },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Bot }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-eco-600 to-teal-400 p-0.5 shadow-glow-emerald transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-eco-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-eco-300 bg-clip-text text-transparent">
                  GreenBuild
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-eco-500/10 text-eco-400 border border-eco-500/20">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Sustainability Assessment Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-eco-500/15 text-eco-300 border border-eco-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-eco-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Account Controls */}
          <div className="flex items-center space-x-3">
            <NotificationBell />

            <button
              onClick={() => setActiveTab('new-assessment')}
              className="hidden lg:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-eco-500 to-teal-500 hover:from-eco-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>Evaluate</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-eco-500/20 text-eco-300 border border-eco-500/40'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-eco-500/20 flex items-center justify-center border border-eco-500/30">
                    <User className="w-3 h-3 text-eco-400" />
                  </div>
                  <span className="max-w-[90px] truncate">{user.name}</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setActiveTab('login');
                  }}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-eco-400" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => setActiveTab('register')}
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-eco-500/10 hover:bg-eco-500/20 text-eco-400 border border-eco-500/30 text-xs font-semibold transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800 px-2 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap ${
                isActive ? 'text-eco-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

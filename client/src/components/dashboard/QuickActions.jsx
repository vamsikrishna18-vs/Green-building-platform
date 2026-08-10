import React from 'react';
import {
  FilePlus,
  Sliders,
  Sparkles,
  GitCompare,
  Target,
  TrendingUp,
  Bot
} from 'lucide-react';

export default function QuickActions({ setActiveTab, onOpenAiModal }) {
  const actions = [
    {
      id: 'new-assessment',
      title: 'New Assessment',
      desc: 'Evaluate a building',
      icon: FilePlus,
      color: 'from-eco-500/20 to-teal-500/20 text-eco-400 border-eco-500/30',
      handler: () => setActiveTab('new-assessment')
    },
    {
      id: 'simulator',
      title: 'Run Simulation',
      desc: 'Test clean tech levers',
      icon: Sliders,
      color: 'from-teal-500/20 to-cyan-500/20 text-teal-300 border-teal-500/30',
      handler: () => setActiveTab('simulator')
    },
    {
      id: 'compare',
      title: 'Compare Projects',
      desc: 'Side-by-side benchmark',
      icon: GitCompare,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
      handler: () => setActiveTab('compare')
    },
    {
      id: 'goals',
      title: 'Sustainability Goals',
      desc: 'Track progress targets',
      icon: Target,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30',
      handler: () => setActiveTab('goals')
    },
    {
      id: 'analytics',
      title: 'Analytics & Trends',
      desc: 'Portfolio progression',
      icon: TrendingUp,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
      handler: () => setActiveTab('analytics')
    },
    {
      id: 'ai-advisor',
      title: 'Ask AI Advisor',
      desc: 'Contextual AI guidance',
      icon: Bot,
      color: 'from-cyan-500/20 to-eco-500/20 text-cyan-300 border-cyan-500/30',
      handler: onOpenAiModal
    }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-eco-400" />
            Quick Platform Actions
          </h3>
          <p className="text-xs text-slate-400">Direct shortcuts to core intelligence engines</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.handler}
              className={`p-3.5 rounded-2xl bg-gradient-to-br ${act.color} border text-left flex flex-col justify-between space-y-2 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-md`}
            >
              <div className="p-2 rounded-xl bg-slate-950/60 w-fit border border-slate-800">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-xs leading-snug block">{act.title}</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{act.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { Leaf, ShieldCheck, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-eco-500/20 flex items-center justify-center border border-eco-500/30">
              <Leaf className="w-4 h-4 text-eco-400" />
            </div>
            <span className="font-semibold text-slate-200">GreenBuild Platform</span>
            <span className="text-xs text-slate-500">| Decision-Support Platform</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-eco-400" />
              <span>MongoDB Atlas Cloud Connected</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>LEED & BREEAM Scoring Framework</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} GreenBuild. Built for sustainable construction auditing.
          </p>
        </div>
      </div>
    </footer>
  );
}

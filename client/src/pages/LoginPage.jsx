import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, LogIn, Sparkles, Loader2 } from 'lucide-react';

export default function LoginPage({ setActiveTab }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await login({ email, password });
      setActiveTab('dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 animate-fadeIn">
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-eco-600 to-teal-400 p-0.5 shadow-glow-emerald mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-eco-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-400">
            Sign in to access your saved GreenBuild sustainability reports.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-eco-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-eco-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-eco-500 to-teal-400 hover:from-eco-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-glow-emerald transition-all transform hover:-translate-y-0.5"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Platform</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800 text-xs text-slate-400">
          <span>Don't have an account yet? </span>
          <button
            onClick={() => setActiveTab('register')}
            className="font-bold text-eco-400 hover:underline"
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
}

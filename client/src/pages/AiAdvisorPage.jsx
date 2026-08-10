import React, { useState, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  Building2,
  Zap,
  Droplets,
  Sun,
  Sliders,
  Calculator,
  Target
} from 'lucide-react';
import { getAuthHeaders } from '../services/auth';
import { getApiUrl } from '../services/apiConfig';
import { fetchAssessments } from '../services/api';

export default function AiAdvisorPage({ setActiveTab, setSelectedSimData }) {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'advisor',
      text: 'Welcome to the **GreenBuild AI Sustainability Advisory Workspace**. How can I assist your building decarbonization roadmap today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const data = await fetchAssessments({ limit: 50 });
      if (Array.isArray(data)) {
        setAssessments(data);
        if (data.length > 0) {
          setSelectedAssessmentId(data[0]._id);
        }
      }
    } catch (err) {
      console.warn('AI Advisor Page telemetry load warning:', err);
    }
  };

  const selectedAssessment = (Array.isArray(assessments) && assessments.find(a => a?._id === selectedAssessmentId)) || (assessments && assessments[0]) || {};
  const buildingInfo = selectedAssessment?.buildingInfo || { name: 'Nexus EcoTower', buildingType: 'Commercial', totalAreaSqFt: 120000 };
  const scores = selectedAssessment?.scores || { overallScore: 68, rating: 'Good', categoryScores: { energy: 65, water: 72, renewable: 55 } };
  const carbonFootprint = scores?.carbonFootprint || { totalCurrentCO2e: 312.5, potentialCO2Reduction: 120.2 };

  const quickPrompts = [
    'How can I reduce energy consumption?',
    'How can I reduce water usage?',
    'What renewable energy options suit my building?',
    'How can I improve my GreenBuild score?',
    'How can I reduce operating costs?',
    'What upgrades should I prioritize?',
    'How can I improve indoor environmental quality?',
    'What can I do to reduce my building\'s carbon footprint?'
  ];

  const sendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query || !query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          prompt: query,
          assessmentData: selectedAssessment
        })
      });

      if (res.ok) {
        const json = await res.json();
        const advisorMsg = {
          sender: 'advisor',
          text: json?.data?.response || 'Analysis complete.',
          actions: true
        };
        setMessages(prev => [...prev, advisorMsg]);
      } else {
        setMessages(prev => [...prev, {
          sender: 'advisor',
          text: 'The AI Service encountered a temporary response error.\n\n**Recommended Step:** Upgrade **Energy Efficiency** and **Water Conservation** fixtures to achieve fast score gains.'
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'advisor',
        text: 'Offline mode recommendation:\n\n1. Retrofit 100% of lighting to LED + sensors.\n2. Install Rooftop Solar PV.\n3. Upgrade restroom fixtures to low-flow aerators.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (pageError) {
    return (
      <div className="panel-flat p-8 text-center space-y-4">
        <Bot className="w-12 h-12 text-eco-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">AI Advisory Workspace Ready</h2>
        <p className="text-slate-400 text-sm">Loaded in fallback mode. You can ask any question below or use the floating chatbot in the lower-right corner.</p>
        <button onClick={() => setPageError(null)} className="btn-saas-primary">Retry Telemetry Connection</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="panel-accent border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Sustainability Advisory Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            GreenBuild AI Sustainability Advisor
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time decarbonization guidance calibrated against LEED and BREEAM engineering benchmarks.
          </p>
        </div>

        {/* Building Context Selector */}
        {Array.isArray(assessments) && assessments.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Active Telemetry:</span>
            <select
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
              className="input-saas max-w-xs"
            >
              {assessments.map(a => (
                <option key={a._id} value={a._id}>
                  {a.buildingInfo?.name} ({a.scores?.overallScore}/100)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Workspace Split: Left/Center Conversation (8 cols) vs Right Context Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT / MAIN CONVERSATION (8 cols) */}
        <div className="lg:col-span-8 panel-elevated flex flex-col h-[680px] overflow-hidden space-y-4">
          
          {/* Quick Prompts Bar */}
          <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(qp)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 whitespace-nowrap transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-3 ${
                    msg.sender === 'user'
                      ? 'bg-eco-500 text-slate-950 font-medium rounded-br-none shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {typeof msg.text === 'string' && msg.text.split('\n').map((line, i) => (
                    <p key={i} className={line === '' ? 'h-2' : ''}>
                      {line.includes('**') ? (
                        <span dangerouslySetInnerHTML={{
                          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                      ) : line}
                    </p>
                  ))}

                  {/* Interactive Action Chips */}
                  {msg.actions && msg.sender === 'advisor' && (
                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 no-print">
                      <button
                        onClick={() => {
                          if (setSelectedSimData && selectedAssessment) {
                            setSelectedSimData(selectedAssessment);
                          }
                          setActiveTab('simulator');
                        }}
                        className="btn-saas-outline text-[11px]"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Simulate Retrofits</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('roi-calculator')}
                        className="btn-saas-secondary text-[11px]"
                      >
                        <Calculator className="w-3.5 h-3.5 text-teal-400" />
                        <span>Calculate Financial ROI</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('goals')}
                        className="btn-saas-ghost text-[11px]"
                      >
                        <Target className="w-3.5 h-3.5 text-purple-400" />
                        <span>Save as Target Goal</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl rounded-bl-none flex items-center space-x-2 text-xs text-slate-400">
                  <Loader2 className="w-4 h-4 text-eco-400 animate-spin" />
                  <span>Evaluating building telemetry against LEED standards...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/80 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask GreenBuild AI about energy retrofits, carbon reduction, or ROI..."
                className="input-saas flex-1"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-saas-primary"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT BUILDING CONTEXT PANEL (4 cols) */}
        <div className="lg:col-span-4 panel-elevated space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="badge-saas-info mb-1">
              BUILDING TELEMETRY CONTEXT
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-eco-400" />
              {buildingInfo?.name || 'Nexus EcoTower'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{buildingInfo?.buildingType || 'Commercial'} • {buildingInfo?.totalAreaSqFt?.toLocaleString() || '120,000'} sq ft</p>
          </div>

          {/* Key Context Metrics */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Baseline Score</span>
              <div className="text-2xl font-black text-eco-400">{scores?.overallScore || 68}<span className="text-xs text-slate-500 font-normal">/100</span></div>
              <span className="badge-saas-success">{scores?.rating || 'Good'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Carbon Footprint</span>
              <div className="text-lg font-extrabold text-emerald-400">{carbonFootprint?.totalCurrentCO2e || 312.5} <span className="text-[10px] text-slate-400 font-normal">MT/yr</span></div>
              <span className="text-[10px] text-emerald-300 font-semibold block">-{carbonFootprint?.potentialCO2Reduction || 120.2} MT potential</span>
            </div>
          </div>

          {/* Category Scores Breakdown */}
          <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Category Performance</span>
            
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/50">
              <span className="text-slate-300 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-teal-400" /> Energy Score:</span>
              <strong className="text-white">{scores?.categoryScores?.energy || 65}/100</strong>
            </div>

            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/50">
              <span className="text-slate-300 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-cyan-400" /> Water Score:</span>
              <strong className="text-white">{scores?.categoryScores?.water || 72}/100</strong>
            </div>

            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/50">
              <span className="text-slate-300 flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-400" /> Renewable Energy:</span>
              <strong className="text-white">{scores?.categoryScores?.renewable || 55}/100</strong>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Minus,
  Loader2,
  Sliders,
  Calculator,
  Target,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { getAuthHeaders } from '../../services/auth';
import { getApiUrl } from '../../services/apiConfig';
import { fetchAssessments } from '../../services/api';

export default function AiAdvisorFloatingChat({ isOpen, setIsOpen, setActiveTab, setSelectedSimData }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'advisor',
      text: 'Hello! I am your **GreenBuild AI Sustainability Advisor**. How can I help you reduce carbon emissions, optimize energy & water usage, or boost your GreenBuild score today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [activeAssessment, setActiveAssessment] = useState(null);

  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    loadLatestAssessment();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen, isMinimized]);

  const loadLatestAssessment = async () => {
    try {
      const data = await fetchAssessments({ limit: 1 });
      if (data && data.length > 0) {
        setActiveAssessment(data[0]);
      }
    } catch (err) {
      console.warn('AI Advisor: Assessment telemetry optional load error:', err);
    }
  };

  const sendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch(getApiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          prompt: query,
          assessmentData: activeAssessment
        })
      });

      if (res.ok) {
        const json = await res.json();
        const advisorMsg = {
          sender: 'advisor',
          text: json.data?.response || 'Analysis complete.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: true
        };
        setMessages(prev => [...prev, advisorMsg]);
      } else {
        // Friendly fallback error message without crashing UI
        const advisorMsg = {
          sender: 'advisor',
          text: 'The AI Service encountered a temporary response error. Here is a general recommendation:\n\nFocus on upgrading your **Energy Usage** and **Water Conservation** fixtures first to achieve rapid score uplift and financial payback.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, advisorMsg]);
      }
    } catch (err) {
      console.error('AI Advisor network error:', err);
      const advisorMsg = {
        sender: 'advisor',
        text: 'Offline mode recommendation:\n\n1. Retrofit 100% of lighting to LED + sensors.\n2. Install Rooftop Solar PV.\n3. Upgrade restroom fixtures to low-flow aerators.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, advisorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON (LOWER-RIGHT CORNER) */}
      <div className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-50 group no-print">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          className="relative p-3.5 rounded-2xl bg-gradient-to-tr from-eco-600 via-eco-500 to-teal-400 text-slate-950 font-bold shadow-xl shadow-eco-900/30 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center border border-eco-400/40"
          title="Ask GreenBuild AI"
        >
          <Bot className="w-6 h-6 stroke-[2.5]" />

          {/* Online Dot */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
          </span>
        </button>

        {/* Hover Tooltip */}
        {!isOpen && (
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Ask GreenBuild AI ⚡
          </div>
        )}
      </div>

      {/* FLOATING CHAT PANEL */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-4 sm:right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 animate-fadeIn no-print ${
            isMinimized ? 'h-14' : 'h-[520px] max-h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-eco-500/20 border border-eco-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-eco-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  GreenBuild AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h4>
                <p className="text-[10px] text-slate-400">Sustainability Advisor</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Prompts Bar */}
              <div className="p-2.5 bg-slate-900/50 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 self-center" />
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(qp)}
                    className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs leading-relaxed">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[90%] p-3 rounded-2xl space-y-2 ${
                        msg.sender === 'user'
                          ? 'bg-eco-500 text-slate-950 font-medium rounded-br-none shadow-sm'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text.split('\n').map((line, i) => (
                        <p key={i} className={line === '' ? 'h-1' : ''}>
                          {line.includes('**') ? (
                            <span dangerouslySetInnerHTML={{
                              __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            }} />
                          ) : line}
                        </p>
                      ))}

                      {/* Action Chips */}
                      {msg.actions && msg.sender === 'advisor' && (
                        <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5 mt-2">
                          <button
                            onClick={() => {
                              if (activeAssessment && setSelectedSimData) {
                                setSelectedSimData(activeAssessment);
                              }
                              setActiveTab('simulator');
                            }}
                            className="btn-saas-outline text-[10px] px-2 py-0.5"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Simulate</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('roi-calculator')}
                            className="btn-saas-secondary text-[10px] px-2 py-0.5"
                          >
                            <Calculator className="w-3 h-3 text-teal-400" />
                            <span>Calculate ROI</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('goals')}
                            className="btn-saas-ghost text-[10px] px-2 py-0.5"
                          >
                            <Target className="w-3 h-3 text-purple-400" />
                            <span>Save Goal</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {msg.timestamp && (
                      <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.timestamp}</span>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl rounded-bl-none flex items-center space-x-2 text-[11px] text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 text-eco-400 animate-spin" />
                      <span>Evaluating green building telemetry...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="p-3 border-t border-slate-800 bg-slate-900/80 shrink-0">
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
                    placeholder="Ask about your building..."
                    className="input-saas flex-1 text-xs py-1.5"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="btn-saas-primary px-3 py-1.5 text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}

        </div>
      )}
    </>
  );
}

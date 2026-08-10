import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, Loader2, ArrowRight, Lightbulb, Building2, ShieldCheck, Zap } from 'lucide-react';
import { getAuthHeaders } from '../../services/auth';
import { getApiUrl } from '../../services/apiConfig';

export default function AiAdvisorModal({ isOpen, onClose, assessmentData }) {
  const [messages, setMessages] = useState([
    {
      sender: 'advisor',
      text: 'Hello! I am your **GreenBuild AI Sustainability Advisor**. How can I help you optimize your building\'s performance today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'How can I improve my score from 65 to 80?',
    'Why is my water score low?',
    'Which upgrade should I implement first?',
    'How can I reduce carbon emissions?'
  ];

  if (!isOpen) return null;

  const buildingName = assessmentData?.buildingInfo?.name || 'Nexus Commercial Center';
  const overallScore = assessmentData?.scores?.overallScore || 68;
  const rating = assessmentData?.scores?.rating || 'Good';

  const sendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

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
          assessmentData
        })
      });

      if (res.ok) {
        const json = await res.json();
        const advisorMsg = {
          sender: 'advisor',
          text: json.data?.response || 'Analysis complete.',
          isFallback: json.data?.isFallback
        };
        setMessages(prev => [...prev, advisorMsg]);
      } else {
        setMessages(prev => [...prev, { sender: 'advisor', text: 'Sorry, I encountered an error processing your query.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'advisor', text: 'Error connecting to AI service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl max-w-4xl w-full border border-slate-800 flex flex-col h-[650px] overflow-hidden shadow-2xl animate-fadeIn">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-eco-500/20 border border-eco-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-eco-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                GreenBuild AI Advisory Workspace
                <span className="badge-saas-info">
                  Telemetry Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">Context-aware decarbonization recommendations</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-saas-ghost"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Workspace Split: Left Sidebar (Context) vs Right Conversation Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar Context Panel */}
          <div className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 p-4 space-y-4 text-xs overflow-y-auto hidden md:block">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Active Project Context</span>
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-eco-400" />
                <span className="font-bold text-white text-sm truncate">{buildingName}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Baseline Rating</span>
              <div className="text-2xl font-black text-eco-400">{overallScore}<span className="text-xs text-slate-500 font-normal">/100</span></div>
              <span className="badge-saas-success">{rating}</span>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Suggested Advisory Prompts</span>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(qp)}
                  className="w-full text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-[11px] block"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Right Conversation Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/40">
            
            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-eco-500 text-slate-950 font-medium rounded-br-none shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className={line === '' ? 'h-2' : ''}>
                        {line.includes('**') ? (
                          <span dangerouslySetInnerHTML={{
                            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }} />
                        ) : line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl rounded-bl-none flex items-center space-x-2 text-xs text-slate-400">
                    <Loader2 className="w-4 h-4 text-eco-400 animate-spin" />
                    <span>Analyzing assessment telemetry...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60">
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
                  placeholder="Ask GreenBuild AI about upgrades, EUI, or ROI..."
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
              <span className="text-[10px] text-slate-500 mt-1.5 block text-center">
                GreenBuild AI advisory model calibrated against LEED / BREEAM benchmarks.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

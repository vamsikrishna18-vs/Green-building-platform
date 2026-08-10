import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getAuthHeaders } from '../../services/auth';
import { getApiUrl } from '../../services/apiConfig';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await fetch(getApiUrl('/api/notifications'), { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  const markRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const clearAll = async () => {
    try {
      await fetch(getApiUrl('/api/notifications'), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors relative"
        title="Notifications & Alerts"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-eco-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shadow-glow-emerald">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl border border-slate-800 shadow-2xl z-50 overflow-hidden animate-fadeIn">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-eco-400" />
              <span className="font-bold text-white text-xs uppercase tracking-wider">Project Alerts</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-eco-500/20 text-eco-400 font-bold px-2 py-0.5 rounded-full border border-eco-500/30">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-[10px] text-slate-400 hover:text-rose-400 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active notifications.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3.5 flex items-start justify-between gap-2 transition-colors ${
                    n.isRead ? 'bg-slate-950/40 text-slate-400' : 'bg-slate-900/60 text-slate-200 font-medium'
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-white">{n.title}</span>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-eco-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] leading-snug">{n.message}</p>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n._id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-eco-400 hover:bg-slate-800 shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

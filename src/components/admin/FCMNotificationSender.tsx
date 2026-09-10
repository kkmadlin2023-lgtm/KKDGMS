// =====================================================================
// KKDGMS — Admin FCM Push Notification & Circular Broadcast Center
// =====================================================================

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Users,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { NotificationItem, UserRole } from '../../types';
import { api } from '../../lib/supabase';
import { showLocalNotification } from '../../lib/firebase';

export const FCMNotificationSender: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState<'all' | 'student' | 'faculty' | 'warden' | 'admin' | 'technician'>('all');
  const [targetClass, setTargetClass] = useState('All');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const list = await api.getNotifications();
    setNotifications(list);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert('Please fill out both title and message.');
      return;
    }

    setSending(true);

    const newNotif = await api.addNotification({
      title,
      message,
      target_role: targetRole,
      target_class: targetClass === 'All' ? undefined : targetClass,
      priority,
      created_by: 'Principal Office'
    });

    // Trigger local test notification for feedback
    showLocalNotification(title, message);

    await api.logAudit({
      user_id: 'ADMIN',
      email: 'principal@kkdgms.edu.in',
      role: 'admin',
      action: `Broadcasted ${priority} circular to ${targetRole.toUpperCase()}: ${title}`,
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent,
      status: 'SUCCESS'
    });

    setTitle('');
    setMessage('');
    setSending(false);
    await loadNotifications();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-black text-slate-900">Push Notification & Circular Broadcast Hub</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Dispatch instant Web Push (FCM) circulars and digital notifications directly to student, faculty, and warden devices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Composer */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Compose New Broadcast</h3>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Circular Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Diwali Holiday Announcement"
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              >
                <option value="all">All Roles (School-wide)</option>
                <option value="student">Students Only</option>
                <option value="faculty">Faculty Staff Only</option>
                <option value="warden">Hostel Wardens Only</option>
                <option value="technician">Technicians Only</option>
              </select>
            </div>

            {targetRole === 'student' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Class</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="All">All Classes (9 - 12)</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Urgency Level</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('normal')}
                  className={`py-2 rounded-xl font-bold uppercase text-[10px] border transition-all ${
                    priority === 'normal' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Normal Notice
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('urgent')}
                  className={`py-2 rounded-xl font-bold uppercase text-[10px] border transition-all ${
                    priority === 'urgent' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Urgent Alert
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Message Content</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type complete circular text..."
                className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Broadcasting...' : 'Transmit FCM Notification'}</span>
            </button>
          </form>
        </div>

        {/* Broadcast History */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Notification History ({notifications.length})</h3>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      n.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {n.priority}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono pt-1">
                  <span>Target: {n.target_role?.toUpperCase()}</span>
                  <span>Author: {n.created_by}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

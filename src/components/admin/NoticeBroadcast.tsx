import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Users,
  Bell,
  Clock
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { NotificationItem } from '../../types';

export const NoticeBroadcast: React.FC = () => {
  const [notices, setNotices] = useState<NotificationItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    message: '',
    target_role: 'all' as 'all' | 'student' | 'faculty' | 'warden' | 'admin',
    priority: 'normal' as 'normal' | 'urgent' | 'academic'
  });

  const loadNotices = () => {
    api.getNotifications().then(data => setNotices(data));
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) return;

    await api.publishNotification(form);
    setShowModal(false);
    setForm({ title: '', message: '', target_role: 'all', priority: 'normal' });
    loadNotices();
    setToast('Institutional circular broadcasted to portal!');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
              <Megaphone className="w-4 h-4" />
              <span>Campus Digital Circular Broadcast</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Notice Board & Broadcast System
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Instant alerts stored in <span className="font-mono font-semibold">public.notifications</span> with role targeting.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Notice</span>
          </button>
        </div>
      </div>

      {/* Circulars List */}
      <div className="space-y-4">
        {notices.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  n.priority === 'urgent'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : n.priority === 'academic'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {n.priority}
                </span>
                <span className="text-xs font-semibold text-slate-500 capitalize">
                  Target: {n.target_role === 'all' ? 'All Campus Users' : n.target_role}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(n.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">{n.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {n.message}
            </p>
          </div>
        ))}
      </div>

      {/* Publish Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handlePublish} className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Broadcast Official Notice
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Quarterly Exam Schedule & Practical Timings"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={form.target_role}
                    onChange={(e) => setForm({ ...form, target_role: e.target.value as any })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white font-semibold"
                  >
                    <option value="all">Everyone (All Roles)</option>
                    <option value="student">Students Only</option>
                    <option value="faculty">Faculty Staff Only</option>
                    <option value="warden">Hostel Wardens Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white font-semibold"
                  >
                    <option value="normal">Normal Circular</option>
                    <option value="urgent">Urgent Announcement</option>
                    <option value="academic">Academic / Exam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Circular Text *</label>
                <textarea
                  rows={4}
                  placeholder="Enter full notice instructions for students and staff..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 cursor-pointer"
              >
                Broadcast Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

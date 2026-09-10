// =====================================================================
// KKDGMS — Master Feedback & Stakeholder Communication Console
// =====================================================================

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  Send,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { FeedbackItem, UserRole } from '../../types';
import { api } from '../../lib/supabase';

export const FeedbackManager: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    const list = await api.getFeedback();
    setFeedbacks(list);
  };

  const handleSendReply = async () => {
    if (!selectedFeedback || !replyText.trim()) return;

    await api.replyFeedback(selectedFeedback.id, replyText, 'Principal Office');
    setReplyText('');
    await loadFeedbacks();
    const updated = (await api.getFeedback()).find((f) => f.id === selectedFeedback.id);
    setSelectedFeedback(updated || null);
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (filterRole !== 'all' && f.role !== filterRole) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-black text-slate-900">Stakeholder Feedback & Response Console</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Review ratings, grievances, and feedback submitted across roles with official administration replies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Submissions ({filteredFeedbacks.length})</h3>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="p-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
              <option value="warden">Wardens</option>
              <option value="technician">Technicians</option>
            </select>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredFeedbacks.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFeedback(f)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedFeedback?.id === f.id
                    ? 'bg-indigo-50 border-indigo-400 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                    {f.role}
                  </span>
                  <div className="flex text-amber-500">
                    {[...Array(f.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{f.user_name}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">{f.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
          {selectedFeedback ? (
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-sm text-slate-900">{selectedFeedback.user_name}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      {selectedFeedback.role}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(selectedFeedback.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedFeedback.message}
                </p>
              </div>

              {/* Replies */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Replies</h4>
                {selectedFeedback.replies?.map((r) => (
                  <div key={r.id} className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-indigo-900">
                      <span>{r.replied_by}</span>
                      <span className="text-[10px] font-mono text-indigo-500 font-normal">
                        {new Date(r.replied_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700">{r.reply_text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official administrative reply to this stakeholder..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs font-medium outline-none"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={handleSendReply}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-12 text-center">Select a feedback submission from the left panel to review and reply.</p>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Check,
  X,
  Clock,
  Phone,
  Plus,
  AlertCircle,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { LeaveRequest } from '../../types';

export const LeaveApprovals: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New leave form state
  const [newLeave, setNewLeave] = useState({
    applicant_type: 'student' as 'student' | 'faculty',
    applicant_id: 'EMIS202401',
    applicant_name: '',
    student_class: '12',
    section: 'A',
    leave_type: 'Hostel Outpass' as any,
    from_date: new Date().toISOString().split('T')[0],
    to_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    reason: '',
    parent_phone: ''
  });

  const loadLeaves = () => {
    api.getLeaves().then(data => setLeaves(data));
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleDecision = async (id: string, role: 'warden' | 'admin', decision: 'Approved' | 'Rejected') => {
    await api.updateLeaveApproval(id, role, decision);
    loadLeaves();
    setToast(`Leave request ${decision.toLowerCase()} by ${role === 'admin' ? 'Principal' : 'Warden'}.`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeave.applicant_name || !newLeave.reason) {
      alert('Please provide applicant name and reason.');
      return;
    }

    await api.submitLeave(newLeave);
    setShowNewModal(false);
    loadLeaves();
    setToast('Leave request submitted successfully for approval.');
    setTimeout(() => setToast(null), 3000);
  };

  const filteredLeaves = leaves.filter(l => {
    const statusMatch = filterStatus === 'all' || l.status === filterStatus;
    const typeMatch = filterType === 'all' || l.applicant_type === filterType;
    return statusMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
              <FileCheck2 className="w-4 h-4" />
              <span>Hostel Outpass & Official Leave Workflow</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Leave Management & Dual Approvals
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Synchronized with <span className="font-mono font-semibold">public.student_leaves</span> requiring Warden & Principal signatures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['all', 'Pending', 'Approved', 'Rejected'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  filterStatus === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st} ({st === 'all' ? leaves.length : leaves.filter(l => l.status === st).length})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700"
            >
              <option value="all">All Applicants (Student & Staff)</option>
              <option value="student">Students Only</option>
              <option value="faculty">Faculty Staff Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leave Requests Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeaves.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No leave requests matching the selected filter.
          </div>
        ) : (
          filteredLeaves.map((l) => (
            <div
              key={l.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{l.applicant_name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {l.applicant_type === 'student' ? `Class ${l.student_class}-${l.section}` : 'Faculty Staff'}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    l.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : l.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {l.status}
                  </span>
                </div>

                <div className="text-xs font-semibold text-blue-700 mb-2">
                  Type: {l.leave_type} • Dates: <span className="font-mono text-slate-700">{l.from_date}</span> to <span className="font-mono text-slate-700">{l.to_date}</span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed mb-3">
                  "{l.reason}"
                </p>

                {l.parent_phone && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Parent Phone:</span>
                    <a href={`tel:${l.parent_phone}`} className="font-mono font-bold text-blue-600 hover:underline">
                      {l.parent_phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Dual Approvals Status & Actions */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Warden Approval:</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-[11px] ${
                      l.warden_approval === 'Approved' ? 'text-emerald-600' : l.warden_approval === 'Rejected' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      {l.warden_approval}
                    </span>
                    {l.warden_approval === 'Pending' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDecision(l.id, 'warden', 'Approved')}
                          className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          title="Warden Approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDecision(l.id, 'warden', 'Rejected')}
                          className="p-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                          title="Warden Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Principal / Admin:</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-[11px] ${
                      l.admin_approval === 'Approved' ? 'text-emerald-600' : l.admin_approval === 'Rejected' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      {l.admin_approval}
                    </span>
                    {l.admin_approval === 'Pending' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDecision(l.id, 'admin', 'Approved')}
                          className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          title="Admin Approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDecision(l.id, 'admin', 'Rejected')}
                          className="p-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                          title="Admin Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Leave Application Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateLeave} className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Submit Leave / Hostel Outpass
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Applicant Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewLeave({ ...newLeave, applicant_type: 'student' })}
                    className={`py-1.5 rounded-lg font-bold border ${newLeave.applicant_type === 'student' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewLeave({ ...newLeave, applicant_type: 'faculty' })}
                    className={`py-1.5 rounded-lg font-bold border ${newLeave.applicant_type === 'faculty' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-slate-200 text-slate-600'}`}
                  >
                    Faculty
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Applicant Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. A. Dhanush Kumar"
                  value={newLeave.applicant_name}
                  onChange={(e) => setNewLeave({ ...newLeave, applicant_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Category</label>
                <select
                  value={newLeave.leave_type}
                  onChange={(e) => setNewLeave({ ...newLeave, leave_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Hostel Outpass">Hostel Outpass (Weekend/Emergency)</option>
                  <option value="Medical">Medical Leave</option>
                  <option value="Personal">Personal / Family Event</option>
                  <option value="Emergency">Urgent Emergency</option>
                  <option value="Festival">Temple / Cultural Festival</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={newLeave.from_date}
                    onChange={(e) => setNewLeave({ ...newLeave, from_date: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={newLeave.to_date}
                    onChange={(e) => setNewLeave({ ...newLeave, to_date: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parent Phone (for confirmation)</label>
                <input
                  type="tel"
                  placeholder="10 digit mobile"
                  value={newLeave.parent_phone}
                  onChange={(e) => setNewLeave({ ...newLeave, parent_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Reason *</label>
                <textarea
                  rows={3}
                  placeholder="Explain reason for leave..."
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 cursor-pointer"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

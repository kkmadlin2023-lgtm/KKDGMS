import React, { useState, useEffect } from 'react';
import {
  DoorOpen,
  Plus,
  Clock,
  CheckCircle2,
  Phone,
  UserCheck,
  LogOut,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { VisitorPass } from '../../types';

export const VisitorGatePass: React.FC = () => {
  const [visitors, setVisitors] = useState<VisitorPass[]>([]);
  const [showPassModal, setShowPassModal] = useState(false);
  const [selectedVisitorPass, setSelectedVisitorPass] = useState<VisitorPass | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    visitor_name: '',
    phone: '',
    whom_to_meet: 'Principal / Headmaster',
    student_id: '',
    purpose: 'Parent-Teacher Meeting',
    id_proof_type: 'Aadhaar Card',
    id_proof_no: '',
    vehicle_no: ''
  });

  const loadVisitors = () => {
    api.getVisitorPasses().then(data => setVisitors(data));
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.visitor_name || !form.phone) {
      alert('Please fill visitor name and contact number');
      return;
    }

    const created = await api.createVisitorPass({
      ...form,
      check_in: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Checked-In',
      gate_no: 'Gate 1 (Main Entrance)'
    });

    setShowPassModal(false);
    loadVisitors();
    setSelectedVisitorPass(created);
    setToast('Gate Pass issued successfully.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleCheckOut = async (id: string) => {
    await api.checkOutVisitor(id);
    loadVisitors();
    setToast('Visitor checked-out at campus security gate.');
    setTimeout(() => setToast(null), 3000);
  };

  const activeVisitors = visitors.filter(v => v.status === 'Checked-In');

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
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Security & Access Control</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Visitor Gate Pass Register
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Recorded in <span className="font-mono font-semibold">public.visitor_passes</span> for campus safety compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPassModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Gate Pass</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Today's Total Entries</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">{visitors.length}</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
            <span className="text-amber-800 font-bold uppercase text-[10px]">Currently On Campus</span>
            <div className="text-lg font-black text-amber-900 mt-0.5">{activeVisitors.length}</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <span className="text-emerald-800 font-bold uppercase text-[10px]">Departed (Checked Out)</span>
            <div className="text-lg font-black text-emerald-900 mt-0.5">
              {visitors.filter(v => v.status === 'Checked-Out').length}
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Passes Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Security Gate Log Book
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="p-3.5">Visitor Details</th>
                <th className="p-3.5">Whom To Meet</th>
                <th className="p-3.5">Purpose</th>
                <th className="p-3.5">Check-In Time</th>
                <th className="p-3.5">ID & Vehicle</th>
                <th className="p-3.5">Current Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No visitor passes issued today.
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{v.visitor_name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3" /> {v.phone}
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-blue-900">
                      {v.whom_to_meet}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                        {v.purpose}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="text-slate-900 font-bold">{v.check_in}</div>
                      {v.check_out && (
                        <div className="text-[10px] text-slate-400">Out: {v.check_out}</div>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      <div>{v.id_proof_type}: {v.id_proof_no || 'Verified'}</div>
                      {v.vehicle_no && <div className="text-slate-400 font-semibold">{v.vehicle_no}</div>}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                        v.status === 'Checked-In'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedVisitorPass(v)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 cursor-pointer"
                        >
                          Badge
                        </button>
                        {v.status === 'Checked-In' && (
                          <button
                            onClick={() => handleCheckOut(v.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold cursor-pointer"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Check-Out</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Badge Preview Modal */}
      {selectedVisitorPass && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl relative text-center space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Visitor Security Badge
            </div>
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 font-black text-2xl flex items-center justify-center mx-auto">
              {selectedVisitorPass.visitor_name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {selectedVisitorPass.visitor_name}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Phone: {selectedVisitorPass.phone}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Whom to Meet:</span>
                <span className="font-bold text-slate-800">{selectedVisitorPass.whom_to_meet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Purpose:</span>
                <span className="font-semibold text-slate-800">{selectedVisitorPass.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Check-In:</span>
                <span className="font-mono font-bold text-slate-800">{selectedVisitorPass.check_in}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedVisitorPass(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 cursor-pointer flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Pass Modal */}
      {showPassModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreatePass} className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Issue Campus Visitor Gate Pass
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. S. Murugan"
                  value={form.visitor_name}
                  onChange={(e) => setForm({ ...form, visitor_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Contact *</label>
                <input
                  type="tel"
                  placeholder="10 digit mobile"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Whom to Meet</label>
                  <select
                    value={form.whom_to_meet}
                    onChange={(e) => setForm({ ...form, whom_to_meet: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Principal / Headmaster">Principal</option>
                    <option value="Hostel Warden">Hostel Warden</option>
                    <option value="Class Teacher">Class Teacher</option>
                    <option value="Administrative Office">Office Clerk</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purpose</label>
                  <select
                    value={form.purpose}
                    onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Parent-Teacher Meeting">Parent-Teacher Meeting</option>
                    <option value="Hostel Student Visit">Hostel Student Visit</option>
                    <option value="Fee Payment / Office Work">Office / Fee</option>
                    <option value="Official Department Inspection">Department Inspection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ID Proof Type</label>
                  <select
                    value={form.id_proof_type}
                    onChange={(e) => setForm({ ...form, id_proof_type: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vehicle No (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. TN-74-AB-1234"
                    value={form.vehicle_no}
                    onChange={(e) => setForm({ ...form, vehicle_no: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPassModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 cursor-pointer"
              >
                Issue Pass & Check-In
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

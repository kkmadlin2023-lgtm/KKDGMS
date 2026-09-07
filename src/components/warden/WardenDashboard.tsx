import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  FileCheck2,
  DoorOpen,
  CheckCircle2,
  Phone,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { Student, LeaveRequest, Warden } from '../../types';

interface WardenDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const WardenDashboard: React.FC<WardenDashboardProps> = ({ onNavigateTab }) => {
  const [warden, setWarden] = useState<Warden | null>(null);
  const [boarders, setBoarders] = useState<Student[]>([]);
  const [pendingOutpasses, setPendingOutpasses] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    Promise.all([
      api.getWardens(),
      api.getStudents(),
      api.getLeaves()
    ]).then(([wList, stList, lList]) => {
      if (wList.length > 0) setWarden(wList[0]);
      setBoarders(stList.filter(s => s.hostel_type === 'Resident'));
      setPendingOutpasses(lList.filter(l => l.leave_type === 'Hostel Outpass' && l.warden_approval === 'Pending'));
    });
  }, []);

  const handleWardenSign = async (id: string, decision: 'Approved' | 'Rejected') => {
    await api.updateLeaveApproval(id, 'warden', decision);
    const updated = await api.getLeaves();
    setPendingOutpasses(updated.filter(l => l.leave_type === 'Hostel Outpass' && l.warden_approval === 'Pending'));
  };

  return (
    <div className="space-y-6">
      {/* Warden Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-amber-300 tracking-wider mb-1">
              Hostel Administration • {warden?.hostel_name || 'Vivekananda Boys Hostel'}
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Warden Portal • {warden?.full_name || 'Mr. R. Murugan'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Hostel Block: <span className="font-semibold text-amber-300">Block A (Senior Wing)</span> • Security Protocol: <span className="text-emerald-400 font-bold">Standard Night Curfew 09:30 PM</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('warden-leaves')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Review Outpasses ({pendingOutpasses.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Boarder Strength</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{boarders.length} Students</div>
          <div className="text-xs text-slate-500 mt-1">Standards 9 to 12</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Pending Outpasses</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{pendingOutpasses.length} Requests</div>
          <div className="text-xs text-slate-500 mt-1">Requires Warden signature</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Hostel Roll Call</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">100% Present</div>
          <div className="text-xs text-slate-500 mt-1">All boarders accounted in dorms</div>
        </div>
      </div>

      {/* Pending Outpass Requests Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Hostel Outpass & Weekend Movement</h3>
            <p className="text-xs text-slate-500">Boarders requesting to leave hostel premises</p>
          </div>
          <button
            onClick={() => onNavigateTab('warden-leaves')}
            className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
          >
            Open Outpass Register
          </button>
        </div>

        <div className="space-y-3">
          {pendingOutpasses.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No pending outpasses requiring warden signature.
            </div>
          ) : (
            pendingOutpasses.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{p.applicant_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                      Std {p.student_class}-{p.section}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">Reason: "{p.reason}"</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>Dates: {p.from_date} to {p.to_date}</span>
                    {p.parent_phone && <span>Parent Mobile: <a href={`tel:${p.parent_phone}`} className="font-bold text-blue-600 underline">{p.parent_phone}</a></span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWardenSign(p.id, 'Approved')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                  >
                    Warden Approve
                  </button>
                  <button
                    onClick={() => handleWardenSign(p.id, 'Rejected')}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

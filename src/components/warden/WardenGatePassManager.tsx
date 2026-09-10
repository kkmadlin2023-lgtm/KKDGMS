// =====================================================================
// KKDGMS — Warden Gate Movement & Hostel In/Out Controller
// =====================================================================

import React, { useState, useEffect } from 'react';
import {
  DoorOpen,
  DoorClosed,
  Clock,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  Building2,
  FileCheck,
  ArrowRightLeft
} from 'lucide-react';
import { GateMovement, Student } from '../../types';
import { api } from '../../lib/supabase';

export const WardenGatePassManager: React.FC = () => {
  const [movements, setMovements] = useState<GateMovement[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [reason, setReason] = useState('Approved Weekend Outpass');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const moves = await api.getGateMovements();
    const studs = await api.getStudents();
    setMovements(moves);
    setStudents(studs);
  };

  const handleGateOut = async () => {
    if (!selectedStudent) {
      alert('Please select a student from the directory.');
      return;
    }

    await api.recordGateOut({
      student_id: selectedStudent.id,
      student_name: selectedStudent.full_name,
      student_user_id: selectedStudent.user_id,
      student_class: selectedStudent.student_class,
      section: selectedStudent.section,
      hostel_name: selectedStudent.hostel_name || 'Vivekananda Boys Hostel',
      warden_out_id: 'WAR001',
      reason
    });

    setSelectedStudent(null);
    await loadData();
  };

  const handleGateIn = async (movementId: string) => {
    await api.recordGateIn(movementId, 'WAR001');
    await loadData();
  };

  const outsideStudents = movements.filter((m) => m.status === 'Outside');
  const returnedStudents = movements.filter((m) => m.status === 'Returned');

  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl font-black text-slate-900">Hostel Security Gate Movement & Outpass Control</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Record physical student exit (Gate Out) and hostel return (Gate In) with warden verification and permanent movement history.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Boarders Currently Outside</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{outsideStudents.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Checked Back In (Today)</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{returnedStudents.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Hostel Residents</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{students.filter(s => s.hostel_type === 'Resident').length}</div>
        </div>
      </div>

      {/* Record Gate Out Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Record New Gate Exit (Outpass)</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-1">
            <label className="font-bold text-slate-700 block mb-1">Search Boarder (Name or EMIS)</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student..."
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
            {searchTerm && (
              <div className="mt-2 max-h-40 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50 divide-y divide-slate-100">
                {filteredStudents.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedStudent(s);
                      setSearchTerm('');
                    }}
                    className="p-2.5 hover:bg-indigo-50 cursor-pointer font-medium"
                  >
                    <div className="font-bold text-slate-900">{s.full_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {s.user_id} • Class {s.student_class}-{s.section}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sm:col-span-1">
            <label className="font-bold text-slate-700 block mb-1">Selected Student</label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
              {selectedStudent ? `${selectedStudent.full_name} (${selectedStudent.user_id})` : 'No student selected'}
            </div>
          </div>

          <div className="sm:col-span-1">
            <label className="font-bold text-slate-700 block mb-1">Exit Reason / Outpass Note</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGateOut}
            disabled={!selectedStudent}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <DoorOpen className="w-4 h-4" />
            <span>Authorize Gate Out</span>
          </button>
        </div>
      </div>

      {/* Currently Outside Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700">Currently Outside Hostel ({outsideStudents.length})</h3>

        {outsideStudents.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">All boarding students are currently verified inside hostel premises.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">Class & Section</th>
                  <th className="p-3">Time Out</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {outsideStudents.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{m.student_name}</td>
                    <td className="p-3 text-slate-600">Class {m.student_class}-{m.section}</td>
                    <td className="p-3 font-mono font-bold text-amber-700">{m.gate_out_time}</td>
                    <td className="p-3 text-slate-600">{m.reason}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleGateIn(m.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                      >
                        <DoorClosed className="w-3.5 h-3.5" /> Check In
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

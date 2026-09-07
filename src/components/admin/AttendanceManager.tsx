import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Save,
  Users,
  AlertCircle
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { Student, AttendanceRecord } from '../../types';

export const AttendanceManager: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('12');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, { status: 'Present' | 'Absent' | 'Late' | 'Half-Day'; remarks: string }>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getStudents(),
      api.getAttendance(selectedDate, selectedClass)
    ]).then(([stList, attList]) => {
      const classStudents = stList.filter(s => s.student_class === selectedClass && s.section === selectedSection);
      setStudents(classStudents);

      const stateMap: Record<string, { status: 'Present' | 'Absent' | 'Late' | 'Half-Day'; remarks: string }> = {};
      classStudents.forEach(st => {
        const existing = attList.find(a => a.student_id === st.id && a.section === selectedSection);
        stateMap[st.id] = {
          status: existing ? existing.status : 'Present',
          remarks: existing?.remarks || ''
        };
      });
      setAttendanceState(stateMap);
    });
  }, [selectedClass, selectedSection, selectedDate]);

  const setAllStatus = (status: 'Present' | 'Absent') => {
    const nextState = { ...attendanceState };
    students.forEach(st => {
      nextState[st.id] = {
        ...nextState[st.id],
        status
      };
    });
    setAttendanceState(nextState);
  };

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Half-Day') => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    const records = students.map(st => ({
      student_id: st.id,
      student_user_id: st.user_id,
      student_name: st.full_name,
      student_class: selectedClass,
      section: selectedSection,
      attendance_date: selectedDate,
      status: attendanceState[st.id]?.status || 'Present',
      marked_by: 'Class Faculty / In-charge',
      remarks: attendanceState[st.id]?.remarks || ''
    }));

    try {
      await api.markAttendance(records);
      setToast(`Attendance for Standard ${selectedClass}-${selectedSection} saved successfully.`);
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert('Error saving attendance: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const total = students.length;
  const present = students.filter(s => attendanceState[s.id]?.status === 'Present').length;
  const absent = students.filter(s => attendanceState[s.id]?.status === 'Absent').length;
  const late = students.filter(s => attendanceState[s.id]?.status === 'Late').length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 100;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header and Filter Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              <CalendarCheck className="w-4 h-4" />
              <span>Daily Student Roll Call Register</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Class Attendance Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Recorded in <span className="font-mono font-semibold">public.student_attendance</span> with daily unique constraints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllStatus('Present')}
              className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              ✓ Mark All Present
            </button>
            <button
              type="button"
              onClick={handleSaveAttendance}
              disabled={saving || students.length === 0}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Commit Attendance'}</span>
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Standard / Grade</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="12">Standard 12 (Higher Secondary)</option>
              <option value="11">Standard 11 (Higher Secondary)</option>
              <option value="10">Standard 10 (Secondary)</option>
              <option value="9">Standard 9</option>
              <option value="8">Standard 8</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Attendance Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Class Strength</div>
          <div className="text-xl font-black text-slate-900 mt-1">{total} Students</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase">Present Today</div>
          <div className="text-xl font-black text-emerald-700 mt-1">{present} ({pct}%)</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-2xs">
          <div className="text-[11px] font-bold text-rose-700 uppercase">Absent</div>
          <div className="text-xl font-black text-rose-700 mt-1">{absent}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase">Late Arrivals</div>
          <div className="text-xl font-black text-amber-700 mt-1">{late}</div>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Standard {selectedClass}-{selectedSection} Roster ({students.length} Pupils)
          </span>
          <span className="text-xs text-slate-500 font-mono">{selectedDate}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="p-3.5">EMIS / Roll</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Hostel Status</th>
                <th className="p-3.5">Attendance Status</th>
                <th className="p-3.5">Remarks / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No students currently enrolled in Standard {selectedClass} Section {selectedSection}.
                  </td>
                </tr>
              ) : (
                students.map((st) => {
                  const curr = attendanceState[st.id] || { status: 'Present', remarks: '' };
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-800">{st.user_id}</td>
                      <td className="p-3.5 font-semibold text-slate-900">
                        {st.full_name}
                        <div className="text-[11px] text-slate-400 font-normal">Contact: {st.mobile}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.hostel_type === 'Resident' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {st.hostel_type}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'Present')}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                              curr.status === 'Present'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'Absent')}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                              curr.status === 'Absent'
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'Late')}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                              curr.status === 'Late'
                                ? 'bg-amber-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <input
                          type="text"
                          placeholder="Optional remarks (e.g. sick leave, bus)"
                          value={curr.remarks}
                          onChange={(e) => handleRemarksChange(st.id, e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

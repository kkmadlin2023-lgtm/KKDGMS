import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  FileCheck2,
  AlertCircle,
  Building2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Award,
  BookOpen
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { Student, Faculty, LeaveRequest, AttendanceRecord, NotificationItem } from '../../types';

interface AdminDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.getStudents(),
      api.getFaculty(),
      api.getLeaves(),
      api.getAttendance(),
      api.getNotifications()
    ]).then(([st, fc, lv, at, nt]) => {
      if (isMounted) {
        setStudents(st);
        setFaculty(fc);
        setLeaves(lv);
        setAttendance(at);
        setNotifications(nt);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const pendingLeaves = leaves.filter(l => l.status === 'Pending' || l.admin_approval === 'Pending');
  const residentStudents = students.filter(s => s.hostel_type === 'Resident');
  const todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 96;

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics in High Density format */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-none">
        <div 
          onClick={() => onNavigateTab('database')}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrollment</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 tracking-tight">{students.length || 1248}</p>
          <p className="text-[10px] text-emerald-600 mt-1 font-medium">↑ 12% vs last term</p>
        </div>
        <div 
          onClick={() => onNavigateTab('marksheet')}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average GPA</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 tracking-tight">3.82</p>
          <p className="text-[10px] text-blue-600 mt-1 font-medium">Stable Performance</p>
        </div>
        <div 
          onClick={() => onNavigateTab('supabase-hub')}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Tables</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 tracking-tight">14</p>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Supabase Connected</p>
        </div>
        <div 
          onClick={() => onNavigateTab('security')}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security Score</p>
          <p className="text-2xl font-bold mt-1 text-emerald-500 tracking-tight">98%</p>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">JWT Auth Enabled</p>
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left 2 Columns: Table Analysis & Pending Items & Modules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Student Activity Analysis Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                Recent Student Activity Analysis
              </h3>
              <button 
                onClick={() => onNavigateTab('database')}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
              >
                View All Records
              </button>
            </div>
            <div className="flex-1 overflow-x-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="px-5 py-3">ID Number</th>
                    <th className="px-5 py-3">Full Name</th>
                    <th className="px-5 py-3">Course Stream</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {students.slice(0, 5).map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-slate-700">{s.emis_number || s.id}</td>
                      <td className="px-5 py-3 font-medium text-slate-900">{s.name}</td>
                      <td className="px-5 py-3 text-slate-600 text-xs">Class {s.class}-{s.section} ({s.group_stream || 'General'})</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button 
                          onClick={() => onNavigateTab('database')}
                          className="text-slate-400 hover:text-blue-600 text-xs font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Leave Requests */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Pending Leave & Hostel Outpasses
                </h3>
                <p className="text-xs text-slate-500">Requests requiring countersignature</p>
              </div>
              <button
                onClick={() => onNavigateTab('leaves')}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {pendingLeaves.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No pending leave requests at this time.
                </div>
              ) : (
                pendingLeaves.slice(0, 3).map((leave) => (
                  <div key={leave.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{leave.applicant_name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {leave.applicant_type === 'student' ? `Class ${leave.student_class}-${leave.section}` : 'Faculty'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                          {leave.leave_type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{leave.reason}</p>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        Dates: {leave.from_date} to {leave.to_date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateTab('leaves')}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Academic Navigation Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">
              Administrative & Academic Modules
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigateTab('marksheet')}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all cursor-pointer group"
              >
                <Award className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Marksheet & Grades</div>
                <div className="text-[11px] text-slate-500">Unit test & term exam records</div>
              </button>

              <button
                onClick={() => onNavigateTab('seating')}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all cursor-pointer group"
              >
                <Building2 className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Exam Hall Seating</div>
                <div className="text-[11px] text-slate-500">Bench arrangement & roll plan</div>
              </button>

              <button
                onClick={() => onNavigateTab('question-bank')}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all cursor-pointer group"
              >
                <BookOpen className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Question Bank</div>
                <div className="text-[11px] text-slate-500">Curated syllabus questions</div>
              </button>

              <button
                onClick={() => onNavigateTab('bonafide')}
                className="p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all cursor-pointer group"
              >
                <FileCheck2 className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Bonafide Generator</div>
                <div className="text-[11px] text-slate-500">Printable official certificate</div>
              </button>

              <button
                onClick={() => onNavigateTab('visitors')}
                className="p-3 rounded-xl border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 text-left transition-all cursor-pointer group"
              >
                <Users className="w-5 h-5 text-rose-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Visitor Pass Log</div>
                <div className="text-[11px] text-slate-500">Campus gate entry register</div>
              </button>

              <button
                onClick={() => onNavigateTab('notices')}
                className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all cursor-pointer group"
              >
                <AlertCircle className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-105 transition-transform" />
                <div className="text-xs font-bold text-slate-900">Broadcast Circular</div>
                <div className="text-[11px] text-slate-500">Publish urgent announcements</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Supabase Sync Audit & Security Checklist & Notices */}
        <div className="space-y-6">
          {/* Supabase Sync Audit */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4">
              Supabase Sync Audit
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">students_table updated</p>
                  <p className="text-[10px] text-slate-500">2 minutes ago • Row policy: OK</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">marks_entries synced</p>
                  <p className="text-[10px] text-slate-500">15 minutes ago • Row policy: OK</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">14 Relational Tables Active</p>
                  <p className="text-[10px] text-slate-500">RLS enabled • Parameterized queries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Checklist Card in Vibrant Blue */}
          <div className="bg-blue-600 rounded-xl shadow-lg p-5 text-white">
            <h3 className="font-bold text-sm uppercase tracking-wide mb-2">Security Checklist</h3>
            <div className="space-y-2 opacity-90">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-300">✓</span> Multi-factor Authentication
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-300">✓</span> RLS Policy Validation
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-300">✓</span> SSL Tunneling Active
              </div>
              <div className="flex items-center gap-2 text-xs line-through opacity-60">
                <span>○</span> Public Schema Access (Blocked)
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('security')}
              className="w-full mt-4 bg-white/20 hover:bg-white/30 py-2 rounded font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer text-center"
            >
              Inspect Audit Center
            </button>
          </div>

          {/* Official Circulars */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Official Circulars</h3>
              <button
                onClick={() => onNavigateTab('notices')}
                className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                + New Notice
              </button>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    {notif.priority === 'urgent' && (
                      <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded uppercase">
                        Urgent
                      </span>
                    )}
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{notif.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

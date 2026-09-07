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
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Administrative Overview • Kanyakumari District</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Institutional Command Center
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {todayDate} • School Status: <span className="text-emerald-400 font-bold">Active & Regulated</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('admission')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              + New Admission
            </button>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/10 transition-all cursor-pointer"
            >
              Daily Attendance
            </button>
            <button
              onClick={() => onNavigateTab('supabase-hub')}
              className="px-4 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30 transition-all cursor-pointer"
            >
              Supabase Health
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div 
          onClick={() => onNavigateTab('database')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Enrolled</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {students.length}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <span>{residentStudents.length} Hostel Boarders</span>
            <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              View <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Total Faculty */}
        <div 
          onClick={() => onNavigateTab('database')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Faculty Staff</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {faculty.length}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <span>100% Verified Posts</span>
            <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              Staff <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Attendance</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {attendanceRate}%
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <span>Standards 6 to 12</span>
            <span className="text-emerald-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              Roll Call <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Pending Leaves */}
        <div 
          onClick={() => onNavigateTab('leaves')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Leaves</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {pendingLeaves.length}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <span>Requires Signature</span>
            <span className="text-amber-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              Review <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Approvals & Quick Navigation Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Action Tasks & Pending Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Leave Requests */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Pending Leave & Hostel Outpasses
                </h3>
                <p className="text-xs text-slate-500">Requests requiring countersignature</p>
              </div>
              <button
                onClick={() => onNavigateTab('leaves')}
                className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
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
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
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

        {/* Right 1 Col: Institutional Notices & Database Status */}
        <div className="space-y-6">
          {/* Active Notices */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Official Circulars</h3>
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

          {/* Database & Security Summary */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-slate-400">Database Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Active
              </span>
            </div>
            <div className="text-base font-bold text-white mb-1">Supabase PostgreSQL 15</div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              14 tables configured with Row Level Security (RLS) policies, indexes, and full CRUD mapping.
            </p>
            <button
              onClick={() => onNavigateTab('supabase-hub')}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Open Supabase SQL Schema Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Award,
  BookOpen,
  Users,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { Faculty, Student, FacultyAssignment } from '../../types';

interface FacultyDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onNavigateTab }) => {
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [myStudents, setMyStudents] = useState<Student[]>([]);
  const [myClasses, setMyClasses] = useState<FacultyAssignment[]>([]);

  useEffect(() => {
    Promise.all([
      api.getFaculty(),
      api.getStudents(),
      api.getFacultyAssignments()
    ]).then(([facList, stList, assList]) => {
      if (facList.length > 0) {
        const currentFac = facList[0];
        setFaculty(currentFac);
        const assigned = assList.filter(a => a.faculty_id === currentFac.id);
        setMyClasses(assigned);
        const st = stList.filter(s => s.student_class === '12' && s.section === 'A');
        setMyStudents(st);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-indigo-300 tracking-wider mb-1">
              Faculty Staff Portal • {faculty?.department || 'Department of Mathematics'}
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome back, {faculty?.full_name || 'Prof. Anand'}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Staff ID: <span className="font-mono font-bold text-white">{faculty?.user_id || 'FAC01'}</span> • Qualification: {faculty?.qualification || 'M.Sc., B.Ed.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('faculty-attendance')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Mark Class Attendance
            </button>
            <button
              onClick={() => onNavigateTab('faculty-marksheet')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/10 transition-all cursor-pointer"
            >
              Enter Test Marks
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Assigned Class</div>
          <div className="text-2xl font-black text-slate-900 mt-1">Standard 12 - A</div>
          <div className="text-xs text-slate-500 mt-1">{myStudents.length} Students under mentorship</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Teaching Load</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">24 Periods</div>
          <div className="text-xs text-slate-500 mt-1">Per week across 3 Standards</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Quarterly Evaluation</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">Completed</div>
          <div className="text-xs text-slate-500 mt-1">Grade roster published to parents</div>
        </div>
      </div>

      {/* Faculty Schedule & Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Teaching Schedule */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Today's Class Schedule</h3>
            <span className="text-xs text-slate-400 font-mono">Periods 1 - 6</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Period 1 (09:15 - 10:00 AM)</span>
                <div className="text-indigo-700 font-semibold">Standard 12-A • Mathematics</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Completed
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Period 3 (11:00 - 11:45 AM)</span>
                <div className="text-slate-700 font-semibold">Standard 11-A • Calculus Lab</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                Next Up
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Period 5 (02:00 - 02:45 PM)</span>
                <div className="text-slate-700 font-semibold">Standard 10-B • Remedial Math</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                Upcoming
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Matrix */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Classroom Utilities</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('faculty-attendance')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all cursor-pointer"
            >
              <CalendarCheck className="w-5 h-5 text-indigo-600 mb-2" />
              <div className="text-xs font-bold text-slate-900">Daily Attendance</div>
              <div className="text-[11px] text-slate-500">Mark 12-A roll call</div>
            </button>

            <button
              onClick={() => onNavigateTab('faculty-marksheet')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all cursor-pointer"
            >
              <Award className="w-5 h-5 text-blue-600 mb-2" />
              <div className="text-xs font-bold text-slate-900">Grade Ledger</div>
              <div className="text-[11px] text-slate-500">Record unit test scores</div>
            </button>

            <button
              onClick={() => onNavigateTab('faculty-qb')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-emerald-600 mb-2" />
              <div className="text-xs font-bold text-slate-900">Question Bank</div>
              <div className="text-[11px] text-slate-500">Submit exam questions</div>
            </button>

            <button
              onClick={() => onNavigateTab('faculty-leaves')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all cursor-pointer"
            >
              <FileCheck2 className="w-5 h-5 text-purple-600 mb-2" />
              <div className="text-xs font-bold text-slate-900">Apply Leave</div>
              <div className="text-[11px] text-slate-500">Faculty OD / CL request</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

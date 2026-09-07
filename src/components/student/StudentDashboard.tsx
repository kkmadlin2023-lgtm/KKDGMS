import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  CalendarCheck,
  FileCheck2,
  Scroll,
  UserCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { Student } from '../../types';

interface StudentDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateTab }) => {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    api.getStudents().then(list => {
      if (list.length > 0) {
        setStudent(list[0]);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-200 font-extrabold text-2xl flex items-center justify-center">
              {student?.full_name?.charAt(0) || 'D'}
            </div>
            <div>
              <div className="text-xs font-mono text-blue-300 uppercase tracking-wider">
                Student Academic Workspace • EMIS: {student?.user_id || 'EMIS202401'}
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {student?.full_name || 'A. Dhanush Kumar'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Standard {student?.student_class || '12'} - Section {student?.section || 'A'} • {student?.student_group || 'Maths-Biology'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('student-leaves')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Apply Outpass / Leave
            </button>
            <button
              onClick={() => onNavigateTab('student-bonafide')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/10 transition-all cursor-pointer"
            >
              Get Bonafide
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Attendance Rate</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">96.4%</div>
          <div className="text-xs text-slate-500 mt-1">Eligible for State Board Exams</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Quarterly GPA</div>
          <div className="text-2xl font-black text-blue-600 mt-1">Grade A1</div>
          <div className="text-xs text-slate-500 mt-1">Score: 92/100 in Mathematics</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Hostel Boarding</div>
          <div className="text-2xl font-black text-amber-700 mt-1">Resident</div>
          <div className="text-xs text-slate-500 mt-1">Vivekananda Boys Hostel • Room 204</div>
        </div>
      </div>

      {/* Student Utilities Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Student Academic Services</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateTab('student-marksheet')}
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-all cursor-pointer group"
          >
            <Award className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-105 transition-transform" />
            <div className="text-sm font-bold text-slate-900">My Progress Report Card</div>
            <p className="text-xs text-slate-500 mt-1">
              View marks, ranks, subject-wise grades, and teacher remarks.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('student-qb')}
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition-all cursor-pointer group"
          >
            <BookOpen className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-105 transition-transform" />
            <div className="text-sm font-bold text-slate-900">Question Bank Practice</div>
            <p className="text-xs text-slate-500 mt-1">
              Explore state board model questions and previous year papers.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('student-bonafide')}
            className="p-4 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all cursor-pointer group"
          >
            <Scroll className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-105 transition-transform" />
            <div className="text-sm font-bold text-slate-900">Bonafide Certificate</div>
            <p className="text-xs text-slate-500 mt-1">
              Request official school bonafide for passport or bus concession.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

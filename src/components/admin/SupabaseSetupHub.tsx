import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  Copy,
  Download,
  Terminal,
  Shield,
  Table,
  Check,
  ExternalLink,
  RefreshCw,
  Key
} from 'lucide-react';

export const SupabaseSetupHub: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const tables = [
    { name: 'admins', records: '2 Super Admins', rls: 'Enforced', desc: 'Principal, Headmaster & System Admin accounts' },
    { name: 'faculty_details', records: '3 Faculty Staff', rls: 'Enforced', desc: 'Teachers, HODs, subjects & department info' },
    { name: 'wardens', records: '2 Hostel Wardens', rls: 'Enforced', desc: 'Boys & Girls hostel warden assignments' },
    { name: 'students', records: '3 Enrolled Students', rls: 'Enforced', desc: 'Full student directory, EMIS, class, hostel status' },
    { name: 'student_attendance', records: 'Daily Register', rls: 'Enforced', desc: 'Class-wise daily roll call & attendance tracking' },
    { name: 'marks_entries', records: 'Exam Ledger', rls: 'Enforced', desc: 'Quarterly, half-yearly & model exam marks + grades' },
    { name: 'student_leaves', records: 'Dual Signatures', rls: 'Enforced', desc: 'Hostel outpasses & leaves with Warden+Admin signatures' },
    { name: 'question_bank', records: 'Curriculum Items', rls: 'Enforced', desc: 'Subject questions for standards 6 to 12' },
    { name: 'exam_seating', records: 'Bench Matrix', rls: 'Enforced', desc: 'Anti-copying exam hall bench arrangements' },
    { name: 'faculty_assignments', records: 'Teacher Timetable', rls: 'Enforced', desc: 'Faculty subject allocations and weekly periods' },
    { name: 'bonafide_requests', records: 'Official Certs', rls: 'Enforced', desc: 'Government Bonafide certificate generator log' },
    { name: 'visitor_passes', records: 'Gate Security', rls: 'Enforced', desc: 'Security gate pass log and check-out tracking' },
    { name: 'notifications', records: 'Broadcast Feeds', rls: 'Enforced', desc: 'Official school circulars and priority bulletins' },
    { name: 'audit_logs', records: 'System Security', rls: 'Enforced', desc: 'Authentication attempts & administrative audit trails' },
  ];

  const handleCopySQL = () => {
    fetch('/supabase_schema.sql')
      .then(res => res.text())
      .then(sql => {
        navigator.clipboard.writeText(sql);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        navigator.clipboard.writeText('-- KKDGMS Complete Supabase Schema in /supabase_schema.sql');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
  };

  const handleDownloadSQL = () => {
    const link = document.createElement('a');
    link.href = '/supabase_schema.sql';
    link.download = 'kkdgms_supabase_schema.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              <Database className="w-4 h-4" />
              <span>PostgreSQL 15 Schema Architecture</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Supabase Database Synchronization Hub
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              14 relationally linked tables with Row Level Security (RLS) policies and fallback resilience.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySQL}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'SQL Script Copied!' : 'Copy Schema SQL'}</span>
            </button>
            <button
              onClick={handleDownloadSQL}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download .sql</span>
            </button>
          </div>
        </div>
      </div>

      {/* How to deploy in Supabase Instructions */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
          <Terminal className="w-4 h-4" />
          <span>Step-by-Step Supabase Setup Instructions</span>
        </div>
        <h3 className="text-base font-bold text-white mb-2">
          How to apply this schema to your Supabase Project
        </h3>
        <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
          <li>
            Log in to your <strong className="text-white">Supabase Dashboard</strong> (supabase.com) and select your school project.
          </li>
          <li>
            In the left sidebar, click on <strong className="text-white">SQL Editor</strong> (the terminal icon).
          </li>
          <li>
            Click <strong className="text-white">+ New Query</strong>, click <strong className="text-emerald-400">Copy Schema SQL</strong> above, and paste into the editor.
          </li>
          <li>
            Click the green <strong className="text-white">Run</strong> button. This creates all 14 tables, triggers, and seed accounts.
          </li>
          <li>
            Copy your <strong className="text-white">Project URL</strong> and <strong className="text-white">anon public key</strong> from Project Settings &gt; API into your environment or <strong className="text-mono text-emerald-300">.env</strong>.
          </li>
        </ol>
      </div>

      {/* 14 Tables Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            PostgreSQL Database Schema (14 Tables Configured)
          </span>
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> All Tables RLS Protected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="divide-y divide-slate-100">
            {tables.slice(0, 7).map((tbl) => (
              <div key={tbl.name} className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-blue-600" />
                    <span className="font-mono text-xs font-bold text-slate-900">
                      public.{tbl.name}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    RLS Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{tbl.desc}</p>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Initial Seed: {tbl.records}
                </div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {tables.slice(7).map((tbl) => (
              <div key={tbl.name} className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-indigo-600" />
                    <span className="font-mono text-xs font-bold text-slate-900">
                      public.{tbl.name}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    RLS Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{tbl.desc}</p>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Initial Seed: {tbl.records}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

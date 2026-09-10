// =====================================================================
// KKDGMS — Master Navigation Sidebar (All 6 Roles Supported)
// =====================================================================

import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarCheck,
  Award,
  FileCheck2,
  BookOpen,
  Grid3X3,
  GitBranch,
  Scroll,
  ShieldAlert,
  Database,
  Megaphone,
  UserCheck,
  Building2,
  DoorOpen,
  HelpCircle,
  FileText,
  MonitorPlay,
  ArrowRightLeft,
  Sparkles,
  MessageSquare,
  Wrench,
  DollarSign,
  Globe,
  Lock,
  KeyRound
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onViewPublicSite: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  category?: string;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
  onViewPublicSite
}) => {
  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard, category: 'Main' },
          { id: 'database', label: 'Master Directory', icon: Users, category: 'Academic' },
          { id: 'admission', label: 'Admission Desk (5 Forms)', icon: UserPlus, category: 'Academic' },
          { id: 'attendance', label: 'Attendance & Analytics', icon: CalendarCheck, category: 'Academic' },
          { id: 'marksheet', label: 'Marksheet & Grades', icon: Award, category: 'Academic' },
          { id: 'online-exams', label: 'Online Exam Studio', icon: MonitorPlay, category: 'Academic' },
          { id: 'question-bank', label: 'Question Bank', icon: BookOpen, category: 'Academic' },
          { id: 'leaves', label: 'Leave Approvals', icon: FileCheck2, category: 'Administration' },
          { id: 'faculty-assign', label: 'Faculty Allocation', icon: GitBranch, category: 'Administration' },
          { id: 'bonafide', label: 'Bonafide Generator', icon: Scroll, category: 'Administration' },
          { id: 'visitors', label: 'Visitor Pass Register', icon: DoorOpen, category: 'Security' },
          { id: 'stories-events', label: '24h Stories & Events', icon: Sparkles, category: 'Communication' },
          { id: 'fcm-notices', label: 'FCM Push Circulars', icon: Megaphone, category: 'Communication' },
          { id: 'feedback', label: 'Feedback Console', icon: MessageSquare, category: 'Communication' },
          { id: 'permissions', label: 'Role Permissions Matrix', icon: Lock, category: 'Security' },
          { id: 'database-crud', label: 'Database CRUD Console', icon: Database, category: 'Database', badge: 'Admin Safe' },
          { id: 'security', label: 'Security & Audit Logs', icon: ShieldAlert, category: 'Security' },
          { id: 'supabase-hub', label: 'Supabase SQL Hub', icon: Database, category: 'Database', badge: '14 Tables' },
        ];
      case 'faculty':
        return [
          { id: 'faculty-dashboard', label: 'Faculty Overview', icon: LayoutDashboard, category: 'Main' },
          { id: 'faculty-attendance', label: 'Mark Attendance', icon: CalendarCheck, category: 'Classroom' },
          { id: 'faculty-marksheet', label: 'Marks & Evaluations', icon: Award, category: 'Classroom' },
          { id: 'faculty-online-exam', label: 'Online Exam Studio (OTP)', icon: MonitorPlay, category: 'Academics' },
          { id: 'faculty-qb', label: 'Question Bank Entry', icon: BookOpen, category: 'Academics' },
          { id: 'faculty-leaves', label: 'Student Leave (WhatsApp)', icon: FileCheck2, category: 'Requests' },
          { id: 'faculty-students', label: 'Class Students Roster', icon: Users, category: 'Classroom' },
          { id: 'faculty-feedback', label: 'Submit Feedback', icon: MessageSquare, category: 'Personal' }
        ];
      case 'student':
        return [
          { id: 'student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard, category: 'Main' },
          { id: 'student-exam-portal', label: 'Take Online Exam (OTP)', icon: MonitorPlay, category: 'Academics' },
          { id: 'student-marksheet', label: 'My Report Card & Tests', icon: Award, category: 'Academics' },
          { id: 'student-qb', label: 'Question Bank Practice', icon: BookOpen, category: 'Academics' },
          { id: 'student-leaves', label: 'Apply Leave / Outpass', icon: FileCheck2, category: 'Requests' },
          { id: 'student-bonafide', label: 'Bonafide Certificate', icon: Scroll, category: 'Requests' },
          { id: 'student-profile', label: 'My Digital ID Profile', icon: UserCheck, category: 'Personal' },
          { id: 'student-feedback', label: 'Student Feedback', icon: MessageSquare, category: 'Personal' }
        ];
      case 'warden':
        return [
          { id: 'warden-dashboard', label: 'Hostel Dashboard', icon: Building2, category: 'Main' },
          { id: 'warden-gate', label: 'Gate In / Gate Out Movement', icon: ArrowRightLeft, category: 'Movement' },
          { id: 'warden-leaves', label: 'Hostel Outpass Passes', icon: FileCheck2, category: 'Movement' },
          { id: 'warden-residents', label: 'Boarder Directory', icon: Users, category: 'Hostel' },
          { id: 'warden-visitors', label: 'Hostel Visitor Log', icon: DoorOpen, category: 'Security' }
        ];
      case 'technician':
        return [
          { id: 'technician-dashboard', label: 'Technician Command', icon: Wrench, category: 'Main' },
          { id: 'technician-qp', label: 'Question Paper Maker', icon: FileText, category: 'Examination Cell' },
          { id: 'technician-docs', label: 'Documentary Desk', icon: BookOpen, category: 'Documentation' },
          { id: 'technician-expenses', label: 'Expense Accounting', icon: DollarSign, category: 'Accounts' },
          { id: 'technician-periods', label: 'Period & Timetable', icon: CalendarCheck, category: 'Schedule' }
        ];
      case 'guest':
        return [
          { id: 'guest-dashboard', label: 'Guest Overview', icon: Globe, category: 'Main' },
          { id: 'supabase-hub', label: 'Public System Info', icon: Database, category: 'System' }
        ];
    }
  };

  const navItems = getNavItems();
  const categories = Array.from(new Set(navItems.map(item => item.category || 'General')));

  return (
    <aside className="w-64 bg-slate-900 flex flex-col border-r border-slate-800 shadow-xl text-slate-300 h-full flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 flex items-center gap-3 border-b border-slate-800">
        <img src="/kk.png" alt="Logo" className="w-9 h-9 rounded-xl object-contain bg-slate-800 p-1 border border-white/10" onError={(e) => { (e.target as any).src = '/icon.jpg'; }} />
        <div className="min-w-0">
          <h1 className="font-black text-white tracking-tight leading-tight text-xs uppercase">
            KKDGMS
            <span className="text-amber-400 text-[10px] block font-semibold truncate">Model School ERP</span>
          </h1>
        </div>
      </div>

      {/* Workspace Role Bar */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-[11px]">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Active Workspace</span>
        <span className="text-xs font-bold text-amber-400 capitalize flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          {currentRole}
        </span>
      </div>

      {/* Public Home Button */}
      <div className="p-3 border-b border-slate-800">
        <button
          onClick={onViewPublicSite}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-white/5 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>View Public Website</span>
        </button>
      </div>

      {/* Navigation Links Scrollable */}
      <nav className="flex-1 py-3 overflow-y-auto px-3 space-y-3">
        {categories.map(cat => (
          <div key={cat} className="space-y-1">
            <div className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
              {cat}
            </div>
            {navItems
              .filter(item => (item.category || 'General') === cat)
              .map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-xs ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300 font-mono shrink-0 ml-1">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Supabase Status Footer Box */}
      <div className="p-3.5 mt-auto border-t border-slate-800">
        <button
          onClick={() => onSelectTab('supabase-hub')}
          className="w-full text-left bg-slate-950/80 rounded-xl p-3 space-y-1.5 hover:bg-slate-950 transition-colors cursor-pointer block border border-white/5"
        >
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <span>Supabase RLS Engine</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Active
            </span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>Security Layer</span>
            <span className="text-indigo-400 font-bold">14+ Tables</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

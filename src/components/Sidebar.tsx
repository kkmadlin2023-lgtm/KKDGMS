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
  FileText
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
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
  onSelectTab
}) => {
  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard, category: 'Main' },
          { id: 'database', label: 'Master Directory', icon: Users, category: 'Academic' },
          { id: 'admission', label: 'New Admission', icon: UserPlus, category: 'Academic' },
          { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck, category: 'Academic' },
          { id: 'marksheet', label: 'Marksheet & Grades', icon: Award, category: 'Academic' },
          { id: 'leaves', label: 'Leave Approvals', icon: FileCheck2, category: 'Administration' },
          { id: 'question-bank', label: 'Question Bank', icon: BookOpen, category: 'Academic' },
          { id: 'seating', label: 'Bench & Exam Seating', icon: Grid3X3, category: 'Administration' },
          { id: 'faculty-assign', label: 'Faculty Allocation', icon: GitBranch, category: 'Administration' },
          { id: 'bonafide', label: 'Bonafide Generator', icon: Scroll, category: 'Administration' },
          { id: 'visitors', label: 'Visitor Pass Register', icon: DoorOpen, category: 'Security' },
          { id: 'notices', label: 'Notice Board Broadcast', icon: Megaphone, category: 'Communication' },
          { id: 'security', label: 'Security & Audit Logs', icon: ShieldAlert, category: 'Security' },
          { id: 'supabase-hub', label: 'Supabase SQL Hub', icon: Database, category: 'Database', badge: '14 Tables' },
        ];
      case 'faculty':
        return [
          { id: 'faculty-dashboard', label: 'Faculty Overview', icon: LayoutDashboard, category: 'Main' },
          { id: 'faculty-attendance', label: 'Mark Attendance', icon: CalendarCheck, category: 'Classroom' },
          { id: 'faculty-marksheet', label: 'Marks & Evaluations', icon: Award, category: 'Classroom' },
          { id: 'faculty-qb', label: 'Question Bank Entry', icon: BookOpen, category: 'Academics' },
          { id: 'faculty-leaves', label: 'Staff Leave Requests', icon: FileCheck2, category: 'Personal' },
          { id: 'faculty-students', label: 'Class Students Roster', icon: Users, category: 'Classroom' },
          { id: 'supabase-hub', label: 'Supabase Sync Info', icon: Database, category: 'System' },
        ];
      case 'student':
        return [
          { id: 'student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard, category: 'Main' },
          { id: 'student-marksheet', label: 'My Report Card', icon: Award, category: 'Academics' },
          { id: 'student-qb', label: 'Question Bank Practice', icon: BookOpen, category: 'Academics' },
          { id: 'student-leaves', label: 'Apply Leave / Outpass', icon: FileCheck2, category: 'Requests' },
          { id: 'student-bonafide', label: 'Bonafide Certificate', icon: Scroll, category: 'Requests' },
          { id: 'student-profile', label: 'My Digital ID Profile', icon: UserCheck, category: 'Personal' },
        ];
      case 'warden':
        return [
          { id: 'warden-dashboard', label: 'Hostel Dashboard', icon: Building2, category: 'Main' },
          { id: 'warden-leaves', label: 'Hostel Outpass Passes', icon: FileCheck2, category: 'Movement' },
          { id: 'warden-visitors', label: 'Hostel Visitor Log', icon: DoorOpen, category: 'Security' },
          { id: 'warden-residents', label: 'Inmate Student Directory', icon: Users, category: 'Hostel' },
          { id: 'supabase-hub', label: 'Database Status', icon: Database, category: 'System' },
        ];
    }
  };

  const navItems = getNavItems();
  const categories = Array.from(new Set(navItems.map(item => item.category || 'General')));

  return (
    <aside className="w-64 bg-slate-800 flex flex-col border-r border-slate-700 shadow-xl text-slate-300 h-full flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-700">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white shadow-lg text-sm shrink-0">
          K
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-white tracking-tight leading-tight text-sm">
            KKDGMS
            <span className="text-blue-400 text-xs block font-normal truncate">School Management</span>
          </h1>
        </div>
      </div>

      {/* Workspace Role Bar */}
      <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-700 flex items-center justify-between text-[11px]">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Workspace</span>
        <span className="text-xs font-semibold text-blue-300 capitalize flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          {currentRole} Portal
        </span>
      </div>

      {/* Navigation Links Scrollable */}
      <nav className="flex-1 py-3 overflow-y-auto px-3 space-y-3">
        {categories.map(cat => (
          <div key={cat} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer text-xs ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 rounded-md font-medium border-l-2 border-blue-500'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 font-mono shrink-0 ml-1">
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
      <div className="p-4 mt-auto border-t border-slate-700">
        <button
          onClick={() => onSelectTab('supabase-hub')}
          className="w-full text-left bg-slate-900 rounded-lg p-3 space-y-2 hover:bg-slate-900/80 transition-colors cursor-pointer block"
        >
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <span>Supabase Status</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Linked
            </span>
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-full"></div>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between italic">
            <span>Tables synchronized</span>
            <span className="font-mono text-slate-500 not-italic text-[9px]">14 RLS</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

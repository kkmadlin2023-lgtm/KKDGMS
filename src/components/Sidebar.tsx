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
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col h-[calc(100vh-69px)] sticky top-[69px] border-r border-slate-800">
      {/* Role Banner */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
          Current Workspace
        </div>
        <div className="text-sm font-bold text-white capitalize mt-0.5 flex items-center justify-between">
          <span>{currentRole} Portal</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
      </div>

      {/* Navigation Links Scrollable */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      {/* Bottom Info Footer */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between bg-slate-950/30">
        <span className="truncate">KKDGMS v2.4 (Clean)</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800/50">
          Ready
        </span>
      </div>
    </aside>
  );
};

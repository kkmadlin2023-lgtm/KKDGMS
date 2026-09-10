// =====================================================================
// KKDGMS — Master Navigation Header (All 6 Roles Supported)
// =====================================================================

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Shield,
  UserCheck,
  GraduationCap,
  Briefcase,
  Home,
  Database,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Wrench,
  LogOut
} from 'lucide-react';
import { ActiveUserSession, UserRole, NotificationItem } from '../types';
import { checkSupabaseHealth, api } from '../lib/supabase';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeSession?: ActiveUserSession;
  onOpenLogin?: () => void;
  onNavigateTab: (tabId: string) => void;
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
  onViewPublicSite: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeSession = {
    user_id: 'AD-2024-001',
    role: 'admin',
    full_name: 'Dr. S. Sundararajan, Principal',
    email: 'principal@kkdgms.edu.in'
  },
  onOpenLogin,
  onNavigateTab,
  activeTab = 'dashboard',
  onViewPublicSite,
  onSignOut
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  useEffect(() => {
    api.getNotifications().then(setNotifications);
  }, []);

  const getSectionTitle = (tab?: string): string => {
    switch (tab) {
      case 'dashboard': return 'Primary Analytics';
      case 'database': return 'Master Directory';
      case 'admission': return 'Admission Desk (5 Forms)';
      case 'attendance': return 'Daily Roll Call & Analytics';
      case 'marksheet': return 'Academic Evaluation & Marksheets';
      case 'online-exams':
      case 'faculty-online-exam':
      case 'student-exam-portal': return 'Online Examination Center';
      case 'leaves': return 'Leave Approvals';
      case 'question-bank':
      case 'faculty-qb':
      case 'student-qb': return 'Question Bank';
      case 'faculty-assign': return 'Faculty Allocation';
      case 'bonafide': return 'Official Certificates';
      case 'visitors': return 'Campus Gate Register';
      case 'stories-events': return '24h Stories & Events';
      case 'fcm-notices': return 'FCM Push Circulars';
      case 'feedback': return 'Feedback Console';
      case 'permissions': return 'Role Permissions Matrix';
      case 'database-crud': return 'Database CRUD Console';
      case 'security': return 'Security & Audit Logs';
      case 'supabase-hub': return 'Supabase PostgreSQL Hub';
      case 'faculty-dashboard': return 'Faculty Command';
      case 'faculty-attendance': return 'Class Attendance';
      case 'faculty-marksheet': return 'Exam Marksheet';
      case 'faculty-leaves': return 'Student Leave via WhatsApp';
      case 'faculty-students': return 'Student Roster';
      case 'student-dashboard': return 'Student Dashboard';
      case 'student-marksheet': return 'Progress Report';
      case 'student-leaves': return 'Leave & Outpass';
      case 'student-bonafide': return 'Bonafide Request';
      case 'student-profile': return 'Digital ID Profile';
      case 'warden-dashboard': return 'Hostel Dashboard';
      case 'warden-gate': return 'Gate In / Out Movement';
      case 'warden-leaves': return 'Hostel Outpass Passes';
      case 'warden-visitors': return 'Hostel Visitor Log';
      case 'warden-residents': return 'Boarder Directory';
      case 'technician-dashboard': return 'Technician Command';
      case 'technician-qp': return 'Question Paper Maker';
      case 'technician-docs': return 'Documentary Desk';
      case 'technician-expenses': return 'Expense Accounting';
      case 'technician-periods': return 'Master Period Schedule';
      case 'guest-dashboard': return 'Guest Dashboard';
      default: return 'Primary Analytics';
    }
  };

  const roleLabels: Record<UserRole, { title: string; color: string; icon: any }> = {
    admin: { title: 'Principal / Admin', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Shield },
    faculty: { title: 'Faculty Staff', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Briefcase },
    student: { title: 'Student Portal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: GraduationCap },
    warden: { title: 'Hostel Warden', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Home },
    technician: { title: 'Technician', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: Wrench },
    guest: { title: 'Guest User', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Globe }
  };

  const currentRoleConfig = roleLabels[currentRole] || roleLabels.admin;
  const CurrentIcon = currentRoleConfig.icon;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 shrink-0 z-20">
      {/* Section Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">
          Section: {getSectionTitle(activeTab)}
        </span>
        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>
        <span className="text-sm font-semibold text-slate-600 hidden sm:inline truncate">
          Academic Session 2024/25
        </span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Public Website CTA */}
        <button
          onClick={onViewPublicSite}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer border border-indigo-200"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public Website</span>
        </button>

        {/* System Secure Badge */}
        <div className="relative px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium flex items-center gap-2 text-slate-700 border border-slate-200/80 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="hidden md:inline font-semibold text-slate-700">RLS Active</span>
        </div>

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:opacity-90 cursor-pointer ${currentRoleConfig.color}`}
          >
            <CurrentIcon className="w-4 h-4" />
            <span className="hidden md:inline">{currentRoleConfig.title}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Operating Portal
              </div>
              {(Object.keys(roleLabels) as UserRole[]).map((role) => {
                const item = roleLabels[role];
                const Icon = item.icon;
                const isCurrent = currentRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      isCurrent ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span>{item.title}</span>
                    </div>
                    {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
            title="Notifications & Circulars"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Circulars & Notices</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                  {notifications.length} Active
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-1.5 mb-1">
                      {n.priority === 'urgent' && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded">URGENT</span>
                      )}
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{n.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Sign Out */}
        <div
          onClick={onOpenLogin}
          className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
          title="Account Information & Portal Switch"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
            {activeSession.full_name ? activeSession.full_name.charAt(0) : 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[130px]">
              {activeSession.full_name?.split(',')[0]}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              {activeSession.user_id}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

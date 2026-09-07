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
  AlertTriangle
} from 'lucide-react';
import { ActiveUserSession, UserRole, NotificationItem } from '../types';
import { checkSupabaseHealth, api } from '../lib/supabase';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeSession: ActiveUserSession;
  onOpenLogin: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeSession,
  onOpenLogin,
  onNavigateTab
}) => {
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; latency: number; checking: boolean }>({
    connected: false,
    latency: 0,
    checking: true
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  useEffect(() => {
    let isMounted = true;
    checkSupabaseHealth().then(res => {
      if (isMounted) {
        setDbStatus({
          connected: res.connected,
          latency: res.latencyMs,
          checking: false
        });
      }
    });

    api.getNotifications().then(notifs => {
      if (isMounted) setNotifications(notifs);
    });

    return () => { isMounted = false; };
  }, []);

  const roleLabels: Record<UserRole, { title: string; color: string; icon: any }> = {
    admin: { title: 'Principal / Admin', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Shield },
    faculty: { title: 'Faculty Staff', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Briefcase },
    student: { title: 'Student Portal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: GraduationCap },
    warden: { title: 'Hostel Warden', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Home }
  };

  const currentRoleConfig = roleLabels[currentRole];
  const CurrentIcon = currentRoleConfig.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top Govt Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Government of Tamil Nadu • School Education Department</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigateTab('supabase-hub')}
            className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Supabase Sync</span>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${dbStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
          </button>
          <span className="hidden sm:inline">Academic Session: 2024-2025</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* School Crest & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shadow-xs overflow-hidden">
            <img 
              src="/kk.png" 
              alt="KKDGMS Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback placeholder icon
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                KKDGMS
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                Model School
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-none">
              Kanyakumari District Government Model School
            </p>
          </div>
        </div>

        {/* Center/Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-2xs hover:opacity-90 cursor-pointer ${currentRoleConfig.color}`}
            >
              <CurrentIcon className="w-4 h-4" />
              <span className="hidden md:inline">{currentRoleConfig.title}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Portal Role
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
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${isCurrent ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-600'}`}
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

          {/* Database Setup & SQL Button */}
          <button
            onClick={() => onNavigateTab('supabase-hub')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
            title="Inspect Supabase Tables & Schema"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>SQL Schema</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
              title="Circulars & Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">School Notices & Circulars</span>
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
                      <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                        {n.created_by}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Login Info */}
          <div 
            onClick={onOpenLogin}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
            title="User Profile & Security Management"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center border border-slate-300">
              {activeSession.full_name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-none">
                {activeSession.full_name.split(',')[0]}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {activeSession.user_id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

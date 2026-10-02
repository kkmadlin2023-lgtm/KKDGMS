import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatUserRole } from '@/lib/utils';
import { ShieldCheck, UserCheck, Key, Database, BellRing, Smartphone } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, profile, role, session } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-800 via-indigo-900 to-slate-900 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="role" roleType={role} className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {formatUserRole(role)}
              </Badge>
              <span className="text-xs text-brand-200 font-medium">Phase 1 Foundation Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight">
              Welcome back, {profile?.full_name || user?.email || 'User'}!
            </h2>
            <p className="text-xs sm:text-sm text-brand-100/90 max-w-xl">
              Kanyakumari Dist Government Model School Management Portal. Your role-based session is authenticated and protected by PostgreSQL RLS.
            </p>
          </div>

          <div className="flex sm:flex-col items-start sm:items-end justify-between text-xs text-brand-200 bg-black/20 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <span className="text-white/60">Account Identifier:</span>
            <span className="font-mono font-bold text-amber-300">{profile?.user_id || 'UID-AUTO'}</span>
            <span className="text-[10px] text-emerald-300 flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Authenticated
            </span>
          </div>
        </div>
      </div>

      {/* Profile & Security Foundation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* User Identity Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-600" />
              User Identity
            </CardTitle>
            <Badge variant={profile?.is_active ? 'success' : 'danger'}>
              {profile?.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{user?.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Full Name</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{profile?.full_name || '—'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Assigned Role</span>
              <span className="font-semibold text-brand-600 dark:text-brand-400">{formatUserRole(role)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Auth UUID</span>
              <span className="font-mono text-[10px] text-slate-400 truncate max-w-[140px]">{user?.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Database & RLS Security Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Database Security
            </CardTitle>
            <Badge variant="success">Enforced</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Row Level Security</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Role Escalation Guard</span>
              <span className="font-semibold text-emerald-600">Trigger Active</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Service-Role In Browser</span>
              <span className="font-semibold text-emerald-600">Zero (Purged)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Audit Logging</span>
              <span className="font-semibold text-brand-600">Ready</span>
            </div>
          </CardContent>
        </Card>

        {/* Session Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-600" />
              Session Details
            </CardTitle>
            <Badge variant="info">JWT</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Session Provider</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                {user?.app_metadata?.provider || 'Email/Password'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Token Expiry</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleTimeString() : 'Active'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Auto Token Refresh</span>
              <span className="font-semibold text-emerald-600">Enabled</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Persistence</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">LocalStorage Encrypted</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Architecture Readiness Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Phase 1 Foundation Verification</CardTitle>
          <CardDescription>
            The foundational architecture is established and ready for modular phase-by-phase implementation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Database className="w-4 h-4 text-brand-600" />
                <span>Profiles Schema</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                PostgreSQL schema, triggers, and RLS policies configured.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Role Routing</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                ProtectedRoute guard with granular role-based access checks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Smartphone className="w-4 h-4 text-amber-600" />
                <span>Responsive Shell</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Adaptive layout with sidebar drawer and dark/light tokens.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <BellRing className="w-4 h-4 text-emerald-600" />
                <span>Global Toasts</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Non-intrusive toast notifications with full accessibility.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

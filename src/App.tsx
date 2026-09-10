// =====================================================================
// KKDGMS — Master Single Page Application Router & Hub
// Enhanced with Strict Role-Based Access Control (RBAC) & Session Guards
// =====================================================================

import React, { useState, useEffect } from 'react';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PublicHome } from './components/public/PublicHome';
import { LoginModal } from './components/auth/LoginModal';
import { api } from './lib/supabase';
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentFacultyDatabase } from './components/admin/StudentFacultyDatabase';
import { AdmissionForm } from './components/admin/AdmissionForm';
import { AttendanceManager } from './components/admin/AttendanceManager';
import { MarksheetManager } from './components/admin/MarksheetManager';
import { LeaveApprovals } from './components/admin/LeaveApprovals';
import { QuestionBankAdmin } from './components/admin/QuestionBankAdmin';
import { FacultyAssignment } from './components/admin/FacultyAssignment';
import { BonafideGenerator } from './components/admin/BonafideGenerator';
import { VisitorGatePass } from './components/admin/VisitorGatePass';
import { SecurityAuditLogs } from './components/admin/SecurityAuditLogs';
import { SupabaseSetupHub } from './components/admin/SupabaseSetupHub';
import { DatabaseCrudManager } from './components/admin/DatabaseCrudManager';
import { FCMNotificationSender } from './components/admin/FCMNotificationSender';
import { RolePermissionsMatrix } from './components/admin/RolePermissionsMatrix';
import { FeedbackManager } from './components/admin/FeedbackManager';
import { EventsStoriesManager } from './components/admin/EventsStoriesManager';

// Faculty Views
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { FacultyOnlineExamCreator } from './components/faculty/FacultyOnlineExamCreator';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentOnlineExamPortal } from './components/student/StudentOnlineExamPortal';

// Warden Views
import { WardenDashboard } from './components/warden/WardenDashboard';
import { WardenGatePassManager } from './components/warden/WardenGatePassManager';

// Technician Views
import { TechnicianDashboard } from './components/technician/TechnicianDashboard';

// Strict Role-To-Tab Permission Matrix (RBAC Guard)
const ROLE_ALLOWED_TABS: Record<UserRole, string[]> = {
  admin: [
    'dashboard', 'database', 'admission', 'attendance', 'marksheet',
    'online-exams', 'question-bank', 'leaves', 'faculty-assign', 'bonafide',
    'visitors', 'stories-events', 'fcm-notices', 'feedback', 'permissions',
    'database-crud', 'security', 'supabase-hub'
  ],
  faculty: [
    'faculty-dashboard', 'faculty-attendance', 'faculty-marksheet',
    'faculty-online-exam', 'faculty-qb', 'faculty-leaves',
    'faculty-students', 'faculty-feedback'
  ],
  student: [
    'student-dashboard', 'student-exam-portal', 'student-marksheet',
    'student-qb', 'student-leaves', 'student-bonafide',
    'student-profile', 'student-feedback'
  ],
  warden: [
    'warden-dashboard', 'warden-gate', 'warden-leaves',
    'warden-residents', 'warden-visitors'
  ],
  technician: [
    'technician-dashboard', 'technician-qp', 'technician-docs',
    'technician-expenses', 'technician-periods'
  ],
  guest: [
    'guest-dashboard', 'supabase-hub'
  ]
};

const DEFAULT_ROLE_DASHBOARDS: Record<UserRole, string> = {
  admin: 'dashboard',
  faculty: 'faculty-dashboard',
  student: 'student-dashboard',
  warden: 'warden-dashboard',
  technician: 'technician-dashboard',
  guest: 'guest-dashboard'
};

export default function App() {
  const [viewMode, setViewMode] = useState<'public' | 'erp'>('public');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState({
    user_id: 'AD-2024-001',
    role: 'admin' as UserRole,
    full_name: 'Dr. S. Sundararajan, Principal',
    email: 'principal@kkdgms.edu.in'
  });

  // Restore authenticated session from sessionStorage on load
  useEffect(() => {
    try {
      const savedSession = sessionStorage.getItem('kkdgms_active_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.role) {
          setActiveSession(parsed);
          setCurrentRole(parsed.role);
          setActiveTab(DEFAULT_ROLE_DASHBOARDS[parsed.role as UserRole] || 'dashboard');
        }
      }
    } catch (e) {
      console.error('Failed to parse saved session', e);
    }
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const defaultTab = DEFAULT_ROLE_DASHBOARDS[newRole] || 'dashboard';
    setActiveTab(defaultTab);
  };

  const handleLoginSuccess = (role: UserRole, sessionData: any) => {
    const verifiedSession = {
      ...sessionData,
      role
    };
    setCurrentRole(role);
    setActiveSession(verifiedSession);
    try {
      sessionStorage.setItem('kkdgms_active_session', JSON.stringify(verifiedSession));
    } catch (e) {}
    handleRoleChange(role);
    setViewMode('erp');
  };

  const handleSignOut = async () => {
    try {
      await api.logAudit({
        user_id: activeSession.user_id,
        email: activeSession.email,
        role: currentRole,
        action: `User signed out from ${currentRole} workspace`,
        status: 'SUCCESS'
      });
    } catch (e) {}

    sessionStorage.removeItem('kkdgms_active_session');
    setViewMode('public');
    setShowLoginModal(false);
  };

  // Safe navigation with RBAC verification
  const handleSelectTab = (tabId: string) => {
    const allowedTabs = ROLE_ALLOWED_TABS[currentRole] || [];
    if (!allowedTabs.includes(tabId)) {
      api.logAudit({
        user_id: activeSession.user_id,
        email: activeSession.email,
        role: currentRole,
        action: `SECURITY WARNING: Unauthorized navigation attempt to restricted view: ${tabId}`,
        status: 'FAILED'
      }).catch(() => {});
    }
    setActiveTab(tabId);
  };

  const renderContent = () => {
    const allowedTabs = ROLE_ALLOWED_TABS[currentRole] || [];

    // RBAC Security Check: Block unauthorized view rendering
    if (!allowedTabs.includes(activeTab)) {
      return (
        <div className="max-w-2xl mx-auto my-12 animate-in fade-in zoom-in-95">
          <div className="bg-white rounded-3xl border-2 border-rose-200 shadow-xl p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
                HTTP 403 • Access Prohibited
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Role Permission Required
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your currently authenticated role (<strong className="text-rose-700 capitalize font-bold">{currentRole}</strong>) does not have access permissions for the requested section (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">{activeTab}</code>).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left text-[11px] text-slate-500 font-mono space-y-1">
              <div><strong className="text-slate-700">Authenticated Identity:</strong> {activeSession.user_id} ({activeSession.full_name})</div>
              <div><strong className="text-slate-700">Active Security Scope:</strong> {currentRole}</div>
              <div><strong className="text-slate-700">Audit Status:</strong> Security event logged to database</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab(DEFAULT_ROLE_DASHBOARDS[currentRole])}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to {currentRole} Dashboard</span>
              </button>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-200"
              >
                <KeyRound className="w-4 h-4" />
                <span>Switch Role / Re-Authenticate</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      // Admin Views
      case 'dashboard':
        return <AdminDashboard onNavigateTab={handleSelectTab} />;
      case 'database':
        return <StudentFacultyDatabase onNavigateAdmission={() => handleSelectTab('admission')} />;
      case 'admission':
        return <AdmissionForm onSuccessNavigate={() => handleSelectTab('database')} />;
      case 'attendance':
        return <AttendanceManager />;
      case 'marksheet':
        return <MarksheetManager />;
      case 'online-exams':
        return <FacultyOnlineExamCreator />;
      case 'leaves':
        return <LeaveApprovals />;
      case 'question-bank':
        return <QuestionBankAdmin />;
      case 'faculty-assign':
        return <FacultyAssignment />;
      case 'bonafide':
        return <BonafideGenerator />;
      case 'visitors':
        return <VisitorGatePass />;
      case 'stories-events':
        return <EventsStoriesManager />;
      case 'fcm-notices':
        return <FCMNotificationSender />;
      case 'feedback':
        return <FeedbackManager />;
      case 'permissions':
        return <RolePermissionsMatrix />;
      case 'database-crud':
        return <DatabaseCrudManager />;
      case 'security':
        return <SecurityAuditLogs />;
      case 'supabase-hub':
        return <SupabaseSetupHub />;

      // Faculty Views
      case 'faculty-dashboard':
        return <FacultyDashboard onNavigateTab={handleSelectTab} />;
      case 'faculty-attendance':
        return <AttendanceManager />;
      case 'faculty-marksheet':
        return <MarksheetManager />;
      case 'faculty-online-exam':
        return <FacultyOnlineExamCreator />;
      case 'faculty-qb':
        return <QuestionBankAdmin />;
      case 'faculty-leaves':
        return <LeaveApprovals />;
      case 'faculty-students':
        return <StudentFacultyDatabase onNavigateAdmission={() => handleSelectTab('admission')} />;
      case 'faculty-feedback':
        return <FeedbackManager />;

      // Student Views
      case 'student-dashboard':
        return <StudentDashboard onNavigateTab={handleSelectTab} />;
      case 'student-exam-portal':
        return <StudentOnlineExamPortal />;
      case 'student-marksheet':
        return <MarksheetManager />;
      case 'student-qb':
        return <QuestionBankAdmin />;
      case 'student-leaves':
        return <LeaveApprovals />;
      case 'student-bonafide':
        return <BonafideGenerator />;
      case 'student-feedback':
        return <FeedbackManager />;
      case 'student-profile':
        return (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 text-center relative overflow-hidden">
              <div className="w-24 h-24 rounded-3xl bg-indigo-50 text-indigo-700 font-black text-3xl flex items-center justify-center mx-auto mb-4 border-2 border-indigo-200 shadow-xs">
                {activeSession.full_name?.charAt(0) || 'S'}
              </div>
              <h2 className="text-2xl font-black text-slate-900">{activeSession.full_name}</h2>
              <div className="text-xs font-mono font-bold text-indigo-700 mt-1">EMIS Roll: {activeSession.user_id}</div>
              <p className="text-xs text-slate-500 mt-1">
                Standard 12 - Section A • English Medium (Bio-Maths)
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left mt-8 pt-6 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Date of Birth</span>
                  <span className="font-mono font-bold text-slate-800">14-05-2007 (17 Yrs)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Blood Group</span>
                  <span className="font-bold text-rose-700">O Positive (O+)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Hostel Category</span>
                  <span className="font-bold text-amber-700">Resident (Boarder)</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Hostel Block</span>
                  <span className="font-semibold text-slate-800">Vivekananda Hostel - Room 204</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Father's Name</span>
                  <span className="font-semibold text-slate-800">V. Arumugam</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Parent Mobile</span>
                  <span className="font-mono font-bold text-indigo-700">9443211111</span>
                </div>
              </div>
            </div>
          </div>
        );

      // Warden Views
      case 'warden-dashboard':
        return <WardenDashboard onNavigateTab={handleSelectTab} />;
      case 'warden-gate':
        return <WardenGatePassManager />;
      case 'warden-leaves':
        return <LeaveApprovals />;
      case 'warden-residents':
        return <StudentFacultyDatabase onNavigateAdmission={() => handleSelectTab('admission')} />;
      case 'warden-visitors':
        return <VisitorGatePass />;

      // Technician Views
      case 'technician-dashboard':
      case 'technician-qp':
      case 'technician-docs':
      case 'technician-expenses':
      case 'technician-periods':
        return <TechnicianDashboard />;

      // Guest View
      case 'guest-dashboard':
        return (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs text-center space-y-4">
              <h2 className="text-2xl font-black text-slate-900">KKDGMS Guest Information Console</h2>
              <p className="text-xs text-slate-500 max-w-xl mx-auto">
                Welcome to the model school visitor information portal. As a guest user, you can review verified campus achievements and curriculum data.
              </p>
              <button
                onClick={() => setViewMode('public')}
                className="px-6 py-3 bg-indigo-600 text-white font-bold text-xs uppercase rounded-xl shadow-md cursor-pointer"
              >
                Browse Public Website
              </button>
            </div>
          </div>
        );

      default:
        return <AdminDashboard onNavigateTab={handleSelectTab} />;
    }
  };

  // If in Public Website Mode
  if (viewMode === 'public') {
    return (
      <>
        <PublicHome onOpenLogin={() => setShowLoginModal(true)} />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // ERP Dashboard Workspace Mode
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden text-slate-900">
      {/* Left Sidebar (Filtered strictly by currentRole) */}
      <Sidebar
        currentRole={currentRole}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onViewPublicSite={() => setViewMode('public')}
      />

      {/* Main Workspace Column */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Navbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          activeSession={activeSession}
          onOpenLogin={() => setShowLoginModal(true)}
          onNavigateTab={handleSelectTab}
          onViewPublicSite={() => setViewMode('public')}
          onSignOut={handleSignOut}
        />

        {/* Dynamic Scrollable Content with RBAC Protection */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50">
          {renderContent()}
        </div>
      </main>

      {/* Authentication Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

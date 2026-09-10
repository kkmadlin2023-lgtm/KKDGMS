// =====================================================================
// KKDGMS — Master Single Page Application Router & Hub
// =====================================================================

import React, { useState } from 'react';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PublicHome } from './components/public/PublicHome';
import { LoginModal } from './components/auth/LoginModal';

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

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'admin') setActiveTab('dashboard');
    else if (newRole === 'faculty') setActiveTab('faculty-dashboard');
    else if (newRole === 'student') setActiveTab('student-dashboard');
    else if (newRole === 'warden') setActiveTab('warden-dashboard');
    else if (newRole === 'technician') setActiveTab('technician-dashboard');
    else if (newRole === 'guest') setActiveTab('guest-dashboard');
  };

  const handleLoginSuccess = (role: UserRole, sessionData: any) => {
    setCurrentRole(role);
    setActiveSession(sessionData);
    handleRoleChange(role);
    setViewMode('erp');
  };

  const renderContent = () => {
    switch (activeTab) {
      // Admin Views
      case 'dashboard':
        return <AdminDashboard onNavigateTab={setActiveTab} />;
      case 'database':
        return <StudentFacultyDatabase onNavigateAdmission={() => setActiveTab('admission')} />;
      case 'admission':
        return <AdmissionForm onSuccessNavigate={() => setActiveTab('database')} />;
      case 'attendance':
      case 'faculty-attendance':
        return <AttendanceManager />;
      case 'marksheet':
      case 'faculty-marksheet':
      case 'student-marksheet':
        return <MarksheetManager />;
      case 'online-exams':
      case 'faculty-online-exam':
        return <FacultyOnlineExamCreator />;
      case 'student-exam-portal':
        return <StudentOnlineExamPortal />;
      case 'leaves':
      case 'faculty-leaves':
      case 'student-leaves':
      case 'warden-leaves':
        return <LeaveApprovals />;
      case 'question-bank':
      case 'faculty-qb':
      case 'student-qb':
        return <QuestionBankAdmin />;
      case 'faculty-assign':
        return <FacultyAssignment />;
      case 'bonafide':
      case 'student-bonafide':
        return <BonafideGenerator />;
      case 'visitors':
      case 'warden-visitors':
        return <VisitorGatePass />;
      case 'stories-events':
        return <EventsStoriesManager />;
      case 'fcm-notices':
      case 'notices':
        return <FCMNotificationSender />;
      case 'feedback':
      case 'faculty-feedback':
      case 'student-feedback':
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
        return <FacultyDashboard onNavigateTab={setActiveTab} />;
      case 'faculty-students':
      case 'warden-residents':
        return <StudentFacultyDatabase onNavigateAdmission={() => setActiveTab('admission')} />;

      // Student Views
      case 'student-dashboard':
        return <StudentDashboard onNavigateTab={setActiveTab} />;
      case 'student-profile':
        return (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 text-center relative overflow-hidden">
              <div className="w-24 h-24 rounded-3xl bg-indigo-50 text-indigo-700 font-black text-3xl flex items-center justify-center mx-auto mb-4 border-2 border-indigo-200 shadow-xs">
                D
              </div>
              <h2 className="text-2xl font-black text-slate-900">A. Dhanush Kumar</h2>
              <div className="text-xs font-mono font-bold text-indigo-700 mt-1">EMIS Roll: EMIS202401</div>
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
        return <WardenDashboard onNavigateTab={setActiveTab} />;
      case 'warden-gate':
        return <WardenGatePassManager />;

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
                className="px-6 py-3 bg-indigo-600 text-white font-bold text-xs uppercase rounded-xl shadow-md"
              >
                Browse Public Website
              </button>
            </div>
          </div>
        );

      default:
        return <AdminDashboard onNavigateTab={setActiveTab} />;
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
      {/* Left Sidebar */}
      <Sidebar
        currentRole={currentRole}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onViewPublicSite={() => setViewMode('public')}
      />

      {/* Main Workspace Column */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Navbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeSession={activeSession}
          onOpenLogin={() => setShowLoginModal(true)}
          onNavigateTab={setActiveTab}
          onViewPublicSite={() => setViewMode('public')}
        />

        {/* Dynamic Scrollable Content */}
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

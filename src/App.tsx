import React, { useState } from 'react';
import { UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentFacultyDatabase } from './components/admin/StudentFacultyDatabase';
import { AdmissionForm } from './components/admin/AdmissionForm';
import { AttendanceManager } from './components/admin/AttendanceManager';
import { MarksheetManager } from './components/admin/MarksheetManager';
import { LeaveApprovals } from './components/admin/LeaveApprovals';
import { QuestionBankAdmin } from './components/admin/QuestionBankAdmin';
import { ExamSeatingAllocations } from './components/admin/ExamSeatingAllocations';
import { FacultyAssignment } from './components/admin/FacultyAssignment';
import { BonafideGenerator } from './components/admin/BonafideGenerator';
import { VisitorGatePass } from './components/admin/VisitorGatePass';
import { NoticeBroadcast } from './components/admin/NoticeBroadcast';
import { SecurityAuditLogs } from './components/admin/SecurityAuditLogs';
import { SupabaseSetupHub } from './components/admin/SupabaseSetupHub';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { WardenDashboard } from './components/warden/WardenDashboard';
import { GraduationCap, Phone, MapPin, Building2, ShieldCheck, Mail } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'admin') setActiveTab('dashboard');
    else if (newRole === 'faculty') setActiveTab('faculty-dashboard');
    else if (newRole === 'student') setActiveTab('student-dashboard');
    else if (newRole === 'warden') setActiveTab('warden-dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      // Admin Core
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
      case 'leaves':
      case 'faculty-leaves':
      case 'student-leaves':
      case 'warden-leaves':
        return <LeaveApprovals />;
      case 'question-bank':
      case 'faculty-qb':
      case 'student-qb':
        return <QuestionBankAdmin />;
      case 'seating':
        return <ExamSeatingAllocations />;
      case 'faculty-assign':
        return <FacultyAssignment />;
      case 'bonafide':
      case 'student-bonafide':
        return <BonafideGenerator />;
      case 'visitors':
      case 'warden-visitors':
        return <VisitorGatePass />;
      case 'notices':
        return <NoticeBroadcast />;
      case 'security':
        return <SecurityAuditLogs />;
      case 'supabase-hub':
        return <SupabaseSetupHub />;

      // Role-specific Home views
      case 'faculty-dashboard':
        return <FacultyDashboard onNavigateTab={setActiveTab} />;
      case 'faculty-students':
      case 'warden-residents':
        return <StudentFacultyDatabase onNavigateAdmission={() => setActiveTab('admission')} />;

      case 'student-dashboard':
        return <StudentDashboard onNavigateTab={setActiveTab} />;

      case 'student-profile':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-8 text-center relative overflow-hidden">
              <div className="w-24 h-24 rounded-3xl bg-blue-50 text-blue-700 font-black text-3xl flex items-center justify-center mx-auto mb-4 border-2 border-blue-200 shadow-sm">
                D
              </div>
              <h2 className="text-2xl font-black text-slate-900">A. Dhanush Kumar</h2>
              <div className="text-xs font-mono font-bold text-blue-700 mt-1">EMIS Roll: EMIS202401</div>
              <p className="text-xs text-slate-500 mt-1">
                Standard 12 - Section A • English Medium (Maths-Biology)
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left mt-8 pt-6 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Date of Birth</span>
                  <span className="font-mono font-bold text-slate-800">14-06-2008 (16 Yrs)</span>
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
                  <span className="font-semibold text-slate-800">M. Arumugam</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Parent Mobile</span>
                  <span className="font-mono font-bold text-blue-700">9876543210</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'warden-dashboard':
        return <WardenDashboard onNavigateTab={setActiveTab} />;

      default:
        return <AdminDashboard onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden text-slate-900">
      {/* High Density Left Sidebar */}
      <Sidebar
        currentRole={currentRole}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Column: Header on top, Dynamic Viewport below */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <Navbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeSession={{
            user_id: currentRole === 'admin' ? 'AD-2024-001' : currentRole === 'faculty' ? 'FAC-PHY-102' : currentRole === 'warden' ? 'WRD-BH-01' : 'STD-2024-0142',
            role: currentRole,
            full_name: currentRole === 'admin' ? 'Dr. R. Sundaram, Principal' : currentRole === 'faculty' ? 'T. Selvakumar, M.Sc., B.Ed.' : currentRole === 'warden' ? 'K. Murugan, Warden' : 'A. Dhanush Kumar',
            token: 'jwt-token-active'
          }}
          onOpenLogin={() => setActiveTab('security')}
          onNavigateTab={setActiveTab}
        />

        {/* Dynamic Scrollable Content Workspace */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

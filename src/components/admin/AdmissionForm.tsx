import React, { useState } from 'react';
import {
  UserPlus,
  GraduationCap,
  Users,
  Home,
  Shield,
  Wrench,
  CheckCircle2,
  FileText,
  ArrowRight,
  Calculator,
  Calendar,
  Sparkles,
  MapPin,
  Lock,
  Mail,
  Phone
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { UserRole } from '../../types';

interface AdmissionFormProps {
  onSuccessNavigate?: () => void;
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({ onSuccessNavigate }) => {
  const [targetRole, setTargetRole] = useState<'student' | 'faculty' | 'warden' | 'technician' | 'admin'>('student');
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Helper to calculate age automatically from DOB
  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  // 1. Student Form State
  const [studentData, setStudentData] = useState({
    user_id: 'EMIS' + Math.floor(100000 + Math.random() * 900000),
    password: 'Student@' + Math.floor(1000 + Math.random() * 9000),
    first_name: '',
    last_name: '',
    initial: '',
    dob: '',
    age: 16,
    gender: 'Male',
    aadhaar: '',
    email: '',
    student_class: '11',
    section: 'A',
    medium: 'English',
    academic_year: '2024-2025',
    student_group: 'Bio-Maths',
    assigned_faculty_name: 'Mrs. M. Rajeshwari',
    father_name: '',
    father_occupation: 'Agriculture',
    mother_name: '',
    mother_occupation: 'Homemaker',
    mobile: '',
    door_no: '',
    street_name: '',
    place: 'Navalcadu',
    city: 'Nagercoil',
    district: 'Kanyakumari',
    state: 'Tamil Nadu',
    pincode: '629002',
    blood_group: 'O+',
    hostel_name: 'Vivekananda Boys Hostel',
    hostel_type: 'Resident' as 'Resident' | 'Day Scholar',
    warden_name: 'Mr. T. Murugan',
    income_cert_no: '',
    community_cert_no: '',
    photo_url: '/icon.jpg'
  });

  // 2. Staff / Admin / Warden / Technician Form State
  const [staffData, setStaffData] = useState({
    user_id: 'USR' + Math.floor(100 + Math.random() * 900),
    password: 'Staff@' + Math.floor(1000 + Math.random() * 9000),
    first_name: '',
    last_name: '',
    initial: '',
    dob: '',
    age: 35,
    gender: 'Male',
    aadhaar: '',
    email: '',
    department: 'Mathematics',
    designation: 'PGT Mathematics',
    qualification: 'M.Sc., M.Phil., B.Ed.',
    experience: '8 Years',
    mobile: '',
    door_no: '',
    street_name: '',
    place: 'Nagercoil',
    district: 'Kanyakumari',
    state: 'Tamil Nadu',
    pincode: '629001',
    blood_group: 'O+',
    assigned_class: '12',
    assigned_section: 'A',
    hostel_name: 'Vivekananda Boys Hostel',
    hostel_gender: 'Boys',
    photo_url: '/teacher1.jpg'
  });

  // Auto age calculate handler for student
  const handleStudentDobChange = (dob: string) => {
    const age = calculateAge(dob);
    setStudentData(prev => ({ ...prev, dob, age }));
  };

  // Auto age calculate handler for staff
  const handleStaffDobChange = (dob: string) => {
    const age = calculateAge(dob);
    setStaffData(prev => ({ ...prev, dob, age }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (targetRole === 'student') {
        const fullName = `${studentData.initial ? studentData.initial + '. ' : ''}${studentData.first_name} ${studentData.last_name}`.trim();
        if (!studentData.first_name || !studentData.mobile) {
          alert('Please enter at least First Name and Parent Mobile.');
          setSubmitting(false);
          return;
        }

        await api.addStudent({
          ...studentData,
          full_name: fullName,
          age: Number(studentData.age),
          role: 'student'
        });
        setSuccessNotice(`Student ${fullName} (${studentData.user_id}) registered successfully into Supabase!`);
      } else if (targetRole === 'faculty') {
        const fullName = `${staffData.initial ? staffData.initial + '. ' : ''}${staffData.first_name} ${staffData.last_name}`.trim();
        await api.addFaculty({
          user_id: staffData.user_id.startsWith('FAC') ? staffData.user_id : 'FAC' + Math.floor(100 + Math.random() * 900),
          full_name: fullName,
          first_name: staffData.first_name,
          last_name: staffData.last_name,
          initial: staffData.initial,
          dob: staffData.dob,
          age: Number(staffData.age),
          gender: staffData.gender,
          aadhaar: staffData.aadhaar,
          email: staffData.email || `${staffData.first_name.toLowerCase()}.${staffData.department.toLowerCase()}@kkdgms.edu.in`,
          department: staffData.department,
          designation: staffData.designation,
          qualification: staffData.qualification,
          experience: staffData.experience,
          mobile: staffData.mobile,
          door_no: staffData.door_no,
          street_name: staffData.street_name,
          place: staffData.place,
          district: staffData.district,
          state: staffData.state,
          pincode: staffData.pincode,
          blood_group: staffData.blood_group,
          assigned_class: staffData.assigned_class,
          assigned_section: staffData.assigned_section,
          photo_url: staffData.photo_url,
          role: 'faculty'
        });
        setSuccessNotice(`Faculty member ${fullName} registered successfully into Supabase!`);
      } else if (targetRole === 'warden') {
        const fullName = `${staffData.initial ? staffData.initial + '. ' : ''}${staffData.first_name} ${staffData.last_name}`.trim();
        await api.addWarden({
          user_id: staffData.user_id.startsWith('WAR') ? staffData.user_id : 'WAR' + Math.floor(100 + Math.random() * 900),
          full_name: fullName,
          first_name: staffData.first_name,
          last_name: staffData.last_name,
          initial: staffData.initial,
          dob: staffData.dob,
          age: Number(staffData.age),
          gender: staffData.gender,
          aadhaar: staffData.aadhaar,
          email: staffData.email || `warden.${staffData.first_name.toLowerCase()}@kkdgms.edu.in`,
          hostel_name: staffData.hostel_name,
          hostel_gender: staffData.hostel_gender,
          qualification: staffData.qualification,
          experience: staffData.experience,
          mobile: staffData.mobile,
          door_no: staffData.door_no,
          street_name: staffData.street_name,
          place: staffData.place,
          district: staffData.district,
          photo_url: staffData.photo_url,
          role: 'warden'
        });
        setSuccessNotice(`Hostel Warden ${fullName} registered successfully into Supabase!`);
      } else if (targetRole === 'technician') {
        const fullName = `${staffData.initial ? staffData.initial + '. ' : ''}${staffData.first_name} ${staffData.last_name}`.trim();
        await api.addTechnician({
          user_id: staffData.user_id.startsWith('TECH') ? staffData.user_id : 'TECH' + Math.floor(100 + Math.random() * 900),
          full_name: fullName,
          first_name: staffData.first_name,
          last_name: staffData.last_name,
          initial: staffData.initial,
          dob: staffData.dob,
          age: Number(staffData.age),
          gender: staffData.gender,
          aadhaar: staffData.aadhaar,
          email: staffData.email || `tech.${staffData.first_name.toLowerCase()}@kkdgms.edu.in`,
          department: staffData.department,
          qualification: staffData.qualification,
          experience: staffData.experience,
          mobile: staffData.mobile,
          photo_url: staffData.photo_url,
          role: 'technician'
        });
        setSuccessNotice(`Technician ${fullName} registered successfully into Supabase!`);
      } else if (targetRole === 'admin') {
        const fullName = `${staffData.initial ? staffData.initial + '. ' : ''}${staffData.first_name} ${staffData.last_name}`.trim();
        await api.addAdmin({
          user_id: staffData.user_id.startsWith('ADM') ? staffData.user_id : 'ADM' + Math.floor(100 + Math.random() * 900),
          full_name: fullName,
          first_name: staffData.first_name,
          last_name: staffData.last_name,
          initial: staffData.initial,
          dob: staffData.dob,
          age: Number(staffData.age),
          gender: staffData.gender,
          aadhaar: staffData.aadhaar,
          email: staffData.email || `admin.${staffData.first_name.toLowerCase()}@kkdgms.edu.in`,
          department: 'Administration',
          qualification: staffData.qualification,
          experience: staffData.experience,
          mobile: staffData.mobile,
          door_no: staffData.door_no,
          street_name: staffData.street_name,
          place: staffData.place,
          district: staffData.district,
          state: staffData.state,
          pincode: staffData.pincode,
          photo_url: staffData.photo_url,
          role: 'admin'
        });
        setSuccessNotice(`Administrator ${fullName} enrolled successfully into Supabase!`);
      }

      setTimeout(() => {
        if (onSuccessNavigate) onSuccessNavigate();
      }, 1500);
    } catch (err: any) {
      alert('Error during registration: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isSeniorClass = studentData.student_class === '11' || studentData.student_class === '12';

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="text-emerald-700 underline font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header card with 5 Role selector tabs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <UserPlus className="w-4 h-4" />
              <span>Multi-Role Admission Desk (5 Specialized Forms)</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Institutional Enrollment & User Credential Provisioning
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Creates structured records in PostgreSQL with automatic age computation and credential generation.
            </p>
          </div>

          {/* 5 Form Selection Tabs */}
          <div className="flex items-center flex-wrap gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setTargetRole('student')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetRole === 'student' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Student Form
            </button>
            <button
              type="button"
              onClick={() => setTargetRole('faculty')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetRole === 'faculty' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Faculty Form
            </button>
            <button
              type="button"
              onClick={() => setTargetRole('warden')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetRole === 'warden' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Warden Form
            </button>
            <button
              type="button"
              onClick={() => setTargetRole('technician')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetRole === 'technician' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4. Technician Form
            </button>
            <button
              type="button"
              onClick={() => setTargetRole('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetRole === 'admin' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5. Admin Form
            </button>
          </div>
        </div>
      </div>

      {/* Main Registration Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* FORM 1: STUDENT ADMISSION FORM */}
        {/* ========================================================================= */}
        {targetRole === 'student' && (
          <div className="space-y-6">
            {/* Section 1: Academic & System Identifiers */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>1. Academic Enrollment & System Credentials</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">EMIS User ID *</label>
                  <input
                    type="text"
                    value={studentData.user_id}
                    onChange={(e) => setStudentData({ ...studentData, user_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Password *</label>
                  <input
                    type="text"
                    value={studentData.password}
                    onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class (9 to 12) *</label>
                  <select
                    value={studentData.student_class}
                    onChange={(e) => {
                      const newClass = e.target.value;
                      const isSenior = newClass === '11' || newClass === '12';
                      setStudentData({
                        ...studentData,
                        student_class: newClass,
                        student_group: isSenior ? 'Bio-Maths' : 'Non-Group'
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
                  >
                    <option value="9">Standard 9</option>
                    <option value="10">Standard 10</option>
                    <option value="11">Standard 11</option>
                    <option value="12">Standard 12</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section (A to H) *</label>
                  <select
                    value={studentData.section}
                    onChange={(e) => setStudentData({ ...studentData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
                  >
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(s => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Grouping</label>
                  <select
                    value={studentData.student_group}
                    onChange={(e) => setStudentData({ ...studentData, student_group: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    {isSeniorClass ? (
                      <>
                        <option value="Bio-Maths">Bio-Maths (Group 1)</option>
                        <option value="Maths-Computer">Maths-Computer (Group 2)</option>
                        <option value="Humanities">Humanities (Group 3)</option>
                        <option value="Accountancy">Accountancy & Commerce (Group 4)</option>
                      </>
                    ) : (
                      <option value="Non-Group">Non-Grouping (General Core 9/10)</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={studentData.academic_year}
                    onChange={(e) => setStudentData({ ...studentData, academic_year: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medium of Instruction</label>
                  <select
                    value={studentData.medium}
                    onChange={(e) => setStudentData({ ...studentData, medium: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="English">English Medium</option>
                    <option value="Tamil">Tamil Medium</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Faculty Mentor</label>
                  <input
                    type="text"
                    value={studentData.assigned_faculty_name}
                    onChange={(e) => setStudentData({ ...studentData, assigned_faculty_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Student Demographic & Auto-Age */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>2. Personal Demographics & Identity</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dhanush"
                    value={studentData.first_name}
                    onChange={(e) => setStudentData({ ...studentData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kumar"
                    value={studentData.last_name}
                    onChange={(e) => setStudentData({ ...studentData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial</label>
                  <input
                    type="text"
                    placeholder="e.g. A"
                    value={studentData.initial}
                    onChange={(e) => setStudentData({ ...studentData, initial: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={studentData.gender}
                    onChange={(e) => setStudentData({ ...studentData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={studentData.dob}
                    onChange={(e) => handleStudentDobChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Automated Age</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Auto-Calculated</span>
                  </label>
                  <input
                    type="number"
                    value={studentData.age}
                    readOnly
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-indigo-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card Number *</label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="12 digit Aadhaar"
                    value={studentData.aadhaar}
                    onChange={(e) => setStudentData({ ...studentData, aadhaar: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={studentData.blood_group}
                    onChange={(e) => setStudentData({ ...studentData, blood_group: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Parent & Residential Address */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-600" />
                <span>3. Parent Details & Permanent Address</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's Full Name *</label>
                  <input
                    type="text"
                    value={studentData.father_name}
                    onChange={(e) => setStudentData({ ...studentData, father_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mother's Full Name</label>
                  <input
                    type="text"
                    value={studentData.mother_name}
                    onChange={(e) => setStudentData({ ...studentData, mother_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent Mobile (WhatsApp) *</label>
                  <input
                    type="tel"
                    placeholder="10 digit mobile"
                    value={studentData.mobile}
                    onChange={(e) => setStudentData({ ...studentData, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Email Address</label>
                  <input
                    type="email"
                    placeholder="dhanush@student.kkdgms.edu.in"
                    value={studentData.email}
                    onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Door Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. 14/B"
                    value={studentData.door_no}
                    onChange={(e) => setStudentData({ ...studentData, door_no: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Street Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mela Street"
                    value={studentData.street_name}
                    onChange={(e) => setStudentData({ ...studentData, street_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Place / Village *</label>
                  <input
                    type="text"
                    value={studentData.place}
                    onChange={(e) => setStudentData({ ...studentData, place: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Town</label>
                  <input
                    type="text"
                    value={studentData.city}
                    onChange={(e) => setStudentData({ ...studentData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={studentData.district}
                    onChange={(e) => setStudentData({ ...studentData, district: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={studentData.state}
                    onChange={(e) => setStudentData({ ...studentData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={studentData.pincode}
                    onChange={(e) => setStudentData({ ...studentData, pincode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Hostel & Government Certificates */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>4. Hostel Boarding & Verification Certificates</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hostel Status</label>
                  <select
                    value={studentData.hostel_type}
                    onChange={(e) => setStudentData({ ...studentData, hostel_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
                  >
                    <option value="Resident">Resident (Hostel Boarder)</option>
                    <option value="Day Scholar">Day Scholar (Day Student)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hostel Block Name</label>
                  <select
                    value={studentData.hostel_name}
                    onChange={(e) => setStudentData({ ...studentData, hostel_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Vivekananda Boys Hostel">Vivekananda Boys Hostel</option>
                    <option value="Mother Teresa Girls Hostel">Mother Teresa Girls Hostel</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Warden Name</label>
                  <input
                    type="text"
                    value={studentData.warden_name}
                    onChange={(e) => setStudentData({ ...studentData, warden_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Income Certificate No.</label>
                  <input
                    type="text"
                    placeholder="e.g. INC-2024-88412"
                    value={studentData.income_cert_no}
                    onChange={(e) => setStudentData({ ...studentData, income_cert_no: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Community Certificate No.</label>
                  <input
                    type="text"
                    placeholder="e.g. COMM-BC-44120"
                    value={studentData.community_cert_no}
                    onChange={(e) => setStudentData({ ...studentData, community_cert_no: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Photo URL / Avatar</label>
                  <input
                    type="text"
                    value={studentData.photo_url}
                    onChange={(e) => setStudentData({ ...studentData, photo_url: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMS 2, 3, 4, 5: STAFF FORMS (FACULTY, WARDEN, TECHNICIAN, ADMIN) */}
        {/* ========================================================================= */}
        {targetRole !== 'student' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="capitalize">{targetRole} Profile & Official Credentials</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">User ID / Staff Code *</label>
                  <input
                    type="text"
                    value={staffData.user_id}
                    onChange={(e) => setStaffData({ ...staffData, user_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">System Password *</label>
                  <input
                    type="text"
                    value={staffData.password}
                    onChange={(e) => setStaffData({ ...staffData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajeshwari"
                    value={staffData.first_name}
                    onChange={(e) => setStaffData({ ...staffData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. M"
                    value={staffData.last_name}
                    onChange={(e) => setStaffData({ ...staffData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial</label>
                  <input
                    type="text"
                    placeholder="e.g. M"
                    value={staffData.initial}
                    onChange={(e) => setStaffData({ ...staffData, initial: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={staffData.dob}
                    onChange={(e) => handleStaffDobChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Age</span>
                    <span className="text-[10px] text-indigo-600 font-bold">Auto-Computed</span>
                  </label>
                  <input
                    type="number"
                    value={staffData.age}
                    readOnly
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-indigo-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={staffData.gender}
                    onChange={(e) => setStaffData({ ...staffData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aadhaar Card Number *</label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="12 digit Aadhaar"
                    value={staffData.aadhaar}
                    onChange={(e) => setStaffData({ ...staffData, aadhaar: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    placeholder="name@kkdgms.edu.in"
                    value={staffData.email}
                    onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Contact *</label>
                  <input
                    type="tel"
                    placeholder="10 digit mobile"
                    value={staffData.mobile}
                    onChange={(e) => setStaffData({ ...staffData, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Degree / Qualification *</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc., M.Phil., B.Ed."
                    value={staffData.qualification}
                    onChange={(e) => setStaffData({ ...staffData, qualification: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Years"
                    value={staffData.experience}
                    onChange={(e) => setStaffData({ ...staffData, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={staffData.department}
                    onChange={(e) => setStaffData({ ...staffData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology / Botany</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Tamil">Tamil Language</option>
                    <option value="English">English Language</option>
                    <option value="Administration">School Administration</option>
                    <option value="Hostel Administration">Hostel Administration</option>
                    <option value="IT & Exam Support">IT & Exam Support</option>
                  </select>
                </div>

                {/* Specific Role Additions */}
                {targetRole === 'faculty' && (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Assigned Class</label>
                      <select
                        value={staffData.assigned_class}
                        onChange={(e) => setStaffData({ ...staffData, assigned_class: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
                      >
                        <option value="9">Standard 9</option>
                        <option value="10">Standard 10</option>
                        <option value="11">Standard 11</option>
                        <option value="12">Standard 12</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Assigned Section</label>
                      <select
                        value={staffData.assigned_section}
                        onChange={(e) => setStaffData({ ...staffData, assigned_section: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
                      >
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(s => (
                          <option key={s} value={s}>Section {s}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {targetRole === 'warden' && (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Hostel Block</label>
                      <select
                        value={staffData.hostel_name}
                        onChange={(e) => setStaffData({ ...staffData, hostel_name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
                      >
                        <option value="Vivekananda Boys Hostel">Vivekananda Boys Hostel</option>
                        <option value="Mother Teresa Girls Hostel">Mother Teresa Girls Hostel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Hostel Gender Segregation</label>
                      <select
                        value={staffData.hostel_gender}
                        onChange={(e) => setStaffData({ ...staffData, hostel_gender: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-bold"
                      >
                        <option value="Boys">Boys (Male Warden View)</option>
                        <option value="Girls">Girls (Female Warden View)</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Staff Photo URL / Avatar</label>
                  <input
                    type="text"
                    value={staffData.photo_url}
                    onChange={(e) => setStaffData({ ...staffData, photo_url: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Address Details for Staff */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Residential Address Details</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Door No.</label>
                  <input
                    type="text"
                    placeholder="e.g. 5/22"
                    value={staffData.door_no}
                    onChange={(e) => setStaffData({ ...staffData, door_no: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Street Name</label>
                  <input
                    type="text"
                    placeholder="e.g. North Car Street"
                    value={staffData.street_name}
                    onChange={(e) => setStaffData({ ...staffData, street_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Place / City</label>
                  <input
                    type="text"
                    value={staffData.place}
                    onChange={(e) => setStaffData({ ...staffData, place: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={staffData.district}
                    onChange={(e) => setStaffData({ ...staffData, district: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            Records are encrypted and protected by Supabase Row Level Security (RLS).
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Deploying to Supabase...</span>
            ) : (
              <>
                <span>Complete {targetRole} Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

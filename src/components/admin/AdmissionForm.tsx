import React, { useState } from 'react';
import {
  UserPlus,
  GraduationCap,
  Users,
  Home,
  Shield,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  ArrowRight
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { UserRole } from '../../types';

interface AdmissionFormProps {
  onSuccessNavigate?: () => void;
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({ onSuccessNavigate }) => {
  const [targetRole, setTargetRole] = useState<UserRole>('student');
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Student Form State
  const [studentData, setStudentData] = useState({
    user_id: 'EMIS' + Math.floor(100000 + Math.random() * 900000),
    full_name: '',
    dob: '',
    age: 16,
    gender: 'Male',
    aadhaar: '',
    email: '',
    student_class: '11',
    section: 'A',
    medium: 'English',
    academic_year: '2024-2025',
    student_group: 'Maths-Biology',
    father_name: '',
    father_occupation: '',
    mother_name: '',
    mother_occupation: '',
    mobile: '',
    door_no: '',
    street_name: '',
    place: 'Nagercoil',
    district: 'Kanyakumari',
    state: 'Tamil Nadu',
    pincode: '629001',
    blood_group: 'O+',
    id_mark_1: '',
    id_mark_2: '',
    medical_issues: 'None',
    hostel_name: 'Vivekananda Boys Hostel',
    hostel_type: 'Resident' as 'Resident' | 'Day Scholar',
  });

  // Faculty / Warden Form State
  const [staffData, setStaffData] = useState({
    user_id: 'STAFF' + Math.floor(100 + Math.random() * 900),
    full_name: '',
    email: '',
    gender: 'Male',
    department: 'Mathematics',
    qualification: 'M.Sc., B.Ed.',
    mobile: '',
    place: 'Nagercoil',
    hostel_name: 'Vivekananda Boys Hostel',
    district: 'Kanyakumari'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (targetRole === 'student') {
        if (!studentData.full_name || !studentData.mobile) {
          alert('Please enter student name and mobile number');
          setSubmitting(false);
          return;
        }
        await api.addStudent({
          ...studentData,
          age: Number(studentData.age)
        });
        setSuccessNotice(`Student ${studentData.full_name} (${studentData.user_id}) enrolled successfully into Supabase!`);
      } else if (targetRole === 'faculty') {
        await api.addFaculty({
          user_id: 'FAC' + Math.floor(100 + Math.random() * 900),
          full_name: staffData.full_name,
          email: staffData.email || `${staffData.full_name.toLowerCase().replace(/\s+/g, '.')}@kkdgms.edu.in`,
          gender: staffData.gender,
          department: staffData.department,
          qualification: staffData.qualification,
          mobile: staffData.mobile,
          place: staffData.place,
          district: 'Kanyakumari'
        });
        setSuccessNotice(`Faculty member ${staffData.full_name} registered successfully!`);
      } else if (targetRole === 'warden') {
        await api.addWarden({
          user_id: 'WAR' + Math.floor(100 + Math.random() * 900),
          full_name: staffData.full_name,
          email: staffData.email || `warden.${staffData.full_name.toLowerCase().replace(/\s+/g, '.')}@kkdgms.edu.in`,
          gender: staffData.gender,
          mobile: staffData.mobile,
          hostel_name: staffData.hostel_name,
          qualification: staffData.qualification,
          district: 'Kanyakumari'
        });
        setSuccessNotice(`Hostel Warden ${staffData.full_name} registered successfully!`);
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
          <button 
            onClick={() => setSuccessNotice(null)}
            className="text-emerald-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <UserPlus className="w-4 h-4" />
              <span>Official Institutional Enrollment</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              New Admission & Registration Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Creates verified records in Supabase PostgreSQL tables with strict schema mapping.
            </p>
          </div>

          {/* Role selector buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTargetRole('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                targetRole === 'student' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setTargetRole('faculty')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                targetRole === 'faculty' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => setTargetRole('warden')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                targetRole === 'warden' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Warden
            </button>
          </div>
        </div>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
        {targetRole === 'student' ? (
          <>
            {/* Section 1: Academic & Identity */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>1. Academic Enrollment & System ID</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">EMIS / Student ID *</label>
                  <input
                    type="text"
                    value={studentData.user_id}
                    onChange={(e) => setStudentData({ ...studentData, user_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Standard *</label>
                  <select
                    value={studentData.student_class}
                    onChange={(e) => setStudentData({ ...studentData, student_class: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="6">Standard 6</option>
                    <option value="7">Standard 7</option>
                    <option value="8">Standard 8</option>
                    <option value="9">Standard 9</option>
                    <option value="10">Standard 10</option>
                    <option value="11">Standard 11</option>
                    <option value="12">Standard 12</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section & Medium</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={studentData.section}
                      onChange={(e) => setStudentData({ ...studentData, section: e.target.value })}
                      className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="A">Sec A</option>
                      <option value="B">Sec B</option>
                      <option value="C">Sec C</option>
                    </select>
                    <select
                      value={studentData.medium}
                      onChange={(e) => setStudentData({ ...studentData, medium: e.target.value })}
                      className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="English">English</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Personal Particulars */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>2. Student Personal Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Full Student Name (As per TC) *</label>
                  <input
                    type="text"
                    placeholder="e.g. A. Dhanush Kumar"
                    value={studentData.full_name}
                    onChange={(e) => setStudentData({ ...studentData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={studentData.gender}
                    onChange={(e) => setStudentData({ ...studentData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={studentData.dob}
                    onChange={(e) => setStudentData({ ...studentData, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={studentData.blood_group}
                    onChange={(e) => setStudentData({ ...studentData, blood_group: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B-">B Negative (B-)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    placeholder="12 Digit Aadhaar"
                    value={studentData.aadhaar}
                    onChange={(e) => setStudentData({ ...studentData, aadhaar: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    maxLength={12}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Parents & Contacts */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>3. Guardian, Residential & Hostel Particulars</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's Name *</label>
                  <input
                    type="text"
                    value={studentData.father_name}
                    onChange={(e) => setStudentData({ ...studentData, father_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="Father's full name"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={studentData.mother_name}
                    onChange={(e) => setStudentData({ ...studentData, mother_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="Mother's full name"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent Mobile Number *</label>
                  <input
                    type="tel"
                    value={studentData.mobile}
                    onChange={(e) => setStudentData({ ...studentData, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                    placeholder="10 digit mobile"
                    maxLength={10}
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Town / Native Place</label>
                  <input
                    type="text"
                    value={studentData.place}
                    onChange={(e) => setStudentData({ ...studentData, place: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. Nagercoil, Thuckalay"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hostel Status</label>
                  <select
                    value={studentData.hostel_type}
                    onChange={(e) => setStudentData({ ...studentData, hostel_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Resident">Hostel Resident (Boarder)</option>
                    <option value="Day Scholar">Day Scholar</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Allocated Hostel</label>
                  <select
                    value={studentData.hostel_name}
                    onChange={(e) => setStudentData({ ...studentData, hostel_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                    disabled={studentData.hostel_type !== 'Resident'}
                  >
                    <option value="Vivekananda Boys Hostel">Vivekananda Boys Hostel</option>
                    <option value="Mother Teresa Girls Hostel">Mother Teresa Girls Hostel</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Staff / Warden Registration Form */
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>{targetRole === 'faculty' ? 'Faculty Staff' : 'Hostel Warden'} Details</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. K. Anand, M.Sc., B.Ed."
                  value={staffData.full_name}
                  onChange={(e) => setStaffData({ ...staffData, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  placeholder="e.g. anand.physics@kkdgms.edu.in"
                  value={staffData.email}
                  onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department / Discipline</label>
                <select
                  value={staffData.department}
                  onChange={(e) => setStaffData({ ...staffData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology / Botany</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Tamil">Tamil Language</option>
                  <option value="English">English</option>
                  <option value="Hostel Administration">Hostel Administration</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Educational Qualification</label>
                <input
                  type="text"
                  placeholder="e.g. M.Sc., M.Phil., B.Ed."
                  value={staffData.qualification}
                  onChange={(e) => setStaffData({ ...staffData, qualification: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="10 digit mobile"
                  value={staffData.mobile}
                  onChange={(e) => setStaffData({ ...staffData, mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hostel Block Allocation</label>
                <select
                  value={staffData.hostel_name}
                  onChange={(e) => setStaffData({ ...staffData, hostel_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Vivekananda Boys Hostel">Vivekananda Boys Hostel</option>
                  <option value="Mother Teresa Girls Hostel">Mother Teresa Girls Hostel</option>
                  <option value="None">None (Day Staff)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Records are protected by Supabase Row Level Security (RLS).
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Deploying to Supabase...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

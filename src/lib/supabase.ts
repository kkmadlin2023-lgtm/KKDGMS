import { createClient } from '@supabase/supabase-js';
import {
  Student,
  Faculty,
  Warden,
  AdminUser,
  AttendanceRecord,
  MarkEntry,
  LeaveRequest,
  QuestionItem,
  Classroom,
  ExamAllocation,
  FacultyAssignment,
  NotificationItem,
  VisitorPass,
  AuditLog,
  ExamSeat,
  BonafideRequest
} from '../types';

// Default Supabase project configuration from the repository
const DEFAULT_SUPABASE_URL = 'https://kymsjrxjfmloibcbages.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bXNqcnhqZm1sb2liY2JhZ2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTg5NzcsImV4cCI6MjA5NDU5NDk3N30.yXqibP86VDsJ0gW48cJ0yjixgYGpljesLsiqe93K4OA';

export const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Initial realistic seed dataset for KKDGMS
const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-001',
    user_id: 'EMIS202401',
    full_name: 'A. Dhanush Kumar',
    dob: '2007-05-14',
    age: 17,
    gender: 'Male',
    aadhaar: '891234567890',
    email: 'dhanush.k@student.kkdgms.edu.in',
    student_class: '12',
    section: 'A',
    medium: 'English',
    academic_year: '2024-2025',
    student_group: 'Maths-Biology',
    father_name: 'V. Arumugam',
    mother_name: 'A. Meenakshi',
    mobile: '9443211111',
    place: 'Nagercoil',
    district: 'Kanyakumari',
    blood_group: 'O+',
    hostel_name: 'Vivekananda Boys Hostel',
    hostel_type: 'Resident',
    role: 'student'
  },
  {
    id: 's-002',
    user_id: 'EMIS202402',
    full_name: 'M. Sneha Priya',
    dob: '2007-09-22',
    age: 17,
    gender: 'Female',
    aadhaar: '782345678901',
    email: 'sneha.p@student.kkdgms.edu.in',
    student_class: '12',
    section: 'A',
    medium: 'English',
    academic_year: '2024-2025',
    student_group: 'Computer Science',
    father_name: 'S. Manikandan',
    mother_name: 'M. Valli',
    mobile: '9443222222',
    place: 'Kanyakumari',
    district: 'Kanyakumari',
    blood_group: 'A+',
    hostel_name: 'Mother Teresa Girls Hostel',
    hostel_type: 'Resident',
    role: 'student'
  },
  {
    id: 's-003',
    user_id: 'EMIS202403',
    full_name: 'R. Kabilan',
    dob: '2008-01-15',
    age: 16,
    gender: 'Male',
    aadhaar: '673456789012',
    email: 'kabilan.r@student.kkdgms.edu.in',
    student_class: '11',
    section: 'B',
    medium: 'Tamil',
    academic_year: '2024-2025',
    student_group: 'Commerce',
    father_name: 'K. Ramasamy',
    mother_name: 'R. Lakshmi',
    mobile: '9443233333',
    place: 'Thuckalay',
    district: 'Kanyakumari',
    blood_group: 'B+',
    hostel_type: 'Day Scholar',
    role: 'student'
  },
  {
    id: 's-004',
    user_id: 'EMIS202404',
    full_name: 'S. Ananya Devi',
    dob: '2009-03-10',
    age: 15,
    gender: 'Female',
    aadhaar: '564567890123',
    email: 'ananya.s@student.kkdgms.edu.in',
    student_class: '10',
    section: 'A',
    medium: 'English',
    academic_year: '2024-2025',
    student_group: 'General',
    father_name: 'P. Subramanian',
    mother_name: 'S. Gomathi',
    mobile: '9443244444',
    place: 'Colachel',
    district: 'Kanyakumari',
    blood_group: 'AB+',
    hostel_name: 'Mother Teresa Girls Hostel',
    hostel_type: 'Resident',
    role: 'student'
  },
  {
    id: 's-005',
    user_id: 'EMIS202405',
    full_name: 'V. Praveen Raj',
    dob: '2007-11-04',
    age: 16,
    gender: 'Male',
    aadhaar: '455678901234',
    email: 'praveen.v@student.kkdgms.edu.in',
    student_class: '11',
    section: 'A',
    medium: 'English',
    academic_year: '2024-2025',
    student_group: 'Maths-Biology',
    father_name: 'N. Velmurugan',
    mother_name: 'V. Chitra',
    mobile: '9443255555',
    place: 'Marthandam',
    district: 'Kanyakumari',
    blood_group: 'O-',
    hostel_name: 'Vivekananda Boys Hostel',
    hostel_type: 'Resident',
    role: 'student'
  }
];

const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'f-001',
    user_id: 'FAC001',
    full_name: 'Mrs. M. Rajeshwari, M.Sc., B.Ed.',
    email: 'rajeshwari.maths@kkdgms.edu.in',
    gender: 'Female',
    department: 'Mathematics',
    qualification: 'M.Sc., M.Phil., B.Ed.',
    mobile: '9443100002',
    place: 'Nagercoil',
    district: 'Kanyakumari',
    blood_group: 'O+',
    role: 'faculty'
  },
  {
    id: 'f-002',
    user_id: 'FAC002',
    full_name: 'Mr. K. Anand, M.Sc., B.Ed.',
    email: 'anand.physics@kkdgms.edu.in',
    gender: 'Male',
    department: 'Physics',
    qualification: 'M.Sc., B.Ed.',
    mobile: '9443100003',
    place: 'Kanyakumari',
    district: 'Kanyakumari',
    blood_group: 'B+',
    role: 'faculty'
  },
  {
    id: 'f-003',
    user_id: 'FAC003',
    full_name: 'Dr. P. Vasanthi, M.A., Ph.D.',
    email: 'vasanthi.tamil@kkdgms.edu.in',
    gender: 'Female',
    department: 'Tamil',
    qualification: 'M.A., Ph.D., B.Ed.',
    mobile: '9443100004',
    place: 'Thovalai',
    district: 'Kanyakumari',
    blood_group: 'A+',
    role: 'faculty'
  },
  {
    id: 'f-004',
    user_id: 'FAC004',
    full_name: 'Mr. D. Joseph, M.A., M.Ed.',
    email: 'joseph.english@kkdgms.edu.in',
    gender: 'Male',
    department: 'English',
    qualification: 'M.A., M.Ed.',
    mobile: '9443100005',
    place: 'Marthandam',
    district: 'Kanyakumari',
    blood_group: 'AB+',
    role: 'faculty'
  }
];

const INITIAL_WARDENS: Warden[] = [
  {
    id: 'w-001',
    user_id: 'WAR001',
    full_name: 'Mr. T. Murugan',
    email: 'murugan.hostel@kkdgms.edu.in',
    gender: 'Male',
    mobile: '9443100006',
    hostel_name: 'Vivekananda Boys Hostel',
    qualification: 'B.A., Physical Education',
    place: 'Nagercoil',
    district: 'Kanyakumari',
    role: 'warden'
  },
  {
    id: 'w-002',
    user_id: 'WAR002',
    full_name: 'Mrs. S. Parvathi',
    email: 'parvathi.hostel@kkdgms.edu.in',
    gender: 'Female',
    mobile: '9443100007',
    hostel_name: 'Mother Teresa Girls Hostel',
    qualification: 'B.Sc. Nursing',
    place: 'Kanyakumari',
    district: 'Kanyakumari',
    role: 'warden'
  }
];

const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'a-001',
    user_id: 'ADM001',
    full_name: 'Dr. S. Sundararajan, Ph.D.',
    email: 'principal@kkdgms.edu.in',
    department: 'Principal & Administration',
    mobile: '9443100001',
    qualification: 'M.Sc., M.Ed., Ph.D.',
    role: 'admin'
  }
];

const INITIAL_CLASSROOMS: Classroom[] = [
  { id: 'c-101', room_name: 'Hall 101', block: 'Academic Wing A', floor: 'Ground Floor', no_of_rows: 6, benches_per_row: 5, students_per_bench: 2, total_capacity: 60 },
  { id: 'c-102', room_name: 'Hall 102', block: 'Academic Wing A', floor: 'Ground Floor', no_of_rows: 6, benches_per_row: 5, students_per_bench: 2, total_capacity: 60 },
  { id: 'c-201', room_name: 'Hall 201', block: 'Academic Wing B', floor: 'First Floor', no_of_rows: 7, benches_per_row: 5, students_per_bench: 2, total_capacity: 70 },
  { id: 'c-301', room_name: 'Science Lab Hall', block: 'Science Block', floor: 'Second Floor', no_of_rows: 5, benches_per_row: 6, students_per_bench: 2, total_capacity: 60 }
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', student_id: 's-001', student_user_id: 'EMIS202401', student_name: 'A. Dhanush Kumar', student_class: '12', section: 'A', attendance_date: new Date().toISOString().split('T')[0], status: 'Present', marked_by: 'Mrs. M. Rajeshwari' },
  { id: 'att-2', student_id: 's-002', student_user_id: 'EMIS202402', student_name: 'M. Sneha Priya', student_class: '12', section: 'A', attendance_date: new Date().toISOString().split('T')[0], status: 'Present', marked_by: 'Mrs. M. Rajeshwari' },
  { id: 'att-3', student_id: 's-003', student_user_id: 'EMIS202403', student_name: 'R. Kabilan', student_class: '11', section: 'B', attendance_date: new Date().toISOString().split('T')[0], status: 'Late', marked_by: 'Mr. K. Anand', remarks: 'Bus delay' },
  { id: 'att-4', student_id: 's-004', student_user_id: 'EMIS202404', student_name: 'S. Ananya Devi', student_class: '10', section: 'A', attendance_date: new Date().toISOString().split('T')[0], status: 'Present', marked_by: 'Dr. P. Vasanthi' },
  { id: 'att-5', student_id: 's-005', student_user_id: 'EMIS202405', student_name: 'V. Praveen Raj', student_class: '11', section: 'A', attendance_date: new Date().toISOString().split('T')[0], status: 'Absent', marked_by: 'Mr. D. Joseph', remarks: 'Medical leave submitted' }
];

const INITIAL_MARKS: MarkEntry[] = [
  { id: 'm-1', student_id: 's-001', student_user_id: 'EMIS202401', student_name: 'A. Dhanush Kumar', student_class: '12', section: 'A', exam_name: 'Quarterly Examination', subject: 'Mathematics', marks_obtained: 94, max_marks: 100, grade: 'A1', remarks: 'Outstanding problem solving' },
  { id: 'm-2', student_id: 's-001', student_user_id: 'EMIS202401', student_name: 'A. Dhanush Kumar', student_class: '12', section: 'A', exam_name: 'Quarterly Examination', subject: 'Physics', marks_obtained: 88, max_marks: 100, grade: 'A2' },
  { id: 'm-3', student_id: 's-002', student_user_id: 'EMIS202402', student_name: 'M. Sneha Priya', student_class: '12', section: 'A', exam_name: 'Quarterly Examination', subject: 'Mathematics', marks_obtained: 98, max_marks: 100, grade: 'A1', remarks: 'Class Topper' },
  { id: 'm-4', student_id: 's-002', student_user_id: 'EMIS202402', student_name: 'M. Sneha Priya', student_class: '12', section: 'A', exam_name: 'Quarterly Examination', subject: 'Computer Science', marks_obtained: 100, max_marks: 100, grade: 'A1' },
  { id: 'm-5', student_id: 's-003', student_user_id: 'EMIS202403', student_name: 'R. Kabilan', student_class: '11', section: 'B', exam_name: 'Quarterly Examination', subject: 'Accountancy', marks_obtained: 82, max_marks: 100, grade: 'B1' },
  { id: 'm-6', student_id: 's-004', student_user_id: 'EMIS202404', student_name: 'S. Ananya Devi', student_class: '10', section: 'A', exam_name: 'Quarterly Examination', subject: 'Science', marks_obtained: 91, max_marks: 100, grade: 'A1' }
];

const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'l-001',
    applicant_type: 'student',
    applicant_id: 'EMIS202401',
    applicant_name: 'A. Dhanush Kumar',
    student_class: '12',
    section: 'A',
    leave_type: 'Hostel Outpass',
    from_date: '2024-09-12',
    to_date: '2024-09-15',
    reason: 'Family temple festival in native village. Father accompanied.',
    parent_phone: '9443211111',
    warden_approval: 'Approved',
    admin_approval: 'Approved',
    status: 'Approved'
  },
  {
    id: 'l-002',
    applicant_type: 'student',
    applicant_id: 'EMIS202405',
    applicant_name: 'V. Praveen Raj',
    student_class: '11',
    section: 'A',
    leave_type: 'Medical',
    from_date: '2024-09-08',
    to_date: '2024-09-10',
    reason: 'Viral fever diagnosed at primary health centre.',
    parent_phone: '9443255555',
    warden_approval: 'Approved',
    admin_approval: 'Pending',
    status: 'Pending'
  },
  {
    id: 'l-003',
    applicant_type: 'faculty',
    applicant_id: 'FAC002',
    applicant_name: 'Mr. K. Anand, M.Sc., B.Ed.',
    leave_type: 'Personal',
    from_date: '2024-09-22',
    to_date: '2024-09-23',
    reason: 'District level science exhibition coordinator duty at Tirunelveli.',
    warden_approval: 'Approved',
    admin_approval: 'Approved',
    status: 'Approved'
  }
];

const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: 'qb-001',
    title: 'Differential Calculus & Applications',
    subject: 'Mathematics',
    student_class: '12',
    unit_chapter: 'Unit 7 - Differential Calculus',
    question_type: 'Long Answer',
    question_text: 'Find the dimensions of the rectangle of maximum area that can be inscribed in a circle of radius r.',
    marks: 5,
    difficulty: 'Hard',
    status: 'approved',
    submitted_by: 'Mrs. M. Rajeshwari'
  },
  {
    id: 'qb-002',
    title: 'Ray Optics - Lens Makers Formula',
    subject: 'Physics',
    student_class: '12',
    unit_chapter: 'Unit 6 - Ray Optics',
    question_type: 'Long Answer',
    question_text: 'Derive the Lens Maker formula for a thin biconvex lens with proper ray diagram and sign convention.',
    marks: 5,
    difficulty: 'Medium',
    status: 'approved',
    submitted_by: 'Mr. K. Anand'
  },
  {
    id: 'qb-003',
    title: 'Periodic Properties of Elements',
    subject: 'Science',
    student_class: '10',
    unit_chapter: 'Periodic Classification',
    question_type: 'Short Answer',
    question_text: 'Explain why ionization energy increases across a period and decreases down a group.',
    marks: 3,
    difficulty: 'Medium',
    status: 'approved',
    submitted_by: 'Mr. K. Anand'
  },
  {
    id: 'qb-004',
    title: 'Silappathikaram - Moral Values',
    subject: 'Tamil',
    student_class: '11',
    unit_chapter: 'Kappiyangal',
    question_type: 'Long Answer',
    question_text: 'சிலப்பதிகாரம் உணர்த்தும் முப்பெரும் உண்மைகளை விளக்குக.',
    marks: 5,
    difficulty: 'Easy',
    status: 'approved',
    submitted_by: 'Dr. P. Vasanthi'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-001',
    title: 'Quarterly Examinations Schedule 2024-25',
    message: 'The quarterly examinations for standards 10, 11, and 12 will commence from September 20. Hall tickets and seating plans are available in the bench allocation section.',
    target_role: 'all',
    priority: 'urgent',
    created_by: 'Principal Office',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'n-002',
    title: 'Hostel Weekend Outpass Rule Updates',
    message: 'All hostel inmates must get digital approval from Warden and parent confirmation via phone before receiving outpass slips at the main security gate.',
    target_role: 'student',
    priority: 'normal',
    created_by: 'Hostel Administration',
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'n-003',
    title: 'Staff Meeting on Question Bank Verification',
    message: 'All HODs and subject teachers are requested to attend the evaluation review meeting this Friday at 03:30 PM in the Conference Hall.',
    target_role: 'faculty',
    priority: 'normal',
    created_by: 'Administration',
    created_at: new Date().toISOString()
  }
];

const INITIAL_VISITORS: VisitorPass[] = [
  {
    id: 'v-001',
    visitor_name: 'V. Arumugam',
    pass_number: 'PASS-2024-089',
    contact_number: '9443211111',
    relation: 'Father',
    student_id: 'EMIS202401',
    student_name: 'A. Dhanush Kumar',
    student_class: '12-A',
    purpose: 'Fee clearance and submitted medical certificate for leave.',
    in_time: '10:30 AM',
    out_time: '11:45 AM',
    status: 'Checked Out',
    approved_by: 'Main Gate Security'
  },
  {
    id: 'v-002',
    visitor_name: 'M. Sundari',
    pass_number: 'PASS-2024-092',
    contact_number: '9443299887',
    relation: 'Mother',
    student_id: 'EMIS202404',
    student_name: 'S. Ananya Devi',
    student_class: '10-A',
    purpose: 'Delivering winter clothing and essential books to hostel warden.',
    in_time: '02:15 PM',
    status: 'Active',
    approved_by: 'Hostel Gate Security'
  }
];

const INITIAL_FACULTY_ASSIGN: FacultyAssignment[] = [
  { id: 'fa-1', faculty_id: 'FAC001', faculty_name: 'Mrs. M. Rajeshwari', subject: 'Mathematics', student_class: '12', section: 'A', academic_year: '2024-2025', periods_per_week: 7 },
  { id: 'fa-2', faculty_id: 'FAC001', faculty_name: 'Mrs. M. Rajeshwari', subject: 'Mathematics', student_class: '11', section: 'A', academic_year: '2024-2025', periods_per_week: 6 },
  { id: 'fa-3', faculty_id: 'FAC002', faculty_name: 'Mr. K. Anand', subject: 'Physics', student_class: '12', section: 'A', academic_year: '2024-2025', periods_per_week: 6 },
  { id: 'fa-4', faculty_id: 'FAC002', faculty_name: 'Mr. K. Anand', subject: 'Physics', student_class: '11', section: 'A', academic_year: '2024-2025', periods_per_week: 5 },
  { id: 'fa-5', faculty_id: 'FAC003', faculty_name: 'Dr. P. Vasanthi', subject: 'Tamil', student_class: '10', section: 'A', academic_year: '2024-2025', periods_per_week: 5 },
  { id: 'fa-6', faculty_id: 'FAC004', faculty_name: 'Mr. D. Joseph', subject: 'English', student_class: '12', section: 'A', academic_year: '2024-2025', periods_per_week: 5 }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', user_id: 'ADM001', email: 'principal@kkdgms.edu.in', role: 'admin', ip_address: '192.168.1.10', user_agent: 'Chrome/124.0 (Windows NT 10.0)', status: 'SUCCESS', logged_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'log-2', user_id: 'FAC001', email: 'rajeshwari.maths@kkdgms.edu.in', role: 'faculty', ip_address: '192.168.1.42', user_agent: 'Firefox/125.0 (macOS)', status: 'SUCCESS', logged_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'log-3', user_id: 'WAR001', email: 'murugan.hostel@kkdgms.edu.in', role: 'warden', ip_address: '192.168.1.88', user_agent: 'Safari/17.4 (iOS Mobile)', status: 'SUCCESS', logged_at: new Date(Date.now() - 14400000).toISOString() },
  { id: 'log-4', user_id: 'EMIS202401', email: 'dhanush.k@student.kkdgms.edu.in', role: 'student', ip_address: '192.168.1.112', user_agent: 'Chrome/124.0 (Android)', status: 'SUCCESS', logged_at: new Date(Date.now() - 18000000).toISOString() }
];

// In-Memory Storage Cache with local storage persistence
class DataStore {
  students: Student[] = INITIAL_STUDENTS;
  faculty: Faculty[] = INITIAL_FACULTY;
  wardens: Warden[] = INITIAL_WARDENS;
  admins: AdminUser[] = INITIAL_ADMINS;
  attendance: AttendanceRecord[] = INITIAL_ATTENDANCE;
  marks: MarkEntry[] = INITIAL_MARKS;
  leaves: LeaveRequest[] = INITIAL_LEAVES;
  questions: QuestionItem[] = INITIAL_QUESTIONS;
  classrooms: Classroom[] = INITIAL_CLASSROOMS;
  notifications: NotificationItem[] = INITIAL_NOTIFICATIONS;
  visitors: VisitorPass[] = INITIAL_VISITORS;
  facultyAssign: FacultyAssignment[] = INITIAL_FACULTY_ASSIGN;
  auditLogs: AuditLog[] = INITIAL_AUDIT_LOGS;
  allocations: ExamAllocation[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('kkdgms_data_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.students?.length) this.students = parsed.students;
        if (parsed.faculty?.length) this.faculty = parsed.faculty;
        if (parsed.wardens?.length) this.wardens = parsed.wardens;
        if (parsed.admins?.length) this.admins = parsed.admins;
        if (parsed.attendance?.length) this.attendance = parsed.attendance;
        if (parsed.marks?.length) this.marks = parsed.marks;
        if (parsed.leaves?.length) this.leaves = parsed.leaves;
        if (parsed.questions?.length) this.questions = parsed.questions;
        if (parsed.classrooms?.length) this.classrooms = parsed.classrooms;
        if (parsed.notifications?.length) this.notifications = parsed.notifications;
        if (parsed.visitors?.length) this.visitors = parsed.visitors;
        if (parsed.facultyAssign?.length) this.facultyAssign = parsed.facultyAssign;
        if (parsed.auditLogs?.length) this.auditLogs = parsed.auditLogs;
      }
    } catch {
      // fallback to initial
    }
  }

  save() {
    try {
      localStorage.setItem('kkdgms_data_store', JSON.stringify({
        students: this.students,
        faculty: this.faculty,
        wardens: this.wardens,
        admins: this.admins,
        attendance: this.attendance,
        marks: this.marks,
        leaves: this.leaves,
        questions: this.questions,
        classrooms: this.classrooms,
        notifications: this.notifications,
        visitors: this.visitors,
        facultyAssign: this.facultyAssign,
        auditLogs: this.auditLogs,
      }));
    } catch {
      // storage full or disabled
    }
  }
}

export const localStore = new DataStore();

// Health Check Helper
export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  latencyMs: number;
  tables: Record<string, boolean>;
  message: string;
}> {
  const startTime = Date.now();
  const tables = {
    students: false,
    faculty_details: false,
    wardens: false,
    admins: false,
    student_attendance: false,
    marks_entries: false,
    student_leaves: false,
    question_bank: false,
    classrooms: false,
    notifications: false,
    visitors: false,
    login_audit_logs: false,
  };

  try {
    const { error } = await supabase.from('notifications').select('id').limit(1);
    const latencyMs = Date.now() - startTime;

    if (!error) {
      tables.notifications = true;
    }

    // Check key tables
    const tableKeys = Object.keys(tables);
    for (const tbl of tableKeys) {
      if (tbl === 'notifications') continue;
      try {
        const { error: tblError } = await supabase.from(tbl).select('id').limit(1);
        tables[tbl] = !tblError;
      } catch {
        tables[tbl] = false;
      }
    }

    const availableCount = Object.values(tables).filter(Boolean).length;

    return {
      connected: true,
      latencyMs,
      tables,
      message: `Connected to Supabase endpoint (${availableCount}/${tableKeys.length} tables verified)`
    };
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Date.now() - startTime,
      tables,
      message: err?.message || 'Failed to connect to Supabase server'
    };
  }
}

// Data API with Supabase Sync & Fallback
export const api = {
  // Students
  async getStudents(): Promise<Student[]> {
    try {
      const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Student[];
      }
    } catch {
      // fallback
    }
    return localStore.students;
  },

  async addStudent(student: Omit<Student, 'id' | 'role'>): Promise<Student> {
    const newStudent: Student = {
      ...student,
      id: 's-' + Date.now(),
      role: 'student',
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('students').insert([newStudent]);
    } catch {
      // fallback
    }
    localStore.students.unshift(newStudent);
    localStore.save();
    return newStudent;
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<void> {
    try {
      await supabase.from('students').update(updates).eq('id', id);
    } catch {
      // fallback
    }
    const idx = localStore.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      localStore.students[idx] = { ...localStore.students[idx], ...updates };
      localStore.save();
    }
  },

  async deleteStudent(id: string): Promise<void> {
    try {
      await supabase.from('students').delete().eq('id', id);
    } catch {
      // fallback
    }
    localStore.students = localStore.students.filter(s => s.id !== id);
    localStore.save();
  },

  // Faculty
  async getFaculty(): Promise<Faculty[]> {
    try {
      const { data, error } = await supabase.from('faculty_details').select('*');
      if (!error && data && data.length > 0) return data as Faculty[];
    } catch {}
    return localStore.faculty;
  },

  async addFaculty(fac: Omit<Faculty, 'id' | 'role'>): Promise<Faculty> {
    const newFac: Faculty = {
      ...fac,
      id: 'f-' + Date.now(),
      role: 'faculty',
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('faculty_details').insert([newFac]);
    } catch {}
    localStore.faculty.unshift(newFac);
    localStore.save();
    return newFac;
  },

  // Wardens
  async getWardens(): Promise<Warden[]> {
    try {
      const { data, error } = await supabase.from('wardens').select('*');
      if (!error && data && data.length > 0) return data as Warden[];
    } catch {}
    return localStore.wardens;
  },

  async addWarden(war: Omit<Warden, 'id' | 'role'>): Promise<Warden> {
    const newWar: Warden = {
      ...war,
      id: 'w-' + Date.now(),
      role: 'warden',
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('wardens').insert([newWar]);
    } catch {}
    localStore.wardens.unshift(newWar);
    localStore.save();
    return newWar;
  },

  // Admins
  async getAdmins(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase.from('admins').select('*');
      if (!error && data && data.length > 0) return data as AdminUser[];
    } catch {}
    return localStore.admins;
  },

  // Attendance
  async getAttendance(date?: string, studentClass?: string): Promise<AttendanceRecord[]> {
    try {
      let query = supabase.from('student_attendance').select('*');
      if (date) query = query.eq('attendance_date', date);
      if (studentClass) query = query.eq('student_class', studentClass);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as AttendanceRecord[];
    } catch {}
    return localStore.attendance.filter(a => {
      if (date && a.attendance_date !== date) return false;
      if (studentClass && a.student_class !== studentClass) return false;
      return true;
    });
  },

  async markAttendance(records: Array<Omit<AttendanceRecord, 'id' | 'created_at'>>): Promise<void> {
    const created: AttendanceRecord[] = records.map(r => ({
      ...r,
      id: 'att-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString()
    }));
    try {
      await supabase.from('student_attendance').upsert(created, { onConflict: 'student_id,attendance_date' });
    } catch {}
    // merge into localStore
    for (const rec of created) {
      const existingIdx = localStore.attendance.findIndex(a => a.student_id === rec.student_id && a.attendance_date === rec.attendance_date);
      if (existingIdx !== -1) {
        localStore.attendance[existingIdx] = rec;
      } else {
        localStore.attendance.unshift(rec);
      }
    }
    localStore.save();
  },

  // Marks
  async getMarks(studentClass?: string, examName?: string): Promise<MarkEntry[]> {
    try {
      let query = supabase.from('marks_entries').select('*');
      if (studentClass) query = query.eq('student_class', studentClass);
      if (examName) query = query.eq('exam_name', examName);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as MarkEntry[];
    } catch {}
    return localStore.marks.filter(m => {
      if (studentClass && m.student_class !== studentClass) return false;
      if (examName && m.exam_name !== examName) return false;
      return true;
    });
  },

  async addMark(entry: Omit<MarkEntry, 'id' | 'created_at'>): Promise<MarkEntry> {
    const newMark: MarkEntry = {
      ...entry,
      id: 'm-' + Date.now(),
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('marks_entries').insert([newMark]);
    } catch {}
    localStore.marks.unshift(newMark);
    localStore.save();
    return newMark;
  },

  // Leaves
  async getLeaves(): Promise<LeaveRequest[]> {
    try {
      const { data, error } = await supabase.from('student_leaves').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as LeaveRequest[];
    } catch {}
    return localStore.leaves;
  },

  async submitLeave(leave: Omit<LeaveRequest, 'id' | 'created_at' | 'status' | 'warden_approval' | 'admin_approval'>): Promise<LeaveRequest> {
    const newLeave: LeaveRequest = {
      ...leave,
      id: 'l-' + Date.now(),
      warden_approval: 'Pending',
      admin_approval: 'Pending',
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('student_leaves').insert([newLeave]);
    } catch {}
    localStore.leaves.unshift(newLeave);
    localStore.save();
    return newLeave;
  },

  async updateLeaveApproval(id: string, approverRole: 'warden' | 'admin', decision: 'Approved' | 'Rejected'): Promise<void> {
    const idx = localStore.leaves.findIndex(l => l.id === id);
    if (idx !== -1) {
      if (approverRole === 'warden') {
        localStore.leaves[idx].warden_approval = decision;
      } else {
        localStore.leaves[idx].admin_approval = decision;
      }

      // Final status logic
      if (localStore.leaves[idx].admin_approval === 'Approved' && (localStore.leaves[idx].applicant_type === 'faculty' || localStore.leaves[idx].warden_approval === 'Approved')) {
        localStore.leaves[idx].status = 'Approved';
      } else if (localStore.leaves[idx].warden_approval === 'Rejected' || localStore.leaves[idx].admin_approval === 'Rejected') {
        localStore.leaves[idx].status = 'Rejected';
      }
      localStore.save();

      try {
        await supabase.from('student_leaves').update({
          warden_approval: localStore.leaves[idx].warden_approval,
          admin_approval: localStore.leaves[idx].admin_approval,
          status: localStore.leaves[idx].status,
        }).eq('id', id);
      } catch {}
    }
  },

  // Question Bank
  async getQuestionBank(): Promise<QuestionItem[]> {
    try {
      const { data, error } = await supabase.from('question_bank').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as QuestionItem[];
    } catch {}
    return localStore.questions;
  },

  async addQuestion(q: Omit<QuestionItem, 'id' | 'created_at' | 'status'>): Promise<QuestionItem> {
    const newQ: QuestionItem = {
      ...q,
      id: 'qb-' + Date.now(),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('question_bank').insert([newQ]);
    } catch {}
    localStore.questions.unshift(newQ);
    localStore.save();
    return newQ;
  },

  async updateQuestionStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const idx = localStore.questions.findIndex(q => q.id === id);
    if (idx !== -1) {
      localStore.questions[idx].status = status;
      localStore.save();
    }
    try {
      await supabase.from('question_bank').update({ status }).eq('id', id);
    } catch {}
  },

  // Classrooms
  async getClassrooms(): Promise<Classroom[]> {
    try {
      const { data, error } = await supabase.from('classrooms').select('*');
      if (!error && data && data.length > 0) return data as Classroom[];
    } catch {}
    return localStore.classrooms;
  },

  async addClassroom(c: Omit<Classroom, 'id' | 'total_capacity'>): Promise<Classroom> {
    const total = c.no_of_rows * c.benches_per_row * c.students_per_bench;
    const newC: Classroom = {
      ...c,
      id: 'c-' + Date.now(),
      total_capacity: total
    };
    try {
      await supabase.from('classrooms').insert([newC]);
    } catch {}
    localStore.classrooms.push(newC);
    localStore.save();
    return newC;
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as NotificationItem[];
    } catch {}
    return localStore.notifications;
  },

  async addNotification(n: Omit<NotificationItem, 'id' | 'created_at'>): Promise<NotificationItem> {
    const newN: NotificationItem = {
      ...n,
      id: 'n-' + Date.now(),
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('notifications').insert([newN]);
    } catch {}
    localStore.notifications.unshift(newN);
    localStore.save();
    return newN;
  },

  // Visitors
  async getVisitors(): Promise<VisitorPass[]> {
    try {
      const { data, error } = await supabase.from('visitors').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as VisitorPass[];
    } catch {}
    return localStore.visitors;
  },

  async addVisitor(v: Omit<VisitorPass, 'id' | 'created_at' | 'status'>): Promise<VisitorPass> {
    const newV: VisitorPass = {
      ...v,
      id: 'v-' + Date.now(),
      status: 'Active',
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('visitors').insert([newV]);
    } catch {}
    localStore.visitors.unshift(newV);
    localStore.save();
    return newV;
  },

  async checkoutVisitor(id: string): Promise<void> {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const idx = localStore.visitors.findIndex(v => v.id === id);
    if (idx !== -1) {
      localStore.visitors[idx].status = 'Checked Out';
      localStore.visitors[idx].out_time = nowTime;
      localStore.save();
    }
    try {
      await supabase.from('visitors').update({ status: 'Checked Out', out_time: nowTime }).eq('id', id);
    } catch {}
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const { data, error } = await supabase.from('login_audit_logs').select('*').order('logged_at', { ascending: false });
      if (!error && data && data.length > 0) return data as AuditLog[];
    } catch {}
    return localStore.auditLogs;
  },

  async logAudit(entry: Omit<AuditLog, 'id' | 'logged_at'>): Promise<void> {
    const log: AuditLog = {
      ...entry,
      id: 'log-' + Date.now(),
      logged_at: new Date().toISOString()
    };
    try {
      await supabase.from('login_audit_logs').insert([log]);
    } catch {}
    localStore.auditLogs.unshift(log);
    localStore.save();
  },

  // Exam Seating
  async getExamSeating(hallName?: string): Promise<ExamSeat[]> {
    try {
      let query = supabase.from('exam_seating').select('*');
      if (hallName) query = query.eq('hall_name', hallName);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as ExamSeat[];
    } catch {}
    const stored = localStorage.getItem('kkdgms_exam_seating');
    return stored ? JSON.parse(stored) : [];
  },

  async saveExamSeating(seats: ExamSeat[]): Promise<void> {
    localStorage.setItem('kkdgms_exam_seating', JSON.stringify(seats));
    try {
      await supabase.from('exam_seating').upsert(seats);
    } catch {}
  },

  // Bonafide Requests
  async createBonafideRequest(req: Omit<BonafideRequest, 'id'>): Promise<BonafideRequest> {
    const item: BonafideRequest = {
      ...req,
      id: 'bon-' + Date.now(),
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('bonafide_requests').insert([item]);
    } catch {}
    const stored = localStorage.getItem('kkdgms_bonafide_requests');
    const list = stored ? JSON.parse(stored) : [];
    list.unshift(item);
    localStorage.setItem('kkdgms_bonafide_requests', JSON.stringify(list));
    return item;
  },

  // Faculty Assignments
  async getFacultyAssignments(): Promise<FacultyAssignment[]> {
    try {
      const { data, error } = await supabase.from('faculty_assignments').select('*');
      if (!error && data && data.length > 0) return data as FacultyAssignment[];
    } catch {}
    return [
      { id: 'fa-1', faculty_id: 'f-001', faculty_name: 'Dr. K. Anand', subject: 'Mathematics', student_class: '12', section: 'A', academic_year: '2024-2025', periods_per_week: 6 },
      { id: 'fa-2', faculty_id: 'f-001', faculty_name: 'Dr. K. Anand', subject: 'Mathematics', student_class: '11', section: 'A', academic_year: '2024-2025', periods_per_week: 6 },
      { id: 'fa-3', faculty_id: 'f-002', faculty_name: 'Mrs. S. Radhika', subject: 'Physics', student_class: '12', section: 'A', academic_year: '2024-2025', periods_per_week: 6 },
      { id: 'fa-4', faculty_id: 'f-003', faculty_name: 'Mr. P. Velmurugan', subject: 'Computer Science', student_class: '12', section: 'A', academic_year: '2024-2025', periods_per_week: 6 }
    ];
  },

  async addFacultyAssignment(assignment: Omit<FacultyAssignment, 'id'>): Promise<FacultyAssignment> {
    const newA: FacultyAssignment = {
      ...assignment,
      id: 'fa-' + Date.now(),
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('faculty_assignments').insert([newA]);
    } catch {}
    return newA;
  },

  // Aliases for component convenience
  publishNotification: (n: any) => api.addNotification(n),
  getVisitorPasses: () => api.getVisitors(),
  createVisitorPass: (v: any) => api.addVisitor(v),
  checkOutVisitor: (id: string) => api.checkoutVisitor(id)
};

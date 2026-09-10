// =====================================================================
// KKDGMS — Master Supabase Client, Schema Models, & Fallback Store
// =====================================================================

import { createClient } from '@supabase/supabase-js';
import {
  Student,
  Faculty,
  Warden,
  AdminUser,
  Technician,
  GuestUser,
  AttendanceRecord,
  HolidayRecord,
  MarkEntry,
  OnlineExam,
  OnlineExamAttempt,
  LeaveRequest,
  GateMovement,
  QuestionItem,
  Classroom,
  ExamAllocation,
  FacultyAssignment,
  NotificationItem,
  VisitorPass,
  AuditLog,
  ExamSeat,
  BonafideRequest,
  PeriodAllocation,
  StoryItem,
  AnnouncementItem,
  SchoolEvent,
  FeedbackItem,
  ExpenseRecord,
  SchoolDocument,
  RolePagePermission,
  ActiveUserSession,
  UserRole
} from '../types';

// Default Supabase project configuration from the repository (Public Anon Key ONLY)
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

// ---------------------------------------------------------------------
// Default Realistic Seed Data
// ---------------------------------------------------------------------
const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-001',
    user_id: 'EMIS202401',
    full_name: 'A. Dhanush Kumar',
    first_name: 'Dhanush',
    last_name: 'Kumar',
    initial: 'A',
    dob: '2007-05-14',
    age: 17,
    gender: 'Male',
    aadhaar: '891234567890',
    email: 'dhanush.k@student.kkdgms.edu.in',
    student_class: '12',
    section: 'A',
    medium: 'English',
    academic_year: '2024-2025',
    student_group: 'Bio-Maths',
    assigned_faculty_name: 'Mrs. M. Rajeshwari',
    father_name: 'V. Arumugam',
    mother_name: 'A. Meenakshi',
    mobile: '9443211111',
    door_no: '14/B',
    street_name: 'Mela Street',
    place: 'Navalcadu',
    city: 'Nagercoil',
    district: 'Kanyakumari',
    state: 'Tamil Nadu',
    pincode: '629002',
    blood_group: 'O+',
    hostel_name: 'Vivekananda Boys Hostel',
    hostel_type: 'Resident',
    warden_name: 'Mr. T. Murugan',
    role: 'student'
  },
  {
    id: 's-002',
    user_id: 'EMIS202402',
    full_name: 'M. Sneha Priya',
    first_name: 'Sneha',
    last_name: 'Priya',
    initial: 'M',
    dob: '2007-09-22',
    age: 17,
    gender: 'Female',
    aadhaar: '782345678901',
    email: 'sneha.p@student.kkdgms.edu.in',
    student_class: '12',
    section: 'A',
    medium: 'English',
    academic_year: '2024-2025',
    student_group: 'Maths-Computer',
    assigned_faculty_name: 'Mrs. M. Rajeshwari',
    father_name: 'S. Manikandan',
    mother_name: 'M. Valli',
    mobile: '9443222222',
    door_no: '7/2',
    street_name: 'Temple Road',
    place: 'Kanyakumari',
    city: 'Kanyakumari',
    district: 'Kanyakumari',
    state: 'Tamil Nadu',
    pincode: '629702',
    blood_group: 'A+',
    hostel_name: 'Mother Teresa Girls Hostel',
    hostel_type: 'Resident',
    warden_name: 'Mrs. S. Parvathi',
    role: 'student'
  },
  {
    id: 's-003',
    user_id: 'EMIS202403',
    full_name: 'R. Kabilan',
    first_name: 'Kabilan',
    last_name: 'Ramasamy',
    initial: 'R',
    dob: '2008-01-15',
    age: 16,
    gender: 'Male',
    aadhaar: '673456789012',
    email: 'kabilan.r@student.kkdgms.edu.in',
    student_class: '11',
    section: 'B',
    medium: 'Tamil',
    academic_year: '2024-2025',
    student_group: 'Accountancy',
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
    first_name: 'Ananya',
    last_name: 'Devi',
    initial: 'S',
    dob: '2009-03-10',
    age: 15,
    gender: 'Female',
    aadhaar: '564567890123',
    email: 'ananya.s@student.kkdgms.edu.in',
    student_class: '10',
    section: 'A',
    medium: 'English',
    academic_year: '2024-2025',
    student_group: 'Non-Group',
    father_name: 'P. Subramanian',
    mother_name: 'S. Gomathi',
    mobile: '9443244444',
    place: 'Colachel',
    district: 'Kanyakumari',
    blood_group: 'AB+',
    hostel_name: 'Mother Teresa Girls Hostel',
    hostel_type: 'Resident',
    warden_name: 'Mrs. S. Parvathi',
    role: 'student'
  }
];

const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'f-001',
    user_id: 'FAC001',
    full_name: 'Mrs. M. Rajeshwari, M.Sc., B.Ed.',
    first_name: 'Rajeshwari',
    last_name: 'M',
    initial: 'M',
    email: 'rajeshwari.maths@kkdgms.edu.in',
    gender: 'Female',
    department: 'Mathematics',
    designation: 'PGT Mathematics',
    qualification: 'M.Sc., M.Phil., B.Ed.',
    experience: '12 Years',
    mobile: '9443100002',
    place: 'Nagercoil',
    district: 'Kanyakumari',
    blood_group: 'O+',
    assigned_class: '12',
    assigned_section: 'A',
    role: 'faculty'
  },
  {
    id: 'f-002',
    user_id: 'FAC002',
    full_name: 'Mr. K. Anand, M.Sc., B.Ed.',
    first_name: 'Anand',
    last_name: 'K',
    initial: 'K',
    email: 'anand.physics@kkdgms.edu.in',
    gender: 'Male',
    department: 'Physics',
    designation: 'PGT Physics',
    qualification: 'M.Sc., B.Ed.',
    experience: '10 Years',
    mobile: '9443100003',
    place: 'Kanyakumari',
    district: 'Kanyakumari',
    blood_group: 'B+',
    assigned_class: '11',
    assigned_section: 'A',
    role: 'faculty'
  },
  {
    id: 'f-003',
    user_id: 'FAC003',
    full_name: 'Dr. P. Vasanthi, M.A., Ph.D.',
    first_name: 'Vasanthi',
    last_name: 'P',
    initial: 'P',
    email: 'vasanthi.tamil@kkdgms.edu.in',
    gender: 'Female',
    department: 'Tamil',
    designation: 'HOD Tamil',
    qualification: 'M.A., Ph.D., B.Ed.',
    experience: '15 Years',
    mobile: '9443100004',
    place: 'Thovalai',
    district: 'Kanyakumari',
    blood_group: 'A+',
    assigned_class: '10',
    assigned_section: 'A',
    role: 'faculty'
  },
  {
    id: 'f-004',
    user_id: 'FAC004',
    full_name: 'Mr. D. Joseph, M.A., M.Ed.',
    first_name: 'Joseph',
    last_name: 'D',
    initial: 'D',
    email: 'joseph.english@kkdgms.edu.in',
    gender: 'Male',
    department: 'English',
    designation: 'PGT English',
    qualification: 'M.A., M.Ed.',
    experience: '8 Years',
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
    first_name: 'Murugan',
    last_name: 'T',
    initial: 'T',
    email: 'murugan.hostel@kkdgms.edu.in',
    gender: 'Male',
    mobile: '9443100006',
    hostel_name: 'Vivekananda Boys Hostel',
    hostel_gender: 'Boys',
    qualification: 'B.A., Physical Education',
    experience: '7 Years',
    place: 'Nagercoil',
    district: 'Kanyakumari',
    role: 'warden'
  },
  {
    id: 'w-002',
    user_id: 'WAR002',
    full_name: 'Mrs. S. Parvathi',
    first_name: 'Parvathi',
    last_name: 'S',
    initial: 'S',
    email: 'parvathi.hostel@kkdgms.edu.in',
    gender: 'Female',
    mobile: '9443100007',
    hostel_name: 'Mother Teresa Girls Hostel',
    hostel_gender: 'Girls',
    qualification: 'B.Sc. Nursing',
    experience: '9 Years',
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
    first_name: 'Sundararajan',
    last_name: 'S',
    initial: 'Dr',
    email: 'principal@kkdgms.edu.in',
    department: 'Principal & Administration',
    mobile: '9443100001',
    qualification: 'M.Sc., M.Ed., Ph.D.',
    experience: '22 Years',
    role: 'admin'
  }
];

const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 't-001',
    user_id: 'TECH001',
    full_name: 'Mr. R. Vignesh, B.Tech',
    first_name: 'Vignesh',
    last_name: 'R',
    initial: 'R',
    email: 'vignesh.tech@kkdgms.edu.in',
    gender: 'Male',
    department: 'Computer Systems & Examination Cell',
    qualification: 'B.Tech IT',
    experience: '5 Years',
    mobile: '9443100008',
    role: 'technician'
  }
];

const INITIAL_GUESTS: GuestUser[] = [
  {
    id: 'g-001',
    user_id: 'GUEST01',
    full_name: 'District Inspection Officer',
    email: 'inspect.kk@tn.gov.in',
    organization: 'Department of School Education, TN',
    purpose: 'Model School Evaluation',
    role: 'guest'
  }
];

const INITIAL_STORIES: StoryItem[] = [
  {
    id: 'story-1',
    media_url: '/kanyakumari.jpg',
    media_type: 'image',
    caption: 'Sunrise assembly at KKDGMS Model Campus Navalcadu',
    duration_seconds: 15,
    created_by_role: 'admin',
    created_by_name: 'Principal Office',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    is_active: true
  },
  {
    id: 'story-2',
    media_url: '/icon.jpg',
    media_type: 'image',
    caption: 'State Level Science Exhibition Winners from KKDGMS',
    duration_seconds: 30,
    created_by_role: 'faculty',
    created_by_name: 'Science Club Coordinator',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    expires_at: new Date(Date.now() + 82800000).toISOString(),
    is_active: true
  }
];

const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'ev-1',
    title: 'Annual Sports Meet & Athletic Championship 2024',
    description: 'Inter-house athletic competitions, track events, and march-past ceremony presided over by District Sports Officer.',
    event_date: '2024-10-15',
    start_time: '08:30 AM',
    end_time: '04:30 PM',
    location: 'Main Sports Complex Stadium',
    expiry_date: '2024-10-16',
    status: 'upcoming',
    created_by: 'Physical Education Dept',
    created_at: new Date().toISOString()
  },
  {
    id: 'ev-2',
    title: 'Parent-Teacher Academic Review Assembly',
    description: 'Quarterly examination performance assessment and individual feedback sessions with subject faculties.',
    event_date: '2024-10-05',
    start_time: '10:00 AM',
    end_time: '02:00 PM',
    location: 'Auditorium Hall A',
    expiry_date: '2024-10-06',
    status: 'upcoming',
    created_by: 'Administration',
    created_at: new Date().toISOString()
  }
];

const INITIAL_ONLINE_EXAMS: OnlineExam[] = [
  {
    id: 'exam-001',
    exam_name: 'Mathematics Chapter 7 Differential Calculus Test',
    subject: 'Mathematics',
    student_class: '12',
    section: 'A',
    total_marks: 20,
    pass_marks: 8,
    duration_minutes: 30,
    exam_password: 'MATHS',
    start_otp: '784219',
    start_otp_expires_at: Date.now() + 10000,
    end_otp: '932145',
    status: 'active',
    assigned_faculty_id: 'FAC001',
    assigned_faculty_name: 'Mrs. M. Rajeshwari',
    questions: [
      {
        id: 'q1',
        question_text: 'What is the derivative of f(x) = sin(2x) with respect to x?',
        choices: [
          { id: 'c1', text: '2 cos(2x)' },
          { id: 'c2', text: 'cos(2x)' },
          { id: 'c3', text: '-2 cos(2x)' },
          { id: 'c4', text: '2 sin(2x)' }
        ],
        correct_answer_id: 'c1',
        marks: 5,
        negative_marks: 0,
        explanation: 'd/dx[sin(2x)] = cos(2x) * 2 = 2 cos(2x)'
      },
      {
        id: 'q2',
        question_text: 'If y = e^(3x), then dy/dx is equal to:',
        choices: [
          { id: 'c1', text: 'e^(3x)' },
          { id: 'c2', text: '3 e^(3x)' },
          { id: 'c3', text: '3x e^(3x)' },
          { id: 'c4', text: '3 e^(2x)' }
        ],
        correct_answer_id: 'c2',
        marks: 5,
        negative_marks: 0,
        explanation: 'Chain rule: 3 * e^(3x)'
      },
      {
        id: 'q3',
        question_text: 'The slope of the tangent to the curve y = x^2 at x = 3 is:',
        choices: [
          { id: 'c1', text: '3' },
          { id: 'c2', text: '9' },
          { id: 'c3', text: '6' },
          { id: 'c4', text: '12' }
        ],
        correct_answer_id: 'c3',
        marks: 5,
        negative_marks: 0,
        explanation: 'dy/dx = 2x, at x=3 slope is 2(3) = 6'
      },
      {
        id: 'q4',
        question_text: 'Limit of (sin x) / x as x approaches 0 is:',
        choices: [
          { id: 'c1', text: '0' },
          { id: 'c2', text: '1' },
          { id: 'c3', text: 'Infinity' },
          { id: 'c4', text: 'Undefined' }
        ],
        correct_answer_id: 'c2',
        marks: 5,
        negative_marks: 0,
        explanation: 'Standard trigonometric limit is 1'
      }
    ],
    created_at: new Date().toISOString()
  }
];

const INITIAL_ROLE_PERMISSIONS: RolePagePermission[] = [
  { id: 'p1', page_id: 'dashboard', page_name: 'Admin Dashboard', role: 'admin', can_view: true, can_create: true, can_edit: true, can_delete: true, can_approve: true, can_publish: true, can_export: true },
  { id: 'p2', page_id: 'admission', page_name: 'Admission Desk', role: 'admin', can_view: true, can_create: true, can_edit: true, can_delete: true, can_approve: true, can_publish: true, can_export: true },
  { id: 'p3', page_id: 'attendance', page_name: 'Attendance', role: 'faculty', can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_publish: false, can_export: true },
  { id: 'p4', page_id: 'marksheet', page_name: 'Marksheet', role: 'faculty', can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_publish: true, can_export: true },
  { id: 'p5', page_id: 'online-exam', page_name: 'Online Exam', role: 'student', can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false, can_publish: false, can_export: false },
  { id: 'p6', page_id: 'hostel-gate', page_name: 'Hostel Gate In/Out', role: 'warden', can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: true, can_publish: false, can_export: true },
  { id: 'p7', page_id: 'question-paper', page_name: 'Question Paper Maker', role: 'technician', can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false, can_publish: false, can_export: true }
];

// ---------------------------------------------------------------------
// In-Memory Fallback Cache with LocalStorage Persistence
// ---------------------------------------------------------------------
class LocalDataStore {
  students: Student[] = INITIAL_STUDENTS;
  faculty: Faculty[] = INITIAL_FACULTY;
  wardens: Warden[] = INITIAL_WARDENS;
  admins: AdminUser[] = INITIAL_ADMINS;
  technicians: Technician[] = INITIAL_TECHNICIANS;
  guests: GuestUser[] = INITIAL_GUESTS;
  attendance: AttendanceRecord[] = [];
  holidays: HolidayRecord[] = [
    { id: 'h-1', date: '2024-08-15', title: 'Independence Day', is_declared: true },
    { id: 'h-2', date: '2024-10-02', title: 'Gandhi Jayanti', is_declared: true }
  ];
  marks: MarkEntry[] = [];
  leaves: LeaveRequest[] = [];
  gateMovements: GateMovement[] = [];
  questions: QuestionItem[] = [];
  onlineExams: OnlineExam[] = INITIAL_ONLINE_EXAMS;
  examAttempts: OnlineExamAttempt[] = [];
  stories: StoryItem[] = INITIAL_STORIES;
  events: SchoolEvent[] = INITIAL_EVENTS;
  announcements: AnnouncementItem[] = [];
  feedback: FeedbackItem[] = [];
  expenses: ExpenseRecord[] = [];
  documents: SchoolDocument[] = [];
  periods: PeriodAllocation[] = [];
  permissions: RolePagePermission[] = INITIAL_ROLE_PERMISSIONS;
  visitors: VisitorPass[] = [];
  auditLogs: AuditLog[] = [];
  classrooms: Classroom[] = [
    { id: 'c-101', room_name: 'Hall 101', block: 'Academic Wing A', floor: 'Ground Floor', no_of_rows: 6, benches_per_row: 5, students_per_bench: 2, total_capacity: 60 },
    { id: 'c-102', room_name: 'Hall 102', block: 'Academic Wing A', floor: 'Ground Floor', no_of_rows: 6, benches_per_row: 5, students_per_bench: 2, total_capacity: 60 }
  ];
  notifications: NotificationItem[] = [
    {
      id: 'n-001',
      title: 'Quarterly Examinations Schedule 2024-25',
      message: 'The quarterly examinations for standards 10, 11, and 12 will commence on September 20. Hall tickets and seating plans are published in student desk.',
      target_role: 'all',
      priority: 'urgent',
      created_by: 'Principal Office',
      created_at: new Date().toISOString()
    }
  ];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('kkdgms_master_datastore');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.students?.length) this.students = parsed.students;
        if (parsed.faculty?.length) this.faculty = parsed.faculty;
        if (parsed.wardens?.length) this.wardens = parsed.wardens;
        if (parsed.admins?.length) this.admins = parsed.admins;
        if (parsed.technicians?.length) this.technicians = parsed.technicians;
        if (parsed.guests?.length) this.guests = parsed.guests;
        if (parsed.attendance?.length) this.attendance = parsed.attendance;
        if (parsed.holidays?.length) this.holidays = parsed.holidays;
        if (parsed.marks?.length) this.marks = parsed.marks;
        if (parsed.leaves?.length) this.leaves = parsed.leaves;
        if (parsed.gateMovements?.length) this.gateMovements = parsed.gateMovements;
        if (parsed.questions?.length) this.questions = parsed.questions;
        if (parsed.onlineExams?.length) this.onlineExams = parsed.onlineExams;
        if (parsed.examAttempts?.length) this.examAttempts = parsed.examAttempts;
        if (parsed.stories?.length) this.stories = parsed.stories;
        if (parsed.events?.length) this.events = parsed.events;
        if (parsed.announcements?.length) this.announcements = parsed.announcements;
        if (parsed.feedback?.length) this.feedback = parsed.feedback;
        if (parsed.expenses?.length) this.expenses = parsed.expenses;
        if (parsed.documents?.length) this.documents = parsed.documents;
        if (parsed.periods?.length) this.periods = parsed.periods;
        if (parsed.permissions?.length) this.permissions = parsed.permissions;
        if (parsed.visitors?.length) this.visitors = parsed.visitors;
        if (parsed.notifications?.length) this.notifications = parsed.notifications;
        if (parsed.auditLogs?.length) this.auditLogs = parsed.auditLogs;
      }
    } catch {
      // fallback to initial
    }
  }

  save() {
    try {
      localStorage.setItem('kkdgms_master_datastore', JSON.stringify(this));
    } catch {
      // ignore storage full
    }
  }
}

export const localStore = new LocalDataStore();

// ---------------------------------------------------------------------
// Health Check Helper
// ---------------------------------------------------------------------
export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  latencyMs: number;
  tables: Record<string, boolean>;
  message: string;
}> {
  const startTime = Date.now();
  const tables: Record<string, boolean> = {
    students: false,
    faculty_details: false,
    wardens: false,
    admins: false,
    technicians: false,
    student_attendance: false,
    marks_entries: false,
    student_leaves: false,
    question_bank: false,
    online_exams: false,
    notifications: false,
    visitors: false,
    events: false,
    stories: false,
    feedback: false,
    expenses: false
  };

  try {
    const { error } = await supabase.from('notifications').select('id').limit(1);
    const latencyMs = Date.now() - startTime;

    if (!error) tables.notifications = true;

    for (const tbl of Object.keys(tables)) {
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
      message: `Connected to Supabase (${availableCount}/${Object.keys(tables).length} tables active)`
    };
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Date.now() - startTime,
      tables,
      message: err?.message || 'Offline mode active'
    };
  }
}

// ---------------------------------------------------------------------
// Complete API Interface for All Modules
// ---------------------------------------------------------------------
export const api = {
  // 1. Students
  async getStudents(): Promise<Student[]> {
    try {
      const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Student[];
    } catch {}
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
    } catch {}
    localStore.students.unshift(newStudent);
    localStore.save();
    api.logAudit({ user_id: 'ADMIN', email: 'admin@kkdgms.edu.in', role: 'admin', action: `Admitted student ${newStudent.full_name} (${newStudent.user_id})`, ip_address: '127.0.0.1', user_agent: navigator.userAgent, status: 'SUCCESS' });
    return newStudent;
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<void> {
    try {
      await supabase.from('students').update(updates).eq('id', id);
    } catch {}
    const idx = localStore.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      localStore.students[idx] = { ...localStore.students[idx], ...updates };
      localStore.save();
    }
  },

  async deleteStudent(id: string): Promise<void> {
    try {
      await supabase.from('students').delete().eq('id', id);
    } catch {}
    localStore.students = localStore.students.filter(s => s.id !== id);
    localStore.save();
  },

  // 2. Faculty
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

  // 3. Wardens
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

  // 4. Technicians
  async getTechnicians(): Promise<Technician[]> {
    try {
      const { data, error } = await supabase.from('technicians').select('*');
      if (!error && data && data.length > 0) return data as Technician[];
    } catch {}
    return localStore.technicians;
  },

  async addTechnician(tech: Omit<Technician, 'id' | 'role'>): Promise<Technician> {
    const newTech: Technician = {
      ...tech,
      id: 't-' + Date.now(),
      role: 'technician',
      created_at: new Date().toISOString()
    };
    try {
      await supabase.from('technicians').insert([newTech]);
    } catch {}
    localStore.technicians.unshift(newTech);
    localStore.save();
    return newTech;
  },

  // 5. Guests
  async getGuests(): Promise<GuestUser[]> {
    return localStore.guests;
  },

  async addGuest(guest: Omit<GuestUser, 'id' | 'role'>): Promise<GuestUser> {
    const newG: GuestUser = {
      ...guest,
      id: 'g-' + Date.now(),
      role: 'guest',
      created_at: new Date().toISOString()
    };
    localStore.guests.unshift(newG);
    localStore.save();
    return newG;
  },

  // 6. Attendance & Holidays (with Holiday Auto-detection & Working Days calculation)
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

  async getHolidays(): Promise<HolidayRecord[]> {
    return localStore.holidays;
  },

  async declareHoliday(date: string, title: string, declaredBy = 'Admin'): Promise<void> {
    const h: HolidayRecord = { id: 'h-' + Date.now(), date, title, is_declared: true, declared_by: declaredBy, created_at: new Date().toISOString() };
    localStore.holidays.push(h);
    // Mark all existing students as Holiday for that date
    const students = await api.getStudents();
    const records = students.map(s => ({
      student_id: s.id,
      student_user_id: s.user_id,
      student_name: s.full_name,
      student_class: s.student_class,
      section: s.section,
      attendance_date: date,
      status: 'Holiday' as const,
      marked_by: `Auto-Holiday (${title})`
    }));
    await api.markAttendance(records);
    localStore.save();
  },

  // Calculate Student Attendance % excluding holidays and non-recorded days
  calculateStudentAttendanceStats(studentId: string) {
    const records = localStore.attendance.filter(a => a.student_id === studentId);
    const validWorkingDays = records.filter(r => r.status !== 'Holiday');
    const presentCount = validWorkingDays.filter(r => r.status === 'Present').length;
    const lateCount = validWorkingDays.filter(r => r.status === 'Late').length;
    const halfDayCount = validWorkingDays.filter(r => r.status === 'Half-Day').length;
    const absentCount = validWorkingDays.filter(r => r.status === 'Absent').length;
    const effectivePresent = presentCount + (lateCount * 0.9) + (halfDayCount * 0.5);
    const percentage = validWorkingDays.length > 0 ? ((effectivePresent / validWorkingDays.length) * 100).toFixed(1) : '100.0';

    return {
      totalRecorded: records.length,
      workingDays: validWorkingDays.length,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      halfDay: halfDayCount,
      holiday: records.filter(r => r.status === 'Holiday').length,
      percentage: Number(percentage)
    };
  },

  // 7. Marksheet
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

  async updateMarkStatus(id: string, status: 'draft' | 'published'): Promise<void> {
    const idx = localStore.marks.findIndex(m => m.id === id);
    if (idx !== -1) {
      localStore.marks[idx].status = status;
      localStore.save();
    }
  },

  // 8. Online Examinations (with Start OTP, End OTP, Timer, Autosave)
  async getOnlineExams(): Promise<OnlineExam[]> {
    try {
      const { data, error } = await supabase.from('online_exams').select('*');
      if (!error && data && data.length > 0) return data as OnlineExam[];
    } catch {}
    return localStore.onlineExams;
  },

  async createOnlineExam(exam: Omit<OnlineExam, 'id' | 'created_at'>): Promise<OnlineExam> {
    const newE: OnlineExam = {
      ...exam,
      id: 'exam-' + Date.now(),
      created_at: new Date().toISOString()
    };
    localStore.onlineExams.unshift(newE);
    localStore.save();
    return newE;
  },

  async generateStartOtp(examId: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const idx = localStore.onlineExams.findIndex(e => e.id === examId);
    if (idx !== -1) {
      localStore.onlineExams[idx].start_otp = otp;
      localStore.onlineExams[idx].start_otp_expires_at = Date.now() + 10000; // 10s validity
      localStore.onlineExams[idx].status = 'active';
      localStore.save();
    }
    return otp;
  },

  async generateEndOtp(examId: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const idx = localStore.onlineExams.findIndex(e => e.id === examId);
    if (idx !== -1) {
      localStore.onlineExams[idx].end_otp = otp;
      localStore.save();
    }
    return otp;
  },

  async submitExamAttempt(attempt: Omit<OnlineExamAttempt, 'id' | 'submitted_at'>): Promise<OnlineExamAttempt> {
    const newAtt: OnlineExamAttempt = {
      ...attempt,
      id: 'att-' + Date.now(),
      submitted_at: new Date().toISOString()
    };
    localStore.examAttempts.unshift(newAtt);
    localStore.save();
    return newAtt;
  },

  async getExamAttempts(examId?: string): Promise<OnlineExamAttempt[]> {
    if (examId) return localStore.examAttempts.filter(a => a.exam_id === examId);
    return localStore.examAttempts;
  },

  // 9. Leaves & WhatsApp Deep Link Approval
  async getLeaves(): Promise<LeaveRequest[]> {
    try {
      const { data, error } = await supabase.from('student_leaves').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as LeaveRequest[];
    } catch {}
    return localStore.leaves;
  },

  async submitLeave(leave: Omit<LeaveRequest, 'id' | 'created_at' | 'status' | 'warden_approval' | 'admin_approval' | 'faculty_approval' | 'parent_approval'>): Promise<LeaveRequest> {
    const token = 'token-' + Math.random().toString(36).substring(2, 12);
    const newLeave: LeaveRequest = {
      ...leave,
      id: 'l-' + Date.now(),
      approval_token: token,
      parent_approval: 'Pending',
      faculty_approval: 'Approved',
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

  async updateLeaveApproval(id: string, role: 'parent' | 'faculty' | 'warden' | 'admin', decision: 'Approved' | 'Rejected'): Promise<void> {
    const idx = localStore.leaves.findIndex(l => l.id === id);
    if (idx !== -1) {
      if (role === 'parent') localStore.leaves[idx].parent_approval = decision;
      if (role === 'faculty') localStore.leaves[idx].faculty_approval = decision;
      if (role === 'warden') localStore.leaves[idx].warden_approval = decision;
      if (role === 'admin') localStore.leaves[idx].admin_approval = decision;

      // Overall status
      if (decision === 'Rejected') {
        localStore.leaves[idx].status = 'Rejected';
      } else if (localStore.leaves[idx].admin_approval === 'Approved') {
        localStore.leaves[idx].status = 'Admin Approved';
      } else if (localStore.leaves[idx].warden_approval === 'Approved') {
        localStore.leaves[idx].status = 'Warden Approved';
      } else if (localStore.leaves[idx].parent_approval === 'Approved') {
        localStore.leaves[idx].status = 'Parent Approved';
      }
      localStore.save();
    }
  },

  // 10. Gate Movements (Warden)
  async getGateMovements(): Promise<GateMovement[]> {
    return localStore.gateMovements;
  },

  async recordGateOut(movement: Omit<GateMovement, 'id' | 'gate_out_time' | 'status' | 'created_at'>): Promise<GateMovement> {
    const newG: GateMovement = {
      ...movement,
      id: 'gate-' + Date.now(),
      gate_out_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Outside',
      created_at: new Date().toISOString()
    };
    localStore.gateMovements.unshift(newG);
    localStore.save();
    return newG;
  },

  async recordGateIn(movementId: string, wardenInId: string): Promise<void> {
    const idx = localStore.gateMovements.findIndex(g => g.id === movementId);
    if (idx !== -1) {
      localStore.gateMovements[idx].gate_in_time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      localStore.gateMovements[idx].warden_in_id = wardenInId;
      localStore.gateMovements[idx].status = 'Returned';
      localStore.save();
    }
  },

  // 11. Stories (24 Hour Expiry)
  async getStories(): Promise<StoryItem[]> {
    const now = Date.now();
    return localStore.stories.filter(s => new Date(s.expires_at).getTime() > now && s.is_active);
  },

  async createStory(story: Omit<StoryItem, 'id' | 'created_at' | 'expires_at' | 'is_active'>): Promise<StoryItem> {
    const newS: StoryItem = {
      ...story,
      id: 'story-' + Date.now(),
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000).toISOString(), // 24 hours
      is_active: true
    };
    localStore.stories.unshift(newS);
    localStore.save();
    return newS;
  },

  // 12. Events & Announcements
  async getEvents(): Promise<SchoolEvent[]> {
    return localStore.events;
  },

  async createEvent(event: Omit<SchoolEvent, 'id' | 'created_at'>): Promise<SchoolEvent> {
    const newE: SchoolEvent = { ...event, id: 'ev-' + Date.now(), created_at: new Date().toISOString() };
    localStore.events.unshift(newE);
    localStore.save();
    return newE;
  },

  async getAnnouncements(): Promise<AnnouncementItem[]> {
    return localStore.announcements;
  },

  async createAnnouncement(ann: Omit<AnnouncementItem, 'id' | 'created_at'>): Promise<AnnouncementItem> {
    const newA: AnnouncementItem = { ...ann, id: 'ann-' + Date.now(), created_at: new Date().toISOString() };
    localStore.announcements.unshift(newA);
    localStore.save();
    return newA;
  },

  // 13. Feedback & Replies
  async getFeedback(): Promise<FeedbackItem[]> {
    return localStore.feedback;
  },

  async submitFeedback(fb: Omit<FeedbackItem, 'id' | 'replies' | 'status' | 'created_at'>): Promise<FeedbackItem> {
    const newFb: FeedbackItem = { ...fb, id: 'fb-' + Date.now(), replies: [], status: 'Open', created_at: new Date().toISOString() };
    localStore.feedback.unshift(newFb);
    localStore.save();
    return newFb;
  },

  async replyFeedback(feedbackId: string, replyText: string, repliedBy: string): Promise<void> {
    const idx = localStore.feedback.findIndex(f => f.id === feedbackId);
    if (idx !== -1) {
      localStore.feedback[idx].replies.push({ id: 'rep-' + Date.now(), reply_text: replyText, replied_by: repliedBy, replied_at: new Date().toISOString() });
      localStore.feedback[idx].status = 'Reviewed';
      localStore.save();
    }
  },

  // 14. Expenses & Documents
  async getExpenses(): Promise<ExpenseRecord[]> {
    return localStore.expenses;
  },

  async addExpense(exp: Omit<ExpenseRecord, 'id' | 'created_at'>): Promise<ExpenseRecord> {
    const newExp: ExpenseRecord = { ...exp, id: 'exp-' + Date.now(), created_at: new Date().toISOString() };
    localStore.expenses.unshift(newExp);
    localStore.save();
    return newExp;
  },

  async getDocuments(): Promise<SchoolDocument[]> {
    return localStore.documents;
  },

  async addDocument(doc: Omit<SchoolDocument, 'id' | 'created_at'>): Promise<SchoolDocument> {
    const newDoc: SchoolDocument = { ...doc, id: 'doc-' + Date.now(), created_at: new Date().toISOString() };
    localStore.documents.unshift(newDoc);
    localStore.save();
    return newDoc;
  },

  // 15. Periods & Timetable
  async getPeriods(): Promise<PeriodAllocation[]> {
    return localStore.periods;
  },

  async savePeriod(period: Omit<PeriodAllocation, 'id' | 'created_at'>): Promise<PeriodAllocation> {
    const newP: PeriodAllocation = { ...period, id: 'per-' + Date.now(), created_at: new Date().toISOString() };
    localStore.periods.push(newP);
    localStore.save();
    return newP;
  },

  // 16. Role Permissions Matrix
  async getRolePermissions(): Promise<RolePagePermission[]> {
    return localStore.permissions;
  },

  async updateRolePermission(id: string, updates: Partial<RolePagePermission>): Promise<void> {
    const idx = localStore.permissions.findIndex(p => p.id === id);
    if (idx !== -1) {
      localStore.permissions[idx] = { ...localStore.permissions[idx], ...updates };
      localStore.save();
    }
  },

  // 17. Question Bank
  async getQuestionBank(): Promise<QuestionItem[]> {
    try {
      const { data, error } = await supabase.from('question_bank').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as QuestionItem[];
    } catch {}
    return localStore.questions;
  },

  async addQuestion(q: Omit<QuestionItem, 'id' | 'created_at' | 'status'>): Promise<QuestionItem> {
    const newQ: QuestionItem = { ...q, id: 'qb-' + Date.now(), status: 'pending', created_at: new Date().toISOString() };
    try {
      await supabase.from('question_bank').insert([newQ]);
    } catch {}
    localStore.questions.unshift(newQ);
    localStore.save();
    return newQ;
  },

  async updateQuestionStatus(id: string, status: 'approved' | 'rejected' | 'published'): Promise<void> {
    const idx = localStore.questions.findIndex(q => q.id === id);
    if (idx !== -1) {
      localStore.questions[idx].status = status;
      localStore.save();
    }
  },

  // 18. Visitors & QR Passes
  async getVisitors(): Promise<VisitorPass[]> {
    try {
      const { data, error } = await supabase.from('visitors').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as VisitorPass[];
    } catch {}
    return localStore.visitors;
  },

  async addVisitor(v: Omit<VisitorPass, 'id' | 'created_at' | 'status'>): Promise<VisitorPass> {
    const qrToken = 'vqr-' + Math.random().toString(36).substring(2, 12);
    const newV: VisitorPass = {
      ...v,
      id: 'v-' + Date.now(),
      status: 'Active',
      qr_code_token: qrToken,
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

  // 19. Notifications & Broadcasts
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as NotificationItem[];
    } catch {}
    return localStore.notifications;
  },

  async addNotification(n: Omit<NotificationItem, 'id' | 'created_at'>): Promise<NotificationItem> {
    const newN: NotificationItem = { ...n, id: 'n-' + Date.now(), created_at: new Date().toISOString() };
    try {
      await supabase.from('notifications').insert([newN]);
    } catch {}
    localStore.notifications.unshift(newN);
    localStore.save();
    return newN;
  },

  // 20. Audit Logging
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

  // 21. Bonafide Generator
  async createBonafideRequest(req: Omit<BonafideRequest, 'id'>): Promise<BonafideRequest> {
    const item: BonafideRequest = { ...req, id: 'bon-' + Date.now(), created_at: new Date().toISOString() };
    return item;
  },

  // Convenience aliases
  publishNotification: (n: any) => api.addNotification(n),
  getVisitorPasses: () => api.getVisitors(),
  createVisitorPass: (v: any) => api.addVisitor(v),
  checkOutVisitor: (id: string) => api.checkoutVisitor(id)
};

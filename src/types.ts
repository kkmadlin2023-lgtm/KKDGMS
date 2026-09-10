// =====================================================================
// KKDGMS — Master Types & Data Contracts
// =====================================================================

export type UserRole = 'admin' | 'faculty' | 'student' | 'warden' | 'technician' | 'guest';

// Theme mode
export type ThemeMode = 'system' | 'light' | 'dark';

// ---------------------------------------------------------------------
// 1. Core Users
// ---------------------------------------------------------------------
export interface Student {
  id: string;
  user_id: string; // EMIS / Roll No
  full_name: string;
  first_name?: string;
  last_name?: string;
  initial?: string;
  dob?: string;
  age?: number;
  gender: string;
  aadhaar?: string;
  email?: string;
  student_class: string; // '9', '10', '11', '12'
  section: string; // 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'
  medium: string;
  academic_year: string;
  student_group?: string; // 'Non-Group', 'Bio-Maths', 'Maths-Computer', 'Humanities', 'Accountancy'
  assigned_faculty_id?: string;
  assigned_faculty_name?: string;
  father_name: string;
  father_occupation?: string;
  mother_name: string;
  mother_occupation?: string;
  mobile: string;
  door_no?: string;
  street_name?: string;
  place?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  blood_group?: string;
  hostel_name?: string;
  hostel_type: 'Resident' | 'Day Scholar';
  warden_name?: string;
  photo_url?: string;
  income_cert_no?: string;
  community_cert_no?: string;
  role: 'student';
  created_at?: string;
}

export interface Faculty {
  id: string;
  user_id: string; // Staff ID
  full_name: string;
  first_name?: string;
  last_name?: string;
  initial?: string;
  email: string;
  dob?: string;
  age?: number;
  gender: string;
  aadhaar?: string;
  department: string;
  designation?: string;
  qualification: string;
  experience?: string;
  mobile: string;
  door_no?: string;
  street_name?: string;
  place?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  blood_group?: string;
  photo_url?: string;
  assigned_class?: string;
  assigned_section?: string;
  role: 'faculty';
  created_at?: string;
}

export interface Warden {
  id: string;
  user_id: string; // Warden ID
  full_name: string;
  first_name?: string;
  last_name?: string;
  initial?: string;
  email: string;
  dob?: string;
  age?: number;
  gender: string;
  aadhaar?: string;
  mobile: string;
  hostel_name: string;
  hostel_gender?: 'Boys' | 'Girls';
  qualification?: string;
  experience?: string;
  door_no?: string;
  street_name?: string;
  place?: string;
  district?: string;
  photo_url?: string;
  role: 'warden';
  created_at?: string;
}

export interface AdminUser {
  id: string;
  user_id: string; // Admin ID
  full_name: string;
  first_name?: string;
  last_name?: string;
  initial?: string;
  email: string;
  dob?: string;
  age?: number;
  gender?: string;
  aadhaar?: string;
  department: string;
  mobile: string;
  qualification?: string;
  experience?: string;
  photo_url?: string;
  role: 'admin';
  created_at?: string;
}

export interface Technician {
  id: string;
  user_id: string; // Tech ID
  full_name: string;
  first_name?: string;
  last_name?: string;
  initial?: string;
  email: string;
  dob?: string;
  age?: number;
  gender: string;
  aadhaar?: string;
  department: string;
  qualification?: string;
  experience?: string;
  mobile: string;
  photo_url?: string;
  role: 'technician';
  created_at?: string;
}

export interface GuestUser {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  organization?: string;
  purpose?: string;
  role: 'guest';
  created_at?: string;
}

// ---------------------------------------------------------------------
// 2. Attendance & Holidays
// ---------------------------------------------------------------------
export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_user_id: string;
  student_name: string;
  student_class: string;
  section: string;
  attendance_date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day' | 'Holiday';
  marked_by: string;
  remarks?: string;
  created_at?: string;
}

export interface HolidayRecord {
  id: string;
  date: string;
  title: string;
  is_declared: boolean;
  declared_by?: string;
  created_at?: string;
}

// ---------------------------------------------------------------------
// 3. Marksheet & Written Exams
// ---------------------------------------------------------------------
export interface MarkEntry {
  id: string;
  student_id: string;
  student_user_id: string;
  student_name: string;
  student_class: string;
  section: string;
  exam_name: string; // 'Unit Test 1' | 'Quarterly' | 'Half-Yearly' | 'Model Exam' | 'Annual'
  subject: string;
  marks_obtained: number;
  max_marks: number;
  grade: string;
  status?: 'draft' | 'published';
  faculty_id?: string;
  remarks?: string;
  created_at?: string;
}

// ---------------------------------------------------------------------
// 4. Online Examinations
// ---------------------------------------------------------------------
export interface ExamChoice {
  id: string;
  text: string;
}

export interface OnlineExamQuestion {
  id: string;
  question_text: string;
  choices: ExamChoice[];
  correct_answer_id: string;
  marks: number;
  negative_marks: number;
  explanation?: string;
}

export interface OnlineExam {
  id: string;
  exam_name: string;
  subject: string;
  student_class: string;
  section: string;
  total_marks: number;
  pass_marks: number;
  duration_minutes: number;
  exam_password?: string;
  start_otp?: string;
  start_otp_expires_at?: number; // timestamp in ms (10s expiry)
  end_otp?: string;
  status: 'draft' | 'published' | 'active' | 'completed' | 'archived';
  questions: OnlineExamQuestion[];
  assigned_faculty_id: string;
  assigned_faculty_name: string;
  created_at?: string;
}

export interface ExamAnswerDraft {
  question_id: string;
  selected_choice_id: string;
  saved_at: number;
}

export interface OnlineExamAttempt {
  id: string;
  exam_id: string;
  student_id: string;
  student_name: string;
  student_user_id: string;
  student_class: string;
  section: string;
  start_time: string;
  end_time?: string;
  answers: Record<string, string>; // question_id -> choice_id
  score: number;
  total_marks: number;
  percentage: number;
  is_passed: boolean;
  status: 'in-progress' | 'submitted' | 'timed-out';
  student_feedback?: string;
  faculty_remarks?: string;
  submitted_at?: string;
}

// ---------------------------------------------------------------------
// 5. Leaves & Gate Movement
// ---------------------------------------------------------------------
export interface LeaveRequest {
  id: string;
  applicant_type: 'student' | 'faculty' | 'warden' | 'technician';
  applicant_id: string;
  applicant_name: string;
  student_class?: string;
  section?: string;
  leave_type: 'Medical' | 'Personal' | 'Emergency' | 'Festival' | 'Hostel Outpass';
  from_date: string;
  to_date: string;
  from_time?: string;
  to_time?: string;
  reason: string;
  parent_phone?: string;
  approval_token?: string;
  parent_approval: 'Pending' | 'Approved' | 'Rejected';
  faculty_approval: 'Pending' | 'Approved' | 'Rejected';
  warden_approval: 'Pending' | 'Approved' | 'Rejected';
  admin_approval: 'Pending' | 'Approved' | 'Rejected';
  status: 'Pending' | 'Parent Approved' | 'Faculty Approved' | 'Warden Approved' | 'Admin Approved' | 'Rejected' | 'Completed';
  created_at?: string;
}

export interface GateMovement {
  id: string;
  student_id: string;
  student_name: string;
  student_user_id: string;
  student_class: string;
  section: string;
  hostel_name: string;
  leave_id?: string;
  gate_out_time: string;
  gate_in_time?: string;
  warden_out_id: string;
  warden_in_id?: string;
  reason: string;
  status: 'Outside' | 'Returned' | 'Late Return';
  created_at?: string;
}

// ---------------------------------------------------------------------
// 6. Question Bank
// ---------------------------------------------------------------------
export interface QuestionItem {
  id: string;
  title: string;
  subject: string;
  student_class: string;
  unit_chapter?: string;
  question_type: 'MCQ' | 'Short Answer' | 'Long Answer';
  question_text: string;
  answer_text?: string;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  file_url?: string;
  doc_link?: string;
  status: 'draft' | 'published' | 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  created_at?: string;
  updated_at?: string;
}

// ---------------------------------------------------------------------
// 7. Bonafide, Visitors & Periods
// ---------------------------------------------------------------------
export interface BonafideRequest {
  id: string;
  student_id: string;
  student_user_id: string;
  student_name: string;
  student_class: string;
  section: string;
  father_name: string;
  academic_year: string;
  purpose: string;
  certificate_no: string;
  issued_by: string;
  issue_date: string;
  status: 'Pending' | 'Issued' | 'Rejected';
  custom_body?: string;
  created_at?: string;
}

export interface VisitorPass {
  id: string;
  visitor_name: string;
  contact_number: string;
  whom_to_meet: string;
  pass_number: string;
  relation?: string;
  student_id?: string;
  student_name?: string;
  student_class?: string;
  purpose: string;
  id_proof_type?: string;
  id_proof_no?: string;
  vehicle_no?: string;
  in_time: string;
  out_time?: string;
  status: 'Active' | 'Checked Out' | 'Checked-In';
  qr_code_token?: string;
  approved_by: string;
  created_at?: string;
}

export interface PeriodAllocation {
  id: string;
  student_class: string;
  section: string;
  period_no: number;
  subject: string;
  faculty_id: string;
  faculty_name: string;
  room: string;
  time_slot: string;
  academic_year: string;
  created_at?: string;
}

// ---------------------------------------------------------------------
// 8. Public Content: Stories, Announcements, Events, Gallery
// ---------------------------------------------------------------------
export interface StoryItem {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption: string;
  duration_seconds: 15 | 30;
  created_by_role: 'admin' | 'faculty' | 'technician';
  created_by_name: string;
  created_at: string;
  expires_at: string; // 24 hours after creation
  is_active: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  start_date: string;
  expiry_date: string;
  is_active: boolean;
  priority: 'normal' | 'urgent';
  created_by: string;
  created_at: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  expiry_date: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'archived';
  created_by: string;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  category?: string;
  created_at: string;
}

// ---------------------------------------------------------------------
// 9. Feedback & Communication
// ---------------------------------------------------------------------
export interface FeedbackReply {
  id: string;
  reply_text: string;
  replied_by: string;
  replied_at: string;
}

export interface FeedbackItem {
  id: string;
  user_id: string;
  user_name: string;
  role: UserRole;
  category: string;
  message: string;
  rating: number; // 1 to 5
  status: 'Open' | 'Reviewed' | 'Resolved';
  replies: FeedbackReply[];
  created_at: string;
}

// ---------------------------------------------------------------------
// 10. Expenses & Documents
// ---------------------------------------------------------------------
export interface ExpenseRecord {
  id: string;
  expense_name: string;
  category: 'Infrastructure' | 'Lab & Equipment' | 'Hostel & Food' | 'Events' | 'Utilities' | 'Stationery' | 'Other';
  amount: number;
  expense_date: string;
  description: string;
  added_by: string;
  status: 'Paid' | 'Pending' | 'Approved';
  receipt_url?: string;
  created_at?: string;
}

export interface SchoolDocument {
  id: string;
  title: string;
  description: string;
  category: 'Government Orders' | 'Syllabus' | 'Forms' | 'Hostel Guidelines' | 'Exam Rules' | 'General';
  file_url: string;
  file_name: string;
  file_size?: string;
  uploaded_by: string;
  visibility: 'all' | 'faculty' | 'admin' | 'student';
  created_at: string;
}

// ---------------------------------------------------------------------
// 11. Security, Sessions, Audit & Permissions
// ---------------------------------------------------------------------
export interface AuditLog {
  id: string;
  user_id: string;
  email: string;
  role: string;
  action: string;
  table_affected?: string;
  record_id?: string;
  old_value?: any;
  new_value?: any;
  ip_address: string;
  user_agent: string;
  status: 'SUCCESS' | 'FAILED';
  logged_at: string;
}

export interface ActiveUserSession {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  department?: string;
  student_class?: string;
  section?: string;
  photo_url?: string;
  last_activity?: string;
  device_info?: string;
  ip_address?: string;
}

export interface RolePagePermission {
  id: string;
  page_id: string;
  page_name: string;
  role: UserRole;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_approve: boolean;
  can_publish: boolean;
  can_export: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  target_role: 'all' | 'student' | 'faculty' | 'warden' | 'admin' | 'technician' | 'guest';
  target_class?: string;
  target_section?: string;
  priority: 'normal' | 'urgent' | 'academic';
  is_read?: boolean;
  created_by?: string;
  created_at: string;
}

export interface Classroom {
  id: string;
  room_name: string;
  block: string;
  floor: string;
  no_of_rows: number;
  benches_per_row: number;
  students_per_bench: number;
  total_capacity: number;
  created_at?: string;
}

export interface ExamAllocation {
  id: string;
  exam_name: string;
  classroom_id: string;
  classroom_name?: string;
  student_class: string;
  session_date: string;
  slot: string;
  allocated_students: Array<{
    bench_no: number;
    seat_pos: 'Left' | 'Right';
    student_id: string;
    student_name: string;
    student_class: string;
    section: string;
  }>;
  created_at?: string;
}

export interface FacultyAssignment {
  id: string;
  faculty_id: string;
  faculty_name: string;
  subject: string;
  student_class: string;
  section: string;
  academic_year: string;
  periods_per_week: number;
  created_at?: string;
}

export interface ExamSeat {
  id: string;
  exam_name: string;
  hall_name: string;
  bench_no: string;
  seat_position: 'Left' | 'Right';
  student_id: string;
  student_user_id: string;
  student_name: string;
  student_class: string;
  section: string;
  created_at?: string;
}

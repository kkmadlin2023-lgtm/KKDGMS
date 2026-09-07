export type UserRole = 'admin' | 'faculty' | 'student' | 'warden';

export interface Student {
  id: string;
  user_id: string; // EMIS / Roll No
  full_name: string;
  dob?: string;
  age?: number;
  gender: string;
  aadhaar?: string;
  email?: string;
  student_class: string; // '6', '7', '8', '9', '10', '11', '12'
  section: string; // 'A', 'B', 'C'
  medium: string;
  prev_school?: string;
  academic_year: string;
  student_group?: string;
  father_name: string;
  father_occupation?: string;
  mother_name: string;
  mother_occupation?: string;
  mobile: string;
  door_no?: string;
  street_name?: string;
  place?: string;
  district?: string;
  state?: string;
  pincode?: string;
  blood_group?: string;
  id_mark_1?: string;
  id_mark_2?: string;
  medical_issues?: string;
  hostel_name?: string;
  hostel_type: 'Resident' | 'Day Scholar';
  photo_url?: string;
  role: 'student';
  created_at?: string;
}

export interface Faculty {
  id: string;
  user_id: string; // Staff ID
  full_name: string;
  email: string;
  dob?: string;
  age?: number;
  gender: string;
  aadhaar?: string;
  department: string;
  qualification: string;
  mobile: string;
  door_no?: string;
  street_name?: string;
  place?: string;
  district?: string;
  state?: string;
  pincode?: string;
  blood_group?: string;
  photo_url?: string;
  hostel_name?: string;
  role: 'faculty';
  created_at?: string;
}

export interface Warden {
  id: string;
  user_id: string; // Warden ID
  full_name: string;
  email: string;
  dob?: string;
  gender: string;
  mobile: string;
  hostel_name: string;
  qualification?: string;
  door_no?: string;
  street_name?: string;
  place?: string;
  district?: string;
  blood_group?: string;
  photo_url?: string;
  role: 'warden';
  created_at?: string;
}

export interface AdminUser {
  id: string;
  user_id: string; // Admin ID
  full_name: string;
  email: string;
  department: string;
  mobile: string;
  qualification?: string;
  photo_url?: string;
  role: 'admin';
  created_at?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_user_id: string;
  student_name: string;
  student_class: string;
  section: string;
  attendance_date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day';
  marked_by: string;
  remarks?: string;
  created_at?: string;
}

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
  faculty_id?: string;
  remarks?: string;
  created_at?: string;
}

export interface LeaveRequest {
  id: string;
  applicant_type: 'student' | 'faculty';
  applicant_id: string;
  applicant_name: string;
  student_class?: string;
  section?: string;
  leave_type: 'Medical' | 'Personal' | 'Emergency' | 'Festival' | 'Hostel Outpass';
  from_date: string;
  to_date: string;
  reason: string;
  parent_phone?: string;
  warden_approval: 'Pending' | 'Approved' | 'Rejected';
  admin_approval: 'Pending' | 'Approved' | 'Rejected';
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at?: string;
}

export interface QuestionItem {
  id: string;
  title: string;
  subject: string;
  student_class: string;
  unit_chapter?: string;
  question_type: 'MCQ' | 'Short Answer' | 'Long Answer';
  question_text: string;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  file_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  created_at?: string;
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

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  target_role: 'all' | 'student' | 'faculty' | 'warden' | 'admin';
  priority: 'normal' | 'urgent' | 'academic';
  expiry_date?: string;
  created_by?: string;
  created_at: string;
}

export interface VisitorPass {
  id: string;
  visitor_name: string;
  phone?: string;
  contact_number?: string;
  whom_to_meet?: string;
  pass_number?: string;
  relation?: string;
  student_id?: string;
  student_name?: string;
  student_class?: string;
  purpose: string;
  id_proof_type?: string;
  id_proof_no?: string;
  vehicle_no?: string;
  check_in?: string;
  check_out?: string;
  in_time?: string;
  out_time?: string;
  status: 'Checked-In' | 'Checked-Out' | 'Active' | 'Checked Out';
  gate_no?: string;
  approved_by?: string;
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

export interface BonafideRequest {
  id: string;
  student_id: string;
  student_user_id: string;
  student_name: string;
  student_class: string;
  section: string;
  purpose: string;
  status: 'Pending' | 'Issued' | 'Rejected';
  certificate_no?: string;
  issue_date?: string;
  created_at?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  email: string;
  role: string;
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
}

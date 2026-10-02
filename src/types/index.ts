import { User, Session } from '@supabase/supabase-js';

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'FACULTY'
  | 'STUDENT'
  | 'WARDEN'
  | 'TECHNICIAN'
  | 'GUEST';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface UserProfile {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  suspension_reason?: string | null;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RoleDefinition {
  code: UserRole;
  name: string;
  description?: string;
  hierarchy_level: number;
  is_active: boolean;
}

export interface Permission {
  code: string;
  name: string;
  module: string;
  description?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  iconName: string;
  path: string;
  allowedRoles: UserRole[];
  badge?: string;
  section?: string;
}

export interface UserFilterParams {
  search?: string;
  role?: UserRole | 'ALL';
  status?: UserStatus | 'ALL';
  sortBy?: 'full_name' | 'email' | 'created_at' | 'last_login_at' | 'role' | 'status';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id?: string | null;
  details?: Record<string, unknown>;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

// ==========================================
// Phase 3: Academic, Student & Faculty Types
// ==========================================

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  numeric_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface SchoolSection {
  id: string;
  name: string;
  is_active: boolean;
  created_at?: string;
}

export interface ClassSection {
  id: string;
  class_id: string;
  section_id: string;
  is_active: boolean;
  class?: SchoolClass;
  section?: SchoolSection;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface ClassSubject {
  id: string;
  class_id: string;
  subject_id: string;
  academic_year_id?: string | null;
  is_active: boolean;
  subject?: Subject;
  class?: SchoolClass;
}

export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED';
export type EnrollmentStatus = 'ACTIVE' | 'PROMOTED' | 'COMPLETED' | 'WITHDRAWN';

export interface Student {
  id: string;
  user_id?: string | null;
  admission_number: string;
  full_name: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  aadhaar?: string | null;
  photo_url?: string | null;
  email?: string | null;
  mobile?: string | null;
  father_name?: string | null;
  mother_name?: string | null;
  parent_mobile?: string | null;
  door_no?: string | null;
  street_name?: string | null;
  place?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  status: StudentStatus;
  current_enrollment?: StudentEnrollment;
  created_at?: string;
  updated_at?: string;
}

export interface StudentEnrollment {
  id: string;
  student_id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  roll_number?: string | null;
  status: EnrollmentStatus;
  academic_year?: AcademicYear;
  class?: SchoolClass;
  section?: SchoolSection;
  created_at?: string;
  updated_at?: string;
}

export type FacultyStatus = 'ACTIVE' | 'INACTIVE';

export interface FacultyMember {
  id: string;
  user_id?: string | null;
  employee_id: string;
  full_name: string;
  email: string;
  mobile?: string | null;
  department: string;
  qualification?: string | null;
  designation?: string | null;
  dob?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  photo_url?: string | null;
  status: FacultyStatus;
  created_at?: string;
  updated_at?: string;
}

// ==========================================
// Phase 4: Faculty Allocation & Timetable Types
// ==========================================

export type FacultyAssignmentStatus = 'ACTIVE' | 'INACTIVE';

export interface FacultyAssignment {
  id: string;
  academic_year_id: string;
  faculty_id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  is_class_teacher: boolean;
  status: FacultyAssignmentStatus;
  academic_year?: AcademicYear;
  faculty?: FacultyMember;
  class?: SchoolClass;
  section?: SchoolSection;
  subject?: Subject;
  created_at?: string;
  updated_at?: string;
}

export interface TimetablePeriod {
  id: string;
  period_number: number;
  name: string;
  start_time: string;
  end_time: string;
  is_break: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
export type TimetableStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface TimetableEntry {
  id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  faculty_id: string;
  faculty_assignment_id?: string | null;
  day_of_week: DayOfWeek;
  period_number: number;
  room?: string | null;
  status: TimetableStatus;
  academic_year?: AcademicYear;
  class?: SchoolClass;
  section?: SchoolSection;
  subject?: Subject;
  faculty?: FacultyMember;
  created_at?: string;
  updated_at?: string;
}

export interface TimetableConflict {
  conflict_type: 'CLASS_CONFLICT' | 'FACULTY_CONFLICT' | 'ROOM_CONFLICT';
  conflict_message: string;
  conflicting_entry_id?: string;
}

export interface FacultyWorkload {
  faculty: FacultyMember;
  totalAssignments: number;
  totalPeriodsPerWeek: number;
  subjectsTaught: string[];
  classesTaught: string[];
  isClassTeacherOf?: string | null;
}


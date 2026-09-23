-- ============================================================================
-- KKDGMS — Master PostgreSQL Database Schema
-- KANYAKUMARI DIST GOVERNMENT MODEL SCHOOL
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean drop for idempotency (if rebuilding)
-- Note: Cascading drops will wipe older tables and recreated with complete constraints.

-- 1. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'FACULTY', 'STUDENT', 'WARDEN', 'TECHNICIAN', 'GUEST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LEAVE', 'HOLIDAY', 'LATE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gate_status AS ENUM ('OUT', 'IN', 'OVERDUE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. ACADEMIC YEARS
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year_name VARCHAR(20) UNIQUE NOT NULL, -- e.g. '2024-2025'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES (Master User Identity Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'ADM001', 'EMIS202401'
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'GUEST',
    full_name VARCHAR(150) NOT NULL,
    first_name VARCHAR(75),
    last_name VARCHAR(75),
    initial VARCHAR(10),
    dob DATE,
    age INT,
    gender gender_type,
    aadhaar_number VARCHAR(12),
    mobile VARCHAR(15),
    photo_url TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    last_activity TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROLE PERMISSIONS MATRIX
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL,
    page_id VARCHAR(100) NOT NULL, -- e.g. 'attendance.edit', 'marksheet.view'
    can_view BOOLEAN DEFAULT false,
    can_create BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    can_approve BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role, page_id)
);

-- 5. STUDENTS
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    emis_number VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(75) NOT NULL,
    last_name VARCHAR(75) NOT NULL,
    initial VARCHAR(10),
    full_name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    age INT,
    gender gender_type NOT NULL,
    aadhaar_number VARCHAR(12),
    email VARCHAR(255),
    mobile VARCHAR(15),
    student_class INT NOT NULL CHECK (student_class BETWEEN 9 AND 12),
    section VARCHAR(5) NOT NULL CHECK (section IN ('A','B','C','D','E','F','G','H')),
    student_group VARCHAR(50) DEFAULT 'NO GROUP',
    academic_year VARCHAR(20) NOT NULL DEFAULT '2024-2025',
    assigned_faculty_id UUID,
    father_name VARCHAR(100),
    mother_name VARCHAR(100),
    parent_mobile VARCHAR(15) NOT NULL,
    door_no VARCHAR(50),
    street VARCHAR(100),
    place VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Kanyakumari',
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10),
    hostel_name VARCHAR(100),
    warden_id UUID,
    photo_url TEXT,
    certificate_number VARCHAR(50),
    annual_income NUMERIC(12,2),
    community VARCHAR(50),
    medium VARCHAR(20) DEFAULT 'English',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FACULTY
CREATE TABLE IF NOT EXISTS faculty_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(75) NOT NULL,
    last_name VARCHAR(75) NOT NULL,
    initial VARCHAR(10),
    full_name VARCHAR(150) NOT NULL,
    dob DATE,
    age INT,
    gender gender_type,
    aadhaar_number VARCHAR(12),
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    degree VARCHAR(100),
    qualification VARCHAR(100),
    experience_years INT DEFAULT 0,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) DEFAULT 'Teacher',
    address TEXT,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. WARDENS
CREATE TABLE IF NOT EXISTS wardens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(75) NOT NULL,
    last_name VARCHAR(75) NOT NULL,
    initial VARCHAR(10),
    full_name VARCHAR(150) NOT NULL,
    dob DATE,
    age INT,
    gender gender_type NOT NULL,
    aadhaar_number VARCHAR(12),
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    qualification VARCHAR(100),
    degree VARCHAR(100),
    experience_years INT DEFAULT 0,
    assigned_hostel VARCHAR(100) NOT NULL,
    address TEXT,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TECHNICIANS
CREATE TABLE IF NOT EXISTS technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(75) NOT NULL,
    last_name VARCHAR(75) NOT NULL,
    initial VARCHAR(10),
    full_name VARCHAR(150) NOT NULL,
    dob DATE,
    age INT,
    gender gender_type,
    aadhaar_number VARCHAR(12),
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    degree VARCHAR(100),
    qualification VARCHAR(100),
    experience_years INT DEFAULT 0,
    department VARCHAR(100) DEFAULT 'Technical & IT Support',
    address TEXT,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ADMINS
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(75) NOT NULL,
    last_name VARCHAR(75) NOT NULL,
    initial VARCHAR(10),
    full_name VARCHAR(150) NOT NULL,
    dob DATE,
    age INT,
    gender gender_type,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    designation VARCHAR(100) DEFAULT 'Headmaster / Admin',
    address TEXT,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. GUESTS
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    mobile VARCHAR(15),
    purpose TEXT,
    expiry_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FACULTY ALLOCATIONS
CREATE TABLE IF NOT EXISTS faculty_assign (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES faculty_details(id) ON DELETE CASCADE,
    student_class INT NOT NULL CHECK (student_class BETWEEN 9 AND 12),
    section VARCHAR(5) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    group_name VARCHAR(50) DEFAULT 'NO GROUP',
    academic_year VARCHAR(20) NOT NULL DEFAULT '2024-2025',
    periods_per_week INT DEFAULT 5,
    is_class_teacher BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(faculty_id, student_class, section, subject, academic_year)
);

-- 12. HOLIDAYS & CALENDAR
CREATE TABLE IF NOT EXISTS holidays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    holiday_date DATE UNIQUE NOT NULL,
    holiday_name VARCHAR(150) NOT NULL,
    description TEXT,
    academic_year VARCHAR(20) NOT NULL DEFAULT '2024-2025',
    is_working_day BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. STUDENT ATTENDANCE
CREATE TABLE IF NOT EXISTS student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'PRESENT',
    student_class INT NOT NULL,
    section VARCHAR(5) NOT NULL,
    academic_year VARCHAR(20) NOT NULL DEFAULT '2024-2025',
    marked_by UUID REFERENCES faculty_details(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, attendance_date)
);

-- 14. STUDENT LEAVES & OUTPASS
CREATE TABLE IF NOT EXISTS student_leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty_details(id) ON DELETE SET NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    leave_time TIME,
    reason TEXT NOT NULL,
    remarks TEXT,
    status leave_status DEFAULT 'PENDING',
    parent_approval BOOLEAN DEFAULT false,
    parent_approved_at TIMESTAMPTZ,
    parent_approval_token VARCHAR(100) UNIQUE,
    parent_token_expires_at TIMESTAMPTZ,
    faculty_approval BOOLEAN DEFAULT false,
    warden_approval BOOLEAN DEFAULT false,
    admin_approval BOOLEAN DEFAULT false,
    approved_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. GATE MOVEMENTS (HOSTEL OUT/IN)
CREATE TABLE IF NOT EXISTS gate_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    leave_id UUID REFERENCES student_leaves(id) ON DELETE SET NULL,
    gate_out_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    gate_out_warden UUID REFERENCES wardens(id) ON DELETE SET NULL,
    expected_return_time TIMESTAMPTZ,
    gate_in_time TIMESTAMPTZ,
    gate_in_warden UUID REFERENCES wardens(id) ON DELETE SET NULL,
    status gate_status DEFAULT 'OUT',
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. QUESTION BANK
CREATE TABLE IF NOT EXISTS question_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID REFERENCES faculty_details(id) ON DELETE SET NULL,
    student_class INT NOT NULL CHECK (student_class BETWEEN 9 AND 12),
    subject VARCHAR(100) NOT NULL,
    unit_chapter VARCHAR(150),
    topic VARCHAR(150),
    question TEXT NOT NULL,
    answer_key TEXT,
    marks INT DEFAULT 1,
    difficulty VARCHAR(20) DEFAULT 'MEDIUM', -- 'EASY', 'MEDIUM', 'HARD'
    pdf_attachment_url TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. WRITTEN EXAM MARKS
CREATE TABLE IF NOT EXISTS marks_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    exam_name VARCHAR(100) NOT NULL, -- e.g. 'Quarterly', 'Half-Yearly', 'Annual'
    academic_year VARCHAR(20) NOT NULL DEFAULT '2024-2025',
    student_class INT NOT NULL,
    section VARCHAR(5) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    marks_obtained NUMERIC(5,2) NOT NULL,
    max_marks NUMERIC(5,2) NOT NULL DEFAULT 100,
    pass_marks NUMERIC(5,2) NOT NULL DEFAULT 35,
    grade VARCHAR(5),
    is_pass BOOLEAN GENERATED ALWAYS AS (marks_obtained >= pass_marks) STORED,
    is_published BOOLEAN DEFAULT false,
    entered_by UUID REFERENCES faculty_details(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, exam_name, subject, academic_year)
);

-- 18. ONLINE EXAMS
CREATE TABLE IF NOT EXISTS online_exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID REFERENCES faculty_details(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    student_class INT NOT NULL,
    section VARCHAR(5),
    subject VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,
    total_marks INT NOT NULL DEFAULT 25,
    pass_marks INT NOT NULL DEFAULT 10,
    negative_marks NUMERIC(3,2) DEFAULT 0.00,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    start_otp VARCHAR(10),
    otp_generated_at TIMESTAMPTZ,
    otp_valid_seconds INT DEFAULT 10,
    instructions TEXT,
    is_published BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. ONLINE EXAM QUESTIONS
CREATE TABLE IF NOT EXISTS exam_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES online_exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    marks INT DEFAULT 1,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(1) NOT NULL CHECK (correct_option IN ('A','B','C','D')),
    explanation TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. ONLINE EXAM ATTEMPTS
CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES online_exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    total_score NUMERIC(6,2) DEFAULT 0.00,
    percentage NUMERIC(5,2) DEFAULT 0.00,
    is_passed BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS', -- 'IN_PROGRESS', 'SUBMITTED', 'EXPIRED'
    feedback TEXT,
    student_remarks TEXT,
    faculty_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

-- 21. ONLINE EXAM ANSWERS (Immediate Auto-save)
CREATE TABLE IF NOT EXISTS exam_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES exam_questions(id) ON DELETE CASCADE,
    selected_option VARCHAR(1) CHECK (selected_option IN ('A','B','C','D')),
    is_correct BOOLEAN,
    score_awarded NUMERIC(4,2) DEFAULT 0.00,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(attempt_id, question_id)
);

-- 22. VISITORS & PASSES
CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_name VARCHAR(150) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    address TEXT,
    purpose TEXT NOT NULL,
    person_to_meet VARCHAR(150) NOT NULL,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    entry_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    exit_time TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'COMPLETED'
    qr_code_token VARCHAR(100) UNIQUE,
    id_card_url TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. ANNOUNCEMENTS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    target_role user_role, -- NULL means all roles
    target_class INT,
    target_section VARCHAR(5),
    target_user_id UUID,
    priority priority_level DEFAULT 'LOW',
    publish_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMPTZ,
    attachment_url TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- 'UPCOMING', 'ACTIVE', 'EXPIRED'
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. RECIPIENT NOTIFICATION READ RECEIPTS
CREATE TABLE IF NOT EXISTS notification_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(notification_id, user_id)
);

-- 25. DEVICE FCM TOKENS
CREATE TABLE IF NOT EXISTS device_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    fcm_token TEXT UNIQUE NOT NULL,
    device_info TEXT,
    browser VARCHAR(100),
    platform VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. EVENTS
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    venue VARCHAR(200),
    image_url TEXT,
    registration_link TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. STORIES (24-Hour Expiry)
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    creator_name VARCHAR(150),
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    media_type VARCHAR(20) DEFAULT 'IMAGE', -- 'IMAGE', 'VIDEO', 'TEXT'
    caption TEXT,
    duration_seconds INT DEFAULT 15 CHECK (duration_seconds IN (15, 20, 30)),
    view_count INT DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. FEEDBACK & REPLIES
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_role user_role NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'ACADEMIC', 'FACILITY', 'HOSTEL', 'GENERAL'
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN', -- 'OPEN', 'RESOLVED', 'CLOSED'
    reply TEXT,
    replied_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 29. TIMETABLES & PERIODS
CREATE TABLE IF NOT EXISTS timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_of_week VARCHAR(15) NOT NULL CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')),
    period_number INT NOT NULL CHECK (period_number BETWEEN 1 AND 8),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    student_class INT NOT NULL CHECK (student_class BETWEEN 9 AND 12),
    section VARCHAR(5) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    faculty_id UUID REFERENCES faculty_details(id) ON DELETE SET NULL,
    room_number VARCHAR(50),
    academic_year VARCHAR(20) NOT NULL DEFAULT '2024-2025',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(day_of_week, period_number, student_class, section, academic_year)
);

-- 30. SCHOOL DOCUMENTS
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'CIRCULAR', 'SYLLABUS', 'POLICY', 'REPORT'
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    file_type VARCHAR(50),
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    target_role user_role,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 31. EXPENSES CALCULATION
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL, -- 'LAB_SUPPLIES', 'MAINTENANCE', 'HOSTEL_FOOD', 'EVENTS', 'MISC'
    amount NUMERIC(12,2) NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    paid_by VARCHAR(150),
    receipt_url TEXT,
    status VARCHAR(20) DEFAULT 'PAID', -- 'PENDING', 'PAID', 'CANCELLED'
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 32. AUDIT LOGS (Master Traceability)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    role VARCHAR(50),
    action VARCHAR(100) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'LOGIN', 'LOCKOUT'
    entity VARCHAR(100) NOT NULL, -- 'STUDENT', 'ATTENDANCE', 'MARKS', 'LEAVE', 'AUTH'
    entity_id VARCHAR(100),
    before_value JSONB,
    after_value JSONB,
    user_agent TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 33. USER SESSIONS & LOGIN LOGS
CREATE TABLE IF NOT EXISTS login_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50),
    email VARCHAR(255),
    role VARCHAR(50),
    status VARCHAR(20) NOT NULL, -- 'SUCCESS', 'FAILED', 'LOCKED_OUT', 'LOGOUT'
    device_info TEXT,
    browser VARCHAR(100),
    platform VARCHAR(100),
    ip_address VARCHAR(50),
    attempt_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 34. CLASSROOM BENCH SEATING
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(50) UNIQUE NOT NULL,
    rows_count INT NOT NULL DEFAULT 5,
    benches_per_row INT NOT NULL DEFAULT 4,
    students_per_bench INT NOT NULL DEFAULT 2,
    total_capacity INT GENERATED ALWAYS AS (rows_count * benches_per_row * students_per_bench) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 35. EXAM SEATING ALLOCATIONS
CREATE TABLE IF NOT EXISTS exam_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name VARCHAR(100) NOT NULL,
    classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    bench_number INT NOT NULL,
    seat_position INT NOT NULL, -- 1 or 2
    exam_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(classroom_id, bench_number, seat_position, exam_date)
);

-- 36. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_students_class_sec ON students(student_class, section);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_emis ON students(emis_number);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON student_attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON student_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_marks_student ON marks_entries(student_id);
CREATE INDEX IF NOT EXISTS idx_marks_class_sec ON marks_entries(student_class, section);
CREATE INDEX IF NOT EXISTS idx_leaves_student ON student_leaves(student_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON student_leaves(status);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_dates ON notifications(publish_date, expiry_date);
CREATE INDEX IF NOT EXISTS idx_stories_expires ON stories(expires_at DESC);

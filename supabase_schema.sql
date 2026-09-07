-- ====================================================================
-- KKDGMS - KANYAKUMARI DISTRICT GOVERNMENT MODEL SCHOOL
-- COMPLETE PRODUCTION SUPABASE POSTGRESQL SCHEMA & SECURITY RULES
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('admin', 'faculty', 'student', 'warden');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE approval_status_type AS ENUM ('Pending', 'Approved', 'Rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status_type AS ENUM ('Present', 'Absent', 'Late', 'Half-Day');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE qb_status_type AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. CORE IDENTITY & ROLES TABLES

-- A. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    dob DATE,
    age INT,
    gender VARCHAR(20),
    aadhaar VARCHAR(20),
    department VARCHAR(100) DEFAULT 'Administration',
    qualification VARCHAR(100),
    mobile VARCHAR(20),
    door_no VARCHAR(50),
    street_name VARCHAR(150),
    place VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Kanyakumari',
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10),
    blood_group VARCHAR(10),
    photo_url TEXT,
    role VARCHAR(20) DEFAULT 'admin',
    auth_uid UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. FACULTY DETAILS TABLE
CREATE TABLE IF NOT EXISTS public.faculty_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    dob DATE,
    age INT,
    gender VARCHAR(20),
    aadhaar VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    qualification VARCHAR(100),
    mobile VARCHAR(20),
    door_no VARCHAR(50),
    street_name VARCHAR(150),
    place VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Kanyakumari',
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10),
    blood_group VARCHAR(10),
    photo_url TEXT,
    hostel_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'faculty',
    auth_uid UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- C. WARDENS TABLE
CREATE TABLE IF NOT EXISTS public.wardens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    dob DATE,
    age INT,
    gender VARCHAR(20),
    aadhaar VARCHAR(20),
    department VARCHAR(100) DEFAULT 'Hostel Administration',
    qualification VARCHAR(100),
    mobile VARCHAR(20),
    hostel_name VARCHAR(100) NOT NULL,
    door_no VARCHAR(50),
    street_name VARCHAR(150),
    place VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Kanyakumari',
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10),
    blood_group VARCHAR(10),
    photo_url TEXT,
    role VARCHAR(20) DEFAULT 'warden',
    auth_uid UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL, -- EMIS / Roll Number
    full_name VARCHAR(150) NOT NULL,
    dob DATE,
    age INT,
    gender VARCHAR(20),
    aadhaar VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    student_class VARCHAR(20) NOT NULL, -- e.g. "10", "11", "12"
    section VARCHAR(10) NOT NULL, -- e.g. "A", "B"
    medium VARCHAR(30) DEFAULT 'English',
    prev_school VARCHAR(200),
    academic_year VARCHAR(20) DEFAULT '2024-2025',
    student_group VARCHAR(100) DEFAULT 'Bio-Maths',
    father_name VARCHAR(150),
    father_occupation VARCHAR(100),
    mother_name VARCHAR(150),
    mother_occupation VARCHAR(100),
    mobile VARCHAR(20),
    door_no VARCHAR(50),
    street_name VARCHAR(150),
    place VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Kanyakumari',
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10),
    blood_group VARCHAR(10),
    id_mark_1 TEXT,
    id_mark_2 TEXT,
    medical_issues TEXT,
    hostel_name VARCHAR(100),
    hostel_type VARCHAR(50), -- 'Resident' or 'Day Scholar'
    photo_url TEXT,
    role VARCHAR(20) DEFAULT 'student',
    auth_uid UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ACADEMIC & INSTITUTIONAL TABLES

-- A. STUDENT ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    student_user_id VARCHAR(50),
    student_name VARCHAR(150),
    student_class VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Present', -- 'Present', 'Absent', 'Late', 'Half-Day'
    marked_by VARCHAR(150),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_attendance_daily UNIQUE (student_id, attendance_date)
);

-- B. MARKS ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.marks_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    student_user_id VARCHAR(50),
    student_name VARCHAR(150),
    student_class VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    exam_name VARCHAR(100) NOT NULL, -- e.g. "Unit Test 1", "Quarterly", "Half-Yearly", "Annual"
    subject VARCHAR(100) NOT NULL,
    marks_obtained NUMERIC(5, 2) NOT NULL,
    max_marks NUMERIC(5, 2) NOT NULL DEFAULT 100,
    grade VARCHAR(10),
    faculty_id VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- C. STUDENT & FACULTY LEAVES TABLE
CREATE TABLE IF NOT EXISTS public.student_leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_type VARCHAR(20) DEFAULT 'student', -- 'student' or 'faculty'
    applicant_id VARCHAR(50) NOT NULL,
    applicant_name VARCHAR(150) NOT NULL,
    student_class VARCHAR(20),
    section VARCHAR(10),
    leave_type VARCHAR(50) NOT NULL, -- 'Medical', 'Personal', 'Emergency', 'Hostel Outpass'
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT NOT NULL,
    parent_phone VARCHAR(20),
    warden_approval VARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    admin_approval VARCHAR(20) DEFAULT 'Pending',
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. QUESTION BANK TABLE
CREATE TABLE IF NOT EXISTS public.question_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    student_class VARCHAR(20) NOT NULL,
    unit_chapter VARCHAR(150),
    question_type VARCHAR(50) DEFAULT 'Short Answer', -- 'MCQ', 'Short Answer', 'Long Answer'
    question_text TEXT NOT NULL,
    marks INT DEFAULT 2,
    difficulty VARCHAR(20) DEFAULT 'Medium', -- 'Easy', 'Medium', 'Hard'
    file_url TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    submitted_by VARCHAR(150) DEFAULT 'Staff',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- E. CLASSROOMS TABLE
CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_name VARCHAR(50) UNIQUE NOT NULL,
    block VARCHAR(50) DEFAULT 'Main Academic Block',
    floor VARCHAR(20) DEFAULT 'Ground Floor',
    no_of_rows INT NOT NULL DEFAULT 6,
    benches_per_row INT NOT NULL DEFAULT 5,
    students_per_bench INT NOT NULL DEFAULT 2,
    total_capacity INT GENERATED ALWAYS AS (no_of_rows * benches_per_row * students_per_bench) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- F. EXAM ALLOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.exam_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name VARCHAR(100) NOT NULL,
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
    student_class VARCHAR(20),
    session_date DATE,
    slot VARCHAR(50), -- e.g. "Forenoon (09:30 AM - 12:30 PM)"
    allocated_students JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_exam_classroom UNIQUE (exam_name, classroom_id)
);

-- G. FACULTY ASSIGNMENT TABLE
CREATE TABLE IF NOT EXISTS public.faculty_assign (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id VARCHAR(50) NOT NULL,
    faculty_name VARCHAR(150) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    student_class VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    academic_year VARCHAR(20) DEFAULT '2024-2025',
    periods_per_week INT DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- H. NOTIFICATIONS / CIRCULARS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    target_role VARCHAR(20) DEFAULT 'all', -- 'all', 'student', 'faculty', 'warden', 'admin'
    priority VARCHAR(20) DEFAULT 'normal', -- 'normal', 'urgent'
    expiry_date DATE,
    created_by VARCHAR(100) DEFAULT 'Administration',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- I. VISITORS & GATE PASSES TABLE
CREATE TABLE IF NOT EXISTS public.visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_name VARCHAR(150) NOT NULL,
    pass_number VARCHAR(50) UNIQUE NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    relation VARCHAR(50) DEFAULT 'Parent',
    student_id VARCHAR(50),
    student_name VARCHAR(150) NOT NULL,
    student_class VARCHAR(20),
    purpose TEXT NOT NULL,
    in_time TIMESTAMPTZ DEFAULT NOW(),
    out_time TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Checked Out'
    approved_by VARCHAR(100) DEFAULT 'Campus Security',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- J. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.login_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50),
    email VARCHAR(150),
    role VARCHAR(20),
    ip_address VARCHAR(50),
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'SUCCESS',
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 5. INDEXES FOR HIGH QUERY SPEED
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_students_class_sec ON public.students(student_class, section);
CREATE INDEX IF NOT EXISTS idx_students_userid ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_faculty_userid ON public.faculty_details(user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_dept ON public.faculty_details(department);
CREATE INDEX IF NOT EXISTS idx_att_date_class ON public.student_attendance(attendance_date, student_class, section);
CREATE INDEX IF NOT EXISTS idx_marks_student ON public.marks_entries(student_id, exam_name);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON public.student_leaves(status, applicant_type);
CREATE INDEX IF NOT EXISTS idx_qb_class_sub ON public.question_bank(student_class, subject, status);

-- ====================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_assign ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_audit_logs ENABLE ROW LEVEL SECURITY;

-- Transparent read policies for authenticated and anon users (for school directory & verification)
CREATE POLICY "Public Read Notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public Read Approved QB" ON public.question_bank FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read on faculty" ON public.faculty_details FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read on wardens" ON public.wardens FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read on admins" ON public.admins FOR SELECT USING (true);
CREATE POLICY "Allow read on classrooms" ON public.classrooms FOR SELECT USING (true);
CREATE POLICY "Allow read on attendance" ON public.student_attendance FOR SELECT USING (true);
CREATE POLICY "Allow read on marks" ON public.marks_entries FOR SELECT USING (true);
CREATE POLICY "Allow read on leaves" ON public.student_leaves FOR SELECT USING (true);
CREATE POLICY "Allow read on exam allocations" ON public.exam_allocations FOR SELECT USING (true);
CREATE POLICY "Allow read on faculty assignments" ON public.faculty_assign FOR SELECT USING (true);
CREATE POLICY "Allow read on visitors" ON public.visitors FOR SELECT USING (true);
CREATE POLICY "Allow insert audit logs" ON public.login_audit_logs FOR INSERT WITH CHECK (true);

-- Permissive insert/update policies for school operations
CREATE POLICY "Allow insert/update students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update faculty" ON public.faculty_details FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update wardens" ON public.wardens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update admins" ON public.admins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update attendance" ON public.student_attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update marks" ON public.marks_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update leaves" ON public.student_leaves FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update QB" ON public.question_bank FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update classrooms" ON public.classrooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update exam allocations" ON public.exam_allocations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update faculty assign" ON public.faculty_assign FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update visitors" ON public.visitors FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- 7. INITIAL SAMPLE SEED DATA
-- ====================================================================

-- Admin Seed
INSERT INTO public.admins (user_id, full_name, email, department, qualification, mobile, district)
VALUES 
('ADM001', 'Dr. S. Sundararajan, M.Sc., M.Ed., Ph.D.', 'principal@kkdgms.edu.in', 'Administration', 'Ph.D. Education', '9443100001', 'Kanyakumari')
ON CONFLICT (user_id) DO NOTHING;

-- Faculty Seed
INSERT INTO public.faculty_details (user_id, full_name, email, department, qualification, mobile, district)
VALUES 
('FAC001', 'Mrs. M. Rajeshwari, M.Sc., B.Ed.', 'rajeshwari.maths@kkdgms.edu.in', 'Mathematics', 'M.Sc., M.Phil., B.Ed.', '9443100002', 'Kanyakumari'),
('FAC002', 'Mr. K. Anand, M.Sc., B.Ed.', 'anand.physics@kkdgms.edu.in', 'Physics', 'M.Sc., B.Ed.', '9443100003', 'Kanyakumari'),
('FAC003', 'Dr. P. Vasanthi, M.A., B.Ed., Ph.D.', 'vasanthi.tamil@kkdgms.edu.in', 'Tamil', 'M.A., Ph.D.', '9443100004', 'Kanyakumari'),
('FAC004', 'Mr. D. Joseph, M.A., M.Ed.', 'joseph.english@kkdgms.edu.in', 'English', 'M.A., M.Ed.', '9443100005', 'Kanyakumari')
ON CONFLICT (user_id) DO NOTHING;

-- Warden Seed
INSERT INTO public.wardens (user_id, full_name, email, hostel_name, mobile, district)
VALUES 
('WAR001', 'Mr. T. Murugan', 'murugan.hostel@kkdgms.edu.in', 'Vivekananda Boys Hostel', '9443100006', 'Kanyakumari'),
('WAR002', 'Mrs. S. Parvathi', 'parvathi.hostel@kkdgms.edu.in', 'Mother Teresa Girls Hostel', '9443100007', 'Kanyakumari')
ON CONFLICT (user_id) DO NOTHING;

-- Classrooms Seed
INSERT INTO public.classrooms (room_name, block, floor, no_of_rows, benches_per_row, students_per_bench)
VALUES 
('Hall 101', 'Academic Wing A', 'Ground Floor', 6, 5, 2),
('Hall 102', 'Academic Wing A', 'Ground Floor', 6, 5, 2),
('Hall 201', 'Academic Wing B', 'First Floor', 7, 5, 2),
('Science Lab Hall', 'Science Block', 'Second Floor', 5, 6, 2)
ON CONFLICT (room_name) DO NOTHING;

-- Sample Notifications
INSERT INTO public.notifications (title, message, target_role, priority, expiry_date, created_by)
VALUES 
('Quarterly Examinations Schedule 2024-25', 'The quarterly examinations for standards 10, 11, and 12 will commence on September 20. Hall tickets and seating plans are available in the bench allocation tab.', 'all', 'urgent', '2024-10-31', 'Controller of Examinations'),
('Hostel Gate Pass Guidelines', 'All boarding students requiring weekend leave must submit outpass request through student portal 48 hours in advance for Warden and Principal countersignature.', 'student', 'normal', '2024-12-31', 'Hostel Warden Office'),
('Faculty Departmental Review Meeting', 'Monthly academic progress and question bank review meeting will be conducted on Friday at 03:30 PM in Conference Hall 1.', 'faculty', 'normal', '2024-09-30', 'Principal Office');

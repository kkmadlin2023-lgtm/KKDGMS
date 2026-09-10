-- ====================================================================
-- KKDGMS - COMPLETE MASTER POSTGRESQL SCHEMA + SAMPLE SEED DATA
-- Run this ALL-IN-ONE script in Supabase SQL Editor.
-- It creates all 25 tables, sets up RLS policies, and inserts sample data.
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE IDENTITY & USER ROLE TABLES

-- A. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    initial VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    dob DATE,
    age INT,
    gender VARCHAR(20),
    aadhaar VARCHAR(20),
    department VARCHAR(100) DEFAULT 'Administration',
    qualification VARCHAR(100),
    experience VARCHAR(50),
    mobile VARCHAR(20),
    door_no VARCHAR(50),
    street_name VARCHAR(150),
    place VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Kanyakumari',
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10),
    photo_url TEXT,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. FACULTY DETAILS TABLE
CREATE TABLE IF NOT EXISTS public.faculty_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    initial VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    dob DATE,
    age INT,
    gender VARCHAR(20),
    aadhaar VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    qualification VARCHAR(100),
    experience VARCHAR(50),
    mobile VARCHAR(20),
    door_no VARCHAR(50),
    street_name VARCHAR(150),
    place VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Kanyakumari',
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10),
    blood_group VARCHAR(10),
    assigned_class VARCHAR(20),
    assigned_section VARCHAR(10),
    photo_url TEXT,
    role VARCHAR(20) DEFAULT 'faculty',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- C. WARDENS TABLE
CREATE TABLE IF NOT EXISTS public.wardens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    initial VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    dob DATE,
    age INT,
    gender VARCHAR(20),
    aadhaar VARCHAR(20),
    mobile VARCHAR(20),
    hostel_name VARCHAR(100) NOT NULL,
    hostel_gender VARCHAR(20) DEFAULT 'Boys',
    qualification VARCHAR(100),
    experience VARCHAR(50),
    door_no VARCHAR(50),
    street_name VARCHAR(150),
    place VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Kanyakumari',
    photo_url TEXT,
    role VARCHAR(20) DEFAULT 'warden',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. TECHNICIANS TABLE
CREATE TABLE IF NOT EXISTS public.technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    initial VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    dob DATE,
    age INT,
    gender VARCHAR(20),
    aadhaar VARCHAR(20),
    department VARCHAR(100) DEFAULT 'Technical & IT Support',
    qualification VARCHAR(100),
    experience VARCHAR(50),
    mobile VARCHAR(20),
    photo_url TEXT,
    role VARCHAR(20) DEFAULT 'technician',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- E. GUESTS TABLE
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    organization VARCHAR(150),
    purpose VARCHAR(200),
    role VARCHAR(20) DEFAULT 'guest',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- F. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL, -- EMIS / Roll Number
    full_name VARCHAR(150) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    initial VARCHAR(20),
    dob DATE,
    age INT,
    gender VARCHAR(20),
    aadhaar VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    student_class VARCHAR(20) NOT NULL, -- '9', '10', '11', '12'
    section VARCHAR(10) NOT NULL, -- 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'
    medium VARCHAR(30) DEFAULT 'English',
    academic_year VARCHAR(20) DEFAULT '2024-2025',
    student_group VARCHAR(100) DEFAULT 'Bio-Maths',
    assigned_faculty_id VARCHAR(50),
    assigned_faculty_name VARCHAR(150),
    father_name VARCHAR(150),
    father_occupation VARCHAR(100),
    mother_name VARCHAR(150),
    mother_occupation VARCHAR(100),
    mobile VARCHAR(20),
    door_no VARCHAR(50),
    street_name VARCHAR(150),
    place VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Kanyakumari',
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10),
    blood_group VARCHAR(10),
    hostel_name VARCHAR(100),
    hostel_type VARCHAR(50) DEFAULT 'Resident',
    warden_name VARCHAR(100),
    photo_url TEXT,
    income_cert_no VARCHAR(50),
    community_cert_no VARCHAR(50),
    role VARCHAR(20) DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ACADEMIC & INSTITUTIONAL TABLES

-- A. STUDENT ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    student_user_id VARCHAR(50),
    student_name VARCHAR(150),
    student_class VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Present',
    marked_by VARCHAR(150),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_attendance_daily UNIQUE (student_user_id, attendance_date)
);

-- B. HOLIDAYS TABLE
CREATE TABLE IF NOT EXISTS public.holidays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    is_declared BOOLEAN DEFAULT TRUE,
    declared_by VARCHAR(100) DEFAULT 'Administration',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- C. MARKS ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.marks_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    student_user_id VARCHAR(50),
    student_name VARCHAR(150),
    student_class VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    exam_name VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    marks_obtained NUMERIC(5, 2) NOT NULL,
    max_marks NUMERIC(5, 2) NOT NULL DEFAULT 100,
    grade VARCHAR(10),
    status VARCHAR(20) DEFAULT 'published',
    faculty_id VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. ONLINE EXAMS TABLE
CREATE TABLE IF NOT EXISTS public.online_exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    student_class VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    total_marks INT NOT NULL,
    pass_marks INT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,
    exam_password VARCHAR(100),
    start_otp VARCHAR(10),
    start_otp_expires_at BIGINT,
    end_otp VARCHAR(10),
    status VARCHAR(20) DEFAULT 'draft',
    questions JSONB DEFAULT '[]'::jsonb,
    assigned_faculty_id VARCHAR(50),
    assigned_faculty_name VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- E. ONLINE EXAM ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.online_exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.online_exams(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    student_user_id VARCHAR(50) NOT NULL,
    student_class VARCHAR(20),
    section VARCHAR(10),
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    answers JSONB DEFAULT '{}'::jsonb,
    score NUMERIC(5, 2) DEFAULT 0,
    total_marks INT DEFAULT 0,
    percentage NUMERIC(5, 2) DEFAULT 0,
    is_passed BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'submitted',
    student_feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- F. STUDENT LEAVES TABLE
CREATE TABLE IF NOT EXISTS public.student_leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_type VARCHAR(20) DEFAULT 'student',
    applicant_id VARCHAR(50) NOT NULL,
    applicant_name VARCHAR(150) NOT NULL,
    student_class VARCHAR(20),
    section VARCHAR(10),
    leave_type VARCHAR(50) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    from_time VARCHAR(20),
    to_time VARCHAR(20),
    reason TEXT NOT NULL,
    parent_phone VARCHAR(20),
    approval_token VARCHAR(100),
    parent_approval VARCHAR(20) DEFAULT 'Pending',
    faculty_approval VARCHAR(20) DEFAULT 'Pending',
    warden_approval VARCHAR(20) DEFAULT 'Pending',
    admin_approval VARCHAR(20) DEFAULT 'Pending',
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- G. GATE MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.gate_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    student_user_id VARCHAR(50) NOT NULL,
    student_class VARCHAR(20),
    section VARCHAR(10),
    hostel_name VARCHAR(100),
    leave_id UUID,
    gate_out_time VARCHAR(50) NOT NULL,
    gate_in_time VARCHAR(50),
    warden_out_id VARCHAR(50),
    warden_in_id VARCHAR(50),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'Outside',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- H. QUESTION BANK TABLE
CREATE TABLE IF NOT EXISTS public.question_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    student_class VARCHAR(20) NOT NULL,
    unit_chapter VARCHAR(150),
    question_type VARCHAR(50) DEFAULT 'Short Answer',
    question_text TEXT NOT NULL,
    answer_text TEXT,
    marks INT DEFAULT 2,
    difficulty VARCHAR(20) DEFAULT 'Medium',
    file_url TEXT,
    doc_link TEXT,
    status VARCHAR(20) DEFAULT 'published',
    submitted_by VARCHAR(150) DEFAULT 'Staff',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- I. CLASSROOMS TABLE
CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_name VARCHAR(50) UNIQUE NOT NULL,
    block VARCHAR(50) DEFAULT 'Academic Wing A',
    floor VARCHAR(20) DEFAULT 'Ground Floor',
    no_of_rows INT NOT NULL DEFAULT 6,
    benches_per_row INT NOT NULL DEFAULT 5,
    students_per_bench INT NOT NULL DEFAULT 2,
    total_capacity INT GENERATED ALWAYS AS (no_of_rows * benches_per_row * students_per_bench) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- J. EXAM ALLOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.exam_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name VARCHAR(100) NOT NULL,
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
    student_class VARCHAR(20),
    session_date DATE,
    slot VARCHAR(50),
    allocated_students JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- K. FACULTY ASSIGNMENTS TABLE
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

-- L. 24-HOUR CAMPUS STORIES TABLE
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) DEFAULT 'image',
    caption TEXT,
    duration_seconds INT DEFAULT 15,
    created_by_role VARCHAR(20) DEFAULT 'admin',
    created_by_name VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    is_active BOOLEAN DEFAULT TRUE
);

-- M. SCHOOL EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT,
    event_date DATE NOT NULL,
    start_time VARCHAR(50),
    end_time VARCHAR(50),
    location VARCHAR(150),
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'upcoming',
    created_by VARCHAR(100) DEFAULT 'Administration',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- N. FEEDBACK & REPLIES TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50),
    user_name VARCHAR(150),
    role VARCHAR(20),
    category VARCHAR(50),
    message TEXT NOT NULL,
    rating INT DEFAULT 5,
    status VARCHAR(20) DEFAULT 'Open',
    replies JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- O. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    expense_date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    added_by VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Paid',
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- P. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    target_role VARCHAR(20) DEFAULT 'all',
    target_class VARCHAR(20),
    priority VARCHAR(20) DEFAULT 'normal',
    created_by VARCHAR(100) DEFAULT 'Administration',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Q. NOTIFICATION TOKENS TABLE (FCM)
CREATE TABLE IF NOT EXISTS public.notification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) NOT NULL,
    auth_id VARCHAR(100),
    token TEXT UNIQUE NOT NULL,
    device VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- R. VISITORS TABLE
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
    status VARCHAR(20) DEFAULT 'Active',
    qr_code_token VARCHAR(100),
    approved_by VARCHAR(100) DEFAULT 'Campus Security',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- S. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.login_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50),
    email VARCHAR(150),
    role VARCHAR(20),
    action TEXT NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'SUCCESS',
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY POLICIES
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_assign ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_audit_logs ENABLE ROW LEVEL SECURITY;

-- Read policies
DO $$ BEGIN CREATE POLICY "Public Read Notifications" ON public.notifications FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public Read Stories" ON public.stories FOR SELECT USING (expires_at > NOW() AND is_active = true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Public Read Approved QB" ON public.question_bank FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on students" ON public.students FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on faculty" ON public.faculty_details FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on wardens" ON public.wardens FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on classrooms" ON public.classrooms FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on attendance" ON public.student_attendance FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on marks" ON public.marks_entries FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on online exams" ON public.online_exams FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on exam attempts" ON public.online_exam_attempts FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on leaves" ON public.student_leaves FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on gate movements" ON public.gate_movements FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on visitors" ON public.visitors FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on feedback" ON public.feedback FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow read on expenses" ON public.expenses FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow insert audit logs" ON public.login_audit_logs FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Write policies
DO $$ BEGIN CREATE POLICY "Allow write students" ON public.students FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write faculty" ON public.faculty_details FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write wardens" ON public.wardens FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write technicians" ON public.technicians FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write classrooms" ON public.classrooms FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write attendance" ON public.student_attendance FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write marks" ON public.marks_entries FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write online exams" ON public.online_exams FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write exam attempts" ON public.online_exam_attempts FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write leaves" ON public.student_leaves FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write gate movements" ON public.gate_movements FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write QB" ON public.question_bank FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write stories" ON public.stories FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write events" ON public.events FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write feedback" ON public.feedback FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write visitors" ON public.visitors FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Allow write tokens" ON public.notification_tokens FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ====================================================================
-- 5. SAMPLE SEED DATA (1 RECORD FOR EACH OF THE 25 TABLES)
-- ====================================================================

-- 1. ADMINS
INSERT INTO public.admins (user_id, full_name, first_name, last_name, initial, email, dob, age, gender, aadhaar, department, qualification, experience, mobile, door_no, street_name, place, district, state, pincode, photo_url, role)
VALUES ('ADM001', 'Dr. S. Sundararajan, Ph.D.', 'Sundararajan', 'S', 'Dr', 'principal@kkdgms.edu.in', '1975-06-12', 49, 'Male', '458912345678', 'Principal & Administration', 'M.Sc., M.Ed., Ph.D.', '22 Years', '9443100001', '1/A', 'Model School Campus Road', 'Navalcadu', 'Kanyakumari', 'Tamil Nadu', '629002', '/icon.jpg', 'admin')
ON CONFLICT (user_id) DO NOTHING;

-- 2. FACULTY DETAILS
INSERT INTO public.faculty_details (user_id, full_name, first_name, last_name, initial, email, dob, age, gender, aadhaar, department, designation, qualification, experience, mobile, door_no, street_name, place, district, state, pincode, blood_group, assigned_class, assigned_section, photo_url, role)
VALUES ('FAC001', 'Mrs. M. Rajeshwari, M.Sc., B.Ed.', 'Rajeshwari', 'M', 'M', 'rajeshwari.maths@kkdgms.edu.in', '1984-04-18', 40, 'Female', '789123456789', 'Mathematics', 'PGT Mathematics', 'M.Sc., M.Phil., B.Ed.', '12 Years', '9443100002', '14/3', 'North Car Street', 'Nagercoil', 'Kanyakumari', 'Tamil Nadu', '629001', 'O+', '12', 'A', '/teacher1.jpg', 'faculty')
ON CONFLICT (user_id) DO NOTHING;

-- 3. WARDENS
INSERT INTO public.wardens (user_id, full_name, first_name, last_name, initial, email, dob, age, gender, aadhaar, mobile, hostel_name, hostel_gender, qualification, experience, door_no, street_name, place, district, photo_url, role)
VALUES ('WAR001', 'Mr. T. Murugan', 'Murugan', 'T', 'T', 'murugan.hostel@kkdgms.edu.in', '1986-09-24', 38, 'Male', '671234567890', '9443100006', 'Vivekananda Boys Hostel', 'Boys', 'B.A., Physical Education', '7 Years', '5/22', 'Hostel Warden Quarters', 'Navalcadu', 'Kanyakumari', '/icon.jpg', 'warden')
ON CONFLICT (user_id) DO NOTHING;

-- 4. TECHNICIANS
INSERT INTO public.technicians (user_id, full_name, first_name, last_name, initial, email, dob, age, gender, aadhaar, department, qualification, experience, mobile, photo_url, role)
VALUES ('TECH001', 'Mr. R. Vignesh, B.Tech', 'Vignesh', 'R', 'R', 'vignesh.tech@kkdgms.edu.in', '1995-11-03', 29, 'Male', '561234567890', 'Computer Systems & Exam Cell', 'B.Tech Information Technology', '5 Years', '9443100008', '/icon.jpg', 'technician')
ON CONFLICT (user_id) DO NOTHING;

-- 5. GUESTS
INSERT INTO public.guests (user_id, full_name, email, organization, purpose, role)
VALUES ('GUEST01', 'District Inspection Officer', 'inspect.kk@tn.gov.in', 'Department of School Education, TN', 'Model School Annual Inspection', 'guest')
ON CONFLICT (user_id) DO NOTHING;

-- 6. STUDENTS
INSERT INTO public.students (user_id, full_name, first_name, last_name, initial, dob, age, gender, aadhaar, email, student_class, section, medium, academic_year, student_group, assigned_faculty_id, assigned_faculty_name, father_name, father_occupation, mother_name, mother_occupation, mobile, door_no, street_name, place, city, district, state, pincode, blood_group, hostel_name, hostel_type, warden_name, photo_url, income_cert_no, community_cert_no, role)
VALUES ('EMIS202401', 'A. Dhanush Kumar', 'Dhanush', 'Kumar', 'A', '2007-05-14', 17, 'Male', '891234567890', 'dhanush.k@student.kkdgms.edu.in', '12', 'A', 'English', '2024-2025', 'Bio-Maths', 'FAC001', 'Mrs. M. Rajeshwari', 'V. Arumugam', 'Agriculture', 'A. Meenakshi', 'Homemaker', '9443211111', '14/B', 'Mela Street', 'Navalcadu', 'Nagercoil', 'Kanyakumari', 'Tamil Nadu', '629002', 'O+', 'Vivekananda Boys Hostel', 'Resident', 'Mr. T. Murugan', '/icon.jpg', 'INC-2024-88412', 'COMM-BC-44120', 'student')
ON CONFLICT (user_id) DO NOTHING;

-- 7. STUDENT ATTENDANCE
INSERT INTO public.student_attendance (student_user_id, student_name, student_class, section, attendance_date, status, marked_by, remarks)
VALUES ('EMIS202401', 'A. Dhanush Kumar', '12', 'A', CURRENT_DATE, 'Present', 'Mrs. M. Rajeshwari', 'Regular attendance on time')
ON CONFLICT (student_user_id, attendance_date) DO NOTHING;

-- 8. HOLIDAYS
INSERT INTO public.holidays (date, title, is_declared, declared_by)
VALUES ('2024-10-31', 'Diwali Festival Holiday', true, 'Principal Office')
ON CONFLICT (date) DO NOTHING;

-- 9. MARKS ENTRIES
INSERT INTO public.marks_entries (student_user_id, student_name, student_class, section, exam_name, subject, marks_obtained, max_marks, grade, status, faculty_id, remarks)
VALUES ('EMIS202401', 'A. Dhanush Kumar', '12', 'A', 'Quarterly Examination', 'Mathematics', 96.00, 100.00, 'A1', 'published', 'FAC001', 'Distinction performance in Calculus');

-- 10. ONLINE EXAMS
INSERT INTO public.online_exams (exam_name, subject, student_class, section, total_marks, pass_marks, duration_minutes, exam_password, start_otp, start_otp_expires_at, end_otp, status, questions, assigned_faculty_id, assigned_faculty_name)
VALUES ('Chapter 7 Differential Calculus Class Test', 'Mathematics', '12', 'A', 20, 8, 30, 'MATHS2024', '784219', 1726000000000, '932145', 'active', '[{"id": "q1", "question_text": "What is the derivative of sin(2x)?", "choices": [{"id": "c1", "text": "2 cos(2x)"}, {"id": "c2", "text": "cos(2x)"}, {"id": "c3", "text": "-2 cos(2x)"}, {"id": "c4", "text": "2 sin(2x)"}], "correct_answer_id": "c1", "marks": 5, "negative_marks": 0}]'::jsonb, 'FAC001', 'Mrs. M. Rajeshwari');

-- 11. ONLINE EXAM ATTEMPTS
INSERT INTO public.online_exam_attempts (student_id, student_name, student_user_id, student_class, section, answers, score, total_marks, percentage, is_passed, status, student_feedback)
VALUES ('s-001', 'A. Dhanush Kumar', 'EMIS202401', '12', 'A', '{"q1": "c1"}'::jsonb, 10.00, 10, 100.00, true, 'submitted', 'Clear conceptual test.');

-- 12. STUDENT LEAVES
INSERT INTO public.student_leaves (applicant_type, applicant_id, applicant_name, student_class, section, leave_type, from_date, to_date, from_time, to_time, reason, parent_phone, approval_token, parent_approval, faculty_approval, warden_approval, admin_approval, status)
VALUES ('student', 'EMIS202401', 'A. Dhanush Kumar', '12', 'A', 'Hostel Outpass', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '4 days', '05:00 PM', '06:00 PM', 'Family temple festival in native village.', '9443211111', 'tok-leave-89412', 'Approved', 'Approved', 'Approved', 'Approved', 'Admin Approved');

-- 13. GATE MOVEMENTS
INSERT INTO public.gate_movements (student_id, student_name, student_user_id, student_class, section, hostel_name, gate_out_time, gate_in_time, warden_out_id, warden_in_id, reason, status)
VALUES ('s-001', 'A. Dhanush Kumar', 'EMIS202401', '12', 'A', 'Vivekananda Boys Hostel', '05:30 PM', NULL, 'WAR001', NULL, 'Weekend leave outpass to hometown', 'Outside');

-- 14. QUESTION BANK
INSERT INTO public.question_bank (title, subject, student_class, unit_chapter, question_type, question_text, answer_text, marks, difficulty, status, submitted_by)
VALUES ('Lens Makers Formula Derivation', 'Physics', '12', 'Unit 6 - Ray Optics', 'Long Answer', 'Derive the Lens Maker formula for a thin biconvex lens with proper ray diagram and sign convention.', '1/f = (n - 1) * (1/R1 - 1/R2). Detailed optical path refraction proof.', 5, 'Medium', 'published', 'Mr. K. Anand');

-- 15. CLASSROOMS
INSERT INTO public.classrooms (room_name, block, floor, no_of_rows, benches_per_row, students_per_bench)
VALUES ('Hall 101', 'Academic Wing A', 'Ground Floor', 6, 5, 2)
ON CONFLICT (room_name) DO NOTHING;

-- 16. EXAM ALLOCATIONS
INSERT INTO public.exam_allocations (exam_name, student_class, session_date, slot, allocated_students)
VALUES ('Quarterly Examination 2024', '12', CURRENT_DATE + INTERVAL '10 days', 'Forenoon (09:30 AM - 12:30 PM)', '[{"bench_no": 1, "seat_pos": "Left", "student_id": "s-001", "student_name": "A. Dhanush Kumar", "student_class": "12", "section": "A"}]'::jsonb);

-- 17. FACULTY ASSIGNMENTS
INSERT INTO public.faculty_assign (faculty_id, faculty_name, subject, student_class, section, academic_year, periods_per_week)
VALUES ('FAC001', 'Mrs. M. Rajeshwari', 'Mathematics', '12', 'A', '2024-2025', 7);

-- 18. 24-HOUR STORIES
INSERT INTO public.stories (media_url, media_type, caption, duration_seconds, created_by_role, created_by_name, is_active)
VALUES ('/kanyakumari.jpg', 'image', 'Morning assembly & physical exercise drill at Navalcadu Model Campus.', 15, 'admin', 'Principal Office', true);

-- 19. SCHOOL EVENTS
INSERT INTO public.events (title, description, image_url, event_date, start_time, end_time, location, status, created_by)
VALUES ('Annual Inter-School Science Congress 2024', 'State-level model exhibition, science quiz, and robotics demonstration.', '/kanyakumari.jpg', CURRENT_DATE + INTERVAL '15 days', '09:00 AM', '04:30 PM', 'Main Auditorium & STEM Lab', 'upcoming', 'Administration');

-- 20. FEEDBACK
INSERT INTO public.feedback (user_id, user_name, role, category, message, rating, status, replies)
VALUES ('EMIS202401', 'A. Dhanush Kumar', 'student', 'Academics', 'The online exam practice portal with 10s OTP and instant answers review is very helpful for our Board preparation.', 5, 'Reviewed', '[{"id": "rep-1", "reply_text": "Thank you Dhanush. Keep practicing with the question bank.", "replied_by": "Principal Office", "replied_at": "2024-09-10T10:30:00Z"}]'::jsonb);

-- 21. EXPENSES
INSERT INTO public.expenses (expense_name, category, amount, expense_date, description, added_by, status)
VALUES ('Physics Optics & Laser Kits Calibration', 'Lab & Equipment', 12500.00, CURRENT_DATE - INTERVAL '3 days', 'Precision calibration and optical benches maintenance for Standard 12 science lab.', 'Technician Desk', 'Paid');

-- 22. NOTIFICATIONS
INSERT INTO public.notifications (title, message, target_role, target_class, priority, created_by)
VALUES ('Quarterly Examination Schedule 2024-25 Published', 'The quarterly examination timetable for standards 9 through 12 is available on the ERP portal.', 'all', 'All', 'urgent', 'Controller of Examinations');

-- 23. NOTIFICATION TOKENS
INSERT INTO public.notification_tokens (user_id, auth_id, token, device, is_active)
VALUES ('EMIS202401', 'auth-usr-88912', 'fcm-sample-token-web-push-kkdgms-89124', 'Desktop Chrome Browser', true)
ON CONFLICT (token) DO NOTHING;

-- 24. VISITORS
INSERT INTO public.visitors (visitor_name, pass_number, contact_number, relation, student_id, student_name, student_class, purpose, status, qr_code_token, approved_by)
VALUES ('V. Arumugam', 'PASS-2024-104', '9443211111', 'Father', 'EMIS202401', 'A. Dhanush Kumar', '12-A', 'Submitted medical certificate and met warden for weekend outpass verification.', 'Active', 'vqr-8841920', 'Main Campus Gate Security')
ON CONFLICT (pass_number) DO NOTHING;

-- 25. LOGIN AUDIT LOGS
INSERT INTO public.login_audit_logs (user_id, email, role, action, ip_address, user_agent, status)
VALUES ('ADM001', 'principal@kkdgms.edu.in', 'admin', 'Admin logged in and synchronized quarterly exam marksheets.', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'SUCCESS');

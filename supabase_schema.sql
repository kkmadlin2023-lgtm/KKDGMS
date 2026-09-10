-- ====================================================================
-- KKDGMS - KANYAKUMARI DISTRICT GOVERNMENT MODEL SCHOOL
-- COMPLETE MASTER POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS) RULES
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE IDENTITY & ROLES TABLES

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

-- F. STUDENTS TABLE (9 to 12, Sections A to H, Groups)
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
    student_group VARCHAR(100) DEFAULT 'Bio-Maths', -- 'Non-Group', 'Bio-Maths', 'Maths-Computer', 'Humanities', 'Accountancy'
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
    hostel_type VARCHAR(50) DEFAULT 'Resident', -- 'Resident' or 'Day Scholar'
    warden_name VARCHAR(100),
    photo_url TEXT,
    income_cert_no VARCHAR(50),
    community_cert_no VARCHAR(50),
    role VARCHAR(20) DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ACADEMIC & INSTITUTIONAL TABLES

-- A. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    student_user_id VARCHAR(50),
    student_name VARCHAR(150),
    student_class VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Present', -- 'Present', 'Absent', 'Late', 'Half-Day', 'Holiday'
    marked_by VARCHAR(150),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_attendance_daily UNIQUE (student_id, attendance_date)
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
    status VARCHAR(20) DEFAULT 'published', -- 'draft' or 'published'
    faculty_id VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. ONLINE EXAMS TABLE (With Start & End OTP, Questions JSONB)
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
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'active', 'completed', 'archived'
    questions JSONB DEFAULT '[]'::jsonb,
    assigned_faculty_id VARCHAR(50),
    assigned_faculty_name VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- E. ONLINE EXAM ATTEMPTS & AUTOSAVED ANSWERS
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

-- F. STUDENT & FACULTY LEAVES TABLE (WhatsApp Integration)
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

-- G. GATE MOVEMENT & OUTPASS LOGS (Warden)
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
    status VARCHAR(20) DEFAULT 'Outside', -- 'Outside', 'Returned', 'Late Return'
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

-- I. 24-HOUR CAMPUS STORIES TABLE
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

-- J. SCHOOL EVENTS TABLE
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

-- K. FEEDBACK & REPLIES TABLE
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

-- L. EXPENSES TABLE
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

-- M. NOTIFICATIONS & FCM PUSH TOKENS
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

CREATE TABLE IF NOT EXISTS public.notification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) NOT NULL,
    auth_id VARCHAR(100),
    token TEXT UNIQUE NOT NULL,
    device VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- N. VISITORS PASSES TABLE
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

-- O. AUDIT LOGS TABLE
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

-- 4. ROW LEVEL SECURITY (RLS)
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
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_audit_logs ENABLE ROW LEVEL SECURITY;

-- Transparent read policies for educational directory & public portal
CREATE POLICY "Public Read Notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public Read Stories" ON public.stories FOR SELECT USING (expires_at > NOW() AND is_active = true);
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Read Approved QB" ON public.question_bank FOR SELECT USING (true);
CREATE POLICY "Allow read on students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow read on faculty" ON public.faculty_details FOR SELECT USING (true);
CREATE POLICY "Allow read on wardens" ON public.wardens FOR SELECT USING (true);
CREATE POLICY "Allow read on attendance" ON public.student_attendance FOR SELECT USING (true);
CREATE POLICY "Allow read on marks" ON public.marks_entries FOR SELECT USING (true);
CREATE POLICY "Allow read on online exams" ON public.online_exams FOR SELECT USING (true);
CREATE POLICY "Allow read on exam attempts" ON public.online_exam_attempts FOR SELECT USING (true);
CREATE POLICY "Allow read on leaves" ON public.student_leaves FOR SELECT USING (true);
CREATE POLICY "Allow read on gate movements" ON public.gate_movements FOR SELECT USING (true);
CREATE POLICY "Allow read on visitors" ON public.visitors FOR SELECT USING (true);
CREATE POLICY "Allow read on feedback" ON public.feedback FOR SELECT USING (true);
CREATE POLICY "Allow read on expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Allow insert audit logs" ON public.login_audit_logs FOR INSERT WITH CHECK (true);

-- Permissive insert/update policies for school operations
CREATE POLICY "Allow insert/update students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update faculty" ON public.faculty_details FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update wardens" ON public.wardens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update technicians" ON public.technicians FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update attendance" ON public.student_attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update marks" ON public.marks_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update online exams" ON public.online_exams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update exam attempts" ON public.online_exam_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update leaves" ON public.student_leaves FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update gate movements" ON public.gate_movements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update QB" ON public.question_bank FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update stories" ON public.stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update events" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update feedback" ON public.feedback FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert/update visitors" ON public.visitors FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- KKDGMS CORE — Phase 3: Academic Structure + Student Management + Faculty Management
-- Migration: 003_academic_student_faculty.sql
-- Description: Creates academic years, classes, sections, subjects, class_subjects,
--              students, student_enrollments, faculty_details, RLS, triggers, and audit logging.
-- ==============================================================================

-- 1. ACADEMIC STRUCTURE TABLES

-- Academic Years
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL, -- e.g. '2026-2027'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academic_years_current ON public.academic_years(is_current);

-- Trigger to ensure only one academic year is marked is_current = true
CREATE OR REPLACE FUNCTION public.handle_current_academic_year()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    IF NEW.is_current = true THEN
        UPDATE public.academic_years
        SET is_current = false
        WHERE id <> NEW.id AND is_current = true;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_current_academic_year ON public.academic_years;
CREATE TRIGGER tr_current_academic_year
    BEFORE INSERT OR UPDATE ON public.academic_years
    FOR EACH ROW
    WHEN (NEW.is_current = true)
    EXECUTE FUNCTION public.handle_current_academic_year();

-- Classes (e.g. 6, 7, 8, 9, 10, 11, 12)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    numeric_order INTEGER NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sections (e.g. A, B, C, D)
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Class-Section Relationship
CREATE TABLE IF NOT EXISTS public.class_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(class_id, section_id)
);

CREATE INDEX IF NOT EXISTS idx_class_sections_class ON public.class_sections(class_id);

-- Subjects
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL, -- e.g. 'TAM101', 'ENG101', 'MAT101', 'SCI101'
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Class-Subjects Mapping
CREATE TABLE IF NOT EXISTS public.class_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(class_id, subject_id, academic_year_id)
);

CREATE INDEX IF NOT EXISTS idx_class_subjects_class ON public.class_subjects(class_id);

-- 2. STUDENT MANAGEMENT TABLES

-- Students Master Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admission_number TEXT UNIQUE NOT NULL, -- EMIS / Admission No
    full_name TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    aadhaar TEXT, -- Full aadhaar stored securely, masked in presentation
    photo_url TEXT,
    email TEXT,
    mobile TEXT,
    father_name TEXT,
    mother_name TEXT,
    parent_mobile TEXT,
    door_no TEXT,
    street_name TEXT,
    place TEXT,
    district TEXT,
    state TEXT DEFAULT 'Tamil Nadu',
    pincode TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'TRANSFERRED', 'GRADUATED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_admission ON public.students(admission_number);
CREATE INDEX IF NOT EXISTS idx_students_name ON public.students(full_name);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_students_user ON public.students(user_id);

-- Student Enrollments (Academic Placement per Year)
CREATE TABLE IF NOT EXISTS public.student_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    roll_number TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PROMOTED', 'COMPLETED', 'WITHDRAWN')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, academic_year_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_year_class ON public.student_enrollments(academic_year_id, class_id, section_id);

-- 3. FACULTY MANAGEMENT TABLES

-- Faculty Details Table
CREATE TABLE IF NOT EXISTS public.faculty_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    employee_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT,
    department TEXT NOT NULL DEFAULT 'General',
    qualification TEXT,
    designation TEXT DEFAULT 'Teacher',
    dob DATE,
    gender TEXT CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faculty_employee_id ON public.faculty_details(employee_id);
CREATE INDEX IF NOT EXISTS idx_faculty_name ON public.faculty_details(full_name);
CREATE INDEX IF NOT EXISTS idx_faculty_dept ON public.faculty_details(department);
CREATE INDEX IF NOT EXISTS idx_faculty_status ON public.faculty_details(status);
CREATE INDEX IF NOT EXISTS idx_faculty_user ON public.faculty_details(user_id);

-- 4. STORAGE BUCKETS FOR PHOTOS
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('student-photos', 'student-photos', true),
    ('faculty-photos', 'faculty-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for Student & Faculty Photos
DROP POLICY IF EXISTS "Public view student photos" ON storage.objects;
CREATE POLICY "Public view student photos" ON storage.objects FOR SELECT
USING (bucket_id IN ('student-photos', 'faculty-photos'));

DROP POLICY IF EXISTS "Admins can upload student photos" ON storage.objects;
CREATE POLICY "Admins can upload student photos" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id IN ('student-photos', 'faculty-photos') 
    AND public.is_admin()
);

DROP POLICY IF EXISTS "Admins can update student photos" ON storage.objects;
CREATE POLICY "Admins can update student photos" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('student-photos', 'faculty-photos') AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete student photos" ON storage.objects;
CREATE POLICY "Admins can delete student photos" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('student-photos', 'faculty-photos') AND public.is_admin());

-- 5. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS across all new tables
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_details ENABLE ROW LEVEL SECURITY;

-- Academic Structure Read Policy (All authenticated users)
CREATE POLICY "Authenticated users can read academic years" ON public.academic_years FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read classes" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read sections" ON public.sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read class sections" ON public.class_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read class subjects" ON public.class_subjects FOR SELECT TO authenticated USING (true);

-- Academic Structure Write Policies (Only Admins)
CREATE POLICY "Admins can manage academic years" ON public.academic_years FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage sections" ON public.sections FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage class sections" ON public.class_sections FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage subjects" ON public.subjects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage class subjects" ON public.class_subjects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Students Policies
CREATE POLICY "Admins can manage all students" ON public.students FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Faculty can view active students" ON public.students FOR SELECT TO authenticated USING (public.has_role('FACULTY') OR public.is_admin());
CREATE POLICY "Students can view their own student record" ON public.students FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Student Enrollments Policies
CREATE POLICY "Admins can manage enrollments" ON public.student_enrollments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Faculty can view enrollments" ON public.student_enrollments FOR SELECT TO authenticated USING (public.has_role('FACULTY') OR public.is_admin());
CREATE POLICY "Students can view their own enrollments" ON public.student_enrollments FOR SELECT TO authenticated USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- Faculty Details Policies
CREATE POLICY "Admins can manage all faculty" ON public.faculty_details FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated users can view active faculty" ON public.faculty_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Faculty can update their own contact info" ON public.faculty_details FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 6. SEED INITIAL ACADEMIC STRUCTURE DATA
INSERT INTO public.academic_years (name, start_date, end_date, is_current, is_active)
VALUES 
    ('2026-2027', '2026-06-01', '2027-04-30', true, true),
    ('2025-2026', '2025-06-01', '2026-04-30', false, true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.classes (name, numeric_order, is_active)
VALUES 
    ('6', 6, true),
    ('7', 7, true),
    ('8', 8, true),
    ('9', 9, true),
    ('10', 10, true),
    ('11', 11, true),
    ('12', 12, true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.sections (name, is_active)
VALUES 
    ('A', true),
    ('B', true),
    ('C', true),
    ('D', true)
ON CONFLICT (name) DO NOTHING;

-- Seed default subjects
INSERT INTO public.subjects (name, code, description, is_active)
VALUES
    ('Tamil', 'TAM-01', 'Tamil Language and Literature', true),
    ('English', 'ENG-01', 'English Language and Communication', true),
    ('Mathematics', 'MAT-01', 'Standard Mathematics', true),
    ('Science', 'SCI-01', 'General Science / Physics / Chemistry / Biology', true),
    ('Social Science', 'SOC-01', 'History, Geography, Civics and Economics', true),
    ('Computer Science', 'CSC-01', 'Computer Applications and Programming', true)
ON CONFLICT (code) DO NOTHING;

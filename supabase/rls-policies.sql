-- ============================================================================
-- KKDGMS — Master Row Level Security (RLS) Policies
-- Complete Zero-Trust Role-Based Enforcement
-- ============================================================================

-- Helper function to extract current authenticated user's role from profiles table
CREATE OR REPLACE FUNCTION auth.current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function to check if current user is ADMIN
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'ADMIN' AND is_active = true
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function to get current user's profile ID
CREATE OR REPLACE FUNCTION auth.current_profile_id()
RETURNS UUID AS $$
    SELECT auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- ----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardens ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_assign ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE gate_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_allocations ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ----------------------------------------------------------------------------
-- Anyone can view their own profile; Admins can view all; Public can view active faculty profiles
CREATE POLICY "profiles_select" ON profiles
    FOR SELECT USING (
        auth.uid() = id 
        OR auth.is_admin()
        OR (role = 'FACULTY' AND is_active = true)
    );

CREATE POLICY "profiles_update" ON profiles
    FOR UPDATE USING (
        auth.uid() = id OR auth.is_admin()
    ) WITH CHECK (
        auth.uid() = id OR auth.is_admin()
    );

CREATE POLICY "profiles_admin_all" ON profiles
    FOR ALL USING (auth.is_admin());

-- ----------------------------------------------------------------------------
-- 2. STUDENTS POLICIES
-- ----------------------------------------------------------------------------
-- Students see their own record; Faculty see students in their assigned classes; Wardens see hostel inmates; Admin sees all
CREATE POLICY "students_select" ON students
    FOR SELECT USING (
        auth.is_admin()
        OR profile_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM faculty_assign fa
            JOIN faculty_details fd ON fd.id = fa.faculty_id
            WHERE fd.profile_id = auth.uid()
              AND fa.student_class = students.student_class
              AND fa.section = students.section
        )
        OR EXISTS (
            SELECT 1 FROM wardens w
            WHERE w.profile_id = auth.uid()
              AND w.assigned_hostel = students.hostel_name
        )
    );

CREATE POLICY "students_admin_cud" ON students
    FOR ALL USING (auth.is_admin()) WITH CHECK (auth.is_admin());

-- ----------------------------------------------------------------------------
-- 3. FACULTY DETAILS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "faculty_select_public" ON faculty_details
    FOR SELECT USING (true); -- Public directory viewable on index.html

CREATE POLICY "faculty_admin_manage" ON faculty_details
    FOR ALL USING (auth.is_admin()) WITH CHECK (auth.is_admin());

-- ----------------------------------------------------------------------------
-- 4. ATTENDANCE POLICIES
-- ----------------------------------------------------------------------------
-- Students see own attendance; Faculty can mark/edit for assigned class; Admin has full access
CREATE POLICY "attendance_select" ON student_attendance
    FOR SELECT USING (
        auth.is_admin()
        OR EXISTS (
            SELECT 1 FROM students s
            WHERE s.id = student_attendance.student_id AND s.profile_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM faculty_assign fa
            JOIN faculty_details fd ON fd.id = fa.faculty_id
            WHERE fd.profile_id = auth.uid()
              AND fa.student_class = student_attendance.student_class
              AND fa.section = student_attendance.section
        )
    );

CREATE POLICY "attendance_faculty_insert" ON student_attendance
    FOR INSERT WITH CHECK (
        auth.is_admin()
        OR EXISTS (
            SELECT 1 FROM faculty_assign fa
            JOIN faculty_details fd ON fd.id = fa.faculty_id
            WHERE fd.profile_id = auth.uid()
              AND fa.student_class = student_attendance.student_class
              AND fa.section = student_attendance.section
        )
    );

CREATE POLICY "attendance_faculty_update" ON student_attendance
    FOR UPDATE USING (
        auth.is_admin()
        OR EXISTS (
            SELECT 1 FROM faculty_assign fa
            JOIN faculty_details fd ON fd.id = fa.faculty_id
            WHERE fd.profile_id = auth.uid()
              AND fa.student_class = student_attendance.student_class
              AND fa.section = student_attendance.section
        )
    );

-- ----------------------------------------------------------------------------
-- 5. MARKS POLICIES
-- ----------------------------------------------------------------------------
-- Students see only published marks of their own; Faculty see assigned classes; Admin sees all
CREATE POLICY "marks_select" ON marks_entries
    FOR SELECT USING (
        auth.is_admin()
        OR (
            is_published = true AND EXISTS (
                SELECT 1 FROM students s
                WHERE s.id = marks_entries.student_id AND s.profile_id = auth.uid()
            )
        )
        OR EXISTS (
            SELECT 1 FROM faculty_assign fa
            JOIN faculty_details fd ON fd.id = fa.faculty_id
            WHERE fd.profile_id = auth.uid()
              AND fa.student_class = marks_entries.student_class
              AND fa.section = marks_entries.section
        )
    );

CREATE POLICY "marks_faculty_manage" ON marks_entries
    FOR ALL USING (
        auth.is_admin()
        OR EXISTS (
            SELECT 1 FROM faculty_assign fa
            JOIN faculty_details fd ON fd.id = fa.faculty_id
            WHERE fd.profile_id = auth.uid()
              AND fa.student_class = marks_entries.student_class
              AND fa.section = marks_entries.section
        )
    );

-- ----------------------------------------------------------------------------
-- 6. LEAVES & GATE MOVEMENTS
-- ----------------------------------------------------------------------------
CREATE POLICY "leaves_select" ON student_leaves
    FOR SELECT USING (
        auth.is_admin()
        OR EXISTS (
            SELECT 1 FROM students s WHERE s.id = student_leaves.student_id AND s.profile_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM faculty_details fd WHERE fd.id = student_leaves.faculty_id AND fd.profile_id = auth.uid()
        )
        OR auth.current_user_role() = 'WARDEN'
    );

CREATE POLICY "leaves_insert" ON student_leaves
    FOR INSERT WITH CHECK (
        auth.is_admin()
        OR auth.current_user_role() IN ('FACULTY', 'STUDENT')
    );

CREATE POLICY "leaves_update" ON student_leaves
    FOR UPDATE USING (
        auth.is_admin()
        OR auth.current_user_role() IN ('FACULTY', 'WARDEN')
    );

-- ----------------------------------------------------------------------------
-- 7. ONLINE EXAMS & ATTEMPTS
-- ----------------------------------------------------------------------------
CREATE POLICY "exams_select" ON online_exams
    FOR SELECT USING (
        is_published = true OR auth.is_admin() OR auth.current_user_role() = 'FACULTY'
    );

CREATE POLICY "exams_faculty_manage" ON online_exams
    FOR ALL USING (auth.is_admin() OR auth.current_user_role() = 'FACULTY');

CREATE POLICY "attempts_select" ON exam_attempts
    FOR SELECT USING (
        auth.is_admin()
        OR auth.current_user_role() = 'FACULTY'
        OR EXISTS (SELECT 1 FROM students s WHERE s.id = exam_attempts.student_id AND s.profile_id = auth.uid())
    );

CREATE POLICY "attempts_student_manage" ON exam_attempts
    FOR ALL USING (
        auth.is_admin()
        OR EXISTS (SELECT 1 FROM students s WHERE s.id = exam_attempts.student_id AND s.profile_id = auth.uid())
    );

CREATE POLICY "answers_manage" ON exam_answers
    FOR ALL USING (
        auth.is_admin()
        OR EXISTS (
            SELECT 1 FROM exam_attempts ea
            JOIN students s ON s.id = ea.student_id
            WHERE ea.id = exam_answers.attempt_id AND s.profile_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- 8. PUBLIC / BROADCAST TABLES (Notifications, Events, Stories)
-- ----------------------------------------------------------------------------
CREATE POLICY "notifications_select_public" ON notifications
    FOR SELECT USING (
        status = 'ACTIVE' 
        OR auth.is_admin()
    );

CREATE POLICY "events_select_public" ON events
    FOR SELECT USING (true);

CREATE POLICY "stories_select_public" ON stories
    FOR SELECT USING (expires_at > NOW());

CREATE POLICY "holidays_select_public" ON holidays
    FOR SELECT USING (true);

-- ----------------------------------------------------------------------------
-- 9. AUDIT LOGS (Strict Admin View Only, Trigger-based Inserts)
-- ----------------------------------------------------------------------------
CREATE POLICY "audit_admin_only" ON audit_logs
    FOR SELECT USING (auth.is_admin());

CREATE POLICY "audit_insert_any" ON audit_logs
    FOR INSERT WITH CHECK (true); -- Trigger and client logger insert

CREATE POLICY "login_logs_admin_only" ON login_audit_logs
    FOR SELECT USING (auth.is_admin());

CREATE POLICY "login_logs_insert_any" ON login_audit_logs
    FOR INSERT WITH CHECK (true);

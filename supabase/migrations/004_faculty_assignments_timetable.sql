-- ==============================================================================
-- KKDGMS CORE — Phase 4: Faculty Allocation + Timetable Management
-- Migration: 004_faculty_assignments_timetable.sql
-- Description: Creates faculty_assignments, timetable_periods, timetable_entries,
--              conflict validation functions, RLS policies, and audit triggers.
-- ==============================================================================

-- 1. FACULTY ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.faculty_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES public.faculty_details(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    is_class_teacher BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique index to prevent duplicate active assignment for the same subject in the same class/section/year
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_subject_assignment
    ON public.faculty_assignments (academic_year_id, class_id, section_id, subject_id)
    WHERE (status = 'ACTIVE');

-- Unique index to ensure only one active class teacher per class/section/year
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_class_teacher
    ON public.faculty_assignments (academic_year_id, class_id, section_id)
    WHERE (status = 'ACTIVE' AND is_class_teacher = true);

CREATE INDEX IF NOT EXISTS idx_faculty_assignments_year ON public.faculty_assignments(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_faculty_assignments_faculty ON public.faculty_assignments(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_assignments_class_sec ON public.faculty_assignments(class_id, section_id);
CREATE INDEX IF NOT EXISTS idx_faculty_assignments_subject ON public.faculty_assignments(subject_id);

-- 2. TIMETABLE PERIODS TABLE
CREATE TABLE IF NOT EXISTS public.timetable_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_number INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_break BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timetable_periods_order ON public.timetable_periods(period_number);

-- Seed default timetable periods if empty
INSERT INTO public.timetable_periods (period_number, name, start_time, end_time, is_break, is_active)
VALUES
    (1, 'Period 1', '09:00:00', '09:45:00', false, true),
    (2, 'Period 2', '09:45:00', '10:30:00', false, true),
    (3, 'Morning Break', '10:30:00', '10:45:00', true, true),
    (4, 'Period 3', '10:45:00', '11:30:00', false, true),
    (5, 'Period 4', '11:30:00', '12:15:00', false, true),
    (6, 'Lunch Break', '12:15:00', '13:15:00', true, true),
    (7, 'Period 5', '13:15:00', '14:00:00', false, true),
    (8, 'Period 6', '14:00:00', '14:45:00', false, true),
    (9, 'Period 7', '14:45:00', '15:30:00', false, true),
    (10, 'Period 8', '15:30:00', '16:15:00', false, true)
ON CONFLICT (period_number) DO NOTHING;

-- 3. TIMETABLE ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.timetable_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    academic_year_id UUID NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES public.faculty_details(id) ON DELETE CASCADE,
    faculty_assignment_id UUID REFERENCES public.faculty_assignments(id) ON DELETE SET NULL,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY')),
    period_number INTEGER NOT NULL,
    room TEXT,
    status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint: Class+Section cannot have two published entries in the same period on the same day
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_published_class_slot
    ON public.timetable_entries (academic_year_id, class_id, section_id, day_of_week, period_number)
    WHERE (status = 'PUBLISHED');

-- Unique constraint: Faculty cannot be assigned to two published entries in the same period on the same day
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_published_faculty_slot
    ON public.timetable_entries (academic_year_id, faculty_id, day_of_week, period_number)
    WHERE (status = 'PUBLISHED');

CREATE INDEX IF NOT EXISTS idx_timetable_lookup ON public.timetable_entries(academic_year_id, class_id, section_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_timetable_faculty ON public.timetable_entries(academic_year_id, faculty_id, day_of_week);

-- 4. CONFLICT CHECK HELPER FUNCTION
CREATE OR REPLACE FUNCTION public.check_timetable_conflict(
    p_academic_year_id UUID,
    p_class_id UUID,
    p_section_id UUID,
    p_faculty_id UUID,
    p_day_of_week TEXT,
    p_period_number INTEGER,
    p_room TEXT DEFAULT NULL,
    p_exclude_entry_id UUID DEFAULT NULL
)
RETURNS TABLE (
    conflict_type TEXT,
    conflict_message TEXT,
    conflicting_entry_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    -- 1. Check Class Slot Conflict
    RETURN QUERY
    SELECT 
        'CLASS_CONFLICT'::TEXT,
        ('Class already has a subject scheduled in this slot (' || s.name || ')') ::TEXT,
        te.id
    FROM public.timetable_entries te
    JOIN public.subjects s ON te.subject_id = s.id
    WHERE te.academic_year_id = p_academic_year_id
      AND te.class_id = p_class_id
      AND te.section_id = p_section_id
      AND te.day_of_week = p_day_of_week
      AND te.period_number = p_period_number
      AND te.status = 'PUBLISHED'
      AND (p_exclude_entry_id IS NULL OR te.id <> p_exclude_entry_id)
    LIMIT 1;

    -- 2. Check Faculty Conflict
    RETURN QUERY
    SELECT 
        'FACULTY_CONFLICT'::TEXT,
        ('Faculty is already teaching class ' || c.name || '-' || sec.name || ' in this slot') ::TEXT,
        te.id
    FROM public.timetable_entries te
    JOIN public.classes c ON te.class_id = c.id
    JOIN public.sections sec ON te.section_id = sec.id
    WHERE te.academic_year_id = p_academic_year_id
      AND te.faculty_id = p_faculty_id
      AND te.day_of_week = p_day_of_week
      AND te.period_number = p_period_number
      AND te.status = 'PUBLISHED'
      AND (p_exclude_entry_id IS NULL OR te.id <> p_exclude_entry_id)
    LIMIT 1;

    -- 3. Check Room Conflict (if room is provided)
    IF p_room IS NOT NULL AND TRIM(p_room) <> '' THEN
        RETURN QUERY
        SELECT 
            'ROOM_CONFLICT'::TEXT,
            ('Room ' || p_room || ' is occupied by class ' || c.name || '-' || sec.name || ' in this slot') ::TEXT,
            te.id
        FROM public.timetable_entries te
        JOIN public.classes c ON te.class_id = c.id
        JOIN public.sections sec ON te.section_id = sec.id
        WHERE te.academic_year_id = p_academic_year_id
          AND LOWER(TRIM(te.room)) = LOWER(TRIM(p_room))
          AND te.day_of_week = p_day_of_week
          AND te.period_number = p_period_number
          AND te.status = 'PUBLISHED'
          AND (p_exclude_entry_id IS NULL OR te.id <> p_exclude_entry_id)
        LIMIT 1;
    END IF;
END;
$$;

-- 5. ROW LEVEL SECURITY POLICIES

-- Enable RLS
ALTER TABLE public.faculty_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;

-- Faculty Assignments Policies
DROP POLICY IF EXISTS "Admins manage faculty assignments" ON public.faculty_assignments;
CREATE POLICY "Admins manage faculty assignments" ON public.faculty_assignments
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users view faculty assignments" ON public.faculty_assignments;
CREATE POLICY "Authenticated users view faculty assignments" ON public.faculty_assignments
    FOR SELECT TO authenticated
    USING (true);

-- Timetable Periods Policies
DROP POLICY IF EXISTS "Admins manage timetable periods" ON public.timetable_periods;
CREATE POLICY "Admins manage timetable periods" ON public.timetable_periods
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users view timetable periods" ON public.timetable_periods;
CREATE POLICY "Authenticated users view timetable periods" ON public.timetable_periods
    FOR SELECT TO authenticated
    USING (true);

-- Timetable Entries Policies
DROP POLICY IF EXISTS "Admins manage timetable entries" ON public.timetable_entries;
CREATE POLICY "Admins manage timetable entries" ON public.timetable_entries
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users view published timetable entries" ON public.timetable_entries;
CREATE POLICY "Authenticated users view published timetable entries" ON public.timetable_entries
    FOR SELECT TO authenticated
    USING (
        status = 'PUBLISHED' 
        OR public.is_admin()
        OR (
            -- Faculty can view their own draft timetable
            EXISTS (
                SELECT 1 FROM public.faculty_details fd
                WHERE fd.id = timetable_entries.faculty_id
                  AND fd.user_id = auth.uid()
            )
        )
    );

-- 6. AUDIT TRIGGER FOR ALLOCATIONS & TIMETABLE
CREATE OR REPLACE TRIGGER tr_audit_faculty_assignments
    AFTER INSERT OR UPDATE OR DELETE ON public.faculty_assignments
    FOR EACH ROW EXECUTE FUNCTION public.audit_table_action();

CREATE OR REPLACE TRIGGER tr_audit_timetable_entries
    AFTER INSERT OR UPDATE OR DELETE ON public.timetable_entries
    FOR EACH ROW EXECUTE FUNCTION public.audit_table_action();

-- ============================================================================
-- KKDGMS — Database Functions, Triggers & Automation Routines
-- ============================================================================

-- 1. Auto-update `updated_at` Timestamp Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to appropriate tables
DO $$ 
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
          AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trigger_update_%I ON %I;
            CREATE TRIGGER trigger_update_%I
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', tbl, tbl, tbl, tbl);
    END LOOP;
END $$;

-- 2. Automatic Age Calculation from DOB
CREATE OR REPLACE FUNCTION calculate_age_from_dob(birth_date DATE)
RETURNS INT AS $$
BEGIN
    IF birth_date IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN DATE_PART('year', AGE(birth_date))::INT;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-set age on insert/update of students, faculty, wardens, admins
CREATE OR REPLACE FUNCTION auto_calculate_age_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.dob IS NOT NULL THEN
        NEW.age = calculate_age_from_dob(NEW.dob);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_student_age ON students;
CREATE TRIGGER trigger_student_age
BEFORE INSERT OR UPDATE OF dob ON students
FOR EACH ROW EXECUTE FUNCTION auto_calculate_age_trigger();

DROP TRIGGER IF EXISTS trigger_faculty_age ON faculty_details;
CREATE TRIGGER trigger_faculty_age
BEFORE INSERT OR UPDATE OF dob ON faculty_details
FOR EACH ROW EXECUTE FUNCTION auto_calculate_age_trigger();

-- 3. Automatic Master Audit Logger Trigger
CREATE OR REPLACE FUNCTION audit_table_change()
RETURNS TRIGGER AS $$
DECLARE
    entity_name TEXT := TG_TABLE_NAME;
    rec_id TEXT := '';
    user_id_val UUID := auth.uid();
BEGIN
    IF (TG_OP = 'DELETE') THEN
        rec_id := OLD.id::TEXT;
        INSERT INTO audit_logs (user_id, role, action, entity, entity_id, before_value)
        VALUES (user_id_val, auth.current_user_role()::TEXT, 'DELETE', entity_name, rec_id, to_jsonb(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        rec_id := NEW.id::TEXT;
        INSERT INTO audit_logs (user_id, role, action, entity, entity_id, before_value, after_value)
        VALUES (user_id_val, auth.current_user_role()::TEXT, 'UPDATE', entity_name, rec_id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        rec_id := NEW.id::TEXT;
        INSERT INTO audit_logs (user_id, role, action, entity, entity_id, after_value)
        VALUES (user_id_val, auth.current_user_role()::TEXT, 'CREATE', entity_name, rec_id, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit triggers to critical tables
DROP TRIGGER IF EXISTS audit_students ON students;
CREATE TRIGGER audit_students
AFTER INSERT OR UPDATE OR DELETE ON students
FOR EACH ROW EXECUTE FUNCTION audit_table_change();

DROP TRIGGER IF EXISTS audit_attendance ON student_attendance;
CREATE TRIGGER audit_attendance
AFTER INSERT OR UPDATE OR DELETE ON student_attendance
FOR EACH ROW EXECUTE FUNCTION audit_table_change();

DROP TRIGGER IF EXISTS audit_marks ON marks_entries;
CREATE TRIGGER audit_marks
AFTER INSERT OR UPDATE OR DELETE ON marks_entries
FOR EACH ROW EXECUTE FUNCTION audit_table_change();

DROP TRIGGER IF EXISTS audit_leaves ON student_leaves;
CREATE TRIGGER audit_leaves
AFTER INSERT OR UPDATE OR DELETE ON student_leaves
FOR EACH ROW EXECUTE FUNCTION audit_table_change();

-- 4. Attendance Percentage Calculation Function
CREATE OR REPLACE FUNCTION get_student_attendance_percentage(
    p_student_id UUID, 
    p_academic_year VARCHAR DEFAULT '2024-2025'
)
RETURNS NUMERIC AS $$
DECLARE
    v_present_days INT := 0;
    v_total_days INT := 0;
    v_holiday_count INT := 0;
    v_net_working_days INT := 0;
BEGIN
    -- Present days
    SELECT COUNT(*) INTO v_present_days
    FROM student_attendance
    WHERE student_id = p_student_id 
      AND academic_year = p_academic_year 
      AND status = 'PRESENT';

    -- Total recorded days
    SELECT COUNT(*) INTO v_total_days
    FROM student_attendance
    WHERE student_id = p_student_id 
      AND academic_year = p_academic_year;

    -- If no records, return 100 or 0
    IF v_total_days = 0 THEN
        RETURN 0.00;
    END IF;

    -- Exclude holidays that were recorded as holiday in attendance
    SELECT COUNT(*) INTO v_holiday_count
    FROM student_attendance
    WHERE student_id = p_student_id 
      AND academic_year = p_academic_year 
      AND status = 'HOLIDAY';

    v_net_working_days := v_total_days - v_holiday_count;

    IF v_net_working_days <= 0 THEN
        RETURN 100.00;
    END IF;

    RETURN ROUND((v_present_days::NUMERIC / v_net_working_days::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql STABLE;

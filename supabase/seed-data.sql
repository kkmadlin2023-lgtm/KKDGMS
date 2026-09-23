-- ============================================================================
-- KKDGMS — Seed Test Data (Clearly Labeled Sample Records)
-- ============================================================================

-- 1. Academic Year
INSERT INTO academic_years (year_name, start_date, end_date, is_current)
VALUES ('2024-2025', '2024-06-01', '2025-04-30', true)
ON CONFLICT (year_name) DO NOTHING;

-- 2. Holidays
INSERT INTO holidays (holiday_date, holiday_name, description, academic_year, is_working_day)
VALUES 
    ('2024-08-15', 'Independence Day', 'National Holiday', '2024-08-15', false),
    ('2024-10-02', 'Gandhi Jayanti', 'National Holiday', '2024-10-02', false),
    ('2024-10-31', 'Diwali Festival', 'State Festival', '2024-10-31', false),
    ('2025-01-14', 'Pongal Festival', 'Tamil Harvest Festival', '2025-01-14', false),
    ('2025-01-26', 'Republic Day', 'National Holiday', '2025-01-26', false)
ON CONFLICT (holiday_date) DO NOTHING;

-- 3. Default Role Permissions
INSERT INTO role_permissions (role, page_id, can_view, can_create, can_edit, can_delete, can_approve)
VALUES
    -- Admin has full access
    ('ADMIN', 'dashboard.view', true, true, true, true, true),
    ('ADMIN', 'students.manage', true, true, true, true, true),
    ('ADMIN', 'attendance.manage', true, true, true, true, true),
    ('ADMIN', 'marks.manage', true, true, true, true, true),
    ('ADMIN', 'leave.approve', true, true, true, true, true),
    ('ADMIN', 'database.manage', true, true, true, true, true),
    
    -- Faculty Permissions
    ('FACULTY', 'dashboard.view', true, false, false, false, false),
    ('FACULTY', 'attendance.edit', true, true, true, false, false),
    ('FACULTY', 'marks.edit', true, true, true, false, false),
    ('FACULTY', 'questionbank.edit', true, true, true, true, false),
    ('FACULTY', 'leave.view', true, true, false, false, false),
    
    -- Student Permissions
    ('STUDENT', 'dashboard.view', true, false, false, false, false),
    ('STUDENT', 'attendance.view', true, false, false, false, false),
    ('STUDENT', 'marks.view', true, false, false, false, false),
    ('STUDENT', 'questionbank.view', true, false, false, false, false),
    ('STUDENT', 'onlineexam.view', true, false, false, false, false),
    
    -- Warden Permissions
    ('WARDEN', 'dashboard.view', true, false, false, false, false),
    ('WARDEN', 'gate.manage', true, true, true, false, true),
    ('WARDEN', 'leave.approve', true, false, true, false, true),
    
    -- Technician Permissions
    ('TECHNICIAN', 'dashboard.view', true, false, false, false, false),
    ('TECHNICIAN', 'questionpaper.create', true, true, true, false, false),
    ('TECHNICIAN', 'documents.manage', true, true, true, true, false)
ON CONFLICT (role, page_id) DO NOTHING;

-- 4. Sample Faculty
INSERT INTO faculty_details (
    user_id, first_name, last_name, initial, full_name, dob, gender,
    email, mobile, degree, qualification, experience_years, department, designation
) VALUES 
    ('FAC001', 'Rajeshwari', 'Murugan', 'M', 'M. Rajeshwari', '1985-05-12', 'FEMALE', 'rajeshwari@kkdgms.edu.in', '9840123456', 'M.Sc., B.Ed.', 'Mathematics Post Graduate', 12, 'Mathematics', 'PG Assistant'),
    ('FAC002', 'Karthik', 'Soundar', 'S', 'S. Karthik', '1988-08-24', 'MALE', 'karthik@kkdgms.edu.in', '9840123457', 'M.Sc., M.Phil., B.Ed.', 'Physics Post Graduate', 9, 'Physics', 'PG Assistant'),
    ('FAC003', 'Anitha', 'Selvam', 'P', 'P. Anitha', '1990-11-03', 'FEMALE', 'anitha@kkdgms.edu.in', '9840123458', 'M.C.A., B.Ed.', 'Computer Science Specialist', 7, 'Computer Science', 'PG Assistant')
ON CONFLICT (email) DO NOTHING;

-- 5. Sample Admin
INSERT INTO admins (
    user_id, first_name, last_name, initial, full_name, dob, gender,
    email, mobile, designation
) VALUES 
    ('ADM001', 'Adlin', 'Geo', 'M', 'Madlin Adlin Geo', '1985-01-01', 'MALE', 'kkmadlin2023@gmail.com', '9443123456', 'Super Administrator & Principal')
ON CONFLICT (email) DO UPDATE SET user_id = 'ADM001', full_name = 'Madlin Adlin Geo';

-- 6. Sample Warden
INSERT INTO wardens (
    user_id, first_name, last_name, initial, full_name, dob, gender,
    email, mobile, qualification, degree, assigned_hostel
) VALUES 
    ('WAR001', 'Murugan', 'Thangavel', 'T', 'T. Murugan', '1982-06-18', 'MALE', 'warden.boys@kkdgms.edu.in', '9842123456', 'B.A.', 'Physical Education', 'Vivekananda Boys Hostel'),
    ('WAR002', 'Latha', 'Ramasamy', 'K', 'K. Latha', '1984-09-21', 'FEMALE', 'warden.girls@kkdgms.edu.in', '9842123457', 'B.Sc.', 'Home Science', 'Kanyakumari Girls Hostel')
ON CONFLICT (email) DO NOTHING;

-- 7. Sample Students
INSERT INTO students (
    emis_number, user_id, first_name, last_name, initial, full_name, dob, gender,
    aadhaar_number, email, mobile, student_class, section, student_group, academic_year,
    father_name, mother_name, parent_mobile, door_no, street, place, city, district, state, pincode,
    hostel_name, community, medium
) VALUES 
    ('EMIS202401', 'STU11A01', 'Dhanush', 'Kumar', 'A', 'A. Dhanush Kumar', '2008-03-14', 'MALE', '123456789012', 'dhanush.stu@kkdgms.edu.in', '9876543210', 11, 'A', 'MATHS COMPUTER SCIENCE', '2024-2025', 'Arumugam K', 'Meenakshi A', '9876543210', '12/4A', 'Beach Road', 'Kottar', 'Nagercoil', 'Kanyakumari', 'Tamil Nadu', '629002', 'Vivekananda Boys Hostel', 'BC', 'English'),
    ('EMIS202402', 'STU11A02', 'Kavitha', 'Rani', 'S', 'S. Kavitha Rani', '2008-07-22', 'FEMALE', '234567890123', 'kavitha.stu@kkdgms.edu.in', '9876543211', 11, 'A', 'MATHS COMPUTER SCIENCE', '2024-2025', 'Sundaram M', 'Vasanthi S', '9876543211', '45', 'Main Bazaar', 'Marthandam', 'Marthandam', 'Kanyakumari', 'Tamil Nadu', '629165', 'Kanyakumari Girls Hostel', 'MBC', 'English'),
    ('EMIS202403', 'STU12B01', 'Suresh', 'Babu', 'M', 'M. Suresh Babu', '2007-01-10', 'MALE', '345678901234', 'suresh.stu@kkdgms.edu.in', '9876543212', 12, 'B', 'BIO COMPUTER SCIENCE', '2024-2025', 'Murugesan P', 'Karpagam M', '9876543212', '8B', 'Temple Street', 'Suchindram', 'Suchindram', 'Kanyakumari', 'Tamil Nadu', '629704', 'Vivekananda Boys Hostel', 'SC', 'English')
ON CONFLICT (emis_number) DO NOTHING;

-- 8. Sample Notifications / Announcements
INSERT INTO notifications (title, message, target_role, priority, publish_date, status)
VALUES 
    ('Mid-Term Examination Schedule Announced', 'The Mid-Term examinations for Classes 9 to 12 will commence on October 15, 2024. Timetable is available on the student portal.', NULL, 'HIGH', NOW(), 'ACTIVE'),
    ('Parent-Teacher Council Meeting', 'Quarterly Parent-Teacher meeting will be held on Saturday, October 5th at the School Auditorium.', NULL, 'MEDIUM', NOW(), 'ACTIVE'),
    ('Science Exhibition Registration Open', 'District level inter-school science and innovation expo registration is open till October 20th.', NULL, 'LOW', NOW(), 'ACTIVE');

-- 9. Sample Events
INSERT INTO events (name, description, start_date, end_date, venue, status)
VALUES 
    ('Annual Sports Meet 2024', 'Inter-house athletics, track events, football, and volleyball championship finals.', NOW() + INTERVAL '7 days', NOW() + INTERVAL '9 days', 'School Main Ground', 'ACTIVE'),
    ('State Level Science Olympiad', 'Prestigious state-level Olympiad hosted at KKDGMS for model school students.', NOW() + INTERVAL '14 days', NOW() + INTERVAL '15 days', 'Main Auditorium & Labs', 'ACTIVE');

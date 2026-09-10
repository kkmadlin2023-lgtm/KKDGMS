-- ====================================================================
-- KKDGMS - SAMPLE SEED DATA INSERTION SCRIPT
-- Paste this directly into your Supabase SQL Editor to insert 1 sample
-- record into each table of the KKDGMS School Management System.
-- ====================================================================

-- 1. ADMINS
INSERT INTO public.admins (
    user_id, full_name, first_name, last_name, initial, email, 
    dob, age, gender, aadhaar, department, qualification, experience, 
    mobile, door_no, street_name, place, district, state, pincode, photo_url, role
) VALUES (
    'ADM001', 'Dr. S. Sundararajan, Ph.D.', 'Sundararajan', 'S', 'Dr', 'principal@kkdgms.edu.in',
    '1975-06-12', 49, 'Male', '458912345678', 'Principal & Administration', 'M.Sc., M.Ed., Ph.D.', '22 Years',
    '9443100001', '1/A', 'Model School Campus Road', 'Navalcadu', 'Kanyakumari', 'Tamil Nadu', '629002', '/icon.jpg', 'admin'
) ON CONFLICT (user_id) DO NOTHING;

-- 2. FACULTY DETAILS
INSERT INTO public.faculty_details (
    user_id, full_name, first_name, last_name, initial, email,
    dob, age, gender, aadhaar, department, designation, qualification, experience,
    mobile, door_no, street_name, place, district, state, pincode, blood_group,
    assigned_class, assigned_section, photo_url, role
) VALUES (
    'FAC001', 'Mrs. M. Rajeshwari, M.Sc., B.Ed.', 'Rajeshwari', 'M', 'M', 'rajeshwari.maths@kkdgms.edu.in',
    '1984-04-18', 40, 'Female', '789123456789', 'Mathematics', 'PGT Mathematics', 'M.Sc., M.Phil., B.Ed.', '12 Years',
    '9443100002', '14/3', 'North Car Street', 'Nagercoil', 'Kanyakumari', 'Tamil Nadu', '629001', 'O+',
    '12', 'A', '/teacher1.jpg', 'faculty'
) ON CONFLICT (user_id) DO NOTHING;

-- 3. WARDENS
INSERT INTO public.wardens (
    user_id, full_name, first_name, last_name, initial, email,
    dob, age, gender, aadhaar, mobile, hostel_name, hostel_gender,
    qualification, experience, door_no, street_name, place, district, photo_url, role
) VALUES (
    'WAR001', 'Mr. T. Murugan', 'Murugan', 'T', 'T', 'murugan.hostel@kkdgms.edu.in',
    '1986-09-24', 38, 'Male', '671234567890', '9443100006', 'Vivekananda Boys Hostel', 'Boys',
    'B.A., Physical Education', '7 Years', '5/22', 'Hostel Warden Quarters', 'Navalcadu', 'Kanyakumari', '/icon.jpg', 'warden'
) ON CONFLICT (user_id) DO NOTHING;

-- 4. TECHNICIANS
INSERT INTO public.technicians (
    user_id, full_name, first_name, last_name, initial, email,
    dob, age, gender, aadhaar, department, qualification, experience,
    mobile, photo_url, role
) VALUES (
    'TECH001', 'Mr. R. Vignesh, B.Tech', 'Vignesh', 'R', 'R', 'vignesh.tech@kkdgms.edu.in',
    '1995-11-03', 29, 'Male', '561234567890', 'Computer Systems & Exam Cell', 'B.Tech Information Technology', '5 Years',
    '9443100008', '/icon.jpg', 'technician'
) ON CONFLICT (user_id) DO NOTHING;

-- 5. GUESTS
INSERT INTO public.guests (
    user_id, full_name, email, organization, purpose, role
) VALUES (
    'GUEST01', 'District Inspection Officer', 'inspect.kk@tn.gov.in', 'Department of School Education, TN', 'Model School Annual Inspection', 'guest'
) ON CONFLICT (user_id) DO NOTHING;

-- 6. STUDENTS (Class 12 Section A, Resident Inmate)
INSERT INTO public.students (
    user_id, full_name, first_name, last_name, initial, dob, age, gender, aadhaar, email,
    student_class, section, medium, academic_year, student_group, assigned_faculty_id, assigned_faculty_name,
    father_name, father_occupation, mother_name, mother_occupation, mobile,
    door_no, street_name, place, city, district, state, pincode, blood_group,
    hostel_name, hostel_type, warden_name, photo_url, income_cert_no, community_cert_no, role
) VALUES (
    'EMIS202401', 'A. Dhanush Kumar', 'Dhanush', 'Kumar', 'A', '2007-05-14', 17, 'Male', '891234567890', 'dhanush.k@student.kkdgms.edu.in',
    '12', 'A', 'English', '2024-2025', 'Bio-Maths', 'FAC001', 'Mrs. M. Rajeshwari',
    'V. Arumugam', 'Agriculture', 'A. Meenakshi', 'Homemaker', '9443211111',
    '14/B', 'Mela Street', 'Navalcadu', 'Nagercoil', 'Kanyakumari', 'Tamil Nadu', '629002', 'O+',
    'Vivekananda Boys Hostel', 'Resident', 'Mr. T. Murugan', '/icon.jpg', 'INC-2024-88412', 'COMM-BC-44120', 'student'
) ON CONFLICT (user_id) DO NOTHING;

-- 7. STUDENT ATTENDANCE
INSERT INTO public.student_attendance (
    student_user_id, student_name, student_class, section, attendance_date, status, marked_by, remarks
) VALUES (
    'EMIS202401', 'A. Dhanush Kumar', '12', 'A', CURRENT_DATE, 'Present', 'Mrs. M. Rajeshwari', 'Regular attendance on time'
) ON CONFLICT DO NOTHING;

-- 8. HOLIDAYS
INSERT INTO public.holidays (
    date, title, is_declared, declared_by
) VALUES (
    '2024-10-31', 'Diwali Festival Holiday', true, 'Principal Office'
) ON CONFLICT (date) DO NOTHING;

-- 9. MARKS ENTRIES
INSERT INTO public.marks_entries (
    student_user_id, student_name, student_class, section, exam_name, subject,
    marks_obtained, max_marks, grade, status, faculty_id, remarks
) VALUES (
    'EMIS202401', 'A. Dhanush Kumar', '12', 'A', 'Quarterly Examination', 'Mathematics',
    96.00, 100.00, 'A1', 'published', 'FAC001', 'Distinction performance in Calculus'
);

-- 10. ONLINE EXAMS
INSERT INTO public.online_exams (
    exam_name, subject, student_class, section, total_marks, pass_marks,
    duration_minutes, exam_password, start_otp, start_otp_expires_at, end_otp,
    status, questions, assigned_faculty_id, assigned_faculty_name
) VALUES (
    'Chapter 7 Differential Calculus Class Test', 'Mathematics', '12', 'A', 20, 8,
    30, 'MATHS2024', '784219', 1726000000000, '932145', 'active',
    '[
        {"id": "q1", "question_text": "What is the derivative of sin(2x)?", "choices": [{"id": "c1", "text": "2 cos(2x)"}, {"id": "c2", "text": "cos(2x)"}, {"id": "c3", "text": "-2 cos(2x)"}, {"id": "c4", "text": "2 sin(2x)"}], "correct_answer_id": "c1", "marks": 5, "negative_marks": 0},
        {"id": "q2", "question_text": "If y = e^(3x), then dy/dx is:", "choices": [{"id": "c1", "text": "e^(3x)"}, {"id": "c2", "text": "3 e^(3x)"}, {"id": "c3", "text": "3x e^(3x)"}, {"id": "c4", "text": "3 e^(2x)"}], "correct_answer_id": "c2", "marks": 5, "negative_marks": 0}
    ]'::jsonb,
    'FAC001', 'Mrs. M. Rajeshwari'
);

-- 11. ONLINE EXAM ATTEMPTS
INSERT INTO public.online_exam_attempts (
    student_id, student_name, student_user_id, student_class, section,
    answers, score, total_marks, percentage, is_passed, status, student_feedback
) VALUES (
    's-001', 'A. Dhanush Kumar', 'EMIS202401', '12', 'A',
    '{"q1": "c1", "q2": "c2"}'::jsonb, 10.00, 10, 100.00, true, 'submitted', 'Clear conceptual test.'
);

-- 12. STUDENT LEAVES (With WhatsApp Parent Approval Link token)
INSERT INTO public.student_leaves (
    applicant_type, applicant_id, applicant_name, student_class, section,
    leave_type, from_date, to_date, from_time, to_time, reason, parent_phone,
    approval_token, parent_approval, faculty_approval, warden_approval, admin_approval, status
) VALUES (
    'student', 'EMIS202401', 'A. Dhanush Kumar', '12', 'A',
    'Hostel Outpass', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '4 days',
    '05:00 PM', '06:00 PM', 'Family temple festival in native village.', '9443211111',
    'tok-leave-89412', 'Approved', 'Approved', 'Approved', 'Approved', 'Admin Approved'
);

-- 13. GATE MOVEMENTS (Hostel In / Out)
INSERT INTO public.gate_movements (
    student_id, student_name, student_user_id, student_class, section,
    hostel_name, gate_out_time, gate_in_time, warden_out_id, warden_in_id, reason, status
) VALUES (
    's-001', 'A. Dhanush Kumar', 'EMIS202401', '12', 'A',
    'Vivekananda Boys Hostel', '05:30 PM', NULL, 'WAR001', NULL, 'Weekend leave outpass to hometown', 'Outside'
);

-- 14. QUESTION BANK
INSERT INTO public.question_bank (
    title, subject, student_class, unit_chapter, question_type,
    question_text, answer_text, marks, difficulty, status, submitted_by
) VALUES (
    'Lens Makers Formula Derivation', 'Physics', '12', 'Unit 6 - Ray Optics', 'Long Answer',
    'Derive the Lens Maker formula for a thin biconvex lens with proper ray diagram and sign convention.',
    '1/f = (n - 1) * (1/R1 - 1/R2). Detailed optical path refraction proof.', 5, 'Medium', 'published', 'Mr. K. Anand'
);

-- 15. CLASSROOMS
INSERT INTO public.classrooms (
    room_name, block, floor, no_of_rows, benches_per_row, students_per_bench
) VALUES (
    'Hall 101', 'Academic Wing A', 'Ground Floor', 6, 5, 2
) ON CONFLICT (room_name) DO NOTHING;

-- 16. EXAM ALLOCATIONS
INSERT INTO public.exam_allocations (
    exam_name, student_class, session_date, slot, allocated_students
) VALUES (
    'Quarterly Examination 2024', '12', CURRENT_DATE + INTERVAL '10 days', 'Forenoon (09:30 AM - 12:30 PM)',
    '[{"bench_no": 1, "seat_pos": "Left", "student_id": "s-001", "student_name": "A. Dhanush Kumar", "student_class": "12", "section": "A"}]'::jsonb
);

-- 17. FACULTY ASSIGNMENTS
INSERT INTO public.faculty_assign (
    faculty_id, faculty_name, subject, student_class, section, academic_year, periods_per_week
) VALUES (
    'FAC001', 'Mrs. M. Rajeshwari', 'Mathematics', '12', 'A', '2024-2025', 7
);

-- 18. 24-HOUR STORIES
INSERT INTO public.stories (
    media_url, media_type, caption, duration_seconds, created_by_role, created_by_name, is_active
) VALUES (
    '/kanyakumari.jpg', 'image', 'Morning assembly & physical exercise drill at Navalcadu Model Campus.', 15, 'admin', 'Principal Office', true
);

-- 19. SCHOOL EVENTS
INSERT INTO public.events (
    title, description, image_url, event_date, start_time, end_time, location, status, created_by
) VALUES (
    'Annual Inter-School Science Congress 2024', 'State-level model exhibition, science quiz, and robotics demonstration.',
    '/kanyakumari.jpg', CURRENT_DATE + INTERVAL '15 days', '09:00 AM', '04:30 PM', 'Main Auditorium & STEM Lab', 'upcoming', 'Administration'
);

-- 20. FEEDBACK
INSERT INTO public.feedback (
    user_id, user_name, role, category, message, rating, status, replies
) VALUES (
    'EMIS202401', 'A. Dhanush Kumar', 'student', 'Academics',
    'The online exam practice portal with 10s OTP and instant answers review is very helpful for our Board preparation.', 5, 'Reviewed',
    '[{"id": "rep-1", "reply_text": "Thank you Dhanush. Keep practicing with the question bank.", "replied_by": "Principal Office", "replied_at": "2024-09-10T10:30:00Z"}]'::jsonb
);

-- 21. EXPENSES
INSERT INTO public.expenses (
    expense_name, category, amount, expense_date, description, added_by, status
) VALUES (
    'Physics Optics & Laser Kits Calibration', 'Lab & Equipment', 12500.00, CURRENT_DATE - INTERVAL '3 days',
    'Precision calibration and optical benches maintenance for Standard 12 science lab.', 'Technician Desk', 'Paid'
);

-- 22. NOTIFICATIONS (Circulars)
INSERT INTO public.notifications (
    title, message, target_role, target_class, priority, created_by
) VALUES (
    'Quarterly Examination Schedule 2024-25 Published',
    'The quarterly examination timetable for standards 9 through 12 is available on the ERP portal. Boarding students outpass guidelines apply.',
    'all', 'All', 'urgent', 'Controller of Examinations'
);

-- 23. NOTIFICATION TOKENS (FCM Web Push)
INSERT INTO public.notification_tokens (
    user_id, auth_id, token, device, is_active
) VALUES (
    'EMIS202401', 'auth-usr-88912', 'fcm-sample-token-web-push-kkdgms-89124', 'Desktop Chrome Browser', true
) ON CONFLICT (token) DO NOTHING;

-- 24. VISITORS
INSERT INTO public.visitors (
    visitor_name, pass_number, contact_number, relation, student_id, student_name, student_class,
    purpose, status, qr_code_token, approved_by
) VALUES (
    'V. Arumugam', 'PASS-2024-104', '9443211111', 'Father', 'EMIS202401', 'A. Dhanush Kumar', '12-A',
    'Submitted medical certificate and met warden for weekend outpass verification.', 'Active', 'vqr-8841920', 'Main Campus Gate Security'
) ON CONFLICT (pass_number) DO NOTHING;

-- 25. LOGIN AUDIT LOGS
INSERT INTO public.login_audit_logs (
    user_id, email, role, action, ip_address, user_agent, status
) VALUES (
    'ADM001', 'principal@kkdgms.edu.in', 'admin', 'Admin logged in and synchronized quarterly exam marksheets.', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'SUCCESS'
);

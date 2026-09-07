# KKDGMS - Kanya Kumari District Government Model School Management System

A unified, modern School Management System built with **React 19**, **Vite**, **Tailwind CSS**, and **Supabase (PostgreSQL 15)** with Row-Level Security (RLS).

---

## Key Features

1. **Role-Based Workspaces (4 Distinct Portals)**:
   - **Super Admin / Principal**: Central command center, admission desk, master student & faculty directories, syllabus, seating allocations, bonafide approvals, and audit center.
   - **Faculty Staff**: Class roster, period-by-period daily attendance, mark entry ledger, question bank creator, and leave management.
   - **Student Portal**: Academic profile, digital ID card, progress report card, question bank practice, and hostel outpass generator.
   - **Hostel Warden**: Inmate occupancy tracker, outpass approvals, daily dorm roll call, and parent visitor gate passes.

2. **Complete PostgreSQL Schema (`supabase_schema.sql`)**:
   - 14 relational tables:
     - `admins`, `faculty_details`, `wardens`, `students`
     - `student_attendance`, `marks_entries`, `student_leaves`
     - `question_bank`, `exam_seating`, `faculty_assignments`
     - `bonafide_requests`, `visitor_passes`, `notifications`, `audit_logs`
   - Row-Level Security (RLS) enabled across all tables.
   - Auto-updating `updated_at` triggers and foreign key cascades.
   - Pre-seeded initial records for instant testing.

3. **Security Management**:
   - Parameterized SQL via the Supabase client (zero raw string injection).
   - Tamper-evident authentication audit trails.
   - Masked PII (Aadhaar/Identity numbers).
   - Client session token invalidation.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## Supabase Database Setup

1. Open your [Supabase Project Dashboard](https://supabase.com).
2. Navigate to **SQL Editor** -> **+ New Query**.
3. Paste the contents of `supabase_schema.sql` and click **Run**.
4. Set your environment variables in `.env` or project settings:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

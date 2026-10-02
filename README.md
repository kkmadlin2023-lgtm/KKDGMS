# KKDGMS CORE — Kanyakumari Dist Government Model School

Modern, robust, and secure School Management ERP for **Kanyakumari Dist Government Model School (KKDGMS)**.

---

## 🌟 Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router 6
- **Backend & Database**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS), Supabase Storage
- **Deployment**: Vercel ready with client-side SPA routing

---

## 📋 Completed Phases

- **Phase 1 (Complete)**: Foundation + Authentication + Global UI + RLS Security Architecture
- **Phase 2 (Complete)**: Profiles + Roles + User Management + Account Control
- *Phase 3 (Pending)*: Academic Structure + Student & Faculty Management
- *Phases 4-22*: Subsequent modular milestones

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (Tested on Node.js v24)
- npm or yarn

### 2. Installation
```bash
# Clone repository
git clone https://github.com/kkmadlin2023-lgtm/KKDGMS.git
cd KKDGMS

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your public Supabase client credentials:
```env
VITE_SUPABASE_URL=https://kymsjrxjfmloibcbages.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=KKDGMS CORE
VITE_SCHOOL_NAME=KANYAKUMARI DIST GOVERNMENT MODEL SCHOOL
VITE_SCHOOL_SHORT_NAME=KKDGMS
```

> [!IMPORTANT]
> **Zero Service-Role Key Exposure**: NEVER put `SUPABASE_SERVICE_ROLE_KEY` or any administrative secrets into frontend `.env` or client source code.

---

## 🗄️ Database Migrations (Supabase)

Execute the migrations in your [Supabase SQL Editor](https://supabase.com/dashboard/project/kymsjrxjfmloibcbages/sql) in chronological order:

1. **`supabase/migrations/001_foundation_profiles.sql`**:
   - `profiles` table with role check constraint (`SUPER_ADMIN`, `ADMIN`, `FACULTY`, `STUDENT`, `WARDEN`, `TECHNICIAN`, `GUEST`).
   - `audit_logs` foundation table.
   - Row Level Security (RLS) policies for least-privilege data protection.
   - Triggers for automatic `updated_at`, new user profile creation (`handle_new_user`), and role escalation prevention (`prevent_role_escalation`).

2. **`supabase/migrations/002_user_management.sql`**:
   - Extended `profiles` with `phone`, `status` (`ACTIVE`, `INACTIVE`, `SUSPENDED`), `suspension_reason`, `last_login_at`.
   - `roles` and `permissions` / `role_permissions` foundation tables.
   - Secure RPC functions: `admin_update_user_role` and `admin_update_user_status` with strict hierarchy and `SUPER_ADMIN` safeguards.
   - Supabase Storage setup & RLS policies for `avatars` bucket.

---

## 🛠️ Development & Build Commands

```bash
# Start local development server
npm run dev

# TypeScript check & Production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🔐 Security Standards & Role Control

- **Role Escalation Protection**: Verified at both RLS and PostgreSQL RPC levels. Normal users cannot modify their own or others' roles or statuses.
- **Super Admin Protection**: Non-superadmins cannot assign `SUPER_ADMIN` or demote/deactivate the last active Super Administrator.
- **Storage Protection**: Authenticated users can upload only their own avatar image (validated MIME type & size <= 2MB).
- **Password Safety**: Supabase Auth securely manages passwords. No plaintext passwords stored.
- **Audit Trails**: Sensitive role and account status changes are automatically recorded in `audit_logs`.

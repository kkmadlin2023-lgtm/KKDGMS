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
- *Phase 2 (Pending)*: Profiles + Roles + User Management
- *Phases 3-22*: Subsequent modular milestones

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

## 🗄️ Database Setup (Supabase)

Execute the migrations in your [Supabase SQL Editor](https://supabase.com/dashboard/project/kymsjrxjfmloibcbages/sql) in chronological order:

1. **`supabase/migrations/001_foundation_profiles.sql`**:
   - `profiles` table with role check constraint (`SUPER_ADMIN`, `ADMIN`, `FACULTY`, `STUDENT`, `WARDEN`, `TECHNICIAN`, `GUEST`).
   - `audit_logs` foundation table.
   - Row Level Security (RLS) policies for least-privilege data protection.
   - Triggers for automatic `updated_at`, new user profile creation (`handle_new_user`), and role escalation prevention (`prevent_role_escalation`).

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

## 🔐 Security Standards

- **Row Level Security (RLS)**: Every table is protected with granular PostgreSQL policies.
- **Client Route Protection**: `ProtectedRoute` component ensures only authenticated and permitted roles access specific paths.
- **Role Escalation Protection**: PostgreSQL trigger rejects any client attempt to modify user roles or active statuses.
- **Password Safety**: Supabase Auth securely manages passwords. No plaintext passwords stored.
- **Google OAuth**: Official Supabase OAuth integration.

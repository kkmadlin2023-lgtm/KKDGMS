# KANYAKUMARI DIST GOVERNMENT MODEL SCHOOL (KKDGMS)
### Complete School Management System & Web Portal

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Firebase](https://img.shields.io/badge/Push%20Notifications-Firebase%20FCM-FFCA28?logo=firebase)](https://firebase.google.com)
[![TailwindCSS](https://img.shields.io/badge/CSS-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

A comprehensive, production-ready, mobile-first School Management System and Progressive Web App (PWA) tailored for **Kanyakumari Dist Government Model School (KKDGMS)**.

---

## 🏛 Architecture Overview

KKDGMS is engineered with a clean, modular multi-page vanilla ES6 architecture with centralized services, reusable DOM components, and strict Zero-Trust database security:

- **Public Portal (`index.html`)**: Viewable by everyone without authentication. Features real-time dynamic stats, school announcements, events calendar, stories, faculty directory, and Kanyakumari branding with Tamil inscription.
- **Authentication (`login.html`)**: Multi-role login with 3-attempt brute-force protection (5-minute countdown lockout), Google Workspace OAuth, and automatic role-based routing.
- **Admin Management Suite (`admin/`)**: 20+ comprehensive dashboards and consoles for admissions, students, faculty allocations, attendance analytics, marksheet verification, bonafide generator, visitors QR pass, audit trail, and database management.
- **Faculty Portal (`faculty/`)**: Attendance marking with bulk options and offline draft auto-save, question bank creator, online exam scheduler with 10-second start OTPs, timetable, and student leave workflows.
- **Student Portal (`student/`)**: EMIS progress cards, monthly attendance calendar, question bank study vault, online examination hall with real-time timers and auto-save, and leave applications.
- **Warden Portal (`warden/`)**: Hostel resident management, camera-based QR code gate terminal for instant student Gate-Out and Gate-In movement tracking.
- **Technician & Guest Portals (`technician/`, `guest/`)**: Question paper builder with official school header, master timetable, and restricted guest previews.
- **Parent Outpass Approval (`public/parent-approval.html`)**: Token-secured parent approval portal integrated with SMS/WhatsApp outpass links.

---

## 📂 Project Structure

```
KKDGMS/
├── index.html                    # Public homepage (accessible to all)
├── login.html                    # Unified login portal (3-attempt lockout)
├── manifest.json                 # PWA manifest
├── sw.js                         # Service worker (offline cache & background sync)
├── .env.example                  # Environment configuration template
│
├── admin/                        # Super Admin & Headmaster Suite (20+ pages)
│   ├── dashboard.html            # School-wide metrics & Chart.js analytics
│   ├── admissions.html           # 5-in-1 tabbed admission forms
│   ├── students.html             # Student roster & CSV/PDF exporter
│   ├── faculty.html              # Teaching staff directory
│   ├── wardens.html              # Hostel supervision staff
│   ├── technicians.html          # IT & lab assistants
│   ├── attendance.html           # Attendance analytics (holiday-adjusted formula)
│   ├── leave.html                # Multi-tier leave approvals
│   ├── question-bank.html        # Question bank curation
│   ├── marksheet.html            # Marksheet matrix & verification
│   ├── online-exams.html         # Online exams monitor
│   ├── database.html             # Controlled entity manager
│   ├── login-activity.html       # Session audit & brute-force monitor
│   ├── faculty-allocation.html   # Subject & class teacher allocations
│   ├── bonafide.html             # Dynamic Bonafide Certificate Generator
│   ├── visitors.html             # Visitor registration & QR pass
│   ├── announcements.html        # Notice broadcaster
│   ├── events.html               # School events calendar
│   ├── stories.html              # 24-hour campus stories
│   ├── role-permissions.html     # Visual RBAC matrix
│   ├── feedback.html             # Feedback review & replies
│   ├── notifications.html        # Push notification center
│   ├── timetable.html            # Master timetable planner
│   ├── documents.html            # Document repository
│   ├── expenses.html             # Expense tracker & accounting
│   ├── audit-logs.html           # Immutable system audit trail
│   └── settings.html             # Academic year & calendar settings
│
├── faculty/                      # Faculty & Teacher Portal
│   ├── dashboard.html, attendance.html, marksheet.html, online-exams.html...
│
├── student/                      # Student Learning Portal
│   ├── dashboard.html, attendance.html, marksheet.html, online-exams.html...
│
├── warden/                       # Hostel & Gate Pass Terminal
│   ├── dashboard.html, gate-management.html, hostel-students.html...
│
├── technician/                   # Tech & Question Paper Builder
│   ├── dashboard.html, question-paper.html, documents.html, timetable.html...
│
├── guest/                        # Restricted Guest Portal
│   └── dashboard.html
│
├── public/                       # Public & Worker Assets
│   ├── parent-approval.html      # Secure parent outpass token portal
│   └── firebase-messaging-sw.js  # FCM background push service worker
│
├── js/
│   ├── config.js                 # Centralized configuration (anon key only)
│   ├── app.js                    # App startup, system theme & PWA sync
│   ├── services/                 # 11 Modular ES6 Singleton Services
│   │   ├── supabase.service.js   # Supabase client singleton
│   │   ├── auth.service.js       # Auth, role detection, lockout logic
│   │   ├── permission.service.js # Centralized RBAC guard
│   │   ├── notification.service.js # In-app alerts
│   │   ├── fcm.service.js        # Firebase Cloud Messaging
│   │   ├── audit.service.js      # Audit log recording
│   │   ├── storage.service.js    # Bucket uploads & photo compression
│   │   ├── realtime.service.js   # Supabase Realtime channels
│   │   ├── offline.service.js    # IndexedDB drafts & sync queue
│   │   ├── validation.service.js # Aadhaar, Mobile, Age & Form checks
│   │   └── ui.service.js         # Toasts, dialogs & skeleton loaders
│   └── utils/
│       ├── date.utils.js         # Date formatting & age calculation
│       ├── export.utils.js       # PDF & CSV generation
│       └── qr.utils.js           # QR code generation & scanning
│
├── components/                   # Reusable UI Components (Vanilla JS)
│   ├── sidebar.js, navbar.js, profile-menu.js, notification-panel.js
│   ├── data-table.js, modal.js, chart.js, file-upload.js, story-viewer.js
│
├── supabase/                     # Database Definition & Security
│   ├── schema.sql                # 35 Normalized tables with constraints & indexes
│   ├── rls-policies.sql          # Zero-Trust Row Level Security policies
│   ├── functions.sql             # Triggers, auto-timestamps & audit functions
│   └── seed-data.sql             # Test accounts and records
│
└── assets/                       # Static Assets & Styling
    ├── css/theme.css             # Unified CSS custom properties & design tokens
    └── images/                   # High-resolution branding & Kanyakumari imagery
```

---

## 🔒 Security Architecture

1. **Zero-Trust RLS**: Every database table is protected by granular Row Level Security in PostgreSQL. Students can only access their own grades and records, faculty can only access their assigned classes, and wardens can only access authorized hostel movements.
2. **No Exposed Service Keys**: Frontend scripts only utilize the public Supabase `anon` key. Administrative password overwrites and server operations are strictly routed through server-side Supabase Edge Functions.
3. **Brute-Force Defense**: Automatic 3-failed-attempts security lockout enforces a 5-minute cooldown with live timer synchronization.
4. **Audit Trail**: Every significant administrative and operational modification (create, edit, delete, approve, gate in/out) is automatically written to `audit_logs` via database triggers.

---

## 🚀 Setup & Deployment

1. **Database Setup**:
   - Open your Supabase Project Dashboard.
   - Go to the **SQL Editor**.
   - Execute `supabase/schema.sql`, then `supabase/rls-policies.sql`, followed by `supabase/functions.sql` and `supabase/seed-data.sql`.

2. **Frontend Deployment**:
   - Deploy directly to **Vercel**, **Netlify**, or **GitHub Pages** — no build step or node server required.
   - Set environment configuration in `js/config.js` or deployment environment variables.

---

&copy; 2023–Present Kanyakumari Dist Government Model School. All Rights Reserved.

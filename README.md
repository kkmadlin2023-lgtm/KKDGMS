# KKDGMS CORE

**Kanyakumari District Government Model School - Complete School Management System**

A production-ready, comprehensive school management platform built with modern web technologies and Supabase backend.

## 🏫 Project Overview

KKDGMS CORE is a full-featured school management system designed for Kanyakumari District Government Model School. It provides role-based access control, academic management, attendance tracking, examination systems, and much more.

### 🌐 Public Website
- **Production URL**: https://kkdgms.vercel.app
- **Repository**: https://github.com/kkmadlin2023-lgtm/KKDGMS

## ✨ Features

### Phase 1 (Current)
- ✅ React + TypeScript + Vite architecture
- ✅ Tailwind CSS professional design system
- ✅ Supabase authentication with OAuth
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with React Router
- ✅ Super Admin dashboard
- ✅ Database schema with migrations
- ✅ Row Level Security (RLS) policies
- ✅ Google OAuth integration structure

### Planned Features (Subsequent Phases)
- 📋 Student registry with photo management
- 👨‍🏫 Faculty management and assignments
- 📊 Attendance tracking system
- 📝 Leave management workflow
- 🎓 Examination platform with OTP
- 📈 Results and marksheet generation
- 🏠 Hostel and gate management
- 👤 Visitor management system
- 🔧 Technician portal and asset tracking
- 📢 Announcements and notifications
- 📄 Certificate generation (Bonafide, ID cards)
- 📊 Reports and data exports
- 🔔 WhatsApp integration for parents
- 📱 Mobile-responsive design

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icons
- **jsPDF** - PDF generation
- **QRCode** - QR code generation

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Authentication (Email/Password, OAuth)
  - Row Level Security (RLS)
  - Storage (File uploads)
  - Realtime (Live updates)
  - Edge Functions (Server-side logic)

### Development Tools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🏗️ Project Structure

```
KKDGMS/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── layouts/         # Layout components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services and state management
│   ├── lib/             # External library configurations
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── features/        # Feature-based modules
│       ├── auth/        # Authentication feature
│       ├── admin/       # Admin feature
│       ├── super-admin/ # Super Admin feature
│       ├── students/    # Student management
│       ├── faculty/     # Faculty management
│       ├── attendance/  # Attendance system
│       ├── leave/       # Leave management
│       ├── examinations/# Examination system
│       ├── results/     # Results and marksheets
│       ├── hostel/      # Hostel management
│       ├── gate/        # Gate management
│       ├── visitors/    # Visitor management
│       ├── technician/  # Technician portal
│       ├── announcements/# Announcements
│       ├── notifications/# Notifications
│       ├── certificates/# Certificate generation
│       └── reports/     # Reports and exports
├── supabase/
│   ├── migrations/      # Database migration files
│   └── functions/       # Supabase Edge Functions
├── public/              # Static assets
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase project (free tier works)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kkmadlin2023-lgtm/KKDGMS.git
   cd KKDGMS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up Supabase database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration files in order:
     - `supabase/migrations/001_initial_schema.sql`
     - `supabase/migrations/002_rls_policies.sql`

5. **Configure Google OAuth**
   - In Supabase dashboard, go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL to: `https://your-domain.com/auth/callback`

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Security Architecture

### Authentication
- Supabase Auth with Email/Password and Google OAuth
- JWT-based session management
- Automatic token refresh
- Secure password handling

### Authorization
- Role-Based Access Control (RBAC)
- Row Level Security (RLS) policies
- Database-enforced permissions
- No frontend-only security checks

### Roles
- **SUPER_ADMIN** - Full system control
- **ADMIN** - School administration
- **FACULTY** - Teaching operations
- **STUDENT** - Personal academic operations
- **WARDEN** - Hostel and gate operations
- **TECHNICIAN** - Technical support
- **GUEST** - Limited access

### Security Best Practices
- Environment variables for secrets
- No service-role keys in frontend
- Secure file upload policies
- Audit logging for sensitive operations
- Input validation on both client and server

## 📊 Database Schema

### Core Tables
- `profiles` - User profiles and roles
- `students` - Student records
- `faculty` - Faculty records
- `admins` - Administrator records
- `wardens` - Warden records
- `technicians` - Technician records

### Academic Tables
- `academic_years` - Academic year management
- `classes` - Class definitions
- `sections` - Section definitions
- `subjects` - Subject definitions

### Security Tables
- RLS policies on all tables
- Helper functions for role checks
- Audit logging capabilities

## 🎨 Design System

### Color Palette
- **Brand Primary**: Indigo (#4F46E5)
- **Brand Secondary**: Amber (#F59E0B)
- **Semantic Colors**: Success, Warning, Error, Info

### Typography
- **Font Family**: Inter
- **Scale**: Responsive text sizes

### Components
- Pre-built card, button, input, badge components
- Consistent spacing and borders
- Responsive breakpoints
- Accessible color contrasts

## 📱 Responsive Design

- **Mobile**: < 768px - Touch-optimized
- **Tablet**: 768px - 1024px - Balanced layout
- **Desktop**: > 1024px - Full-featured with sidebar

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Consistent naming conventions
- Component-based architecture

## 🚢 Deployment

### Vercel Deployment

1. **Connect GitHub repository**
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy
4. **Configure Supabase redirect URLs** to match Vercel domain

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-supabase-anon-key
```

## 📝 Phase Development Plan

### ✅ Phase 1 (Complete)
- Project architecture
- Supabase connection
- Authentication system
- Google OAuth structure
- Profiles and roles
- Protected routes
- Super Admin dashboard
- Database migrations
- RLS policies

### 🔄 Phase 2 (Next)
- Student registry
- Student photos
- Student documents
- Faculty registry
- Faculty assignments

### 📋 Phase 3-9
- Attendance system
- Leave management
- Examination platform
- Hostel management
- Visitor management
- Technician portal
- Announcements
- Certificate generation
- Reports and exports

## 🤝 Contributing

This is a proprietary school management system. For modifications and extensions, please contact the administration.

## 📞 Support

For support and inquiries:

- **Email**: kkmadlin2023@gmail.com
- **Phone**: +91 8015188967
- **YouTube**: https://www.youtube.com/@kanniyagms
- **Instagram**: https://www.instagram.com/_.kkdgms._

## 📄 License

© 2025 Kanyakumari District Government Model School. All rights reserved.

## ⚠️ Important Notes

- Never commit `.env` files or secrets to the repository
- Always use RLS policies for data security
- Test thoroughly before deploying to production
- Keep dependencies updated for security
- Follow the phase-based development approach
- Document any database schema changes in migrations

## 🎯 Goals

- Provide a complete, production-ready school management system
- Ensure security and data privacy
- Maintain clean, maintainable code
- Follow modern web development best practices
- Deliver excellent user experience across all devices

---

**Built with ❤️ for Kanyakumari District Government Model School**

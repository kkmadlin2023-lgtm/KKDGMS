# KKDGMS - Kanyakumari District Government Model School

A comprehensive school management system with role-based access control, featuring professional UI/UX design and seamless Supabase integration.

## 🎨 Professional Theme System

The KKDGMS platform now features a unified, enterprise-grade design system for consistent user experience across all pages.

### Theme Structure

```
assets/
├── css/
│   └── theme.css          # Professional design system
├── js/
│   └── supabase-config.js # Centralized configuration & utilities
templates/
├── dashboard-template.html # Standard dashboard layout
└── landing-template.html  # Standard landing page layout
```

### Design System Features

- **Color Palette**: Professional indigo/amber brand colors with semantic status colors
- **Typography**: Plus Jakarta Sans for modern, readable typography
- **Components**: Pre-built cards, buttons, inputs, badges, and status indicators
- **Glassmorphism**: Beautiful backdrop blur effects for modern aesthetics
- **Responsive**: Mobile-first design with breakpoint utilities
- **Accessibility**: High contrast ratios and keyboard navigation support

## 🔧 Database Configuration

### Supabase Integration

All database connections are centralized in `assets/js/supabase-config.js`:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://kymsjrxjfmloibcbages.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

### Database Tables

The system uses the following standardized table names:

- `admins` - Administrator accounts and profiles
- `students` - Student records and academic information
- `faculty_details` - Faculty profiles and assignments
- `wardens` - Warden/hostel management accounts
- `student_attendance` - Daily attendance records
- `student_leaves` - Leave applications and approvals
- `marks_entries` - Exam marks and academic performance
- `faculty_assign` - Faculty-class assignments
- `login_audit_logs` - Authentication and security logs
- `news` - School announcements and updates
- `visitor_logs` - Visitor tracking and management

### Storage Buckets

- `student-photos` - Student profile pictures
- `documents` - Official documents and certificates

## 🚀 Getting Started

### Prerequisites

- Supabase project with required tables
- Web server for hosting (Vercel, Netlify, etc.)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kkmadlin2023-lgtm/KKDGMS.git
   cd KKDGMS
   ```

2. **Configure Supabase**
   - Update `assets/js/supabase-config.js` with your credentials
   - Ensure all required tables exist in your Supabase project

3. **Deploy**
   - Upload to your hosting platform
   - Configure environment variables if needed

### File Structure

```
KKDGMS/
├── assets/
│   ├── css/
│   │   └── theme.css
│   └── js/
│       └── supabase-config.js
├── templates/
│   ├── dashboard-template.html
│   └── landing-template.html
├── a_*.html               # Admin pages
├── f_*.html               # Faculty pages
├── s_*.html               # Student pages
├── w_*.html               # Warden pages
├── index.html             # Landing page
├── login.html             # Authentication
├── redirect.html          # OAuth handler
└── supabase/              # Supabase functions
```

## 🎯 Usage Guide

### Using the Theme System

Include the theme CSS in your HTML:

```html
<link rel="stylesheet" href="assets/css/theme.css">
```

Use pre-defined utility classes:

```html
<!-- Cards -->
<div class="card card-interactive">
    <h3 class="text-lg font-bold">Card Title</h3>
</div>

<!-- Buttons -->
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-outline">Secondary</button>

<!-- Inputs -->
<input class="input" type="text" placeholder="Enter text">

<!-- Badges -->
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
```

### Database Operations

Use the centralized DatabaseManager:

```javascript
// Fetch data
const students = await DatabaseManager.fetch(TABLES.STUDENTS, {
    filters: { student_class: '10' },
    orderBy: { column: 'full_name', ascending: true }
});

// Insert records
await DatabaseManager.insert(TABLES.STUDENTS, [studentData]);

// Update records
await DatabaseManager.update(TABLES.STUDENTS, 
    { phone: '1234567890' }, 
    { id: 123 }
);

// Delete records
await DatabaseManager.delete(TABLES.STUDENTS, { id: 123 });
```

### Authentication

Use the AuthManager for user management:

```javascript
// Get current session
const session = await AuthManager.getCurrentSession();

// Get user role
const roleInfo = await AuthManager.getUserRole(email);

// Logout
await AuthManager.logout();
```

### UI Utilities

Use UIUtils for common UI operations:

```javascript
// Show toast notification
UIUtils.showToast('Operation successful', 'success');

// Show loading state
UIUtils.showLoading(element, 'Loading data...');

// Format dates
const formatted = UIUtils.formatDate(date, 'short');
```

## 🔐 Security Features

- **Role-Based Access Control**: Separate dashboards for Admin, Faculty, Students, and Wardens
- **Audit Logging**: Comprehensive login tracking and activity monitoring
- **Session Management**: Secure authentication with automatic session handling
- **Input Validation**: Client-side validation for all form inputs
- **Error Handling**: Centralized error management and user feedback

## 📱 Responsive Design

The platform is fully responsive with optimized layouts for:

- **Mobile** (< 768px): Touch-optimized interface
- **Tablet** (768px - 1024px): Balanced layout for moderate screens
- **Desktop** (> 1024px): Full-featured interface with side navigation

## 🛠️ Customization

### Theme Colors

Modify `assets/css/theme.css` to customize colors:

```css
:root {
    --brand-primary: #4F46E5;
    --brand-secondary: #F59E0B;
    /* ... other color variables */
}
```

### Database Configuration

Update `assets/js/supabase-config.js` for different environments:

```javascript
const SUPABASE_CONFIG = {
    url: process.env.SUPABASE_URL || 'your-url',
    anonKey: process.env.SUPABASE_ANON_KEY || 'your-key'
};
```

## 📞 Support

For support and inquiries:

- **Email**: kkmadlin2023@gmail.com
- **Phone**: +91 8015188967
- **YouTube**: https://www.youtube.com/@kanniyagms
- **Instagram**: https://www.instagram.com/_.kkdgms._

## 📄 License

© 2025 Kanyakumari District Government Model School. All rights reserved.

## 🤝 Contributing

This is a proprietary school management system. For modifications and extensions, please contact the administration.

---

**Built with professional enterprise standards for educational excellence.**
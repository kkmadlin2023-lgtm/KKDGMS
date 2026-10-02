import { NavigationItem, UserRole } from '@/types';

export const NAVIGATION_CONFIG: NavigationItem[] = [
  // Overview
  {
    id: 'dashboard',
    label: 'Dashboard',
    iconName: 'LayoutDashboard',
    path: '/app',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FACULTY', 'STUDENT', 'WARDEN', 'TECHNICIAN', 'GUEST'],
    section: 'Overview',
  },
  {
    id: 'profile',
    label: 'My Profile',
    iconName: 'User',
    path: '/app/profile',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FACULTY', 'STUDENT', 'WARDEN', 'TECHNICIAN', 'GUEST'],
    section: 'Account',
  },

  // Administration (Phases 1-4 Active)
  {
    id: 'admin_academics',
    label: 'Academic Structure',
    iconName: 'GraduationCap',
    path: '/app/admin/academics',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    section: 'Administration',
  },
  {
    id: 'admin_students',
    label: 'Students Directory',
    iconName: 'BookMarked',
    path: '/app/admin/students',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    section: 'Administration',
  },
  {
    id: 'admin_faculty',
    label: 'Faculty Directory',
    iconName: 'BookOpen',
    path: '/app/admin/faculty',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    section: 'Administration',
  },
  {
    id: 'admin_faculty_assignments',
    label: 'Faculty Allocation',
    iconName: 'Layers',
    path: '/app/admin/faculty-assignments',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    section: 'Administration',
  },
  {
    id: 'admin_timetable',
    label: 'Timetable Setup',
    iconName: 'Calendar',
    path: '/app/admin/timetable',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    section: 'Administration',
  },
  {
    id: 'admin_users',
    label: 'User Management',
    iconName: 'Users',
    path: '/app/admin/users',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    section: 'Administration',
  },

  // Faculty Section
  {
    id: 'faculty_timetable',
    label: 'My Timetable',
    iconName: 'Clock',
    path: '/app/faculty/timetable',
    allowedRoles: ['FACULTY'],
    section: 'Teaching Schedule',
  },

  // Student Section
  {
    id: 'student_timetable',
    label: 'Class Timetable',
    iconName: 'Calendar',
    path: '/app/student/timetable',
    allowedRoles: ['STUDENT'],
    section: 'Academic Routine',
  },

  // Future Phase Registry Placeholders
  {
    id: 'warden_hostel',
    label: 'Hostel Inmates',
    iconName: 'Building2',
    path: '/app/warden/hostel',
    allowedRoles: ['WARDEN', 'SUPER_ADMIN', 'ADMIN'],
    badge: 'Phase 10',
    section: 'Hostel',
  },
  {
    id: 'technician_tasks',
    label: 'Technical Services',
    iconName: 'Wrench',
    path: '/app/technician/tasks',
    allowedRoles: ['TECHNICIAN', 'SUPER_ADMIN', 'ADMIN'],
    badge: 'Phase 17',
    section: 'Services',
  },
];

export function getPermittedNavItems(role: UserRole): NavigationItem[] {
  return NAVIGATION_CONFIG.filter((item) => item.allowedRoles.includes(role));
}

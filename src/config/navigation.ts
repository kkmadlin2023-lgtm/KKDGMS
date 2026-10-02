import { NavigationItem, UserRole } from '@/types';

export const NAVIGATION_CONFIG: NavigationItem[] = [
  // Common / Core
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

  // Future Phase Registry Placeholders (ready for Phase 2+)
  {
    id: 'admin_users',
    label: 'User Management',
    iconName: 'Users',
    path: '/app/admin/users',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    badge: 'Phase 2',
    section: 'Administration',
  },
  {
    id: 'academic',
    label: 'Academic Management',
    iconName: 'GraduationCap',
    path: '/app/admin/academic',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    badge: 'Phase 3',
    section: 'Administration',
  },
  {
    id: 'faculty_classes',
    label: 'My Classes',
    iconName: 'BookOpen',
    path: '/app/faculty/classes',
    allowedRoles: ['FACULTY'],
    badge: 'Phase 3',
    section: 'Academic',
  },
  {
    id: 'student_academics',
    label: 'My Academics',
    iconName: 'BookMarked',
    path: '/app/student/academics',
    allowedRoles: ['STUDENT'],
    badge: 'Phase 3',
    section: 'Academic',
  },
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

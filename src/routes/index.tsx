import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardPage } from '@/pages/app/DashboardPage';
import { ProfilePage } from '@/pages/app/ProfilePage';
import { UnauthorizedPage } from '@/pages/app/UnauthorizedPage';
import { NotFoundPage } from '@/pages/errors/NotFoundPage';
import { UserManagementPage } from '@/pages/admin/UserManagementPage';
import { AcademicsPage } from '@/pages/admin/AcademicsPage';
import { StudentsPage } from '@/pages/admin/StudentsPage';
import { FacultyPage } from '@/pages/admin/FacultyPage';
import { FacultyAssignmentsPage } from '@/pages/admin/FacultyAssignmentsPage';
import { TimetablePage } from '@/pages/admin/TimetablePage';
import { FacultyTimetablePage } from '@/pages/faculty/FacultyTimetablePage';
import { StudentTimetablePage } from '@/pages/student/StudentTimetablePage';

export const router = createBrowserRouter([
  // Public Auth Routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },

  // Protected App Shell Routes
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'unauthorized',
        element: <UnauthorizedPage />,
      },
      // Admin Routes (Role Protected)
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
            <UserManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/academics',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
            <AcademicsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/students',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
            <StudentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/faculty',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
            <FacultyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/faculty-assignments',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
            <FacultyAssignmentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/timetable',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
            <TimetablePage />
          </ProtectedRoute>
        ),
      },
      // Faculty Routes
      {
        path: 'faculty/timetable',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'FACULTY']}>
            <FacultyTimetablePage />
          </ProtectedRoute>
        ),
      },
      // Student Routes
      {
        path: 'student/timetable',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'STUDENT']}>
            <StudentTimetablePage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Root redirect to /app
  {
    path: '/',
    element: <Navigate to="/app" replace />,
  },

  // 404 Catch-All
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

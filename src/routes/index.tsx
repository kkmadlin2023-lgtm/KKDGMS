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
      // Admin User Management Route (Phase 2)
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
            <UserManagementPage />
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

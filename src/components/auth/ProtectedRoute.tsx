import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Verifying session & permissions..." />;
  }

  // Not authenticated -> Redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Inactive profile check
  if (profile && !profile.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 shadow-xl text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Account Deactivated</h2>
          <p className="text-sm text-slate-500 mb-6">
            Your account ({profile.email}) is currently deactivated. Please contact the administrator.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-300 transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Role authorization check
  if (allowedRoles && allowedRoles.length > 0) {
    // SUPER_ADMIN has access to everything
    const hasPermission = role === 'SUPER_ADMIN' || allowedRoles.includes(role);

    if (!hasPermission) {
      return <Navigate to="/app/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

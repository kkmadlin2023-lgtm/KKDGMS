import { User, Session } from '@supabase/supabase-js';

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'FACULTY'
  | 'STUDENT'
  | 'WARDEN'
  | 'TECHNICIAN'
  | 'GUEST';

export interface UserProfile {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  iconName: string;
  path: string;
  allowedRoles: UserRole[];
  badge?: string;
  section?: string;
}

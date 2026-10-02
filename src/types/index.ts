import { User, Session } from '@supabase/supabase-js';

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'FACULTY'
  | 'STUDENT'
  | 'WARDEN'
  | 'TECHNICIAN'
  | 'GUEST';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface UserProfile {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  suspension_reason?: string | null;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface RoleDefinition {
  code: UserRole;
  name: string;
  description?: string;
  hierarchy_level: number;
  is_active: boolean;
}

export interface Permission {
  code: string;
  name: string;
  module: string;
  description?: string;
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

export interface UserFilterParams {
  search?: string;
  role?: UserRole | 'ALL';
  status?: UserStatus | 'ALL';
  sortBy?: 'full_name' | 'email' | 'created_at' | 'last_login_at' | 'role' | 'status';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id?: string | null;
  details?: Record<string, unknown>;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

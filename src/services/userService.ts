import { supabase } from '@/lib/supabase';
import { UserProfile, UserRole, UserStatus, UserFilterParams, PaginatedResponse, RoleDefinition, AuditLogEntry } from '@/types';

export const userService = {
  /**
   * Fetch paginated and filtered list of user profiles from database.
   */
  async getUsers(params: UserFilterParams): Promise<PaginatedResponse<UserProfile>> {
    const { page, pageSize, search, role, status, sortBy = 'created_at', sortOrder = 'desc' } = params;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    // Apply Role Filter
    if (role && role !== 'ALL') {
      query = query.eq('role', role);
    }

    // Apply Status Filter
    if (status && status !== 'ALL') {
      query = query.eq('status', status);
    }

    // Apply Search Filter (Name, Email, Phone, or User ID)
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`full_name.ilike.${term},email.ilike.${term},phone.ilike.${term},user_id.ilike.${term}`);
    }

    // Apply Sorting & Pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      data: (data || []) as UserProfile[],
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Fetch single user profile by ID.
   */
  async getUserById(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }

    return data as UserProfile | null;
  },

  /**
   * Update a user's role via secure RPC.
   */
  async updateUserRole(targetUserId: string, newRole: UserRole): Promise<{ success: boolean; message?: string }> {
    const { data, error } = await supabase.rpc('admin_update_user_role', {
      target_user_id: targetUserId,
      new_role: newRole,
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: (data as { message?: string })?.message || 'Role updated successfully',
    };
  },

  /**
   * Update a user's account status (ACTIVE, INACTIVE, SUSPENDED) via secure RPC.
   */
  async updateUserStatus(targetUserId: string, newStatus: UserStatus, reason?: string): Promise<{ success: boolean; message?: string }> {
    const { data, error } = await supabase.rpc('admin_update_user_status', {
      target_user_id: targetUserId,
      new_status: newStatus,
      reason: reason || null,
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: (data as { message?: string })?.message || 'Status updated successfully',
    };
  },

  /**
   * Fetch system roles definition.
   */
  async getRoles(): Promise<RoleDefinition[]> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('hierarchy_level', { ascending: false });

    if (error) {
      console.warn('Could not fetch roles from table, returning defaults:', error);
      return [
        { code: 'SUPER_ADMIN', name: 'Super Administrator', hierarchy_level: 100, is_active: true },
        { code: 'ADMIN', name: 'School Administrator', hierarchy_level: 80, is_active: true },
        { code: 'FACULTY', name: 'Teaching Faculty', hierarchy_level: 50, is_active: true },
        { code: 'WARDEN', name: 'Hostel Warden', hierarchy_level: 40, is_active: true },
        { code: 'TECHNICIAN', name: 'Technical Staff', hierarchy_level: 30, is_active: true },
        { code: 'STUDENT', name: 'Student', hierarchy_level: 20, is_active: true },
        { code: 'GUEST', name: 'Guest Account', hierarchy_level: 10, is_active: true },
      ];
    }

    return (data || []) as RoleDefinition[];
  },

  /**
   * Fetch audit history for a user.
   */
  async getAuditLogsForUser(userId: string): Promise<AuditLogEntry[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .or(`entity_id.eq.${userId},user_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.warn('Error fetching audit logs:', error);
      return [];
    }

    return (data || []) as AuditLogEntry[];
  },
};

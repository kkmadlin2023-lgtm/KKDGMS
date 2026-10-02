import { supabase } from '@/lib/supabase';
import { FacultyMember, FacultyStatus, PaginatedResponse } from '@/types';

export interface FacultyFilterParams {
  page: number;
  pageSize: number;
  search?: string;
  department?: string | 'ALL';
  status?: FacultyStatus | 'ALL';
}

export const facultyService = {
  /**
   * Fetch paginated list of faculty members.
   */
  async getFaculty(params: FacultyFilterParams): Promise<PaginatedResponse<FacultyMember>> {
    const { page, pageSize, search, department, status } = params;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('faculty_details')
      .select('*', { count: 'exact' });

    // Status Filter
    if (status && status !== 'ALL') {
      query = query.eq('status', status);
    }

    // Department Filter
    if (department && department !== 'ALL') {
      query = query.eq('department', department);
    }

    // Search
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`full_name.ilike.${term},employee_id.ilike.${term},email.ilike.${term},department.ilike.${term}`);
    }

    // Sorting & Pagination
    query = query
      .order('full_name', { ascending: true })
      .range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching faculty details:', error);
      throw error;
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      data: (data || []) as FacultyMember[],
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Fetch single faculty member by ID.
   */
  async getFacultyById(id: string): Promise<FacultyMember | null> {
    const { data, error } = await supabase
      .from('faculty_details')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching faculty member:', error);
      throw error;
    }

    return data as FacultyMember | null;
  },

  /**
   * Create new faculty record.
   */
  async createFaculty(data: Omit<FacultyMember, 'id' | 'created_at' | 'updated_at'>): Promise<FacultyMember> {
    const { data: created, error } = await supabase
      .from('faculty_details')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created as FacultyMember;
  },

  /**
   * Update faculty details.
   */
  async updateFaculty(id: string, updates: Partial<FacultyMember>): Promise<FacultyMember> {
    const { data, error } = await supabase
      .from('faculty_details')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as FacultyMember;
  },

  /**
   * Upload faculty photo.
   */
  async uploadFacultyPhoto(file: File, facultyId: string): Promise<string> {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${facultyId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('faculty-photos')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('faculty-photos').getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Fetch single faculty member by User ID (auth.users id).
   */
  async getFacultyByUserId(userId: string): Promise<FacultyMember | null> {
    const { data, error } = await supabase
      .from('faculty_details')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching faculty by user_id:', error);
      return null;
    }

    return data as FacultyMember | null;
  },
};

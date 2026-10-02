import { supabase } from '@/lib/supabase';
import { Student, StudentEnrollment, PaginatedResponse, StudentStatus } from '@/types';

export interface StudentFilterParams {
  page: number;
  pageSize: number;
  search?: string;
  academicYearId?: string | 'ALL';
  classId?: string | 'ALL';
  sectionId?: string | 'ALL';
  status?: StudentStatus | 'ALL';
}

export const studentService = {
  /**
   * Fetch paginated list of students with active enrollment details.
   */
  async getStudents(params: StudentFilterParams): Promise<PaginatedResponse<Student>> {
    const { page, pageSize, search, academicYearId, classId, sectionId, status } = params;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('students')
      .select(`
        *,
        student_enrollments (
          id,
          academic_year_id,
          class_id,
          section_id,
          roll_number,
          status,
          academic_year:academic_years(id, name, is_current),
          class:classes(id, name, numeric_order),
          section:sections(id, name)
        )
      `, { count: 'exact' });

    // Status Filter
    if (status && status !== 'ALL') {
      query = query.eq('status', status);
    }

    // Search
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`full_name.ilike.${term},admission_number.ilike.${term},email.ilike.${term},mobile.ilike.${term},father_name.ilike.${term}`);
    }

    // Sorting & Pagination
    query = query
      .order('full_name', { ascending: true })
      .range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }

    // Attach current active enrollment to each student
    const studentList: Student[] = (data || []).map((s: Record<string, unknown>) => {
      const enrollments = (s.student_enrollments as StudentEnrollment[]) || [];
      const currentEnrollment = enrollments.find(e => e.academic_year?.is_current) || enrollments[0];
      return {
        ...(s as unknown as Student),
        current_enrollment: currentEnrollment,
      };
    });

    // In-memory filter for class/section/year if specified
    let filteredList = studentList;
    if (academicYearId && academicYearId !== 'ALL') {
      filteredList = filteredList.filter(s => s.current_enrollment?.academic_year_id === academicYearId);
    }
    if (classId && classId !== 'ALL') {
      filteredList = filteredList.filter(s => s.current_enrollment?.class_id === classId);
    }
    if (sectionId && sectionId !== 'ALL') {
      filteredList = filteredList.filter(s => s.current_enrollment?.section_id === sectionId);
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      data: filteredList,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Fetch single student by ID with all enrollments history.
   */
  async getStudentById(id: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        student_enrollments (
          id,
          academic_year_id,
          class_id,
          section_id,
          roll_number,
          status,
          created_at,
          academic_year:academic_years(id, name, is_current),
          class:classes(id, name),
          section:sections(id, name)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching student by ID:', error);
      throw error;
    }

    if (!data) return null;

    const enrollments = (data.student_enrollments as StudentEnrollment[]) || [];
    const currentEnrollment = enrollments.find(e => e.academic_year?.is_current) || enrollments[0];

    return {
      ...(data as unknown as Student),
      current_enrollment: currentEnrollment,
    };
  },

  /**
   * Create student and initial enrollment.
   */
  async createStudent(
    studentData: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'current_enrollment'>,
    enrollmentData: { academic_year_id: string; class_id: string; section_id: string; roll_number?: string }
  ): Promise<Student> {
    // 1. Insert Student
    const { data: createdStudent, error: studentError } = await supabase
      .from('students')
      .insert(studentData)
      .select()
      .single();

    if (studentError) throw studentError;

    // 2. Insert Enrollment
    if (enrollmentData.academic_year_id && enrollmentData.class_id && enrollmentData.section_id) {
      const { error: enrollmentError } = await supabase
        .from('student_enrollments')
        .insert({
          student_id: createdStudent.id,
          academic_year_id: enrollmentData.academic_year_id,
          class_id: enrollmentData.class_id,
          section_id: enrollmentData.section_id,
          roll_number: enrollmentData.roll_number || null,
          status: 'ACTIVE',
        });

      if (enrollmentError) {
        console.warn('Enrollment insert warning:', enrollmentError);
      }
    }

    return createdStudent as Student;
  },

  /**
   * Update student details.
   */
  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Student;
  },

  /**
   * Upload student photo to Supabase Storage.
   */
  async uploadStudentPhoto(file: File, studentId: string): Promise<string> {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${studentId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('student-photos')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('student-photos').getPublicUrl(filePath);
    return data.publicUrl;
  },
};

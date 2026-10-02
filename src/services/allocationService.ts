import { supabase } from '@/lib/supabase';
import { FacultyAssignment, FacultyAssignmentStatus, FacultyWorkload, FacultyMember } from '@/types';

export const allocationService = {
  /**
   * Fetch faculty assignments with related academic info and faculty details
   */
  async getFacultyAssignments(filters?: {
    academicYearId?: string;
    facultyId?: string;
    classId?: string;
    sectionId?: string;
    subjectId?: string;
    status?: FacultyAssignmentStatus | 'ALL';
  }): Promise<FacultyAssignment[]> {
    let query = supabase
      .from('faculty_assignments')
      .select(`
        *,
        academic_year:academic_years(*),
        faculty:faculty_details(*),
        class:classes(*),
        section:sections(*),
        subject:subjects(*)
      `)
      .order('created_at', { ascending: false });

    if (filters?.academicYearId) {
      query = query.eq('academic_year_id', filters.academicYearId);
    }
    if (filters?.facultyId) {
      query = query.eq('faculty_id', filters.facultyId);
    }
    if (filters?.classId) {
      query = query.eq('class_id', filters.classId);
    }
    if (filters?.sectionId) {
      query = query.eq('section_id', filters.sectionId);
    }
    if (filters?.subjectId) {
      query = query.eq('subject_id', filters.subjectId);
    }
    if (filters?.status && filters.status !== 'ALL') {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching faculty assignments:', error);
      throw new Error(error.message);
    }

    return (data || []) as FacultyAssignment[];
  },

  /**
   * Check if a subject in a specific class-section already has an active assigned teacher
   */
  async checkSubjectTeacherExists(
    academicYearId: string,
    classId: string,
    sectionId: string,
    subjectId: string,
    excludeId?: string
  ): Promise<FacultyAssignment | null> {
    let query = supabase
      .from('faculty_assignments')
      .select('*, faculty:faculty_details(full_name, employee_id)')
      .eq('academic_year_id', academicYearId)
      .eq('class_id', classId)
      .eq('section_id', sectionId)
      .eq('subject_id', subjectId)
      .eq('status', 'ACTIVE');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error('Error checking existing subject teacher:', error);
      return null;
    }

    return data as FacultyAssignment | null;
  },

  /**
   * Check if a class-section already has an active class teacher
   */
  async checkClassTeacherExists(
    academicYearId: string,
    classId: string,
    sectionId: string,
    excludeId?: string
  ): Promise<FacultyAssignment | null> {
    let query = supabase
      .from('faculty_assignments')
      .select('*, faculty:faculty_details(full_name, employee_id)')
      .eq('academic_year_id', academicYearId)
      .eq('class_id', classId)
      .eq('section_id', sectionId)
      .eq('is_class_teacher', true)
      .eq('status', 'ACTIVE');

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error('Error checking existing class teacher:', error);
      return null;
    }

    return data as FacultyAssignment | null;
  },

  /**
   * Create a new faculty assignment
   */
  async createFacultyAssignment(assignment: {
    academic_year_id: string;
    faculty_id: string;
    class_id: string;
    section_id: string;
    subject_id: string;
    is_class_teacher?: boolean;
    status?: FacultyAssignmentStatus;
  }): Promise<FacultyAssignment> {
    // 1. Check duplicate active subject teacher
    const existingSubjectAssignment = await this.checkSubjectTeacherExists(
      assignment.academic_year_id,
      assignment.class_id,
      assignment.section_id,
      assignment.subject_id
    );

    if (existingSubjectAssignment) {
      const facultyName = (existingSubjectAssignment.faculty as any)?.full_name || 'Another faculty';
      throw new Error(`This subject is already assigned to ${facultyName} in this class/section.`);
    }

    // 2. Check duplicate class teacher if is_class_teacher is true
    if (assignment.is_class_teacher) {
      const existingClassTeacher = await this.checkClassTeacherExists(
        assignment.academic_year_id,
        assignment.class_id,
        assignment.section_id
      );

      if (existingClassTeacher) {
        const facultyName = (existingClassTeacher.faculty as any)?.full_name || 'Another faculty';
        throw new Error(`This class/section already has ${facultyName} assigned as the Class Teacher.`);
      }
    }

    const { data, error } = await supabase
      .from('faculty_assignments')
      .insert({
        academic_year_id: assignment.academic_year_id,
        faculty_id: assignment.faculty_id,
        class_id: assignment.class_id,
        section_id: assignment.section_id,
        subject_id: assignment.subject_id,
        is_class_teacher: !!assignment.is_class_teacher,
        status: assignment.status || 'ACTIVE',
      })
      .select(`
        *,
        academic_year:academic_years(*),
        faculty:faculty_details(*),
        class:classes(*),
        section:sections(*),
        subject:subjects(*)
      `)
      .single();

    if (error) {
      console.error('Error creating faculty assignment:', error);
      throw new Error(error.message);
    }

    return data as FacultyAssignment;
  },

  /**
   * Update an existing assignment
   */
  async updateFacultyAssignment(
    id: string,
    updates: Partial<FacultyAssignment>
  ): Promise<FacultyAssignment> {
    const { data, error } = await supabase
      .from('faculty_assignments')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        academic_year:academic_years(*),
        faculty:faculty_details(*),
        class:classes(*),
        section:sections(*),
        subject:subjects(*)
      `)
      .single();

    if (error) {
      console.error('Error updating faculty assignment:', error);
      throw new Error(error.message);
    }

    return data as FacultyAssignment;
  },

  /**
   * Delete an assignment
   */
  async deleteFacultyAssignment(id: string): Promise<void> {
    const { error } = await supabase.from('faculty_assignments').delete().eq('id', id);
    if (error) {
      console.error('Error deleting faculty assignment:', error);
      throw new Error(error.message);
    }
  },

  /**
   * Calculate faculty workload for a given academic year
   */
  async getFacultyWorkload(academicYearId: string): Promise<FacultyWorkload[]> {
    // 1. Fetch all active faculty
    const { data: facultyList, error: facultyError } = await supabase
      .from('faculty_details')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('full_name');

    if (facultyError) throw new Error(facultyError.message);

    // 2. Fetch all active assignments for the year
    const assignments = await this.getFacultyAssignments({
      academicYearId,
      status: 'ACTIVE',
    });

    // 3. Fetch all timetable entries for the year
    const { data: timetableEntries, error: ttError } = await supabase
      .from('timetable_entries')
      .select('faculty_id, period_number, day_of_week')
      .eq('academic_year_id', academicYearId)
      .eq('status', 'PUBLISHED');

    if (ttError) throw new Error(ttError.message);

    return (facultyList || []).map((f: FacultyMember) => {
      const fAssignments = assignments.filter((a) => a.faculty_id === f.id);
      const fTimetable = (timetableEntries || []).filter((t: any) => t.faculty_id === f.id);

      const subjects = Array.from(new Set(fAssignments.map((a) => a.subject?.name).filter(Boolean))) as string[];
      const classes = Array.from(
        new Set(fAssignments.map((a) => `${a.class?.name}-${a.section?.name}`).filter(Boolean))
      ) as string[];

      const classTeacherAssignment = fAssignments.find((a) => a.is_class_teacher);
      const isClassTeacherOf = classTeacherAssignment
        ? `${classTeacherAssignment.class?.name}-${classTeacherAssignment.section?.name}`
        : null;

      return {
        faculty: f,
        totalAssignments: fAssignments.length,
        totalPeriodsPerWeek: fTimetable.length,
        subjectsTaught: subjects,
        classesTaught: classes,
        isClassTeacherOf,
      };
    });
  },
};

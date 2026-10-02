import { supabase } from '@/lib/supabase';
import { AcademicYear, SchoolClass, SchoolSection, ClassSection, Subject, ClassSubject } from '@/types';

export const academicService = {
  // --- Academic Years ---
  async getAcademicYears(): Promise<AcademicYear[]> {
    const { data, error } = await supabase
      .from('academic_years')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching academic years:', error);
      throw error;
    }
    return (data || []) as AcademicYear[];
  },

  async getCurrentAcademicYear(): Promise<AcademicYear | null> {
    const { data, error } = await supabase
      .from('academic_years')
      .select('*')
      .eq('is_current', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching current academic year:', error);
      return null;
    }
    return data as AcademicYear | null;
  },

  async createAcademicYear(data: Omit<AcademicYear, 'id' | 'created_at' | 'updated_at'>): Promise<AcademicYear> {
    const { data: created, error } = await supabase
      .from('academic_years')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created as AcademicYear;
  },

  async setCurrentAcademicYear(id: string): Promise<void> {
    const { error } = await supabase
      .from('academic_years')
      .update({ is_current: true })
      .eq('id', id);

    if (error) throw error;
  },

  // --- Classes ---
  async getClasses(): Promise<SchoolClass[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('numeric_order', { ascending: true });

    if (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
    return (data || []) as SchoolClass[];
  },

  async createClass(name: string, numeric_order: number): Promise<SchoolClass> {
    const { data, error } = await supabase
      .from('classes')
      .insert({ name, numeric_order, is_active: true })
      .select()
      .single();

    if (error) throw error;
    return data as SchoolClass;
  },

  // --- Sections ---
  async getSections(): Promise<SchoolSection[]> {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching sections:', error);
      throw error;
    }
    return (data || []) as SchoolSection[];
  },

  async createSection(name: string): Promise<SchoolSection> {
    const { data, error } = await supabase
      .from('sections')
      .insert({ name: name.toUpperCase(), is_active: true })
      .select()
      .single();

    if (error) throw error;
    return data as SchoolSection;
  },

  // --- Class Sections Mapping ---
  async getClassSections(): Promise<ClassSection[]> {
    const { data, error } = await supabase
      .from('class_sections')
      .select('*, class:classes(*), section:sections(*)')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching class sections:', error);
      throw error;
    }
    return (data || []) as ClassSection[];
  },

  async assignSectionToClass(class_id: string, section_id: string): Promise<ClassSection> {
    const { data, error } = await supabase
      .from('class_sections')
      .insert({ class_id, section_id, is_active: true })
      .select('*, class:classes(*), section:sections(*)')
      .single();

    if (error) throw error;
    return data as ClassSection;
  },

  // --- Subjects ---
  async getSubjects(): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
    return (data || []) as Subject[];
  },

  async createSubject(data: Omit<Subject, 'id' | 'created_at' | 'updated_at'>): Promise<Subject> {
    const { data: created, error } = await supabase
      .from('subjects')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created as Subject;
  },

  // --- Class Subjects Mapping ---
  async getClassSubjects(class_id?: string): Promise<ClassSubject[]> {
    let query = supabase
      .from('class_subjects')
      .select('*, subject:subjects(*), class:classes(*)');

    if (class_id) {
      query = query.eq('class_id', class_id);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching class subjects:', error);
      throw error;
    }
    return (data || []) as ClassSubject[];
  },

  async assignSubjectToClass(class_id: string, subject_id: string, academic_year_id?: string | null): Promise<ClassSubject> {
    const { data, error } = await supabase
      .from('class_subjects')
      .insert({ class_id, subject_id, academic_year_id: academic_year_id || null, is_active: true })
      .select('*, subject:subjects(*), class:classes(*)')
      .single();

    if (error) throw error;
    return data as ClassSubject;
  },
};

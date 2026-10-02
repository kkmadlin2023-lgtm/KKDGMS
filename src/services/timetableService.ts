import { supabase } from '@/lib/supabase';
import {
  TimetablePeriod,
  TimetableEntry,
  TimetableConflict,
  DayOfWeek,
  TimetableStatus,
} from '@/types';

export const timetableService = {
  /**
   * Fetch all configured timetable periods
   */
  async getPeriods(): Promise<TimetablePeriod[]> {
    const { data, error } = await supabase
      .from('timetable_periods')
      .select('*')
      .order('period_number', { ascending: true });

    if (error) {
      console.error('Error fetching timetable periods:', error);
      throw new Error(error.message);
    }

    return (data || []) as TimetablePeriod[];
  },

  /**
   * Save or update a period
   */
  async upsertPeriod(period: Partial<TimetablePeriod>): Promise<TimetablePeriod> {
    const { data, error } = await supabase
      .from('timetable_periods')
      .upsert({
        ...period,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting timetable period:', error);
      throw new Error(error.message);
    }

    return data as TimetablePeriod;
  },

  /**
   * Delete a period
   */
  async deletePeriod(id: string): Promise<void> {
    const { error } = await supabase.from('timetable_periods').delete().eq('id', id);
    if (error) {
      console.error('Error deleting timetable period:', error);
      throw new Error(error.message);
    }
  },

  /**
   * Fetch timetable entries with related details
   */
  async getTimetableEntries(filters: {
    academicYearId: string;
    classId?: string;
    sectionId?: string;
    facultyId?: string;
    dayOfWeek?: DayOfWeek;
    status?: TimetableStatus | 'ALL';
  }): Promise<TimetableEntry[]> {
    let query = supabase
      .from('timetable_entries')
      .select(`
        *,
        academic_year:academic_years(*),
        class:classes(*),
        section:sections(*),
        subject:subjects(*),
        faculty:faculty_details(*)
      `)
      .eq('academic_year_id', filters.academicYearId);

    if (filters.classId) {
      query = query.eq('class_id', filters.classId);
    }
    if (filters.sectionId) {
      query = query.eq('section_id', filters.sectionId);
    }
    if (filters.facultyId) {
      query = query.eq('faculty_id', filters.facultyId);
    }
    if (filters.dayOfWeek) {
      query = query.eq('day_of_week', filters.dayOfWeek);
    }
    if (filters.status && filters.status !== 'ALL') {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('period_number', { ascending: true });

    if (error) {
      console.error('Error fetching timetable entries:', error);
      throw new Error(error.message);
    }

    return (data || []) as TimetableEntry[];
  },

  /**
   * Check for conflicts before inserting or updating a slot
   */
  async validateSlotConflict(params: {
    academicYearId: string;
    classId: string;
    sectionId: string;
    facultyId: string;
    dayOfWeek: DayOfWeek;
    periodNumber: number;
    room?: string | null;
    excludeEntryId?: string;
  }): Promise<TimetableConflict[]> {
    const conflicts: TimetableConflict[] = [];

    // Try RPC conflict checker if present
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('check_timetable_conflict', {
        p_academic_year_id: params.academicYearId,
        p_class_id: params.classId,
        p_section_id: params.sectionId,
        p_faculty_id: params.facultyId,
        p_day_of_week: params.dayOfWeek,
        p_period_number: params.periodNumber,
        p_room: params.room || null,
        p_exclude_entry_id: params.excludeEntryId || null,
      });

      if (!rpcError && rpcData && rpcData.length > 0) {
        return rpcData as TimetableConflict[];
      }
    } catch {
      // Fallback to table queries if RPC is not deployed yet in DB
    }

    // Direct fallback check 1: Class Conflict
    let classQuery = supabase
      .from('timetable_entries')
      .select('id, subject:subjects(name)')
      .eq('academic_year_id', params.academicYearId)
      .eq('class_id', params.classId)
      .eq('section_id', params.sectionId)
      .eq('day_of_week', params.dayOfWeek)
      .eq('period_number', params.periodNumber)
      .eq('status', 'PUBLISHED');

    if (params.excludeEntryId) {
      classQuery = classQuery.neq('id', params.excludeEntryId);
    }
    const { data: classOverlap } = await classQuery.maybeSingle();
    if (classOverlap) {
      conflicts.push({
        conflict_type: 'CLASS_CONFLICT',
        conflict_message: `Class already has ${(classOverlap.subject as any)?.name || 'a subject'} in Period ${params.periodNumber}.`,
        conflicting_entry_id: classOverlap.id,
      });
    }

    // Direct fallback check 2: Faculty Conflict
    let facultyQuery = supabase
      .from('timetable_entries')
      .select('id, class:classes(name), section:sections(name)')
      .eq('academic_year_id', params.academicYearId)
      .eq('faculty_id', params.facultyId)
      .eq('day_of_week', params.dayOfWeek)
      .eq('period_number', params.periodNumber)
      .eq('status', 'PUBLISHED');

    if (params.excludeEntryId) {
      facultyQuery = facultyQuery.neq('id', params.excludeEntryId);
    }
    const { data: facultyOverlap } = await facultyQuery.maybeSingle();
    if (facultyOverlap) {
      conflicts.push({
        conflict_type: 'FACULTY_CONFLICT',
        conflict_message: `Faculty is already teaching ${(facultyOverlap.class as any)?.name}-${(facultyOverlap.section as any)?.name} in Period ${params.periodNumber}.`,
        conflicting_entry_id: facultyOverlap.id,
      });
    }

    // Direct fallback check 3: Room Conflict
    if (params.room && params.room.trim()) {
      let roomQuery = supabase
        .from('timetable_entries')
        .select('id, class:classes(name), section:sections(name)')
        .eq('academic_year_id', params.academicYearId)
        .ilike('room', params.room.trim())
        .eq('day_of_week', params.dayOfWeek)
        .eq('period_number', params.periodNumber)
        .eq('status', 'PUBLISHED');

      if (params.excludeEntryId) {
        roomQuery = roomQuery.neq('id', params.excludeEntryId);
      }
      const { data: roomOverlap } = await roomQuery.maybeSingle();
      if (roomOverlap) {
        conflicts.push({
          conflict_type: 'ROOM_CONFLICT',
          conflict_message: `Room "${params.room}" is occupied by ${(roomOverlap.class as any)?.name}-${(roomOverlap.section as any)?.name} in Period ${params.periodNumber}.`,
          conflicting_entry_id: roomOverlap.id,
        });
      }
    }

    return conflicts;
  },

  /**
   * Create a timetable entry with conflict check
   */
  async createTimetableEntry(entry: {
    academic_year_id: string;
    class_id: string;
    section_id: string;
    subject_id: string;
    faculty_id: string;
    faculty_assignment_id?: string | null;
    day_of_week: DayOfWeek;
    period_number: number;
    room?: string | null;
    status?: TimetableStatus;
  }): Promise<TimetableEntry> {
    const conflicts = await this.validateSlotConflict({
      academicYearId: entry.academic_year_id,
      classId: entry.class_id,
      sectionId: entry.section_id,
      facultyId: entry.faculty_id,
      dayOfWeek: entry.day_of_week,
      periodNumber: entry.period_number,
      room: entry.room,
    });

    if (conflicts.length > 0) {
      throw new Error(conflicts.map((c) => c.conflict_message).join(' '));
    }

    const { data, error } = await supabase
      .from('timetable_entries')
      .insert({
        academic_year_id: entry.academic_year_id,
        class_id: entry.class_id,
        section_id: entry.section_id,
        subject_id: entry.subject_id,
        faculty_id: entry.faculty_id,
        faculty_assignment_id: entry.faculty_assignment_id || null,
        day_of_week: entry.day_of_week,
        period_number: entry.period_number,
        room: entry.room || null,
        status: entry.status || 'PUBLISHED',
      })
      .select(`
        *,
        academic_year:academic_years(*),
        class:classes(*),
        section:sections(*),
        subject:subjects(*),
        faculty:faculty_details(*)
      `)
      .single();

    if (error) {
      console.error('Error creating timetable entry:', error);
      throw new Error(error.message);
    }

    return data as TimetableEntry;
  },

  /**
   * Update an existing timetable entry
   */
  async updateTimetableEntry(
    id: string,
    updates: Partial<TimetableEntry>
  ): Promise<TimetableEntry> {
    // If updating slot parameters, validate conflict
    if (
      updates.academic_year_id &&
      updates.class_id &&
      updates.section_id &&
      updates.faculty_id &&
      updates.day_of_week &&
      updates.period_number
    ) {
      const conflicts = await this.validateSlotConflict({
        academicYearId: updates.academic_year_id,
        classId: updates.class_id,
        sectionId: updates.section_id,
        facultyId: updates.faculty_id,
        dayOfWeek: updates.day_of_week,
        periodNumber: updates.period_number,
        room: updates.room,
        excludeEntryId: id,
      });

      if (conflicts.length > 0) {
        throw new Error(conflicts.map((c) => c.conflict_message).join(' '));
      }
    }

    const { data, error } = await supabase
      .from('timetable_entries')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        academic_year:academic_years(*),
        class:classes(*),
        section:sections(*),
        subject:subjects(*),
        faculty:faculty_details(*)
      `)
      .single();

    if (error) {
      console.error('Error updating timetable entry:', error);
      throw new Error(error.message);
    }

    return data as TimetableEntry;
  },

  /**
   * Delete a timetable entry
   */
  async deleteTimetableEntry(id: string): Promise<void> {
    const { error } = await supabase.from('timetable_entries').delete().eq('id', id);
    if (error) {
      console.error('Error deleting timetable entry:', error);
      throw new Error(error.message);
    }
  },

  /**
   * Publish all draft timetable entries for a class-section
   */
  async publishClassTimetable(
    academicYearId: string,
    classId: string,
    sectionId: string
  ): Promise<number> {
    const { data, error } = await supabase
      .from('timetable_entries')
      .update({
        status: 'PUBLISHED',
        updated_at: new Date().toISOString(),
      })
      .eq('academic_year_id', academicYearId)
      .eq('class_id', classId)
      .eq('section_id', sectionId)
      .eq('status', 'DRAFT')
      .select('id');

    if (error) {
      console.error('Error publishing timetable:', error);
      throw new Error(error.message);
    }

    return (data || []).length;
  },
};

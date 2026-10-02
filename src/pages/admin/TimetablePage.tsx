import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  School,
  User,
  MapPin,
  RefreshCw,
  Send,
  Coffee,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/contexts/ToastContext';
import { timetableService } from '@/services/timetableService';
import { academicService } from '@/services/academicService';
import { allocationService } from '@/services/allocationService';
import { facultyService } from '@/services/facultyService';
import {
  TimetablePeriod,
  TimetableEntry,
  DayOfWeek,
  AcademicYear,
  SchoolClass,
  SchoolSection,
  Subject,
  FacultyMember,
  FacultyAssignment,
  TimetableConflict,
} from '@/types';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

export const TimetablePage: React.FC = () => {
  const toast = useToast();

  // Master Data State
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [sections, setSections] = useState<SchoolSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [periods, setPeriods] = useState<TimetablePeriod[]>([]);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [classAllocations, setClassAllocations] = useState<FacultyAssignment[]>([]);

  // Modals State
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);

  // Slot Form State
  const [slotForm, setSlotForm] = useState({
    day_of_week: 'MONDAY' as DayOfWeek,
    period_number: 1,
    subject_id: '',
    faculty_id: '',
    faculty_assignment_id: '' as string | null,
    room: '',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
  });
  const [slotConflicts, setSlotConflicts] = useState<TimetableConflict[]>([]);
  const [validatingConflict, setValidatingConflict] = useState(false);

  // Initial Data Load
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [years, cls, secs, subjs, fac, pds] = await Promise.all([
        academicService.getAcademicYears(),
        academicService.getClasses(),
        academicService.getSections(),
        academicService.getSubjects(),
        facultyService.getFaculty({ page: 1, pageSize: 100, status: 'ACTIVE' }),
        timetableService.getPeriods(),
      ]);

      setAcademicYears(years);
      setClasses(cls);
      setSections(secs);
      setSubjects(subjs);
      setFacultyList(fac.data);
      setPeriods(pds);

      const currentYear = years.find((y) => y.is_current) || years[0];
      if (currentYear) setSelectedYearId(currentYear.id);
      if (cls[0]) setSelectedClassId(cls[0].id);
      if (secs[0]) setSelectedSectionId(secs[0].id);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load timetable prerequisites', 'Initialization Error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load Timetable Entries and Class Allocations for the selected Class/Section/Year
  const loadTimetableGrid = useCallback(async () => {
    if (!selectedYearId || !selectedClassId || !selectedSectionId) return;
    try {
      setLoading(true);
      const [ttEntries, allocs] = await Promise.all([
        timetableService.getTimetableEntries({
          academicYearId: selectedYearId,
          classId: selectedClassId,
          sectionId: selectedSectionId,
          status: 'ALL',
        }),
        allocationService.getFacultyAssignments({
          academicYearId: selectedYearId,
          classId: selectedClassId,
          sectionId: selectedSectionId,
          status: 'ACTIVE',
        }),
      ]);

      setEntries(ttEntries);
      setClassAllocations(allocs);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load timetable entries', 'Fetch Error');
    } finally {
      setLoading(false);
    }
  }, [selectedYearId, selectedClassId, selectedSectionId, toast]);

  useEffect(() => {
    loadTimetableGrid();
  }, [loadTimetableGrid]);

  // Auto-populate Faculty when Subject is selected in Slot Form
  const handleSubjectChange = (subjectId: string) => {
    const matchedAllocation = classAllocations.find((a) => a.subject_id === subjectId);
    setSlotForm((prev) => ({
      ...prev,
      subject_id: subjectId,
      faculty_id: matchedAllocation ? matchedAllocation.faculty_id : prev.faculty_id,
      faculty_assignment_id: matchedAllocation ? matchedAllocation.id : null,
    }));
  };

  // Conflict Validator in Modal
  useEffect(() => {
    const validate = async () => {
      if (
        !isSlotModalOpen ||
        !selectedYearId ||
        !selectedClassId ||
        !selectedSectionId ||
        !slotForm.faculty_id
      ) {
        setSlotConflicts([]);
        return;
      }

      try {
        setValidatingConflict(true);
        const conflicts = await timetableService.validateSlotConflict({
          academicYearId: selectedYearId,
          classId: selectedClassId,
          sectionId: selectedSectionId,
          facultyId: slotForm.faculty_id,
          dayOfWeek: slotForm.day_of_week,
          periodNumber: slotForm.period_number,
          room: slotForm.room,
          excludeEntryId: editingEntry?.id,
        });
        setSlotConflicts(conflicts);
      } catch (e) {
        console.error('Error validating conflict:', e);
      } finally {
        setValidatingConflict(false);
      }
    };

    const debounceTimer = setTimeout(validate, 300);
    return () => clearTimeout(debounceTimer);
  }, [
    isSlotModalOpen,
    selectedYearId,
    selectedClassId,
    selectedSectionId,
    slotForm.faculty_id,
    slotForm.day_of_week,
    slotForm.period_number,
    slotForm.room,
    editingEntry,
  ]);

  // Open Slot Modal for empty cell or add button
  const handleOpenSlotModal = (day?: DayOfWeek, periodNum?: number) => {
    setEditingEntry(null);
    const defaultDay = day || 'MONDAY';
    const defaultPeriod = periodNum || 1;
    const defaultSubject = subjects[0]?.id || '';
    const matchedAlloc = classAllocations.find((a) => a.subject_id === defaultSubject);

    setSlotForm({
      day_of_week: defaultDay,
      period_number: defaultPeriod,
      subject_id: defaultSubject,
      faculty_id: matchedAlloc?.faculty_id || facultyList[0]?.id || '',
      faculty_assignment_id: matchedAlloc?.id || null,
      room: '',
      status: 'PUBLISHED',
    });
    setSlotConflicts([]);
    setIsSlotModalOpen(true);
  };

  // Open Slot Modal for Editing
  const handleOpenEditSlot = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setSlotForm({
      day_of_week: entry.day_of_week,
      period_number: entry.period_number,
      subject_id: entry.subject_id,
      faculty_id: entry.faculty_id,
      faculty_assignment_id: entry.faculty_assignment_id || null,
      room: entry.room || '',
      status: (entry.status === 'ARCHIVED' ? 'PUBLISHED' : entry.status) as any,
    });
    setSlotConflicts([]);
    setIsSlotModalOpen(true);
  };

  // Save Slot (Create or Update)
  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotForm.subject_id || !slotForm.faculty_id) {
      toast.warning('Please select both a subject and a faculty member.', 'Incomplete Details');
      return;
    }

    if (slotConflicts.length > 0) {
      toast.error(slotConflicts[0].conflict_message, 'Conflict Detected');
      return;
    }

    try {
      setActionLoading(true);
      if (editingEntry) {
        await timetableService.updateTimetableEntry(editingEntry.id, {
          academic_year_id: selectedYearId,
          class_id: selectedClassId,
          section_id: selectedSectionId,
          subject_id: slotForm.subject_id,
          faculty_id: slotForm.faculty_id,
          faculty_assignment_id: slotForm.faculty_assignment_id,
          day_of_week: slotForm.day_of_week,
          period_number: slotForm.period_number,
          room: slotForm.room,
          status: slotForm.status,
        });
        toast.success('Timetable entry successfully modified.', 'Slot Updated');
      } else {
        await timetableService.createTimetableEntry({
          academic_year_id: selectedYearId,
          class_id: selectedClassId,
          section_id: selectedSectionId,
          subject_id: slotForm.subject_id,
          faculty_id: slotForm.faculty_id,
          faculty_assignment_id: slotForm.faculty_assignment_id,
          day_of_week: slotForm.day_of_week,
          period_number: slotForm.period_number,
          room: slotForm.room,
          status: slotForm.status,
        });
        toast.success('New period schedule added to timetable.', 'Slot Created');
      }

      setIsSlotModalOpen(false);
      loadTimetableGrid();
    } catch (err: any) {
      toast.error(err.message || 'Could not save timetable slot.', 'Save Failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Slot
  const handleDeleteSlot = async () => {
    if (!deleteEntryId) return;
    try {
      setActionLoading(true);
      await timetableService.deleteTimetableEntry(deleteEntryId);
      toast.success('Timetable slot removed successfully.', 'Slot Deleted');
      setDeleteEntryId(null);
      loadTimetableGrid();
    } catch (err: any) {
      toast.error(err.message || 'Could not delete timetable slot.', 'Delete Failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Publish Class Timetable
  const handlePublishAll = async () => {
    try {
      setActionLoading(true);
      const count = await timetableService.publishClassTimetable(
        selectedYearId,
        selectedClassId,
        selectedSectionId
      );
      toast.success(`Successfully published ${count} draft slots to active view.`, 'Timetable Published');
      loadTimetableGrid();
    } catch (err: any) {
      toast.error(err.message || 'Could not publish timetable slots.', 'Publish Failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper map for entry lookup by Day & Period Number
  const entryMap = useMemo(() => {
    const map = new Map<string, TimetableEntry>();
    entries.forEach((e) => {
      map.set(`${e.day_of_week}_${e.period_number}`, e);
    });
    return map;
  }, [entries]);

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedSection = sections.find((s) => s.id === selectedSectionId);
  const selectedYear = academicYears.find((y) => y.id === selectedYearId);

  const draftCount = entries.filter((e) => e.status === 'DRAFT').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Timetable Management
            </h1>
            {selectedYear && (
              <Badge variant={selectedYear.is_current ? 'success' : 'default'}>
                {selectedYear.name}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Master weekly scheduling matrix with automated period conflict prevention.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            onClick={loadTimetableGrid}
            disabled={loading}
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          {draftCount > 0 && (
            <Button
              variant="primary"
              onClick={handlePublishAll}
              isLoading={actionLoading}
              leftIcon={<Send className="h-4 w-4" />}
            >
              Publish Drafts ({draftCount})
            </Button>
          )}

          <Button
            variant="primary"
            onClick={() => handleOpenSlotModal()}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Slot
          </Button>
        </div>
      </div>

      {/* Selector & Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Academic Year
            </label>
            <Select
              value={selectedYearId}
              onChange={(e) => setSelectedYearId(e.target.value)}
            >
              {academicYears.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} {y.is_current ? '(Current)' : ''}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Class
            </label>
            <Select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Class {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Section
            </label>
            <Select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  Section {s.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="sm:col-span-3 lg:col-span-1 flex items-center justify-start lg:justify-end gap-2 pt-4 lg:pt-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-block h-3 w-3 rounded-full bg-emerald-500"></span> Published
              <span className="inline-block h-3 w-3 rounded-full bg-amber-500 ml-2"></span> Draft
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Timetable Grid */}
      <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <span className="font-bold text-slate-900 dark:text-white">
              Weekly Timetable &bull; Class {selectedClass?.name || ''}-{selectedSection?.name || ''}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {entries.length} scheduled slots &bull; {periods.length} daily periods
          </span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-slate-100/75 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5 text-left w-32 border-r border-slate-200 dark:border-slate-700">
                    Day / Period
                  </th>
                  {periods.map((pd) => (
                    <th
                      key={pd.id}
                      className={`p-3 min-w-[130px] border-r border-slate-200 dark:border-slate-700 ${
                        pd.is_break
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300'
                          : ''
                      }`}
                    >
                      <div className="font-bold text-sm">{pd.name}</div>
                      <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                        {pd.start_time.slice(0, 5)} - {pd.end_time.slice(0, 5)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                {DAYS_OF_WEEK.map((day) => (
                  <tr key={day} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                    {/* Day Column Header */}
                    <td className="p-3.5 text-left font-bold text-slate-900 dark:text-white bg-slate-50/70 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700">
                      {day}
                    </td>

                    {/* Periods Cells */}
                    {periods.map((pd) => {
                      if (pd.is_break) {
                        return (
                          <td
                            key={pd.id}
                            className="p-2 border-r border-slate-200 dark:border-slate-700 bg-amber-50/30 dark:bg-amber-950/10 text-amber-800 dark:text-amber-400 text-xs font-semibold"
                          >
                            <div className="flex flex-col items-center justify-center py-3">
                              <Coffee className="h-4 w-4 mb-1 opacity-70" />
                              <span>{pd.name}</span>
                            </div>
                          </td>
                        );
                      }

                      const entry = entryMap.get(`${day}_${pd.period_number}`);

                      return (
                        <td
                          key={pd.id}
                          className="p-2 border-r border-slate-200 dark:border-slate-700 align-top h-24"
                        >
                          {entry ? (
                            <div
                              className={`group relative h-full rounded-lg p-2.5 text-left transition-all shadow-sm border ${
                                entry.status === 'PUBLISHED'
                                  ? 'bg-brand-50/70 border-brand-200 dark:bg-brand-950/30 dark:border-brand-900/60'
                                  : 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/60'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <span className="font-bold text-xs text-brand-950 dark:text-brand-200 truncate">
                                  {entry.subject?.name}
                                </span>
                                <span
                                  className={`h-2 w-2 rounded-full flex-shrink-0 ${
                                    entry.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'
                                  }`}
                                  title={entry.status}
                                />
                              </div>

                              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 truncate">
                                <User className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{entry.faculty?.full_name}</span>
                              </div>

                              {entry.room && (
                                <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-500">
                                  <MapPin className="h-2.5 w-2.5" />
                                  <span>Room: {entry.room}</span>
                                </div>
                              )}

                              {/* Hover Action Floating Buttons */}
                              <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 p-1 rounded shadow-md border border-slate-200 dark:border-slate-700">
                                <button
                                  onClick={() => handleOpenEditSlot(entry)}
                                  className="text-slate-500 hover:text-brand-600 p-0.5 rounded"
                                  title="Edit slot"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => setDeleteEntryId(entry.id)}
                                  className="text-slate-500 hover:text-red-600 p-0.5 rounded"
                                  title="Delete slot"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenSlotModal(day, pd.period_number)}
                              className="h-full w-full rounded-lg border border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col items-center justify-center text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group"
                            >
                              <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              <span className="text-[10px] font-medium mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                Add
                              </span>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* SLOT FORM MODAL */}
      <Modal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        title={editingEntry ? 'Edit Timetable Slot' : 'Add Timetable Slot'}
        size="md"
      >
        <form onSubmit={handleSaveSlot} className="space-y-4">
          {/* Conflict Alert Banner */}
          {slotConflicts.length > 0 && (
            <div className="flex items-start gap-2.5 rounded-lg bg-red-50 p-3.5 text-xs text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900 animate-fadeIn">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" />
              <div>
                <span className="font-bold">Schedule Conflict Warning:</span>
                <p className="mt-0.5">{slotConflicts[0].conflict_message}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Day of Week *
              </label>
              <Select
                value={slotForm.day_of_week}
                onChange={(e) =>
                  setSlotForm({ ...slotForm, day_of_week: e.target.value as DayOfWeek })
                }
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Period *
              </label>
              <Select
                value={slotForm.period_number.toString()}
                onChange={(e) =>
                  setSlotForm({ ...slotForm, period_number: parseInt(e.target.value, 10) })
                }
              >
                {periods
                  .filter((p) => !p.is_break)
                  .map((p) => (
                    <option key={p.id} value={p.period_number.toString()}>
                      {p.name} ({p.start_time.slice(0, 5)}-{p.end_time.slice(0, 5)})
                    </option>
                  ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject *
            </label>
            <Select
              value={slotForm.subject_id}
              onChange={(e) => handleSubjectChange(e.target.value)}
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Faculty Member *
            </label>
            <Select
              value={slotForm.faculty_id}
              onChange={(e) => setSlotForm({ ...slotForm, faculty_id: e.target.value })}
            >
              {facultyList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.full_name} ({f.employee_id} - {f.department})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Room / Hall (Optional)
              </label>
              <Input
                placeholder="e.g. Lab 2, Hall A"
                value={slotForm.room}
                onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <Select
                value={slotForm.status}
                onChange={(e) =>
                  setSlotForm({ ...slotForm, status: e.target.value as 'DRAFT' | 'PUBLISHED' })
                }
              >
                <option value="PUBLISHED">Published (Live)</option>
                <option value="DRAFT">Draft</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsSlotModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={actionLoading || validatingConflict}
              disabled={slotConflicts.length > 0}
            >
              {editingEntry ? 'Save Changes' : 'Add Slot'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deleteEntryId}
        onClose={() => setDeleteEntryId(null)}
        title="Remove Timetable Slot"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to delete this timetable entry? The period slot will become open for new allocations.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteEntryId(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteSlot}
              isLoading={actionLoading}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

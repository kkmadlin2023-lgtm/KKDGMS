import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Award,
  BookOpen,
  Layers,
  Clock,
  AlertCircle,
  BarChart3,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/contexts/ToastContext';
import { allocationService } from '@/services/allocationService';
import { academicService } from '@/services/academicService';
import { facultyService } from '@/services/facultyService';
import {
  FacultyAssignment,
  FacultyMember,
  AcademicYear,
  SchoolClass,
  SchoolSection,
  Subject,
  FacultyWorkload,
} from '@/types';

export const FacultyAssignmentsPage: React.FC = () => {
  const toast = useToast();

  // State
  const [activeTab, setActiveTab] = useState<'assignments' | 'workload'>('assignments');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Data
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);
  const [workloads, setWorkloads] = useState<FacultyWorkload[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<SchoolSection[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<FacultyAssignment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    academic_year_id: '',
    class_id: '',
    section_id: '',
    subject_id: '',
    faculty_id: '',
    is_class_teacher: false,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formWarning, setFormWarning] = useState<string | null>(null);

  // Load initial academic context
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [years, cls, secs, subjs, fac] = await Promise.all([
        academicService.getAcademicYears(),
        academicService.getClasses(),
        academicService.getSections(),
        academicService.getSubjects(),
        facultyService.getFaculty({ page: 1, pageSize: 100, status: 'ACTIVE' }),
      ]);

      setAcademicYears(years);
      setClasses(cls);
      setSections(secs);
      setSubjects(subjs);
      setFacultyList(fac.data);

      const currentYear = years.find((y) => y.is_current) || years[0];
      if (currentYear) {
        setSelectedYearId(currentYear.id);
        setFormData((prev) => ({ ...prev, academic_year_id: currentYear.id }));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load prerequisite data', 'Initialization Error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load assignments when selected year changes
  const loadAssignments = useCallback(async () => {
    if (!selectedYearId) return;
    try {
      setLoading(true);
      const [allocData, workloadData] = await Promise.all([
        allocationService.getFacultyAssignments({
          academicYearId: selectedYearId,
          status: statusFilter,
        }),
        allocationService.getFacultyWorkload(selectedYearId),
      ]);
      setAssignments(allocData);
      setWorkloads(workloadData);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load faculty allocations', 'Fetch Error');
    } finally {
      setLoading(false);
    }
  }, [selectedYearId, statusFilter, toast]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // Real-time conflict/overlap checking in assignment modal
  useEffect(() => {
    const checkOverlap = async () => {
      setFormWarning(null);
      if (!formData.academic_year_id || !formData.class_id || !formData.section_id) return;

      // Check subject teacher conflict
      if (formData.subject_id) {
        const existing = await allocationService.checkSubjectTeacherExists(
          formData.academic_year_id,
          formData.class_id,
          formData.section_id,
          formData.subject_id,
          editingAssignment?.id
        );
        if (existing) {
          const facultyName = (existing.faculty as any)?.full_name || 'Another faculty';
          setFormWarning(`Notice: This subject is currently assigned to ${facultyName}. Saving will reassign or raise an error if not inactivated.`);
          return;
        }
      }

      // Check class teacher conflict
      if (formData.is_class_teacher) {
        const existingCT = await allocationService.checkClassTeacherExists(
          formData.academic_year_id,
          formData.class_id,
          formData.section_id,
          editingAssignment?.id
        );
        if (existingCT) {
          const facultyName = (existingCT.faculty as any)?.full_name || 'Another faculty';
          setFormWarning(`Notice: ${facultyName} is currently the assigned Class Teacher for this section.`);
        }
      }
    };

    if (isModalOpen) {
      checkOverlap();
    }
  }, [formData.academic_year_id, formData.class_id, formData.section_id, formData.subject_id, formData.is_class_teacher, isModalOpen, editingAssignment]);

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchSearch =
        !searchQuery ||
        a.faculty?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.faculty?.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subject?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subject?.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchClass = classFilter === 'ALL' || a.class_id === classFilter;
      const matchSection = sectionFilter === 'ALL' || a.section_id === sectionFilter;

      return matchSearch && matchClass && matchSection;
    });
  }, [assignments, searchQuery, classFilter, sectionFilter]);

  // Modal Handlers
  const handleOpenCreateModal = () => {
    setEditingAssignment(null);
    setFormData({
      academic_year_id: selectedYearId,
      class_id: classes[0]?.id || '',
      section_id: sections[0]?.id || '',
      subject_id: subjects[0]?.id || '',
      faculty_id: facultyList[0]?.id || '',
      is_class_teacher: false,
      status: 'ACTIVE',
    });
    setFormErrors({});
    setFormWarning(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (assignment: FacultyAssignment) => {
    setEditingAssignment(assignment);
    setFormData({
      academic_year_id: assignment.academic_year_id,
      class_id: assignment.class_id,
      section_id: assignment.section_id,
      subject_id: assignment.subject_id,
      faculty_id: assignment.faculty_id,
      is_class_teacher: assignment.is_class_teacher,
      status: assignment.status,
    });
    setFormErrors({});
    setFormWarning(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.academic_year_id) errors.academic_year_id = 'Academic Year is required';
    if (!formData.class_id) errors.class_id = 'Class is required';
    if (!formData.section_id) errors.section_id = 'Section is required';
    if (!formData.subject_id) errors.subject_id = 'Subject is required';
    if (!formData.faculty_id) errors.faculty_id = 'Faculty member is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setActionLoading(true);
      if (editingAssignment) {
        await allocationService.updateFacultyAssignment(editingAssignment.id, formData);
        toast.success('Faculty assignment was successfully modified.', 'Allocation Updated');
      } else {
        await allocationService.createFacultyAssignment(formData);
        toast.success('Faculty successfully assigned to class subject.', 'Allocation Created');
      }
      setIsModalOpen(false);
      loadAssignments();
    } catch (err: any) {
      toast.error(err.message || 'Could not save faculty allocation.', 'Operation Failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (assignment: FacultyAssignment) => {
    try {
      const newStatus = assignment.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await allocationService.updateFacultyAssignment(assignment.id, { status: newStatus });
      toast.info(`Assignment marked as ${newStatus}.`, 'Status Updated');
      loadAssignments();
    } catch (err: any) {
      toast.error(err.message || 'Could not update assignment status.', 'Update Failed');
    }
  };

  const handleDeleteAssignment = async () => {
    if (!deleteConfirmId) return;
    try {
      setActionLoading(true);
      await allocationService.deleteFacultyAssignment(deleteConfirmId);
      toast.success('Faculty assignment was successfully deleted.', 'Assignment Removed');
      setDeleteConfirmId(null);
      loadAssignments();
    } catch (err: any) {
      toast.error(err.message || 'Could not delete assignment.', 'Delete Failed');
    } finally {
      setActionLoading(false);
    }
  };

  const selectedYear = academicYears.find((y) => y.id === selectedYearId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Faculty Allocation
            </h1>
            {selectedYear && (
              <Badge variant={selectedYear.is_current ? 'success' : 'default'}>
                {selectedYear.name} {selectedYear.is_current && '(Current)'}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Map faculty members to classes, sections, and subjects with automatic conflict safeguards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={loadAssignments}
            disabled={loading}
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Assign Faculty
          </Button>
        </div>
      </div>

      {/* Stats / Workload Ribbon */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 border-l-4 border-l-brand-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Allocations
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {assignments.length}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Faculty Assigned
              </p>
              <h3 className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {workloads.filter((w) => w.totalAssignments > 0).length} / {facultyList.length}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Class Teachers Designated
              </p>
              <h3 className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                {assignments.filter((a) => a.is_class_teacher && a.status === 'ACTIVE').length}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Scheduled Periods
              </p>
              <h3 className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {workloads.reduce((sum, w) => sum + w.totalPeriodsPerWeek, 0)}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'assignments'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Allocations Matrix ({filteredAssignments.length})
        </button>

        <button
          onClick={() => setActiveTab('workload')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'workload'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Faculty Workload Analysis ({workloads.length})
        </button>
      </div>

      {/* TAB 1: ALLOCATIONS LIST */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <Card className="p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <option value="ALL">All Classes</option>
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
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                >
                  <option value="ALL">All Sections</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Status
                </label>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="ACTIVE">Active Only</option>
                  <option value="INACTIVE">Inactive Only</option>
                  <option value="ALL">All Statuses</option>
                </Select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <Input
                  placeholder="Search faculty name, employee ID, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4 text-slate-400" />}
                />
              </div>
            </div>
          </Card>

          {/* Allocation Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredAssignments.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-200">
                No Faculty Allocations Found
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                No assignments match the selected filter criteria. Click "Assign Faculty" to create a new mapping.
              </p>
              <Button
                variant="primary"
                onClick={handleOpenCreateModal}
                className="mt-4"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Assign Faculty
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className={`overflow-hidden transition-all hover:shadow-md border-t-4 ${
                    assignment.is_class_teacher ? 'border-t-amber-500' : 'border-t-brand-600'
                  }`}
                >
                  <div className="p-5">
                    {/* Top Row: Class & Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                          {assignment.class?.name}-{assignment.section?.name}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            Class {assignment.class?.name} &bull; Sec {assignment.section?.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {assignment.subject?.name} ({assignment.subject?.code})
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant={assignment.status === 'ACTIVE' ? 'success' : 'default'}
                        >
                          {assignment.status}
                        </Badge>
                        {assignment.is_class_teacher && (
                          <Badge variant="warning">
                            Class Teacher
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Faculty Profile Strip */}
                    <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
                      {assignment.faculty?.photo_url ? (
                        <img
                          src={assignment.faculty.photo_url}
                          alt={assignment.faculty.full_name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                          {assignment.faculty?.full_name.charAt(0) || 'F'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {assignment.faculty?.full_name}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          Emp ID: {assignment.faculty?.employee_id} &bull; {assignment.faculty?.department}
                        </p>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                      <button
                        onClick={() => handleToggleStatus(assignment)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        {assignment.status === 'ACTIVE' ? 'Mark Inactive' : 'Mark Active'}
                      </button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(assignment)}
                          leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteConfirmId(assignment.id)}
                          leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FACULTY WORKLOAD */}
      {activeTab === 'workload' && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              Teaching Load & Class Teacher Assignments
            </h3>
            <p className="text-xs text-slate-500">
              Academic Year: {selectedYear?.name}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Faculty Member</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Class Teacher Role</th>
                  <th className="px-6 py-3.5">Classes Assigned</th>
                  <th className="px-6 py-3.5">Subjects Taught</th>
                  <th className="px-6 py-3.5 text-center">Active Allocations</th>
                  <th className="px-6 py-3.5 text-center">Periods/Week</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {workloads.map((w) => (
                  <tr key={w.faculty.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {w.faculty.photo_url ? (
                          <img
                            src={w.faculty.photo_url}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                            {w.faculty.full_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {w.faculty.full_name}
                          </p>
                          <p className="text-xs text-slate-400">ID: {w.faculty.employee_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{w.faculty.department}</td>
                    <td className="px-6 py-4">
                      {w.isClassTeacherOf ? (
                        <Badge variant="warning">Class {w.isClassTeacherOf}</Badge>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {w.classesTaught.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {w.classesTaught.map((c, idx) => (
                            <Badge key={idx} variant="default">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {w.subjectsTaught.length > 0 ? (
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {w.subjectsTaught.join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-white">
                      {w.totalAssignments}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={w.totalPeriodsPerWeek > 25 ? 'danger' : 'info'}>
                        {w.totalPeriodsPerWeek} periods
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* CREATE / EDIT ASSIGNMENT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? 'Edit Faculty Assignment' : 'New Faculty Allocation'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formWarning && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />
              <span>{formWarning}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year *
              </label>
              <Select
                value={formData.academic_year_id}
                onChange={(e) => setFormData({ ...formData, academic_year_id: e.target.value })}
              >
                {academicYears.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.name} {y.is_current ? '(Current)' : ''}
                  </option>
                ))}
              </Select>
              {formErrors.academic_year_id && (
                <p className="mt-1 text-xs text-red-500">{formErrors.academic_year_id}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Faculty Member *
              </label>
              <Select
                value={formData.faculty_id}
                onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
              >
                {facultyList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.full_name} ({f.employee_id} - {f.department})
                  </option>
                ))}
              </Select>
              {formErrors.faculty_id && (
                <p className="mt-1 text-xs text-red-500">{formErrors.faculty_id}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class *
              </label>
              <Select
                value={formData.class_id}
                onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Class {c.name}
                  </option>
                ))}
              </Select>
              {formErrors.class_id && (
                <p className="mt-1 text-xs text-red-500">{formErrors.class_id}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Section *
              </label>
              <Select
                value={formData.section_id}
                onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    Section {s.name}
                  </option>
                ))}
              </Select>
              {formErrors.section_id && (
                <p className="mt-1 text-xs text-red-500">{formErrors.section_id}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject *
              </label>
              <Select
                value={formData.subject_id}
                onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </Select>
              {formErrors.subject_id && (
                <p className="mt-1 text-xs text-red-500">{formErrors.subject_id}</p>
              )}
            </div>
          </div>

          {/* Class Teacher & Status Checkbox */}
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_class_teacher}
                onChange={(e) => setFormData({ ...formData, is_class_teacher: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Designate as Class Teacher
                </span>
                <p className="text-xs text-slate-500">
                  Faculty will hold primary attendance, report card, and class administrative duties.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.status === 'ACTIVE'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked ? 'ACTIVE' : 'INACTIVE' })
                }
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Active Assignment
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={actionLoading}>
              {editingAssignment ? 'Save Changes' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Remove Faculty Assignment"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to remove this faculty assignment? Associated timetable slots may need to be updated.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteConfirmId(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteAssignment}
              isLoading={actionLoading}
            >
              Confirm Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

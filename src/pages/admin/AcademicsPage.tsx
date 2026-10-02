import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { academicService } from '@/services/academicService';
import { AcademicYear, SchoolClass, SchoolSection, Subject, ClassSection, ClassSubject } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  GraduationCap,
  Calendar,
  Layers,
  BookOpen,
  Plus,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const AcademicsPage: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'years' | 'classes' | 'subjects'>('years');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Academic Structure State
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<SchoolSection[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([]);

  // Modals State
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [yearName, setYearName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrentYear, setIsCurrentYear] = useState(false);
  const [isSavingYear, setIsSavingYear] = useState(false);

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [classOrder, setClassOrder] = useState<number>(1);
  const [isSavingClass, setIsSavingClass] = useState(false);

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [isSavingSection, setIsSavingSection] = useState(false);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectDesc, setSubjectDesc] = useState('');
  const [isSavingSubject, setIsSavingSubject] = useState(false);

  const [isMapSubjectModalOpen, setIsMapSubjectModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [isSavingMap, setIsSavingMap] = useState(false);

  // Load all academic data
  const loadAcademics = useCallback(async () => {
    setIsLoading(true);
    try {
      const [yearsData, classesData, sectionsData, classSecData, subjectsData, classSubData] =
        await Promise.all([
          academicService.getAcademicYears(),
          academicService.getClasses(),
          academicService.getSections(),
          academicService.getClassSections(),
          academicService.getSubjects(),
          academicService.getClassSubjects(),
        ]);

      setAcademicYears(yearsData);
      setClasses(classesData);
      setSections(sectionsData);
      setClassSections(classSecData);
      setSubjects(subjectsData);
      setClassSubjects(classSubData);
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to load academic structure from database');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAcademics();
  }, [loadAcademics]);

  // Set Current Academic Year
  const handleSetCurrentYear = async (id: string, name: string) => {
    try {
      await academicService.setCurrentAcademicYear(id);
      toast.success(`Academic Year ${name} is now set as the active current year.`);
      loadAcademics();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to set current academic year';
      toast.error(msg);
    }
  };

  // Create Academic Year
  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yearName.trim() || !startDate || !endDate) return;

    setIsSavingYear(true);
    try {
      await academicService.createAcademicYear({
        name: yearName.trim(),
        start_date: startDate,
        end_date: endDate,
        is_current: isCurrentYear,
        is_active: true,
      });
      toast.success(`Academic Year ${yearName} added successfully!`);
      setIsYearModalOpen(false);
      setYearName('');
      setStartDate('');
      setEndDate('');
      setIsCurrentYear(false);
      loadAcademics();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create academic year';
      toast.error(msg);
    } finally {
      setIsSavingYear(false);
    }
  };

  // Create Class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    setIsSavingClass(true);
    try {
      await academicService.createClass(className.trim(), Number(classOrder));
      toast.success(`Class ${className} created successfully!`);
      setIsClassModalOpen(false);
      setClassName('');
      setClassOrder(1);
      loadAcademics();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create class';
      toast.error(msg);
    } finally {
      setIsSavingClass(false);
    }
  };

  // Create Section
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName.trim()) return;

    setIsSavingSection(true);
    try {
      await academicService.createSection(sectionName.trim());
      toast.success(`Section ${sectionName.toUpperCase()} created successfully!`);
      setIsSectionModalOpen(false);
      setSectionName('');
      loadAcademics();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create section';
      toast.error(msg);
    } finally {
      setIsSavingSection(false);
    }
  };

  // Create Subject
  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !subjectCode.trim()) return;

    setIsSavingSubject(true);
    try {
      await academicService.createSubject({
        name: subjectName.trim(),
        code: subjectCode.trim().toUpperCase(),
        description: subjectDesc.trim() || null,
        is_active: true,
      });
      toast.success(`Subject ${subjectName} (${subjectCode}) created!`);
      setIsSubjectModalOpen(false);
      setSubjectName('');
      setSubjectCode('');
      setSubjectDesc('');
      loadAcademics();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create subject';
      toast.error(msg);
    } finally {
      setIsSavingSubject(false);
    }
  };

  // Map Subject to Class
  const handleMapSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !selectedSubjectId) return;

    setIsSavingMap(true);
    try {
      await academicService.assignSubjectToClass(selectedClassId, selectedSubjectId);
      toast.success('Subject mapped to class successfully!');
      setIsMapSubjectModalOpen(false);
      setSelectedClassId('');
      setSelectedSubjectId('');
      loadAcademics();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to map subject';
      toast.error(msg);
    } finally {
      setIsSavingMap(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-brand-600" />
            Academic Structure
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Configure academic years, classes, sections, and curriculum subjects
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadAcademics}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Structure
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('years')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'years'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Academic Years ({academicYears.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'classes'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Classes & Sections ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'subjects'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Subjects & Curriculum ({subjects.length})</span>
        </button>
      </div>

      {/* Tab 1: Academic Years */}
      {activeTab === 'years' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Configured Academic Sessions
            </h3>
            <Button
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsYearModalOpen(true)}
            >
              Add Academic Year
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
            ) : academicYears.map((yr) => (
              <Card key={yr.id} className={yr.is_current ? 'border-brand-500 shadow-md ring-1 ring-brand-500/20' : ''}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-mono">{yr.name}</CardTitle>
                  {yr.is_current ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Current
                    </Badge>
                  ) : (
                    <Badge variant="outline">Historical</Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Session Period</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {new Date(yr.start_date).toLocaleDateString()} — {new Date(yr.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  {!yr.is_current && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => handleSetCurrentYear(yr.id, yr.name)}
                      >
                        Set as Current Year
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Classes & Sections */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Classes Column */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Classes</CardTitle>
                  <CardDescription>Academic standards/grades</CardDescription>
                </div>
                <Button size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsClassModalOpen(true)}>
                  Add Class
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {classes.map((cls) => (
                    <div key={cls.id} className="p-3.5 px-6 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-black flex items-center justify-center">
                          {cls.name}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">Standard {cls.name}</span>
                      </div>
                      <Badge variant="default">Order: {cls.numeric_order}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sections Column */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base">Sections</CardTitle>
                  <CardDescription>Class division letters ({sections.length})</CardDescription>
                </div>
                <Button size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsSectionModalOpen(true)}>
                  Add Section
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sections.map((sec) => (
                    <div key={sec.id} className="p-3.5 px-6 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Section {sec.name}</span>
                      <Badge variant="success">Active</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Class-Section Links */}
          {classSections.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Configured Class-Section Mappings</CardTitle>
                <CardDescription>Associated class standard divisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {classSections.map((cs) => (
                    <Badge key={cs.id} variant="default" className="text-xs">
                      Class {cs.class?.name} — Section {cs.section?.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tab 3: Subjects & Curriculum */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Curriculum Subjects</h3>
              <p className="text-xs text-slate-500">Subjects taught across standards at KKDGMS</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsMapSubjectModalOpen(true)}>
                Map to Class
              </Button>
              <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsSubjectModalOpen(true)}>
                Add Subject
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => {
              const mappedClasses = classSubjects.filter(cs => cs.subject_id === sub.id);

              return (
                <Card key={sub.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{sub.name}</CardTitle>
                      <Badge variant="info" className="font-mono">{sub.code}</Badge>
                    </div>
                    {sub.description && (
                      <CardDescription className="line-clamp-2 text-xs">{sub.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0 text-xs">
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Taught in:</span>
                      {mappedClasses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {mappedClasses.map(mc => (
                            <span key={mc.id} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                              Class {mc.class?.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">All Standards</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal 1: Add Academic Year */}
      <Modal
        isOpen={isYearModalOpen}
        onClose={() => setIsYearModalOpen(false)}
        title="Add Academic Year"
        description="Define a new academic session with start and end dates"
      >
        <form onSubmit={handleCreateYear} className="space-y-4 text-xs">
          <Input
            label="Year Identifier (e.g. 2026-2027)"
            placeholder="YYYY-YYYY"
            value={yearName}
            onChange={(e) => setYearName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isCurrentYear}
              onChange={(e) => setIsCurrentYear(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span className="font-medium text-slate-700 dark:text-slate-300">Set as Current Active Year</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsYearModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSavingYear}>
              Save Academic Year
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Add Class */}
      <Modal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        title="Add Class / Grade"
        description="Add a new academic standard"
      >
        <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
          <Input
            label="Class Name (e.g. 6, 7, 10, 12)"
            placeholder="10"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
          <Input
            label="Numeric Sort Order"
            type="number"
            value={classOrder}
            onChange={(e) => setClassOrder(Number(e.target.value))}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsClassModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSavingClass}>
              Save Class
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Add Section */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title="Add Section"
        description="Add a new section letter"
      >
        <form onSubmit={handleCreateSection} className="space-y-4 text-xs">
          <Input
            label="Section Name (e.g. A, B, C)"
            placeholder="A"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsSectionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSavingSection}>
              Save Section
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 4: Add Subject */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title="Add Subject"
        description="Define a new curriculum subject"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4 text-xs">
          <Input
            label="Subject Name"
            placeholder="e.g. Mathematics"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />
          <Input
            label="Subject Code (Unique)"
            placeholder="e.g. MAT-01"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            required
          />
          <Input
            label="Description (Optional)"
            placeholder="Brief overview of subject syllabus"
            value={subjectDesc}
            onChange={(e) => setSubjectDesc(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsSubjectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSavingSubject}>
              Save Subject
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 5: Map Subject to Class */}
      <Modal
        isOpen={isMapSubjectModalOpen}
        onClose={() => setIsMapSubjectModalOpen(false)}
        title="Map Subject to Class"
        description="Associate a subject with a standard class curriculum"
      >
        <form onSubmit={handleMapSubject} className="space-y-4 text-xs">
          <Select
            label="Select Class"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            required
          >
            <option value="">-- Choose Class --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.name}
              </option>
            ))}
          </Select>

          <Select
            label="Select Subject"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            required
          >
            <option value="">-- Choose Subject --</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </Select>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsMapSubjectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSavingMap}>
              Assign to Curriculum
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

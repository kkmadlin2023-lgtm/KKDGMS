import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { studentService } from '@/services/studentService';
import { academicService } from '@/services/academicService';
import { Student, StudentStatus, AcademicYear, SchoolClass, SchoolSection } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton, EmptyState, ErrorState } from '@/components/ui/Skeleton';
import {
  GraduationCap,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Camera,
  MapPin,
  Layers,
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const toast = useToast();

  // Data & List State
  const [students, setStudents] = useState<Student[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState<string>('');
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<SchoolSection[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<StudentStatus | 'ALL'>('ALL');

  // Modals & Action State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Student Form State
  const [formFullName, setFormFullName] = useState('');
  const [formAdmissionNo, setFormAdmissionNo] = useState('');
  const [formDob, setFormDob] = useState('');
  const [formGender, setFormGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [formAadhaar, setFormAadhaar] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formFatherName, setFormFatherName] = useState('');
  const [formMotherName, setFormMotherName] = useState('');
  const [formParentMobile, setFormParentMobile] = useState('');
  const [formDoorNo, setFormDoorNo] = useState('');
  const [formStreet, setFormStreet] = useState('');
  const [formPlace, setFormPlace] = useState('');
  const [formDistrict, setFormDistrict] = useState('Kanyakumari');
  const [formPincode, setFormPincode] = useState('');
  const [formStatus, setFormStatus] = useState<StudentStatus>('ACTIVE');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formYearId, setFormYearId] = useState('');
  const [formClassId, setFormClassId] = useState('');
  const [formSectionId, setFormSectionId] = useState('');
  const [formRollNo, setFormRollNo] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Load Dropdowns
  useEffect(() => {
    Promise.all([
      academicService.getAcademicYears(),
      academicService.getClasses(),
      academicService.getSections(),
    ]).then(([years, clsList, secList]) => {
      setAcademicYears(years);
      setClasses(clsList);
      setSections(secList);
      const curYear = years.find((y) => y.is_current);
      if (curYear) setFormYearId(curYear.id);
      if (clsList.length > 0) setFormClassId(clsList[0].id);
      if (secList.length > 0) setFormSectionId(secList[0].id);
    }).catch(console.warn);
  }, []);

  // Fetch Students
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await studentService.getStudents({
        page,
        pageSize,
        search,
        academicYearId: selectedYear,
        classId: selectedClass,
        sectionId: selectedSection,
        status: selectedStatus,
      });
      setStudents(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch student directory';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, selectedYear, selectedClass, selectedSection, selectedStatus, toast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setSelectedStudent(null);
    setFormFullName('');
    setFormAdmissionNo(`EMIS-${Date.now().toString().slice(-6)}`);
    setFormDob('2010-01-01');
    setFormGender('MALE');
    setFormAadhaar('');
    setFormEmail('');
    setFormMobile('');
    setFormFatherName('');
    setFormMotherName('');
    setFormParentMobile('');
    setFormDoorNo('');
    setFormStreet('');
    setFormPlace('');
    setFormDistrict('Kanyakumari');
    setFormPincode('629001');
    setFormStatus('ACTIVE');
    setFormPhotoUrl('');
    setFormRollNo('');
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (stu: Student) => {
    setIsEditing(true);
    setSelectedStudent(stu);
    setFormFullName(stu.full_name);
    setFormAdmissionNo(stu.admission_number);
    setFormDob(stu.dob);
    setFormGender(stu.gender);
    setFormAadhaar(stu.aadhaar || '');
    setFormEmail(stu.email || '');
    setFormMobile(stu.mobile || '');
    setFormFatherName(stu.father_name || '');
    setFormMotherName(stu.mother_name || '');
    setFormParentMobile(stu.parent_mobile || '');
    setFormDoorNo(stu.door_no || '');
    setFormStreet(stu.street_name || '');
    setFormPlace(stu.place || '');
    setFormDistrict(stu.district || 'Kanyakumari');
    setFormPincode(stu.pincode || '');
    setFormStatus(stu.status);
    setFormPhotoUrl(stu.photo_url || '');

    if (stu.current_enrollment) {
      setFormYearId(stu.current_enrollment.academic_year_id);
      setFormClassId(stu.current_enrollment.class_id);
      setFormSectionId(stu.current_enrollment.section_id);
      setFormRollNo(stu.current_enrollment.roll_number || '');
    }

    setIsFormModalOpen(true);
  };

  // View Details Modal
  const handleViewDetails = async (stu: Student) => {
    try {
      const full = await studentService.getStudentById(stu.id);
      setSelectedStudent(full || stu);
    } catch {
      setSelectedStudent(stu);
    }
    setIsDetailModalOpen(true);
  };

  // Upload Photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const url = await studentService.uploadStudentPhoto(file, formAdmissionNo || 'new');
      setFormPhotoUrl(url);
      toast.success('Photo uploaded successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Photo upload failed';
      toast.error(msg);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Submit Student Form
  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim() || !formAdmissionNo.trim() || !formDob) {
      toast.error('Please fill in required student identity fields');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && selectedStudent) {
        await studentService.updateStudent(selectedStudent.id, {
          full_name: formFullName.trim(),
          admission_number: formAdmissionNo.trim(),
          dob: formDob,
          gender: formGender,
          aadhaar: formAadhaar.trim() || null,
          email: formEmail.trim() || null,
          mobile: formMobile.trim() || null,
          father_name: formFatherName.trim() || null,
          mother_name: formMotherName.trim() || null,
          parent_mobile: formParentMobile.trim() || null,
          door_no: formDoorNo.trim() || null,
          street_name: formStreet.trim() || null,
          place: formPlace.trim() || null,
          district: formDistrict.trim() || null,
          pincode: formPincode.trim() || null,
          status: formStatus,
          photo_url: formPhotoUrl || null,
        });
        toast.success(`Student ${formFullName} updated successfully!`);
      } else {
        await studentService.createStudent(
          {
            full_name: formFullName.trim(),
            admission_number: formAdmissionNo.trim(),
            dob: formDob,
            gender: formGender,
            aadhaar: formAadhaar.trim() || null,
            email: formEmail.trim() || null,
            mobile: formMobile.trim() || null,
            father_name: formFatherName.trim() || null,
            mother_name: formMotherName.trim() || null,
            parent_mobile: formParentMobile.trim() || null,
            door_no: formDoorNo.trim() || null,
            street_name: formStreet.trim() || null,
            place: formPlace.trim() || null,
            district: formDistrict.trim() || null,
            state: 'Tamil Nadu',
            pincode: formPincode.trim() || null,
            status: formStatus,
            photo_url: formPhotoUrl || null,
          },
          {
            academic_year_id: formYearId,
            class_id: formClassId,
            section_id: formSectionId,
            roll_number: formRollNo,
          }
        );
        toast.success(`Student ${formFullName} enrolled successfully!`);
      }
      setIsFormModalOpen(false);
      fetchStudents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save student record';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const maskAadhaar = (aadhaar?: string | null) => {
    if (!aadhaar) return 'Not Provided';
    const clean = aadhaar.replace(/\s+/g, '');
    if (clean.length < 4) return 'XXXX XXXX XXXX';
    return `XXXX XXXX ${clean.slice(-4)}`;
  };

  const getStatusBadge = (status: StudentStatus) => {
    if (status === 'ACTIVE') return <Badge variant="success">Active</Badge>;
    if (status === 'GRADUATED') return <Badge variant="info">Graduated</Badge>;
    if (status === 'TRANSFERRED') return <Badge variant="warning">Transferred</Badge>;
    return <Badge variant="danger">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-brand-600" />
            Student Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Student master records, personal details, contact profiles, and academic placement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStudents}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={handleOpenCreateModal}>
            New Admission
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                placeholder="Search name, EMIS, mobile, father name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>

            {/* Academic Year Filter */}
            <Select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Academic Years</option>
              {academicYears.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} {y.is_current ? '(Current)' : ''}
                </option>
              ))}
            </Select>

            {/* Class Filter */}
            <Select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Class {c.name}
                </option>
              ))}
            </Select>

            {/* Section Filter */}
            <Select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Sections</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  Section {s.name}
                </option>
              ))}
            </Select>

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as StudentStatus | 'ALL');
                setPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="TRANSFERRED">Transferred</option>
              <option value="GRADUATED">Graduated</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Student Directory Table / Cards */}
      <Card>
        <CardContent className="p-0 sm:p-2">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6">
              <ErrorState title="Failed to load students" message={error} onRetry={fetchStudents} />
            </div>
          ) : students.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-700" />}
                title="No Students Found"
                description="No student admission records match the selected search or filter criteria in the database."
                action={{
                  label: 'Add First Student',
                  onClick: handleOpenCreateModal,
                }}
              />
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="p-4 pl-6">Student Profile</th>
                      <th className="p-4">Class & Section</th>
                      <th className="p-4">Gender</th>
                      <th className="p-4">Parent / Guardian</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {students.map((stu) => {
                      const initials = stu.full_name.slice(0, 2).toUpperCase();
                      const enrollment = stu.current_enrollment;

                      return (
                        <tr key={stu.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                                {stu.photo_url ? (
                                  <img src={stu.photo_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  initials
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {stu.full_name}
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">
                                  EMIS: {stu.admission_number}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            {enrollment ? (
                              <div className="font-semibold text-slate-800 dark:text-slate-200">
                                Standard {enrollment.class?.name || '—'} - {enrollment.section?.name || '—'}
                                <span className="block text-[10px] text-slate-400 font-normal">
                                  {enrollment.academic_year?.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Not Enrolled</span>
                            )}
                          </td>
                          <td className="p-4 font-medium text-slate-600 dark:text-slate-300 capitalize">
                            {stu.gender.toLowerCase()}
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300">
                            {stu.father_name || stu.mother_name || '—'}
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">
                            {stu.mobile || stu.parent_mobile || '—'}
                          </td>
                          <td className="p-4">{getStatusBadge(stu.status)}</td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleViewDetails(stu)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="View Full Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(stu)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Edit Student"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-3">
                {students.map((stu) => {
                  const initials = stu.full_name.slice(0, 2).toUpperCase();
                  const enrollment = stu.current_enrollment;

                  return (
                    <div key={stu.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {stu.photo_url ? (
                              <img src={stu.photo_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white block">
                              {stu.full_name}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">EMIS: {stu.admission_number}</span>
                          </div>
                        </div>
                        {getStatusBadge(stu.status)}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Class {enrollment?.class?.name || '—'} ({enrollment?.section?.name || '—'})
                        </span>
                        <span className="text-slate-500">{stu.mobile || stu.parent_mobile || 'No contact'}</span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(stu)}>
                          Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditModal(stu)}>
                          Edit
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal 1: Create / Edit Student */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={isEditing ? 'Edit Student Record' : 'New Student Admission'}
        description="Fill in official school registration details, address, and academic placement"
        size="xl"
      >
        <form onSubmit={handleSubmitStudent} className="space-y-5 text-xs">
          {/* Photo Section */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center overflow-hidden">
                {formPhotoUrl ? (
                  <img src={formPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  (formFullName || 'ST').slice(0, 2).toUpperCase()
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute inset-0 rounded-2xl bg-slate-950/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Student Passport Photo</span>
              <p className="text-[11px] text-slate-500">Upload clean passport photo (JPG/PNG, max 2MB)</p>
            </div>
          </div>

          {/* Section A: Personal Information */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] border-b pb-1">
              1. Personal Identity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Full Name *"
                value={formFullName}
                onChange={(e) => setFormFullName(e.target.value)}
                required
              />
              <Input
                label="Admission / EMIS No *"
                value={formAdmissionNo}
                onChange={(e) => setFormAdmissionNo(e.target.value)}
                required
              />
              <Input
                label="Date of Birth *"
                type="date"
                value={formDob}
                onChange={(e) => setFormDob(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Gender *"
                value={formGender}
                onChange={(e) => setFormGender(e.target.value as 'MALE' | 'FEMALE' | 'OTHER')}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </Select>
              <Input
                label="Aadhaar Number"
                placeholder="12 digit Aadhaar"
                value={formAadhaar}
                onChange={(e) => setFormAadhaar(e.target.value)}
              />
              <Select
                label="Student Status"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as StudentStatus)}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="TRANSFERRED">Transferred</option>
                <option value="GRADUATED">Graduated</option>
              </Select>
            </div>
          </div>

          {/* Section B: Parent & Contact Information */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] border-b pb-1">
              2. Parent & Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Father's Name"
                value={formFatherName}
                onChange={(e) => setFormFatherName(e.target.value)}
              />
              <Input
                label="Mother's Name"
                value={formMotherName}
                onChange={(e) => setFormMotherName(e.target.value)}
              />
              <Input
                label="Parent Mobile"
                type="tel"
                value={formParentMobile}
                onChange={(e) => setFormParentMobile(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Student Email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
              <Input
                label="Student Mobile"
                type="tel"
                value={formMobile}
                onChange={(e) => setFormMobile(e.target.value)}
              />
            </div>
          </div>

          {/* Section C: Residential Address */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] border-b pb-1">
              3. Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Door / House No" value={formDoorNo} onChange={(e) => setFormDoorNo(e.target.value)} />
              <Input label="Street Name" value={formStreet} onChange={(e) => setFormStreet(e.target.value)} />
              <Input label="Place / Village" value={formPlace} onChange={(e) => setFormPlace(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="District" value={formDistrict} onChange={(e) => setFormDistrict(e.target.value)} />
              <Input label="State" value="Tamil Nadu" disabled />
              <Input label="Pincode" value={formPincode} onChange={(e) => setFormPincode(e.target.value)} />
            </div>
          </div>

          {/* Section D: Academic Placement */}
          {!isEditing && (
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] border-b pb-1">
                4. Initial Academic Enrollment
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Select
                  label="Academic Session *"
                  value={formYearId}
                  onChange={(e) => setFormYearId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Year --</option>
                  {academicYears.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name} {y.is_current ? '(Current)' : ''}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Class / Grade *"
                  value={formClassId}
                  onChange={(e) => setFormClassId(e.target.value)}
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
                  label="Section *"
                  value={formSectionId}
                  onChange={(e) => setFormSectionId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Section --</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Roll Number (Optional)"
                  placeholder="e.g. 101"
                  value={formRollNo}
                  onChange={(e) => setFormRollNo(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSaving}>
              {isEditing ? 'Save Changes' : 'Confirm Admission'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: View Student Details */}
      {selectedStudent && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Student Information Profile"
          description={`Official student records for ${selectedStudent.full_name}`}
          size="lg"
          footer={
            <Button size="sm" variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close Profile
            </Button>
          }
        >
          <div className="space-y-5 text-xs">
            {/* Summary Top Card */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
                {selectedStudent.photo_url ? (
                  <img src={selectedStudent.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  selectedStudent.full_name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedStudent.full_name}
                  </h4>
                  {getStatusBadge(selectedStudent.status)}
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                  <span>EMIS: {selectedStudent.admission_number}</span>
                  <span>•</span>
                  <span>DOB: {new Date(selectedStudent.dob).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="capitalize">{selectedStudent.gender.toLowerCase()}</span>
                </div>
              </div>
            </div>

            {/* Academic Placement */}
            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase text-[11px]">
                <Layers className="w-4 h-4 text-brand-600" /> Current Academic Placement
              </h5>
              {selectedStudent.current_enrollment ? (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Academic Year</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedStudent.current_enrollment.academic_year?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Standard & Section</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Class {selectedStudent.current_enrollment.class?.name} - {selectedStudent.current_enrollment.section?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Roll Number</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {selectedStudent.current_enrollment.roll_number || 'N/A'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 italic">No active academic enrollment assigned.</p>
              )}
            </div>

            {/* Parents & Contacts */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Father's Name</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedStudent.father_name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mother's Name</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedStudent.mother_name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Parent Contact Phone</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedStudent.parent_mobile || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Contact</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedStudent.mobile || selectedStudent.email || '—'}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Aadhaar (Masked)</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{maskAadhaar(selectedStudent.aadhaar)}</span>
              </div>
            </div>

            {/* Address */}
            <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">Permanent Residence:</span>
                {[
                  selectedStudent.door_no,
                  selectedStudent.street_name,
                  selectedStudent.place,
                  selectedStudent.district,
                  selectedStudent.state,
                  selectedStudent.pincode,
                ]
                  .filter(Boolean)
                  .join(', ') || 'No address specified'}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

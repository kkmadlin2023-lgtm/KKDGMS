import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { facultyService } from '@/services/facultyService';
import { FacultyMember, FacultyStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton, EmptyState, ErrorState } from '@/components/ui/Skeleton';
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Camera,
  Mail,
  Phone,
  Briefcase,
  Award,
} from 'lucide-react';

export const FacultyPage: React.FC = () => {
  const toast = useToast();

  // List & Filter State
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<FacultyStatus | 'ALL'>('ALL');

  // Modal State
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formDepartment, setFormDepartment] = useState('Tamil');
  const [formQualification, setFormQualification] = useState('');
  const [formDesignation, setFormDesignation] = useState('PG Assistant');
  const [formGender, setFormGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [formDob, setFormDob] = useState('');
  const [formStatus, setFormStatus] = useState<FacultyStatus>('ACTIVE');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Fetch Faculty List
  const fetchFaculty = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await facultyService.getFaculty({
        page,
        pageSize,
        search,
        department: departmentFilter,
        status: statusFilter,
      });
      setFaculty(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch faculty records';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, departmentFilter, statusFilter, toast]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  // Open Create Form
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setSelectedFaculty(null);
    setFormEmployeeId(`FAC-${Date.now().toString().slice(-4)}`);
    setFormFullName('');
    setFormEmail('');
    setFormMobile('');
    setFormDepartment('Tamil');
    setFormQualification('M.A., B.Ed.');
    setFormDesignation('PG Assistant');
    setFormGender('MALE');
    setFormDob('1985-05-15');
    setFormStatus('ACTIVE');
    setFormPhotoUrl('');
    setIsFormModalOpen(true);
  };

  // Open Edit Form
  const handleOpenEditModal = (member: FacultyMember) => {
    setIsEditing(true);
    setSelectedFaculty(member);
    setFormEmployeeId(member.employee_id);
    setFormFullName(member.full_name);
    setFormEmail(member.email);
    setFormMobile(member.mobile || '');
    setFormDepartment(member.department);
    setFormQualification(member.qualification || '');
    setFormDesignation(member.designation || 'Teacher');
    setFormGender((member.gender as 'MALE' | 'FEMALE' | 'OTHER') || 'MALE');
    setFormDob(member.dob || '');
    setFormStatus(member.status);
    setFormPhotoUrl(member.photo_url || '');
    setIsFormModalOpen(true);
  };

  // Upload Photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const url = await facultyService.uploadFacultyPhoto(file, formEmployeeId || 'new');
      setFormPhotoUrl(url);
      toast.success('Faculty photo uploaded!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload photo';
      toast.error(msg);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Submit Faculty Form
  const handleSubmitFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFullName.trim() || !formEmployeeId.trim() || !formEmail.trim()) {
      toast.error('Please fill in all required faculty identity fields');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && selectedFaculty) {
        await facultyService.updateFaculty(selectedFaculty.id, {
          employee_id: formEmployeeId.trim(),
          full_name: formFullName.trim(),
          email: formEmail.trim(),
          mobile: formMobile.trim() || null,
          department: formDepartment.trim(),
          qualification: formQualification.trim() || null,
          designation: formDesignation.trim() || null,
          gender: formGender,
          dob: formDob || null,
          status: formStatus,
          photo_url: formPhotoUrl || null,
        });
        toast.success(`Faculty ${formFullName} updated!`);
      } else {
        await facultyService.createFaculty({
          employee_id: formEmployeeId.trim(),
          full_name: formFullName.trim(),
          email: formEmail.trim(),
          mobile: formMobile.trim() || null,
          department: formDepartment.trim(),
          qualification: formQualification.trim() || null,
          designation: formDesignation.trim() || null,
          gender: formGender,
          dob: formDob || null,
          status: formStatus,
          photo_url: formPhotoUrl || null,
        });
        toast.success(`Faculty ${formFullName} registered successfully!`);
      }
      setIsFormModalOpen(false);
      fetchFaculty();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save faculty record';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const departments = ['Tamil', 'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Social Science', 'Physical Education'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-brand-600" />
            Faculty Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Teaching staff directory, departmental roles, academic qualifications, and profile records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFaculty}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={handleOpenCreateModal}>
            Add Faculty
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search by faculty name, employee ID, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <Select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  Department of {d}
                </option>
              ))}
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as FacultyStatus | 'ALL');
                setPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Faculty Directory Table / Cards */}
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
              <ErrorState title="Failed to load faculty records" message={error} onRetry={fetchFaculty} />
            </div>
          ) : faculty.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Users className="w-12 h-12 text-slate-300 dark:text-slate-700" />}
                title="No Faculty Members Found"
                description="No faculty records match the selected filter criteria in the database."
                action={{
                  label: 'Add First Faculty',
                  onClick: handleOpenCreateModal,
                }}
              />
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="p-4 pl-6">Faculty Profile</th>
                      <th className="p-4">Department & Role</th>
                      <th className="p-4">Qualification</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {faculty.map((f) => {
                      const initials = f.full_name.slice(0, 2).toUpperCase();

                      return (
                        <tr key={f.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                                {f.photo_url ? (
                                  <img src={f.photo_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  initials
                                )}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {f.full_name}
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">
                                  ID: {f.employee_id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                              {f.department}
                            </span>
                            <span className="text-[10px] text-slate-400">{f.designation || 'Teacher'}</span>
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                            {f.qualification || '—'}
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-300">{f.email}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{f.mobile || '—'}</td>
                          <td className="p-4">
                            <Badge variant={f.status === 'ACTIVE' ? 'success' : 'danger'}>
                              {f.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedFaculty(f);
                                  setIsDetailModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(f)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Edit Faculty"
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
                {faculty.map((f) => {
                  const initials = f.full_name.slice(0, 2).toUpperCase();

                  return (
                    <div key={f.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {f.photo_url ? (
                              <img src={f.photo_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white block">
                              {f.full_name}
                            </span>
                            <span className="text-[11px] text-brand-600 font-semibold">{f.department}</span>
                          </div>
                        </div>
                        <Badge variant={f.status === 'ACTIVE' ? 'success' : 'danger'}>
                          {f.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500">{f.email}</span>
                        <span className="font-mono text-[10px] text-slate-400">ID: {f.employee_id}</span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedFaculty(f);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditModal(f)}>
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

      {/* Modal 1: Create / Edit Faculty */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={isEditing ? 'Edit Faculty Record' : 'Register Faculty Member'}
        description="Fill in teaching staff professional details, department, and contact information"
        size="lg"
      >
        <form onSubmit={handleSubmitFaculty} className="space-y-4 text-xs">
          {/* Photo Section */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center overflow-hidden">
                {formPhotoUrl ? (
                  <img src={formPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  (formFullName || 'FC').slice(0, 2).toUpperCase()
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
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Faculty Photo</span>
              <p className="text-[11px] text-slate-500">Official passport photo (JPG/PNG, max 2MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Full Name *"
              placeholder="e.g. Dr. K. Arul Murugan"
              value={formFullName}
              onChange={(e) => setFormFullName(e.target.value)}
              required
            />
            <Input
              label="Employee ID *"
              placeholder="e.g. FAC-1021"
              value={formEmployeeId}
              onChange={(e) => setFormEmployeeId(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Official Email *"
              type="email"
              placeholder="faculty@kkdgms.edu.in"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
            />
            <Input
              label="Contact Mobile"
              type="tel"
              placeholder="+91 9876543210"
              value={formMobile}
              onChange={(e) => setFormMobile(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Department *"
              value={formDepartment}
              onChange={(e) => setFormDepartment(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  Department of {d}
                </option>
              ))}
            </Select>

            <Input
              label="Designation"
              placeholder="e.g. PG Assistant / Headmaster"
              value={formDesignation}
              onChange={(e) => setFormDesignation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Academic Qualification"
              placeholder="e.g. M.Sc., M.Ed., Ph.D."
              value={formQualification}
              onChange={(e) => setFormQualification(e.target.value)}
            />
            <Select
              label="Gender"
              value={formGender}
              onChange={(e) => setFormGender(e.target.value as 'MALE' | 'FEMALE' | 'OTHER')}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Select>
            <Select
              label="Status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as FacultyStatus)}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSaving}>
              {isEditing ? 'Save Changes' : 'Register Faculty'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: View Details */}
      {selectedFaculty && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Faculty Profile"
          description={`Teaching staff record for ${selectedFaculty.full_name}`}
          size="md"
          footer={
            <Button size="sm" variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
                {selectedFaculty.photo_url ? (
                  <img src={selectedFaculty.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  selectedFaculty.full_name.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedFaculty.full_name}
                </h4>
                <p className="text-brand-600 font-semibold">{selectedFaculty.designation || 'Teacher'} — {selectedFaculty.department}</p>
                <div className="flex items-center gap-2 pt-0.5">
                  <Badge variant={selectedFaculty.status === 'ACTIVE' ? 'success' : 'danger'}>
                    {selectedFaculty.status}
                  </Badge>
                  <span className="font-mono text-[10px] text-slate-400">ID: {selectedFaculty.employee_id}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedFaculty.email}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Mobile</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedFaculty.mobile || '—'}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Qualifications</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedFaculty.qualification || '—'}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Department</span>
                <span className="font-semibold text-brand-600">{selectedFaculty.department}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { userService } from '@/services/userService';
import { UserProfile, UserRole, UserStatus, RoleDefinition, AuditLogEntry } from '@/types';
import { formatUserRole } from '@/lib/utils';
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
  RefreshCw,
  Shield,
  AlertTriangle,
  Eye,
  UserCheck,
  UserX,
  History,
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { role: currentUserRole } = useAuth();
  const toast = useToast();

  // Data & List State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [rolesList, setRolesList] = useState<RoleDefinition[]>([]);

  // Action Modals State
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [userAuditLogs, setUserAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState<boolean>(false);

  // Role Change Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [targetRole, setTargetRole] = useState<UserRole>('STUDENT');
  const [isUpdatingRole, setIsUpdatingRole] = useState<boolean>(false);

  // Status Change Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [targetStatus, setTargetStatus] = useState<UserStatus>('ACTIVE');
  const [suspensionReason, setSuspensionReason] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Fetch Roles
  useEffect(() => {
    userService.getRoles().then(setRolesList).catch(console.warn);
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.getUsers({
        page,
        pageSize,
        search,
        role: roleFilter,
        status: statusFilter,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });
      setUsers(result.data);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch user directory';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, roleFilter, statusFilter, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // View User Details
  const handleViewDetails = async (user: UserProfile) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
    setIsLoadingAudit(true);
    try {
      const logs = await userService.getAuditLogsForUser(user.id);
      setUserAuditLogs(logs);
    } catch (e) {
      setUserAuditLogs([]);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  // Open Role Change Modal
  const handleOpenRoleModal = (user: UserProfile) => {
    setSelectedUser(user);
    setTargetRole(user.role);
    setIsRoleModalOpen(true);
  };

  // Submit Role Change
  const handleSubmitRoleChange = async () => {
    if (!selectedUser) return;
    if (selectedUser.role === targetRole) {
      setIsRoleModalOpen(false);
      return;
    }

    setIsUpdatingRole(true);
    try {
      await userService.updateUserRole(selectedUser.id, targetRole);
      toast.success(`Role for ${selectedUser.full_name || selectedUser.email} updated to ${targetRole}`);
      setIsRoleModalOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update role';
      toast.error(msg);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Open Status Change Modal
  const handleOpenStatusModal = (user: UserProfile, newStatus: UserStatus) => {
    setSelectedUser(user);
    setTargetStatus(newStatus);
    setSuspensionReason('');
    setIsStatusModalOpen(true);
  };

  // Submit Status Change
  const handleSubmitStatusChange = async () => {
    if (!selectedUser) return;

    if (targetStatus === 'SUSPENDED' && !suspensionReason.trim()) {
      toast.error('Please provide an administrative reason for account suspension');
      return;
    }

    setIsUpdatingStatus(true);
    try {
      await userService.updateUserStatus(selectedUser.id, targetStatus, suspensionReason.trim());
      toast.success(`Account status for ${selectedUser.full_name || selectedUser.email} set to ${targetStatus}`);
      setIsStatusModalOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update account status';
      toast.error(msg);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    if (status === 'ACTIVE') return <Badge variant="success">Active</Badge>;
    if (status === 'SUSPENDED') return <Badge variant="danger">Suspended</Badge>;
    return <Badge variant="warning">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-brand-600" />
            User Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage system identities, assign role permissions, and control account active status
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Directory
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                placeholder="Search by name, email, phone, or User ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>

            {/* Role Filter */}
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as UserRole | 'ALL');
                setPage(1);
              }}
            >
              <option value="ALL">All Roles</option>
              {rolesList.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name} ({r.code})
                </option>
              ))}
            </Select>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as UserStatus | 'ALL');
                setPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Directory Container */}
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
              <ErrorState title="Failed to load users" message={error} onRetry={fetchUsers} />
            </div>
          ) : users.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Users className="w-12 h-12 text-slate-300 dark:text-slate-700" />}
                title="No Users Found"
                description="No user accounts match the current search or filter criteria in the database."
                action={{
                  label: 'Clear Filters',
                  onClick: () => {
                    setSearch('');
                    setRoleFilter('ALL');
                    setStatusFilter('ALL');
                    setPage(1);
                  },
                }}
              />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="p-4 pl-6">User / Profile</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Created</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u) => {
                      const initials = (u.full_name || u.email || 'U').slice(0, 2).toUpperCase();
                      const isSuperAdmin = u.role === 'SUPER_ADMIN';
                      const canModify = currentUserRole === 'SUPER_ADMIN' || !isSuperAdmin;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                                {u.avatar_url ? (
                                  <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  initials
                                )}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white block">
                                  {u.full_name || '—'}
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">
                                  ID: {u.user_id || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{u.email}</td>
                          <td className="p-4">
                            <Badge variant="role" roleType={u.role}>
                              {formatUserRole(u.role)}
                            </Badge>
                          </td>
                          <td className="p-4">{getStatusBadge(u.status)}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{u.phone || '—'}</td>
                          <td className="p-4 text-slate-500">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Details Button */}
                              <button
                                onClick={() => handleViewDetails(u)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="View User Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Change Role Button */}
                              <button
                                onClick={() => handleOpenRoleModal(u)}
                                disabled={!canModify}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Change Role"
                              >
                                <Shield className="w-4 h-4" />
                              </button>

                              {/* Status Toggle / Suspend Controls */}
                              {u.status === 'ACTIVE' ? (
                                <>
                                  <button
                                    onClick={() => handleOpenStatusModal(u, 'INACTIVE')}
                                    disabled={!canModify}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Deactivate Account"
                                  >
                                    <UserX className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenStatusModal(u, 'SUSPENDED')}
                                    disabled={!canModify}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Suspend Account"
                                  >
                                    <AlertTriangle className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleOpenStatusModal(u, 'ACTIVE')}
                                  disabled={!canModify}
                                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                  title="Activate / Reactivate Account"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-3">
                {users.map((u) => {
                  const initials = (u.full_name || u.email || 'U').slice(0, 2).toUpperCase();
                  const isSuperAdmin = u.role === 'SUPER_ADMIN';
                  const canModify = currentUserRole === 'SUPER_ADMIN' || !isSuperAdmin;

                  return (
                    <div key={u.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white block">
                              {u.full_name || '—'}
                            </span>
                            <span className="text-xs text-slate-500 block">{u.email}</span>
                          </div>
                        </div>
                        {getStatusBadge(u.status)}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <Badge variant="role" roleType={u.role}>
                          {formatUserRole(u.role)}
                        </Badge>
                        <span className="font-mono text-[10px] text-slate-400">ID: {u.user_id || 'N/A'}</span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(u)}>
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenRoleModal(u)}
                          disabled={!canModify}
                        >
                          Role
                        </Button>
                        {u.status === 'ACTIVE' ? (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleOpenStatusModal(u, 'SUSPENDED')}
                            disabled={!canModify}
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleOpenStatusModal(u, 'ACTIVE')}
                            disabled={!canModify}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Bar */}
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

      {/* Modal 1: User Details & Audit Trail */}
      {selectedUser && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Account Details"
          description={`Identity information for ${selectedUser.full_name || selectedUser.email}`}
          size="lg"
          footer={
            <Button size="sm" variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-5 text-xs">
            {/* User Overview */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-md">
                {selectedUser.avatar_url ? (
                  <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  (selectedUser.full_name || selectedUser.email || 'U').slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedUser.full_name || 'Unnamed User'}
                </h4>
                <p className="text-slate-500">{selectedUser.email}</p>
                <div className="flex items-center gap-2 pt-0.5">
                  <Badge variant="role" roleType={selectedUser.role}>
                    {formatUserRole(selectedUser.role)}
                  </Badge>
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">User ID</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {selectedUser.user_id || '—'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Phone</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {selectedUser.phone || '—'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Account Created</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : '—'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Last Login</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {selectedUser.last_login_at ? new Date(selectedUser.last_login_at).toLocaleString() : '—'}
                </span>
              </div>
            </div>

            {selectedUser.status === 'SUSPENDED' && selectedUser.suspension_reason && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300">
                <span className="font-bold block mb-0.5">Suspension Reason:</span>
                <p>{selectedUser.suspension_reason}</p>
              </div>
            )}

            {/* Audit Trail Section */}
            <div className="space-y-2 pt-2">
              <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <History className="w-4 h-4 text-brand-600" />
                Account Audit Trail
              </h5>

              {isLoadingAudit ? (
                <Skeleton className="h-20 w-full" />
              ) : userAuditLogs.length === 0 ? (
                <p className="text-slate-400 italic text-[11px]">No audit logs recorded for this account yet.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                  {userAuditLogs.map((log) => (
                    <div key={log.id} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-semibold text-brand-600 uppercase mr-2">{log.action}</span>
                        <span className="text-slate-500">
                          {log.details ? JSON.stringify(log.details) : '—'}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[10px] flex-shrink-0 ml-2">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 2: Change Role */}
      {selectedUser && (
        <Modal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          title="Change User Role"
          description={`Select a new system role for ${selectedUser.full_name || selectedUser.email}`}
          footer={
            <>
              <Button size="sm" variant="ghost" onClick={() => setIsRoleModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" isLoading={isUpdatingRole} onClick={handleSubmitRoleChange}>
                Confirm Role Change
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 text-purple-900 dark:text-purple-200">
              <div className="font-semibold mb-1">Current Role: {formatUserRole(selectedUser.role)}</div>
              <p className="text-[11px] text-purple-700 dark:text-purple-300">
                Changing a user role immediately alters their permissions and access privileges across KKDGMS CORE.
              </p>
            </div>

            <Select
              label="Select New Role"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as UserRole)}
            >
              {rolesList.map((r) => {
                // Prevent non-superadmins from selecting SUPER_ADMIN
                const isOptionDisabled = r.code === 'SUPER_ADMIN' && currentUserRole !== 'SUPER_ADMIN';
                return (
                  <option key={r.code} value={r.code} disabled={isOptionDisabled}>
                    {r.name} ({r.code}) {isOptionDisabled ? '— Super Admin Only' : ''}
                  </option>
                );
              })}
            </Select>
          </div>
        </Modal>
      )}

      {/* Modal 3: Account Status Control */}
      {selectedUser && (
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title={`Set Status: ${targetStatus}`}
          description={`Update account state for ${selectedUser.full_name || selectedUser.email}`}
          footer={
            <>
              <Button size="sm" variant="ghost" onClick={() => setIsStatusModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant={targetStatus === 'ACTIVE' ? 'primary' : 'danger'}
                isLoading={isUpdatingStatus}
                onClick={handleSubmitStatusChange}
              >
                Confirm {targetStatus}
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            {targetStatus === 'SUSPENDED' && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Account Suspension Warning</span>
                </div>
                <p className="text-[11px]">
                  Suspending this user will immediately block their access to all KKDGMS protected portals and active sessions.
                </p>
              </div>
            )}

            {targetStatus === 'INACTIVE' && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200">
                Deactivating this account prevents future logins while preserving user records in the school database.
              </div>
            )}

            {targetStatus === 'ACTIVE' && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                Activating this account restores standard login permissions and role access.
              </div>
            )}

            {targetStatus === 'SUSPENDED' && (
              <Input
                label="Reason for Suspension (Required)"
                placeholder="e.g. Administrative review pending, disciplinary action..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                required
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

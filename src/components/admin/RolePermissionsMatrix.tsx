// =====================================================================
// KKDGMS — Admin Dynamic Role-to-Page Permission Matrix
// =====================================================================

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Check,
  X,
  Save,
  RefreshCw,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { RolePagePermission, UserRole } from '../../types';
import { api } from '../../lib/supabase';

export const RolePermissionsMatrix: React.FC = () => {
  const [permissions, setPermissions] = useState<RolePagePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>('faculty');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    const list = await api.getRolePermissions();
    setPermissions(list);
  };

  const togglePermission = (id: string, field: keyof RolePagePermission) => {
    const updated = permissions.map((p) => {
      if (p.id === id) {
        return { ...p, [field]: !p[field] };
      }
      return p;
    });
    setPermissions(updated);
  };

  const handleSave = async () => {
    for (const p of permissions) {
      await api.updateRolePermission(p.id, p);
    }
    await api.logAudit({
      user_id: 'ADMIN',
      email: 'principal@kkdgms.edu.in',
      role: 'admin',
      action: `Updated role-to-page permission rules for ${selectedRole.toUpperCase()}`,
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent,
      status: 'SUCCESS'
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const roleFilteredPermissions = permissions.filter((p) => p.role === selectedRole);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900">Role & Page Permission Authorization Matrix</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure dynamic database-driven authorizations (View, Create, Edit, Delete, Approve, Publish, Export) across ERP pages.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-bold">
          Permission matrix successfully updated and synchronized to Supabase security engine.
        </div>
      )}

      {/* Role Switcher */}
      <div className="flex gap-2">
        {(['faculty', 'student', 'warden', 'technician', 'guest'] as UserRole[]).map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRole(r)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              selectedRole === r
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="p-3">Page Name</th>
              <th className="p-3 text-center">Can View</th>
              <th className="p-3 text-center">Can Create</th>
              <th className="p-3 text-center">Can Edit</th>
              <th className="p-3 text-center">Can Delete</th>
              <th className="p-3 text-center">Can Approve</th>
              <th className="p-3 text-center">Can Publish</th>
              <th className="p-3 text-center">Can Export</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roleFilteredPermissions.map((perm) => (
              <tr key={perm.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{perm.page_name}</td>
                {(['can_view', 'can_create', 'can_edit', 'can_delete', 'can_approve', 'can_publish', 'can_export'] as Array<keyof RolePagePermission>).map((field) => (
                  <td key={field} className="p-3 text-center">
                    <button
                      onClick={() => togglePermission(perm.id, field)}
                      className={`w-7 h-7 rounded-lg border inline-flex items-center justify-center transition-all cursor-pointer ${
                        perm[field]
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      {perm[field] ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

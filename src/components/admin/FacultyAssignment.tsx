import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Users,
  BookOpen,
  Calendar
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { Faculty, FacultyAssignment as AssignmentType } from '../../types';

export const FacultyAssignment: React.FC = () => {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    faculty_id: '',
    faculty_name: '',
    subject: 'Mathematics',
    student_class: '12',
    section: 'A',
    periods_per_week: 6
  });

  const loadData = () => {
    Promise.all([
      api.getFaculty(),
      api.getFacultyAssignments()
    ]).then(([fac, ass]) => {
      setFacultyList(fac);
      setAssignments(ass);
      if (fac.length > 0 && !form.faculty_id) {
        setForm(prev => ({
          ...prev,
          faculty_id: fac[0].id,
          faculty_name: fac[0].full_name
        }));
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFacultyChange = (id: string) => {
    const found = facultyList.find(f => f.id === id);
    setForm(prev => ({
      ...prev,
      faculty_id: id,
      faculty_name: found ? found.full_name : ''
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.faculty_name) return;

    await api.addFacultyAssignment({
      ...form,
      academic_year: '2024-2025'
    });
    setShowModal(false);
    loadData();
    setToast('Subject assignment committed to Supabase!');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <GitBranch className="w-4 h-4" />
              <span>Teaching Load & Period Allocations</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Faculty Subject Allocation Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Managed in <span className="font-mono font-semibold">public.faculty_assignments</span> for Tamil Nadu State Board curriculum.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Subject / Class</span>
          </button>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Active Teaching Allocations ({assignments.length} Course Units)
          </span>
          <span className="text-xs text-slate-500 font-mono">Academic Year 2024-2025</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="p-3.5">Faculty In-Charge</th>
                <th className="p-3.5">Assigned Subject</th>
                <th className="p-3.5">Standard & Section</th>
                <th className="p-3.5">Workload</th>
                <th className="p-3.5">Curriculum Scheme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {assignments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-900">
                    {item.faculty_name}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                      {item.subject}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
                      Standard {item.student_class}-{item.section}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="font-bold text-slate-900">{item.periods_per_week || 6}</span> Periods/Week
                  </td>
                  <td className="p-3.5 text-slate-500">
                    Samacheer Kalvi / TN Board
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Allocate Subject to Faculty Member
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Faculty Member *</label>
                <select
                  value={form.faculty_id}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-semibold"
                >
                  {facultyList.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.full_name} ({f.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard</label>
                  <select
                    value={form.student_class}
                    onChange={(e) => setForm({ ...form, student_class: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="12">Std 12</option>
                    <option value="11">Std 11</option>
                    <option value="10">Std 10</option>
                    <option value="9">Std 9</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section</label>
                  <select
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Weekly Periods</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={form.periods_per_week}
                  onChange={(e) => setForm({ ...form, periods_per_week: Number(e.target.value) || 6 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 cursor-pointer"
              >
                Save Allocation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

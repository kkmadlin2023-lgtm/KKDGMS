import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Trash2,
  Edit2,
  Eye,
  GraduationCap,
  Users,
  Home,
  Shield,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  X
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { Student, Faculty, Warden, AdminUser } from '../../types';

interface DatabaseProps {
  onNavigateAdmission: () => void;
}

export const StudentFacultyDatabase: React.FC<DatabaseProps> = ({ onNavigateAdmission }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty' | 'wardens' | 'admins'>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [wardens, setWardens] = useState<Warden[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    Promise.all([
      api.getStudents(),
      api.getFaculty(),
      api.getWardens(),
      api.getAdmins()
    ]).then(([st, fc, wr, ad]) => {
      setStudents(st);
      setFaculty(fc);
      setWardens(wr);
      setAdmins(ad);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string, type: 'student' | 'faculty' | 'warden') => {
    if (!window.confirm('Are you sure you want to permanently delete this record?')) return;
    if (type === 'student') {
      await api.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      showToast('Student record deleted successfully.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (activeTab === 'students') {
      await api.updateStudent(editingItem.id, editingItem);
      setStudents(prev => prev.map(s => s.id === editingItem.id ? editingItem : s));
      showToast('Student details updated successfully.');
    }
    setEditingItem(null);
  };

  const exportCSV = () => {
    let data: any[] = [];
    if (activeTab === 'students') data = students;
    else if (activeTab === 'faculty') data = faculty;
    else if (activeTab === 'wardens') data = wardens;
    else data = admins;

    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).map(v => `"${v || ''}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kkdgms_${activeTab}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${data.length} records to CSV.`);
  };

  // Filtering
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.place && s.place.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (s.father_name && s.father_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesClass = selectedClass === 'all' || s.student_class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const filteredFaculty = faculty.filter(f =>
    f.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWardens = wardens.filter(w =>
    w.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.hostel_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Master School Directory & Records
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Live records synchronized with Supabase PostgreSQL database.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onNavigateAdmission}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        {/* Directory Category Tabs */}
        <div className="flex border-b border-slate-200 mt-6 space-x-6">
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'students'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Students ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'faculty'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Faculty Staff ({faculty.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('wardens')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'wardens'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Hostel Wardens ({wardens.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'admins'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Administration ({admins.length})</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab} by name, roll no, phone, place...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {activeTab === 'students' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none"
              >
                <option value="all">All Standards (6-12)</option>
                <option value="12">Standard 12</option>
                <option value="11">Standard 11</option>
                <option value="10">Standard 10</option>
                <option value="9">Standard 9</option>
                <option value="8">Standard 8</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {activeTab === 'students' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="p-3.5">EMIS / Roll No</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Class & Sec</th>
                  <th className="p-3.5">Group / Medium</th>
                  <th className="p-3.5">Parent / Contact</th>
                  <th className="p-3.5">Hostel Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No student records found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{st.user_id}</td>
                      <td className="p-3.5 font-semibold text-slate-900">
                        {st.full_name}
                        <div className="text-[11px] text-slate-400 font-normal">Age: {st.age || '16'} • Blood: {st.blood_group || 'O+'}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
                          {st.student_class}-{st.section}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div>{st.student_group || 'General'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{st.medium} Medium</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{st.father_name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {st.mobile}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.hostel_type === 'Resident'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {st.hostel_type || 'Day Scholar'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedItem(st)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingItem(st)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(st.id, 'student')}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Faculty Tab Table */}
        {activeTab === 'faculty' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="p-3.5">Staff ID</th>
                  <th className="p-3.5">Faculty Name</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Qualification</th>
                  <th className="p-3.5">Contact Number</th>
                  <th className="p-3.5">Native Place</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredFaculty.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{f.user_id}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{f.full_name}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold">
                        {f.department}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">{f.qualification}</td>
                    <td className="p-3.5">{f.mobile}</td>
                    <td className="p-3.5">{f.place || 'Kanyakumari'}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedItem(f)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Wardens Tab Table */}
        {activeTab === 'wardens' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="p-3.5">Warden ID</th>
                  <th className="p-3.5">Full Name</th>
                  <th className="p-3.5">Allocated Hostel</th>
                  <th className="p-3.5">Contact Mobile</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredWardens.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{w.user_id}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{w.full_name}</td>
                    <td className="p-3.5 font-bold text-amber-800">{w.hostel_name}</td>
                    <td className="p-3.5">{w.mobile}</td>
                    <td className="p-3.5">{w.place || 'Kanyakumari'}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedItem(w)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Admins Tab Table */}
        {activeTab === 'admins' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="p-3.5">Admin ID</th>
                  <th className="p-3.5">Officer Name</th>
                  <th className="p-3.5">Designation / Role</th>
                  <th className="p-3.5">Official Email</th>
                  <th className="p-3.5">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {admins.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{ad.user_id}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{ad.full_name}</td>
                    <td className="p-3.5 font-bold text-blue-700">{ad.department}</td>
                    <td className="p-3.5 font-mono">{ad.email}</td>
                    <td className="p-3.5">{ad.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                {selectedItem.full_name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedItem.full_name}</h3>
                <span className="text-xs font-mono text-slate-500">ID: {selectedItem.user_id}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Role / Designation:</span>
                <span className="font-semibold capitalize text-slate-800">{selectedItem.role}</span>
              </div>
              {selectedItem.student_class && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Standard & Section:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.student_class} - {selectedItem.section}</span>
                </div>
              )}
              {selectedItem.father_name && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Father's Name:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.father_name}</span>
                </div>
              )}
              {selectedItem.mother_name && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Mother's Name:</span>
                  <span className="font-semibold text-slate-800">{selectedItem.mother_name}</span>
                </div>
              )}
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Primary Mobile:</span>
                <span className="font-semibold text-slate-800">{selectedItem.mobile}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-500">Residential Town:</span>
                <span className="font-semibold text-slate-800">{selectedItem.place || 'Nagercoil'}, Kanyakumari</span>
              </div>
              {selectedItem.hostel_name && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Hostel Allocation:</span>
                  <span className="font-semibold text-amber-800">{selectedItem.hostel_name}</span>
                </div>
              )}
              {selectedItem.aadhaar && (
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-500">Aadhaar (Encrypted):</span>
                  <span className="font-mono text-slate-600">XXXX-XXXX-{selectedItem.aadhaar.slice(-4)}</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal for Student */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900">
              Edit Student Details ({editingItem.user_id})
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingItem.full_name}
                  onChange={(e) => setEditingItem({ ...editingItem, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Standard</label>
                <input
                  type="text"
                  value={editingItem.student_class}
                  onChange={(e) => setEditingItem({ ...editingItem, student_class: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Section</label>
                <input
                  type="text"
                  value={editingItem.section}
                  onChange={(e) => setEditingItem({ ...editingItem, section: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Mobile</label>
                <input
                  type="text"
                  value={editingItem.mobile}
                  onChange={(e) => setEditingItem({ ...editingItem, mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hostel Status</label>
                <select
                  value={editingItem.hostel_type || 'Day Scholar'}
                  onChange={(e) => setEditingItem({ ...editingItem, hostel_type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Resident">Resident</option>
                  <option value="Day Scholar">Day Scholar</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

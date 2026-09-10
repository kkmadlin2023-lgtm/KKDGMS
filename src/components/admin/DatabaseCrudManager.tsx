// =====================================================================
// KKDGMS — Admin Safe Database Master CRUD Manager
// =====================================================================

import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter
} from 'lucide-react';
import { api, localStore } from '../../lib/supabase';

type TableKey = 'students' | 'faculty' | 'wardens' | 'technicians' | 'attendance' | 'marks' | 'leaves' | 'questions' | 'visitors' | 'events' | 'expenses';

export const DatabaseCrudManager: React.FC = () => {
  const [activeTable, setActiveTable] = useState<TableKey>('students');
  const [tableData, setTableData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRow, setEditingRow] = useState<any | null>(null);

  useEffect(() => {
    loadTableData(activeTable);
  }, [activeTable]);

  const loadTableData = async (table: TableKey) => {
    switch (table) {
      case 'students': setTableData(await api.getStudents()); break;
      case 'faculty': setTableData(await api.getFaculty()); break;
      case 'wardens': setTableData(await api.getWardens()); break;
      case 'technicians': setTableData(await api.getTechnicians()); break;
      case 'attendance': setTableData(await api.getAttendance()); break;
      case 'marks': setTableData(await api.getMarks()); break;
      case 'leaves': setTableData(await api.getLeaves()); break;
      case 'questions': setTableData(await api.getQuestionBank()); break;
      case 'visitors': setTableData(await api.getVisitors()); break;
      case 'events': setTableData(await api.getEvents()); break;
      case 'expenses': setTableData(await api.getExpenses()); break;
    }
  };

  const handleDeleteRow = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record? This action will be recorded in the security audit log.')) return;

    if (activeTable === 'students') {
      await api.deleteStudent(id);
    } else {
      // generic localStore delete
      (localStore as any)[activeTable] = (localStore as any)[activeTable]?.filter((r: any) => r.id !== id);
      localStore.save();
    }

    await api.logAudit({
      user_id: 'ADMIN',
      email: 'principal@kkdgms.edu.in',
      role: 'admin',
      action: `Deleted record ${id} from table ${activeTable}`,
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent,
      status: 'SUCCESS'
    });

    await loadTableData(activeTable);
  };

  const filteredData = tableData.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHeaders = filteredData.length > 0 ? Object.keys(filteredData[0]).slice(0, 6) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900">Database Administration & Safe CRUD Console</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Perform safe queries, records management, and inline updates across all application tables with automatic audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadTableData(activeTable)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Refresh Table"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Switcher Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(['students', 'faculty', 'wardens', 'technicians', 'attendance', 'marks', 'leaves', 'questions', 'visitors', 'events', 'expenses'] as TableKey[]).map((tbl) => (
          <button
            key={tbl}
            onClick={() => {
              setActiveTable(tbl);
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
              activeTable === tbl
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tbl}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeTable}...`}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl outline-none"
            />
          </div>

          <div className="text-xs font-mono font-bold text-slate-500">
            {filteredData.length} records found
          </div>
        </div>

        {filteredData.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No matching records in table '{activeTable}'.</p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                <tr>
                  {tableHeaders.map((h) => (
                    <th key={h} className="p-3">{h.replace(/_/g, ' ')}</th>
                  ))}
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-50">
                    {tableHeaders.map((h) => (
                      <td key={h} className="p-3 font-medium text-slate-800 max-w-xs truncate">
                        {typeof row[h] === 'object' ? JSON.stringify(row[h]) : String(row[h] ?? '—')}
                      </td>
                    ))}
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

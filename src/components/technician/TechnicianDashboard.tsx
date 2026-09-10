// =====================================================================
// KKDGMS — Technician & Examination Cell Command Workspace
// =====================================================================

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  FileText,
  DollarSign,
  FolderOpen,
  Calendar,
  Download,
  Printer,
  Plus,
  CheckCircle2,
  Users,
  Search
} from 'lucide-react';
import { QuestionItem, ExpenseRecord, SchoolDocument, PeriodAllocation } from '../../types';
import { api } from '../../lib/supabase';

export const TechnicianDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qp' | 'documents' | 'expenses' | 'periods' | 'downloads'>('qp');

  // Question Paper Generator State
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedClass, setSelectedClass] = useState('12');
  const [selectedQIds, setSelectedQIds] = useState<string[]>([]);
  const [examHeading, setExamHeading] = useState('QUARTERLY EXAMINATION 2024-25');
  const [maxMarks, setMaxMarks] = useState(100);

  // Documents
  const [documents, setDocuments] = useState<SchoolDocument[]>([]);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCat, setNewDocCat] = useState<'Government Orders' | 'Syllabus' | 'Forms' | 'Hostel Guidelines' | 'Exam Rules' | 'General'>('Government Orders');

  // Expenses
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [expName, setExpName] = useState('');
  const [expAmount, setExpAmount] = useState(0);
  const [expCat, setExpCat] = useState<'Infrastructure' | 'Lab & Equipment' | 'Hostel & Food' | 'Events' | 'Utilities' | 'Stationery' | 'Other'>('Lab & Equipment');

  // Periods
  const [periods, setPeriods] = useState<PeriodAllocation[]>([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setQuestions(await api.getQuestionBank());
    setDocuments(await api.getDocuments());
    setExpenses(await api.getExpenses());
    setPeriods(await api.getPeriods());
  };

  const handleToggleQuestion = (id: string) => {
    if (selectedQIds.includes(id)) {
      setSelectedQIds(selectedQIds.filter((q) => q !== id));
    } else {
      setSelectedQIds([...selectedQIds, id]);
    }
  };

  const handlePrintQuestionPaper = () => {
    window.print();
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    await api.addDocument({
      title: newDocTitle,
      description: 'Official verified documentation upload',
      category: newDocCat,
      file_url: '/icon.jpg',
      file_name: `${newDocTitle.replace(/\s+/g, '_')}.pdf`,
      uploaded_by: 'Technician Cell',
      visibility: 'all'
    });

    setNewDocTitle('');
    await loadAll();
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName.trim() || expAmount <= 0) return;

    await api.addExpense({
      expense_name: expName,
      category: expCat,
      amount: expAmount,
      expense_date: new Date().toISOString().split('T')[0],
      description: 'Campus lab & technical maintenance expenditure',
      added_by: 'Technician Desk',
      status: 'Paid'
    });

    setExpName('');
    setExpAmount(0);
    await loadAll();
  };

  const selectedQuestionsList = questions.filter((q) => selectedQIds.includes(q.id));
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900">Technical Services & Examination Cell</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Question Paper Composer, Campus Document Repository, Expenditure Accounting, and Class Period Scheduling.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('qp')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase shrink-0 transition-all ${
            activeTab === 'qp' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          Question Paper Maker
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase shrink-0 transition-all ${
            activeTab === 'documents' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          Documentary Desk ({documents.length})
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase shrink-0 transition-all ${
            activeTab === 'expenses' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          Expense Accounting (₹{totalExpenseAmount.toLocaleString()})
        </button>
        <button
          onClick={() => setActiveTab('periods')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase shrink-0 transition-all ${
            activeTab === 'periods' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          Period & Timetable Schedule
        </button>
      </div>

      {/* 1. Question Paper Maker */}
      {activeTab === 'qp' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Questions from Question Bank</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                >
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Science</option>
                  <option>Tamil</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                >
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {questions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => handleToggleQuestion(q.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedQIds.includes(q.id)
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-400">{q.subject} • Class {q.student_class}</span>
                    <span className="font-mono text-[10px] text-indigo-600">{q.marks} Marks</span>
                  </div>
                  <p className="line-clamp-2">{q.question_text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Printable Layout Preview */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6 shadow-xs font-serif">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs font-sans font-bold text-slate-400 uppercase">Print Preview ({selectedQIds.length} Items)</span>
              <button
                onClick={handlePrintQuestionPaper}
                disabled={selectedQIds.length === 0}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs uppercase px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-4 h-4" /> Print Question Paper
              </button>
            </div>

            {/* School Letterhead */}
            <div className="text-center space-y-1 pb-4 border-b border-black/20">
              <h1 className="text-sm font-black uppercase tracking-wider">KANYAKUMARI DISTRICT GOVERNMENT MODEL SCHOOL</h1>
              <p className="text-xs font-medium">Navalcadu, Kanyakumari District • Tamil Nadu</p>
              <h2 className="text-xs font-bold uppercase mt-2">{examHeading}</h2>
              <div className="flex justify-between text-xs font-sans font-semibold pt-3 text-slate-700">
                <span>Class: {selectedClass}</span>
                <span>Subject: {selectedSubject}</span>
                <span>Time: 3 Hours</span>
                <span>Max Marks: {maxMarks}</span>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4 text-xs leading-relaxed font-sans">
              {selectedQuestionsList.map((q, idx) => (
                <div key={q.id} className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="font-bold">{idx + 1}. </span>
                    <span>{q.question_text}</span>
                  </div>
                  <span className="font-bold shrink-0 font-mono">[{q.marks}]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Documents Desk */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Upload Campus Document</h3>
            <form onSubmit={handleAddDocument} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g. Government Order Model School Setup"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={newDocCat}
                  onChange={(e) => setNewDocCat(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                >
                  <option>Government Orders</option>
                  <option>Syllabus</option>
                  <option>Forms</option>
                  <option>Hostel Guidelines</option>
                  <option>Exam Rules</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Archive Document
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Archived Documents</h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">
                      {doc.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{doc.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{doc.file_name}</p>
                  </div>
                  <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Expense Accounting */}
      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Record Expenditure Entry</h3>
            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  value={expName}
                  onChange={(e) => setExpName(e.target.value)}
                  placeholder="e.g. Physics Optical Benches Repair"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={expCat}
                  onChange={(e) => setExpCat(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                >
                  <option>Lab & Equipment</option>
                  <option>Infrastructure</option>
                  <option>Hostel & Food</option>
                  <option>Stationery</option>
                  <option>Events</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={expAmount || ''}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  placeholder="Amount in Rupees"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Log Expense
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Expense Audit Register</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Expense Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{exp.expense_name}</td>
                      <td className="p-3 text-slate-600">{exp.category}</td>
                      <td className="p-3 font-mono font-bold text-indigo-700">₹{Number(exp.amount).toLocaleString()}</td>
                      <td className="p-3 font-mono text-slate-500">{exp.expense_date}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold uppercase text-[10px]">
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Periods Schedule */}
      {activeTab === 'periods' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Standard Master Period Allocations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Period 1 (09:00 - 09:45 AM)', 'Period 2 (09:45 - 10:30 AM)', 'Period 3 (10:45 - 11:30 AM)', 'Period 4 (11:30 - 12:15 PM)', 'Period 5 (01:15 - 02:00 PM)', 'Period 6 (02:00 - 02:45 PM)', 'Period 7 (03:00 - 03:45 PM)', 'Period 8 (03:45 - 04:30 PM)'].map((p, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">Slot {idx + 1}</span>
                <h4 className="text-xs font-bold text-slate-900">{p}</h4>
                <p className="text-[11px] text-slate-500 font-medium">Standard Academic Allotment</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

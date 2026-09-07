import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Check,
  X,
  Search,
  Filter,
  CheckCircle2,
  FileQuestion,
  Tag
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { QuestionItem } from '../../types';

export const QuestionBankAdmin: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    subject: 'Mathematics',
    student_class: '12',
    unit_chapter: '',
    question_type: 'Short Answer' as 'MCQ' | 'Short Answer' | 'Long Answer',
    question_text: '',
    marks: 2,
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    submitted_by: 'Faculty HOD'
  });

  const loadQuestions = () => {
    api.getQuestionBank().then(data => setQuestions(data));
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleStatusToggle = async (id: string, newStatus: 'approved' | 'rejected') => {
    await api.updateQuestionStatus(id, newStatus);
    loadQuestions();
    setToast(`Question status updated to ${newStatus}.`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.title || !newQuestion.question_text) {
      alert('Please provide question title and text.');
      return;
    }
    await api.addQuestion(newQuestion);
    setShowAddModal(false);
    loadQuestions();
    setToast('New question deployed to Question Bank!');
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = questions.filter(q => {
    const classMatch = selectedClass === 'all' || q.student_class === selectedClass;
    const subMatch = selectedSubject === 'all' || q.subject === selectedSubject;
    const diffMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const queryMatch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       q.question_text.toLowerCase().includes(searchQuery.toLowerCase());
    return classMatch && subMatch && diffMatch && queryMatch;
  });

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
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Academic Curriculum Repository</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Syllabus Question Bank & Verification
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Synchronized with <span className="font-mono font-semibold">public.question_bank</span> for standards 6 to 12.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
            >
              <option value="all">All Standards</option>
              <option value="12">Standard 12</option>
              <option value="11">Standard 11</option>
              <option value="10">Standard 10</option>
              <option value="9">Standard 9</option>
            </select>
          </div>
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Science">General Science</option>
              <option value="Tamil">Tamil</option>
              <option value="English">English</option>
            </select>
          </div>
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No questions found matching your filter criteria.
          </div>
        ) : (
          filtered.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                      Std {q.student_class}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {q.subject}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {q.marks} Marks • {q.question_type}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    q.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {q.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-1 mb-2 leading-snug">
                  {q.title}
                </h3>

                <p className="text-xs text-slate-700 bg-slate-50/80 p-3 rounded-xl border border-slate-100 leading-relaxed font-serif">
                  {q.question_text}
                </p>

                {q.unit_chapter && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                    <Tag className="w-3 h-3" />
                    <span>Unit: {q.unit_chapter}</span>
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  Submitted by: {q.submitted_by}
                </span>

                <div className="flex items-center gap-1">
                  {q.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusToggle(q.id, 'approved')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  {q.status === 'approved' && (
                    <button
                      onClick={() => handleStatusToggle(q.id, 'rejected')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Revoke</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Submit Question to Repository
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Title / Topic *</label>
                <input
                  type="text"
                  placeholder="e.g. Differential Calculus - Maxima Minima"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Standard</label>
                  <select
                    value={newQuestion.student_class}
                    onChange={(e) => setNewQuestion({ ...newQuestion, student_class: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="12">Standard 12</option>
                    <option value="11">Standard 11</option>
                    <option value="10">Standard 10</option>
                    <option value="9">Standard 9</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newQuestion.subject}
                    onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Science">General Science</option>
                    <option value="Tamil">Tamil</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={newQuestion.question_type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question_type: e.target.value as any })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="Short Answer">Short Answer</option>
                    <option value="Long Answer">Long Answer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Marks</label>
                  <input
                    type="number"
                    value={newQuestion.marks}
                    onChange={(e) => setNewQuestion({ ...newQuestion, marks: Number(e.target.value) || 2 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Content *</label>
                <textarea
                  rows={4}
                  placeholder="Enter full question statement, equation, or Tamil/English passage..."
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-serif"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 cursor-pointer"
              >
                Save to Database
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

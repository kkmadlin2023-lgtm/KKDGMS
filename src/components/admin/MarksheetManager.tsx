import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Save,
  Printer,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { Student, MarkEntry } from '../../types';

export const MarksheetManager: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState('Quarterly Examination');
  const [selectedClass, setSelectedClass] = useState('12');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [maxMarks, setMaxMarks] = useState(100);

  const [students, setStudents] = useState<Student[]>([]);
  const [marksMap, setMarksMap] = useState<Record<string, { marks: number; remarks: string }>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const calculateGrade = (score: number, max: number): string => {
    const pct = (score / max) * 100;
    if (pct >= 91) return 'A1';
    if (pct >= 81) return 'A2';
    if (pct >= 71) return 'B1';
    if (pct >= 61) return 'B2';
    if (pct >= 51) return 'C1';
    if (pct >= 41) return 'C2';
    if (pct >= 35) return 'D';
    return 'E (Fail)';
  };

  useEffect(() => {
    Promise.all([
      api.getStudents(),
      api.getMarks(selectedClass, selectedExam)
    ]).then(([stList, marksList]) => {
      const filteredSt = stList.filter(s => s.student_class === selectedClass && s.section === selectedSection);
      setStudents(filteredSt);

      const mapping: Record<string, { marks: number; remarks: string }> = {};
      filteredSt.forEach(st => {
        const found = marksList.find(m => m.student_id === st.id && m.subject === selectedSubject);
        mapping[st.id] = {
          marks: found ? found.marks_obtained : 85,
          remarks: found?.remarks || ''
        };
      });
      setMarksMap(mapping);
    });
  }, [selectedClass, selectedSection, selectedExam, selectedSubject]);

  const handleScoreChange = (studentId: string, val: string) => {
    const num = Math.min(maxMarks, Math.max(0, Number(val) || 0));
    setMarksMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: num
      }
    }));
  };

  const handleRemarksChange = (studentId: string, val: string) => {
    setMarksMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: val
      }
    }));
  };

  const handleSaveMarks = async () => {
    setSaving(true);
    try {
      for (const st of students) {
        const score = marksMap[st.id]?.marks || 0;
        await api.addMark({
          student_id: st.id,
          student_user_id: st.user_id,
          student_name: st.full_name,
          student_class: selectedClass,
          section: selectedSection,
          exam_name: selectedExam,
          subject: selectedSubject,
          marks_obtained: score,
          max_marks: maxMarks,
          grade: calculateGrade(score, maxMarks),
          remarks: marksMap[st.id]?.remarks || ''
        });
      }
      setToast('Marksheet entries committed to Supabase successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert('Error saving marks: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const scores = students.map(s => marksMap[s.id]?.marks || 0);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const passCount = scores.filter(s => (s / maxMarks) * 100 >= 35).length;
  const passPct = scores.length > 0 ? Math.round((passCount / scores.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Academic Evaluation & Grade Ledger</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Marksheet & Performance Entry
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Recorded in <span className="font-mono font-semibold">public.marks_entries</span> with auto-calculated Tamil Nadu State Board grading.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Sheet</span>
            </button>
            <button
              onClick={handleSaveMarks}
              disabled={saving || students.length === 0}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Commit Marksheet'}</span>
            </button>
          </div>
        </div>

        {/* Filter Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1">Examination Term</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              <option value="Quarterly Examination">Quarterly Examination 2024</option>
              <option value="Half-Yearly Examination">Half-Yearly Examination</option>
              <option value="Unit Test 1">Unit Test 1</option>
              <option value="Unit Test 2">Unit Test 2</option>
              <option value="Model Examination">Model Examination</option>
              <option value="Annual Examination">Annual Examination</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Standard & Section</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
              >
                <option value="12">Std 12</option>
                <option value="11">Std 11</option>
                <option value="10">Std 10</option>
                <option value="9">Std 9</option>
              </select>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
              >
                <option value="A">Sec A</option>
                <option value="B">Sec B</option>
                <option value="C">Sec C</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Computer Science">Computer Science</option>
              <option value="English">English</option>
              <option value="Tamil">Tamil</option>
              <option value="Science">General Science</option>
              <option value="Social Science">Social Science</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">Maximum Marks</label>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value) || 100)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Analytics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Class Average</div>
          <div className="text-xl font-black text-slate-900 mt-1">{avgScore} / {maxMarks}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase">Pass Percentage</div>
          <div className="text-xl font-black text-emerald-700 mt-1">{passPct}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-2xs">
          <div className="text-[11px] font-bold text-blue-700 uppercase">Highest Score</div>
          <div className="text-xl font-black text-blue-700 mt-1">
            {scores.length > 0 ? Math.max(...scores) : 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/30 shadow-2xs">
          <div className="text-[11px] font-bold text-purple-700 uppercase">Subject Master</div>
          <div className="text-xl font-black text-purple-700 mt-1 truncate">{selectedSubject}</div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            {selectedExam} • {selectedSubject} (Standard {selectedClass}-{selectedSection})
          </span>
          <span className="text-xs text-slate-500 font-mono">Max: {maxMarks} Marks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="p-3.5">EMIS / Roll</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Marks Obtained</th>
                <th className="p-3.5">Computed Grade</th>
                <th className="p-3.5">Faculty Assessment Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No students found in Standard {selectedClass}-{selectedSection}.
                  </td>
                </tr>
              ) : (
                students.map((st) => {
                  const currScore = marksMap[st.id]?.marks ?? 0;
                  const grade = calculateGrade(currScore, maxMarks);
                  const isFail = (currScore / maxMarks) * 100 < 35;
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-800">{st.user_id}</td>
                      <td className="p-3.5 font-semibold text-slate-900">{st.full_name}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max={maxMarks}
                            value={currScore}
                            onChange={(e) => handleScoreChange(st.id, e.target.value)}
                            className="w-20 px-2.5 py-1 text-xs font-mono font-bold border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <span className="text-slate-400 font-mono">/ {maxMarks}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          isFail
                            ? 'bg-rose-100 text-rose-800'
                            : grade.startsWith('A')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          Grade {grade}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <input
                          type="text"
                          placeholder="e.g. Excellent progress, Needs formula practice"
                          value={marksMap[st.id]?.remarks || ''}
                          onChange={(e) => handleRemarksChange(st.id, e.target.value)}
                          className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// KKDGMS — Faculty Online Examination Studio & OTP Controller
// =====================================================================

import React, { useState, useEffect } from 'react';
import {
  MonitorPlay,
  KeyRound,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Award,
  Users,
  Eye,
  RefreshCw,
  AlertCircle,
  FileCheck,
  Search,
  Sparkles,
  Lock
} from 'lucide-react';
import { OnlineExam, OnlineExamQuestion, OnlineExamAttempt } from '../../types';
import { api } from '../../lib/supabase';

export const FacultyOnlineExamCreator: React.FC = () => {
  const [exams, setExams] = useState<OnlineExam[]>([]);
  const [selectedExam, setSelectedExam] = useState<OnlineExam | null>(null);
  const [attempts, setAttempts] = useState<OnlineExamAttempt[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewResultsModal, setViewResultsModal] = useState(false);

  // Live OTP State
  const [activeOtp, setActiveOtp] = useState<string>('');
  const [otpSecondsLeft, setOtpSecondsLeft] = useState<number>(0);

  // New Exam Form State
  const [examName, setExamName] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [studentClass, setStudentClass] = useState('12');
  const [section, setSection] = useState('A');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passMarks, setPassMarks] = useState(8);
  const [examPassword, setExamPassword] = useState('');
  const [questions, setQuestions] = useState<OnlineExamQuestion[]>([
    {
      id: 'q-1',
      question_text: 'What is the derivative of sin(2x)?',
      choices: [
        { id: 'c1', text: '2 cos(2x)' },
        { id: 'c2', text: 'cos(2x)' },
        { id: 'c3', text: '-2 cos(2x)' },
        { id: 'c4', text: '2 sin(2x)' }
      ],
      correct_answer_id: 'c1',
      marks: 5,
      negative_marks: 0,
      explanation: 'd/dx[sin(2x)] = 2 cos(2x)'
    }
  ]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    const list = await api.getOnlineExams();
    setExams(list);
    if (list.length > 0 && !selectedExam) {
      setSelectedExam(list[0]);
      loadAttempts(list[0].id);
    }
  };

  const loadAttempts = async (examId: string) => {
    const atts = await api.getExamAttempts(examId);
    setAttempts(atts);
  };

  // 10s OTP Countdown
  useEffect(() => {
    if (otpSecondsLeft <= 0) return;
    const interval = setInterval(() => {
      setOtpSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSecondsLeft]);

  const handleGenerateStartOtp = async (examId: string) => {
    const otp = await api.generateStartOtp(examId);
    setActiveOtp(otp);
    setOtpSecondsLeft(10); // 10 seconds validity
    await loadExams();
  };

  const handleGenerateEndOtp = async (examId: string) => {
    const otp = await api.generateEndOtp(examId);
    alert(`Exam End OTP Generated: ${otp}\nShare this OTP with students when you want them to finish the exam.`);
    await loadExams();
  };

  const handleAddQuestion = () => {
    const newQ: OnlineExamQuestion = {
      id: 'q-' + (questions.length + 1),
      question_text: '',
      choices: [
        { id: 'c1', text: '' },
        { id: 'c2', text: '' },
        { id: 'c3', text: '' },
        { id: 'c4', text: '' }
      ],
      correct_answer_id: 'c1',
      marks: 5,
      negative_marks: 0
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) {
      alert('Please provide exam title.');
      return;
    }

    const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

    const newExam = await api.createOnlineExam({
      exam_name: examName,
      subject,
      student_class: studentClass,
      section,
      total_marks: totalMarks,
      pass_marks: passMarks,
      duration_minutes: durationMinutes,
      exam_password: examPassword,
      status: 'draft',
      questions,
      assigned_faculty_id: 'FAC001',
      assigned_faculty_name: 'Faculty Incharge'
    });

    await loadExams();
    setSelectedExam(newExam);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <MonitorPlay className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900">Online Examination Command Studio</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create OTP-secured online tests with 10-second start OTPs, live draft autosaving, and instant evaluation.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Online Exam</span>
        </button>
      </div>

      {/* Main Grid: Exam Cards & Live Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Exam List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Published & Active Exams</h3>
          {exams.map((ex) => (
            <div
              key={ex.id}
              onClick={() => {
                setSelectedExam(ex);
                loadAttempts(ex.id);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedExam?.id === ex.id
                  ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md uppercase">
                  Class {ex.student_class}-{ex.section} • {ex.subject}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                  ex.status === 'active' ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-slate-100 text-slate-600'
                }`}>
                  {ex.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">{ex.exam_name}</h4>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500 font-mono">
                <span>{ex.questions?.length || 0} Questions</span>
                <span>{ex.total_marks} Marks</span>
                <span>{ex.duration_minutes} Mins</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: OTP Controller & Live Monitor */}
        {selectedExam && (
          <div className="lg:col-span-2 space-y-6">
            {/* Live Controller Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedExam.exam_name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Class {selectedExam.student_class} Section {selectedExam.section} • {selectedExam.subject}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenerateStartOtp(selectedExam.id)}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Generate Start OTP (10s)</span>
                  </button>
                  <button
                    onClick={() => handleGenerateEndOtp(selectedExam.id)}
                    className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>End Exam OTP</span>
                  </button>
                </div>
              </div>

              {/* Start OTP Display Area */}
              {activeOtp && (
                <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Active Start OTP (Valid for Students)
                    </span>
                    <div className="text-3xl font-black font-mono tracking-widest text-emerald-900 mt-1">
                      {activeOtp}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center">
                      <span className="text-xs font-black font-mono text-emerald-700">{otpSecondsLeft}s</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-800">
                      {otpSecondsLeft > 0 ? 'Expiring shortly...' : 'OTP Expired. Click regenerate.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Exam Attempts & Performance Summary */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Live Student Submissions ({attempts.length})
                  </h4>
                  <button
                    onClick={() => loadAttempts(selectedExam.id)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Submissions
                  </button>
                </div>

                {attempts.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-500">No student submissions recorded yet for this exam session.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">EMIS Roll</th>
                          <th className="p-3">Score</th>
                          <th className="p-3">Result</th>
                          <th className="p-3">Submitted At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attempts.map((att) => (
                          <tr key={att.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{att.student_name}</td>
                            <td className="p-3 font-mono text-slate-600">{att.student_user_id}</td>
                            <td className="p-3 font-bold text-indigo-700">
                              {att.score} / {att.total_marks} ({att.percentage}%)
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                att.is_passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                {att.is_passed ? 'Pass' : 'Fail'}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 font-mono">
                              {new Date(att.submitted_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">New Online Examination Setup</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Exam Title / Subject Chapter</label>
                  <input
                    type="text"
                    required
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="e.g. Unit 4 Ray Optics Test"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  >
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>Computer Science</option>
                    <option>Tamil</option>
                    <option>English</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Class & Section</label>
                  <div className="flex gap-2">
                    <select
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-1/2 p-2.5 border border-slate-300 rounded-xl"
                    >
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>12</option>
                    </select>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-1/2 p-2.5 border border-slate-300 rounded-xl"
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Questions Builder */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-slate-600">Question Items ({questions.length})</h4>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-700">Question {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Type question here..."
                      value={q.question_text}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[idx].question_text = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                    />

                    {/* 4 Choices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.choices.map((c, cIdx) => (
                        <div key={c.id} className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-xl">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correct_answer_id === c.id}
                            onChange={() => {
                              const updated = [...questions];
                              updated[idx].correct_answer_id = c.id;
                              setQuestions(updated);
                            }}
                          />
                          <input
                            type="text"
                            required
                            placeholder={`Choice ${cIdx + 1}`}
                            value={c.text}
                            onChange={(e) => {
                              const updated = [...questions];
                              updated[idx].choices[cIdx].text = e.target.value;
                              setQuestions(updated);
                            }}
                            className="w-full text-xs outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase rounded-xl shadow-md"
                >
                  Save & Publish Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

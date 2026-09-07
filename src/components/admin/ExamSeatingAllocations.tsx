import React, { useState, useEffect } from 'react';
import {
  Grid3X3,
  Printer,
  Shuffle,
  Save,
  CheckCircle2,
  Users,
  Building2
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { Student, ExamSeat } from '../../types';

export const ExamSeatingAllocations: React.FC = () => {
  const [examName, setExamName] = useState('Quarterly Examination 2024');
  const [selectedHall, setSelectedHall] = useState('Hall 101 (Main Block)');
  const [students, setStudents] = useState<Student[]>([]);
  const [seatingPlan, setSeatingPlan] = useState<ExamSeat[]>([]);
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(4);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getStudents(),
      api.getExamSeating(selectedHall)
    ]).then(([stList, seats]) => {
      setStudents(stList);
      if (seats.length > 0) {
        setSeatingPlan(seats);
      } else {
        generateAutoAllocation(stList);
      }
    });
  }, [selectedHall]);

  const generateAutoAllocation = (pool: Student[] = students) => {
    const newSeats: ExamSeat[] = [];
    let studentIndex = 0;

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        // 2 students per bench (Left & Right)
        const benchNo = `B-${r}-${c}`;
        for (let pos of ['Left', 'Right'] as const) {
          if (studentIndex < pool.length) {
            const st = pool[studentIndex];
            newSeats.push({
              id: `${benchNo}-${pos}`,
              exam_name: examName,
              hall_name: selectedHall,
              bench_no: benchNo,
              seat_position: pos,
              student_id: st.id,
              student_user_id: st.user_id,
              student_name: st.full_name,
              student_class: st.student_class,
              section: st.section
            });
            studentIndex++;
          }
        }
      }
    }
    setSeatingPlan(newSeats);
  };

  const handleSave = async () => {
    try {
      await api.saveExamSeating(seatingPlan);
      setToast(`Seating plan for ${selectedHall} committed to Supabase!`);
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert('Error saving seating plan: ' + err.message);
    }
  };

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
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <Grid3X3 className="w-4 h-4" />
              <span>Examination Hall & Bench Matrix</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Exam Seating Arrangement
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Anti-malpractice bench allocation saved to <span className="font-mono font-semibold">public.exam_seating</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateAutoAllocation()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-slate-500" />
              <span>Shuffle Matrix</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Seating Notice</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Commit Plan</span>
            </button>
          </div>
        </div>

        {/* Hall & Exam Config */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1">Exam Name</label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Exam Hall</label>
            <select
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
            >
              <option value="Hall 101 (Main Block)">Hall 101 (Main Block)</option>
              <option value="Hall 102 (Main Block)">Hall 102 (Main Block)</option>
              <option value="Science Laboratory">Science Laboratory</option>
              <option value="Auditorium Block">Auditorium Block</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Room Capacity</label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 font-bold">
              {rows * cols} Benches ({rows * cols * 2} Candidate Seats)
            </div>
          </div>
        </div>
      </div>

      {/* Visual Bench Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Blackboard / Invigilator Podium Front
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {seatingPlan.length} Seats Assigned
          </span>
        </div>

        {/* Podium Indicator */}
        <div className="w-full py-1.5 mb-6 text-center text-[10px] font-mono uppercase tracking-widest text-slate-500 bg-slate-100 rounded-lg border border-slate-200">
          ─── TEACHER DESK & CHALKBOARD FRONT ───
        </div>

        {/* Bench Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: rows * cols }).map((_, idx) => {
            const rowNum = Math.floor(idx / cols) + 1;
            const colNum = (idx % cols) + 1;
            const benchNo = `B-${rowNum}-${colNum}`;
            const leftSeat = seatingPlan.find(s => s.bench_no === benchNo && s.seat_position === 'Left');
            const rightSeat = seatingPlan.find(s => s.bench_no === benchNo && s.seat_position === 'Right');

            return (
              <div
                key={benchNo}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xs transition-all text-xs"
              >
                <div className="flex items-center justify-between font-mono font-bold text-[10px] text-slate-400 mb-2 pb-1 border-b border-slate-200/60">
                  <span>Bench #{benchNo}</span>
                  <span>Row {rowNum}</span>
                </div>

                {/* Left and Right Seats on the Bench */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {/* Left Seat */}
                  <div className="p-2 rounded bg-white border border-slate-200 text-left">
                    <span className="text-[9px] font-bold text-blue-600 block uppercase">Left Seat</span>
                    {leftSeat ? (
                      <>
                        <div className="font-bold text-slate-900 truncate">{leftSeat.student_name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{leftSeat.student_user_id}</div>
                        <span className="inline-block mt-1 px-1 py-0.2 rounded bg-blue-50 text-blue-700 text-[9px] font-bold">
                          Std {leftSeat.student_class}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-300 italic text-[10px]">Vacant</span>
                    )}
                  </div>

                  {/* Right Seat */}
                  <div className="p-2 rounded bg-white border border-slate-200 text-left">
                    <span className="text-[9px] font-bold text-indigo-600 block uppercase">Right Seat</span>
                    {rightSeat ? (
                      <>
                        <div className="font-bold text-slate-900 truncate">{rightSeat.student_name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{rightSeat.student_user_id}</div>
                        <span className="inline-block mt-1 px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold">
                          Std {rightSeat.student_class}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-300 italic text-[10px]">Vacant</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

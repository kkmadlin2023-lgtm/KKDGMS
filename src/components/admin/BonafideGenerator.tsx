import React, { useState, useEffect } from 'react';
import {
  Scroll,
  Printer,
  Search,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { api } from '../../lib/supabase';
import { Student } from '../../types';

export const BonafideGenerator: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [purpose, setPurpose] = useState('Opening a Student Savings Bank Account');
  const [certNumber, setCertNumber] = useState('KKDGMS/BON/' + Math.floor(1000 + Math.random() * 9000));
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    api.getStudents().then(data => {
      setStudents(data);
      if (data.length > 0) {
        setSelectedStudentId(data[0].id);
      }
    });
  }, []);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handlePrint = async () => {
    if (!selectedStudent) return;
    try {
      await api.createBonafideRequest({
        student_id: selectedStudent.id,
        student_user_id: selectedStudent.user_id,
        student_name: selectedStudent.full_name,
        student_class: selectedStudent.student_class,
        section: selectedStudent.section,
        purpose,
        status: 'Issued',
        certificate_no: certNumber,
        issue_date: issueDate
      });
      setToast('Bonafide certificate recorded in database.');
      setTimeout(() => setToast(null), 3000);
      window.print();
    } catch (err: any) {
      alert('Error: ' + err.message);
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

      {/* Configuration Header (Hidden on print) */}
      <div className="print:hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
              <Scroll className="w-4 h-4" />
              <span>Official Institutional Certification</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Bonafide Certificate Generator
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Generates verifiable student bonafide certificates saved in <span className="font-mono font-semibold">public.bonafide_requests</span>.
            </p>
          </div>

          <button
            onClick={handlePrint}
            disabled={!selectedStudent}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            <span>Issue & Print Certificate</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.user_id} - Std {s.student_class}-{s.section})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Purpose of Certificate</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              <option value="Opening a Student Savings Bank Account">Opening Bank Savings Account</option>
              <option value="Government Scholarship Application">Government Scholarship Application</option>
              <option value="Passport / Visa Application">Passport / Visa Application</option>
              <option value="TNSTC Bus Pass Concession">TNSTC Bus Pass Concession</option>
              <option value="Inter-School Sports / Cultural Competition">Inter-School Competition</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Certificate Serial Number</label>
            <input
              type="text"
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Printable Certificate Page */}
      {selectedStudent && (
        <div className="bg-white rounded-2xl border-4 border-slate-800 p-10 max-w-3xl mx-auto shadow-md relative overflow-hidden text-slate-900 font-serif">
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <ShieldCheck className="w-96 h-96 text-slate-900" />
          </div>

          {/* Certificate Header */}
          <div className="text-center border-b-2 border-slate-900 pb-6 relative z-10">
            <div className="text-[11px] uppercase tracking-widest font-sans font-bold text-slate-600">
              Department of School Education • Government of Tamil Nadu
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-wide mt-1 uppercase font-serif">
              KANYAKUMARI DISTRICT GOVERNMENT MODEL SCHOOL
            </h1>
            <p className="text-xs font-sans text-slate-600 mt-1">
              Affiliated to Tamil Nadu State Board of Secondary Education • Recognized Higher Secondary Institution
            </p>
            <p className="text-[11px] font-sans text-slate-500 font-mono">
              College Road, Nagercoil - 629001, Kanyakumari District | Phone: 04652-240192 | Email: principal@kkdgms.edu.in
            </p>
          </div>

          {/* Certificate Metadata Row */}
          <div className="flex justify-between items-center my-6 text-xs font-mono font-semibold relative z-10 border-b border-slate-200 pb-3">
            <span>Ref No: <span className="font-bold text-blue-900">{certNumber}</span></span>
            <span>Date of Issue: <span className="font-bold">{issueDate}</span></span>
          </div>

          {/* Certificate Title */}
          <div className="text-center my-8 relative z-10">
            <h2 className="text-xl font-bold uppercase tracking-wider inline-block border-b-2 border-slate-800 pb-1 font-serif">
              BONAFIDE CERTIFICATE
            </h2>
          </div>

          {/* Certificate Body */}
          <div className="space-y-6 text-sm leading-loose relative z-10 text-justify px-4">
            <p>
              This is to certify that Master / Kumari{' '}
              <span className="font-bold underline uppercase decoration-slate-400 font-sans">
                {selectedStudent.full_name}
              </span>
              , son / daughter of Thiru{' '}
              <span className="font-bold underline uppercase decoration-slate-400 font-sans">
                {selectedStudent.father_name || 'Guardian'}
              </span>
              , bearing EMIS Roll No:{' '}
              <span className="font-bold font-mono text-blue-950">
                {selectedStudent.user_id}
              </span>
              , is a bonafide student of this institution studying in{' '}
              <span className="font-bold">Standard {selectedStudent.student_class}</span>, Section{' '}
              <span className="font-bold">"{selectedStudent.section}"</span> (
              {selectedStudent.medium} Medium) during the academic year{' '}
              <span className="font-bold">2024 - 2025</span>.
            </p>

            <p>
              As per our official school records, his / her Date of Birth is{' '}
              <span className="font-bold font-mono">
                {selectedStudent.dob || '14-06-2008'}
              </span>
              . During his / her tenure in our institution, his / her conduct and character have been found to be{' '}
              <span className="font-bold">GOOD</span>.
            </p>

            <p>
              This certificate is issued on the request of the parent / guardian specifically for the purpose of{' '}
              <span className="font-bold italic underline decoration-slate-400">
                {purpose}
              </span>
              .
            </p>
          </div>

          {/* Signatures & Seal Footer */}
          <div className="grid grid-cols-3 gap-4 pt-16 mt-8 relative z-10 text-center text-xs font-sans">
            <div>
              <div className="h-12 flex items-end justify-center font-script text-slate-500 italic text-sm">
                R. Selvaraj
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-800 uppercase">
                Prepared By (Clerk)
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center p-1">
                Institutional Seal
              </div>
            </div>

            <div>
              <div className="h-12 flex items-end justify-center font-script text-blue-900 font-bold italic text-base">
                Dr. M. Senthil Kumar
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-800 uppercase">
                Headmaster / Principal
              </div>
              <div className="text-[10px] text-slate-500 font-mono">KKDGMS, Nagercoil</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

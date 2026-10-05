import React from 'react';
import { Award, Printer, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StudentInfo, PlayerStats } from '../types/game';
import { soundManager } from '../utils/sound';

interface CertificateProps {
  student: StudentInfo;
  stats: PlayerStats;
  onBack: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ student, stats, onBack }) => {
  const currentDate = new Date().toLocaleDateString('ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      {/* Top action bar (hidden in print) */}
      <div className="no-print flex items-center justify-between gap-3 mb-6 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لتقرير الطالب</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm hover:scale-105 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة الشهادة 🖨️</span>
        </button>
      </div>

      {/* Official Certificate Canvas Container (print-target) */}
      <div 
        id="certificate-print-area"
        className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-double border-amber-400/80 rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden text-center"
      >
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-400" />
        <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-400" />
        <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-400" />
        <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-400" />

        {/* Certificate Emblem */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-1 mb-4 shadow-xl shadow-amber-500/30 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center border-2 border-amber-300">
            <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
          </div>
        </div>

        {/* Certificate Header */}
        <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-amber-400 uppercase">
          المملكة الأردنية الهاشمية · مبحث المهارات الرقمية · الصف التاسع الأساسي
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200 font-game mt-2 mb-3">
          شهادة إنجاز وتفوق
        </h1>

        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6" />

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-4 leading-relaxed">
          تشهد إدارة النشاط التعليمي والتكنولوجي بأن الطالب البطل:
        </p>

        {/* Student Name Display */}
        <div className="inline-block bg-slate-900/80 border-b-2 border-amber-400 px-6 sm:px-12 py-2 sm:py-3 rounded-xl mb-4 shadow-inner">
          <h2 className="text-2xl sm:text-4xl font-black text-white font-game">
            {student.name}
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
          من الشعبة: <span className="font-bold text-amber-400 font-game text-lg">({student.section})</span>
        </p>

        <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto mb-6 leading-relaxed">
          قد أتم بنجاح واقتدار كافة مراحل وتحديات اللعبة التعليمية التفاعلية:
          <br />
          <span className="text-lg sm:text-2xl font-black text-cyan-300 font-game block mt-1">
            "محارب الأمن السيبراني — Cyber Guardian"
          </span>
          الخاصة بدرس الجريمة الإلكترونية (الصفحات 32 إلى 41)
        </p>

        {/* Score Stamp */}
        <div className="inline-flex items-center gap-3 bg-amber-950/40 border border-amber-500/60 px-6 py-2.5 rounded-2xl mb-8">
          <span className="text-xs sm:text-sm font-bold text-slate-300">وحصل على علامة نهائية:</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
            {stats.score} / 100
          </span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
            {stats.score >= 85 ? "خبير أمن سيبراني" : stats.score >= 60 ? "حارس متقدم" : "مشارك مجتهد"}
          </span>
        </div>

        {/* Footer Signatures */}
        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800/80 max-w-xl mx-auto items-end text-xs sm:text-sm">
          <div className="text-right">
            <span className="text-slate-400 block text-[11px] mb-1">تاريخ الإصدار:</span>
            <span className="text-slate-200 font-bold font-mono">{currentDate}</span>
          </div>

          <div className="text-left">
            <span className="text-slate-400 block text-[11px] mb-1">المعلم المشرف:</span>
            <span className="text-amber-400 font-extrabold text-sm sm:text-base font-game block">
              تصميم وإعداد الأستاذ: عامر كراجه
            </span>
          </div>
        </div>

        {/* Certificate Seal Stamp */}
        <div className="mt-8 text-[10px] text-slate-500 font-mono">
          معتمد لمنهاج المهارات الرقمية المطور · المركز الوطني لتطوير المناهج (NCCD)
        </div>
      </div>
    </div>
  );
};

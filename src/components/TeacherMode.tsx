import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Download, Trash2, X, FileSpreadsheet, Users, Award, Zap, CheckCircle2 } from 'lucide-react';
import { TeacherRecord } from '../types/game';
import { soundManager } from '../utils/sound';

interface TeacherModeProps {
  onClose: () => void;
}

export const TeacherMode: React.FC<TeacherModeProps> = ({ onClose }) => {
  const [records, setRecords] = useState<TeacherRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('ALL');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cyber_guardian_records');
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch {
      // silent
    }
  }, []);

  const handleClearRecords = () => {
    if (window.confirm("هل أنت متأكد من مسح جميع سجلات ونتائج الطلاب المحفوظة؟")) {
      soundManager.playError();
      localStorage.removeItem('cyber_guardian_records');
      setRecords([]);
    }
  };

  const handleExportCSV = () => {
    soundManager.playClick();
    if (records.length === 0) {
      alert("لا توجد سجلات لتصديرها حالياً.");
      return;
    }

    const headers = ["اسم الطالب", "الشعبة", "العلامة /100", "XP", "إجابات صحيحة", "إجابات خاطئة", "المراحل المكتملة", "الوقت (ثوانٍ)", "التاريخ"];
    const rows = records.map(r => [
      `"${r.studentName}"`,
      `"${r.section}"`,
      r.score,
      r.xp,
      r.correctAnswers,
      r.wrongAnswers,
      r.completedStagesCount,
      r.durationSeconds,
      `"${r.dateString}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `نتائج_المهارات_الرقمية_الجريمة_الإلكترونية_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || r.section.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'ALL' || r.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  const uniqueSections = Array.from(new Set(records.map(r => r.section))).filter(Boolean);

  const avgScore = records.length > 0 
    ? Math.round(records.reduce((acc, curr) => acc + curr.score, 0) / records.length) 
    : 0;
  const topScore = records.length > 0 
    ? Math.max(...records.map(r => r.score)) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-game">
                لوحة تحكم المعلم (Teacher Mode)
              </h3>
              <p className="text-xs text-slate-400">
                إشراف وإعداد الأستاذ: عامر كراجه · سجل نتائج طلاب الصف التاسع في درس الجريمة الإلكترونية
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <Users className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400">عدد الطلاب المختبرين</span>
            <div className="text-lg font-black font-mono text-cyan-400">{records.length}</div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400">متوسط العلامات</span>
            <div className="text-lg font-black font-mono text-amber-400">{avgScore} / 100</div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <Zap className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400">أعلى علامة محققة</span>
            <div className="text-lg font-black font-mono text-emerald-400">{topScore} / 100</div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <CheckCircle2 className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400">معدل الإنجاز الكامل</span>
            <div className="text-lg font-black font-mono text-purple-400">
              {records.filter(r => r.completedStagesCount >= 11).length} طلاب
            </div>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث باسم الطالب أو الشعبة..."
                className="w-full pl-3 pr-9 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {uniqueSections.length > 0 && (
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">جميع الشُعب</option>
                {uniqueSections.map(sec => (
                  <option key={sec} value={sec}>شعبة {sec}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير إكسل (CSV)</span>
            </button>

            <button
              onClick={handleClearRecords}
              className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">مسح السجلات</span>
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs sm:text-sm">
              لا توجد سجلات محفوظة حتى الآن. ستظهر نتائج الطلاب هنا بمجرد إكمالهم التحديات!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/50">
                    <th className="p-3">اسم الطالب</th>
                    <th className="p-3">الشعبة</th>
                    <th className="p-3 text-center">العلامة /100</th>
                    <th className="p-3 text-center">XP</th>
                    <th className="p-3 text-center">صحيح / خطأ</th>
                    <th className="p-3 text-center">المراحل</th>
                    <th className="p-3 text-center">الوقت</th>
                    <th className="p-3">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-3 font-bold text-white">{rec.studentName}</td>
                      <td className="p-3 text-cyan-300 font-mono">({rec.section})</td>
                      <td className="p-3 text-center font-mono font-bold text-amber-400 text-sm">
                        {rec.score}
                      </td>
                      <td className="p-3 text-center font-mono text-cyan-400">
                        {rec.xp}
                      </td>
                      <td className="p-3 text-center font-mono">
                        <span className="text-emerald-400 font-bold">{rec.correctAnswers}</span>
                        <span className="text-slate-600 mx-1">/</span>
                        <span className="text-rose-400">{rec.wrongAnswers}</span>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-300">
                        {rec.completedStagesCount} / 12
                      </td>
                      <td className="p-3 text-center font-mono text-slate-400">
                        {Math.floor(rec.durationSeconds / 60)}د {rec.durationSeconds % 60}ث
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">
                        {rec.dateString}
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
  );
};

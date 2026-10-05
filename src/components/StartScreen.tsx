import React, { useState } from 'react';
import { Shield, Rocket, User, BookOpen, Volume2, UserCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { StudentInfo } from '../types/game';
import { soundManager } from '../utils/sound';

interface StartScreenProps {
  onStartGame: (student: StudentInfo) => void;
  onOpenTeacherMode: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, onOpenTeacherMode }) => {
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      soundManager.playError();
      setErrorMsg("يرجى إدخال اسم الطالب كاملاً للبدء.");
      return;
    }
    if (!section.trim()) {
      soundManager.playError();
      setErrorMsg("يرجى إدخال الشعبة الصفية.");
      return;
    }

    soundManager.playSuccess();
    soundManager.startAmbientMusic();

    onStartGame({
      name: name.trim(),
      section: section.trim(),
      timestamp: Date.now()
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 cyber-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        {/* Main Card */}
        <div className="bg-slate-900/90 border border-cyan-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-cyan-950/80 backdrop-blur-xl">
          {/* Top Crest */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 p-1 mb-4 shadow-xl shadow-cyan-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center border border-cyan-400/40">
                <Shield className="w-10 h-10 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
              الصف التاسع الأساسي · المهارات الرقمية
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-game mt-3 mb-1">
              🛡️ محارب الأمن السيبراني
            </h1>

            <p className="text-sm sm:text-base font-semibold text-cyan-200 font-game mb-2">
              "هل أنت جاهز تحمي عالمك الرقمي؟"
            </p>

            <div className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              لعبة تفاعلية لمحاكاة حماية الفضاء الرقمي من الجرائم الإلكترونية، استناداً حصرياً إلى صفحات الكتاب (32–41).
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleStart} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                اسم الطالب: <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="اكتب اسمك الثلاثي هنا..."
                  className="w-full pl-3 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-right font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-right">
                الشعبة: <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={section}
                onChange={(e) => {
                  setSection(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="مثال: أ ، ب ، ج..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-right font-medium"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-base hover:scale-[1.02] transition-all shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2"
            >
              <span>ابدأ المهمة 🚀</span>
            </button>
          </form>

          {/* Teacher Credit Branding Required by Prompt */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <div className="text-sm font-extrabold text-amber-400 font-game mb-2">
              تصميم وإعداد الأستاذ: عامر كراجه
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onOpenTeacherMode();
                }}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>وضع المعلم (Teacher Mode)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

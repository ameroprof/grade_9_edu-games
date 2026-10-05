import React from 'react';
import { Award, CheckCircle, XCircle, Clock, Zap, Shield, ArrowRight, Printer, RotateCcw, Trophy, Star, RefreshCw } from 'lucide-react';
import { PlayerStats, StudentInfo } from '../types/game';
import { BADGES_LIST } from '../data/lessons';
import { GAME_STAGES } from '../data/stages';
import { soundManager } from '../utils/sound';

interface StudentReportProps {
  student: StudentInfo;
  stats: PlayerStats;
  onOpenCertificate: () => void;
  onRestart: () => void;
  onBackToMap: () => void;
}

export const StudentReport: React.FC<StudentReportProps> = ({
  student,
  stats,
  onOpenCertificate,
  onRestart,
  onBackToMap
}) => {
  const durationSeconds = stats.endTime 
    ? Math.round((stats.endTime - stats.startTime) / 1000)
    : Math.round((Date.now() - stats.startTime) / 1000);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins} دقيقة و ${remainder} ثانية`;
  };

  const getRank = (score: number) => {
    if (score >= 85) {
      return {
        title: "🏆 خبير الأمن السيبراني",
        badgeColor: "from-amber-400 to-yellow-500",
        desc: "أداء استثنائي فائق! أتقنت كافة مفاهيم الجريمة الإلكترونية وقوانينها وطبقات الوقاية السبع بدقة تامة.",
        icon: Trophy
      };
    } else if (score >= 60) {
      return {
        title: "⭐ حارس رقمي متقدم",
        badgeColor: "from-cyan-500 to-blue-600",
        desc: "أداء ممتاز وجيد جداً! لديك فهم عميق للمخاطر السيبرانية والوقاية منها مع بعض النقاط التي يمكنك صقلها.",
        icon: Star
      };
    } else {
      return {
        title: "🔄 تحتاج إلى إعادة التدريب",
        badgeColor: "from-rose-500 to-amber-600",
        desc: "جهد مشكور، لكن ما زال هناك بعض المفاهيم الدقيقة في صفحات الكتاب بحاجة إلى مراجعة وتدريب لرفع درعك الأمني.",
        icon: RefreshCw
      };
    }
  };

  const rank = getRank(stats.score);
  const RankIcon = rank.icon;

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      <div className="bg-slate-900/90 border border-cyan-800/60 rounded-2xl p-4 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Top Header */}
        <div className="text-center border-b border-slate-800 pb-6 mb-6">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-700">
            تقرير الإنجاز والتقييم النهائي الشامل
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-game mt-3 mb-1">
            تقرير المحارب: {student.name}
          </h2>
          <div className="text-xs text-slate-400">
            الصف التاسع الأساسي · شعبة ({student.section}) · مادة المهارات الرقمية
          </div>
        </div>

        {/* Rank Badge Banner */}
        <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 mb-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${rank.badgeColor} flex items-center justify-center shrink-0 shadow-lg`}>
            <RankIcon className="w-8 h-8 text-slate-950" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold text-slate-400">الرتبة والتقييم النهائي المكتسب:</span>
            <h3 className="text-lg sm:text-xl font-black text-white font-game">
              {rank.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {rank.desc}
            </p>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-center shrink-0">
            <span className="text-[11px] text-slate-400 block">العلامة النهائية</span>
            <span className="text-2xl font-black font-mono text-cyan-400">{stats.score} / 100</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
            <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="text-[11px] text-slate-400 font-medium">مجموع نقاط الخبرة</div>
            <div className="text-lg font-black font-mono text-amber-400">{stats.xp} XP</div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-[11px] text-slate-400 font-medium">الإجابات الصحيحة</div>
            <div className="text-lg font-black font-mono text-emerald-400">{stats.correctAnswers}</div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
            <XCircle className="w-5 h-5 text-rose-400 mx-auto mb-1" />
            <div className="text-[11px] text-slate-400 font-medium">الإجابات الخاطئة</div>
            <div className="text-lg font-black font-mono text-rose-400">{stats.wrongAnswers}</div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-center">
            <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <div className="text-[11px] text-slate-400 font-medium">الوقت المستغرق</div>
            <div className="text-xs sm:text-sm font-bold font-mono text-cyan-300 mt-1">
              {formatDuration(durationSeconds)}
            </div>
          </div>
        </div>

        {/* Stages Progress Detail */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>المراحل المكتملة ({stats.completedStages.length} / {GAME_STAGES.length})</span>
            </h4>
            <span className="text-xs text-cyan-400 font-mono">
              {Math.round((stats.completedStages.length / GAME_STAGES.length) * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {GAME_STAGES.map((stg) => {
              const isDone = stats.completedStages.includes(stg.id);
              return (
                <div
                  key={stg.id}
                  className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 ${
                    isDone
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-950 flex items-center justify-center font-mono text-[10px] shrink-0">
                    {stg.id}
                  </span>
                  <span className="truncate">{stg.title.split(':')[1] || stg.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Unlocked Section */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-6">
          <h4 className="text-xs sm:text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>الشارات والأوسمة التكتيكية المكتسبة ({stats.unlockedBadges.length} شارات)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {BADGES_LIST.map((badge) => {
              const isUnlocked = stats.unlockedBadges.includes(badge.id) || stats.completedStages.length >= 8;
              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-slate-900 border-amber-500/50 shadow-md'
                      : 'bg-slate-950/40 border-slate-900 opacity-40'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${badge.color} flex items-center justify-center text-slate-950 font-bold text-xs shrink-0`}>
                        ★
                      </div>
                      <h5 className="text-xs font-bold text-white truncate">{badge.title}</h5>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-cyan-400">
                    {isUnlocked ? "مُكتسبة ✓" : "مغلقة"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                onBackToMap();
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              الخريطة والقطاعات
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onRestart();
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة التدريب</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCertificate();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm hover:scale-105 transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>عرض وطباعة شهادة الإنجاز الرسمية 🖨️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

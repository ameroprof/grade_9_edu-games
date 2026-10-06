import React from 'react';
import { 
  Shield, 
  Lock, 
  CheckCircle2, 
  MapPin, 
  Flame, 
  Radio, 
  Crosshair, 
  Terminal, 
  Zap, 
  Skull,
  Award,
  ChevronLeft
} from 'lucide-react';
import { StageConfig, PlayerStats } from '../types/game';
import { GAME_STAGES } from '../data/stages';
import { soundManager } from '../utils/sound';

interface TacticalMapProps {
  stats: PlayerStats;
  onSelectStage: (stageId: number) => void;
  onOpenReport: () => void;
  onBackToWorld?: () => void;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  stats,
  onSelectStage,
  onOpenReport,
  onBackToWorld
}) => {
  const isStageUnlocked = (stageId: number) => {
    if (stageId === 1) return true;
    return stats.completedStages.includes(stageId - 1);
  };

  const getStageStatus = (stageId: number) => {
    if (stats.completedStages.includes(stageId)) return 'COMPLETED';
    if (isStageUnlocked(stageId)) return 'AVAILABLE';
    return 'LOCKED';
  };

  const completedCount = stats.completedStages.length;
  const progressPercent = Math.round((completedCount / GAME_STAGES.length) * 100);

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-950 p-3 sm:p-6 cyber-grid relative overflow-hidden">
      {/* Tactical Radar Background Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-cyan-500/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-cyan-500/15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-cyan-500/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Briefing */}
        <div className="bg-gradient-to-r from-slate-900/90 via-cyan-950/70 to-slate-900/90 border border-cyan-800/50 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400">
                  خريطة العمليات السيبرانية · CYBER BATTLEGROUND
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-game flex items-center gap-2">
                <span>قطاعات المدينة الرقمية (Cyber City Sectors)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                اختر القطاع التكتيكي للبدء في حمايته من هجمات الجرائم الإلكترونية المحددة في صفحات الكتاب (32–41). أنجز المهام بالتسلسل لفتح الحصن النهائي!
              </p>
            </div>

            {/* Tactical Stats Badge & Navigation */}
            <div className="flex flex-wrap items-center gap-3">
              {onBackToWorld && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onBackToWorld();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-600/30 flex items-center gap-1.5"
                >
                  <span>العودة لعالم المدينة 🎮</span>
                </button>
              )}

              <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-xl border border-cyan-900/40">
                <div className="text-center px-2">
                  <div className="text-[11px] text-slate-400 font-medium">القطاعات المُحررة</div>
                  <div className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
                    {completedCount} / {GAME_STAGES.length}
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div className="text-center px-2">
                  <div className="text-[11px] text-slate-400 font-medium">منطقة الأمان (Safe Zone)</div>
                  <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                    {progressPercent}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar with Storm Indicator */}
          <div className="mt-4 pt-4 border-t border-cyan-900/30">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span>تقدم تطهير المدينة من التهديدات</span>
              <span className="text-cyan-400 font-mono">{progressPercent}% مكتمل</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-cyan-900/60">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-500 shadow-md shadow-cyan-500/50"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {GAME_STAGES.map((stage) => {
            const status = getStageStatus(stage.id);
            const isBoss = stage.id === 12;

            return (
              <div
                key={stage.id}
                onClick={() => {
                  if (status !== 'LOCKED') {
                    soundManager.playClick();
                    onSelectStage(stage.id);
                  } else {
                    soundManager.playError();
                  }
                }}
                className={`group relative rounded-xl p-4 transition-all duration-300 border flex flex-col justify-between cursor-pointer ${
                  status === 'COMPLETED'
                    ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950/50'
                    : status === 'AVAILABLE'
                    ? isBoss
                      ? 'bg-gradient-to-br from-rose-950/80 to-slate-900 border-rose-500/60 shadow-lg shadow-rose-900/30 animate-pulse hover:border-rose-400'
                      : 'bg-gradient-to-br from-cyan-950/40 to-slate-900/90 border-cyan-500/60 hover:border-cyan-400 shadow-lg shadow-cyan-950/50 hover:-translate-y-1'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Sector Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/40">
                      مهمة #{stage.id}
                    </span>

                    {/* Status Icon */}
                    {status === 'COMPLETED' ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مكتمل</span>
                      </span>
                    ) : status === 'AVAILABLE' ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-600/50 animate-pulse">
                        <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                        <span>مفتوح للقتال</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                        <span>مغلق</span>
                      </span>
                    )}
                  </div>

                  <h3 className={`text-base font-extrabold mb-1 group-hover:text-cyan-300 transition-colors ${
                    isBoss ? 'text-rose-400 font-game text-lg' : 'text-white'
                  }`}>
                    {stage.title}
                  </h3>

                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                    {stage.subtitle}
                  </p>

                  <div className="text-[11px] text-cyan-500/90 font-medium mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{stage.sectorName}</span>
                  </div>
                </div>

                {/* Sector Footer with Rewards & Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
                    <Zap className="w-3.5 h-3.5 fill-amber-400" />
                    <span>+{stage.xpReward} XP</span>
                  </div>

                  <button
                    disabled={status === 'LOCKED'}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                      status === 'COMPLETED'
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : status === 'AVAILABLE'
                        ? isBoss
                          ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-600/30'
                          : 'bg-cyan-500 text-slate-950 font-extrabold hover:bg-cyan-400 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    <span>{status === 'COMPLETED' ? 'إعادة المهمة' : isBoss ? 'قتال الزعيم ⚔️' : 'ابدأ الهبوط 🚀'}</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

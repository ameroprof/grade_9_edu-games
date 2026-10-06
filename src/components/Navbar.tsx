import React from 'react';
import { Shield, Heart, Zap, Volume2, VolumeX, MapPin, Award, UserCheck, Gamepad2, Backpack } from 'lucide-react';
import { PlayerStats, StudentInfo, GameView } from '../types/game';
import { soundManager } from '../utils/sound';

interface NavbarProps {
  student: StudentInfo;
  stats: PlayerStats;
  currentView: GameView;
  currentStageId: number;
  onNavigate: (view: GameView) => void;
  onOpenTeacherMode: () => void;
  onOpenInventory?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  student,
  stats,
  currentView,
  currentStageId,
  onNavigate,
  onOpenTeacherMode,
  onOpenInventory
}) => {
  const [isMuted, setIsMuted] = React.useState(soundManager.isMuted);

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-cyan-900/50 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Zone 1: Brand & Student Lockup */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('WORLD_ADVENTURE');
            }}
            className="flex items-center gap-2 text-right group focus:outline-none"
            title="العودة لعالم المدينة الرقمية"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-1.5 font-game">
                <span>محارب الأمن السيبراني</span>
              </h1>
              <div className="text-[11px] text-cyan-400 font-medium truncate max-w-[130px] sm:max-w-none">
                {student.name} · شعبة {student.section}
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Combat Stats HUD (XP, Level, Score, Hearts) */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Hearts / Health */}
          <div className="flex items-center gap-1 bg-slate-900/80 px-2 sm:px-3 py-1.5 rounded-lg border border-slate-800">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                  heartIndex <= stats.hearts
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-700 fill-transparent scale-90'
                }`}
              />
            ))}
          </div>

          {/* Level & XP */}
          <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-slate-800">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div className="text-xs font-mono font-bold text-slate-200">
              <span className="text-amber-400">LVL {stats.level}</span>
              <span className="text-slate-500 mx-1">·</span>
              <span className="tabular-nums text-cyan-400">{stats.xp} XP</span>
            </div>
          </div>

          {/* Final Score out of 100 */}
          <div className="flex items-center gap-1.5 bg-cyan-950/60 px-2.5 sm:px-3 py-1.5 rounded-lg border border-cyan-800/60">
            <span className="text-xs text-slate-400 hidden sm:inline">العلامة:</span>
            <span className="text-sm sm:text-base font-bold font-mono text-cyan-300 tabular-nums">
              {stats.score}/100
            </span>
          </div>
        </div>

        {/* Zone 3: Navigation & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('WORLD_ADVENTURE');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              currentView === 'WORLD_ADVENTURE'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="عالم المدينة الرقمية"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">عالم اللعبة</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('TACTICAL_MAP');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              currentView === 'TACTICAL_MAP'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="الخريطة والقطاعات"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">القطاعات</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('REPORT');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              currentView === 'REPORT'
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="تقرير الإنجاز"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">التقرير</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenTeacherMode();
            }}
            className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-800/70 text-emerald-400 text-xs font-medium hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
            title="وضع المعلم للأستاذ عامر كراجه"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">وضع المعلم</span>
          </button>
        </div>
      </div>
    </header>
  );
};

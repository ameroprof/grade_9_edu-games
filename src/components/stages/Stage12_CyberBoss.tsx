import React, { useState } from 'react';
import { Skull, Shield, Zap, CheckCircle, AlertTriangle, ArrowRight, Award, Flame, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NovaGuide } from '../NovaGuide';
import { GAME_STAGES } from '../../data/stages';
import { BOSS_ATTACKS, BossAttack } from '../../data/questions';
import { soundManager } from '../../utils/sound';

interface StageProps {
  onComplete: (scoreEarned: number, xpEarned: number) => void;
  onWrongAnswer: () => void;
  onOpenReport: () => void;
}

export const Stage12_CyberBoss: React.FC<StageProps> = ({ onComplete, onWrongAnswer, onOpenReport }) => {
  const stage = GAME_STAGES[11];
  const attacks = BOSS_ATTACKS;

  const [currentAttackIndex, setCurrentAttackIndex] = useState(0);
  const [bossHp, setBossHp] = useState(100);
  const [playerShield, setPlayerShield] = useState(100);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isHitSuccessful, setIsHitSuccessful] = useState(false);
  const [correctHits, setCorrectHits] = useState(0);
  const [battleFinished, setBattleFinished] = useState(false);

  const currentAttack: BossAttack = attacks[currentAttackIndex];

  const handleDefenseAction = (opt: { id: string; isCorrect: boolean; feedback: string }) => {
    if (showFeedback) return;
    setSelectedOptionId(opt.id);
    setShowFeedback(true);
    setFeedbackText(opt.feedback);
    setIsHitSuccessful(opt.isCorrect);

    if (opt.isCorrect) {
      soundManager.playLaser();
      setCorrectHits(prev => prev + 1);
      // Decrease boss HP
      setBossHp(prev => Math.max(0, prev - 25));
    } else {
      soundManager.playAlarm();
      onWrongAnswer();
      // Decrease player shield
      setPlayerShield(prev => Math.max(20, prev - 20));
    }
  };

  const handleNextPhase = () => {
    soundManager.playClick();
    if (currentAttackIndex < attacks.length - 1) {
      setCurrentAttackIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setShowFeedback(false);
    } else {
      // Victory!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      soundManager.playBadgeUnlock();
      const scoreEarned = Math.round((correctHits / attacks.length) * 12);
      onComplete(scoreEarned, stage.xpReward);
      setBattleFinished(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6">
      <NovaGuide dialogue={stage.novaText} bookReference={stage.conceptBookReference} />

      {!battleFinished ? (
        <div className="bg-slate-900/90 border border-rose-900/60 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
          {/* Battle Arena Header with Boss and Player Meters */}
          <div className="bg-slate-950 rounded-xl p-4 border border-rose-800/60 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Boss Meter */}
              <div className="flex items-center gap-3 bg-rose-950/40 p-3 rounded-lg border border-rose-900/60">
                <div className="w-12 h-12 rounded-xl bg-rose-600/30 border border-rose-500 flex items-center justify-center shrink-0">
                  <Skull className="w-7 h-7 text-rose-400 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-rose-400 font-game">الزعيم: الروبوت الخبيث (Zero-Day Bot)</span>
                    <span className="font-mono text-rose-300">{bossHp} HP</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-rose-900">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 to-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${bossHp}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Player Defense Meter */}
              <div className="flex items-center gap-3 bg-cyan-950/40 p-3 rounded-lg border border-cyan-900/60">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/30 border border-cyan-500 flex items-center justify-center shrink-0">
                  <Shield className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-cyan-400 font-game">درع محارب الأمن السيبراني</span>
                    <span className="font-mono text-cyan-300">{playerShield}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-900">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${playerShield}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Boss Phase Card */}
          <div className="bg-slate-950/80 rounded-xl p-4 sm:p-5 border border-slate-800 mb-6">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-mono text-amber-400 font-bold">
                المرحلة التكتيكية {currentAttackIndex + 1} من {attacks.length}
              </span>
              <span className="text-rose-400 font-bold bg-rose-950/80 px-2.5 py-0.5 rounded border border-rose-800">
                نوع الهجوم: {currentAttack.crimeType}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-extrabold text-white mb-3 leading-relaxed">
              {currentAttack.bossAction}
            </h4>

            <div className="text-xs text-slate-300 font-semibold mb-3">
              اختر السلاح الدفاعي السيبراني المناسب لصد الهجوم وتوجيه ضربة مضادة للزعيم:
            </div>

            {/* Defense Options */}
            <div className="space-y-3">
              {currentAttack.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;

                let btnStyle = 'bg-slate-900 border-slate-800 hover:border-cyan-500 hover:bg-slate-850 text-slate-200';
                if (showFeedback) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950/50 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={showFeedback}
                    onClick={() => handleDefenseAction(opt)}
                    className={`w-full text-right p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs">
                      ⚡
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hit Result & Feedback */}
          {showFeedback && (
            <div className={`p-4 rounded-xl border mb-5 animate-in fade-in duration-200 ${
              isHitSuccessful
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/70 border-rose-500 text-rose-200'
            }`}>
              <div className="flex items-start gap-3">
                {isHitSuccessful ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="text-xs font-bold mb-1">
                    {isHitSuccessful ? "🎯 ضربة دفاعية حاسمة!" : "⚠️ اختراق جزئي للدرع!"}
                  </h5>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {feedbackText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showFeedback && (
            <div className="flex justify-end">
              <button
                onClick={handleNextPhase}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-xs sm:text-sm hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-rose-900/40"
              >
                <span>{currentAttackIndex < attacks.length - 1 ? 'المرحلة التالية من القتال ⚔️' : 'القضاء النهائي على الزعيم 🏆'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Victory Modal */
        <div className="bg-slate-900 border-2 border-amber-400/80 rounded-2xl p-6 sm:p-8 text-center shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Award className="w-10 h-10 text-amber-400" />
          </div>

          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-700">
            انتصار ساحق · BATTLE ROYALE VICTORY
          </span>

          <h3 className="text-2xl sm:text-3xl font-black text-white font-game mt-3 mb-2">
            تمت هزيمة الزعيم السيبراني وتحرير المدينة بالكامل! 🏆
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
            تهانينا يا بطل! لقد أظهرت شجاعة وذكاء فائقين في تطبيق جميع مفاهيم درس الجريمة الإلكترونية وقوانينها ووسائل الوقاية السبع وسلوكيات المواطنة الرقمية (ص 32–41).
          </p>

          <button
            onClick={onOpenReport}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-xl shadow-amber-500/30 inline-flex items-center gap-2"
          >
            <span>عرض التقرير النهائي واستلام شهادة الإنجاز 📜</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

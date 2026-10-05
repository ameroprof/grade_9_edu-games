import React, { useState, useEffect } from 'react';
import { LockKeyhole, RefreshCw, CheckCircle, AlertTriangle, ArrowRight, Zap, ShieldCheck, HardDrive, Cloud } from 'lucide-react';
import { NovaGuide } from '../NovaGuide';
import { GAME_STAGES } from '../../data/stages';
import { STAGE_QUESTIONS } from '../../data/questions';
import { soundManager } from '../../utils/sound';

interface StageProps {
  onComplete: (scoreEarned: number, xpEarned: number) => void;
  onWrongAnswer: () => void;
  onNextStage: () => void;
}

export const Stage8_Ransomware: React.FC<StageProps> = ({ onComplete, onWrongAnswer, onNextStage }) => {
  const stage = GAME_STAGES[7];
  const questions = STAGE_QUESTIONS[8];

  const [activeScreen, setActiveScreen] = useState<'LOCKDOWN' | 'RESTORING' | 'RESTORED' | 'QUIZ'>('LOCKDOWN');
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [stageFinished, setStageFinished] = useState(false);

  // Restore simulation
  useEffect(() => {
    if (activeScreen === 'RESTORING') {
      const timer = setInterval(() => {
        setRestoreProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            soundManager.playSuccess();
            setActiveScreen('RESTORED');
            return 100;
          }
          return prev + 25;
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [activeScreen]);

  const handlePayRansomMistake = () => {
    soundManager.playError();
    onWrongAnswer();
    // Do not allow paying!
    alert("⚠️ خطأ أمني جسيم! دفع الفدية لا يضمن استعادة الملفات، بل يدعم مجرمي الإنترنت! الحل الصحيح هو رفض الدفع واستعادة الملفات من النسخ الاحتياطي النظيف (كتاب الطالب ص 37).");
  };

  const handleExecuteBackupRestore = () => {
    soundManager.playShieldUp();
    setActiveScreen('RESTORING');
  };

  const handleSelectOption = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);

    const isCorrect = idx === questions[currentQIndex].correctIndex;
    if (isCorrect) {
      soundManager.playSuccess();
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      soundManager.playError();
      onWrongAnswer();
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      const score = Math.round((correctAnswersCount / questions.length) * 8);
      onComplete(score, stage.xpReward);
      setStageFinished(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      <NovaGuide dialogue={stage.novaText} bookReference={stage.conceptBookReference} />

      {!stageFinished ? (
        <div className="bg-slate-900/90 border border-cyan-800/60 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
          {activeScreen === 'LOCKDOWN' && (
            <div className="bg-rose-950/80 border-2 border-rose-500 rounded-xl p-5 sm:p-6 text-center shadow-2xl animate-pulse">
              <div className="w-16 h-16 rounded-full bg-rose-600/30 border border-rose-500 flex items-center justify-center mx-auto mb-3">
                <LockKeyhole className="w-8 h-8 text-rose-400" />
              </div>

              <span className="text-xs font-mono font-bold tracking-widest text-rose-300 bg-rose-900/60 px-3 py-1 rounded-full border border-rose-700">
                🚨 إنذار أمني طارئ: تم تشفير ملفاتك! (RANSOMWARE CRISIS)
              </span>

              <h3 className="text-lg sm:text-xl font-black text-white font-game mt-3 mb-2">
                "تم تشفير جميع بياناتك المهمة! ادفع فدية مالية قدرها 5000 دينار فوراً لفك التشفير!"
              </h3>

              <p className="text-xs text-rose-200 max-w-lg mx-auto mb-6 leading-relaxed">
                هجمات الفدية الرقمية: برامج ضارة تعمل على تشفير بيانات المستخدم، وتطالبه بدفع فدية لفك التشفير (ص 34).
              </p>

              {/* Tactical Choice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                <button
                  onClick={handlePayRansomMistake}
                  className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-rose-800 text-rose-300 text-xs font-bold transition-all"
                >
                  الاستسلام ودفع الفدية المالية ❌
                </button>

                <button
                  onClick={handleExecuteBackupRestore}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/30"
                >
                  رفض الفدية واستعادة النسخ الاحتياطي (Data Backup) 🛡️
                </button>
              </div>
            </div>
          )}

          {activeScreen === 'RESTORING' && (
            <div className="bg-slate-950 rounded-xl p-8 text-center border border-slate-800">
              <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <h4 className="text-base font-bold text-white mb-2 font-game">
                جارٍ استعادة البيانات السليمة من وسائط التخزين السحابية والخارجية...
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                المواظبة على النسخ الاحتياطي للبيانات المهمة في وسائط خارجية أو خدمات سحابية موثوقة (كتاب الطالب ص 37).
              </p>

              <div className="w-full max-w-md mx-auto h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${restoreProgress}%` }}
                />
              </div>
              <div className="text-xs font-mono text-cyan-400 mt-2">{restoreProgress}%</div>
            </div>
          )}

          {activeScreen === 'RESTORED' && (
            <div className="bg-slate-950 rounded-xl p-6 text-center border border-emerald-500/60">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <h4 className="text-base font-black text-white mb-2">
                تم إحباط هجوم الفدية بنجاح بنسبة 100%!
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-5 leading-relaxed">
                استعدت جميع الملفات المشفرة من النسخ الاحتياطي السحابي (Data Backup) دون دفع أي فدية للمعتدين! الآن اختبر معرفتك لتأكيد إنهاء المهمة.
              </p>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveScreen('QUIZ');
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs sm:text-sm hover:bg-cyan-400 transition-all inline-flex items-center gap-2 shadow-lg shadow-cyan-500/30"
              >
                <span>الانتقال لأسئلة المهمة 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeScreen === 'QUIZ' && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-mono text-cyan-400">سؤال {currentQIndex + 1} من {questions.length}</span>
                <span>المصدر: كتاب المهارات الرقمية ص 34 & 37</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mb-4 leading-relaxed">
                {questions[currentQIndex].prompt}
              </h3>

              <div className="space-y-2.5 mb-4">
                {questions[currentQIndex].options.map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === questions[currentQIndex].correctIndex;

                  let style = 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-900';
                  if (showFeedback) {
                    if (isCorrect) {
                      style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md font-bold';
                    } else if (isSelected) {
                      style = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    } else {
                      style = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={showFeedback}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-right p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${style}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                        {optIdx + 1}
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div className={`p-4 rounded-xl border mb-4 animate-in fade-in duration-200 ${
                  selectedOption === questions[currentQIndex].correctIndex
                    ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200'
                    : 'bg-amber-950/60 border-amber-500/70 text-amber-200'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {selectedOption === questions[currentQIndex].correctIndex ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs sm:text-sm leading-relaxed">
                        {selectedOption === questions[currentQIndex].correctIndex
                          ? questions[currentQIndex].explanationCorrect
                          : questions[currentQIndex].explanationWrong}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {showFeedback && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs sm:text-sm hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/30"
                  >
                    <span>{currentQIndex < questions.length - 1 ? 'السؤال التالي 🎯' : 'إنهاء المهمة بنجاح 🏆'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-emerald-500/60 rounded-2xl p-6 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-black text-white font-game mb-2">
            تم تحرير مستودع النسخ الاحتياطي H-08 بنجاح! 💾🛡️
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-4">
            أتقنت التصدي لبرمجيات الفدية الرقمية واستعادة البيانات المهمة عبر النسخ الاحتياطي المعتمد (ص 34 & 37). حصلت على +{stage.xpReward} XP!
          </p>
          <button
            onClick={onNextStage}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 inline-flex items-center gap-2"
          >
            <span>انتقل للمرحلة 9: وحدة مكافحة الابتزاز الإلكتروني 🚀</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Server, Shield, AlertCircle, CheckCircle, ArrowRight, Zap, Lock, Unlock, Play } from 'lucide-react';
import { NovaGuide } from '../NovaGuide';
import { GAME_STAGES } from '../../data/stages';
import { STAGE_QUESTIONS } from '../../data/questions';
import { soundManager } from '../../utils/sound';

interface StageProps {
  onComplete: (scoreEarned: number, xpEarned: number) => void;
  onWrongAnswer: () => void;
  onNextStage: () => void;
}

interface ServerPort {
  id: number;
  label: string;
  isBreached: boolean;
  isProtected: boolean;
}

export const Stage3_Hacking: React.FC<StageProps> = ({ onComplete, onWrongAnswer, onNextStage }) => {
  const stage = GAME_STAGES[2];
  const questions = STAGE_QUESTIONS[3];

  const [gameActive, setGameActive] = useState(false);
  const [ports, setPorts] = useState<ServerPort[]>([
    { id: 1, label: "منفذ إدارة الشبكة (Port 22)", isBreached: false, isProtected: false },
    { id: 2, label: "منفذ خادم قاعدة البيانات (Port 3306)", isBreached: false, isProtected: false },
    { id: 3, label: "منفذ نظام التشغيل الأساسي (Port 445)", isBreached: false, isProtected: false },
    { id: 4, label: "منفذ مشاركة الملفات (Port 139)", isBreached: false, isProtected: false }
  ]);
  const [serverIntegrity, setServerIntegrity] = useState(100);
  const [minigameWon, setMinigameWon] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [stageFinished, setStageFinished] = useState(false);

  // Minigame Loop
  useEffect(() => {
    if (!gameActive || minigameWon) return;

    const timer = setInterval(() => {
      // Randomly attack an unprotected port
      setPorts(prev => {
        const unprotected = prev.filter(p => !p.isProtected);
        if (unprotected.length === 0) {
          // All protected!
          setMinigameWon(true);
          soundManager.playSuccess();
          return prev;
        }

        const target = unprotected[Math.floor(Math.random() * unprotected.length)];
        return prev.map(p => p.id === target.id ? { ...p, isBreached: true } : p);
      });

      // Decrease integrity if any breached
      setServerIntegrity(prev => {
        const anyBreached = ports.some(p => p.isBreached);
        if (anyBreached) {
          soundManager.playAlarm();
          const next = Math.max(0, prev - 10);
          if (next === 0) {
            onWrongAnswer();
          }
          return next;
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [gameActive, minigameWon, ports]);

  const handleSealPort = (portId: number) => {
    soundManager.playLaser();
    setPorts(prev => {
      const updated = prev.map(p => p.id === portId ? { ...p, isProtected: true, isBreached: false } : p);
      if (updated.every(p => p.isProtected)) {
        setMinigameWon(true);
        soundManager.playSuccess();
      }
      return updated;
    });
    setServerIntegrity(prev => Math.min(100, prev + 15));
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
          {/* Minigame Server Defense Screen */}
          <div className="border-b border-slate-800 pb-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white font-game flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  <span>برج السيرفر: صد محاولة الاختراق (Hacking Interception)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  الاختراق هو الوصول غير المصرّح به للحواسيب والشبكات لسرقة المعلومات أو العبث بها أو تعطيل نظام التشغيل (ص 34).
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
                <span className="text-xs text-slate-400">سلامة الخادم:</span>
                <span className={`text-sm font-bold font-mono ${serverIntegrity > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {serverIntegrity}%
                </span>
              </div>
            </div>

            {/* Interactive Server Rack */}
            {!gameActive && !minigameWon ? (
              <div className="bg-slate-950/80 rounded-xl p-6 text-center border border-slate-800">
                <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-2 animate-bounce" />
                <h4 className="text-sm font-bold text-white mb-1">
                  محاولات تسلل واختراق نشطة ترصدها الجدران النارية!
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  اضغط على زر البدء وقم فوراً بإغلاق المنافذ المفتوحة وحظر محاولات الوصول غير المصرح به قبل تعطيل نظام التشغيل!
                </p>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setGameActive(true);
                  }}
                  className="px-6 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs sm:text-sm hover:bg-cyan-400 transition-all inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>بدء صد الهجوم التكتيكي ⚡</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {ports.map((port) => (
                    <div
                      key={port.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        port.isProtected
                          ? 'bg-emerald-950/40 border-emerald-500/60'
                          : port.isBreached
                          ? 'bg-rose-950/80 border-rose-500 animate-pulse'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {port.isProtected ? (
                          <Lock className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Unlock className="w-4 h-4 text-amber-400" />
                        )}
                        <div>
                          <div className="text-xs font-bold text-white">{port.label}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {port.isProtected ? "محمي ومُغلق" : port.isBreached ? "⚠️ محاولة اختراق نشطة!" : "مفتوح"}
                          </div>
                        </div>
                      </div>

                      <button
                        disabled={port.isProtected}
                        onClick={() => handleSealPort(port.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          port.isProtected
                            ? 'bg-emerald-900/60 text-emerald-300 cursor-default'
                            : port.isBreached
                            ? 'bg-rose-600 hover:bg-rose-500 text-white animate-bounce'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                        }`}
                      >
                        {port.isProtected ? "مُغلق بنجاح ✓" : "إغلاق المنفذ 🛡️"}
                      </button>
                    </div>
                  ))}
                </div>

                {minigameWon && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/80 rounded-xl text-center text-xs text-emerald-300 font-bold">
                    🎯 تم حظر جميع محاولات الاختراق وحماية نظام التشغيل بنجاح!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theoretical Quiz on Hacking */}
          {minigameWon && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-mono text-cyan-400">تحدي المفهوم: سؤال {currentQIndex + 1} من {questions.length}</span>
                <span>المصدر: كتاب المهارات الرقمية ص 34</span>
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
                      <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
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
            تم تأمين خادم السيرفر C-03 وإحباط الاختراق! 🛡️
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-4">
            أثبت قدرتك التكتيكية على منع الوصول غير المصرح به وحماية أنظمة التشغيل والشبكات من العبث والسرقة. حصلت على +{stage.xpReward} XP!
          </p>
          <button
            onClick={onNextStage}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 inline-flex items-center gap-2"
          >
            <span>انتقل للمرحلة 4: مختبر مكافحة البرمجيات الخبيثة 🚀</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

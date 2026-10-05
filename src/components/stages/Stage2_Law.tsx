import React, { useState } from 'react';
import { Scale, CheckCircle, AlertTriangle, ArrowRight, ShieldAlert, FileText, Check, Lock } from 'lucide-react';
import { NovaGuide } from '../NovaGuide';
import { GAME_STAGES } from '../../data/stages';
import { STAGE_QUESTIONS } from '../../data/questions';
import { SPREAD_REASONS_AND_LAW } from '../../data/lessons';
import { soundManager } from '../../utils/sound';

interface StageProps {
  onComplete: (scoreEarned: number, xpEarned: number) => void;
  onWrongAnswer: () => void;
  onNextStage: () => void;
}

export const Stage2_Law: React.FC<StageProps> = ({ onComplete, onWrongAnswer, onNextStage }) => {
  const stage = GAME_STAGES[1];
  const questions = STAGE_QUESTIONS[2];

  const [activeStep, setActiveStep] = useState<'DECRYPT_LAW' | 'SOLVE_QUESTIONS'>('DECRYPT_LAW');
  const [unlockedArticles, setUnlockedArticles] = useState<number[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [stageFinished, setStageFinished] = useState(false);

  const lawPillars = SPREAD_REASONS_AND_LAW.jordanLaw.keyProvisions;

  const handleUnlockPillar = (idx: number) => {
    if (!unlockedArticles.includes(idx)) {
      soundManager.playLaser();
      setUnlockedArticles([...unlockedArticles, idx]);
    }
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
          {activeStep === 'DECRYPT_LAW' ? (
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base sm:text-lg font-black text-white font-game">
                    مختبر التشريعات وأسباب انتشار الخطر السيبراني
                  </h3>
                </div>
                <span className="text-xs text-slate-400">ص 35–36</span>
              </div>

              {/* Reasons of spread alert box */}
              <div className="bg-slate-950/80 border border-cyan-900/60 rounded-xl p-3.5 mb-5">
                <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>لماذا تنتشر الجرائم الإلكترونية في الفضاء الرقمي؟ (كتاب الطالب ص 35–36)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {SPREAD_REASONS_AND_LAW.spreadReasons.map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                      <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 text-[10px] flex items-center justify-center font-mono shrink-0 mt-0.5 border border-cyan-800">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jordanian Law 2023 Terminal */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs sm:text-sm font-bold text-white">
                      قانون الجرائم الإلكترونية الأردني (2015م ⬅️ تعديل 2023م)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <span className="bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      41 مادة
                    </span>
                    <span className="bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 text-cyan-400">
                      فارق 23 مادة
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {SPREAD_REASONS_AND_LAW.jordanLaw.details}
                </p>

                <div className="text-xs font-bold text-slate-300 mb-2">
                  انقر على الركائز الثلاث لقانون 2023 لفك تشفيرها والمتابعة ({unlockedArticles.length}/3):
                </div>

                <div className="space-y-2.5">
                  {lawPillars.map((pillar, idx) => {
                    const isUnlocked = unlockedArticles.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleUnlockPillar(idx)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isUnlocked
                            ? 'bg-slate-900 border-cyan-500/60 shadow-md'
                            : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isUnlocked ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-600'
                        }`}>
                          {isUnlocked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Lock className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                            {pillar.title}
                          </h5>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {isUnlocked ? pillar.desc : "انقر لفك التشفير..."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {unlockedArticles.length === 3 ? (
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveStep('SOLVE_QUESTIONS');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs sm:text-sm hover:scale-105 transition-all shadow-lg shadow-cyan-500/30 inline-flex items-center gap-2"
                  >
                    <span>تم فك التشفير! ابدأ تحدي التشريعات 🚀</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-center text-xs text-cyan-400 animate-pulse">
                  انقر على البنود الثلاثة أعلاه لفتح التحدي
                </p>
              )}
            </div>
          ) : (
            /* Quiz View */
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-mono text-cyan-400">سؤال {currentQIndex + 1} من {questions.length}</span>
                <span>المصدر: كتاب المهارات الرقمية ص 35–36</span>
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
            تم تحرير قطاع التشريعات B-02 بنجاح! ⚖️
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-4">
            أتقنت أسباب انتشار الجريمة وتفاصيل قانون الجرائم الإلكترونية الأردني (41 مادة، فارق 23 مادة، عقوبات سجن وغرامة). حصلت على +{stage.xpReward} XP!
          </p>
          <button
            onClick={onNextStage}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 inline-flex items-center gap-2"
          >
            <span>انتقل للمرحلة 3: حصن السيرفر ضد الاختراق 🚀</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

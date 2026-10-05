import React, { useState } from 'react';
import { Compass, CheckCircle, AlertTriangle, ArrowRight, Zap, Check, Shield } from 'lucide-react';
import { NovaGuide } from '../NovaGuide';
import { GAME_STAGES } from '../../data/stages';
import { DIGITAL_CITIZENSHIP_POINTS } from '../../data/lessons';
import { STAGE_QUESTIONS } from '../../data/questions';
import { soundManager } from '../../utils/sound';

interface StageProps {
  onComplete: (scoreEarned: number, xpEarned: number) => void;
  onWrongAnswer: () => void;
  onNextStage: () => void;
}

export const Stage11_DigitalCitizen: React.FC<StageProps> = ({ onComplete, onWrongAnswer, onNextStage }) => {
  const stage = GAME_STAGES[10];
  const questions = STAGE_QUESTIONS[11];
  const citizenPoints = DIGITAL_CITIZENSHIP_POINTS;

  const [activeTab, setActiveTab] = useState<'PILLARS' | 'DECISIONS'>('PILLARS');
  const [reviewedPillars, setReviewedPillars] = useState<string[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [stageFinished, setStageFinished] = useState(false);

  const handleReviewPillar = (id: string) => {
    if (!reviewedPillars.includes(id)) {
      soundManager.playLaser();
      setReviewedPillars([...reviewedPillars, id]);
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
          {/* Header */}
          <div className="border-b border-slate-800 pb-3 mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-game flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>منارة المواطنة الرقمية والسلوك المسؤول (Digital Citizenship)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                سلوكيات المواطنة الرقمية الخمسة المعتمدة بعد دراسة الجريمة الإلكترونية (كتاب الطالب ص 38).
              </p>
            </div>
          </div>

          {activeTab === 'PILLARS' ? (
            <div>
              <div className="text-xs text-slate-300 mb-3 font-semibold">
                انقر على بطاقات الركائز الخمس التالية لتفعيل المنارة الرقمية ({reviewedPillars.length}/5):
              </div>

              <div className="space-y-2.5 mb-6">
                {citizenPoints.map((point) => {
                  const isReviewed = reviewedPillars.includes(point.id);
                  return (
                    <div
                      key={point.id}
                      onClick={() => handleReviewPillar(point.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isReviewed
                          ? 'bg-slate-950 border-cyan-500/60 shadow-md'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isReviewed ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-600'
                      }`}>
                        {isReviewed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Shield className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                          {point.title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {isReviewed ? point.rule : "انقر لتفعيل هذا المبدأ..."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {reviewedPillars.length === 5 ? (
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab('DECISIONS');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs sm:text-sm hover:scale-105 transition-all shadow-lg shadow-cyan-500/30 inline-flex items-center gap-2"
                  >
                    <span>اكتملت المنارة! ابدأ تحدي المواطنة التفاعلي 🚀</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-center text-xs text-cyan-400 animate-pulse">
                  انقر على الركائز الخمس لتفعيلها والمتابعة
                </p>
              )}
            </div>
          ) : (
            /* Quiz */
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-mono text-cyan-400">سؤال {currentQIndex + 1} من {questions.length}</span>
                <span>المصدر: كتاب المهارات الرقمية ص 38</span>
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
            تم تشغيل منارة المواطنة الرقمية K-11 بنجاح! 🧭🛡️
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-4">
            أتقنت المبادئ الخمسة للمواطنة الرقمية المسؤولة (ص 38). الآن، الحصن النهائي مفتوح لمواجهة الزعيم السيبراني! حصلت على +{stage.xpReward} XP!
          </p>
          <button
            onClick={onNextStage}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 text-white font-black text-sm hover:scale-105 transition-all shadow-lg shadow-rose-900/40 inline-flex items-center gap-2"
          >
            <span>انطلق للمعركة النهائية: قهر الزعيم السيبراني ⚔️🏆</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

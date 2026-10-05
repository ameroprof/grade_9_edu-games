import React, { useState } from 'react';
import { UserCheck, ShieldAlert, CheckCircle, AlertTriangle, ArrowRight, Zap, MoveUp, MoveDown, Lock, Check } from 'lucide-react';
import { NovaGuide } from '../NovaGuide';
import { GAME_STAGES } from '../../data/stages';
import { STAGE_QUESTIONS } from '../../data/questions';
import { soundManager } from '../../utils/sound';

interface StageProps {
  onComplete: (scoreEarned: number, xpEarned: number) => void;
  onWrongAnswer: () => void;
  onNextStage: () => void;
}

export const Stage7_IdentityTheft: React.FC<StageProps> = ({ onComplete, onWrongAnswer, onNextStage }) => {
  const stage = GAME_STAGES[6];
  const questions = STAGE_QUESTIONS[7];

  const correctSteps = [
    "التحقق من هوية المرسل الحقيقي عبر وسيلة اتصال مباشرة موثوقة.",
    "رفض مشاركة أي معلومات شخصية أو كلمات مرور أو بيانات مالية.",
    "تفعيل آلية التحقق بخطوتين (2FA) وتغيير كلمات المرور فوراً.",
    "حظر الحساب المنتحل وتوثيق الأدلة وإبلاغ إدارة المنصة والجهات الرسمية."
  ];

  const [currentStepList, setCurrentStepList] = useState<string[]>([
    correctSteps[1],
    correctSteps[3],
    correctSteps[0],
    correctSteps[2]
  ]);
  const [orderVerified, setOrderVerified] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [stageFinished, setStageFinished] = useState(false);

  const moveStep = (index: number, direction: 'UP' | 'DOWN') => {
    soundManager.playClick();
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentStepList.length) return;

    const updated = [...currentStepList];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCurrentStepList(updated);
  };

  const handleVerifyOrder = () => {
    const isCorrect = currentStepList.every((step, idx) => step === correctSteps[idx]);
    if (isCorrect) {
      soundManager.playSuccess();
      setOrderVerified(true);
      setOrderFeedback("🎯 ترتيب تكتيكي ممتاز! هذه الخطوات الصحيحة لحماية هويتك وأموالك من الانتحال.");
    } else {
      soundManager.playError();
      onWrongAnswer();
      setOrderFeedback("⚠️ الترتيب يحتاج تدقيق: ابدأ أولاً بالتحقق من المرسل، ثم ارفض المشاركة، ثم فعل التحقق بخطوتين، ثم احظر وبلّغ!");
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
      const score = Math.round(((orderVerified ? 1 : 0) + correctAnswersCount) / 2 * 8);
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
          <div className="border-b border-slate-800 pb-3 mb-5">
            <h3 className="text-base sm:text-lg font-black text-white font-game flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <span>مهمة: حماية الهوية الرقمية ومكافحة الانتحال (Identity Defense)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              سرقة الهُوية: عندما يستخدم شخص ما معلومات شخصية لشخص آخر بدون إذن منه بهدف الحصول على المال غالباً (ص 34).
            </p>
          </div>

          {/* Interactive Step Ordering Minigame */}
          <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs sm:text-sm font-bold text-white">
                سيناريو تكتيكي: وصلتك رسالة من حساب يحمل اسم صديقك يطلب تحويلاً مالياً طارئاً وبطاقة هويتك!
              </h4>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              قم بترتيب إجراءات الحماية الآتية بالتسلسل الصحيح (1 إلى 4) باستخدام أزرار الأسهم:
            </p>

            <div className="space-y-2 mb-4">
              {currentStepList.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    orderVerified
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">{step}</span>
                  </div>

                  {!orderVerified && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveStep(idx, 'UP')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                        title="تحريك لأعلى"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === currentStepList.length - 1}
                        onClick={() => moveStep(idx, 'DOWN')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                        title="تحريك لأسفل"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!orderVerified ? (
              <div className="flex justify-end">
                <button
                  onClick={handleVerifyOrder}
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs sm:text-sm hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
                >
                  تأكيد الترتيب التكتيكي ✓
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/80 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>تم تأكيد بروتوكول الحماية بنجاح! انتقل للسؤال النظري.</span>
              </div>
            )}

            {orderFeedback && !orderVerified && (
              <div className="mt-3 p-3 bg-amber-950/50 border border-amber-800/60 rounded-xl text-xs text-amber-300">
                {orderFeedback}
              </div>
            )}
          </div>

          {/* Question on Concept */}
          {orderVerified && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-mono text-cyan-400">سؤال تقييم الهوية</span>
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
                    <span>إنهاء المهمة بنجاح 🏆</span>
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
            تم تحرير قطاع الهويات G-07 بنجاح! 👤🛡️
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-4">
            أتقنت حماية الهوية الرقمية من الاستخدام غير المصرح به للبيانات الشخصية بهدف الحصول على المال (ص 34). حصلت على +{stage.xpReward} XP!
          </p>
          <button
            onClick={onNextStage}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 inline-flex items-center gap-2"
          >
            <span>انتقل للمرحلة 8: إنقاذ الملفات من هجمات الفدية 🚀</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

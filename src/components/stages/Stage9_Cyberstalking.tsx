import React, { useState } from 'react';
import { AlertOctagon, CheckCircle, AlertTriangle, ArrowRight, Zap, ShieldAlert, PhoneCall, FileText, XCircle } from 'lucide-react';
import { NovaGuide } from '../NovaGuide';
import { GAME_STAGES } from '../../data/stages';
import { STAGE_QUESTIONS } from '../../data/questions';
import { soundManager } from '../../utils/sound';

interface StageProps {
  onComplete: (scoreEarned: number, xpEarned: number) => void;
  onWrongAnswer: () => void;
  onNextStage: () => void;
}

export const Stage9_Cyberstalking: React.FC<StageProps> = ({ onComplete, onWrongAnswer, onNextStage }) => {
  const stage = GAME_STAGES[8];
  const questions = STAGE_QUESTIONS[9];

  const [activeTab, setActiveTab] = useState<'SCENARIO' | 'QUIZ'>('SCENARIO');
  const [selectedDecisions, setSelectedDecisions] = useState<string[]>([]);
  const [scenarioValidated, setScenarioValidated] = useState(false);
  const [scenarioFeedback, setScenarioFeedback] = useState<string | null>(null);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [stageFinished, setStageFinished] = useState(false);

  const decisionOptions = [
    {
      id: "dec_pay",
      text: "الاستجابة لطلب المبتز وتحويل المبلغ المالي فوراً والسكوت.",
      isSafe: false,
      reason: "دفع الفدية يشجع المبتز على الاستمرار في الابتزاز والمطالبة بمبالغ أكبر!"
    },
    {
      id: "dec_refuse",
      text: "رفض الخضوع للتهديد وعدم تحويل أي مبالغ مالية للمبتز.",
      isSafe: true,
      reason: "قرار صحيح! قطع التواصل والرفض الصارم يمنع المبتز من تحقيق غايته."
    },
    {
      id: "dec_evidence",
      text: "الاحتفاظ بالرسائل وعدم حذف المحادثة وتوثيق لقطات الشاشة كأدلة رسمية.",
      isSafe: true,
      reason: "تصرف حكيم! توثيق الأدلة ضروري جداً لجهات التحقيق الأمنية لتتبع الجاني."
    },
    {
      id: "dec_report",
      text: "إبلاغ الوالدين فوراً والتواصل مع وحدة مكافحة الجرائم الإلكترونية الرسمية.",
      isSafe: true,
      reason: "عين العقل! الجهات المختصة تمتلك الصلاحيات والتقنيات القانونية لمحاسبة المبتز وحمايتك."
    }
  ];

  const toggleDecision = (id: string) => {
    soundManager.playClick();
    if (selectedDecisions.includes(id)) {
      setSelectedDecisions(selectedDecisions.filter(d => d !== id));
    } else {
      setSelectedDecisions([...selectedDecisions, id]);
    }
  };

  const handleValidateDecisions = () => {
    const hasPay = selectedDecisions.includes("dec_pay");
    const hasRefuse = selectedDecisions.includes("dec_refuse");
    const hasEvidence = selectedDecisions.includes("dec_evidence");
    const hasReport = selectedDecisions.includes("dec_report");

    if (!hasPay && hasRefuse && hasEvidence && hasReport) {
      soundManager.playSuccess();
      setScenarioValidated(true);
      setScenarioFeedback("🎯 ممتاز جداً! حددت حزمة القرارات التكتيكية الصحيحة 100%: رفض الدفع، حفظ الأدلة، وإبلاغ الوالدين والجهات الرسمية.");
    } else {
      soundManager.playError();
      onWrongAnswer();
      setScenarioFeedback("⚠️ انتبه! إياك ودفع أي فدية أو مسح الأدلة. يجب رفض الدفع، توثيق الرسائل، وإبلاغ الجهات المختصة فوراً!");
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
      const score = Math.round(((scenarioValidated ? 1 : 0) + correctAnswersCount) / 2 * 8);
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
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>وحدة مكافحة الابتزاز الإلكتروني (Cyberstalking Unit)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              الابتزاز الإلكتروني: التهديد بالكشف عن معلومات مهمة لأحد الأشخاص، أو إلحاق الضرر به أو بأجهزته لإجباره على دفع فدية مالية لقاء رفع الأذى (ص 34).
            </p>
          </div>

          {activeTab === 'SCENARIO' ? (
            <div>
              {/* Scenario Box */}
              <div className="bg-slate-950 rounded-xl p-4 sm:p-5 border border-slate-800 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertOctagon className="w-5 h-5 text-rose-500" />
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    موقف واقعي: وصلتك رسالة تهديد من مجهول تدعي امتلاكها لبياناتك الخاصة وتطالبك بدفع 50 ديناراً أو ستنشر معلومات وتخرب جهازك!
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  اختر كافة الإجراءات الصحيحة الواجب اتخاذها في هذا الموقف الحرج:
                </p>

                <div className="space-y-2.5 mb-5">
                  {decisionOptions.map((opt) => {
                    const isSelected = selectedDecisions.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => !scenarioValidated && toggleDecision(opt.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? opt.isSafe
                              ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-500/80 text-rose-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? opt.isSafe ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'bg-rose-500 border-rose-400 text-white'
                            : 'border-slate-700 bg-slate-950'
                        }`}>
                          {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm font-semibold">{opt.text}</div>
                          {scenarioValidated && (
                            <div className="text-[11px] text-slate-400 mt-1">{opt.reason}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!scenarioValidated ? (
                  <div className="flex justify-end">
                    <button
                      disabled={selectedDecisions.length === 0}
                      onClick={handleValidateDecisions}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs sm:text-sm hover:bg-cyan-400 transition-all disabled:opacity-40 shadow-lg shadow-cyan-500/30"
                    >
                      تأكيد القرارات التكتيكية ✓
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                    <span className="text-xs text-emerald-400 font-bold">
                      {scenarioFeedback}
                    </span>
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setActiveTab('QUIZ');
                      }}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs hover:scale-105 transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap"
                    >
                      الانتقال لأسئلة المفهوم 🚀
                    </button>
                  </div>
                )}

                {scenarioFeedback && !scenarioValidated && (
                  <div className="mt-3 p-3 bg-amber-950/60 border border-amber-800/60 rounded-xl text-xs text-amber-200">
                    {scenarioFeedback}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Quiz */
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-mono text-cyan-400">سؤال {currentQIndex + 1} من {questions.length}</span>
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
            تم تحرير قطاع مكافحة الابتزاز I-09 بنجاح! 🛡️
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-4">
            أتقنت التعامل التكتيكي مع جريمة الابتزاز الإلكتروني ورفض دفع الفدية وتوثيق الأدلة والإبلاغ الفوري (ص 34). حصلت على +{stage.xpReward} XP!
          </p>
          <button
            onClick={onNextStage}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 inline-flex items-center gap-2"
          >
            <span>انتقل للمرحلة 10: بناء الدرع السيبراني الرقمي 🚀</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

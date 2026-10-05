import React, { useState } from 'react';
import { Database, ShieldCheck, AlertOctagon, CheckCircle, AlertTriangle, ArrowRight, Zap, Check } from 'lucide-react';
import { NovaGuide } from '../NovaGuide';
import { GAME_STAGES } from '../../data/stages';
import { soundManager } from '../../utils/sound';

interface StageProps {
  onComplete: (scoreEarned: number, xpEarned: number) => void;
  onWrongAnswer: () => void;
  onNextStage: () => void;
}

interface ScenarioItem {
  id: string;
  title: string;
  description: string;
  isDanger: boolean;
  explanation: string;
}

export const Stage5_DataManipulation: React.FC<StageProps> = ({ onComplete, onWrongAnswer, onNextStage }) => {
  const stage = GAME_STAGES[4];

  const scenarios: ScenarioItem[] = [
    {
      id: "sc_1",
      title: "الموقف الأول: تعديل كشوف العلامات",
      description: "قام مستخدم بالدخول إلى قاعدة بيانات المدرسة وتعديل علامة طالب راسب إلى ناجح دون علم أو تفويض من الإدارة والمعلم.",
      isDanger: true,
      explanation: "خطر جسيم! هذا يمثل جريمة 'التلاعب بالبيانات' وهي تغيير المعلومات بصورة غير قانونية (ص 34)."
    },
    {
      id: "sc_2",
      title: "الموقف الثاني: رصد الغياب النظامي",
      description: "قام معلم الصف بتسجيل غياب الطلاب اليومي في السجل الإلكتروني الرسمي مستخدماً حسابه المعتمد وفق تعليمات وزارة التربية.",
      isDanger: false,
      explanation: "ليس خطراً! هذا إجراء قانوني رسمي مأذون به يقع ضمن الصلاحيات الممنوحة للمعلم."
    },
    {
      id: "sc_3",
      title: "الموقف الثالث: حذف سجلات المرضى في المستشفى",
      description: "قام مجهول باختراق نظام المستشفى وحذف سجلات المرضى وتاريخهم العلاجي لتغطية خطأ طبي أو تعطيل الخدمة.",
      isDanger: true,
      explanation: "خطر فادح! هذا يمثل جريمة 'التلاعب بالبيانات' بحذف المعلومات بصورة غير قانونية، مما يهدد حياة المرضى (ص 34)."
    },
    {
      id: "sc_4",
      title: "الموقف الرابع: النسخ الاحتياطي الدوري المشفر",
      description: "قام مسؤول قواعد البيانات بحفظ نسخة احتياطية من سجلات المدرسة على وسيط تخزين خارجي آمن لحمايتها في حال الطوارئ.",
      isDanger: false,
      explanation: "ليس خطراً! هذا من أهم وسائل الوقاية المعتمدة في الكتاب (ص 37: نسخ البيانات الاحتياطي Data backup)."
    }
  ];

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [stageFinished, setStageFinished] = useState(false);

  const currentScenario = scenarios[currentScenarioIndex];

  const handleDecision = (choiceIsDanger: boolean) => {
    if (showFeedback) return;
    setUserChoice(choiceIsDanger);
    setShowFeedback(true);

    const isCorrect = choiceIsDanger === currentScenario.isDanger;
    if (isCorrect) {
      soundManager.playSuccess();
      setCorrectCount(prev => prev + 1);
    } else {
      soundManager.playError();
      onWrongAnswer();
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setUserChoice(null);
      setShowFeedback(false);
    } else {
      const score = Math.round((correctCount / scenarios.length) * 8);
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
          <div className="border-b border-slate-800 pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-game flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <span>تحدي: هل البيانات آمنة؟ (كشف التلاعب بالبيانات)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                التلاعب بالبيانات (Data Manipulation): تغيير المعلومات أو حذفها بصورة غير قانونية (كتاب الطالب ص 34).
              </p>
            </div>
            <div className="text-xs text-cyan-400 font-mono">
              سيناريو {currentScenarioIndex + 1} من {scenarios.length}
            </div>
          </div>

          {/* Scenario Card */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 mb-6">
            <h4 className="text-sm sm:text-base font-bold text-white mb-2 font-game">
              {currentScenario.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {currentScenario.description}
            </p>

            {/* Decision Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                disabled={showFeedback}
                onClick={() => handleDecision(true)}
                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  showFeedback && currentScenario.isDanger
                    ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-lg'
                    : showFeedback && userChoice === true && !currentScenario.isDanger
                    ? 'bg-rose-950/60 border-rose-600 opacity-60'
                    : 'bg-slate-900 hover:bg-rose-950/40 border-slate-700 hover:border-rose-500 text-white'
                }`}
              >
                <AlertOctagon className="w-6 h-6 text-rose-400" />
                <span className="text-sm font-black">⚠️ هذا الموقف يمثل (خطر / تلاعب غير قانوني)</span>
              </button>

              <button
                disabled={showFeedback}
                onClick={() => handleDecision(false)}
                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  showFeedback && !currentScenario.isDanger
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg'
                    : showFeedback && userChoice === false && currentScenario.isDanger
                    ? 'bg-slate-900 border-slate-800 opacity-60'
                    : 'bg-slate-900 hover:bg-emerald-950/40 border-slate-700 hover:border-emerald-500 text-white'
                }`}
              >
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-sm font-black">🛡️ هذا الموقف (ليس خطراً / مأذون ونظامي)</span>
              </button>
            </div>
          </div>

          {/* Feedback & Explanation */}
          {showFeedback && (
            <div className={`p-4 rounded-xl border mb-5 animate-in fade-in duration-200 ${
              userChoice === currentScenario.isDanger
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                : 'bg-amber-950/70 border-amber-500 text-amber-200'
            }`}>
              <div className="flex items-start gap-3">
                {userChoice === currentScenario.isDanger ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h5 className="text-xs font-bold mb-1">
                    {userChoice === currentScenario.isDanger
                      ? "🎯 ممتاز! تقييمك للسيناريو صحيح تماماً."
                      : "⚠️ انتبه! التقييم لم يكن دقيقاً."}
                  </h5>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {currentScenario.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showFeedback && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs sm:text-sm hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/30"
              >
                <span>{currentScenarioIndex < scenarios.length - 1 ? 'السيناريو التالي 🎯' : 'إنهاء المهمة بنجاح 🏆'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-emerald-500/60 rounded-2xl p-6 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-black text-white font-game mb-2">
            تم فحص وتأمين سلامة السجلات E-05 بنجاح! 🗄️
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-4">
            أتقنت مفهوم التلاعب بالبيانات (تغيير المعلومات أو حذفها بصورة غير قانونية - ص 34) وحميت السجلات من العبث. حصلت على +{stage.xpReward} XP!
          </p>
          <button
            onClick={onNextStage}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 inline-flex items-center gap-2"
          >
            <span>انتقل للمرحلة 6: محاكي صندوق البريد وكشف التصيد 🚀</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

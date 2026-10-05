import React, { useState } from 'react';
import { Radar, Shield, CheckCircle, XCircle, AlertTriangle, ArrowRight, Zap, Target } from 'lucide-react';
import { NovaGuide } from '../NovaGuide';
import { GAME_STAGES } from '../../data/stages';
import { STAGE_QUESTIONS, QuestionItem } from '../../data/questions';
import { soundManager } from '../../utils/sound';

interface StageProps {
  onComplete: (scoreEarned: number, xpEarned: number) => void;
  onWrongAnswer: () => void;
  onNextStage: () => void;
}

export const Stage1_Concept: React.FC<StageProps> = ({ onComplete, onWrongAnswer, onNextStage }) => {
  const stage = GAME_STAGES[0];
  const questions = STAGE_QUESTIONS[1];

  const [activeTab, setActiveTab] = useState<'RADAR_SCAN' | 'QUIZ'>('RADAR_SCAN');
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [stageFinished, setStageFinished] = useState(false);

  // Radar Targets to inspect
  const radarTargets = [
    {
      id: "target_concept",
      title: "بصمة المفهوم: الجريمة الإلكترونية",
      text: "أي فعل يُرتكب باستخدام وسيلة أو نظام أو شبكة إلكترونية بصورة غير قانونية تُخالف أحكام القانون.",
      type: "CONCEPT"
    },
    {
      id: "target_elements",
      title: "أوجه الشبه (العناصر الثلاثة)",
      text: "تتشابه الجريمة الإلكترونية مع الجريمة التقليدية في: (الجاني، الضحية، وفعل الجريمة).",
      type: "SIMILARITY"
    },
    {
      id: "target_difference",
      title: "أوجه الاختلاف (البيئة والمكان)",
      text: "تختلف عن الجريمة التقليدية: لا يُشترط وجود مُرتكبها في مكان الحدث، وتعتمد على التقنيات وشبكات المعلومات الحديثة.",
      type: "DIFFERENCE"
    }
  ];

  const handleScanTarget = (id: string) => {
    if (!scannedItems.includes(id)) {
      soundManager.playLaser();
      setScannedItems([...scannedItems, id]);
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
      // Finished stage
      const score = Math.round((correctAnswersCount / questions.length) * 8); // ~8 points for stage
      onComplete(score, stage.xpReward);
      setStageFinished(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      <NovaGuide dialogue={stage.novaText} bookReference={stage.conceptBookReference} />

      {!stageFinished ? (
        <div className="bg-slate-900/90 border border-cyan-800/60 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
          {/* Stage Top Navigation Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('RADAR_SCAN');
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${
                activeTab === 'RADAR_SCAN'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Radar className="w-4 h-4" />
              <span>1. مسح الرادار واكتشاف البصمات ({scannedItems.length}/3)</span>
            </button>

            <button
              disabled={scannedItems.length < 3}
              onClick={() => {
                soundManager.playClick();
                setActiveTab('QUIZ');
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${
                activeTab === 'QUIZ'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : scannedItems.length < 3
                  ? 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed'
                  : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>2. اختبار الاعتراض التكتيكي</span>
            </button>
          </div>

          {activeTab === 'RADAR_SCAN' ? (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-white font-game mb-1">
                  رادار كشف البصمات الرقمية (Perimeter Radar Scanner)
                </h3>
                <p className="text-xs text-slate-300">
                  انقر على الإشارات السيبرانية الثلاث على الشاشة لفك تشفيرها وتحليلها كما وردت في صفحة 33 من كتابك!
                </p>
              </div>

              {/* Radar Simulation Area */}
              <div className="relative w-full max-w-md mx-auto aspect-square rounded-full border-2 border-cyan-500/40 bg-slate-950/80 p-4 flex items-center justify-center overflow-hidden mb-6 shadow-2xl shadow-cyan-950/80">
                {/* Radar Grid Circles */}
                <div className="absolute inset-4 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-16 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-28 rounded-full border border-cyan-500/20" />
                <div className="absolute w-full h-px bg-cyan-500/20" />
                <div className="absolute h-full w-px bg-cyan-500/20" />

                {/* Radar Sweep Line */}
                <div className="absolute inset-0 cyber-radar-sweep pointer-events-none">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/30 to-transparent origin-bottom-right" />
                </div>

                {/* Target 1: Concept */}
                <button
                  onClick={() => handleScanTarget("target_concept")}
                  className={`absolute top-1/4 right-1/4 -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border flex items-center gap-1.5 transition-all group ${
                    scannedItems.includes("target_concept")
                      ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300'
                      : 'bg-rose-950/80 border-rose-500 text-rose-300 animate-bounce'
                  }`}
                >
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold whitespace-nowrap">مفهوم الجريمة</span>
                </button>

                {/* Target 2: Similarity */}
                <button
                  onClick={() => handleScanTarget("target_elements")}
                  className={`absolute bottom-1/4 right-1/3 -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border flex items-center gap-1.5 transition-all group ${
                    scannedItems.includes("target_elements")
                      ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300'
                      : 'bg-amber-950/80 border-amber-500 text-amber-300 animate-bounce'
                  }`}
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold whitespace-nowrap">العناصر المشتركة</span>
                </button>

                {/* Target 3: Difference */}
                <button
                  onClick={() => handleScanTarget("target_difference")}
                  className={`absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border flex items-center gap-1.5 transition-all group ${
                    scannedItems.includes("target_difference")
                      ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300'
                      : 'bg-emerald-950/80 border-emerald-500 text-emerald-300 animate-bounce'
                  }`}
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold whitespace-nowrap">أوجه الاختلاف</span>
                </button>
              </div>

              {/* Scanned Details Accordion */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {radarTargets.map((target) => {
                  const isScanned = scannedItems.includes(target.id);
                  return (
                    <div
                      key={target.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isScanned
                          ? 'bg-slate-950 border-cyan-500/50 shadow-md'
                          : 'bg-slate-950/40 border-slate-800 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {isScanned ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <h4 className="text-xs font-bold text-white truncate">{target.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {isScanned ? target.text : "انقر على الرادار لفك تشفير هذه البيانات..."}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Call to Action when scanned */}
              {scannedItems.length === 3 ? (
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab('QUIZ');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-lg shadow-cyan-500/30 inline-flex items-center gap-2"
                  >
                    <span>اكتمل المسح! ابدأ اختبار الاعتراض التكتيكي 🚀</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-center text-xs text-cyan-400 animate-pulse">
                  اضغط على الإشارات الثلاث الظاهرة على شاشة الرادار للمتابعة
                </p>
              )}
            </div>
          ) : (
            /* Quiz Challenge Area */
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-mono text-cyan-400">سؤال {currentQIndex + 1} من {questions.length}</span>
                <span>المصدر: كتاب المهارات الرقمية ص 33</span>
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
                      style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50 font-bold';
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

              {/* Feedback Alert */}
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
        /* Victory Card */
        <div className="bg-slate-900 border border-emerald-500/60 rounded-2xl p-6 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-black text-white font-game mb-2">
            تم تطهير القطاع A-01 بنجاح! 🛡️
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-4">
            أتقنت مفهوم الجريمة الإلكترونية وعناصرها والفرق بينها وبين التقليدية وفق صفحة 33 من كتابك. حصلت على +{stage.xpReward} XP!
          </p>
          <button
            onClick={onNextStage}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 inline-flex items-center gap-2"
          >
            <span>انتقل للمرحلة 2: شيفرة التشريعات 🚀</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

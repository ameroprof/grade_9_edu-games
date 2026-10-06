import React, { useState } from 'react';
import { Heart, CheckCircle2, AlertTriangle, X, ArrowRight, Zap, Shield } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface RecoveryStationModalProps {
  onClose: () => void;
  onRestoreHearts: () => void;
}

export const RecoveryStationModal: React.FC<RecoveryStationModalProps> = ({
  onClose,
  onRestoreHearts
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const question = {
    prompt: "ما هو العنصر الذي تتشابه فيه الجريمة الإلكترونية مع الجريمة التقليدية وفق ما ورد في صفحة 33 من كتاب الطالب؟",
    options: [
      "تتشابه في العناصر الثلاثة: (الجاني، والضحية، وفعل الجريمة).",
      "تتشابه في ضرورة تواجد مرتكب الجريمة في مكان وقوع الحدث مادياً.",
      "تتشابه في عدم استخدام التقنيات وشبكات المعلومات الحديثة."
    ],
    correct: 0,
    explanation: "أحسنت! تتشابه الجريمة الإلكترونية مع التقليدية في (الجاني، الضحية، وفعل الجريمة)، ولكنها تختلف في البيئة والمكان (ص 33)."
  };

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    if (idx === question.correct) {
      soundManager.playSuccess();
      setIsSuccess(true);
      onRestoreHearts();
    } else {
      soundManager.playError();
      setIsSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl w-full max-w-xl shadow-2xl p-5 sm:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 left-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-950 border border-rose-600 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-rose-900/40">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <h3 className="text-lg font-black text-white font-game">
            محطة شحن طاقة القلوب (Health Recovery)
          </h3>
          <p className="text-xs text-slate-300">
            أجب عن سؤال السلامة السريع لاستعادة قلوبك الثلاثة كاملة (❤️❤️❤️)!
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
          <h4 className="text-xs sm:text-sm font-bold text-white mb-3 leading-relaxed">
            {question.prompt}
          </h4>

          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleSelect(i)}
                className={`w-full text-right p-3 rounded-lg border text-xs transition-all ${
                  isAnswered
                    ? i === question.correct
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold'
                      : i === selectedIdx
                      ? 'bg-rose-950 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50'
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-cyan-500'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {isAnswered && (
          <div className={`p-3 rounded-xl border mb-4 text-xs ${
            isSuccess
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
              : 'bg-amber-950/80 border-amber-500 text-amber-200'
          }`}>
            {isSuccess
              ? "🎯 ممتاز! تم شحن طاقة القلوب بالكامل (❤️❤️❤️) بنجاح!"
              : "⚠️ إجابة غير دقيقة! يمكنك إعادة المحاولة عند زيارة المحطة لاحقاً."}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all"
          >
            العودة للمدينة 🏙️
          </button>
        </div>
      </div>
    </div>
  );
};

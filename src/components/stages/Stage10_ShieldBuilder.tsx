import React, { useState } from 'react';
import { Shield, ShieldCheck, AlertTriangle, ArrowRight, Zap, CheckCircle2, Lock, Flame, RefreshCw, Key, BookOpen, HardDrive } from 'lucide-react';
import { NovaGuide } from '../NovaGuide';
import { GAME_STAGES } from '../../data/stages';
import { PREVENTION_METHODS } from '../../data/lessons';
import { soundManager } from '../../utils/sound';

interface StageProps {
  onComplete: (scoreEarned: number, xpEarned: number) => void;
  onWrongAnswer: () => void;
  onNextStage: () => void;
}

interface DefenseItem {
  id: string;
  title: string;
  detail: string;
  isValid: boolean;
  iconName: string;
}

export const Stage10_ShieldBuilder: React.FC<StageProps> = ({ onComplete, onWrongAnswer, onNextStage }) => {
  const stage = GAME_STAGES[9];

  const candidateItems: DefenseItem[] = [
    {
      id: "antivirus_firewall",
      title: "مكافح الفيروسات (Anti-Virus) والجدار الناري (Firewall)",
      detail: "تثبيتهما وتحديثهما بانتظام لضمان الحماية من البرامج الضارة والتهديدات الجديدة (ص 37).",
      isValid: true,
      iconName: "Shield"
    },
    {
      id: "system_updates",
      title: "تحديث النظام والبرمجيات المُثبتة",
      detail: "المواظبة على تحديث أنظمة التشغيل لمعالجة الثغرات الأمنية المكتشفة التي تُصدر الشركات تحديثات أمان لها (ص 37).",
      isValid: true,
      iconName: "RefreshCw"
    },
    {
      id: "strong_passwords",
      title: "كلمات مرور مُحكمة وفريدة + مدير كلمات المرور",
      detail: "اختيار كلمات مرور معقدة وفريدة لكل حساب وتجنب السهلة، واستخدام Password Manager في تخزينها وإدارتها (ص 37).",
      isValid: true,
      iconName: "Key"
    },
    {
      id: "awareness_training",
      title: "التعليم والتوعية والتدريب",
      detail: "زيادة الوعي بالأساليب الشائعة للهجمات مثل التصيد والاحتيال وتدريب الموظفين والمستخدمين على تجنبها (ص 37).",
      isValid: true,
      iconName: "BookOpen"
    },
    {
      id: "encryption",
      title: "التشفير (Encryption) وبروتوكولات SSL / TLS",
      detail: "حماية البيانات المهمة عند تخزينها ونقلها عبر الشبكات، وتأمين الاتصالات عبر بروتوكولات SSL/TLS (ص 37).",
      isValid: true,
      iconName: "Lock"
    },
    {
      id: "two_factor_auth",
      title: "آلية التحقق بخطوتين (Two-Factor Authentication)",
      detail: "إضافة طبقة أخرى من الأمان تحتم إجراء خطوة إضافية لتأكيد الهوية عند تسجيل الدخول (ص 37).",
      isValid: true,
      iconName: "CheckCircle2"
    },
    {
      id: "data_backup",
      title: "نسخ البيانات الاحتياطي (Data Backup)",
      detail: "المواظبة على النسخ الاحتياطي في وسائط خارجية أو سحابية موثوقة لاستعادة البيانات عند الأزمات (ص 37).",
      isValid: true,
      iconName: "HardDrive"
    },
    // Distractors (False elements)
    {
      id: "disable_firewall",
      title: "تعطيل الجدار الناري لحرية الاتصال",
      detail: "إيقاف برامج الحماية والجدران النارية لتسريع التحميل وتجنب إشعارات التنبيه.",
      isValid: false,
      iconName: "Flame"
    },
    {
      id: "easy_passwords",
      title: "استخدام كلمة مرور سهلة وموحدة",
      detail: "اعتماد كلمة مرور بسيطة مثل تاريخ الميلاد لجميع الحسابات لتفادي نسيانها.",
      isValid: false,
      iconName: "Key"
    }
  ];

  const [slottedIds, setSlottedIds] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [stageFinished, setStageFinished] = useState(false);

  const totalValidItemsCount = candidateItems.filter(item => item.isValid).length; // 7
  const currentValidSlottedCount = slottedIds.filter(id => candidateItems.find(c => c.id === id)?.isValid).length;
  const shieldPercentage = Math.round((currentValidSlottedCount / totalValidItemsCount) * 100);

  const handleToggleItem = (item: DefenseItem) => {
    if (slottedIds.includes(item.id)) return;

    if (item.isValid) {
      soundManager.playShieldUp();
      const updated = [...slottedIds, item.id];
      setSlottedIds(updated);
      setFeedbackMsg(`⚡ ممتاز! تم تثبيت [${item.title}] وارتفعت طاقة الدرع إلى ${Math.round((updated.filter(id => candidateItems.find(c => c.id === id)?.isValid).length / totalValidItemsCount) * 100)}%!`);

      if (updated.filter(id => candidateItems.find(c => c.id === id)?.isValid).length === totalValidItemsCount) {
        soundManager.playBadgeUnlock();
      }
    } else {
      soundManager.playError();
      onWrongAnswer();
      setFeedbackMsg(`⚠️ خطر أمني! [${item.title}] ليس من وسائل الوقاية الصحيحة في الكتاب، بل يهدد أمان جهازك وبياناتك!`);
    }
  };

  const handleFinishShield = () => {
    soundManager.playSuccess();
    onComplete(8, stage.xpReward);
    setStageFinished(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6">
      <NovaGuide dialogue={stage.novaText} bookReference={stage.conceptBookReference} />

      {!stageFinished ? (
        <div className="bg-slate-900/90 border border-cyan-800/60 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
          {/* Header */}
          <div className="border-b border-slate-800 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-xl font-black text-white font-game flex items-center gap-2">
                <Shield className="w-6 h-6 text-cyan-400" />
                <span>لعبة: ابنِ درعك الرقمي المتكامل (Shield Generator)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                اجمع عناصر الوقاية السبعة المعتمدة في كتابك (صفحة 37) لتوليد درع الحماية السيبراني بنسبة 100%!
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-cyan-800">
              <span className="text-xs text-slate-400">طاقة الدرع:</span>
              <span className="text-base font-black font-mono text-cyan-300">
                {shieldPercentage}%
              </span>
            </div>
          </div>

          {/* Shield Core Hologram Visualizer */}
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-cyan-900/60 mb-6 text-center relative overflow-hidden shadow-inner">
            {/* Holographic Shield Ring */}
            <div className={`relative w-36 h-36 mx-auto rounded-full flex items-center justify-center transition-all duration-700 ${
              shieldPercentage === 100
                ? 'bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 border-4 border-cyan-400 shadow-2xl shadow-cyan-400/50 scale-105'
                : shieldPercentage > 50
                ? 'bg-cyan-950/40 border-2 border-cyan-500/60 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/40 border border-slate-800'
            }`}>
              <Shield className={`w-16 h-16 transition-all duration-500 ${
                shieldPercentage === 100
                  ? 'text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse'
                  : shieldPercentage > 50
                  ? 'text-cyan-400'
                  : 'text-slate-600'
              }`} />
              <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-slate-950 text-xs font-mono font-bold text-cyan-300 border border-cyan-700">
                {shieldPercentage}%
              </div>
            </div>

            <div className="mt-4 max-w-md mx-auto">
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${shieldPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>الطبقات المركبة: {currentValidSlottedCount} من {totalValidItemsCount}</span>
                <span>الحالة: {shieldPercentage === 100 ? 'درع خارق نشط' : 'قيد البناء'}</span>
              </div>
            </div>
          </div>

          {feedbackMsg && (
            <div className="p-3 bg-slate-950 border border-cyan-700/60 rounded-xl text-xs text-cyan-200 mb-5 animate-in fade-in">
              {feedbackMsg}
            </div>
          )}

          {/* Defense Modules Selector */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <span>اختر وثبّت وسائل الوقاية المعتمدة فقط في الكتاب (ص 37):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {candidateItems.map((item) => {
                const isSlotted = slottedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItem(item)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSlotted
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-black text-white">{item.title}</span>
                        {isSlotted && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-900/80 text-cyan-300 border border-cyan-700">
                            مُثبّت ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                        {item.detail}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                      <button
                        disabled={isSlotted}
                        className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                          isSlotted
                            ? 'bg-slate-800 text-slate-500 cursor-default'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black'
                        }`}
                      >
                        {isSlotted ? "تم الدمج في الدرع" : "تثبيت في الدرع 🛡️"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completion CTA */}
          {shieldPercentage === 100 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleFinishShield}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-xl shadow-emerald-500/30 flex items-center gap-2"
              >
                <span>الدرع بكامل طاقته 100%! إنهاء بناء الدرع 🏆</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-emerald-500/60 rounded-2xl p-6 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-black text-white font-game mb-2">
            تم تشغيل درع الحماية السيبراني بنسبة 100%! 🛡️⚡
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-4">
            أتقنت دمج وسائل الوقاية السبع المذكورة في الكتاب (مكافح الفيروسات والجدار الناري، التحديث، كلمات المرور ومديرها، التوعية، التشفير SSL/TLS، التحقق بخطوتين 2FA، والنسخ الاحتياطي). حصلت على +{stage.xpReward} XP!
          </p>
          <button
            onClick={onNextStage}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 inline-flex items-center gap-2"
          >
            <span>انتقل للمرحلة 11: منارة المواطنة الرقمية 🚀</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

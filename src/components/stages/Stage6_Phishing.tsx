import React, { useState } from 'react';
import { Mail, MailWarning, ShieldCheck, CheckCircle, AlertTriangle, ArrowRight, Zap, ExternalLink, AlertOctagon, Info } from 'lucide-react';
import { NovaGuide } from '../NovaGuide';
import { GAME_STAGES } from '../../data/stages';
import { INBOX_SIMULATION_EMAILS, PhishingEmail } from '../../data/questions';
import { soundManager } from '../../utils/sound';

interface StageProps {
  onComplete: (scoreEarned: number, xpEarned: number) => void;
  onWrongAnswer: () => void;
  onNextStage: () => void;
}

export const Stage6_Phishing: React.FC<StageProps> = ({ onComplete, onWrongAnswer, onNextStage }) => {
  const stage = GAME_STAGES[5];
  const emails = INBOX_SIMULATION_EMAILS;

  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0].id);
  const [analyzedEmails, setAnalyzedEmails] = useState<Record<string, { choiceIsPhishing: boolean; isCorrect: boolean }>>({});
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [stageFinished, setStageFinished] = useState(false);

  const selectedEmail = emails.find(e => e.id === selectedEmailId) || emails[0];
  const currentAnalysis = analyzedEmails[selectedEmail.id];

  const handleClassify = (markedAsPhishing: boolean) => {
    const isCorrect = markedAsPhishing === selectedEmail.isPhishing;

    if (isCorrect) {
      soundManager.playSuccess();
      setActiveFeedback(`🎯 قرار تكتيكي صحيح! ${selectedEmail.explanation}`);
    } else {
      soundManager.playError();
      onWrongAnswer();
      setActiveFeedback(`⚠️ انتبه! هذا التقييم خاطئ. ${selectedEmail.explanation}`);
    }

    setAnalyzedEmails(prev => ({
      ...prev,
      [selectedEmail.id]: {
        choiceIsPhishing: markedAsPhishing,
        isCorrect
      }
    }));
  };

  const allCompleted = emails.every(e => analyzedEmails[e.id] !== undefined);
  const correctCount = Object.values(analyzedEmails).filter(a => a.isCorrect).length;

  const handleFinish = () => {
    soundManager.playClick();
    const score = Math.round((correctCount / emails.length) * 8);
    onComplete(score, stage.xpReward);
    setStageFinished(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6">
      <NovaGuide dialogue={stage.novaText} bookReference={stage.conceptBookReference} />

      {!stageFinished ? (
        <div className="bg-slate-900/90 border border-cyan-800/60 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
          {/* Header */}
          <div className="border-b border-slate-800 pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-game flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>محاكي صندوق البريد: اكتشف رسائل التصيد والاحتيال (Phishing Simulator)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                التصيد والاحتيال: خداع الأفراد للاستيلاء على معلومات مهمة بإرسال رسائل مضللة أو دعائية للبريد الإلكتروني (ص 34).
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400">
              تم تصنيف: {Object.keys(analyzedEmails).length} / {emails.length}
            </div>
          </div>

          {/* Interactive Email Client Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden mb-5">
            {/* Left Column: Email List (Inbox) */}
            <div className="md:col-span-5 border-b md:border-b-0 md:border-l border-slate-800 bg-slate-950/60 p-2 space-y-1.5">
              <div className="p-2 text-xs font-bold text-slate-400 border-b border-slate-900 flex items-center justify-between">
                <span>صندوق الوارد (Inbox)</span>
                <span className="text-[10px] text-cyan-400 font-mono">3 رسائل جديدة</span>
              </div>

              {emails.map((email) => {
                const analysis = analyzedEmails[email.id];
                const isSelected = selectedEmailId === email.id;

                return (
                  <button
                    key={email.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedEmailId(email.id);
                      setActiveFeedback(null);
                    }}
                    className={`w-full text-right p-3 rounded-xl border transition-all text-xs flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-md'
                        : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="font-bold text-white truncate">{email.senderName}</span>
                      {analysis && (
                        analysis.isCorrect ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )
                      )}
                    </div>
                    <div className="text-slate-300 font-semibold truncate">{email.subject}</div>
                    <div className="text-[11px] text-slate-500 truncate">{email.preview}</div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Email Detail Reading Pane */}
            <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between">
              <div>
                {/* Email Meta Header */}
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h4 className="text-sm sm:text-base font-bold text-white mb-2 leading-relaxed">
                    {selectedEmail.subject}
                  </h4>
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">المرسل:</span>
                      <span className="text-cyan-300 font-bold">{selectedEmail.senderName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">عنوان البريد:</span>
                      <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded text-amber-300 border border-slate-800">
                        {selectedEmail.senderAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed mb-4">
                  {selectedEmail.body}
                </div>

                {/* Red Flags Revealed if Analyzed */}
                {currentAnalysis && selectedEmail.redFlags.length > 0 && (
                  <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 mb-4">
                    <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-1.5">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>علامات الخطر والتصيد المكتشفة في الرسالة:</span>
                    </h5>
                    <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-1">
                      {selectedEmail.redFlags.map((flag, idx) => (
                        <li key={idx} className="leading-relaxed">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons for this Email */}
              <div className="pt-3 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-300 mb-2">
                  ما هو حكمك على هذه الرسالة؟
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    disabled={currentAnalysis !== undefined}
                    onClick={() => handleClassify(true)}
                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      currentAnalysis?.choiceIsPhishing === true
                        ? 'bg-rose-900/60 text-rose-200 border border-rose-500'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/30'
                    }`}
                  >
                    <MailWarning className="w-4 h-4" />
                    <span>⚠️ رسالة تصيد مضللة (Phishing & Scam)</span>
                  </button>

                  <button
                    disabled={currentAnalysis !== undefined}
                    onClick={() => handleClassify(false)}
                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      currentAnalysis?.choiceIsPhishing === false
                        ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-900/30'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>🛡️ رسالة آمنة ورسمية</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Area */}
          {activeFeedback && (
            <div className="p-3.5 bg-slate-950 border border-cyan-700/60 rounded-xl text-xs text-cyan-200 mb-4 animate-in fade-in">
              {activeFeedback}
            </div>
          )}

          {/* Complete Stage Action */}
          {allCompleted && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs sm:text-sm hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/30"
              >
                <span>إنهاء مهمة محاكي البريد بنجاح 🏆</span>
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
            تم تطهير محطة البريد F-06 من التصيد! 📨🛡️
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-4">
            أثبتت وعياً عالياً بكشف الرسائل المضللة والدعائية الاحتيالية التي تهدف للاستيلاء على المعلومات المهمة (ص 34). حصلت على +{stage.xpReward} XP!
          </p>
          <button
            onClick={onNextStage}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 inline-flex items-center gap-2"
          >
            <span>انتقل للمرحلة 7: حماية الهوية الرقمية 🚀</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

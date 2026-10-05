import React, { useState } from 'react';
import { Bot, Lightbulb, ChevronDown, ChevronUp, Sparkles, AlertCircle } from 'lucide-react';
import { NovaDialogue } from '../types/game';
import { soundManager } from '../utils/sound';

interface NovaGuideProps {
  dialogue: NovaDialogue;
  bookReference?: string;
}

export const NovaGuide: React.FC<NovaGuideProps> = ({ dialogue, bookReference }) => {
  const [showHint, setShowHint] = useState(false);

  const toggleHint = () => {
    soundManager.playClick();
    setShowHint(!showHint);
  };

  return (
    <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-blue-950/80 border border-cyan-800/60 rounded-xl p-3 sm:p-4 shadow-lg shadow-cyan-950/30 mb-4 sm:mb-6">
      <div className="flex items-start gap-3">
        {/* Nova Hologram Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-md shadow-cyan-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
              {/* Scanline light sweep */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-bounce opacity-40 pointer-events-none" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border border-slate-950"></span>
          </span>
        </div>

        {/* Speech Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-cyan-300 font-game">
                نوفا — Nova (المرشد السيبراني)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                مساعد تكتيكي
              </span>
            </div>
            {bookReference && (
              <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                📖 {bookReference}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {dialogue.intro}
          </p>

          {/* Motivational callout */}
          {dialogue.encouragement && (
            <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{dialogue.encouragement}</span>
            </div>
          )}

          {/* Hint Dropdown */}
          {dialogue.hint && (
            <div className="mt-2.5 pt-2 border-t border-cyan-900/40">
              <button
                onClick={toggleHint}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 focus:outline-none transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'إخفاء التلميح التكتيكي' : 'تلميح من نوفا 💡'}</span>
                {showHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showHint && (
                <div className="mt-2 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200 flex items-start gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{dialogue.hint}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { User, Bot, ArrowLeft, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';
import { WorldEntity } from '../../types/game';
import { soundManager } from '../../utils/sound';

interface NpcDialogueModalProps {
  entity: WorldEntity;
  onClose: () => void;
  onLaunchMission?: (stageId: number) => void;
}

export const NpcDialogueModal: React.FC<NpcDialogueModalProps> = ({
  entity,
  onClose,
  onLaunchMission
}) => {
  const dialogueLines = entity.dialogue || ["مرحباً بك يا حارس الأمن السيبراني!"];
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const handleNext = () => {
    soundManager.playClick();
    if (currentLineIndex < dialogueLines.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
    } else {
      if (entity.stageId && onLaunchMission) {
        onLaunchMission(entity.stageId);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-slate-900 border-2 border-cyan-500 rounded-2xl w-full max-w-2xl shadow-2xl p-4 sm:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 left-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          {/* NPC Avatar */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 p-0.5 shadow-lg shadow-cyan-500/30 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
              {entity.name.includes('🤖') ? '🤖' :
               entity.name.includes('👨‍💻') ? '👨‍💻' :
               entity.name.includes('👩‍🔬') ? '👩‍🔬' :
               entity.name.includes('👨‍💼') ? '👨‍💼' :
               entity.name.includes('👩‍🏫') ? '👩‍🏫' :
               entity.name.includes('🧑‍🎓') ? '🧑‍🎓' : '👤'}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-sm sm:text-base font-extrabold text-cyan-300 font-game">
                {entity.name}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                حوار مباشر
              </span>
            </div>

            {/* Current Speech Line */}
            <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed min-h-[70px] flex items-center">
              <p>{dialogueLines[currentLineIndex]}</p>
            </div>

            {/* Pagination & Next Button */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs font-mono text-slate-500">
                {currentLineIndex + 1} / {dialogueLines.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
                >
                  <span>
                    {currentLineIndex < dialogueLines.length - 1
                      ? 'التالي ⬅️'
                      : entity.stageId
                      ? 'بدء المهمة التكتيكية 🚀'
                      : 'إغلاق الحوار ✓'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

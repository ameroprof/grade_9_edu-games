import React from 'react';
import { Backpack, X, Shield, RefreshCw, Key, BookOpen, Lock, CheckCircle2, HardDrive, Info } from 'lucide-react';
import { InventoryItem } from '../../types/game';
import { soundManager } from '../../utils/sound';

interface InventoryModalProps {
  items: InventoryItem[];
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ items, onClose }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-6 h-6 text-cyan-400" />;
      case 'RefreshCw': return <RefreshCw className="w-6 h-6 text-emerald-400" />;
      case 'Key': return <Key className="w-6 h-6 text-amber-400" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-blue-400" />;
      case 'Lock': return <Lock className="w-6 h-6 text-purple-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6 text-teal-400" />;
      case 'HardDrive': return <HardDrive className="w-6 h-6 text-yellow-400" />;
      default: return <Shield className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-700 flex items-center justify-center">
              <Backpack className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-game">
                حقيبة أدوات الحماية والدرع الرقمي (Player Inventory)
              </h3>
              <p className="text-xs text-slate-400">
                وسائل الوقاية السبع المعتمدة من كتاب المهارات الرقمية (الصفحة 37)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Items */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-3.5 transition-all flex items-start gap-3 shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                  {getIcon(item.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
                      {item.bookPage}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-950 p-3 border-t border-slate-800 text-center text-xs text-cyan-400 font-medium">
          🛡️ هذه الأدوات تشكل معاً ركائز درع الحماية السيبراني الذي ستبنيه لحماية المدينة!
        </div>
      </div>
    </div>
  );
};

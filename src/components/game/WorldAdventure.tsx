import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  MapPin, 
  Backpack, 
  Crosshair, 
  Navigation, 
  Heart, 
  Zap, 
  Award, 
  Volume2, 
  VolumeX, 
  UserCheck, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Radio,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { PlayerStats, StudentInfo, GameView, WorldEntity, DistrictInfo } from '../../types/game';
import { CITY_DISTRICTS, WORLD_ENTITIES, RANDOM_ALERTS, LEVEL_TITLES } from '../../data/world';
import { GAME_STAGES } from '../../data/stages';
import { soundManager } from '../../utils/sound';
import { InventoryModal } from './InventoryModal';
import { NpcDialogueModal } from './NpcDialogueModal';
import { RecoveryStationModal } from './RecoveryStationModal';

interface WorldAdventureProps {
  student: StudentInfo;
  stats: PlayerStats;
  onLaunchStage: (stageId: number) => void;
  onOpenReport: () => void;
  onOpenTeacherMode: () => void;
  onOpenMap: () => void;
  onRestoreHearts: () => void;
}

export const WorldAdventure: React.FC<WorldAdventureProps> = ({
  student,
  stats,
  onLaunchStage,
  onOpenReport,
  onOpenTeacherMode,
  onOpenMap,
  onRestoreHearts
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player World Coordinates (start at Security HQ)
  const [playerPos, setPlayerPos] = useState({ x: 500, y: 520 });
  const [playerDirection, setPlayerDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('DOWN');
  const [isMoving, setIsMoving] = useState(false);

  // UI Modals
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [activeNpcEntity, setActiveNpcEntity] = useState<WorldEntity | null>(null);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [nearbyEntity, setNearbyEntity] = useState<WorldEntity | null>(null);

  // Random Alert Toast
  const [currentAlert, setCurrentAlert] = useState<string | null>(RANDOM_ALERTS[0].text);

  // Determine current active quest / target stage
  const nextStageId = GAME_STAGES.find(s => !stats.completedStages.includes(s.id))?.id || 12;
  const currentStageConfig = GAME_STAGES.find(s => s.id === nextStageId) || GAME_STAGES[0];
  const targetDistrict = CITY_DISTRICTS.find(d => d.stageId === nextStageId) || CITY_DISTRICTS[0];

  // Random Alerts interval
  useEffect(() => {
    const alertInterval = setInterval(() => {
      const random = RANDOM_ALERTS[Math.floor(Math.random() * RANDOM_ALERTS.length)];
      setCurrentAlert(random.text);
      soundManager.playClick();
      setTimeout(() => setCurrentAlert(null), 8000);
    }, 35000);
    return () => clearInterval(alertInterval);
  }, []);

  // Keyboard Movement Handlers
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on arrow keys or space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      keysPressed.current[e.key.toLowerCase()] = true;
      keysPressed.current[e.key] = true;

      // Handle interaction key 'e' or space
      if (e.key.toLowerCase() === 'e' || e.key === ' ' || e.key === 'Enter') {
        if (nearbyEntity) {
          triggerInteraction(nearbyEntity);
        }
      }

      // Handle inventory key 'i' or 'b'
      if (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'b') {
        soundManager.playClick();
        setIsInventoryOpen(prev => !prev);
      }

      // Handle map key 'm'
      if (e.key.toLowerCase() === 'm') {
        soundManager.playClick();
        onOpenMap();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyEntity]);

  // Movement Game Loop (60 FPS)
  useEffect(() => {
    let animId: number;
    const speed = 4;

    const loop = () => {
      let dx = 0;
      let dy = 0;
      let newDir = playerDirection;

      if (keysPressed.current['arrowup'] || keysPressed.current['w']) {
        dy -= speed;
        newDir = 'UP';
      }
      if (keysPressed.current['arrowdown'] || keysPressed.current['s']) {
        dy += speed;
        newDir = 'DOWN';
      }
      if (keysPressed.current['arrowleft'] || keysPressed.current['a']) {
        dx -= speed;
        newDir = 'LEFT';
      }
      if (keysPressed.current['arrowright'] || keysPressed.current['d']) {
        dx += speed;
        newDir = 'RIGHT';
      }

      if (dx !== 0 || dy !== 0) {
        setIsMoving(true);
        setPlayerDirection(newDir);
        setPlayerPos(prev => {
          const nextX = Math.max(40, Math.min(960, prev.x + dx));
          const nextY = Math.max(40, Math.min(1100, prev.y + dy));
          return { x: nextX, y: nextY };
        });
      } else {
        setIsMoving(false);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [playerDirection]);

  // Check Nearby Entity Proximity
  useEffect(() => {
    let closest: WorldEntity | null = null;
    let minDistance = 60; // Interaction radius

    for (const ent of WORLD_ENTITIES) {
      const dist = Math.hypot(ent.x - playerPos.x, ent.y - playerPos.y);
      if (dist < minDistance) {
        closest = ent;
        minDistance = dist;
      }
    }

    setNearbyEntity(closest);
  }, [playerPos]);

  // Handle Interaction with Entity
  const triggerInteraction = (ent: WorldEntity) => {
    soundManager.playClick();

    if (ent.id === 'station_recharge') {
      setIsRecoveryOpen(true);
      return;
    }

    if (ent.type === 'NPC') {
      setActiveNpcEntity(ent);
      return;
    }

    if (ent.stageId) {
      // Check if unlocked
      const isUnlocked = ent.stageId === 1 || stats.completedStages.includes(ent.stageId - 1);
      if (isUnlocked) {
        onLaunchStage(ent.stageId);
      } else {
        soundManager.playError();
        alert(`🔒 هذا القطاع مقفل حالياً! أنجز المهمة #${ent.stageId - 1} أولاً لفتحه.`);
      }
    }
  };

  // Render Canvas World
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Viewport Size
    const width = canvas.width;
    const height = canvas.height;

    // Camera follow player smoothly
    const cameraX = Math.max(0, Math.min(1000 - width, playerPos.x - width / 2));
    const cameraY = Math.max(0, Math.min(1150 - height, playerPos.y - height / 2));

    ctx.save();
    ctx.translate(-cameraX, -cameraY);

    // 1. Draw World Background & Cyber Grid
    ctx.fillStyle = '#030712'; // deep slate
    ctx.fillRect(cameraX, cameraY, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    const startX = Math.floor(cameraX / gridSize) * gridSize;
    const startY = Math.floor(cameraY / gridSize) * gridSize;
    for (let x = startX; x <= cameraX + width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, cameraY);
      ctx.lineTo(x, cameraY + height);
      ctx.stroke();
    }
    for (let y = startY; y <= cameraY + height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(cameraX, y);
      ctx.lineTo(cameraX + width, y);
      ctx.stroke();
    }

    // 2. Draw Network Highways connecting districts
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    // Horizontal highway
    ctx.moveTo(220, 210);
    ctx.lineTo(780, 210);
    // Vertical highways
    ctx.moveTo(500, 210);
    ctx.lineTo(500, 1000);
    ctx.moveTo(220, 210);
    ctx.lineTo(220, 1000);
    ctx.moveTo(780, 210);
    ctx.lineTo(780, 1000);
    // Cross highways
    ctx.moveTo(220, 480);
    ctx.lineTo(780, 480);
    ctx.moveTo(220, 740);
    ctx.lineTo(780, 740);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Draw Districts & Buildings
    CITY_DISTRICTS.forEach((dist) => {
      const isCompleted = stats.completedStages.includes(dist.stageId);
      const isCurrent = dist.stageId === nextStageId;
      const isLocked = dist.stageId > 1 && !stats.completedStages.includes(dist.stageId - 1);

      // Building Base
      ctx.fillStyle = isCompleted
        ? 'rgba(6, 78, 59, 0.7)' // Emerald
        : isCurrent
        ? 'rgba(12, 74, 110, 0.8)' // Cyan
        : isLocked
        ? 'rgba(15, 23, 42, 0.7)' // Slate
        : 'rgba(30, 41, 59, 0.8)';
      ctx.strokeStyle = isCompleted
        ? '#10b981'
        : isCurrent
        ? '#06b6d4'
        : isLocked
        ? '#334155'
        : '#64748b';
      ctx.lineWidth = isCurrent ? 3 : 2;

      // Rounded rect
      ctx.beginPath();
      ctx.roundRect(dist.x, dist.y, dist.width, dist.height, 14);
      ctx.fill();
      ctx.stroke();

      // Glowing border for current quest district
      if (isCurrent) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(dist.x - 3, dist.y - 3, dist.width + 6, dist.height + 6, 16);
        ctx.stroke();
      }

      // Building Header Banner
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(dist.x + 8, dist.y + 8, dist.width - 16, 28);
      ctx.font = 'bold 12px "Cairo", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(dist.arabicTitle, dist.x + dist.width / 2, dist.y + 26);

      // District Status Tag
      ctx.font = '10px "Cairo", sans-serif';
      if (isCompleted) {
        ctx.fillStyle = '#34d399';
        ctx.fillText('✅ قطاع آمن ومُطهّر', dist.x + dist.width / 2, dist.y + 50);
      } else if (isCurrent) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('⚡ المهمة الحالية المطلوبة', dist.x + dist.width / 2, dist.y + 50);
      } else if (isLocked) {
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('🔒 قطاع مقفل', dist.x + dist.width / 2, dist.y + 50);
      } else {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('متاح للاستكشاف', dist.x + dist.width / 2, dist.y + 50);
      }
    });

    // 4. Draw Interactive Entities (NPCs, Terminals, Recharge)
    WORLD_ENTITIES.forEach((ent) => {
      // Glowing interaction ring
      const isTarget = ent.stageId === nextStageId;
      ctx.beginPath();
      ctx.arc(ent.x, ent.y, ent.width / 2 + 6, 0, Math.PI * 2);
      ctx.fillStyle = isTarget ? 'rgba(6, 182, 212, 0.3)' : 'rgba(148, 163, 184, 0.1)';
      ctx.fill();

      // Entity Body
      ctx.beginPath();
      ctx.arc(ent.x, ent.y, ent.width / 2, 0, Math.PI * 2);
      ctx.fillStyle = ent.type === 'NPC' 
        ? '#0284c7' 
        : ent.id === 'station_recharge' 
        ? '#e11d48' 
        : isTarget 
        ? '#06b6d4' 
        : '#475569';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Entity Icon / Emoji
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const icon = ent.type === 'NPC' 
        ? (ent.name.includes('🤖') ? '🤖' : ent.name.includes('👨‍💻') ? '👨‍💻' : '👤') 
        : ent.id === 'station_recharge' 
        ? '❤️' 
        : '💻';
      ctx.fillText(icon, ent.x, ent.y);

      // Entity Label
      ctx.font = 'bold 10px "Cairo", sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(ent.name.split('—')[0], ent.x, ent.y + ent.width / 2 + 12);
    });

    // 5. Draw Player Character 🛡️
    // Pulse aura
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, 22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.fill();

    // Body circle
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Player Direction Indicator
    ctx.fillStyle = '#38bdf8';
    let dirX = playerPos.x;
    let dirY = playerPos.y;
    if (playerDirection === 'UP') dirY -= 18;
    if (playerDirection === 'DOWN') dirY += 18;
    if (playerDirection === 'LEFT') dirX -= 18;
    if (playerDirection === 'RIGHT') dirX += 18;
    ctx.beginPath();
    ctx.arc(dirX, dirY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Player Crest
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🛡️', playerPos.x, playerPos.y);

    // Player Name Tag
    ctx.font = 'bold 11px "Cairo", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(student.name, playerPos.x, playerPos.y - 24);

    ctx.restore();
  }, [playerPos, playerDirection, nextStageId, stats.completedStages, student.name]);

  // Compass angle towards current quest objective
  const compassAngle = Math.atan2(
    (targetDistrict.y + targetDistrict.height / 2) - playerPos.y,
    (targetDistrict.x + targetDistrict.width / 2) - playerPos.x
  ) * (180 / Math.PI);

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-slate-950 overflow-hidden flex flex-col select-none">
      {/* Top Floating Quest Tracker & Alerts */}
      <div className="absolute top-3 left-3 right-3 z-30 pointer-events-none flex flex-col gap-2">
        {/* Main Quest Banner */}
        <div className="max-w-2xl mx-auto w-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/60 rounded-2xl p-3 shadow-xl flex items-center justify-between gap-3 pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-400 shrink-0">
              <Crosshair className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-900/80 text-cyan-300">
                  المهمة الحالية #{nextStageId}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  الوجهة: {targetDistrict.arabicTitle}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-white font-game truncate">
                {currentStageConfig.title}
              </h3>
            </div>
          </div>

          {/* Compass Direction Arrow */}
          <div className="flex items-center gap-2 shrink-0">
            <div 
              className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-700 flex items-center justify-center text-cyan-400 shadow-md"
              title="بوصلة الاتجاه نحو الهدف"
            >
              <Navigation 
                className="w-4 h-4 transition-transform duration-300"
                style={{ transform: `rotate(${compassAngle + 90}deg)` }}
              />
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onLaunchStage(nextStageId);
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              دخول مباشر 🚀
            </button>
          </div>
        </div>

        {/* Dynamic Alert Banner */}
        {currentAlert && (
          <div className="max-w-md mx-auto bg-slate-900/90 border border-amber-500/60 text-amber-200 text-xs px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in duration-300">
            <Radio className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span className="truncate">{currentAlert}</span>
          </div>
        )}
      </div>

      {/* Main 2D Canvas Viewport */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={window.innerWidth || 1000}
          height={(window.innerHeight ? window.innerHeight - 65 : 700)}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Proximity Interaction Prompt (Center Bottom) */}
        {nearbyEntity && (
          <div className="absolute bottom-28 sm:bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => triggerInteraction(nearbyEntity)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-slate-950 font-black text-sm sm:text-base hover:scale-105 transition-all shadow-2xl shadow-cyan-500/50 flex items-center gap-2 border-2 border-white animate-pulse"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>اضغط [E] أو انقر هنا: {nearbyEntity.actionPrompt}</span>
            </button>
          </div>
        )}
      </div>

      {/* HUD Quick Bar & Floating Mobile Controls */}
      <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            setIsInventoryOpen(true);
          }}
          className="p-3 rounded-2xl bg-slate-900/90 border border-cyan-600/80 text-cyan-300 hover:text-white hover:bg-slate-800 shadow-xl flex items-center gap-2 text-xs font-bold transition-all"
          title="حقيبة الأدوات والوقاية"
        >
          <Backpack className="w-5 h-5 text-amber-400" />
          <span className="hidden sm:inline">حقيبة الوقاية ({stats.inventory.length}/7)</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onOpenMap();
          }}
          className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 shadow-xl flex items-center gap-2 text-xs font-bold transition-all"
          title="الخريطة التكتيكية"
        >
          <MapPin className="w-5 h-5 text-cyan-400" />
          <span className="hidden sm:inline">خريطة القطاعات</span>
        </button>
      </div>

      {/* Virtual D-Pad for Mobile & Touch Devices */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col items-center gap-1 sm:hidden bg-slate-950/60 p-2 rounded-2xl border border-slate-800 backdrop-blur-md">
        <button
          onPointerDown={() => { keysPressed.current['w'] = true; }}
          onPointerUp={() => { keysPressed.current['w'] = false; }}
          onPointerLeave={() => { keysPressed.current['w'] = false; }}
          className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-800 text-cyan-300 flex items-center justify-center active:bg-cyan-500 active:text-slate-950"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1">
          <button
            onPointerDown={() => { keysPressed.current['a'] = true; }}
            onPointerUp={() => { keysPressed.current['a'] = false; }}
            onPointerLeave={() => { keysPressed.current['a'] = false; }}
            className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-800 text-cyan-300 flex items-center justify-center active:bg-cyan-500 active:text-slate-950"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onPointerDown={() => { keysPressed.current['s'] = true; }}
            onPointerUp={() => { keysPressed.current['s'] = false; }}
            onPointerLeave={() => { keysPressed.current['s'] = false; }}
            className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-800 text-cyan-300 flex items-center justify-center active:bg-cyan-500 active:text-slate-950"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            onPointerDown={() => { keysPressed.current['d'] = true; }}
            onPointerUp={() => { keysPressed.current['d'] = false; }}
            onPointerLeave={() => { keysPressed.current['d'] = false; }}
            className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-800 text-cyan-300 flex items-center justify-center active:bg-cyan-500 active:text-slate-950"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {isInventoryOpen && (
        <InventoryModal
          items={stats.inventory}
          onClose={() => setIsInventoryOpen(false)}
        />
      )}

      {activeNpcEntity && (
        <NpcDialogueModal
          entity={activeNpcEntity}
          onClose={() => setActiveNpcEntity(null)}
          onLaunchMission={(stageId) => onLaunchStage(stageId)}
        />
      )}

      {isRecoveryOpen && (
        <RecoveryStationModal
          onClose={() => setIsRecoveryOpen(false)}
          onRestoreHearts={() => {
            onRestoreHearts();
            setIsRecoveryOpen(false);
          }}
        />
      )}
    </div>
  );
};

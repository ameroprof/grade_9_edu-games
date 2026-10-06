export type GameView = 
  | 'START' 
  | 'WORLD_ADVENTURE'
  | 'TACTICAL_MAP' 
  | 'STAGE'
  | 'REPORT' 
  | 'CERTIFICATE' 
  | 'TEACHER_DASHBOARD';

export interface StudentInfo {
  name: string;
  section: string;
  timestamp: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  bookPage: string;
  count: number;
}

export interface PlayerStats {
  score: number; // Final calculated out of 100
  xp: number;
  level: number;
  levelTitle: string;
  hearts: number; // 3 hearts max
  correctAnswers: number;
  wrongAnswers: number;
  threatsNeutralized: number;
  completedStages: number[];
  unlockedBadges: string[];
  inventory: InventoryItem[];
  startTime: number;
  endTime?: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredStage?: number;
  color: string;
}

export interface NovaDialogue {
  intro: string;
  hint?: string;
  encouragement?: string;
}

export type ChallengeType = 
  | 'RADAR_DETECT' 
  | 'LAW_DECRYPT' 
  | 'HACK_DEFENSE' 
  | 'MALWARE_LAB' 
  | 'DATA_INTEGRITY' 
  | 'INBOX_PHISHING' 
  | 'IDENTITY_DEFENSE' 
  | 'RANSOMWARE_CRISIS' 
  | 'EXTORTION_UNIT' 
  | 'SHIELD_BUILDER' 
  | 'CITIZEN_DECISION' 
  | 'BOSS_BATTLE';

export interface StageConfig {
  id: number;
  title: string;
  subtitle: string;
  districtId?: DistrictId;
  sectorName: string;
  conceptBookReference: string;
  novaText: NovaDialogue;
  xpReward: number;
  shieldItemReward?: string;
  challengeType: ChallengeType;
}

export type DistrictId = 
  | 'SECURITY_HQ'      // مركز الأمن والقيادة
  | 'LAW_COURT'        // مجمع التشريعات والقوانين
  | 'SERVER_TOWER'     // أبراج الخوادم والشبكة الرئيسية
  | 'MALWARE_LAB'      // مختبر مكافحة البرمجيات الخبيثة
  | 'DATA_CENTER'      // مركز البيانات
  | 'COMMS_HUB'        // مركز الاتصالات وصندوق البريد
  | 'CYBER_BANK'       // بنك الأمان وحماية الهوية
  | 'RANSOM_BUNKER'    // مخزن النسخ الاحتياطي وحماية الفدية
  | 'SCHOOL_ACADEMY'   // مدرسة المدينة الرقمية
  | 'SHIELD_CORE'      // مفاعل الدرع الرقمي
  | 'CITIZEN_PLAZA'    // ساحة المواطنة الرقمية
  | 'BOSS_CITADEL';    // قلعة الهجوم السيبراني النهائي

export interface DistrictInfo {
  id: DistrictId;
  name: string;
  arabicTitle: string;
  description: string;
  stageId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  icon: string;
}

export interface WorldEntity {
  id: string;
  name: string;
  type: 'NPC' | 'TERMINAL' | 'SERVER' | 'DOOR' | 'CHEST' | 'HAZARD';
  x: number;
  y: number;
  width: number;
  height: number;
  districtId: DistrictId;
  stageId?: number;
  dialogue?: string[];
  actionPrompt: string;
  isCompleted?: boolean;
}

export interface TeacherRecord {
  id: string;
  studentName: string;
  section: string;
  score: number;
  xp: number;
  level: number;
  threatsNeutralized: number;
  correctAnswers: number;
  wrongAnswers: number;
  completedStagesCount: number;
  durationSeconds: number;
  dateString: string;
}

export type GameView = 
  | 'START' 
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

export interface PlayerStats {
  score: number; // Final calculated out of 100
  xp: number;
  level: number;
  hearts: number; // 3 hearts max
  correctAnswers: number;
  wrongAnswers: number;
  completedStages: number[];
  unlockedBadges: string[];
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
  sectorName: string;
  conceptBookReference: string;
  novaText: NovaDialogue;
  xpReward: number;
  challengeType: ChallengeType;
}

export interface TeacherRecord {
  id: string;
  studentName: string;
  section: string;
  score: number;
  xp: number;
  correctAnswers: number;
  wrongAnswers: number;
  completedStagesCount: number;
  durationSeconds: number;
  dateString: string;
}

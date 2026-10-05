/**
 * محارب الأمن السيبراني — حارس الفضاء الرقمي
 * لعبة تعليمية تفاعلية لمبحث المهارات الرقمية للصف التاسع الأساسي
 * درس: الجريمة الإلكترونية (الصفحات 32–41 فقط)
 * تصميم وإعداد الأستاذ: عامر كراجه
 */

import React, { useState, useEffect } from 'react';
import { GameView, StudentInfo, PlayerStats, TeacherRecord } from './types/game';
import { Navbar } from './components/Navbar';
import { StartScreen } from './components/StartScreen';
import { TacticalMap } from './components/TacticalMap';
import { StudentReport } from './components/StudentReport';
import { Certificate } from './components/Certificate';
import { TeacherMode } from './components/TeacherMode';

// Stage Components
import { Stage1_Concept } from './components/stages/Stage1_Concept';
import { Stage2_Law } from './components/stages/Stage2_Law';
import { Stage3_Hacking } from './components/stages/Stage3_Hacking';
import { Stage4_Malware } from './components/stages/Stage4_Malware';
import { Stage5_DataManipulation } from './components/stages/Stage5_DataManipulation';
import { Stage6_Phishing } from './components/stages/Stage6_Phishing';
import { Stage7_IdentityTheft } from './components/stages/Stage7_IdentityTheft';
import { Stage8_Ransomware } from './components/stages/Stage8_Ransomware';
import { Stage9_Cyberstalking } from './components/stages/Stage9_Cyberstalking';
import { Stage10_ShieldBuilder } from './components/stages/Stage10_ShieldBuilder';
import { Stage11_DigitalCitizen } from './components/stages/Stage11_DigitalCitizen';
import { Stage12_CyberBoss } from './components/stages/Stage12_CyberBoss';

import { BADGES_LIST } from './data/lessons';
import { soundManager } from './utils/sound';

export default function App() {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [view, setView] = useState<GameView>('START');
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [isTeacherModeOpen, setIsTeacherModeOpen] = useState(false);

  const [stats, setStats] = useState<PlayerStats>({
    score: 0,
    xp: 0,
    level: 1,
    hearts: 3,
    correctAnswers: 0,
    wrongAnswers: 0,
    completedStages: [],
    unlockedBadges: [],
    startTime: Date.now()
  });

  // Calculate Level based on XP
  useEffect(() => {
    const computedLevel = Math.max(1, Math.floor(stats.xp / 120) + 1);
    if (computedLevel !== stats.level) {
      setStats(prev => ({ ...prev, level: computedLevel }));
    }
  }, [stats.xp, stats.level]);

  // Save/Update Teacher Record in LocalStorage
  const saveStudentRecord = (currentStats: PlayerStats) => {
    if (!student) return;
    try {
      const stored = localStorage.getItem('cyber_guardian_records');
      let records: TeacherRecord[] = stored ? JSON.parse(stored) : [];

      const recordIndex = records.findIndex(r => r.studentName === student.name && r.section === student.section);
      const newRecord: TeacherRecord = {
        id: `${student.name}_${student.section}_${student.timestamp}`,
        studentName: student.name,
        section: student.section,
        score: currentStats.score,
        xp: currentStats.xp,
        correctAnswers: currentStats.correctAnswers,
        wrongAnswers: currentStats.wrongAnswers,
        completedStagesCount: currentStats.completedStages.length,
        durationSeconds: Math.round(((currentStats.endTime || Date.now()) - currentStats.startTime) / 1000),
        dateString: new Date().toLocaleDateString('ar-JO')
      };

      if (recordIndex >= 0) {
        records[recordIndex] = newRecord;
      } else {
        records.push(newRecord);
      }

      localStorage.setItem('cyber_guardian_records', JSON.stringify(records));
    } catch {
      // silent fallback
    }
  };

  const handleStartGame = (info: StudentInfo) => {
    setStudent(info);
    setStats({
      score: 0,
      xp: 0,
      level: 1,
      hearts: 3,
      correctAnswers: 0,
      wrongAnswers: 0,
      completedStages: [],
      unlockedBadges: [],
      startTime: Date.now()
    });
    setView('TACTICAL_MAP');
  };

  const handleWrongAnswer = () => {
    setStats(prev => {
      const nextHearts = prev.hearts > 1 ? prev.hearts - 1 : 3; // Refill on zero so student is never stuck
      return {
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
        hearts: nextHearts
      };
    });
  };

  const handleCompleteStage = (scoreEarned: number, xpEarned: number) => {
    setStats(prev => {
      const isNewCompletion = !prev.completedStages.includes(currentStageId);
      const updatedStages = isNewCompletion ? [...prev.completedStages, currentStageId] : prev.completedStages;
      
      // Calculate score out of 100 dynamically
      const newScore = Math.min(100, Math.round((updatedStages.length / 12) * 100));
      const newXp = prev.xp + xpEarned;

      // Unlock badges
      const newBadges = [...prev.unlockedBadges];
      if (currentStageId === 1 && !newBadges.includes("badge_first_drop")) {
        newBadges.push("badge_first_drop");
      }
      if (currentStageId === 2 && !newBadges.includes("badge_law_guardian")) {
        newBadges.push("badge_law_guardian");
      }
      if (currentStageId === 3 && !newBadges.includes("badge_firewall_master")) {
        newBadges.push("badge_firewall_master");
      }
      if (currentStageId === 4 && !newBadges.includes("badge_antivirus_ace")) {
        newBadges.push("badge_antivirus_ace");
      }
      if (currentStageId === 6 && !newBadges.includes("badge_phishing_hunter")) {
        newBadges.push("badge_phishing_hunter");
      }
      if (currentStageId === 8 && !newBadges.includes("badge_ransom_buster")) {
        newBadges.push("badge_ransom_buster");
      }
      if (currentStageId === 10 && !newBadges.includes("badge_shield_architect")) {
        newBadges.push("badge_shield_architect");
      }
      if (currentStageId === 12 && !newBadges.includes("badge_cyber_champion")) {
        newBadges.push("badge_cyber_champion");
      }

      const updatedStats: PlayerStats = {
        ...prev,
        score: newScore,
        xp: newXp,
        correctAnswers: prev.correctAnswers + 1,
        completedStages: updatedStages,
        unlockedBadges: newBadges,
        endTime: updatedStages.length === 12 ? Date.now() : prev.endTime
      };

      saveStudentRecord(updatedStats);
      return updatedStats;
    });
  };

  const handleNextStage = () => {
    soundManager.playClick();
    if (currentStageId < 12) {
      setCurrentStageId(prev => prev + 1);
      setView('STAGE');
    } else {
      setView('REPORT');
    }
  };

  const handleSelectStageFromMap = (stageId: number) => {
    setCurrentStageId(stageId);
    setView('STAGE');
  };

  const handleRestart = () => {
    soundManager.playClick();
    if (student) {
      setStats({
        score: 0,
        xp: 0,
        level: 1,
        hearts: 3,
        correctAnswers: 0,
        wrongAnswers: 0,
        completedStages: [],
        unlockedBadges: [],
        startTime: Date.now()
      });
      setCurrentStageId(1);
      setView('TACTICAL_MAP');
    } else {
      setView('START');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation HUD - visible except on start screen */}
      {view !== 'START' && student && (
        <Navbar
          student={student}
          stats={stats}
          currentView={view}
          currentStageId={currentStageId}
          onNavigate={(targetView) => setView(targetView)}
          onOpenTeacherMode={() => setIsTeacherModeOpen(true)}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col justify-center">
        {view === 'START' && (
          <StartScreen
            onStartGame={handleStartGame}
            onOpenTeacherMode={() => setIsTeacherModeOpen(true)}
          />
        )}

        {view === 'TACTICAL_MAP' && (
          <TacticalMap
            stats={stats}
            onSelectStage={handleSelectStageFromMap}
            onOpenReport={() => setView('REPORT')}
          />
        )}

        {view === 'STAGE' && (
          <div className="w-full">
            {currentStageId === 1 && (
              <Stage1_Concept
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onNextStage={handleNextStage}
              />
            )}
            {currentStageId === 2 && (
              <Stage2_Law
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onNextStage={handleNextStage}
              />
            )}
            {currentStageId === 3 && (
              <Stage3_Hacking
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onNextStage={handleNextStage}
              />
            )}
            {currentStageId === 4 && (
              <Stage4_Malware
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onNextStage={handleNextStage}
              />
            )}
            {currentStageId === 5 && (
              <Stage5_DataManipulation
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onNextStage={handleNextStage}
              />
            )}
            {currentStageId === 6 && (
              <Stage6_Phishing
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onNextStage={handleNextStage}
              />
            )}
            {currentStageId === 7 && (
              <Stage7_IdentityTheft
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onNextStage={handleNextStage}
              />
            )}
            {currentStageId === 8 && (
              <Stage8_Ransomware
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onNextStage={handleNextStage}
              />
            )}
            {currentStageId === 9 && (
              <Stage9_Cyberstalking
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onNextStage={handleNextStage}
              />
            )}
            {currentStageId === 10 && (
              <Stage10_ShieldBuilder
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onNextStage={handleNextStage}
              />
            )}
            {currentStageId === 11 && (
              <Stage11_DigitalCitizen
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onNextStage={handleNextStage}
              />
            )}
            {currentStageId === 12 && (
              <Stage12_CyberBoss
                onComplete={handleCompleteStage}
                onWrongAnswer={handleWrongAnswer}
                onOpenReport={() => setView('REPORT')}
              />
            )}
          </div>
        )}

        {view === 'REPORT' && student && (
          <StudentReport
            student={student}
            stats={stats}
            onOpenCertificate={() => setView('CERTIFICATE')}
            onRestart={handleRestart}
            onBackToMap={() => setView('TACTICAL_MAP')}
          />
        )}

        {view === 'CERTIFICATE' && student && (
          <Certificate
            student={student}
            stats={stats}
            onBack={() => setView('REPORT')}
          />
        )}
      </main>

      {/* Teacher Mode Overlay Modal */}
      {isTeacherModeOpen && (
        <TeacherMode onClose={() => setIsTeacherModeOpen(false)} />
      )}
    </div>
  );
}

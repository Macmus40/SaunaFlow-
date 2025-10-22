
import React, { useState, useEffect, useMemo } from 'react';
import type { Protocol, SessionLog, TimerStatus, TimerStyle } from '../types';
import { StageType } from '../types';
import { MusicPlayer } from './MusicPlayer';
import { TimerCircle, TimerBar, TimerDigital, TimerHourglass } from './Timers';
import { STAGE_CONTENT, STAGE_COLORS } from '../constants';
import { InformationCircleIcon, PlayIcon, PauseIcon, StopIcon, SwitchIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface SessionScreenProps {
  protocol: Protocol;
  onSessionComplete: (log: SessionLog) => void;
  onExit: () => void;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({ protocol, onSessionComplete, onExit }) => {
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(protocol.stages[0].duration);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('initial');
  const [timerStyle, setTimerStyle] = useState<TimerStyle>('circle');
  const [isTipVisible, setIsTipVisible] = useState(false);
  const { t } = useLanguage();

  const currentStage = protocol.stages[currentStageIndex];
  const colors = STAGE_COLORS[currentStage.type];
  
  const { microcopy, tip } = useMemo(() => {
    const content = STAGE_CONTENT[currentStage.type];
    const microcopyKey = content.microcopy[Math.floor(Math.random() * content.microcopy.length)];
    const tipKey = content.tips[Math.floor(Math.random() * content.tips.length)];
    return { microcopy: t(microcopyKey), tip: t(tipKey) };
  }, [currentStage.type, currentCycle, currentStageIndex, t]);

  useEffect(() => {
    if (timerStatus !== 'running') return;

    if (timeLeft <= 0) {
      setTimerStatus('completed');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
      setTotalSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerStatus]);

  const handlePlayPause = () => {
    if (timerStatus === 'running') {
      setTimerStatus('paused');
    } else {
      setTimerStatus('running');
    }
  };

  const handleEndStage = () => {
    setTimerStatus('completed');
  };

  const handleExit = () => {
    onExit();
  }

  const handleNextStep = () => {
    const isLastStageInCycle = currentStageIndex === protocol.stages.length - 1;
    const isLastCycle = currentCycle === protocol.cycles;

    if (isLastStageInCycle && isLastCycle) {
      onSessionComplete({
        protocolName: t(protocol.name),
        totalTime: totalSessionTime,
        cyclesCompleted: protocol.cycles,
        date: new Date().toISOString(),
        goal: protocol.goal,
      });
      return;
    }

    let nextStageIndex = currentStageIndex + 1;
    let nextCycle = currentCycle;

    if (nextStageIndex >= protocol.stages.length) {
      nextStageIndex = 0;
      nextCycle++;
    }

    setCurrentStageIndex(nextStageIndex);
    setCurrentCycle(nextCycle);
    setTimeLeft(protocol.stages[nextStageIndex].duration);
    setTimerStatus('initial');
    setIsTipVisible(false);
  };
  
  const handleSwitchStyle = () => {
    const styles: TimerStyle[] = ['circle', 'bar', 'digital', 'hourglass'];
    const currentIndex = styles.indexOf(timerStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setTimerStyle(styles[nextIndex]);
  };

  const progress = (currentStage.duration - timeLeft) / currentStage.duration;

  const renderTimer = () => {
      const props = { progress, timeLeft, colors: { ...colors, text: colors.text}, stageType: currentStage.type };
      switch(timerStyle) {
          case 'bar': return <TimerBar {...props} />;
          case 'digital': return <TimerDigital {...props} />;
          case 'hourglass': return <TimerHourglass {...props} />;
          case 'circle':
          default:
            return <TimerCircle {...props} />;
      }
  }
  
  const renderControls = () => {
      if (timerStatus === 'completed') {
        return (
             <button
              onClick={handleNextStep}
              className="bg-slate-800 dark:bg-slate-100 text-slate-100 dark:text-slate-900 font-bold py-4 px-12 rounded-full text-lg animate-pulse"
            >
              {t('next_step')}
            </button>
        )
      }

      return (
        <div className="flex items-center justify-around w-full max-w-md">
            <button
                onClick={handleEndStage}
                className="flex flex-col items-center justify-center w-24 h-24 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors disabled:opacity-50"
                aria-label={t('end_stage_label')}
                disabled={timerStatus === 'initial'}
            >
                <StopIcon className="w-12 h-12"/>
                <span className="text-lg font-semibold mt-1">{t('end_stage')}</span>
            </button>
            <button
                onClick={handlePlayPause}
                className="w-28 h-28 bg-white/90 dark:bg-white/90 text-slate-900 rounded-full flex items-center justify-center text-3xl shadow-lg hover:bg-white transition-transform transform hover:scale-105"
                aria-label={timerStatus === 'running' ? t('pause_label') : t('play_label')}
            >
                {timerStatus === 'running' ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12" />}
            </button>
            <div className="w-24 h-24" aria-hidden="true" />
        </div>
      )
  }

  return (
    <div className={`flex flex-col min-h-screen ${colors.bg} ${colors.text} transition-colors duration-1000 p-6`}>
      <header className="grid grid-cols-3 items-center text-lg text-slate-700 dark:text-slate-300">
        <div className="text-left">
            <button onClick={handleExit} className="bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 px-5 rounded-full border border-slate-300 dark:border-slate-700 transition-colors">
                {t('exit')}
            </button>
        </div>
        <div className="text-center">
            <div className="font-bold tracking-widest">{t(`stage_${currentStage.type}`)}</div>
            <div className="text-sm">{t('cycle')} {currentCycle} / {protocol.cycles}</div>
        </div>
        <div className="text-right">
            <button onClick={handleSwitchStyle} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors inline-block p-3 -m-3 rounded-full" aria-label={t('switch_timer_style_label')}>
                <SwitchIcon className="w-7 h-7"/>
            </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        {isTipVisible && (
            <div className="absolute inset-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center p-8" onClick={() => setIsTipVisible(false)}>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl max-w-md text-center">
                    <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">{t('tip_title')}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{tip}</p>
                    <button onClick={() => setIsTipVisible(false)} className="mt-6 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold py-2 px-6 rounded-full">
                        {t('close')}
                    </button>
                </div>
            </div>
        )}
        
        {renderTimer()}
        
        <div className="flex items-center space-x-2 mt-8 h-12 text-slate-500 dark:text-slate-400 text-xl">
            <span>{timerStatus === 'completed' ? t('stage_complete') : microcopy}</span>
            <button onClick={() => setIsTipVisible(true)} className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors rounded-full p-3 -m-3" aria-label={t('show_tip_label')}>
                <InformationCircleIcon className="w-8 h-8" />
            </button>
        </div>

        <div className="h-36 flex items-center justify-center">
            {renderControls()}
        </div>
      </main>

      <footer className={`transition-opacity duration-500 ${currentStage.type === StageType.Cold ? 'opacity-50 pointer-events-none' : ''}`}>
        <MusicPlayer />
      </footer>
    </div>
  );
};

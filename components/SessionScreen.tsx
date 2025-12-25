
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Protocol, SessionLog, TimerStatus, TimerStyle, VoiceName } from '../types';
import { StageType } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";
import { MusicPlayer } from './MusicPlayer';
import { TimerCircle, TimerBar, TimerDigital, TimerHourglass } from './Timers';
import { STAGE_CONTENT, STAGE_COLORS } from '../constants';
import { InformationCircleIcon, PlayIcon, PauseIcon, StopIcon, SwitchIcon, VolumeUpIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';

// Audio decoding utilities
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface SessionScreenProps {
  protocol: Protocol;
  onSessionComplete: (log: Omit<SessionLog, 'hydration' | 'energy' | 'mood' | 'intention'>) => void;
  onExit: () => void;
  voiceGuidanceEnabled: boolean;
  voice: VoiceName;
  defaultTimerStyle: TimerStyle;
  defaultVolume: number;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({ protocol, onSessionComplete, onExit, voiceGuidanceEnabled, voice, defaultTimerStyle, defaultVolume }) => {
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(protocol.stages[0].duration);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('initial');
  const [timerStyle, setTimerStyle] = useState<TimerStyle>(defaultTimerStyle);
  const [isTipVisible, setIsTipVisible] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const { t } = useLanguage();

  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const sfxRef = useRef<HTMLAudioElement>(null);

  const currentStage = protocol.stages[currentStageIndex];
  const colors = STAGE_COLORS[currentStage.type];
  
  const { microcopy, tip } = useMemo(() => {
    const content = STAGE_CONTENT[currentStage.type];
    const microcopyKey = content.microcopy[Math.floor(Math.random() * content.microcopy.length)];
    const tipKey = content.tips[Math.floor(Math.random() * content.tips.length)];
    return { microcopy: t(microcopyKey), tip: t(tipKey) };
  }, [currentStage.type, currentCycle, currentStageIndex, t]);

  const queueGuidance = useCallback((text: string) => {
    if (voiceGuidanceEnabled && text) {
      setAudioQueue(prev => [...prev, text]);
    }
  }, [voiceGuidanceEnabled]);

  useEffect(() => {
    if (isGeneratingAudio || audioQueue.length === 0) {
      return;
    }

    const playNextInQueue = async () => {
      const nextText = audioQueue[0];
      
      setIsGeneratingAudio(true);
      try {
        if (!outputAudioContextRef.current) {
          outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioContext = outputAudioContextRef.current;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: nextText }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice },
              },
            },
          },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          
          source.onended = () => {
            currentAudioSourceRef.current = null;
            setIsGeneratingAudio(false); // Allow next item to play
          };
          
          currentAudioSourceRef.current = source;
          source.start();
          setAudioQueue(prev => prev.slice(1)); // Dequeue after successful start
        } else {
            setAudioQueue(prev => prev.slice(1)); // Dequeue even if no audio
            setIsGeneratingAudio(false);
        }
      } catch (error) {
        console.error("Failed to generate or play audio guidance:", error);
        setAudioQueue(prev => prev.slice(1)); // Dequeue on error
        setIsGeneratingAudio(false);
      }
    };

    playNextInQueue();
  }, [audioQueue, isGeneratingAudio, voice]);

  useEffect(() => {
    const stageType = protocol.stages[currentStageIndex].type;
    const text = t(`audio_guidance_start_${stageType}`);
    queueGuidance(text);
  }, [currentStageIndex, currentCycle, t, protocol.stages, queueGuidance]);
  
  useEffect(() => {
    if (timerStatus === 'completed') {
        const isLastStageInCycle = currentStageIndex === protocol.stages.length - 1;
        const isLastCycle = currentCycle === protocol.cycles;
        
        let textKey = '';
        if (isLastStageInCycle && isLastCycle) {
            textKey = 'audio_guidance_session_complete';
        } else {
            const stageType = protocol.stages[currentStageIndex].type;
            textKey = `audio_guidance_end_${stageType}`;
        }
        queueGuidance(t(textKey));
    }
  }, [timerStatus, currentStageIndex, currentCycle, protocol, t, queueGuidance]);


  useEffect(() => {
    if (timerStatus !== 'running') return;

    if (timeLeft <= 0) {
      setTimerStatus('completed');
      if (sfxRef.current) {
        sfxRef.current.volume = 0.3;
        sfxRef.current.play().catch(e => console.error("Error playing sound effect", e));
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
      setTotalSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerStatus]);
  
  useEffect(() => {
    // Cleanup AudioContext on unmount
    return () => {
        if (currentAudioSourceRef.current) {
            currentAudioSourceRef.current.stop();
        }
        if (outputAudioContextRef.current) {
            outputAudioContextRef.current.close().catch(console.error);
        }
    }
  }, []);

  const handlePlayPause = () => {
    if (timerStatus === 'running') {
      setTimerStatus('paused');
    } else {
      setTimerStatus('running');
    }
  };

  const handleEndStage = () => {
    setTimerStatus('completed');
    if (sfxRef.current) {
      sfxRef.current.volume = 0.3;
      sfxRef.current.play().catch(e => console.error("Error playing sound effect", e));
    }
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
              className="bg-slate-100 text-slate-900 font-bold py-4 px-12 rounded-full text-lg animate-pulse"
            >
              {t('next_step')}
            </button>
        )
      }

      return (
        <div className="flex items-center justify-around w-full max-w-md">
            <button
                onClick={handleEndStage}
                className="flex flex-col items-center justify-center w-24 h-24 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                aria-label={t('end_stage_label')}
                disabled={timerStatus === 'initial'}
            >
                <StopIcon className="w-12 h-12"/>
                <span className="text-lg font-semibold mt-1">{t('end_stage')}</span>
            </button>
            <button
                onClick={handlePlayPause}
                className="w-28 h-28 bg-white/90 text-slate-900 rounded-full flex items-center justify-center text-3xl shadow-lg hover:bg-white transition-transform transform hover:scale-105"
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
      <audio ref={sfxRef} src="https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3" preload="auto" />
      <header className="grid grid-cols-3 items-center text-lg text-slate-300">
        <div className="text-left">
            <button onClick={handleExit} className="bg-slate-800/50 hover:bg-slate-700 text-slate-300 font-semibold py-2 px-5 rounded-full border border-slate-700 transition-colors">
                {t('exit')}
            </button>
        </div>
        <div className="text-center">
            <div className="font-bold tracking-widest">{t(`stage_${currentStage.type}`)}</div>
            <div className="text-sm">{t('cycle')} {currentCycle} / {protocol.cycles}</div>
        </div>
        <div className="text-right flex items-center justify-end space-x-2">
            {isGeneratingAudio && (
                <div className="text-amber-400 animate-pulse" title={t('ai_generating_audio_title')}>
                    <VolumeUpIcon className="w-6 h-6" />
                </div>
            )}
            <button onClick={handleSwitchStyle} className="text-slate-400 hover:text-white transition-colors inline-block p-3 -m-3 rounded-full" aria-label={t('switch_timer_style_label')}>
                <SwitchIcon className="w-7 h-7"/>
            </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        {isTipVisible && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center p-8" onClick={() => setIsTipVisible(false)}>
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl max-w-md text-center">
                    <h3 className="text-xl font-bold mb-3 text-white">{t('tip_title')}</h3>
                    <p className="text-slate-300">{tip}</p>
                    <button onClick={() => setIsTipVisible(false)} className="mt-6 bg-slate-700 text-white font-semibold py-2 px-6 rounded-full">
                        {t('close')}
                    </button>
                </div>
            </div>
        )}
        
        {renderTimer()}
        
        <div className="flex items-center space-x-2 mt-8 h-12 text-slate-400 text-xl">
            <span>{timerStatus === 'completed' ? t('stage_complete') : microcopy}</span>
            <button onClick={() => setIsTipVisible(true)} className="text-slate-500 hover:text-white transition-colors rounded-full p-3 -m-3" aria-label={t('show_tip_label')}>
                <InformationCircleIcon className="w-8 h-8" />
            </button>
        </div>

        <div className="h-36 flex items-center justify-center">
            {renderControls()}
        </div>
      </main>

      <footer className={`transition-opacity duration-500 ${currentStage.type === StageType.Cold ? 'opacity-50 pointer-events-none' : ''}`}>
        <MusicPlayer defaultVolume={defaultVolume} />
      </footer>
    </div>
  );
};

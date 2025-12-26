import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Protocol, SessionLog, TimerStatus, TimerStyle, VoiceName } from '../types';
import { StageType } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";
import { MusicPlayer } from './MusicPlayer';
import { TimerCircle, TimerBar, TimerDigital, TimerHourglass } from './Timers';
import { STAGE_CONTENT, STAGE_COLORS, PLAYLIST } from '../constants';
import { InformationCircleIcon, PlayIcon, PauseIcon, StopIcon, SwitchIcon, VolumeUpIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useActiveBackground } from '../hooks/useActiveBackground';
import { AudioPlayerDebug } from './AudioPlayerDebug';

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
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
  const { backgroundUrl } = useActiveBackground('ritual');

  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sfxRef = useRef<HTMLAudioElement>(null);

  const initAudioContext = useCallback(async () => {
    if (!outputAudioContextRef.current) {
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (outputAudioContextRef.current.state === 'suspended') {
      await outputAudioContextRef.current.resume();
    }
    return outputAudioContextRef.current;
  }, []);

  const currentStage = protocol.stages[currentStageIndex];
  const colors = STAGE_COLORS[currentStage.type];
  
  const containerStyle = backgroundUrl ? {
    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url("${backgroundUrl}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {};

  const { microcopy, tip } = useMemo(() => {
    const content = STAGE_CONTENT[currentStage.type];
    const microcopyKey = content.microcopy[Math.floor(Math.random() * content.microcopy.length)];
    return { microcopy: t(microcopyKey), tip: t(content.tips[0]) };
  }, [currentStage.type, t]);

  const playTTS = useCallback(async (text: string) => {
    if (!voiceGuidanceEnabled || isGeneratingAudio || !text) return;
    setIsGeneratingAudio(true);
    try {
      const ctx = await initAudioContext();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } }
        },
      });
      
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (error) {
      console.error("[Assistant] Failed:", error);
    } finally {
      setIsGeneratingAudio(false);
    }
  }, [voiceGuidanceEnabled, isGeneratingAudio, voice, initAudioContext]);

  useEffect(() => {
    // Autoplay TTS only if ritual is RUNNING
    if (timerStatus === 'running') {
      playTTS(t(`audio_guidance_start_${protocol.stages[currentStageIndex].type}`));
    }
  }, [currentStageIndex, currentCycle, timerStatus, t, protocol.stages, playTTS]);

  useEffect(() => {
    if (timerStatus !== 'running') return;
    if (timeLeft <= 0) {
      setTimerStatus('completed');
      sfxRef.current?.play().catch(() => {});
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(p => p - 1);
      setTotalSessionTime(p => p + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, timerStatus]);

  const handlePlayPause = async () => {
    await initAudioContext(); // Crucial for Autoplay Policy
    setTimerStatus(s => s === 'running' ? 'paused' : 'running');
  };

  const handleNextStep = () => {
    const isLast = currentStageIndex === protocol.stages.length - 1 && currentCycle === protocol.cycles;
    if (isLast) {
      onSessionComplete({ protocolName: t(protocol.name), totalTime: totalSessionTime, cyclesCompleted: protocol.cycles, date: new Date().toISOString(), goal: protocol.goal });
      return;
    }
    let nextIdx = currentStageIndex + 1;
    let nextCyc = currentCycle;
    if (nextIdx >= protocol.stages.length) { nextIdx = 0; nextCyc++; }
    setCurrentStageIndex(nextIdx); setCurrentCycle(nextCyc); setTimeLeft(protocol.stages[nextIdx].duration); setTimerStatus('initial');
  };

  const progress = (currentStage.duration - timeLeft) / currentStage.duration;

  return (
    <div className={`flex flex-col min-h-screen ${colors.bg} ${colors.text} transition-all duration-1000 p-6`} style={containerStyle}>
      <audio ref={sfxRef} src="https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3" preload="auto" />
      
      <header className="grid grid-cols-3 items-center text-lg text-slate-300">
        <button onClick={onExit} className="justify-self-start bg-slate-800/50 hover:bg-slate-700 px-5 py-2 rounded-full border border-slate-700">{t('exit')}</button>
        <div className="text-center font-bold tracking-widest">{t(`stage_${currentStage.type}`)}<div className="text-sm font-normal">{t('cycle')} {currentCycle}/{protocol.cycles}</div></div>
        <div className="justify-self-end flex gap-4">
           {isGeneratingAudio && <VolumeUpIcon className="w-6 h-6 animate-pulse text-amber-400" />}
           <button onClick={() => setTimerStyle(s => s === 'circle' ? 'digital' : 'circle')} className="text-slate-400"><SwitchIcon className="w-6 h-6" /></button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center relative">
        {timerStyle === 'circle' ? <TimerCircle progress={progress} timeLeft={timeLeft} colors={colors} stageType={currentStage.type} /> : <TimerDigital progress={progress} timeLeft={timeLeft} colors={colors} stageType={currentStage.type} />}
        <div className="mt-8 text-xl text-slate-400 flex items-center gap-2">
          {timerStatus === 'completed' ? t('stage_complete') : microcopy}
          <button onClick={() => setIsTipVisible(true)}><InformationCircleIcon className="w-6 h-6" /></button>
        </div>
        <div className="mt-12 h-24 flex items-center">
          {timerStatus === 'completed' ? (
            <button onClick={handleNextStep} className="bg-white text-slate-900 font-bold py-4 px-12 rounded-full animate-pulse">{t('next_step')}</button>
          ) : (
            <button onClick={handlePlayPause} className="w-24 h-24 bg-white/90 text-slate-900 rounded-full flex items-center justify-center shadow-xl">
              {timerStatus === 'running' ? <PauseIcon className="w-10 h-10" /> : <PlayIcon className="w-10 h-10" />}
            </button>
          )}
        </div>
      </main>

      <footer>
        <MusicPlayer defaultVolume={defaultVolume} />
      </footer>
    </div>
  );
};
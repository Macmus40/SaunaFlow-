import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PlayIcon, PauseIcon, RewindIcon, FastForwardIcon, VolumeUpIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { PLAYLIST } from '../constants';

interface MusicPlayerProps {
    defaultVolume?: number;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ defaultVolume = 0.5 }) => {
  const { t } = useLanguage();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wasPlayingWhenTrackChanged = useRef(false);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      console.log(`[MusicPlayer] Attempting to play: ${currentTrack.src}`);
      try {
        await audioRef.current.play();
        console.log(`[MusicPlayer] Playback started. ReadyState: ${audioRef.current.readyState}`);
      } catch (error: any) {
        console.error(`[MusicPlayer] Playback error (${error.name}): ${error.message}`);
        setIsPlaying(false);
        // Autoplay policy fix: log details
        if (error.name === 'NotAllowedError') {
          console.warn("[MusicPlayer] Autoplay prevented by browser. User interaction required.");
        }
      }
    }
  };
  
  const changeTrack = useCallback((direction: 'next' | 'prev') => {
    wasPlayingWhenTrackChanged.current = isPlaying; 
    setCurrentTrackIndex(prev => {
        if (direction === 'next') return (prev + 1) % PLAYLIST.length;
        return (prev - 1 + PLAYLIST.length) % PLAYLIST.length;
    });
  }, [isPlaying]);

  const handleNextTrack = useCallback(() => changeTrack('next'), [changeTrack]);
  const handlePrevTrack = useCallback(() => changeTrack('prev'), [changeTrack]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };
  
  const handleOnCanPlay = () => {
      if (wasPlayingWhenTrackChanged.current && audioRef.current) {
          audioRef.current.play().catch(e => console.warn("[MusicPlayer] Autoplay after change failed", e));
          wasPlayingWhenTrackChanged.current = false;
      }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 shadow-lg flex items-center space-x-2 sm:space-x-4 text-slate-300">
      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        onEnded={handleNextTrack}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onCanPlay={handleOnCanPlay}
        preload="auto"
        crossOrigin="anonymous"
        />
      <div className="w-16 h-16 bg-slate-700 rounded-lg flex-shrink-0">
          <img src={currentTrack.cover} alt="Album art" className="w-full h-full object-cover rounded-lg"/>
      </div>
      <div className="flex-grow min-w-0">
        <p className="font-bold text-slate-200 truncate">{t(currentTrack.titleKey)}</p>
        <p className="text-sm text-slate-400 hidden sm:block">{t(currentTrack.artistKey)}</p>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className="flex items-center space-x-1">
            <button onClick={handlePrevTrack} className="w-10 h-10 hover:text-white transition-colors"><RewindIcon /></button>
            <button onClick={handlePlayPause} className="w-12 h-12 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={handleNextTrack} className="w-10 h-10 hover:text-white transition-colors"><FastForwardIcon /></button>
        </div>
        <div className="hidden sm:flex items-center space-x-2 w-24">
            <VolumeUpIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-400"
                aria-label="Volume"
            />
        </div>
      </div>
    </div>
  );
};
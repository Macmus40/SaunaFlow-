import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, RewindIcon, FastForwardIcon, VolumeUpIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { PLAYLIST } from '../constants';

export const MusicPlayer: React.FC = () => {
  const { t } = useLanguage();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Effect to handle continuing playback when track changes
  useEffect(() => {
    if (isPlaying && audioRef.current) {
        // When the track changes, the `src` is updated by React's render.
        // We need to load the new source and then play it.
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Audio playback after track switch failed:", error);
                // If autoplay fails, update the state to reflect that it's not playing
                setIsPlaying(false);
            });
        }
    }
  // isPlaying is intentionally omitted to prevent re-triggering on play/pause
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);


  const handlePlayPause = async () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (error) {
                console.error("Audio playback failed:", error);
                setIsPlaying(false); // Ensure state is correct on failure
            }
        }
    }
  };
  
  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };
  
  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };


  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
        audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-lg flex items-center space-x-2 sm:space-x-4 text-slate-600 dark:text-slate-300">
      <audio ref={audioRef} src={currentTrack.src} onEnded={handleNextTrack} />
      <div className="w-16 h-16 bg-slate-300 dark:bg-slate-700 rounded-lg flex-shrink-0">
          <img src={currentTrack.cover} alt="Album art" className="w-full h-full object-cover rounded-lg"/>
      </div>
      <div className="flex-grow min-w-0">
        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{t(currentTrack.titleKey)}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">{t(currentTrack.artistKey)}</p>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className="flex items-center space-x-1">
            <button onClick={handlePrevTrack} className="w-10 h-10 hover:text-slate-900 dark:hover:text-white transition-colors"><RewindIcon /></button>
            <button onClick={handlePlayPause} className="w-12 h-12 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full flex items-center justify-center hover:bg-slate-900 dark:hover:bg-white transition-colors">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={handleNextTrack} className="w-10 h-10 hover:text-slate-900 dark:hover:text-white transition-colors"><FastForwardIcon /></button>
        </div>
        <div className="hidden sm:flex items-center space-x-2 w-24">
            <VolumeUpIcon className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:accent-amber-400"
                aria-label="Volume"
            />
        </div>
      </div>
    </div>
  );
};
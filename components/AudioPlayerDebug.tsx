import React, { useState, useRef } from 'react';

interface AudioPlayerDebugProps {
    src: string;
    label?: string;
}

export const AudioPlayerDebug: React.FC<AudioPlayerDebugProps> = ({ src, label = "Debug Audio" }) => {
    const [status, setStatus] = useState<string>('Ready');
    const [error, setError] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const testAudio = async () => {
        if (!audioRef.current) return;
        
        setStatus('Testing...');
        setError(null);
        console.log(`[AudioDebug] Starting test for: ${src}`);

        try {
            // Diagnostyka sieciowa
            const headCheck = await fetch(src, { method: 'HEAD' }).catch(e => ({ ok: false, statusText: e.message }));
            console.log(`[AudioDebug] URL Check: ${headCheck.ok ? 'OK' : 'FAILED'} (Status: ${headCheck.statusText})`);

            const audio = audioRef.current;
            console.log(`[AudioDebug] Current state: readyState=${audio.readyState}, networkState=${audio.networkState}`);
            
            audio.volume = 0.5;
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                await playPromise;
                setStatus('Playing ✅');
                console.log('[AudioDebug] Playback started successfully');
            }
        } catch (err: any) {
            const errorMsg = `${err.name}: ${err.message}`;
            setError(errorMsg);
            setStatus('Error ❌');
            console.error('[AudioDebug] Playback failed:', err);
        }
    };

    return (
        <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-[10px] font-mono space-y-2 max-w-xs shadow-xl">
            <div className="flex justify-between items-center">
                <span className="text-amber-500 font-bold uppercase tracking-tighter">{label}</span>
                <span className={error ? 'text-rose-400' : 'text-emerald-400'}>{status}</span>
            </div>
            <audio ref={audioRef} src={src} preload="none" />
            <div className="truncate text-slate-500 mb-2">{src}</div>
            <button 
                onClick={testAudio}
                className="w-full bg-slate-700 hover:bg-slate-600 py-1.5 rounded font-bold text-slate-200 transition-colors active:scale-95"
            >
                Start Audio & Diagnostics
            </button>
            {error && <div className="text-rose-400 leading-tight border-t border-rose-500/20 pt-1 mt-1">{error}</div>}
        </div>
    );
};
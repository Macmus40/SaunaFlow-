import React from 'react';
import { TimerProps, formatTime } from '../types';
import { TimerCircle } from './TimerCircle';

export const TimerBar: React.FC<TimerProps> = ({ progress, timeLeft, colors }) => {
    return (
        <div className="w-full max-w-sm flex flex-col items-center h-72 justify-center">
            <span className={`text-7xl font-light tracking-tighter mb-8 ${colors.text}`}>{formatTime(timeLeft)}</span>
            <div className={`w-full h-4 rounded-full ${colors.track}`}>
                <div 
                    className={`h-4 rounded-full ${colors.bar} transition-all duration-1000 ease-linear`}
                    style={{ width: `${progress * 100}%` }}
                />
            </div>
        </div>
    );
};

export const TimerDigital: React.FC<TimerProps> = ({ timeLeft, colors }) => {
    const timeString = formatTime(timeLeft);
    return (
        <div className={`font-mono text-8xl tracking-widest flex items-center h-72 justify-center ${colors.text}`}>
            <span>{timeString.substring(0, 2)}</span>
            <span className="px-2 text-6xl opacity-75 animate-pulse">:</span>
            <span>{timeString.substring(3, 5)}</span>
        </div>
    );
};

export const TimerHourglass: React.FC<TimerProps> = ({ progress, timeLeft, colors }) => {
    const sandTriangleHeight = 65;

    // Y position of the top sand's clipping rectangle, moving down as progress increases
    const topClipY = 10 + (progress * sandTriangleHeight);
    // Height of the top sand's clipping rectangle, shrinking as progress increases
    const topClipHeight = sandTriangleHeight - (progress * sandTriangleHeight);

    // Height of the bottom sand's clipping rectangle, growing as progress increases
    const bottomClipHeight = progress * sandTriangleHeight;

    return (
        <div className="w-full h-72 flex flex-col items-center justify-center">
            <svg width="150" height="200" viewBox="0 0 100 150" className="mb-4">
                <defs>
                    <clipPath id="topSandClip">
                        <rect x="10" y={topClipY} width="80" height={topClipHeight} />
                    </clipPath>
                    <clipPath id="bottomSandClip">
                        <rect x="10" y="75" width="80" height={bottomClipHeight} />
                    </clipPath>
                </defs>

                {/* Top sand (clipped) */}
                <path d="M 10,10 L 90,10 L 50,75 Z" className={`${colors.sand} transition-colors duration-1000`} clipPath="url(#topSandClip)" />

                {/* Bottom sand (clipped) */}
                <path d="M 10,140 L 90,140 L 50,75 Z" className={`${colors.sand} transition-colors duration-1000`} clipPath="url(#bottomSandClip)" />

                {/* Glass Outline */}
                <path d="M 10,10 L 90,10 L 50,75 L 90,140 L 10,140 L 50,75 Z" strokeWidth="3" fill="none" className={`${colors.glass} transition-colors duration-1000`} />
            </svg>
            <span className={`text-5xl font-light tracking-tighter ${colors.text}`}>{formatTime(timeLeft)}</span>
        </div>
    );
};

export { TimerCircle };

import React from 'react';
import type { StageType } from '../types';

interface TimerProps {
  progress: number;
  timeLeft: number;
  colors: {
      ring: string;
      ringBg: string;
      text: string;
      bar: string;
      track: string;
      sand: string;
      glass: string;
  };
  stageType: StageType;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const TimerCircle: React.FC<TimerProps> = ({ progress, timeLeft, colors }) => {
  const radius = 120;
  const stroke = 15;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 280 280"
        className="-rotate-90"
      >
        <circle
          className={`${colors.ringBg} transition-colors duration-1000`}
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius + stroke}
          cy={radius + stroke}
        />
        <circle
          className={`${colors.ring} transition-all duration-1000 ease-linear`}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius + stroke}
          cy={radius + stroke}
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <span className={`text-6xl font-light tracking-tighter ${colors.text}`}>{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

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
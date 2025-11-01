import React from 'react';
import { TimerProps, formatTime } from '../types';

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

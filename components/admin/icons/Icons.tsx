
import React from 'react';

type IconProps = {
    className?: string;
}

export const SunIcon: React.FC<IconProps> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);

export const BoltIcon: React.FC<IconProps> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

export const FireIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.287 8.287 0 0 0 3-7.184 8.25 8.25 0 0 1 3.362 2.797Z" />
    </svg>
);

export const SnowflakeIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15m4.243-4.243L16.243 15m-10.486 0L16.243 4.5" />
    </svg>
);

export const HeartIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

export const PlayIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
    </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

export const StopIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
    </svg>
);


export const RewindIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
    </svg>
);

export const FastForwardIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
    </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-full h-full ${className}`}>
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .75.75l.493 1.48a.75.75 0 0 0 1.48.493l1.48-.493a.75.75 0 0 1 .976.976l-.494 1.48a.75.75 0 0 0 .493 1.48l1.48.493a.75.75 0 0 1 0 1.5l-1.48.493a.75.75 0 0 0-.493 1.48l.494 1.48a.75.75 0 0 1-.976.976l-1.48-.494a.75.75 0 0 0-1.48.493l-.493 1.48a.75.75 0 0 1-1.5 0l-.493-1.48a.75.75 0 0 0-1.48-.493l-1.48.494a.75.75 0 0 1-.976-.976l.494-1.48a.75.75 0 0 0-.493-1.48l-1.48-.493a.75.75 0 0 1 0-1.5l1.48-.493a.75.75 0 0 0 .493-1.48l-.494-1.48a.75.75 0 0 1 .976-.976l1.48.493a.75.75 0 0 0 1.48-.493l.493-1.48A.75.75 0 0 1 9 4.5Zm10.5 9.75a.75.75 0 0 1 .75.75l.245.735a.75.75 0 0 0 1.43.245l.735-.245a.75.75 0 0 1 .976.976l-.245.735a.75.75 0 0 0 .245 1.43l.735.245a.75.75 0 0 1 0 1.5l-.735.245a.75.75 0 0 0-.245 1.43l.245.735a.75.75 0 0 1-.976.976l-.735-.245a.75.75 0 0 0-1.43.245l-.245.735a.75.75 0 0 1-1.5 0l-.245-.735a.75.75 0 0 0-1.43-.245l-.735.245a.75.75 0 0 1-.976-.976l.245-.735a.75.75 0 0 0-.245-1.43l-.735-.245a.75.75 0 0 1 0-1.5l.735-.245a.75.75 0 0 0 .245-1.43l-.245-.735a.75.75 0 0 1 .976-.976l.735.245a.75.75 0 0 0 1.43-.245l.245-.735a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

export const PlusIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const MinusIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 1 9 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 12.75V18.75m-1.5-6-3-3.75a3.75 3.75 0 0 1 7.5 0l-3 3.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75V18.75m0 0a2.25 2.25 0 0 0 2.25-2.25H16.5a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 0 12 5.25a2.25 2.25 0 0 0-2.25 2.25v3.75a2.25 2.25 0 0 1-2.25 2.25H7.5a2.25 2.25 0 0 0 2.25 2.25M12 18.75v-3" />
    </svg>
);

export const SwitchIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
        {/* Back clock face, slightly dimmed and offset */}
        <circle cx="15" cy="9" r="7" className="opacity-60" />
        
        {/* Front clock face with hands */}
        <circle cx="9" cy="15" r="7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12v3h2.5" />
    </svg>
);

export const ThermometerIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 0 0 -4 0v8.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9h4" />
    </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" />
    </svg>
);

export const VolumeUpIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
);

export const FaceFrownIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.818a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9.75h.008v.008H9V9.75Zm6 0h.008v.008H15V9.75Z" />
    </svg>
);

export const FaceNeutralIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12h-9m12.75 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9.75h.008v.008H9V9.75Zm6 0h.008v.008H15V9.75Z" />
    </svg>
);

export const FaceSmileIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9.75h.008v.008H9V9.75Zm6 0h.008v.008H15V9.75Z" />
    </svg>
);

export const BatteryLowIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5A2.25 2.25 0 0 1 6 5.25h12A2.25 2.25 0 0 1 20.25 7.5v9A2.25 2.25 0 0 1 18 18.75H6A2.25 2.25 0 0 1 3.75 16.5v-9Zm1.5 0v9h1.5v-9h-1.5Zm15-1.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 .75-.75Z" />
    </svg>
);

export const BatteryFullIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 16.5v-9A2.25 2.25 0 0 1 6 5.25h12A2.25 2.25 0 0 1 20.25 7.5v9A2.25 2.25 0 0 1 18 18.75H6A2.25 2.25 0 0 1 3.75 16.5Z" />
        <path fill="currentColor" d="M6 6.75h12v9H6z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 10.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 .75-.75Z" />
    </svg>
);

export const CogIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a5.25 5.25 0 0 1 5.25 5.25c0 1.954-1.043 3.68-2.61 4.614a1.875 1.875 0 0 1-2.22 0A5.22 5.22 0 0 1 12 17.25a5.25 5.25 0 0 1-5.25-5.25 5.25 5.25 0 0 1 5.25-5.25Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75V4.5m0 15V17.25m-5.25-5.25H4.5m15 0h-2.25m-10.4-3.9 1.5-1.5m7.4 7.4 1.5-1.5m-10.4 0 1.5 1.5m7.4-7.4-1.5 1.5" />
    </svg>
);


// Admin Panel Icons
export const UsersIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.453M15 19.128v-3.873a3.375 3.375 0 0 0-3.375-3.375h-1.5A3.375 3.375 0 0 0 6.75 15.255v3.873M15 19.128a2.25 2.25 0 0 1-2.25-2.25v-3.873a3.375 3.375 0 0 0-3.375-3.375H6.75a3.375 3.375 0 0 0-3.375 3.375v3.873c0 1.243 1.007 2.25 2.25 2.25h1.5M12 12.253a3.375 3.375 0 0 1 3.375-3.375h1.5a3.375 3.375 0 0 1 3.375 3.375M12 12.253a3.375 3.375 0 0 0-3.375-3.375H6.75a3.375 3.375 0 0 0-3.375 3.375m12.75 0a3.375 3.375 0 0 1-3.375 3.375H9.375a3.375 3.375 0 0 1-3.375-3.375m12.75 0h.008v.008h-.008v-.008Zm-12.75 0h.008v.008h-.008v-.008Z" />
    </svg>
);

export const PhotoIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

export const CreditCardIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>
);

export const PencilIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 0 0-2.09 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const MusicNoteIcon: React.FC<IconProps> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-full h-full ${className}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9c0-1.381-1.119-2.5-2.5-2.5S4 7.619 4 9s1.119 2.5 2.5 2.5S9 10.381 9 9Zm0 0h12M9 9v10.5a2.5 2.5 0 0 0 2.5 2.5s2.5-1.119 2.5-2.5-1.119-2.5-2.5-2.5-2.5 1.119-2.5 2.5Z" />
    </svg>
);


// Flags
export const FlagUKIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className={className}><path d="M0 0h60v30H0z" fill="#00247d"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/><path d="M0 0l60 30m0-30L0 30" stroke="#cf142b" strokeWidth="4"/><path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/><path d="M30 0v30M0 15h60" stroke="#cf142b" strokeWidth="6"/></svg>
);
export const FlagDEIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" className={className}><path d="M0 0h5v3H0z"/><path d="M0 1h5v2H0z" fill="#D00"/><path d="M0 2h5v1H0z" fill="#FFCE00"/></svg>
);
export const FlagPLIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5" className={className}><path fill="#fff" d="M0 0h8v5H0z"/><path fill="#dc143c" d="M0 2.5h8v2.5H0z"/></svg>
);
export const FlagDKIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37 28" className={className}><path fill="#c60c30" d="M0 0h37v28H0z"/><path fill="#fff" d="M12 0h4v28h-4z"/><path fill="#fff" d="M0 12h37v4H0z"/></svg>
);
export const FlagSEIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10" className={className}><path fill="#006aa7" d="M0 0h16v10H0z"/><path fill="#fecc00" d="M5 0h2v10H5z"/><path fill="#fecc00" d="M0 4h16v2H0z"/></svg>
);
export const FlagNOIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 16" className={className}><path fill="#ef2b2d" d="M0 0h22v16H0z"/><path fill="#fff" d="M6 0h4v16H6zM0 6h22v4H0z"/><path fill="#002868" d="M7 0h2v16H7zM0 7h22v2H0z"/></svg>
);
export const FlagFIIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 11" className={className}><path fill="#fff" d="M0 0h18v11H0z"/><path fill="#003580" d="M5 0h3v11H5zM0 4h18v3H0z"/></svg>
);
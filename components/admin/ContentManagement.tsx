
import React, { useState, useRef } from 'react';
import type { Track } from '../../types';
import { PLAYLIST } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { TrashIcon, MusicNoteIcon } from '../icons/Icons';

const MOCK_BACKGROUNDS = [
    'https://images.unsplash.com/photo-1544161515-cfd626dba494?auto=format&fit=crop&w=1280&q=80',
    'https://images.unsplash.com/photo-1516556688536-9b59a67ce7b0?auto=format&fit=crop&w=1280&q=80',
    'https://images.unsplash.com/photo-1587317285906-857508b53896?auto=format&fit=crop&w=1280&q=80',
];

export const ContentManagement: React.FC = () => {
    const { t } = useLanguage();
    const [backgrounds, setBackgrounds] = useState(MOCK_BACKGROUNDS);
    const [playlist, setPlaylist] = useState(PLAYLIST);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBgDelete = (url: string) => {
        if(window.confirm("Simulate deleting background? This won't be saved.")) {
            setBackgrounds(prev => prev.filter(bg => bg !== url));
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const newUrl = e.target?.result as string;
                setBackgrounds(prev => [newUrl, ...prev]);
                alert("Simulated upload successful! The new background is added to the list (not saved).");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTrackDelete = (trackId: string) => {
        if(window.confirm("Simulate deleting track? This won't be saved.")) {
            setPlaylist(prev => prev.filter(track => track.id !== trackId));
        }
    };
    
    // In a real app, adding a track would involve a more complex form
    const handleAddTrack = () => {
         alert("Simulating adding a new track. In a real app, this would open a form to enter track details.");
    };

    return (
        <div className="space-y-12">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-100">Background Graphics</h2>
                     <button
                        onClick={handleUploadClick}
                        className="bg-amber-500 text-slate-900 font-semibold py-2 px-5 rounded-lg hover:bg-amber-400 transition-colors"
                    >
                        Upload New
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {backgrounds.map(url => (
                        <div key={url} className="relative group aspect-video">
                            <img src={url} alt="Background" className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleBgDelete(url)} className="text-rose-400 hover:text-rose-300 p-3 bg-slate-900/50 rounded-full">
                                    <TrashIcon className="w-6 h-6"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-100">Music Playlist</h2>
                     <button
                        onClick={handleAddTrack}
                        className="bg-amber-500 text-slate-900 font-semibold py-2 px-5 rounded-lg hover:bg-amber-400 transition-colors"
                    >
                        Add New Track
                    </button>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
                    {playlist.map(track => (
                        <div key={track.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-slate-800">
                            <div className="w-12 h-12 bg-slate-700 rounded-md flex-shrink-0">
                                <img src={track.cover} alt="Album" className="w-full h-full object-cover rounded-md"/>
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-slate-200">{t(track.titleKey)}</p>
                                <p className="text-sm text-slate-400">{t(track.artistKey)}</p>
                            </div>
                            <button onClick={() => handleTrackDelete(track.id)} className="text-slate-500 hover:text-rose-400 p-2">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

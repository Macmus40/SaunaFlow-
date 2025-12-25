import React, { useState, useRef, useEffect } from 'react';
import type { Session } from '@supabase/auth-js';
import type { Track, BackgroundImage } from '../../types';
import { supabase, IS_CONFIGURED } from '../../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { TrashIcon } from '../icons/Icons';
import { PLAYLIST } from '../../constants';

interface ContentManagementProps {
    session: Session | null;
}

export const ContentManagement: React.FC<ContentManagementProps> = ({ session }) => {
    const { t } = useLanguage();
    const [backgrounds, setBackgrounds] = useState<BackgroundImage[]>([]);
    const [playlist, setPlaylist] = useState<Track[]>(PLAYLIST);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoadingBgs, setIsLoadingBgs] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchBackgrounds();
    }, []);

    const fetchBackgrounds = async () => {
        if (!IS_CONFIGURED) return;
        setIsLoadingBgs(true);
        try {
            const { data, error } = await supabase
                .from('background_images')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setBackgrounds(data || []);
        } catch (error) {
            console.error('Error fetching backgrounds:', error);
        } finally {
            setIsLoadingBgs(false);
        }
    };

    const handleBgDelete = async (bg: BackgroundImage) => {
        if (!IS_CONFIGURED || !session || !session.user) return;
        if (!window.confirm("Are you sure you want to delete this background image?")) return;

        try {
            // 1. Delete from Storage
            const { error: storageError } = await supabase.storage
                .from('backgrounds')
                .remove([bg.storage_path]);
            
            if (storageError) throw storageError;

            // 2. Delete from Database
            const { error: dbError } = await supabase
                .from('background_images')
                .delete()
                .eq('id', bg.id)
                .eq('created_by', session.user.id);
            
            if (dbError) throw dbError;

            setBackgrounds(prev => prev.filter(b => b.id !== bg.id));
        } catch (error) {
            console.error('Error deleting background:', error);
            alert('Failed to delete background. Check your permissions.');
        }
    };

    const handleUploadClick = () => {
        if (!session || !session.user) {
            alert("You must be logged in to upload content.");
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !session || !session.user || !IS_CONFIGURED) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${crypto.randomUUID()}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('backgrounds')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('backgrounds')
                .getPublicUrl(filePath);

            // 3. Save to background_images table
            const { data: insertData, error: dbError } = await supabase
                .from('background_images')
                .insert([{
                    url: publicUrl,
                    storage_path: filePath,
                    created_by: session.user.id
                }])
                .select()
                .single();

            if (dbError) throw dbError;

            setBackgrounds(prev => [insertData, ...prev]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload background image. Ensure the "backgrounds" bucket exists and RLS is configured.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleTrackDelete = (trackId: string) => {
        if(window.confirm("Simulate deleting track? This won't be saved permanently.")) {
            setPlaylist(prev => prev.filter(track => track.id !== trackId));
        }
    };
    
    const handleAddTrack = () => {
         alert("Music upload is coming soon to Supabase integrations.");
    };

    return (
        <div className="space-y-12">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-100">Background Graphics</h2>
                        <p className="text-slate-400 text-sm mt-1">Manage backgrounds stored in Supabase Storage</p>
                    </div>
                     <button
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className={`bg-amber-500 text-slate-900 font-semibold py-2 px-5 rounded-lg hover:bg-amber-400 transition-colors flex items-center space-x-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <span>Upload New Image</span>
                        )}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                {isLoadingBgs ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-video bg-slate-800 animate-pulse rounded-lg"></div>
                        ))}
                    </div>
                ) : backgrounds.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {backgrounds.map(bg => (
                            <div key={bg.id} className="relative group aspect-video">
                                <img src={bg.url} alt="Background" className="w-full h-full object-cover rounded-lg" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        onClick={() => handleBgDelete(bg)} 
                                        className="text-rose-400 hover:text-rose-300 p-3 bg-slate-900/50 rounded-full transition-transform hover:scale-110"
                                    >
                                        <TrashIcon className="w-6 h-6"/>
                                    </button>
                                </div>
                                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                                     <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-slate-300 backdrop-blur-sm truncate max-w-[70%]">
                                        {bg.storage_path.split('/').pop()}
                                     </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/20 border border-dashed border-slate-700 rounded-xl">
                        <p className="text-slate-500 italic">No background images found in database.</p>
                    </div>
                )}
            </div>

            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-100">Music Playlist</h2>
                        <p className="text-slate-400 text-sm mt-1">Playlist tracks for the session music player</p>
                    </div>
                     <button
                        onClick={handleAddTrack}
                        className="bg-slate-700 text-slate-200 font-semibold py-2 px-5 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                        Add New Track
                    </button>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3">
                    {playlist.map(track => (
                        <div key={track.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-slate-800 group transition-colors">
                            <div className="w-12 h-12 bg-slate-700 rounded-md flex-shrink-0 relative overflow-hidden">
                                <img src={track.cover} alt="Album" className="w-full h-full object-cover rounded-md group-hover:scale-110 transition-transform duration-500"/>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-slate-200">{t(track.titleKey)}</p>
                                <p className="text-sm text-slate-400">{t(track.artistKey)}</p>
                            </div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest px-3 border-r border-slate-700 hidden sm:block">
                                Preset
                            </div>
                            <button onClick={() => handleTrackDelete(track.id)} className="text-slate-500 hover:text-rose-400 p-2 transition-colors">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
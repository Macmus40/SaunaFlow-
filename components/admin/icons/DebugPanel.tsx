import React, { useState, useEffect } from 'react';
import BackgroundManager from '../../BackgroundManager';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY, maskKey } from '../../../lib/supabaseClient';

interface DebugPanelProps {
    session: any;
    onExit: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ session, onExit }) => {
    const [logs, setLogs] = useState<{ time: string, msg: string, type: 'info' | 'error' | 'success' }[]>([]);
    const [isTestingDB, setIsTestingDB] = useState(false);
    const [isTestingStorage, setIsTestingStorage] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(false);

    const addLog = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
        setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg, type }, ...prev]);
    };

    const checkSessionNow = async () => {
        setIsCheckingSession(true);
        addLog("Manually checking session via SDK...", "info");
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            if (data.session) {
                addLog(`Session is ACTIVE. User: ${data.session.user.email}`, "success");
            } else {
                addLog("Session is NULL (No active user found).", "error");
            }
        } catch (e: any) {
            addLog(`Auth Check Error: ${e.message}`, "error");
        } finally {
            setIsCheckingSession(false);
        }
    };

    const testDatabase = async () => {
        setIsTestingDB(true);
        addLog("Testing Database connection...", "info");
        try {
            const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
            if (error) throw error;
            addLog(`Success! DB connected. Profiles count head: ${data || 0}`, "success");
        } catch (e: any) {
            addLog(`DB Error: ${e.message}`, "error");
        } finally {
            setIsTestingDB(false);
        }
    };

    const testStorage = async () => {
        setIsTestingStorage(true);
        addLog("Testing Storage upload to bucket 'backgrounds'...", "info");
        try {
            const testBlob = new Blob(["SaunaFlow Connection Test"], { type: 'text/plain' });
            const fileName = `debug/test-${Date.now()}.txt`;
            const { error } = await supabase.storage.from('backgrounds').upload(fileName, testBlob);
            if (error) throw error;
            addLog(`Storage success! File uploaded to 'backgrounds/debug/'.`, "success");
        } catch (e: any) {
            addLog(`Storage Error: ${e.message}`, "error");
        } finally {
            setIsTestingStorage(false);
        }
    };

    useEffect(() => {
        addLog(`System initialized. Origin: ${window.location.origin}`, "info");
        addLog(`Session Prop Status: ${session ? 'Active (User ID: ' + session.user.id + ')' : 'No Session'}`, "info");
    }, [session]);

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-300 p-6 font-mono text-sm overflow-hidden">
            <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6 shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-white flex items-center">
                        <span className="w-3 h-3 bg-rose-500 rounded-full animate-pulse mr-3"></span>
                        SaunaFlow Diagnostic Panel
                    </h1>
                    <p className="text-[10px] text-slate-500 uppercase mt-1">Version: 4.2.2-stable</p>
                </div>
                <button onClick={onExit} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">Close Console</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow overflow-hidden">
                <div className="flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    <section className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner">
                        <h2 className="text-amber-500 font-bold mb-4 uppercase text-xs tracking-widest">Environment</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                                <span>SUPABASE_URL</span>
                                <span className={SUPABASE_URL ? 'text-emerald-400 font-bold' : 'text-rose-500'}>{SUPABASE_URL ? 'DEFINED' : 'MISSING'}</span>
                            </div>
                            <div className="text-[10px] text-slate-600 mb-4 truncate">{SUPABASE_URL || 'N/A'}</div>
                            <div className="flex justify-between border-b border-slate-800 pb-1">
                                <span>ANON_KEY</span>
                                <span className={SUPABASE_ANON_KEY ? 'text-emerald-400 font-bold' : 'text-rose-500'}>{SUPABASE_ANON_KEY ? 'DEFINED' : 'MISSING'}</span>
                            </div>
                            <div className="text-[10px] text-slate-600">{maskKey(SUPABASE_ANON_KEY)}</div>
                        </div>
                    </section>

                    <section className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <h2 className="text-amber-500 font-bold mb-4 uppercase text-xs tracking-widest">Diagnostics</h2>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={checkSessionNow} disabled={isCheckingSession} className="w-full bg-rose-900/40 hover:bg-rose-900/60 py-3 rounded-lg flex items-center justify-center space-x-2 border border-rose-500/30 active:scale-95 transition-all">
                                {isCheckingSession && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                <span className="text-rose-200">Check Session Now</span>
                            </button>
                            <button onClick={testDatabase} disabled={isTestingDB} className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-lg flex items-center justify-center space-x-2 border border-slate-700 active:bg-slate-900 transition-all">
                                {isTestingDB && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                <span>Check Database Connection</span>
                            </button>
                            <button onClick={testStorage} disabled={isTestingStorage} className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-lg flex items-center justify-center space-x-2 border border-slate-700 active:bg-slate-900 transition-all">
                                {isTestingStorage && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                <span>Test Storage Bucket ('backgrounds')</span>
                            </button>
                        </div>
                    </section>
                    <BackgroundManager />
                </div>

                <div className="bg-black/40 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                    <div className="bg-slate-800/80 p-2 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-800 flex justify-between px-4">
                        <span>Runtime Output</span>
                        <span>{logs.length} events</span>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-2">
                        {logs.length === 0 && <div className="text-slate-700 italic text-center mt-10">No events logged yet...</div>}
                        {logs.map((log, i) => (
                            <div key={i} className="flex space-x-3 text-[11px] font-medium animate-in fade-in slide-in-from-left-2">
                                <span className="text-slate-600 flex-shrink-0">[{log.time}]</span>
                                <span className={log.type === 'error' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}>{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
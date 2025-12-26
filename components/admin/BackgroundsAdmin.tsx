import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { BackgroundScope } from '../../hooks/useActiveBackground';
import { TrashIcon, PhotoIcon } from '../icons/Icons';

export const BackgroundsAdmin: React.FC = () => {
  const [scope, setScope] = useState<BackgroundScope>('start');
  const [backgrounds, setBackgrounds] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBackgrounds = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('backgrounds')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('scope', scope)
      .order('created_at', { ascending: false });

    if (!error) setBackgrounds(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBackgrounds();
  }, [scope]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${userId}/${scope}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('backgrounds')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('backgrounds').insert({
        user_id: userId,
        scope,
        object_path: filePath,
        public_url: publicUrl,
        filename: file.name,
        content_type: file.type,
        size_bytes: file.size,
        is_active: backgrounds.length === 0
      });

      if (dbError) throw dbError;
      fetchBackgrounds();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const setActive = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('backgrounds')
      .update({ is_active: false })
      .eq('user_id', session?.user.id)
      .eq('scope', scope);
    
    await supabase.from('backgrounds')
      .update({ is_active: true })
      .eq('id', id);
    
    fetchBackgrounds();
  };

  const deleteBg = async (bg: any) => {
    if (!confirm('Are you sure?')) return;
    await supabase.storage.from('backgrounds').remove([bg.object_path]);
    await supabase.from('backgrounds').delete().eq('id', bg.id);
    fetchBackgrounds();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Screen Backgrounds</h2>
          <p className="text-slate-400 text-sm">Assign custom wallpapers to specific app views.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={scope} 
            onChange={(e) => setScope(e.target.value as BackgroundScope)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="start">Start Screen</option>
            <option value="login">Login Screen</option>
            <option value="ritual">Ritual Screen</option>
            <option value="config">Config Screen</option>
          </select>
          
          <label className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors text-sm">
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-500 animate-pulse">Loading gallery...</div>
        ) : backgrounds.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-600">
            No backgrounds for this screen yet.
          </div>
        ) : (
          backgrounds.map((bg) => (
            <div key={bg.id} className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${bg.is_active ? 'border-amber-500' : 'border-slate-800'}`}>
              <img src={bg.public_url} className="w-full h-full object-cover" alt={bg.filename} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                {!bg.is_active && (
                  <button onClick={() => setActive(bg.id)} className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-amber-400 transition-colors">
                    Set Active
                  </button>
                )}
                <button onClick={() => deleteBg(bg)} className="text-rose-400 hover:text-rose-300 p-2">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
              {bg.is_active && (
                <div className="absolute top-2 left-2 bg-amber-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Active
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

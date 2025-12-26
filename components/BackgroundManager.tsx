import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type BackgroundRow = {
  id: string;
  user_id: string;
  bucket: string;
  object_path: string;
  public_url: string | null;
  filename: string | null;
  content_type: string | null;
  size_bytes: number | null;
  is_active: boolean;
  created_at: string;
};

function getExt(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "bin";
}

export default function BackgroundManager() {
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [items, setItems] = useState<BackgroundRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  async function refreshList() {
    setLoading(true);
    setErrorMsg(null);
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id ?? null;
    setSessionUserId(uid);

    if (!uid) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("backgrounds")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setItems([]);
    } else {
      setItems((data ?? []) as BackgroundRow[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    refreshList();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refreshList();
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleUpload(file: File) {
    setOkMsg(null);
    setErrorMsg(null);
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id;
    if (!uid) {
      setErrorMsg("Najpierw zaloguj się.");
      return;
    }
    setUploading(true);
    try {
      const ext = getExt(file.name);
      const objectPath = `${uid}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("backgrounds")
        .upload(objectPath, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("backgrounds").getPublicUrl(objectPath);
      const publicUrl = pub?.publicUrl ?? null;
      const { error: insErr } = await supabase.from("backgrounds").insert({
        user_id: uid,
        bucket: "backgrounds",
        object_path: objectPath,
        public_url: publicUrl,
        filename: file.name,
        content_type: file.type || null,
        size_bytes: file.size ?? null,
        is_active: items.length === 0,
      });
      if (insErr) throw insErr;
      setOkMsg("Tło wgrane ✅");
      await refreshList();
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function setActive(id: string) {
    setOkMsg(null);
    setErrorMsg(null);
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id;
    if (!uid) return;
    await supabase.from("backgrounds").update({ is_active: false }).eq("user_id", uid);
    await supabase.from("backgrounds").update({ is_active: true }).eq("id", id).eq("user_id", uid);
    setOkMsg("Ustawiono aktywne tło ✅");
    await refreshList();
  }

  async function removeItem(row: BackgroundRow) {
    setOkMsg(null);
    setErrorMsg(null);
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id;
    if (!uid) return;
    await supabase.storage.from("backgrounds").remove([row.object_path]);
    await supabase.from("backgrounds").delete().eq("id", row.id).eq("user_id", uid);
    setOkMsg("Usunięto ✅");
    await refreshList();
  }

  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
      <h2 className="text-lg font-bold text-amber-500 mb-4 uppercase tracking-wider">Background Manager</h2>
      {!sessionUserId ? (
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 text-center italic">
          Sign in to manage custom backgrounds.
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block w-full cursor-pointer bg-slate-800 border-2 border-dashed border-slate-700 hover:border-amber-500/50 p-6 rounded-xl text-center transition-all">
            <span className="text-sm text-slate-400">{uploading ? "Uploading..." : "Click to upload image"}</span>
            <input type="file" accept="image/*" disabled={uploading} className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
              e.currentTarget.value = "";
            }} />
          </label>
          {errorMsg && <div className="p-3 bg-rose-500/20 text-rose-400 rounded-lg text-xs">{errorMsg}</div>}
          {okMsg && <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs">{okMsg}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {items.map((row) => (
              <div key={row.id} className={`p-3 rounded-xl border transition-all ${row.is_active ? 'bg-amber-500/5 border-amber-500/30' : 'bg-slate-800/30 border-slate-700'}`}>
                <div className="aspect-video mb-3 overflow-hidden rounded-lg bg-black/40">
                  {row.public_url && <img src={row.public_url} alt="bg" className="w-full h-full object-cover" />}
                </div>
                <div className="flex justify-between items-center gap-2">
                  <button onClick={() => setActive(row.id)} className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-full transition-all ${row.is_active ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    {row.is_active ? 'Active' : 'Set Active'}
                  </button>
                  <button onClick={() => removeItem(row)} className="text-[10px] uppercase font-bold px-3 py-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-full transition-all">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
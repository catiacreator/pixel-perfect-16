import { useEffect, useRef, useState } from "react";
import { Camera, LogOut, User, Eye, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resetMasterDocSync } from "@/lib/master-doc-sync";
import { readStoredSession } from "@/lib/session";
import { notify } from "@/lib/toast";
import { useAccess } from "@/lib/use-access";
import { useAdminView } from "@/lib/admin-view";

/** Redimensiona/recorta a imagem para um quadrado de 256px e devolve um data URL JPEG. */
function fileToAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas indisponível"));
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Imagem inválida")); };
    img.src = url;
  });
}

export default function UserMenu() {
  const { isAdmin } = useAccess();
  const [adminView, setView] = useAdminView();
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    // Leitura síncrona do storage — instantânea, não pendura.
    const sess = readStoredSession();
    const user = sess?.user;
    if (!user) return;
    setUserId(user.id);
    setEmail(user.email ?? "");
    setNome(user.user_metadata?.full_name ?? "");
    const localAvatar = (() => { try { return localStorage.getItem(`leveza.avatar.${user.id}`); } catch { return null; } })();
    setAvatar(user.user_metadata?.avatar_url ?? localAvatar ?? null);
    // Tenta enriquecer com o perfil (nome/foto guardados). Se a tabela não existir, ignora.
    (async () => {
      try {
        const { data: prof } = await supabase
          .from("profiles")
          .select("nome, avatar_url")
          .eq("id", user.id)
          .maybeSingle();
        if (!active || !prof) return;
        if (prof.nome) setNome(prof.nome);
        if (prof.avatar_url) setAvatar(prof.avatar_url);
      } catch { /* tabela ainda não existe */ }
    })();
    return () => { active = false; };
  }, []);

  // Fechar ao clicar fora
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite re-selecionar o mesmo ficheiro
    if (!file || !userId) return;
    if (!file.type.startsWith("image/")) { notify("Escolhe um ficheiro de imagem.", "error"); return; }
    setUploading(true);
    try {
      const dataUrl = await fileToAvatar(file);
      // Mostra já e guarda localmente — funciona mesmo sem a tabela profiles.
      setAvatar(dataUrl);
      try { localStorage.setItem(`leveza.avatar.${userId}`, dataUrl); } catch { /* storage cheio */ }
      // Tenta persistir no perfil; se a tabela ainda não existir, ignora (não bloqueia).
      try {
        await Promise.race([
          supabase.from("profiles").update({ avatar_url: dataUrl }).eq("id", userId),
          new Promise((r) => setTimeout(r, 2500)),
        ]);
      } catch { /* tabela ainda não existe */ }
      notify("Foto de perfil atualizada", "success");
      setOpen(false);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Não foi possível processar a imagem.", "error");
    } finally {
      setUploading(false);
    }
  }

  async function logout() {
    // signOut local (sem rede) — evita pendurar; com timeout por garantia.
    try {
      await Promise.race([
        supabase.auth.signOut({ scope: "local" }),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
    } catch { /* ignora */ }
    // Garante a limpeza da sessão guardada.
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("sb-"))
        .forEach((k) => localStorage.removeItem(k));
    } catch { /* ignora */ }
    resetMasterDocSync();
    // Reload completo para /auth — garante estado limpo (sem sessão).
    window.location.href = "/auth";
  }

  const inicial = (nome || email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="relative" ref={wrapRef}>
      <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full overflow-hidden border border-ink/15 flex items-center justify-center bg-terracotta/10 text-terracotta hover:ring-2 hover:ring-terracotta/30 transition-shadow"
        aria-label="Conta"
      >
        {avatar ? (
          <img src={avatar} alt="Perfil" className="w-full h-full object-cover" />
        ) : inicial !== "?" ? (
          <span className="text-sm font-semibold">{inicial}</span>
        ) : (
          <User size={16} />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-[var(--color-border)] rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] p-2 z-50">
          <div className="px-3 py-2.5 border-b border-[var(--color-border)] mb-1">
            <p className="text-sm font-medium text-ink truncate">{nome || "Conta"}</p>
            {email && <p className="text-xs text-ink/50 truncate">{email}</p>}
          </div>

          {/* Só para admin E apenas na vista de admin — na pré-visualização como
              aluno o perfil fica igual ao de um aluno (sem vistas nem link admin). */}
          {isAdmin && adminView === "admin" && (
            <div className="px-1.5 pb-2 mb-1 border-b border-[var(--color-border)]">
              <p className="text-[10px] tracking-[0.14em] uppercase text-ink/40 px-1.5 pt-1 pb-1.5">Pré-visualizar como</p>
              <div className="flex gap-1 p-1 rounded-xl bg-cream-warm/60 border border-[var(--color-border)]">
                <button
                  onClick={() => setView("aluno")}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-colors ${adminView === "aluno" ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink"}`}
                >
                  <Eye size={13} /> Aluno
                </button>
                <button
                  onClick={() => setView("admin")}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-colors ${adminView === "admin" ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink"}`}
                >
                  <Eye size={13} /> Admin
                </button>
              </div>
              <button
                onClick={() => { setOpen(false); window.location.assign("/admin"); }}
                className="w-full flex items-center gap-3 mt-1.5 px-3 py-2.5 rounded-lg text-sm font-medium text-terracotta hover:bg-terracotta/5 transition-colors"
              >
                <Shield size={16} strokeWidth={1.75} />
                Ir para admin
              </button>
            </div>
          )}

          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink/80 hover:bg-ink/5 transition-colors disabled:opacity-50"
          >
            <Camera size={16} strokeWidth={1.75} />
            {uploading ? "A guardar foto…" : "Alterar foto de perfil"}
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink/80 hover:bg-ink/5 transition-colors"
          >
            <LogOut size={16} strokeWidth={1.75} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

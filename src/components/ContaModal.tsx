// Modal "A minha conta" — aberto a partir do "Olá, você" em A minha jornada.
// Permite alterar: foto, handle(s) do Instagram (obrigatório) e password.
// Se a pessoa tiver 2 perfis, pede um handle para cada perfil.

import { useEffect, useRef, useState } from "react";
import { X, Camera, Instagram, Lock, Check, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useConta, setConta, normalizarHandle } from "@/lib/conta";
import { usePerfis } from "@/lib/perfis";
import { supabase } from "@/integrations/supabase/client";

export default function ContaModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const conta = useConta();
  const perfis = usePerfis();
  const fileRef = useRef<HTMLInputElement>(null);

  const [foto, setFoto] = useState("");
  const [handles, setHandles] = useState<string[]>([""]);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");
  const [aGuardar, setAGuardar] = useState(false);

  // Sempre que abre, carrega os valores atuais.
  useEffect(() => {
    if (!open) return;
    setFoto(conta.foto || "");
    const base = [...(conta.handles || [])];
    while (base.length < perfis.count) base.push("");
    setHandles(base.slice(0, Math.max(1, perfis.count)));
    setPass("");
    setPass2("");
    setErro("");
    setOk("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const escolherFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 3 * 1024 * 1024) {
      setErro("A foto é muito grande (máx. 3 MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setFoto(String(reader.result || ""));
    reader.readAsDataURL(f);
  };

  const guardar = async () => {
    setErro("");
    setOk("");

    // Handle obrigatório em todos os perfis existentes.
    const normalizados = handles.map(normalizarHandle);
    for (let i = 0; i < perfis.count; i++) {
      if (!normalizados[i]) {
        setErro(
          perfis.count > 1
            ? `Falta o handle do Instagram do perfil "${perfis.nomes[i]}".`
            : "O handle do Instagram é obrigatório.",
        );
        return;
      }
    }

    // Password (opcional): só valida se a pessoa escreveu algo.
    if (pass || pass2) {
      if (pass.length < 6) {
        setErro("A nova password tem de ter pelo menos 6 caracteres.");
        return;
      }
      if (pass !== pass2) {
        setErro("As passwords não coincidem.");
        return;
      }
    }

    setAGuardar(true);
    try {
      // Guarda foto + handles localmente.
      setConta({ foto, handles: normalizados });

      // Password via Supabase (se preenchida).
      if (pass) {
        const { error } = await supabase.auth.updateUser({ password: pass });
        if (error) {
          setAGuardar(false);
          setErro("Foto e handle guardados, mas a password não pôde ser alterada: " + error.message);
          return;
        }
      }

      setAGuardar(false);
      setOk("Alterações guardadas!");
      setTimeout(() => onClose(), 900);
    } catch (e) {
      setAGuardar(false);
      setErro("Ocorreu um erro ao guardar. Tenta novamente.");
    }
  };

  const inicial = (perfis.nomeAtivo || "?").trim().charAt(0).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 py-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="font-serif text-lg text-ink">A minha conta</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-ink/40 hover:text-ink hover:bg-ink/5 flex items-center justify-center"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Foto */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[var(--color-border)] bg-cream flex items-center justify-center shrink-0">
              {foto ? (
                <img src={foto} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-2xl text-terracotta">{inicial}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-[var(--color-border)] text-ink/70 hover:border-terracotta hover:text-ink transition-colors"
              >
                <Camera size={13} /> Alterar foto
              </button>
              {foto && (
                <button
                  onClick={() => setFoto("")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full text-ink/50 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={13} /> Remover
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={escolherFoto} className="hidden" />
            </div>
          </div>

          {/* Handle(s) do Instagram */}
          <div className="space-y-3">
            {handles.slice(0, Math.max(1, perfis.count)).map((h, i) => (
              <div key={i}>
                <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5 block">
                  <Instagram size={12} className="inline mr-1 -mt-0.5 text-terracotta" />
                  Handle do Instagram
                  {perfis.count > 1 && <span className="text-ink/45 normal-case"> — {perfis.nomes[i]}</span>}
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  value={h}
                  onChange={(e) => {
                    const copia = [...handles];
                    copia[i] = e.target.value;
                    setHandles(copia);
                  }}
                  placeholder="@oteuhandle"
                  className="w-full rounded-xl border border-[var(--color-border)] p-2.5 text-sm outline-none focus:border-terracotta"
                />
              </div>
            ))}
            <p className="text-[11px] text-ink/45">
              O handle é obrigatório — é por ele que analisamos o teu perfil.
            </p>
          </div>

          {/* Password */}
          <div className="border-t border-[var(--color-border)] pt-4 space-y-3">
            <p className="text-xs tracking-[0.1em] uppercase text-muted flex items-center gap-1.5">
              <Lock size={12} className="text-terracotta" /> Alterar password (opcional)
            </p>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Nova password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-[var(--color-border)] p-2.5 text-sm outline-none focus:border-terracotta"
            />
            <input
              type="password"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              placeholder="Confirmar nova password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-[var(--color-border)] p-2.5 text-sm outline-none focus:border-terracotta"
            />
          </div>

          {/* Mensagens */}
          {erro && (
            <p className="flex items-start gap-2 text-[13px] text-red-600 bg-red-50 rounded-xl px-3 py-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" /> {erro}
            </p>
          )}
          {ok && (
            <p className="flex items-center gap-2 text-[13px] text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2">
              <Check size={14} /> {ok}
            </p>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-end gap-2 border-t border-[var(--color-border)] px-5 py-4">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-full text-ink/60 hover:text-ink transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={aGuardar}
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full bg-ink text-cream disabled:opacity-50"
          >
            {aGuardar ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

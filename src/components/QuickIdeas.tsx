import { useEffect, useRef, useState } from "react";
import { Lightbulb, X, Plus } from "lucide-react";
import { notify } from "@/lib/toast";

const KEY = "leveza.ideias-rapidas.v1";
type Ideia = { texto: string; ts: number };

function ler(): Ideia[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export default function QuickIdeas() {
  const [open, setOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [ideias, setIdeias] = useState<Ideia[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIdeias(ler());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function guardar() {
    const t = texto.trim();
    if (!t) return;
    const nova = [{ texto: t, ts: Date.now() }, ...ideias].slice(0, 50);
    setIdeias(nova);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(nova));
    } catch { /* ignora */ }
    setTexto("");
    notify("Ideia guardada ✓", "success");
  }

  return (
    <div ref={wrapRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[300px] max-w-[calc(100vw-3rem)] bg-white border border-[var(--color-border)] rounded-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
            <p className="text-sm font-semibold text-ink flex items-center gap-2">
              <Lightbulb size={15} className="text-amber-500" /> Ideias rápidas
            </p>
            <button onClick={() => setOpen(false)} aria-label="Fechar" className="w-7 h-7 rounded-full hover:bg-ink/5 flex items-center justify-center text-ink/50">
              <X size={14} />
            </button>
          </div>
          <div className="p-4">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) guardar(); }}
              placeholder="Anote uma ideia, sacada ou pensamento…"
              rows={3}
              className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-cream text-sm text-ink resize-none"
            />
            <button
              onClick={guardar}
              disabled={!texto.trim()}
              className="mt-2 w-full h-10 rounded-full bg-amber-500 text-white text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 hover:bg-amber-600 transition-colors"
            >
              <Plus size={15} /> Guardar ideia
            </button>

            {ideias.length > 0 && (
              <div className="mt-4 max-h-[200px] overflow-y-auto space-y-2">
                {ideias.map((i) => (
                  <p key={i.ts} className="text-xs text-ink/70 bg-cream rounded-lg px-3 py-2 leading-relaxed">
                    {i.texto}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 h-12 pl-4 pr-5 rounded-full bg-amber-500 text-white shadow-[0_12px_30px_-10px_rgba(217,119,6,0.7)] hover:bg-amber-600 active:scale-[0.97] transition-all"
        aria-label="Escreva as suas ideias"
      >
        <Lightbulb size={18} />
        <span className="hidden sm:inline text-sm font-semibold">Escreva as suas ideias</span>
      </button>
    </div>
  );
}

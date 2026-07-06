import { useEffect, useState } from "react";
import { Lightbulb, Trash2 } from "lucide-react";
import { HYDRATED_EVENT } from "@/lib/master-doc-sync";

// Mostra, organizadas, as ideias que a aluna vai guardando no botão flutuante
// "Escreva as suas ideias" (QuickIdeas). Mesma chave de localStorage.
const KEY = "leveza.ideias-rapidas.v1";
export const IDEIAS_EVENT = "leveza:ideias-changed";
type Ideia = { texto: string; ts: number };

function ler(): Ideia[] {
  if (typeof window === "undefined") return [];
  try {
    const arr = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function dataLabel(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export default function IdeiasGuardadas() {
  const [ideias, setIdeias] = useState<Ideia[]>([]);

  useEffect(() => {
    const load = () => setIdeias(ler());
    load();
    window.addEventListener(IDEIAS_EVENT, load);
    window.addEventListener(HYDRATED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(IDEIAS_EVENT, load);
      window.removeEventListener(HYDRATED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  function apagar(ts: number) {
    const nova = ideias.filter((i) => i.ts !== ts);
    setIdeias(nova);
    try { window.localStorage.setItem(KEY, JSON.stringify(nova)); } catch { /* ignora */ }
    window.dispatchEvent(new Event(IDEIAS_EVENT));
  }

  return (
    <section className="mt-10 mb-10">
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <h2 className="font-display text-lg text-ink flex items-center gap-2">
            <Lightbulb size={17} className="text-amber-500" /> As suas ideias
          </h2>
          <p className="text-xs text-ink/55">Tudo o que vai guardando no botão <b>“Escreva as suas ideias”</b>, reunido aqui.</p>
        </div>
        {ideias.length > 0 && <span className="text-xs text-ink/45 shrink-0">{ideias.length} ideia(s)</span>}
      </div>

      {ideias.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-cream-warm/30 p-10 text-center">
          <Lightbulb size={24} className="mx-auto text-amber-500 mb-3" />
          <p className="text-sm text-ink">Ainda não guardou ideias.</p>
          <p className="text-xs text-ink/55 mt-1">
            Use o botão <b>“Escreva as suas ideias”</b> (canto inferior direito) em qualquer página — elas aparecem aqui.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ideias.map((i) => (
            <li key={i.ts} className="group rounded-2xl border border-[var(--color-border)] bg-white p-4 flex flex-col">
              <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap flex-1">{i.texto}</p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--color-border)]">
                <span className="text-[11px] text-ink/40">{dataLabel(i.ts)}</span>
                <button
                  onClick={() => apagar(i.ts)}
                  className="text-ink/30 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Apagar ideia"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

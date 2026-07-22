import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, CornerDownLeft } from "lucide-react";
import { useNavigate } from "@/lib/router-compat";
import { procurar, type ItemBusca } from "@/lib/busca";
import { useBloqueios } from "@/lib/bloqueios";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";

// Pesquisa global: ícone no topo → sobreposição com barra e resultados ao vivo.
// A lista sai do registo da ESTRUTURA, por isso está sempre atualizada.

/** Abre a pesquisa a partir de fora (ex.: a lupa da barra inferior). */
export const EVENTO_ABRIR_BUSCA = "leveza:busca-abrir";
export function abrirBusca() {
  window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_BUSCA));
}

export default function BuscaGlobal() {
  const [aberto, setAberto] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const navegar = useNavigate();
  const { isBloqueado, modoBloqueio } = useBloqueios();
  const bloqueadoParaAlunos = useBloqueadoParaAlunos();

  // Esconde o que a aluna não pode mesmo ver; "Em breve" fica visível (com etiqueta).
  const podeVer = (item: ItemBusca) => {
    if (!bloqueadoParaAlunos) return true;
    if (!isBloqueado(item.id)) return true;
    return modoBloqueio(item.id) !== "oculto";
  };

  const resultados = useMemo(() => procurar(q).filter(podeVer), [q, bloqueadoParaAlunos]);

  useEffect(() => setSel(0), [q]);

  useEffect(() => {
    if (aberto) setTimeout(() => input.current?.focus(), 40);
    else { setQ(""); setSel(0); }
  }, [aberto]);

  // Atalhos: ⌘K / Ctrl+K abre; Esc fecha.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setAberto((v) => !v); }
      if (e.key === "Escape") setAberto(false);
    };
    // A lupa da barra inferior (telemóvel/tablet) abre por evento — a barra vive
    // no Layout e não tem forma de tocar neste estado.
    const onAbrir = () => setAberto(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(EVENTO_ABRIR_BUSCA, onAbrir);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(EVENTO_ABRIR_BUSCA, onAbrir);
    };
  }, []);

  const abrirItem = (item: ItemBusca) => { setAberto(false); navegar(item.to); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, resultados.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && resultados[sel]) { e.preventDefault(); abrirItem(resultados[sel]); }
  };

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        title="Pesquisar na plataforma"
        aria-label="Pesquisar na plataforma"
        className="inline-flex items-center gap-1.5 text-[13px] pl-3 pr-3.5 py-2 border border-ink/20 text-ink/70 rounded-full font-medium hover:bg-ink/5 hover:text-ink transition-all"
      >
        <Search size={14} strokeWidth={2} />
        <span className="hidden lg:inline">Pesquisar</span>
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-[2px] flex items-start justify-center px-4 pt-[12vh]"
          onClick={() => setAberto(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl border border-border shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search size={17} className="text-ink/40 shrink-0" />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="O que procuras? ex: carrosséis, tom de voz, bio…"
                className="flex-1 py-4 text-[15px] outline-none bg-transparent text-ink placeholder:text-ink/35"
              />
              <button onClick={() => setAberto(false)} aria-label="Fechar" className="p-1 text-ink/40 hover:text-ink">
                <X size={17} />
              </button>
            </div>

            {q.trim().length >= 2 && (
              <div className="max-h-[52vh] overflow-y-auto py-1.5">
                {resultados.length === 0 && (
                  <p className="px-5 py-7 text-center text-sm text-ink/50">
                    Nada encontrado para “{q}”. Tenta outra palavra — por exemplo <strong>reels</strong>, <strong>bio</strong> ou <strong>produto</strong>.
                  </p>
                )}
                {resultados.map((item, i) => {
                  const emBreve = bloqueadoParaAlunos && isBloqueado(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => abrirItem(item)}
                      onMouseEnter={() => setSel(i)}
                      className={`w-full text-left px-5 py-2.5 flex items-center gap-3 transition-colors ${i === sel ? "bg-terracotta/[0.07]" : ""}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink truncate">
                          {item.label}
                          {emBreve && (
                            <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-wider text-terracotta/80 border border-terracotta/25 rounded-full px-1.5 py-0.5">
                              Em breve
                            </span>
                          )}
                        </p>
                        {item.caminho && <p className="text-[11.5px] text-ink/45 truncate">{item.caminho}</p>}
                      </div>
                      {i === sel && <CornerDownLeft size={14} className="text-ink/30 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {q.trim().length < 2 && (
              <p className="px-5 py-6 text-center text-[13px] text-ink/45">
                Escreve para procurares em toda a plataforma.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

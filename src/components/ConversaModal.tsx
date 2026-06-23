import { useState } from "react";
import { Leaf, X, Loader2, Check, Sparkles, AlertCircle } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { extractTarefas, PERGUNTAS_GUIA } from "@/lib/detetive.functions";
import type { Categoria, Tarefa } from "@/lib/detetive-storage";

type Extracted = {
  nome: string;
  qtd: string;
  unidade: "h" | "min";
  freq: "dia" | "semana" | "mes";
  categoria: "Produção" | "Marketing" | "Estratégia";
};

export default function ConversaModal({
  open,
  onClose,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (categorias: Categoria[]) => void;
}) {
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [extraido, setExtraido] = useState<{ tarefas: Extracted[]; resumo: string } | null>(null);
  const [selecionadas, setSelecionadas] = useState<Set<number>>(new Set());
  const extract = useServerFn(extractTarefas);

  if (!open) return null;

  const analisar = async () => {
    setErro(null);
    setLoading(true);
    try {
      const r = await extract({ data: { text: texto } });
      setExtraido(r as { tarefas: Extracted[]; resumo: string });
      setSelecionadas(new Set(r.tarefas.map((_, i) => i)));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao analisar.");
    } finally {
      setLoading(false);
    }
  };

  const aplicar = () => {
    if (!extraido) return;
    const escolhidas = extraido.tarefas.filter((_, i) => selecionadas.has(i));
    const grupos: Record<string, Tarefa[]> = { Produção: [], Marketing: [], Estratégia: [] };
    escolhidas.forEach((t) => {
      grupos[t.categoria].push({ nome: t.nome, qtd: t.qtd, unidade: t.unidade, freq: t.freq });
    });
    onApply([
      { titulo: "Produção", desc: "Tarefas que você faz pra entregar pro cliente", tarefas: grupos["Produção"] },
      { titulo: "Marketing", desc: "Tarefas pra vender e atrair clientes", tarefas: grupos["Marketing"] },
      { titulo: "Estratégia", desc: "Pensar em crescer sem se matar", tarefas: grupos["Estratégia"] },
    ]);
    resetar();
    onClose();
  };

  const resetar = () => {
    setTexto("");
    setExtraido(null);
    setErro(null);
    setSelecionadas(new Set());
  };

  const corPorCat: Record<string, string> = {
    "Produção": "bg-terracotta/10 text-terracotta",
    "Marketing": "bg-ink/10 text-ink",
    "Estratégia": "bg-success/15 text-success",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-cream rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Leaf size={18} className="text-terracotta" />
            <h2 className="font-serif text-xl text-ink">Conversa comigo</h2>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink p-1 rounded-full hover:bg-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!extraido ? (
            <>
              <p className="text-sm text-muted">
                Conta-me sobre a tua rotina — em texto livre, como se estivesses a falar com um amigo.
                A IA vai extrair as tarefas e propor uma lista para tu aprovares.
              </p>
              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-xs tracking-[0.18em] uppercase text-muted mb-2">Inspira-te com estas perguntas</p>
                <ul className="space-y-1.5">
                  {PERGUNTAS_GUIA.map((q, i) => (
                    <li key={i} className="text-sm text-ink flex gap-2">
                      <span className="text-terracotta">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Ex: De manhã abro o computador e fico 2 horas a responder emails. Depois faço uma reunião de 1h com clientes. À tarde gravo conteúdo para o Instagram, demora umas 3h. Uma vez por semana faço propostas comerciais..."
                rows={8}
                className="w-full rounded-xl border border-border bg-white p-3 text-sm outline-none focus:border-terracotta resize-none"
              />
              {erro && (
                <div className="flex items-start gap-2 text-sm text-terracotta">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <p>{erro}</p>
                </div>
              )}
              <p className="text-[11px] text-muted">
                {texto.length}/8000 caracteres · A IA não inventa — só extrai o que disseres.
              </p>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-terracotta bg-white p-4">
                <div className="flex items-start gap-2">
                  <Sparkles size={16} className="text-terracotta flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-ink leading-relaxed">{extraido.resumo}</p>
                </div>
              </div>
              <p className="text-xs tracking-[0.18em] uppercase text-muted">
                {selecionadas.size} de {extraido.tarefas.length} tarefas selecionadas
              </p>
              <div className="space-y-2">
                {extraido.tarefas.map((t, i) => {
                  const ativo = selecionadas.has(i);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const next = new Set(selecionadas);
                        ativo ? next.delete(i) : next.add(i);
                        setSelecionadas(next);
                      }}
                      className={`w-full text-left rounded-xl border p-3 flex items-center gap-3 transition-colors ${
                        ativo ? "border-terracotta bg-white" : "border-border bg-white/50 opacity-60"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                          ativo ? "bg-terracotta border-terracotta text-cream" : "border-border"
                        }`}
                      >
                        {ativo && <Check size={12} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink font-semibold leading-tight">{t.nome}</p>
                        <p className="text-xs text-muted">
                          {t.qtd} {t.unidade} · {t.freq === "mes" ? "/ mês" : `/ ${t.freq}`}
                        </p>
                      </div>
                      <span className={`text-[10px] tracking-[0.12em] uppercase px-2 py-1 rounded-full ${corPorCat[t.categoria]}`}>
                        {t.categoria}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button onClick={resetar} className="text-xs text-muted underline">
                Recomeçar conversa
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 p-4 border-t border-border bg-white">
          <p className="text-[11px] text-muted">
            {extraido ? "As tarefas substituem as atuais." : "Powered by Gemini · grátis no Lovable"}
          </p>
          {!extraido ? (
            <button
              onClick={analisar}
              disabled={loading || texto.trim().length < 10}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold disabled:opacity-40"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {loading ? "A analisar…" : "Analisar com IA"}
            </button>
          ) : (
            <button
              onClick={aplicar}
              disabled={selecionadas.size === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold disabled:opacity-40"
            >
              <Check size={14} /> Aplicar {selecionadas.size} {selecionadas.size === 1 ? "tarefa" : "tarefas"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

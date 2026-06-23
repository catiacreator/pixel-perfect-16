import { useState, useRef, useEffect } from "react";
import { Sparkles, Loader2, RotateCcw, Send, X, Bot } from "lucide-react";
import { usePilar2 } from "@/lib/pilar2-hooks";

const ENDPOINT = "https://mekzmmliixsxgtnbfgiy.supabase.co/functions/v1/construir-metodo";

type ChatMsg = { role: "user" | "assistant"; content: string };

function readDoc() {
  try {
    return JSON.parse(window.localStorage.getItem("leveza.doc-mestre.v1") || "{}");
  } catch {
    return {};
  }
}

export default function MetodoChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, update } = usePilar2();
  const [messages, setMessages] = useState<ChatMsg[]>(state.metodoChat);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      // mensagem inicial automática
      void enviar("Vamos começar.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  const enviar = async (textoForcado?: string) => {
    const text = (textoForcado ?? input).trim();
    if (!text) return;
    setErro(null);
    const novas: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(novas);
    setInput("");
    setLoading(true);

    const doc = readDoc();
    const payload = {
      messages: novas,
      nome: doc.nome || "",
      profissao: doc.profissao || "",
      o_que_faz: doc.oQueFaz || "",
      como_resolve: doc.comoResolve || "",
      publico: doc.publico || "",
      dores_publico: (state.doresTop5.length ? state.doresTop5 : doc.dores || [])
        .filter(Boolean)
        .join("\n"),
      desejos_publico: (doc.desejos || []).filter(Boolean).join("\n"),
      dores_array: state.doresTop5.filter(Boolean).length
        ? state.doresTop5.filter(Boolean)
        : (doc.dores || []).filter(Boolean),
      desejos_array: (doc.desejos || []).filter(Boolean),
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply: string =
        typeof data === "string"
          ? data
          : data.reply || data.message || data.content || JSON.stringify(data);
      const final: ChatMsg[] = [...novas, { role: "assistant", content: reply }];
      setMessages(final);
      update({ metodoChat: final });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao falar com a IA.");
    } finally {
      setLoading(false);
    }
  };

  const recomecar = () => {
    setMessages([]);
    setErro(null);
    update({ metodoChat: [] });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-cream rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border bg-white">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-terracotta" />
            <h2 className="font-serif text-lg text-ink">Criar meu método</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={recomecar}
              className="text-xs text-muted hover:text-ink px-2 py-1 rounded-full flex items-center gap-1"
            >
              <RotateCcw size={12} /> Recomeçar
            </button>
            <button onClick={onClose} className="text-muted hover:text-ink p-1 rounded-full">
              <X size={18} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && !loading && (
            <p className="text-sm text-muted">A conversar com a IA…</p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-2xl p-3 text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-ink text-cream ml-8" : "bg-white border border-border mr-8"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Loader2 size={14} className="animate-spin" /> A pensar…
            </div>
          )}
          {erro && (
            <p className="text-xs text-terracotta bg-white border border-terracotta rounded-xl p-2">{erro}</p>
          )}
        </div>

        <div className="p-3 border-t border-border bg-white flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void enviar();
              }
            }}
            placeholder="Escreve a tua resposta…"
            rows={2}
            className="flex-1 rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta resize-none"
          />
          <button
            onClick={() => void enviar()}
            disabled={loading || !input.trim()}
            className="rounded-full bg-terracotta text-cream px-4 disabled:opacity-40 flex items-center gap-1 text-sm font-semibold"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-[10px] text-muted px-3 pb-2">
          <Sparkles size={9} className="inline mb-0.5 mr-1" />
          Powered by edge function construir-metodo
        </p>
      </div>
    </div>
  );
}

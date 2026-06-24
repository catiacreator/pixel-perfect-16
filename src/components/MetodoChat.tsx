import { useState, useRef, useEffect } from "react";
import { Wand2, Loader2, RotateCcw, Send, Mic } from "lucide-react";
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

function buildInitialMessage(nome: string, dores: string[]) {
  const d = dores.filter(Boolean);
  const saudacao = nome ? `${nome}, encontrei` : "Encontrei";
  return `${saudacao} ${d.length} dores no seu Documento Mestre:\n\n${d.map((dor, i) => `${i + 1}. ${dor}`).join("\n")}\n\nEssas representam bem o que seu público enfrenta hoje? Tem alguma que você mudaria ou acrescentaria?`;
}

export default function MetodoChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, update } = usePilar2();
  const [messages, setMessages] = useState<ChatMsg[]>(state.metodoChat);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Gera mensagem inicial localmente com as dores (sem chamar API)
  useEffect(() => {
    if (open && messages.length === 0) {
      const doc = readDoc();
      const nome = doc.nome || "";
      const dores = state.doresTop5.filter(Boolean).length
        ? state.doresTop5
        : (doc.dores || []);
      const inicial: ChatMsg = { role: "assistant", content: buildInitialMessage(nome, dores) };
      const novas = [inicial];
      setMessages(novas);
      update({ metodoChat: novas });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const enviar = async () => {
    const text = input.trim();
    if (!text || loading) return;
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
      dores_publico: (state.doresTop5.filter(Boolean).length ? state.doresTop5 : doc.dores || [])
        .filter(Boolean).join("\n"),
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
    // Rebuild initial message
    const doc = readDoc();
    const nome = doc.nome || "";
    const dores = state.doresTop5.filter(Boolean).length
      ? state.doresTop5
      : (doc.dores || []);
    const inicial: ChatMsg = { role: "assistant", content: buildInitialMessage(nome, dores) };
    setMessages([inicial]);
    update({ metodoChat: [inicial] });
  };

  if (!open) return null;

  const userMsgs = messages.filter((m) => m.role === "user").length;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Wand2 size={15} className="text-terracotta" />
          Construindo seu método
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink/45">{userMsgs} {userMsgs === 1 ? "resposta" : "respostas"}</span>
          <button
            onClick={recomecar}
            className="text-xs text-ink/50 hover:text-ink flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={11} /> Recomeçar
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 text-sm whitespace-pre-wrap leading-relaxed ${
              m.role === "user"
                ? "bg-ink text-cream ml-10 self-end"
                : "bg-cream-warm/60 border border-[var(--color-border)] text-ink mr-4"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-ink/50 p-2">
            <Loader2 size={14} className="animate-spin text-terracotta" /> A pensar…
          </div>
        )}
        {erro && (
          <p className="text-xs text-terracotta bg-terracotta/5 border border-terracotta/30 rounded-xl p-3">{erro}</p>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[var(--color-border)] bg-white">
        <div className="flex items-end gap-2 px-4 py-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void enviar();
              }
            }}
            placeholder="Escreva sua resposta... (Enter para enviar) ou use o microfone"
            rows={1}
            className="flex-1 resize-none outline-none text-sm text-ink placeholder:text-ink/35 bg-transparent py-1"
          />
          <button className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-ink/50 hover:text-ink transition-colors shrink-0">
            <Mic size={15} />
          </button>
          <button
            onClick={() => void enviar()}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-terracotta text-cream flex items-center justify-center disabled:opacity-40 hover:bg-terracotta/90 transition-colors shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-[10px] text-ink/35 px-4 pb-2.5 flex items-center justify-between">
          <span>Enter envia · Shift+Enter quebra linha</span>
          <button onClick={onClose} className="hover:text-ink transition-colors">Fechar</button>
        </p>
      </div>
    </div>
  );
}

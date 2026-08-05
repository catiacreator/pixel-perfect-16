import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Sparkles, X, Trash2 } from "lucide-react";
import Markdown from "@/components/Markdown";
import MicButton from "@/components/MicButton";
import { supabase } from "@/integrations/supabase/client";
import { usePilar2 } from "@/lib/pilar2-hooks";
import { perfilContexto, readDocMestre, type DocMestre } from "@/lib/pilar4-prompts";

// Agente lateral: uma janela de conversa (drawer) à direita, disponível em toda
// a plataforma. Conhece o aluno (Documento Mestre + Método via perfilContexto) e
// usa o mesmo motor do Assistente (/api/chat, IA grátis do Lovable). Partilha a
// mesma sessão/histórico da página "Assistente".

const SESSION_KEY = "leveza.assistant.session";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function textOf(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("").trim();
}

const SUGESTOES = [
  "Qual é o meu próximo passo?",
  "Por onde começo?",
  "O que devo publicar esta semana?",
  "Ajuda-me a decidir o melhor caminho.",
];

export default function AgenteChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-6 z-50 bottom-[calc(1.5rem+64px+56px+env(safe-area-inset-bottom))] lg:bottom-[5.75rem] inline-flex items-center gap-2 h-12 pl-3.5 pr-5 rounded-full bg-forest text-cream shadow-[0_12px_30px_-10px_rgba(20,60,40,0.7)] hover:opacity-95 active:scale-[0.97] transition-all"
          aria-label="Abrir o teu guia"
        >
          <span className="w-7 h-7 rounded-full bg-cream/20 flex items-center justify-center"><Bot size={16} /></span>
          <span className="hidden sm:inline text-sm font-semibold">O teu guia</span>
        </button>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-[55] bg-black/25 backdrop-blur-[1px]" onClick={() => setOpen(false)} aria-hidden />
          <Painel onClose={() => setOpen(false)} />
        </>
      )}
    </>
  );
}

function Painel({ onClose }: { onClose: () => void }) {
  const [sessionId, setSessionId] = useState("");
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = getSessionId();
    setSessionId(id);
    (async () => {
      try {
        const { data } = await supabase
          .from("assistant_messages")
          .select("id, role, content, created_at")
          .eq("session_id", id)
          .order("created_at", { ascending: true });
        if (data && data.length) {
          setInitialMessages(
            data.map((row) => ({
              id: row.id,
              role: row.role as "user" | "assistant",
              parts: [{ type: "text", text: row.content }],
            })),
          );
        }
      } catch {
        /* sem histórico — começa vazio */
      }
      setReady(true);
    })();
  }, []);

  return (
    <div className="fixed inset-y-0 right-0 z-[60] w-full sm:w-[420px] bg-cream border-l border-[var(--color-border)] shadow-[-24px_0_60px_-30px_rgba(0,0,0,0.5)] flex flex-col">
      {/* Cabeçalho */}
      <div
        className="relative text-white px-5 py-4 flex items-center gap-3 shrink-0"
        style={{ background: "radial-gradient(130% 130% at 85% 14%, #F0A766 0%, #C8487E 52%, #2E7CB8 100%)" }}
      >
        <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Bot size={20} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] tracking-[0.24em] uppercase text-white/80 font-medium">O teu guia</p>
          <p className="font-serif text-lg leading-tight">Liv.IA</p>
        </div>
        <button onClick={onClose} aria-label="Fechar" className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors">
          <X size={18} />
        </button>
      </div>

      {ready ? (
        <ChatInner key={sessionId} sessionId={sessionId} initialMessages={initialMessages} onClear={() => {
          const novo = crypto.randomUUID();
          window.localStorage.setItem(SESSION_KEY, novo);
          setSessionId(novo);
          setInitialMessages([]);
        }} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-ink/50">A preparar…</div>
      )}
    </div>
  );
}

function ChatInner({
  sessionId,
  initialMessages,
  onClear,
}: {
  sessionId: string;
  initialMessages: UIMessage[];
  onClear: () => void;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Contexto do aluno (Documento Mestre + Método) — enviado em cada mensagem.
  const { state: metodo } = usePilar2();
  const [doc, setDoc] = useState<DocMestre>({});
  useEffect(() => {
    setDoc(readDocMestre());
    const onChange = () => setDoc(readDocMestre());
    window.addEventListener("leveza:hydrated", onChange);
    return () => window.removeEventListener("leveza:hydrated", onChange);
  }, []);
  const userContextRef = useRef("");
  userContextRef.current = perfilContexto(doc, metodo);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: { messages, userContext: userContextRef.current },
        }),
      }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: sessionId,
    messages: initialMessages,
    transport,
    onFinish: async ({ message }) => {
      const text = textOf(message);
      if (text) {
        try {
          await supabase.from("assistant_messages").insert({ session_id: sessionId, role: "assistant", content: text });
        } catch { /* ignora */ }
      }
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => { if (!isLoading) inputRef.current?.focus(); }, [isLoading]);

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    try {
      await supabase.from("assistant_messages").insert({ session_id: sessionId, role: "user", content: trimmed });
    } catch { /* ignora */ }
    sendMessage({ text: trimmed });
  }

  const empty = messages.length === 0;

  return (
    <>
      {/* Conversa */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {empty && (
          <div className="m-auto text-center max-w-[280px]">
            <div className="w-12 h-12 mx-auto rounded-full bg-gold/15 text-gold flex items-center justify-center mb-3">
              <Sparkles size={20} strokeWidth={1.5} />
            </div>
            <p className="font-serif text-lg text-ink mb-1.5">Olá! Conta comigo.</p>
            <p className="text-[13px] text-ink/55 mb-5">
              Conheço o teu Documento Mestre e o teu método. Pergunta-me qual é o melhor caminho.
            </p>
            <div className="flex flex-col gap-2 text-left">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="text-[13px] text-ink/75 hover:text-ink border border-[var(--color-border)] hover:border-ink/30 rounded-xl px-3.5 py-2.5 transition-colors bg-white/70"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const text = textOf(m);
          if (!text && m.role !== "assistant") return null;
          if (m.role === "user") {
            return (
              <div key={m.id} className="self-end max-w-[88%]">
                <div className="bg-forest text-cream rounded-2xl rounded-br-md px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap">{text}</div>
              </div>
            );
          }
          return (
            <div key={m.id} className="self-start max-w-[92%] flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5"><Bot size={14} /></div>
              <div className="text-ink text-[14px] leading-relaxed pt-0.5 min-w-0">
                {text ? <Markdown text={text} /> : <span className="text-ink/40 italic">a pensar…</span>}
              </div>
            </div>
          );
        })}

        {status === "submitted" && (
          <div className="self-start flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0"><Bot size={14} /></div>
            <div className="flex items-center gap-1.5 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ink/30 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-ink/30 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-ink/30 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}

        {error && (
          <div className="self-start text-[13px] text-terracotta bg-terracotta/10 rounded-xl px-3 py-2">
            Ocorreu um erro. Tenta novamente daqui a pouco.
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-[var(--color-border)] p-3 bg-cream">
        {!empty && (
          <button onClick={onClear} className="text-[11px] text-ink/45 hover:text-terracotta inline-flex items-center gap-1 mb-2">
            <Trash2 size={12} /> Nova conversa
          </button>
        )}
        <form
          onSubmit={(e) => { e.preventDefault(); submit(input); }}
          className="flex items-end gap-2 bg-white border border-[var(--color-border)] rounded-3xl p-1.5 pl-3.5 focus-within:border-ink/30 transition-colors"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }}
            rows={1}
            placeholder="Escreve a tua pergunta…"
            className="flex-1 resize-none bg-transparent outline-none text-[14px] text-ink placeholder:text-ink/35 py-1.5 max-h-32"
            disabled={isLoading}
          />
          <MicButton disabled={isLoading} onText={(t) => setInput(input.trim() ? `${input.trim()} ${t}` : t)} />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-9 h-9 rounded-full bg-forest text-cream flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shrink-0"
            aria-label="Enviar"
          >
            <Send size={14} strokeWidth={2} />
          </button>
        </form>
      </div>
    </>
  );
}

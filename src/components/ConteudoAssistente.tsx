import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Sparkles, Trash2 } from "lucide-react";
import Markdown from "@/components/Markdown";
import MicButton from "@/components/MicButton";
import { supabase } from "@/integrations/supabase/client";
import { usePilar2 } from "@/lib/pilar2-hooks";
import { perfilContexto, readDocMestre, type DocMestre } from "@/lib/pilar4-prompts";

// Agente de conteúdo reutilizável do módulo "Criar para o Instagram".
// Cada instância usa uma sessão + um "mode" (system prompt) próprios.
export type AgenteConfig = {
  mode: string;
  sessionKey: string;
  kicker: string;
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyText: string;
  placeholder: string;
  sugestoes: string[];
};

// Configuração por defeito — assistente Cat.IA (método de conteúdo/copy).
const CAT_IA: AgenteConfig = {
  mode: "conteudo",
  sessionKey: "leveza.assistant-conteudo.session",
  kicker: "Assistente de conteúdo",
  title: "Cat.IA",
  subtitle: "Ganchos, legendas, roteiros de Reels, carrosséis e stories que vendem — na sua voz.",
  emptyTitle: "O que vamos criar hoje?",
  emptyText: "Diga o tema ou o formato e eu escrevo já na sua voz, com o método Cat.IA.",
  placeholder: "Peça um gancho, legenda, roteiro, carrossel ou story…",
  sugestoes: [
    "Cria um gancho viral para um Reel sobre a minha dor principal",
    "Escreve uma legenda PAS para vender o meu serviço",
    "Roteiro de Reels de 30s para atrair o meu público",
    "Sequência de 5 stories de venda para o meu Direct",
  ],
};

function getSessionId(key: string): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(key, id);
  }
  return id;
}

function textOf(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("").trim();
}

export default function ConteudoAssistente({ config }: { config?: AgenteConfig } = {}) {
  const cfg = config ?? CAT_IA;
  const [sessionId, setSessionId] = useState(() => getSessionId(cfg.sessionKey));
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [histKey, setHistKey] = useState(0);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Carrega o histórico em segundo plano — nunca bloqueia o render do chat.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from("assistant_messages")
          .select("id, role, content, created_at")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: true });
        if (!cancelled && data && data.length) {
          setInitialMessages(
            data.map((row) => ({
              id: row.id,
              role: row.role as "user" | "assistant",
              parts: [{ type: "text", text: row.content }],
            })),
          );
          setHistKey((k) => k + 1); // remonta o chat com o histórico
        }
      } catch {
        /* sem histórico — segue com conversa vazia */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <Chat
      key={`${sessionId}:${histKey}`}
      cfg={cfg}
      sessionId={sessionId}
      initialMessages={initialMessages}
      input={input}
      setInput={setInput}
      scrollRef={scrollRef}
      inputRef={inputRef}
      onClear={() => {
        const newId = crypto.randomUUID();
        window.localStorage.setItem(cfg.sessionKey, newId);
        setInitialMessages([]);
        setSessionId(newId);
      }}
    />
  );
}

function Chat({
  cfg,
  sessionId,
  initialMessages,
  input,
  setInput,
  scrollRef,
  inputRef,
  onClear,
}: {
  cfg: AgenteConfig;
  sessionId: string;
  initialMessages: UIMessage[];
  input: string;
  setInput: (v: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onClear: () => void;
}) {
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
          body: { messages, userContext: userContextRef.current, mode: cfg.mode },
        }),
      }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: sessionId,
    messages: initialMessages,
    transport,
    onFinish: ({ message }) => {
      const text = textOf(message);
      if (text) {
        // Grava em segundo plano — não bloqueia a UI.
        void supabase
          .from("assistant_messages")
          .insert({ session_id: sessionId, role: "assistant", content: text });
      }
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status, scrollRef]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading, inputRef]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    sendMessage({ text: trimmed });
    // Grava em segundo plano — o envio à IA nunca fica dependente da escrita.
    void supabase
      .from("assistant_messages")
      .insert({ session_id: sessionId, role: "user", content: trimmed });
  }

  const empty = messages.length === 0;

  return (
    <div>
      {/* Cabeçalho do assistente */}
      <header
        className="relative overflow-hidden rounded-[24px] text-white mb-5"
        style={{ background: "radial-gradient(130% 130% at 85% 14%, #F0A766 0%, #C8487E 55%, #7A1E52 100%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "22px 22px" }}
        />
        <div className="relative flex items-center justify-between gap-4 px-6 py-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Sparkles size={22} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.26em] uppercase text-white/80 font-medium">{cfg.kicker}</p>
              <h2 className="font-editorial text-2xl md:text-3xl leading-tight tracking-[-0.01em]">{cfg.title}</h2>
              <p className="text-sm text-white/85 mt-1 max-w-md leading-relaxed">
                {cfg.subtitle}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={onClear}
              className="text-[12px] text-white/90 hover:text-white inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/15 transition-colors shrink-0 backdrop-blur-sm"
              aria-label="Nova conversa"
            >
              <Trash2 size={13} /> Nova conversa
            </button>
          )}
        </div>
      </header>

      {/* Conversa */}
      <div
        ref={scrollRef}
        className="rounded-3xl border border-[var(--color-border)] bg-white/70 backdrop-blur-sm min-h-[42vh] max-h-[58vh] overflow-y-auto p-5 md:p-6 flex flex-col gap-5"
      >
        {empty && (
          <div className="m-auto text-center max-w-md">
            <div className="w-14 h-14 mx-auto rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center mb-4">
              <Sparkles size={22} strokeWidth={1.5} />
            </div>
            <p className="font-serif text-xl text-ink mb-2">{cfg.emptyTitle}</p>
            <p className="text-sm text-ink/55 mb-6">
              {cfg.emptyText}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {cfg.sugestoes.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="text-[13px] text-ink/75 hover:text-ink border border-[var(--color-border)] hover:border-terracotta/40 rounded-2xl px-4 py-3 transition-colors bg-cream-warm/40"
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
              <div key={m.id} className="self-end max-w-[85%]">
                <div className="bg-terracotta text-cream rounded-2xl rounded-br-md px-4 py-3 text-[14.5px] leading-relaxed whitespace-pre-wrap">
                  {text}
                </div>
              </div>
            );
          }
          return (
            <div key={m.id} className="self-start max-w-[92%] flex gap-3">
              <div className="w-8 h-8 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0 mt-1">
                <Bot size={15} strokeWidth={1.75} />
              </div>
              <div className="text-ink text-[14.5px] leading-relaxed pt-0.5">
                {text ? <Markdown text={text} /> : <span className="text-ink/40 italic">a pensar…</span>}
              </div>
            </div>
          );
        })}

        {status === "submitted" && (
          <div className="self-start flex gap-3">
            <div className="w-8 h-8 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0">
              <Bot size={15} strokeWidth={1.75} />
            </div>
            <div className="flex items-center gap-1.5 pt-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-ink/30 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-ink/30 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-ink/30 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}

        {error && (
          <div className="self-start text-sm text-terracotta bg-terracotta/10 rounded-xl px-3 py-2">
            Ocorreu um erro. Tente novamente daqui a pouco.
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="mt-4 flex items-end gap-2 bg-white border border-[var(--color-border)] rounded-3xl p-2 pl-4 focus-within:border-terracotta/40 transition-colors"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(input);
            }
          }}
          rows={1}
          placeholder={cfg.placeholder}
          className="flex-1 resize-none bg-transparent outline-none text-[14.5px] text-ink placeholder:text-ink/35 py-2 max-h-40"
          disabled={isLoading}
        />
        <MicButton
          disabled={isLoading}
          onText={(t) => setInput(input.trim() ? `${input.trim()} ${t}` : t)}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 rounded-full bg-terracotta text-cream flex items-center justify-center hover:bg-terracotta-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          aria-label="Enviar"
        >
          <Send size={15} strokeWidth={2} />
        </button>
      </form>
      <p className="text-[11px] text-ink/35 mt-3 text-center">
        O assistente pode cometer erros. Verifique informação importante.
      </p>
    </div>
  );
}

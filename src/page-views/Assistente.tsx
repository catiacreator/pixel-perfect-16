import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Sparkles, Trash2 } from "lucide-react";
import Layout from "@/components/Layout";
import Markdown from "@/components/Markdown";
import { supabase } from "@/integrations/supabase/client";
import { usePilar2 } from "@/lib/pilar2-hooks";
import { perfilContexto, readDocMestre, type DocMestre } from "@/lib/pilar4-prompts";

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

const SUGESTOES = [
  "Dá-me 5 ideias de posts para Instagram esta semana",
  "Como começo o Pilar 1?",
  "Ajuda-me a estruturar um workshop de IA para empresas",
  "Escreve uma legenda leve para apresentar o meu método",
];

export default function Assistente() {
  const [sessionId, setSessionId] = useState("");
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const id = getSessionId();
    setSessionId(id);
    (async () => {
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
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <Layout>
        <div className="px-5 md:px-10 py-20 max-w-3xl mx-auto text-center text-ink/50 text-sm">
          A preparar o assistente…
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ChatWindow
        key={sessionId}
        sessionId={sessionId}
        initialMessages={initialMessages}
        input={input}
        setInput={setInput}
        scrollRef={scrollRef}
        inputRef={inputRef}
        onClear={async () => {
          const newId = crypto.randomUUID();
          window.localStorage.setItem(SESSION_KEY, newId);
          setSessionId(newId);
          setInitialMessages([]);
        }}
      />
    </Layout>
  );
}

function ChatWindow({
  sessionId,
  initialMessages,
  input,
  setInput,
  scrollRef,
  inputRef,
  onClear,
}: {
  sessionId: string;
  initialMessages: UIMessage[];
  input: string;
  setInput: (v: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onClear: () => void;
}) {
  // Contexto do utilizador (Documento Mestre + Método) — enviado a cada mensagem
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
        await supabase.from("assistant_messages").insert({
          session_id: sessionId,
          role: "assistant",
          content: text,
        });
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

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    await supabase.from("assistant_messages").insert({
      session_id: sessionId,
      role: "user",
      content: trimmed,
    });
    sendMessage({ text: trimmed });
  }

  const empty = messages.length === 0;

  return (
    <div className="px-5 md:px-10 py-8 max-w-5xl mx-auto">
      {/* Cabeçalho — faixa colorida com o robot */}
      <header
        className="relative overflow-hidden rounded-[28px] md:rounded-[32px] text-white mb-6"
        style={{ background: "radial-gradient(130% 130% at 85% 14%, #F0A766 0%, #C8487E 52%, #2E7CB8 100%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "24px 24px" }}
        />
        <div className="relative flex items-center justify-between gap-4 px-6 md:px-9 py-7 md:py-8">
          <div className="flex items-center gap-4 md:gap-5 min-w-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shrink-0 overflow-hidden">
              <img src="/robot.png" alt="Assistente Leveza" className="w-[88%] h-[88%] object-contain drop-shadow" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.28em] uppercase text-white/80 font-medium">Assistente</p>
              <h1 className="font-editorial text-2xl md:text-4xl text-white leading-tight tracking-[-0.01em]">Leveza no Digital</h1>
              <p className="text-sm text-white/85 mt-1.5 max-w-md leading-relaxed">
                Pergunta o que quiser sobre o método, conteúdo, vendas e IA.
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
        className="rounded-3xl border border-[var(--color-border)] bg-white/60 backdrop-blur-sm min-h-[55vh] max-h-[65vh] overflow-y-auto p-5 md:p-7 flex flex-col gap-5"
      >
        {empty && (
          <div className="m-auto text-center max-w-md">
            <div className="w-14 h-14 mx-auto rounded-full bg-gold/15 text-gold flex items-center justify-center mb-4">
              <Sparkles size={22} strokeWidth={1.5} />
            </div>
            <p className="font-serif text-xl text-ink mb-2">Olá. Por onde quer começar?</p>
            <p className="text-sm text-ink/55 mb-6">
              Posso ajudar-te com ideias de conteúdo, estruturar ofertas, dúvidas do método ou usar IA no dia a dia.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="text-[13px] text-ink/75 hover:text-ink border border-[var(--color-border)] hover:border-ink/30 rounded-2xl px-4 py-3 transition-colors bg-cream-warm/40"
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
                <div className="bg-forest text-cream rounded-2xl rounded-br-md px-4 py-3 text-[14.5px] leading-relaxed whitespace-pre-wrap">
                  {text}
                </div>
              </div>
            );
          }
          return (
            <div key={m.id} className="self-start max-w-[92%] flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-1">
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
            <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
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
            Ocorreu um erro. Tenta novamente daqui a pouco.
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="mt-4 flex items-end gap-2 bg-white border border-[var(--color-border)] rounded-3xl p-2 pl-4 focus-within:border-ink/30 transition-colors"
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
          placeholder="Escreve a sua pergunta…"
          className="flex-1 resize-none bg-transparent outline-none text-[14.5px] text-ink placeholder:text-ink/35 py-2 max-h-40"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 rounded-full bg-forest text-cream flex items-center justify-center hover:bg-forest/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          aria-label="Enviar"
        >
          <Send size={15} strokeWidth={2} />
        </button>
      </form>
      <p className="text-[11px] text-ink/35 mt-3 text-center">
        O assistente pode cometer erros. Verifica informação importante.
      </p>
    </div>
  );
}

function textOf(m: UIMessage): string {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}

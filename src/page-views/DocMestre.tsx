import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../components/Layout";
import {
  FileUp,
  ClipboardPaste,
  Plus,
  X,
  Sparkles,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Eye,
  Save,
  FileText,
  GripVertical,
  RotateCcw,
  Copy,
  Check,
  Loader2,
  Wand2,
  Play,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { extractDocMestre } from "@/lib/doc-mestre.functions";
import { usePilar2 } from "@/lib/pilar2-hooks";
import { HYDRATED_EVENT } from "@/lib/master-doc-sync";

// ------------------------------------------------------------------
// Tipos + estado
// ------------------------------------------------------------------

type Produto = { nome: string; descricao: string; ticketMedio: string };

type DocState = {
  nome: string;
  profissao: string;
  tempoAtuacao: string;
  localizacao: string;
  oQueFaz: string;
  comoResolve: string;
  publico: string;
  dores: string[];
  desejos: string[];
  produtos: Produto[];
  horasDia: string;
  diasSemana: string;
  faturamentoMensal: string;
  tomDeVoz: string;
};

const EMPTY: DocState = {
  nome: "",
  profissao: "",
  tempoAtuacao: "",
  localizacao: "",
  oQueFaz: "",
  comoResolve: "",
  publico: "",
  dores: ["", "", "", "", ""],
  desejos: ["", "", "", "", ""],
  produtos: [],
  horasDia: "",
  diasSemana: "",
  faturamentoMensal: "",
  tomDeVoz: "",
};

const STORAGE_KEY = "leveza.doc-mestre.v1";

// Sugestões mostradas como placeholder em cada caixa (uma por posição)
const DORES_PLACEHOLDER = [
  "Eu não sei usar Inteligência Artificial para criar conteúdo.",
  "Eu não sei o básico do Instagram para começar.",
  "Eu não sei por onde começar meu calendário de posts.",
  "Eu travo na hora de transformar ideias em conteúdo.",
  "Eu não consigo ganhar seguidores no Instagram.",
];

const DESEJOS_PLACEHOLDER = [
  "Quero dominar ferramentas de Inteligência Artificial de forma simples.",
  "Quero crescer seguidores qualificados de forma consistente.",
  "Quero gerar leads a partir do meu conteúdo.",
  "Quero ter um fluxo de criação rápido e sustentável.",
  "Quero vender mais com conteúdo que posiciona minha marca.",
];

function loadInitial(): DocState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DocState>;
    return {
      ...EMPTY,
      ...parsed,
      dores: padArray((parsed.dores ?? []).slice(0, 5), 5),
      desejos: padArray((parsed.desejos ?? []).slice(0, 5), 5),
      produtos: Array.isArray(parsed.produtos) ? parsed.produtos : [],
    };
  } catch {
    return EMPTY;
  }
}

function padArray(arr: string[], n: number): string[] {
  const out = [...arr];
  while (out.length < n) out.push("");
  return out;
}

function mergeExtracted(prev: DocState, extracted: Partial<DocState>): DocState {
  return {
    nome: extracted.nome || prev.nome,
    profissao: extracted.profissao || prev.profissao,
    tempoAtuacao: extracted.tempoAtuacao || prev.tempoAtuacao,
    localizacao: extracted.localizacao || prev.localizacao,
    oQueFaz: extracted.oQueFaz || prev.oQueFaz,
    comoResolve: extracted.comoResolve || prev.comoResolve,
    publico: extracted.publico || prev.publico,
    dores:
      extracted.dores && extracted.dores.length
        ? padArray(extracted.dores.slice(0, 5), 5)
        : prev.dores,
    desejos:
      extracted.desejos && extracted.desejos.length
        ? padArray(extracted.desejos.slice(0, 5), 5)
        : prev.desejos,
    produtos:
      extracted.produtos && extracted.produtos.length ? extracted.produtos : prev.produtos,
    horasDia: extracted.horasDia || prev.horasDia,
    diasSemana: extracted.diasSemana || prev.diasSemana,
    faturamentoMensal: extracted.faturamentoMensal || prev.faturamentoMensal,
    tomDeVoz: extracted.tomDeVoz || prev.tomDeVoz,
  };
}

// ------------------------------------------------------------------
// Pequenos componentes
// ------------------------------------------------------------------

function Field({
  label,
  placeholder,
  textarea,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  textarea?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5 block">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-white p-3 text-sm outline-none focus:border-terracotta"
        />
      ) : (
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-white p-3 text-sm outline-none focus:border-terracotta"
        />
      )}
    </div>
  );
}

function SortableList({
  titulo,
  subtitulo,
  dragHint,
  itens,
  placeholders,
  onChange,
}: {
  titulo: string;
  subtitulo: React.ReactNode;
  dragHint: string;
  itens: string[];
  placeholders: string[];
  onChange: (n: string[]) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const set = (i: number, v: string) => {
    const next = [...itens];
    next[i] = v;
    onChange(next);
  };

  const drop = (target: number) => {
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...itens];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(target, 0, moved);
    onChange(next);
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="mb-5">
      <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1 block">{titulo}</label>
      <p className="text-xs text-muted mb-1">{subtitulo}</p>
      <p className="text-xs text-muted/80 mb-3 inline-flex items-center gap-1.5">
        Arraste pelo
        <GripVertical size={13} className="text-muted/60" />
        {dragHint}
      </p>
      <div className="space-y-3">
        {itens.map((it, i) => (
          <div
            key={i}
            onDragOver={(e) => {
              e.preventDefault();
              if (overIndex !== i) setOverIndex(i);
            }}
            onDrop={() => drop(i)}
            className={`flex items-stretch gap-3 rounded-xl transition-colors ${
              overIndex === i && dragIndex !== null && dragIndex !== i
                ? "ring-2 ring-terracotta/40"
                : ""
            } ${dragIndex === i ? "opacity-40" : ""}`}
          >
            <div
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              className="flex items-center gap-2 cursor-grab active:cursor-grabbing select-none px-1"
              aria-label="Arraste para reordenar"
            >
              <GripVertical size={16} className="text-muted/50" />
              <span className="w-7 h-7 shrink-0 rounded-full bg-gold/25 text-ink/70 text-xs font-semibold flex items-center justify-center">
                {i + 1}
              </span>
            </div>
            <textarea
              value={it}
              onChange={(e) => set(i, e.target.value)}
              placeholder={placeholders[i] ?? ""}
              rows={2}
              className="flex-1 rounded-xl border border-border bg-white p-3 text-sm outline-none focus:border-terracotta resize-none shadow-[0_1px_2px_rgba(45,42,38,0.04)] placeholder:text-muted/50"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Prompt "Refinar com IA"
// ------------------------------------------------------------------

function buildRefinePrompt(d: DocState) {
  const lines = (arr: string[]) =>
    arr.filter(Boolean).map((s, i) => `${i + 1}. ${s}`).join("\n") || "(vazio)";
  const produtos =
    d.produtos.length === 0
      ? "(nenhum)"
      : d.produtos
          .map(
            (p) =>
              `- ${p.nome || "(sem nome)"}${p.descricao ? " — " + p.descricao : ""}${
                p.ticketMedio ? " (ticket: " + p.ticketMedio + ")" : ""
              }`,
          )
          .join("\n");

  return `Você é um especialista em posicionamento para experts e mentores digitais.
Revise e refine os dados abaixo do meu Documento Mestre, tornando cada resposta mais clara, específica e persuasiva. Mantenha minha voz real e não invente informações novas — apenas melhore o que já existe.

DOCUMENTO MESTRE ATUAL:

NOME: ${d.nome || "(vazio)"}
PROFISSÃO: ${d.profissao || "(vazio)"}
TEMPO DE ATUAÇÃO: ${d.tempoAtuacao || "(vazio)"}
LOCALIZAÇÃO: ${d.localizacao || "(vazio)"}
O QUE EU FAÇO: ${d.oQueFaz || "(vazio)"}
COMO RESOLVO: ${d.comoResolve || "(vazio)"}
PÚBLICO: ${d.publico || "(vazio)"}

DORES DO PÚBLICO:
${lines(d.dores)}

DESEJOS DO PÚBLICO:
${lines(d.desejos)}

PRODUTOS/SERVIÇOS ATUAIS:
${produtos}

ROTINA: ${d.horasDia || "(vazio)"} horas/dia · ${d.diasSemana || "(vazio)"} dias/semana
FATURAMENTO MENSAL: ${d.faturamentoMensal || "(vazio)"}
TOM DE COMUNICAÇÃO: ${d.tomDeVoz || "(vazio)"}

---

Retorne exatamente neste formato — mantenha os rótulos em MAIÚSCULAS seguidos de ":" para eu conseguir importar de volta:

NOME:
PROFISSÃO:
TEMPO DE ATUAÇÃO:
LOCALIZAÇÃO:
O QUE EU FAÇO:
COMO RESOLVO:
PÚBLICO:
DORES DO PÚBLICO: (uma por linha, numeradas de 1 a 5)
DESEJOS DO PÚBLICO: (um por linha, numerados de 1 a 5)
PRODUTOS/SERVIÇOS: (um por linha)
TOM DE COMUNICAÇÃO:`;
}

// ------------------------------------------------------------------
// Página principal
// ------------------------------------------------------------------

export default function DocMestre() {
  const router = useRouter();
  const { state: metodo } = usePilar2();
  const [doc, setDoc] = useState<DocState>(() => loadInitial());
  const [savedAt, setSavedAt] = useState<string>("");
  const firstSave = useRef(true);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/metodo/pilar-1" });
    }
  };

  // autosave
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }
    const t = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
      const d = new Date();
      setSavedAt(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
      );
    }, 400);
    return () => clearTimeout(t);
  }, [doc]);

  // Recarrega quando o estado é hidratado do Supabase (login / outro dispositivo)
  useEffect(() => {
    const onHydrated = () => {
      firstSave.current = true; // não re-grava logo após hidratar
      setDoc(loadInitial());
    };
    window.addEventListener(HYDRATED_EVENT, onHydrated);
    return () => window.removeEventListener(HYDRATED_EVENT, onHydrated);
  }, []);

  const set = <K extends keyof DocState>(k: K, v: DocState[K]) =>
    setDoc((p) => ({ ...p, [k]: v }));

  const resetAll = () => {
    if (!confirm("Apagar todos os campos do Documento Mestre?")) return;
    setDoc(EMPTY);
  };

  const printPDF = () => {
    if (typeof window !== "undefined") window.print();
  };

  // Produtos
  const addProduto = () =>
    set("produtos", [...doc.produtos, { nome: "", descricao: "", ticketMedio: "" }]);
  const updProduto = (i: number, patch: Partial<Produto>) => {
    const next = [...doc.produtos];
    next[i] = { ...next[i], ...patch };
    set("produtos", next);
  };
  const delProduto = (i: number) => set("produtos", doc.produtos.filter((_, idx) => idx !== i));

  // Importação por texto / ficheiro
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const extract = useServerFn(extractDocMestre);

  const runImport = async (text: string) => {
    setImporting(true);
    setImportError(null);
    try {
      const result = await extract({ data: { text } });
      setDoc((prev) => mergeExtracted(prev, result));
      setImportOpen(false);
      setImportText("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao interpretar o texto.";
      setImportError(msg);
    } finally {
      setImporting(false);
    }
  };

  const onFileUpload = async (file: File | null) => {
    if (!file) return;
    if (file.size > 8_000_000) {
      setImportError("Ficheiro demasiado grande. Máximo 8 MB.");
      setImportOpen(true);
      return;
    }
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    try {
      let text: string;
      if (isPdf) {
        const { getDocumentProxy, extractText } = await import("unpdf");
        const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
        const res = await extractText(pdf, { mergePages: true });
        text = Array.isArray(res.text) ? res.text.join("\n") : res.text;
      } else {
        text = await file.text();
      }
      if (!text.trim()) {
        setImportError(
          "Não consegui ler texto desse ficheiro. Se for um PDF digitalizado (imagem), cola o texto manualmente.",
        );
        setImportOpen(true);
        return;
      }
      setImportText(text);
      setImportOpen(true);
    } catch {
      setImportError("Erro ao ler o ficheiro. Tenta colar o texto manualmente.");
      setImportOpen(true);
    }
  };

  // Refinar com IA (2 passos)
  const [refineOpen, setRefineOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refineResult, setRefineResult] = useState("");
  const prompt = useMemo(() => buildRefinePrompt(doc), [doc]);

  // Secção 4 — dados do método (vêm do O Teu Método, Pilar 2).
  // As dores herdam do Documento Mestre quando o par ainda não foi editado.
  const paresMetodo = metodo.pares
    .map((par, i) => ({ ...par, dor: par.dor || doc.dores[i] || "" }))
    .filter((par) => par.dor.trim() || par.vitoria.trim());
  const metodoPreenchido = !!(
    metodo.nomeMetodo ||
    metodo.promessa ||
    metodo.pilares ||
    metodo.posicionamento ||
    paresMetodo.some((par) => par.vitoria.trim())
  );

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-5xl mx-auto print:max-w-none print:py-0">
        {/* Cabeçalho */}
        <div className="print:hidden mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors mb-5"
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          <div className="rounded-3xl border border-border bg-gradient-to-br from-cream-warm to-cream p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Ícone */}
              <div className="shrink-0 w-14 h-14 rounded-2xl border border-terracotta/30 bg-cream flex items-center justify-center text-terracotta">
                <FileText size={24} strokeWidth={1.75} />
              </div>

              {/* Texto */}
              <div className="flex-1 min-w-0">
                <p className="text-xs tracking-[0.25em] uppercase text-terracotta mb-2">
                  Seu mapa pessoal
                </p>
                <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight mb-3">
                  Documento Mestre
                </h1>
                <p className="text-muted max-w-xl">
                  Preenche o documento para aos poucos teres mais clareza do teu projecto. A cada
                  passo vais compreendendo melhor como ter mais liberdade, tempo e lucro.
                </p>
              </div>

              {/* Ações */}
              <div className="flex flex-col items-stretch lg:items-end gap-2 shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={resetAll}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-2xl border border-border bg-white text-ink hover:border-terracotta transition-colors"
                  >
                    <RotateCcw size={15} /> Zerar tudo
                  </button>
                  <button
                    onClick={printPDF}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-2xl bg-gradient-to-br from-terracotta to-terracotta-dark text-cream hover:opacity-95 transition-opacity"
                  >
                    <Eye size={15} /> Visualizar PDF
                  </button>
                </div>
                <span className="self-end inline-flex items-center gap-1.5 text-xs text-ink/60 px-3 py-1.5 rounded-full border border-border bg-white">
                  <Save size={12} /> {savedAt ? `Salvo às ${savedAt}` : "Autosave activo"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vídeo */}
        <div className="print:hidden mb-6 rounded-2xl overflow-hidden border border-border bg-ink/90 aspect-video flex items-center justify-center text-cream">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-cream/15 flex items-center justify-center mx-auto mb-2">
              <Play size={20} className="ml-0.5" />
            </div>
            <p className="text-sm opacity-80">Vídeo de explicação (3 min)</p>
          </div>
        </div>

        {/* Import card */}
        <div className="print:hidden rounded-2xl border border-border bg-gradient-to-br from-cream-warm to-white p-4 mb-8">
          <div className="flex items-start gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm font-semibold text-ink">
                Já tens um documento sobre ti? Importa.
              </p>
              <p className="text-xs text-muted mt-0.5">
                A IA lê e preenche os campos automaticamente.
              </p>
            </div>
            <label className="text-sm px-3 py-1.5 rounded-full border border-border bg-white flex items-center gap-1.5 cursor-pointer hover:border-terracotta">
              <FileUp size={14} /> Subir TXT/MD/PDF
              <input
                type="file"
                accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf"
                className="hidden"
                onChange={(e) => onFileUpload(e.target.files?.[0] ?? null)}
              />
            </label>
            <button
              onClick={() => setImportOpen(true)}
              className="text-sm px-3 py-1.5 rounded-full border border-border bg-white flex items-center gap-1.5 hover:border-terracotta"
            >
              <ClipboardPaste size={14} /> Colar texto
            </button>
          </div>
        </div>

        {/* SECÇÃO 1 */}
        <section className="rounded-2xl border border-border bg-white p-5 mb-5 print:border-0 print:p-0 print:mb-8">
          <h2 className="font-serif text-xl text-ink mb-4">1. Quem és tu</h2>
          <Field label="Nome" value={doc.nome} onChange={(v) => set("nome", v)} />
          <Field
            label="Profissão / Especialidade"
            value={doc.profissao}
            onChange={(v) => set("profissao", v)}
          />
          <Field
            label="Há quanto tempo atuas"
            value={doc.tempoAtuacao}
            onChange={(v) => set("tempoAtuacao", v)}
          />
        </section>

        {/* SECÇÃO ROTINA */}
        <section className="rounded-2xl border border-border bg-white p-5 mb-5 print:border-0 print:p-0 print:mb-8">
          <h2 className="font-serif text-xl text-ink mb-4">Tua rotina e receita</h2>
          <p className="text-xs text-muted mb-4">Usado pelo Mapa do Tempo e pelos prompts personalizados.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Field label="Horas por dia" value={doc.horasDia} onChange={(v) => set("horasDia", v)} placeholder="ex: 8" />
            <Field label="Dias por semana" value={doc.diasSemana} onChange={(v) => set("diasSemana", v)} placeholder="ex: 5" />
            <Field label="Faturamento mensal (R$)" value={doc.faturamentoMensal} onChange={(v) => set("faturamentoMensal", v)} placeholder="ex: 15000" />
          </div>
          <Field
            label="Tom de comunicação"
            value={doc.tomDeVoz}
            onChange={(v) => set("tomDeVoz", v)}
            textarea
            placeholder="Como falas com o teu público — formal, próximo, técnico, divertido…"
          />
        </section>

        {/* SECÇÃO 2 */}
        <section className="rounded-2xl border border-border bg-white p-5 mb-5 print:border-0 print:p-0 print:mb-8">
          <h2 className="font-serif text-xl text-ink mb-4">2. O que entregas</h2>
          <Field
            label="O que fazes (em 1 frase)"
            value={doc.oQueFaz}
            onChange={(v) => set("oQueFaz", v)}
            textarea
          />
          <Field
            label="Como resolves"
            value={doc.comoResolve}
            onChange={(v) => set("comoResolve", v)}
            textarea
          />

          <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5 block mt-2">
            Produtos / Serviços
          </label>
          {doc.produtos.length === 0 ? (
            <p className="text-sm text-muted mb-2">Nenhum produto ou serviço adicionado ainda.</p>
          ) : (
            <div className="space-y-2 mb-2">
              {doc.produtos.map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-cream-warm/40 p-3 grid gap-2 md:grid-cols-[1.4fr_2fr_1fr_auto] items-start"
                >
                  <input
                    placeholder="Nome"
                    value={p.nome}
                    onChange={(e) => updProduto(i, { nome: e.target.value })}
                    className="rounded-lg border border-border bg-white p-2 text-sm outline-none focus:border-terracotta"
                  />
                  <input
                    placeholder="Descrição"
                    value={p.descricao}
                    onChange={(e) => updProduto(i, { descricao: e.target.value })}
                    className="rounded-lg border border-border bg-white p-2 text-sm outline-none focus:border-terracotta"
                  />
                  <input
                    placeholder="Ticket médio"
                    value={p.ticketMedio}
                    onChange={(e) => updProduto(i, { ticketMedio: e.target.value })}
                    className="rounded-lg border border-border bg-white p-2 text-sm outline-none focus:border-terracotta"
                  />
                  <button
                    onClick={() => delProduto(i)}
                    className="text-muted hover:text-terracotta self-center"
                    aria-label="Remover"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={addProduto}
            className="text-xs flex items-center gap-1 text-terracotta font-semibold"
          >
            <Plus size={13} /> Adicionar produto / serviço
          </button>
        </section>

        {/* SECÇÃO 3 */}
        <section className="rounded-2xl border border-border bg-white p-5 mb-5 print:border-0 print:p-0 print:mb-8">
          <h2 className="font-serif text-xl text-ink mb-4">3. O teu público</h2>
          <Field
            label="Público que atendes"
            value={doc.publico}
            onChange={(v) => set("publico", v)}
            textarea
          />
          <SortableList
            titulo="Dores principais do teu público"
            subtitulo={
              <>
                Escreve as <strong className="font-semibold text-ink/70">5 dores principais</strong> — uma em cada caixinha.
              </>
            }
            dragHint="para reordenar por grau de urgência."
            itens={doc.dores}
            placeholders={DORES_PLACEHOLDER}
            onChange={(v) => set("dores", v)}
          />
          <SortableList
            titulo="Desejos do teu público"
            subtitulo={
              <>
                Escreve os <strong className="font-semibold text-ink/70">5 desejos principais</strong> — um em cada caixinha.
              </>
            }
            dragHint="para reordenar por grau de relevância."
            itens={doc.desejos}
            placeholders={DESEJOS_PLACEHOLDER}
            onChange={(v) => set("desejos", v)}
          />
        </section>

        {/* SECÇÃO 4 — Seu Método (vem do O Teu Método, Pilar 2) */}
        <section className="rounded-2xl border border-border bg-white p-5 md:p-6 mb-8 print:border-0 print:p-0 print:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-gold/25 text-ink/70 text-sm font-semibold flex items-center justify-center shrink-0">
              4
            </span>
            <h2 className="font-serif text-xl text-ink">Seu Método</h2>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap rounded-xl border border-border bg-cream-warm/50 px-4 py-3 mb-6 print:hidden">
            <p className="text-sm text-muted">
              Estes campos vêm do{" "}
              <strong className="font-semibold text-ink/70">O Teu Método</strong> (Pilar 2). Para
              editar, abra a página do método.
            </p>
            <Link
              to="/metodo/pilar-2/metodo"
              className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border border-border bg-white text-ink hover:border-terracotta transition-colors"
            >
              Editar método <ArrowRight size={14} />
            </Link>
          </div>

          {metodoPreenchido ? (
            <div className="space-y-5">
              {metodo.nomeMetodo && (
                <div>
                  <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5">Nome do método</p>
                  <p className="font-serif text-lg text-ink">{metodo.nomeMetodo}</p>
                </div>
              )}
              {metodo.promessa && (
                <div>
                  <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5">Promessa</p>
                  <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">{metodo.promessa}</p>
                </div>
              )}
              {metodo.pilares && (
                <div>
                  <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5">Pilares</p>
                  <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">{metodo.pilares}</p>
                </div>
              )}
              {metodo.posicionamento && (
                <div className="rounded-xl border border-border bg-cream-warm/40 p-4">
                  <p className="text-xs tracking-[0.1em] uppercase text-terracotta mb-1.5">
                    Meu posicionamento
                  </p>
                  <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">
                    {metodo.posicionamento}
                  </p>
                </div>
              )}
              {paresMetodo.length > 0 && (
                <div>
                  <p className="text-xs tracking-[0.1em] uppercase text-muted mb-3">
                    Partida → Chegada (vitória)
                  </p>
                  <div className="space-y-3">
                    {paresMetodo.map((par, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-border overflow-hidden grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]"
                      >
                        <div className="p-4">
                          <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta mb-1.5">
                            Partida · Dor {i + 1}
                          </p>
                          <p className="text-sm text-ink/80">{par.dor}</p>
                        </div>
                        <div className="p-4">
                          <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta mb-1.5">
                            Chegada · Vitória
                          </p>
                          <p className="text-sm text-ink/80">{par.vitoria || "—"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">
              Ainda não preencheste o O Teu Método. Abre a página do método para definir nome,
              promessa, pilares, posicionamento e o mapa Partida → Chegada — depois aparecem aqui
              automaticamente.
            </p>
          )}
        </section>

        {/* Refinar com IA */}
        <div className="print:hidden rounded-2xl border border-border bg-white mb-8 overflow-hidden">
          <button
            onClick={() => setRefineOpen((v) => !v)}
            className="w-full flex items-center gap-2 p-4 text-left hover:bg-cream-warm/40"
          >
            <Sparkles size={16} className="text-terracotta" />
            <span className="font-semibold text-sm">Refinar com IA</span>
            <span className="text-xs text-muted ml-1">— em 2 passos no ChatGPT</span>
            <span className="ml-auto text-xs text-terracotta">{refineOpen ? "Fechar" : "Abrir"}</span>
          </button>

          {refineOpen && (
            <div className="p-4 border-t border-border space-y-5">
              {/* Passo 1 */}
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">
                  Passo 1 — Copia o prompt e cola no ChatGPT
                </p>
                <div className="relative">
                  <pre className="text-xs bg-cream-warm/40 border border-border rounded-xl p-3 max-h-64 overflow-auto whitespace-pre-wrap font-sans">
                    {prompt}
                  </pre>
                  <button
                    onClick={copyPrompt}
                    className="absolute top-2 right-2 text-xs px-3 py-1.5 rounded-full bg-ink text-cream flex items-center gap-1.5"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copiado" : "Copiar prompt"}
                  </button>
                </div>
              </div>

              {/* Passo 2 */}
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">
                  Passo 2 — Cola aqui a resposta do ChatGPT
                </p>
                <textarea
                  rows={6}
                  value={refineResult}
                  onChange={(e) => setRefineResult(e.target.value)}
                  placeholder="Cola o texto retornado pelo ChatGPT…"
                  className="w-full rounded-xl border border-border bg-white p-3 text-sm outline-none focus:border-terracotta"
                />
                <button
                  disabled={!refineResult.trim() || importing}
                  onClick={() => runImport(refineResult)}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-cream text-sm font-semibold disabled:opacity-50"
                >
                  {importing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  Preencher campos automaticamente
                </button>
                {importError && (
                  <p className="text-xs text-terracotta mt-2">{importError}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="print:hidden rounded-2xl border border-terracotta bg-gradient-to-br from-white to-cream-warm/60 p-6 text-center">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próxima fase</p>
          <p className="font-serif text-xl md:text-2xl text-ink mb-4">
            Agora aprende a usar Inteligência Artificial
          </p>
          <Link
            to="/metodo/pilar-1/aprenda-ia"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors"
          >
            Domina as principais IAs para o teu negócio <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Modal import */}
      {importOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardPaste size={16} className="text-terracotta" />
              <h3 className="font-serif text-lg text-ink">Importar texto</h3>
              <button
                onClick={() => setImportOpen(false)}
                className="ml-auto text-muted hover:text-terracotta"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-muted mb-3">
              Cola texto livre (bio, apresentação, anotações). A IA interpreta e distribui pelos campos.
            </p>
            <textarea
              rows={10}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Cola aqui o texto…"
              className="w-full rounded-xl border border-border bg-white p-3 text-sm outline-none focus:border-terracotta"
            />
            {importError && <p className="text-xs text-terracotta mt-2">{importError}</p>}
            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setImportOpen(false)}
                className="text-sm px-4 py-2 rounded-full border border-border"
              >
                Cancelar
              </button>
              <button
                disabled={!importText.trim() || importing}
                onClick={() => runImport(importText)}
                className="text-sm px-4 py-2 rounded-full bg-ink text-cream inline-flex items-center gap-2 disabled:opacity-50"
              >
                {importing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                Interpretar e preencher
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

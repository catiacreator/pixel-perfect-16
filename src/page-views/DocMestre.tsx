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
  Printer,
  RotateCcw,
  Copy,
  Check,
  Loader2,
  Wand2,
  Play,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useServerFn } from "@tanstack/react-start";
import { extractDocMestre } from "@/lib/doc-mestre.functions";

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

function loadInitial(): DocState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DocState>;
    return {
      ...EMPTY,
      ...parsed,
      dores: padArray(parsed.dores ?? [], 5),
      desejos: padArray(parsed.desejos ?? [], 5),
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
  ajuda,
  itens,
  onChange,
}: {
  titulo: string;
  ajuda: string;
  itens: string[];
  onChange: (n: string[]) => void;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= itens.length) return;
    const next = [...itens];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const set = (i: number, v: string) => {
    const next = [...itens];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(itens.filter((_, idx) => idx !== i));
  const add = () => onChange([...itens, ""]);

  return (
    <div className="mb-4">
      <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1 block">{titulo}</label>
      <p className="text-xs text-muted mb-2">{ajuda}</p>
      <div className="space-y-2">
        {itens.map((it, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <div className="flex flex-col items-center pt-2">
              <span className="text-[10px] font-semibold text-muted">{i + 1}</span>
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  className="text-muted hover:text-terracotta disabled:opacity-30"
                  disabled={i === 0}
                  aria-label="Mover para cima"
                >
                  <ArrowUp size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  className="text-muted hover:text-terracotta disabled:opacity-30"
                  disabled={i === itens.length - 1}
                  aria-label="Mover para baixo"
                >
                  <ArrowDown size={11} />
                </button>
              </div>
            </div>
            <textarea
              value={it}
              onChange={(e) => set(i, e.target.value)}
              rows={1}
              className="flex-1 rounded-xl border border-border bg-white p-2.5 text-sm outline-none focus:border-terracotta resize-none"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-2 text-muted hover:text-terracotta"
              aria-label="Remover"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 text-xs flex items-center gap-1 text-terracotta font-semibold"
      >
        <Plus size={13} /> Adicionar
      </button>
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
  const [doc, setDoc] = useState<DocState>(() => loadInitial());
  const [savedAt, setSavedAt] = useState<string>("");
  const firstSave = useRef(true);

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
    if (file.size > 1_000_000) {
      setImportError("Ficheiro demasiado grande. Máximo 1 MB.");
      setImportOpen(true);
      return;
    }
    const text = await file.text();
    setImportText(text);
    setImportOpen(true);
  };

  // Refinar com IA (2 passos)
  const [refineOpen, setRefineOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refineResult, setRefineResult] = useState("");
  const prompt = useMemo(() => buildRefinePrompt(doc), [doc]);

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
      <div className="px-5 md:px-10 py-10 max-w-3xl mx-auto print:max-w-none print:py-0">
        {/* Cabeçalho */}
        <div className="print:hidden">
          <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-2">Seu mapa pessoal</p>
          <h1 className="font-serif text-3xl md:text-5xl text-ink mb-2 leading-tight">
            Documento Mestre
          </h1>
          <p className="text-muted mb-6 max-w-xl">
            Preenche o documento para teres clareza total do teu projecto. Cada secção alimenta os
            prompts do site — quanto mais detalhe, melhor é a IA contigo.
          </p>
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

        {/* Toolbar */}
        <div className="print:hidden flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-muted mr-auto">
            {savedAt ? `Salvo às ${savedAt}` : "Autosave activo"}
          </span>
          <button
            onClick={resetAll}
            className="text-sm px-3 py-1.5 rounded-full border border-border bg-white flex items-center gap-1.5 hover:border-terracotta"
          >
            <RotateCcw size={13} /> Zerar tudo
          </button>
          <button
            onClick={printPDF}
            className="text-sm px-3 py-1.5 rounded-full border border-border bg-white flex items-center gap-1.5 hover:border-terracotta"
          >
            <Printer size={13} /> Visualizar PDF
          </button>
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
              <FileUp size={14} /> Subir TXT/MD
              <input
                type="file"
                accept=".txt,.md,text/plain,text/markdown"
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
            ajuda="Escreve as 5 dores — ordena por grau de urgência (1 = mais urgente)."
            itens={doc.dores}
            onChange={(v) => set("dores", v)}
          />
          <SortableList
            titulo="Desejos do teu público"
            ajuda="Escreve os 5 desejos — ordena por grau de relevância."
            itens={doc.desejos}
            onChange={(v) => set("desejos", v)}
          />
        </section>

        {/* SECÇÃO 4 */}
        <section className="rounded-2xl border border-dashed border-border bg-cream-warm/30 p-5 mb-8 print:border-0 print:p-0 print:mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl text-ink">4. O teu método</h2>
            <Link
              to="/metodo/pilar-2/metodo"
              className="text-xs font-semibold text-terracotta flex items-center gap-1"
            >
              Editar método <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-sm text-muted">
            Estes campos vêm do Esboço do Método (Pilar 2). Preenche-o primeiro para os veres aqui:
            nome do método, promessa, pilares, posicionamento e mapa Ponto A → Ponto B.
          </p>
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

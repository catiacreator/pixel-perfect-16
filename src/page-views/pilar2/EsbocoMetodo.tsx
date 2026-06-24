import { useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import SaveBar from "../../components/SaveBar";
import MetodoChat from "../../components/MetodoChat";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Hourglass,
  PlayCircle,
  Check,
  Circle,
  Wand2,
  ChevronUp,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { useAulaProgress } from "@/lib/use-aula-progress";
import { usePilar2 } from "@/lib/pilar2-hooks";
import type { ParDorVitoria } from "@/lib/pilar2-storage";

const INTENSIDADES: Array<{ id: ParDorVitoria["intensidade"]; dot: string }> = [
  { id: "Alta", dot: "bg-rose-500" },
  { id: "Moderada", dot: "bg-amber-500" },
  { id: "Baixa", dot: "bg-emerald-500" },
];

const AULA_TOOL = "pilar-2";
const AULA_ID = "definindo-metodo";

function readDoc() {
  try {
    return JSON.parse(window.localStorage.getItem("leveza.doc-mestre.v1") || "{}");
  } catch {
    return {};
  }
}

function buildRefinePrompt(
  doc: Record<string, unknown>,
  pares: ParDorVitoria[],
) {
  const nome = doc.nome || "";
  const profissao = doc.profissao || "";
  const oQueFaz = doc.oQueFaz || "";
  const comoResolve = doc.comoResolve || "";
  const publico = doc.publico || "";

  const paresTexto = pares
    .filter((p) => p.dor.trim() || p.vitoria.trim())
    .map(
      (p, i) =>
        `${i + 1}. Dor: ${p.dor || "—"}\n   Vitória: ${p.vitoria || "—"}`,
    )
    .join("\n\n");

  return `Com base nas informações abaixo, preencha exatamente este formulário — sem introdução, sem explicação, só as respostas:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOME DO MÉTODO: [escreva o nome — curto, memorável, em português]

PROMESSA: [1 frase que começa com verbo, específica, máximo 15 palavras]

PILARES:
1. [Nome do Pilar] — [o que a cliente conquista aqui]
2. [Nome do Pilar] — [o que a cliente conquista aqui]
3. [Nome do Pilar] — [o que a cliente conquista aqui]
(adicione até 5 se necessário)

POSICIONAMENTO: Eu ajudo [público] a [resultado principal], solucionando [dor mais urgente], por meio de [como você entrega].
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTEXTO:
Nome: ${nome}
Profissão: ${profissao}
O que faz: ${oQueFaz}
Como resolve: ${comoResolve}
Público: ${publico}

DORES → VITÓRIAS:
${paresTexto || "Não preenchidas ainda."}`;
}

export default function EsbocoMetodo() {
  const { state, update } = usePilar2();
  const [tab, setTab] = useState<"pares" | "metodo">("pares");
  const [chatOpen, setChatOpen] = useState(false);
  const [verPrompt, setVerPrompt] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const { isDone, toggle } = useAulaProgress();
  const concluida = isDone(AULA_TOOL, AULA_ID);

  const setPar = (i: number, patch: Partial<ParDorVitoria>) =>
    update((prev) => ({
      ...prev,
      pares: prev.pares.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    }));

  const moverPar = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= state.pares.length) return;
    update((prev) => {
      const pares = [...prev.pares];
      [pares[i], pares[j]] = [pares[j], pares[i]];
      return { ...prev, pares };
    });
  };

  const doresFallback = state.doresTop5;
  const pares = state.pares.map((p, i) => ({
    ...p,
    dor: p.dor || doresFallback[i] || "",
  }));
  const vitoriasFeitas = pares.filter((p) => p.vitoria.trim().length > 0).length;

  const doc = typeof window !== "undefined" ? readDoc() : {};
  const promptRefinar = buildRefinePrompt(doc, pares);

  function copiarPrompt() {
    navigator.clipboard?.writeText(promptRefinar);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  }

  return (
    <Layout>
      <PilarBreadcrumb
        pilar={2}
        pilarLabel="Criar Autoridade"
        backTo="/metodo/pilar-2"
        backLabel="Voltar para o Pilar 2"
      />

      {/* Hero */}
      <header className="bg-cream-warm/60 border-b border-[var(--color-border)]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-10 md:py-14 grid grid-cols-[auto_1fr] gap-5 md:gap-8 items-start">
          <div className="flex flex-col items-center gap-3">
            <span className="font-serif text-5xl md:text-6xl text-terracotta leading-none">2</span>
            <div className="w-12 h-12 rounded-2xl border border-[var(--color-border)] bg-white flex items-center justify-center text-ink/70">
              <Hourglass size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-terracotta mb-2">Pilar 2</p>
            <h1 className="font-serif text-3xl md:text-5xl text-ink tracking-tight">
              Definindo Seu Método
            </h1>
            <p className="italic text-ink/60 mt-3 max-w-2xl">
              Da dor à vitória: a IA transforma as dores do público no seu método.
            </p>
            <div className="flex items-center gap-3 mt-5 text-terracotta/70">
              <span className="h-px w-16 bg-terracotta/40" />
              <Sparkles size={12} />
              <span className="h-px w-16 bg-terracotta/40" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-10">
        {/* Vídeo */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-ink/90 to-ink aspect-video flex items-center justify-center mb-5">
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-cream">
            <div>
              <p className="font-semibold text-base md:text-lg">Estruturando seu método com IA 🚀</p>
              <p className="text-xs text-cream/70 mt-1">Ana Tex</p>
            </div>
          </div>
          <button className="w-14 h-14 rounded-full bg-white/95 text-ink flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <PlayCircle size={28} strokeWidth={1.5} />
          </button>
        </div>

        {/* Concluída */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => toggle(AULA_TOOL, AULA_ID)}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
              concluida
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-white text-ink border-border hover:border-terracotta"
            }`}
          >
            {concluida ? <Check size={15} /> : <Circle size={15} />}
            {concluida ? "Aula concluída" : "Marcar como concluída"}
          </button>
        </div>

        {/* PASSO 1 */}
        <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-2">Passo 1</p>
        <h2 className="font-serif text-2xl text-ink mb-2">
          Criar o método com Inteligência Artificial
        </h2>
        <p className="text-sm text-ink/60 mb-4">
          Confirme as dores, defina 1 vitória para cada uma e deixe a IA montar o seu método.
        </p>

        {!chatOpen ? (
          <div className="rounded-2xl border border-dashed border-terracotta/40 bg-white p-5 md:p-6 mb-12">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-terracotta/15 flex items-center justify-center text-terracotta shrink-0">
                <Wand2 size={16} />
              </div>
              <div>
                <p className="font-serif text-lg text-ink">Criar meu método com Inteligência Artificial</p>
                <p className="text-sm text-ink/60 mt-1">
                  A IA vai confirmar as 5 dores do seu público, perguntar qual vitória você entrega
                  para cada uma, e montar seu método com nome, pilares e promessa.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4 ml-13">
              {(state.doresTop5.filter(Boolean).length
                ? state.doresTop5.filter(Boolean)
                : ["Eu não sei usar Inteligência Artificial…"]
              ).map((d, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-cream-warm/60 truncate max-w-[280px]"
                  title={d}
                >
                  {d}
                </span>
              ))}
            </div>
            <button
              onClick={() => setChatOpen(true)}
              className="text-sm font-semibold rounded-full bg-terracotta text-cream px-5 py-2.5 inline-flex items-center gap-2 hover:bg-terracotta/90 transition-colors"
            >
              <Wand2 size={14} /> Criar meu método
            </button>
          </div>
        ) : (
          <div className="mb-12">
            <MetodoChat open={chatOpen} onClose={() => setChatOpen(false)} />
          </div>
        )}

        {/* PASSO 2 */}
        <div className="text-center mb-6">
          <p className="text-[11px] tracking-[0.25em] uppercase text-ink/50">
            Passo 2 — Revisar e Editar
          </p>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab("pares")}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              tab === "pares"
                ? "bg-terracotta text-cream border-terracotta"
                : "bg-white border-border text-ink"
            }`}
          >
            Ponto A → Vitória
          </button>
          <button
            onClick={() => setTab("metodo")}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              tab === "metodo"
                ? "bg-terracotta text-cream border-terracotta"
                : "bg-white border-border text-ink"
            }`}
          >
            Meu Método
          </button>
        </div>

        {tab === "pares" ? (
          <>
            <div className="rounded-2xl border border-border bg-white p-5 md:p-6 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-terracotta" />
                <p className="font-serif text-lg text-ink">Revisão: Ponto A → Vitória</p>
              </div>
              <p className="text-sm text-ink/65 leading-relaxed">
                Aqui ficam os pares preenchidos pela IA. Você pode <strong className="text-ink">editar</strong>{" "}
                qualquer dor ou vitória, <strong className="text-ink">reordenar</strong> com as setas e marcar a{" "}
                <strong className="text-ink">intensidade</strong>. Tudo é salvo no Documento Mestre.
              </p>
              <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-terracotta/10 text-terracotta">
                {vitoriasFeitas} de {pares.length} vitórias preenchidas
              </span>
            </div>

            <div className="space-y-4 mb-8">
              {pares.map((p, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-white overflow-hidden grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]"
                >
                  {/* Ponto A · Dor */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full bg-terracotta text-cream text-xs font-semibold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta">Ponto A · Dor</p>
                        <p className="text-xs text-ink/55 mt-0.5">O que a pessoa sente hoje</p>
                      </div>
                      {/* Reorder buttons */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          onClick={() => moverPar(i, -1)}
                          disabled={i === 0}
                          className="p-1 rounded text-ink/40 hover:text-ink hover:bg-ink/5 disabled:opacity-20 transition-colors"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => moverPar(i, 1)}
                          disabled={i === pares.length - 1}
                          className="p-1 rounded text-ink/40 hover:text-ink hover:bg-ink/5 disabled:opacity-20 transition-colors"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={p.dor}
                      onChange={(e) => setPar(i, { dor: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-border bg-cream-warm/30 p-3 text-sm font-serif italic outline-none focus:border-terracotta resize-none mb-4"
                    />
                    <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-2">
                      Intensidade da dor
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {INTENSIDADES.map((n) => {
                        const active = p.intensidade === n.id;
                        return (
                          <button
                            key={n.id}
                            onClick={() => setPar(i, { intensidade: n.id })}
                            className={`text-xs px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5 transition-colors ${
                              active
                                ? "bg-ink/5 border-ink/30 text-ink"
                                : "bg-white border-border text-ink/70"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${n.dot}`} />
                            {n.id}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ponto B · Vitória */}
                  <div className="p-5">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-emerald-700">Ponto B · Vitória</p>
                    <p className="text-xs text-ink/55 mt-0.5 mb-3">O resultado concreto que ela conquista com você</p>
                    <textarea
                      value={p.vitoria}
                      onChange={(e) => setPar(i, { vitoria: e.target.value })}
                      rows={6}
                      placeholder="Descreva a vitória que você entrega…"
                      className="w-full rounded-xl border border-border bg-white p-3 text-sm outline-none focus:border-terracotta resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6 mb-8">
            {/* Prompt refinar no ChatGPT */}
            <div className="rounded-2xl border border-border bg-white p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-terracotta font-semibold mb-1">
                    Prompt com seu Doc Mestre + Pontos A→B
                  </p>
                  <h3 className="font-serif text-xl text-ink">Refinar no ChatGPT (opcional)</h3>
                  <p className="text-sm text-ink/60 mt-1">
                    Copie esse prompt, cole no ChatGPT e receba nome, promessa e pilares prontos para preencher os campos abaixo.
                  </p>
                </div>
                <button
                  onClick={copiarPrompt}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta/90 transition-colors"
                >
                  {copiado ? <Check size={14} /> : <Copy size={14} />}
                  {copiado ? "Copiado!" : "Copiar prompt"}
                </button>
              </div>

              <button
                onClick={() => setVerPrompt((v) => !v)}
                className="flex items-center gap-2 text-sm text-ink/60 hover:text-ink transition-colors"
              >
                {verPrompt ? <EyeOff size={14} /> : <Eye size={14} />}
                {verPrompt ? "Ocultar" : "Ver prompt completo"}
              </button>

              {verPrompt && (
                <pre className="mt-4 text-xs bg-cream-warm/50 border border-[var(--color-border)] rounded-xl p-4 whitespace-pre-wrap text-ink/70 leading-relaxed max-h-72 overflow-y-auto">
                  {promptRefinar}
                </pre>
              )}
            </div>

            {/* Divisor */}
            <div className="text-center">
              <p className="text-[10px] tracking-[0.28em] uppercase text-ink/40 font-semibold">
                Agora preencha com o resultado
              </p>
            </div>

            {/* Formulário do método */}
            <div className="rounded-2xl border border-border bg-white p-5 md:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-terracotta font-semibold mb-1">
                    Preenchido pela IA ou manualmente
                  </p>
                  <h3 className="font-serif text-xl text-ink">Seu método em 3 partes</h3>
                </div>
              </div>

              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-ink/50 block mb-1.5">
                  Nome do Método
                </label>
                <input
                  value={state.nomeMetodo}
                  onChange={(e) => update({ nomeMetodo: e.target.value })}
                  placeholder="Ex: Leveza no Digital"
                  className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-terracotta"
                />
              </div>

              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-ink/50 block mb-1.5">
                  Promessa
                </label>
                <textarea
                  value={state.promessa}
                  onChange={(e) => update({ promessa: e.target.value })}
                  rows={2}
                  placeholder="Cria conteúdo com IA, publica com consistência e capta leads sem complicar."
                  className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-terracotta resize-none"
                />
              </div>

              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-ink/50 block mb-1.5">
                  Pilares
                </label>
                <textarea
                  value={state.pilares}
                  onChange={(e) => update({ pilares: e.target.value })}
                  rows={5}
                  placeholder={`Base Clara — a cliente otimiza o perfil, define o nicho e cria uma bio que converte.\nConteúdo com IA — a cliente transforma ideias em posts, Reels e carrosséis com prompts prontos.\nCalendário Simples — a cliente organiza uma semana de conteúdo com agilidade e previsibilidade.`}
                  className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-terracotta resize-none"
                />
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-cream-warm/40 p-4">
                <p className="text-sm font-semibold text-ink mb-1">Meu posicionamento é:</p>
                <p className="text-xs text-ink/50 italic mb-3">
                  Estrutura sugerida: "Eu ajudo [público] a [resultado], solucionando [dor], por meio de [como você entrega]."
                </p>
                <textarea
                  value={state.posicionamento}
                  onChange={(e) => update({ posicionamento: e.target.value })}
                  rows={3}
                  placeholder="Eu ajudo iniciantes e empreendedores a criar conteúdo com IA para crescer nas redes e captar leads, solucionando a falta de clareza, tempo e consistência, por meio de uma comunidade com aulas gravadas, templates e prompts."
                  className="w-full rounded-xl border border-border bg-white p-3 text-sm outline-none focus:border-terracotta resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {/* state auto-saves */}}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta/90 transition-colors"
                >
                  <Save size={14} /> Salvar método
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3 mb-10">
          <Link
            to="/metodo/pilar-2"
            className="text-sm px-4 py-2 rounded-full border border-border bg-white inline-flex items-center gap-1.5"
          >
            ← Voltar
          </Link>
          <SaveBar
            onSave={() => {}}
            label="Salvar esboço"
            extra={
              <Link
                to="/doc-mestre"
                className="text-sm px-4 py-2 rounded-full border border-border bg-white flex items-center gap-1.5"
              >
                <FileText size={14} /> Revisar Doc Mestre
              </Link>
            }
          />
        </div>

        <div className="rounded-2xl border border-terracotta/40 bg-white p-6 text-center">
          <Sparkles size={18} className="text-terracotta mx-auto mb-2" />
          <p className="font-serif text-lg text-ink">Próximo passo: Identidade de marca</p>
          <p className="text-sm text-ink/60 mt-1 mb-4">
            Defina os arquétipos da sua marca e do seu cliente.
          </p>
          <Link
            to="/metodo/pilar-2/identidade"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta/90 transition-colors"
          >
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

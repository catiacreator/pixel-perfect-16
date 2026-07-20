import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import ColarResultado from "../../components/ColarResultado";
import { ArrowRight, ArrowUpRight, Smartphone, Copy, Check, ChevronDown, ClipboardPaste, Play, FileText, Eye, EyeOff, MessageSquare, Bot, Lock, Mic, Sparkles, MessageCircle, LayoutGrid, AlignLeft, Zap, type LucideIcon } from "lucide-react";
import { agenteUrl } from "@/lib/agentes-catia";
import { fillPilar2Prompt } from "@/lib/pilar2-fill";
import { usePilar2 } from "@/lib/pilar2-hooks";
import PillarHeader from "../../components/PillarHeader";
import PromptCard from "../../components/PromptCard";
import AgenteCatIa from "../../components/AgenteCatIa";
import BoasVindasInstagram from "../../components/BoasVindasInstagram";
import PlanoConteudo from "../../components/PlanoConteudo";
import FormatosConteudo from "../../components/FormatosConteudo";
import PlanoLeveza from "../../components/PlanoLeveza";
import Desafio30Dias from "../../components/Desafio30Dias";
import { CRIAR_CONTEUDO, type Objetivo } from "@/data/criar-conteudo";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";
import { useBloqueios } from "@/lib/bloqueios";
import { useServerFn } from "@tanstack/react-start";
import { getFerramentaCodigo, setFerramentaCodigo } from "@/lib/admin.functions";
import EmManutencao from "@/components/EmManutencao";

const AGENTE_POR_FORMATO: Record<string, string> = {
  roteiros: "ChatGPT",
  reels: "cat.ia — Criação de Reels Virais",
  stories: "cat.ia — Criação de Stories que Vendem",
  carrossel: "cat.ia — Criação de Posts que Vendem (Carrossel)",
};

// Ícone + cor por formato — assinala o objetivo/função de cada card.
const FORMATO_META: Record<string, { Icon: LucideIcon; cor: string }> = {
  roteiros: { Icon: Mic, cor: "#2E7CB8" },
  reels: { Icon: Sparkles, cor: "#C8487E" },
  stories: { Icon: MessageCircle, cor: "#F0A766" },
  carrossel: { Icon: LayoutGrid, cor: "#9E7FEC" },
  legendas: { Icon: AlignLeft, cor: "#2FA98A" },
  ganchos: { Icon: Zap, cor: "#E0567A" },
};

const TITULOS: Record<string, string> = {
  formatos: "Formatos de Conteúdo",
  criar: "Criar Conteúdo",
  plano: "Plano de Posts",
  desafio: "30 posts em 30 dias",
  assistente: "Assistente Cat.IA",
  linha: "Linha Editorial",
  bio: "Posicionamento e Bio",
  agendar: "Publicar",
  automacao: "Automação para mensagens automáticas",
  "carousel-snap": "Carousel Snap",
};

const OBJETIVOS_CONTEUDO: { id: Objetivo; label: string }[] = [
  { id: "autoridade", label: "Autoridade" },
  { id: "seguidores", label: "Seguidores" },
  { id: "vendas", label: "Vendas" },
];

const BIO_STORAGE_KEY = "leveza.bio.v1";
const BIO_CONQUISTA_KEY = "leveza.bio.conquista.v1";

function readDoc(): Record<string, unknown> {
  try {
    return JSON.parse(window.localStorage.getItem("leveza.doc-mestre.v1") || "{}");
  } catch {
    return {};
  }
}

function asList(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()) : [];
}

// Monta o prompt da linha editorial a partir do Documento Mestre + Método do
// utilizador (não tem dados fixos — funciona para qualquer conta).
function buildLinhaEditorialPrompt(
  doc: Record<string, unknown>,
  metodo: { nomeMetodo: string; promessa: string; pilares: string; posicionamento: string; tomDeVoz: string; cases: string },
  formato: "reels" | "estatico" | null,
): string {
  const nome = (doc.nome as string) || "[o seu nome]";
  const profissao = (doc.profissao as string) || "";
  const publico = (doc.publico as string) || "[o seu público]";
  const dores = asList(doc.dores);
  const dorPrincipal = dores[0] || "[a sua dor principal]";
  const tom = metodo.tomDeVoz || (doc.tomDeVoz as string) || "";
  const cases = metodo.cases || "";
  const posicionamento = metodo.posicionamento || "";
  const nomeMetodo = metodo.nomeMetodo || "[o seu método]";
  const promessa = metodo.promessa || "";

  const pilaresList = (metodo.pilares || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const nPilares = pilaresList.length || 5;
  const pilaresTexto = pilaresList.length
    ? pilaresList.map((p, i) => `${i + 1}. ${p}`).join("\n")
    : "[preenche os pilares do seu método em Crie o seu método]";

  const reels = formato === "reels";
  const formatoLinha = reels
    ? "APAREÇO em vídeo — pode incluir Reels na semana (máximo 2 por semana)."
    : "NÃO apareço em vídeo — usa apenas Carrossel e Imagem única (sem Reels).";

  return `Sou ${nome}${profissao ? `, ${profissao}` : ""}. Este é o meu Documento Mestre:

Promessa: ${promessa || "[a sua promessa]"}
Quem eu ajudo: ${publico}
Dor principal a enfatizar: ${dorPrincipal}
${cases ? `Cases / provas sociais: ${cases}\n` : ""}${posicionamento ? `Posicionamento: ${posicionamento}\n` : ""}${tom ? `Tom de voz: ${tom}\n` : ""}
MEU MÉTODO
Nome do método: ${nomeMetodo}
${promessa ? `Promessa do método: ${promessa}\n` : ""}Pilares do método (definem o NÚMERO e os NOMES dos pilares de conteúdo):
${pilaresTexto}

Quero que montes a minha LINHA EDITORIAL de Instagram em 3 partes.

═══════════════════════════════
PARTE 1 — POSICIONAMENTO
═══════════════════════════════
Uma frase clara no formato: "Eu ajudo X a Y sem Z".

═══════════════════════════════
PARTE 2 — PILARES DE CONTEÚDO
═══════════════════════════════
REGRA OBRIGATÓRIA: os pilares de conteúdo são EXATAMENTE os ${nPilares} pilares do meu método acima — mesmo número, mesmos nomes. Não reduza, não agrupe, não invente.

Para cada pilar, entrega:
PILAR — [nome exato do pilar]
O que ensina ao meu seguidor: [1 frase direta]
Como aparece no conteúdo: [3 exemplos de posts no meu nicho e na minha voz]
Tipo de conteúdo ideal: [quais dos 8 tipos abaixo funcionam melhor]

Os 8 tipos de conteúdo (vocabulário oficial):
- RADAR (topo/atrair) — novidade do nicho com o seu olhar
- POSIÇÃO (topo/autoridade) — ponto de vista forte sobre o tema
- CONVERSA (topo/engajar) — pergunta, enquete ou provocação leve
- BASTIDOR (topo/engajar) — bastidores reais, mostrar como faz ao vivo
- REACENDE (topo/engajar) — story ou post que reativa seguidor parado
- DIRECT (meio/relacionar) — DM genuíno (rotina diária, fora do calendário)
- EMPURRÃO (fundo/vender) — confronto que gera urgência (máximo 1x por semana)
- PROVA REAL (fundo/provar) — resultado real de cliente

═══════════════════════════════
PARTE 3 — CALENDÁRIO DA SEMANA (7 dias)
═══════════════════════════════
Distribua TODOS os ${nPilares} pilares ao longo da semana (rodízio) — nenhum pode ficar de fora.
${formatoLinha}
Regras: EMPURRÃO no máximo 1x; DIRECT não entra no calendário; equilibra o funil (4 topo / 1 meio / 2 fundo); story obrigatório todos os dias (ideia específica e concreta, ligada ao tema do post); usa a minha voz e o meu nicho; usa os cases reais que me passou.

Devolve o calendário EXATAMENTE neste formato (não mude os marcadores):
[CALENDARIO_INICIO]
Segunda | [tipo] tema do post — Pilar X | formato sugerido | story: o que mostrar
Terça | [tipo] tema do post — Pilar Y | formato sugerido | story: o que mostrar
Quarta | [tipo] tema do post — Pilar Z | formato sugerido | story: o que mostrar
Quinta | [tipo] tema do post — Pilar W | formato sugerido | story: o que mostrar
Sexta | [tipo] tema do post — Pilar V | formato sugerido | story: o que mostrar
Sábado | [tipo] tema do post — Pilar U | formato sugerido | story: o que mostrar
Domingo | [tipo] tema do post — Pilar T | formato sugerido | story: o que mostrar
[CALENDARIO_FIM]`;
}

const PROMPT_BIO = `Você é estratega de posicionamento de marca pessoal e copywriter para Instagram. Use SEMPRE o meu contexto abaixo, na minha voz e no meu tom.

📋 MEU CONTEXTO (Documento Mestre)
- Nome: [nome]
- Especialidade / profissão: [profissao]
- O que faço: [o_que_faz]
- Como resolvo: [como_resolve]
- Público / cliente ideal: [publico]
- Dor principal do cliente: [dor_principal_cliente]
- Desejos do público: [desejos_lista]
- Promessa / oferta: [promessa]
- Diferencial / prova social: [prova_social]
- Arquétipo da marca: [arquetipo_dominante] (secundário: [arquetipo_secundario])
- Tom de voz desejado: [tom_de_voz]
- Palavras a usar: [palavras_usar]
- Palavras a evitar: [palavras_evitar]

TAREFA — entregue, nesta ordem:
1. POSICIONAMENTO NUMA FRASE — "Eu ajudo [o meu público] a [resultado] através de [o meu método]".
2. PROPOSTA DE VALOR — 2 a 3 linhas do que me torna a escolha certa.
3. 3 MENSAGENS-CHAVE — os pilares que devo repetir na minha comunicação.
4. 3 VERSÕES DE BIO para o Instagram (máx. 150 caracteres cada):
   • BIO 1 — foco no resultado que entrego (quem sou + o que entrego + CTA)
   • BIO 2 — foco na dor/desejo do público (fala com a dor + para quem + CTA)
   • BIO 3 — foco no posicionamento/método (diferencial + para quem + próximo passo)

REGRAS:
- Fale na minha voz; direto ao ponto, sem floreios; use as minhas palavras a usar e evite as palavras a evitar.
- Emojis com moderação (só se combinarem com o meu tom).
- CTA pode ser: "Link abaixo", "Chama no Direct", "Baixe grátis", etc.
- NÃO use clichês tipo "apaixonada por", "especialista em ajudar", "sempre amei".`;

function BioPasso1() {
  const [copiado, setCopiado] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  function copiar() {
    navigator.clipboard?.writeText(fillPilar2Prompt(PROMPT_BIO));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 mb-4">
      <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full mb-3" style={{ background: "#35C0A01a", color: "#2a9c82" }}>
        Base · autoridade
      </span>
      <h3 className="font-serif text-xl text-ink">Posicionamento e Bio</h3>
      <p className="text-sm text-ink/55 mt-1 leading-relaxed mb-4">
        A base de clareza antes de qualquer post. Gera o seu <b>posicionamento</b> ("eu ajudo X a Y fazendo Z"),
        a <b>mensagem de marca</b> e a <b>bio</b> pronta a copiar.
      </p>

      {/* Agente prioritário */}
      <div className="rounded-xl border border-terracotta/25 bg-terracotta/5 p-4 mb-3">
        <p className="text-[10px] tracking-[0.14em] uppercase text-terracotta font-semibold mb-1.5">Passo 1 · Use o agente no ChatGPT</p>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-2 text-sm text-ink">
            <Bot size={16} className="text-terracotta shrink-0" />
            <b>cat.ia — Criador de Posicionamento e Bio</b>
          </span>
          <a
            href={agenteUrl("cat.ia — Criador de Posicionamento e Bio")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-cream rounded-full px-3 py-1.5 transition-opacity hover:opacity-90"
            style={{ background: "#C8487E" }}
          >
            Abrir agente no ChatGPT <ArrowUpRight size={13} />
          </a>
        </div>
        <p className="text-sm text-ink/60 leading-relaxed mb-3">
          Fale com este agente no ChatGPT — ele entrega o posicionamento, a mensagem de marca e 3 versões de bio.
          Se ainda não o tem, use o prompt abaixo como alternativa.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copiar}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors"
          >
            {copiado ? <Check size={14} /> : <Copy size={14} />}
            {copiado ? "Copiado!" : "Copiar prompt (alternativa)"}
          </button>
          <button
            onClick={() => setMostrar(v => !v)}
            className="inline-flex items-center gap-1.5 text-xs tracking-[0.06em] uppercase font-semibold text-ink/50 hover:text-ink transition-colors px-2 py-2"
          >
            {mostrar ? "Ocultar prompt" : "Ver prompt"}
            <ChevronDown size={13} className={`transition-transform ${mostrar ? "rotate-180" : ""}`} />
          </button>
        </div>
        {mostrar && (
          <pre className="mt-3 text-xs bg-[#F5EFE6] rounded-xl p-4 whitespace-pre-wrap text-ink/60 leading-relaxed max-h-72 overflow-y-auto">
            {fillPilar2Prompt(PROMPT_BIO)}
          </pre>
        )}
      </div>
    </div>
  );
}

function BioPasso2() {
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setBio(localStorage.getItem(BIO_STORAGE_KEY) || "");
  }, []);

  function handleChange(v: string) {
    setBio(v);
    localStorage.setItem(BIO_STORAGE_KEY, v);
    setSaved(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 mb-4">
      <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-1">Passo 2 — Cole e salve sua bio</p>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0">
          <ClipboardPaste size={18} />
        </div>
        <div>
          <h3 className="font-serif text-xl text-ink">Cole a bio que você escolheu</h3>
          <p className="text-sm text-ink/55 mt-0.5 leading-relaxed">
            Depois de gerar no ChatGPT, cole aqui a versão que mais combina com você. Ficará salva para consultar quando precisar.
          </p>
        </div>
      </div>
      <textarea
        rows={4}
        value={bio}
        onChange={e => handleChange(e.target.value)}
        placeholder="Cole aqui sua bio escolhida..."
        className="w-full rounded-xl border border-[var(--color-border)] p-4 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-terracotta transition-colors resize-none bg-[#FDFAF6]"
      />
      <p className="text-xs text-ink/35 mt-1.5">
        {saved ? "✓ Salvo" : "Suas alterações são salvas automaticamente"}
      </p>
    </div>
  );
}

function BioConquista() {
  const [resposta, setResposta] = useState<"sim" | "nao" | null>(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(BIO_CONQUISTA_KEY);
    if (v === "sim" || v === "nao") setResposta(v);
  }, []);

  function marcar(v: "sim" | "nao") {
    const anterior = resposta;
    setResposta(v);
    localStorage.setItem(BIO_CONQUISTA_KEY, v);
    if (v === "sim" && anterior !== "sim") {
      setToast(true);
      setTimeout(() => setToast(false), 3500);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 mb-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-1">Conquista</p>
        <h3 className="font-serif text-xl text-ink mb-1">Meu Instagram já tem bio</h3>
        <p className="text-sm text-ink/55 mb-4 leading-relaxed">
          Marque "Sim" quando sua bio estiver publicada no Instagram. Isso conta como uma conquista na sua jornada.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => marcar("sim")}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium border transition-colors ${resposta === "sim" ? "bg-ink text-cream border-ink" : "border-[var(--color-border)] text-ink hover:border-ink"}`}
          >
            {resposta === "sim" && <Check size={13} />} Sim
          </button>
          <button
            onClick={() => marcar("nao")}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${resposta === "nao" ? "bg-ink text-cream border-ink" : "border-[var(--color-border)] text-ink hover:border-ink"}`}
          >
            Não
          </button>
        </div>
        {resposta === "sim" && (
          <p className="mt-3 text-sm text-terracotta font-medium">✨ Conquista desbloqueada — sua bio está no ar!</p>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-ink text-cream px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-4">
          <Check size={15} className="text-green-400" />
          Conquista registrada: você já tem sua bio! ✨
        </div>
      )}
    </>
  );
}

function OpcaoFormato({
  ativo,
  onClick,
  icon,
  titulo,
  desc,
}: {
  ativo: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  titulo: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative text-left rounded-2xl border p-4 flex items-start gap-3 transition-colors ${
        ativo
          ? "border-terracotta bg-terracotta/5"
          : "border-[var(--color-border)] bg-white hover:border-terracotta/50"
      }`}
    >
      <span className="w-10 h-10 rounded-xl bg-gold/25 text-terracotta-dark flex items-center justify-center shrink-0">
        {icon}
      </span>
      <span className="min-w-0 pr-5">
        <span className={`block text-sm font-semibold ${ativo ? "text-terracotta" : "text-ink"}`}>
          {titulo}
        </span>
        <span className="block text-xs text-ink/55 mt-0.5 leading-relaxed">{desc}</span>
      </span>
      {ativo && (
        <span className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-terracotta text-cream flex items-center justify-center">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function LinhaEditorial({ formato }: { formato: "reels" | "estatico" | null }) {
  const { state } = usePilar2();
  const [copiado, setCopiado] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [doc, setDoc] = useState<Record<string, unknown>>({});

  useEffect(() => {
    setDoc(readDoc());
    const onChange = () => setDoc(readDoc());
    window.addEventListener("leveza:hydrated", onChange);
    return () => window.removeEventListener("leveza:hydrated", onChange);
  }, []);

  const prompt = buildLinhaEditorialPrompt(doc, state, formato);
  const semMetodo = !state.pilares.trim();

  function copiar() {
    navigator.clipboard?.writeText(prompt);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 mb-4">
      <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-1">Prompt com o seu Doc Mestre</p>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-serif text-xl text-ink">Crie sua linha editorial</h3>
          <p className="text-sm text-ink/55 mt-1 leading-relaxed">
            Copie este prompt, cola no ChatGPT (ou IA à sua escolha) e recebe a sua linha editorial já
            personalizada com tudo o que preencheu no Documento Mestre e no Método.
          </p>
        </div>
        <button
          onClick={copiar}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          {copiado ? <Check size={14} /> : <Copy size={14} />}
          {copiado ? "Copiado!" : "Copiar"}
        </button>
      </div>

      {semMetodo && (
        <p className="text-xs text-terracotta mb-3">
          ⚠️ Preencha o seu Método (nome, promessa e pilares) em Crie o seu método para o prompt ficar completo.
        </p>
      )}

      <button
        onClick={() => setMostrar((v) => !v)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium text-ink hover:border-terracotta transition-colors"
      >
        {mostrar ? <EyeOff size={15} /> : <Eye size={15} />}
        {mostrar ? "Ocultar prompt" : "Mostrar prompt"}
      </button>
      {mostrar && (
        <pre className="mt-3 text-xs bg-[#F5EFE6] rounded-xl p-4 whitespace-pre-wrap text-ink/60 leading-relaxed max-h-[28rem] overflow-auto">
          {prompt}
        </pre>
      )}
    </div>
  );
}

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

type DiaCal = { tema: string; formato: string; story: string };
const CAL_KEY = "leveza.calendario.v1";
const emptyCal = (): DiaCal[] => DIAS.map(() => ({ tema: "", formato: "", story: "" }));

const norm = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

// "[BASTIDOR] tema do post — Pilar 2" -> "tema do post"
function temaLimpo(t: string): string {
  return t.replace(/^\s*\[[^\]]*\]\s*/, "").replace(/\s*[—–-]\s*Pilar.*$/i, "").trim();
}

// Sugestão simples de story a partir do tema (sem chamar IA)
function storyDoTema(tema: string): string {
  const t = temaLimpo(tema);
  return t ? `Mostra um bastidor real ligado a "${t}" e fecha com uma pergunta nos stickers.` : "";
}

// Lê o bloco [CALENDARIO_INICIO]…[CALENDARIO_FIM] (ou linhas soltas "Dia | tema | formato | story: …")
function parseCalendario(texto: string): DiaCal[] | null {
  const m = texto.match(/\[CALENDARIO_INICIO\]([\s\S]*?)\[CALENDARIO_FIM\]/i);
  const bloco = m ? m[1] : texto;
  const byIdx: Record<number, DiaCal> = {};
  for (const linha of bloco.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const p = linha.split("|").map((x) => x.trim());
    if (p.length < 2) continue;
    const idx = DIAS.findIndex((d) => norm(p[0]).startsWith(norm(d).slice(0, 3)));
    if (idx < 0) continue;
    byIdx[idx] = { tema: p[1] || "", formato: p[2] || "", story: (p[3] || "").replace(/^story:\s*/i, "") };
  }
  return Object.keys(byIdx).length ? DIAS.map((_, i) => byIdx[i] || { tema: "", formato: "", story: "" }) : null;
}

const escHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

export default function RedesSociais() {
  const [params] = useSearchParams();
  const aba = params.get("aba") || "boas-vindas";
  const bloqueadoParaAlunos = useBloqueadoParaAlunos();
  const { isBloqueado, modoBloqueio } = useBloqueios();
  // Em "Formatos de Conteúdo" o bloqueio é por sub-formato (fmt): cada explicador
  // (roteiros/reels/carrossel/stories) tem o seu id; "Cria a tua série" é uma
  // página à parte (rota própria) e não passa por aqui.
  const fmt = params.get("fmt") || "roteiros";
  const guardId = aba === "formatos" ? `redes.formatos.${fmt}` : `redes.${aba}`;
  // O assistente Cat.IA tem gating PRÓPRIO (permissões por turma/aluno) — não passa
  // pelo bloqueio de estrutura/turma, senão colidiam.
  const conteudoBloqueado = aba !== "assistente" && bloqueadoParaAlunos && isBloqueado(guardId);
  const avisoAdminEmBreve = aba !== "assistente" && !bloqueadoParaAlunos && isBloqueado(guardId);
  const [formato, setFormato] = useState<"reels" | "estatico" | null>(null);
  const [objetivo, setObjetivo] = useState<Objetivo>("autoridade");
  const [subCriar, setSubCriar] = useState<"prompts" | "plano-leveza">("prompts");

  // ─── Calendário Editorial ───
  const [cal, setCal] = useState<DiaCal[]>(emptyCal);
  const [colado, setColado] = useState("");
  const [aviso, setAviso] = useState("");
  const calHydrated = useRef(false);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(CAL_KEY);
        if (raw) setCal(JSON.parse(raw));
      } catch {
        /* ignora JSON inválido */
      }
    };
    load();
    calHydrated.current = true;
    // recarrega quando o Supabase hidrata o localStorage desta conta
    window.addEventListener("leveza:hydrated", load);
    return () => window.removeEventListener("leveza:hydrated", load);
  }, []);

  useEffect(() => {
    if (!calHydrated.current) return;
    try {
      localStorage.setItem(CAL_KEY, JSON.stringify(cal));
    } catch {
      /* quota cheia — ignora */
    }
  }, [cal]);

  const flashAviso = (msg: string) => {
    setAviso(msg);
    window.setTimeout(() => setAviso(""), 2500);
  };

  const setDia = (i: number, patch: Partial<DiaCal>) =>
    setCal((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));

  const preencherDaLinha = () => {
    const parsed = parseCalendario(colado);
    if (!parsed) {
      flashAviso("Não encontrei o calendário. Cola o resultado da Linha Editorial (bloco CALENDARIO_INICIO…FIM).");
      return;
    }
    setCal(parsed);
    flashAviso("Calendário preenchido a partir da Linha Editorial ✓");
  };

  const preencherStories = () => {
    setCal((prev) => prev.map((d) => (d.tema && !d.story ? { ...d, story: storyDoTema(d.tema) } : d)));
    flashAviso("Stories sugeridos preenchidos ✓");
  };

  const zerarCal = () => {
    if (!confirm("Apagar todo o calendário desta semana?")) return;
    setCal(emptyCal());
  };

  const salvarCal = () => {
    try {
      localStorage.setItem(CAL_KEY, JSON.stringify(cal));
      flashAviso("Calendário guardado ✓");
    } catch {
      flashAviso("Não foi possível guardar (armazenamento cheio).");
    }
  };

  const baixarCalPDF = () => {
    const doc = readDoc();
    const nome = (doc.nome as string) || "";
    const linhas = DIAS.map(
      (d, i) => `<tr>
        <td class="dia">${escHtml(d)}</td>
        <td>${escHtml(cal[i]?.tema || "—")}</td>
        <td class="fmt">${escHtml(cal[i]?.formato || "—")}</td>
        <td>${escHtml(cal[i]?.story || "—")}</td>
      </tr>`,
    ).join("");
    const html = `<!doctype html><html lang="pt"><head><meta charset="utf-8">
<title>Calendário Editorial${nome ? " — " + escHtml(nome) : ""}</title>
<style>
  @page { size: A4 landscape; margin: 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111111; margin: 0; }
  .top { border-bottom: 3px solid #6B3F2A; padding-bottom: 12px; margin-bottom: 22px; }
  .kicker { font-family: Arial, sans-serif; font-size: 10px; letter-spacing: .28em; text-transform: uppercase; color: #6B3F2A; margin: 0 0 4px; }
  h1 { font-size: 26px; margin: 0; color: #111111; }
  .sub { font-family: Arial, sans-serif; font-size: 12px; color: #8E7B64; margin: 4px 0 0; }
  table { width: 100%; border-collapse: collapse; }
  th { font-family: Arial, sans-serif; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #fff; background: #6B3F2A; text-align: left; padding: 9px 12px; }
  td { font-size: 13px; padding: 11px 12px; border-bottom: 1px solid #E7DBC9; vertical-align: top; }
  tr:nth-child(even) td { background: #FBF7F0; }
  td.dia { font-weight: bold; color: #6B3F2A; white-space: nowrap; width: 90px; }
  td.fmt { font-family: Arial, sans-serif; font-size: 12px; color: #5E89A0; white-space: nowrap; width: 120px; }
  .foot { font-family: Arial, sans-serif; font-size: 10px; color: #B7A88F; margin-top: 18px; }
</style></head>
<body>
  <div class="top">
    <p class="kicker">Cátia Creator · Pilar 2</p>
    <h1>Calendário Editorial da Semana</h1>
    <p class="sub">${nome ? escHtml(nome) + " · " : ""}7 dias · tema, formato e story por dia</p>
  </div>
  <table>
    <thead><tr><th>Dia</th><th>Tema do post</th><th>Formato</th><th>Story do dia</th></tr></thead>
    <tbody>${linhas}</tbody>
  </table>
  <p class="foot">Gerado em Cátia Creator</p>
  <script>window.onload=function(){window.print();}</script>
</body></html>`;
    const w = window.open("", "_blank", "width=1000,height=800");
    if (!w) {
      flashAviso("Permite popups neste site para baixar o PDF.");
      return;
    }
    w.document.write(html);
    w.document.close();
  };

  return (
    <Layout>
      <PilarBreadcrumb pilar="redes" pilarLabel="Conteúdo Todo Dia" backTo="/protocolo" backLabel="Voltar à Leveza no Digital" />
      {aba === "boas-vindas" ? (
        <PillarHeader
          numeral="✦"
          icon={<MessageSquare size={18} />}
          pilarLabel="Leveza no Digital · Instagram"
          titulo="Conteúdo Todo Dia"
          subtitulo="Comece pelas Boas-vindas: reveja o seu Documento Mestre e defina os temas com a Estrategista."
        />
      ) : (
        <div className="px-5 md:px-10 pt-6 max-w-4xl mx-auto">
          <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Conteúdo Todo Dia</p>
          <h1 className="font-serif text-2xl md:text-3xl text-ink tracking-tight">{TITULOS[aba] || "Conteúdo Todo Dia"}</h1>
        </div>
      )}
      <div className={`px-5 md:px-10 max-w-4xl mx-auto ${aba === "boas-vindas" ? "py-10" : "pt-6 pb-12"}`}>
        {avisoAdminEmBreve && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-[13px] text-amber-800">
            <Lock size={14} className="shrink-0" />
            <span>
              Esta secção está <b>Em breve</b> para os alunos — só você (admin) a vê. Altere em{" "}
              <b>Admin → Estrutura &amp; Bloqueios</b>.
            </span>
          </div>
        )}
        {conteudoBloqueado ? (
          <EmManutencao modo={modoBloqueio(guardId)} />
        ) : (
        <>
        {aba === "boas-vindas" && <BoasVindasInstagram />}

        {aba === "formatos" && <FormatosConteudo />}

        {aba === "desafio" && <Desafio30Dias />}

        {aba === "assistente" && <AgenteCatIa />}

        {aba === "plano" && <PlanoConteudo />}

        {aba === "criar" && (
          <>
            {/* Duas formas de criar: peça a peça (prompts) ou o plano inteiro de uma vez. */}
            <div className="flex gap-1.5 mb-6 p-1 rounded-full bg-ink/5 w-fit">
              {([
                { id: "prompts", label: "Prompts prontos" },
                { id: "plano-leveza", label: "Plano Leveza" },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSubCriar(t.id)}
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                    subCriar === t.id ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </>
        )}

        {aba === "criar" && subCriar === "plano-leveza" && <PlanoLeveza />}

        {aba === "criar" && subCriar === "prompts" && (
          <>
            <div className="rounded-2xl border border-terracotta/25 bg-terracotta/5 p-5 mb-6">
              <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Criar Conteúdo · Prompts prontos</p>
              <h2 className="font-serif text-2xl text-ink mb-1.5">Transforme o seu método em posts</h2>
              <p className="text-sm text-ink/60 leading-relaxed">
                Escolha o <b>formato</b> e o <b>objetivo</b>. Copie o prompt (já vem com o seu Documento Mestre) e use-o
                com o <b>agente Cat.IA</b> indicado no ChatGPT. Depois cole o resultado no <b>Plano de Posts</b>.
              </p>
            </div>

            {/* Objetivo do conteúdo */}
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-2">Objetivo deste conteúdo</p>
              <div className="flex flex-wrap gap-2">
                {OBJETIVOS_CONTEUDO.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setObjetivo(o.id)}
                    className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${objetivo === o.id ? "bg-gradient-to-br from-terracotta to-terracotta-dark text-cream border-transparent" : "bg-white border-border text-ink hover:border-terracotta/50"}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {CRIAR_CONTEUDO.map((c) => {
              const meta = FORMATO_META[c.id];
              const agente = AGENTE_POR_FORMATO[c.id];
              return (
                <PromptCard
                  key={c.id}
                  titulo={c.titulo}
                  descricao={c.descricao}
                  prompt={c.prompts[objetivo]}
                  rotuloBotao="Copiar prompt"
                  icon={meta ? <meta.Icon size={20} /> : undefined}
                  cor={meta?.cor}
                  agente={agente}
                  agenteUrl={agenteUrl(agente)}
                  botaoCor="#C8487E"
                />
              );
            })}

            <Link to="/metodo/pilar-2/redes-sociais?aba=plano" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold mt-2">
              Organizar no Plano de Posts <ArrowRight size={15} />
            </Link>
          </>
        )}

        {aba === "bio" && (
          <>
            <BioPasso1 />
            <BioPasso2 />
            <BioConquista />
            <div className="flex justify-end">
              <Link
                to="/metodo/pilar-2/redes-sociais?aba=agendar"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors"
              >
                Ir para a próxima fase: Publicar <ArrowRight size={15} />
              </Link>
            </div>
          </>
        )}

        {aba === "agendar" && (
          <div className="rounded-2xl border border-border bg-white p-5 text-center">
            <Smartphone size={24} className="mx-auto mb-3 text-terracotta" />
            <p className="text-sm text-muted mb-4">Agora que tudo está pronto, é hora de publicar no Instagram.</p>
            <Link to="/metodo/pilar-2/redes-sociais/instagram" className="text-sm font-semibold text-terracotta">
              Ir para Instagram →
            </Link>
          </div>
        )}

        {aba === "automacao" && (
          <div className="space-y-6">
            {/* Intro */}
            <div className="rounded-2xl border border-border bg-white p-6">
              <span className="w-11 h-11 rounded-xl bg-terracotta/12 text-terracotta flex items-center justify-center mb-4">
                <Bot size={20} />
              </span>
              <h2 className="font-serif text-xl text-ink mb-2">Responde a toda a gente — mesmo enquanto dormes</h2>
              <p className="text-[15px] text-ink/70 leading-relaxed mb-3">
                A ferramenta que uso para isto chama-se <strong className="text-ink">Youze</strong>. Ligas o teu Instagram
                e ela responde por ti: quando alguém comenta uma palavra-chave, envias-lhe o link ou o material na DM;
                reage a stories, envia lembretes de compra e até cria os fluxos com IA. Configuras em ~5 minutos, sem saber programar.
              </p>
              <p className="text-[13px] text-ink/55 leading-relaxed">
                Usa a API oficial da Meta, por isso a tua conta fica segura. Tem um plano gratuito para começares.
              </p>
            </div>

            {/* Como funciona — 3 passos */}
            <div>
              <h3 className="font-serif text-lg text-ink mb-3">Como funciona, em 3 passos</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { n: "1", t: "Liga o Instagram", d: "Crias conta na Youze e ligas o teu perfil profissional em segundos." },
                  { n: "2", t: "Escolhes o gatilho", d: "Ex.: “quando alguém comentar QUERO neste post…”." },
                  { n: "3", t: "Defines a resposta", d: "A Youze envia o link, o PDF ou a mensagem na DM — automaticamente, 24h por dia." },
                ].map((s) => (
                  <div key={s.n} className="rounded-2xl border border-border bg-white p-4">
                    <span className="w-7 h-7 rounded-full bg-terracotta text-cream text-sm font-semibold flex items-center justify-center mb-2">{s.n}</span>
                    <h4 className="font-serif text-[15px] text-ink mb-1">{s.t}</h4>
                    <p className="text-[13px] text-ink/60 leading-relaxed">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Casos de uso */}
            <div>
              <h3 className="font-serif text-lg text-ink mb-3">O que podes automatizar</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: MessageSquare, t: "Comentário → DM", d: "Alguém comenta “QUERO” e recebe o link automaticamente na mensagem privada." },
                  { icon: MessageCircle, t: "Boas-vindas automáticas", d: "Cada novo seguidor recebe uma mensagem tua a apresentar o que fazes." },
                  { icon: Zap, t: "Recuperar vendas", d: "Lembretes automáticos para quem mostrou interesse mas não comprou." },
                ].map((c) => (
                  <div key={c.t} className="rounded-2xl border border-border bg-white p-4">
                    <c.icon size={18} className="text-terracotta mb-2" />
                    <h4 className="font-serif text-[15px] text-ink mb-1">{c.t}</h4>
                    <p className="text-[13px] text-ink/60 leading-relaxed">{c.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA — link da Cátia */}
            <div className="rounded-3xl bg-gradient-to-br from-terracotta-dark to-terracotta text-cream p-8 text-center">
              <h3 className="font-serif text-2xl mb-2">Experimenta a Youze</h3>
              <p className="text-cream/85 max-w-lg mx-auto leading-relaxed mb-5">
                Começa com o plano gratuito e monta a tua primeira automação hoje.
              </p>
              <a
                href="https://youze.com.br?tag=YOUZUKF7U4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cream text-terracotta-dark text-sm font-semibold hover:bg-white transition-colors"
              >
                <Bot size={17} /> Criar conta na Youze <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        )}

        {aba === "carousel-snap" && <CarouselSnap podeEditar={!bloqueadoParaAlunos} />}
        </>
        )}
      </div>
    </Layout>
  );
}

// ─────────────── Ferramenta: Carousel Snap (link + código editável) ───────────────
function CarouselSnap({ podeEditar }: { podeEditar: boolean }) {
  const LINK = "https://carouselsnap.app/";
  const CHAVE = "carousel-snap";
  const CODIGO_PADRAO = "COMUNIDADE-JUL26-BDA5";

  const getCod = useServerFn(getFerramentaCodigo);
  const setCod = useServerFn(setFerramentaCodigo);
  const [codigo, setCodigo] = useState(CODIGO_PADRAO);
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState("");
  const [aGuardar, setAGuardar] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    let vivo = true;
    getCod({ data: { chave: CHAVE } })
      .then((r) => { if (vivo && r?.codigo) setCodigo(r.codigo); })
      .catch(() => {});
    return () => { vivo = false; };
  }, [getCod]);

  async function guardar() {
    const novo = rascunho.trim();
    if (!novo) return;
    setAGuardar(true);
    try {
      await setCod({ data: { chave: CHAVE, codigo: novo } });
      setCodigo(novo);
      setEditando(false);
    } finally {
      setAGuardar(false);
    }
  }

  function copiar() {
    navigator.clipboard?.writeText(codigo).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    });
  }

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <span className="w-11 h-11 rounded-xl bg-terracotta/12 text-terracotta flex items-center justify-center mb-4">
          <LayoutGrid size={20} />
        </span>
        <h2 className="font-serif text-xl text-ink mb-2">Cria carrosséis lindos em minutos</h2>
        <p className="text-[15px] text-ink/70 leading-relaxed">
          O <strong className="text-ink">Carousel Snap</strong> é a ferramenta que uso para montar carrosséis de
          Instagram com um visual profissional — guardas os teus estilos e reaproveitas o mesmo look em todos os posts,
          sem começares do zero de cada vez.
        </p>
      </div>

      {/* Código de desconto */}
      <div className="rounded-2xl border border-terracotta/30 bg-terracotta/[0.04] p-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-2">
          Código de desconto da comunidade
        </p>
        {editando ? (
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={rascunho}
              onChange={(e) => setRascunho(e.target.value.toUpperCase())}
              className="font-mono text-lg font-bold tracking-wider text-ink bg-white border border-border rounded-lg px-3 py-2 outline-none focus:border-terracotta"
              placeholder="CODIGO"
            />
            <button
              onClick={guardar}
              disabled={aGuardar}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors disabled:opacity-60"
            >
              {aGuardar ? "A guardar…" : "Guardar"}
            </button>
            <button onClick={() => setEditando(false)} className="text-ink/50 hover:text-ink text-sm px-2">
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xl md:text-2xl font-bold tracking-wider text-ink select-all">{codigo}</span>
            <button
              onClick={copiar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-terracotta/40 text-terracotta text-sm font-semibold hover:bg-terracotta/10 transition-colors"
            >
              {copiado ? <Check size={14} /> : <Copy size={14} />} {copiado ? "Copiado!" : "Copiar"}
            </button>
            {podeEditar && (
              <button
                onClick={() => { setRascunho(codigo); setEditando(true); }}
                className="text-ink/45 hover:text-terracotta text-sm underline decoration-dotted"
              >
                editar código
              </button>
            )}
          </div>
        )}
        <p className="text-[13px] text-ink/55 mt-3">Usa este código no checkout para teres desconto.</p>
      </div>

      {/* Botão do link */}
      <div className="rounded-3xl bg-gradient-to-br from-terracotta-dark to-terracotta text-cream p-8 text-center">
        <h3 className="font-serif text-2xl mb-2">Abrir o Carousel Snap</h3>
        <p className="text-cream/85 max-w-lg mx-auto leading-relaxed mb-5">
          Cria a tua conta e começa a montar carrosséis com o código acima.
        </p>
        <a
          href={LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cream text-terracotta-dark text-sm font-semibold hover:bg-white transition-colors"
        >
          <LayoutGrid size={17} /> Ir para o Carousel Snap <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  );
}

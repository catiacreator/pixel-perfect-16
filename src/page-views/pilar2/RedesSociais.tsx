import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import ColarResultado from "../../components/ColarResultado";
import TodoBanner from "../../components/TodoBanner";
import { ArrowRight, Smartphone, Copy, Check, ChevronDown, ClipboardPaste, Play, FileText, Eye, EyeOff } from "lucide-react";
import { usePilar2 } from "@/lib/pilar2-hooks";
import ModeloPost from "./ModeloPost";

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
    : "[preenche os pilares do seu método no O Seu Método]";

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

const PROMPT_BIO = `Você é especialista em copywriting para Instagram de profissionais autônomos.

DADOS DA PROFISSIONAL:
Nome: Cátia Creator
Profissão: especialista em IA e criação de conteudo
O que faz: Ensino iniciantes e empreendedores a criar conteúdo com Inteligência Artificial por meio de uma comunidade com aulas gravadas. Ajudo a sair do zero até publicar e captar leads com consistência.
Como resolve: Aulas gravadas on‑demand com passo a passo, templates, prompts de Inteligência Artificial, checklists e tutoriais. Comunidade ativa para dúvidas e feedback em grupo, com jornadas do zero ao primeiro calendário de conteúdo e automações básicas. Sucesso medido por crescimento do perfil e leads gerados, sem promessa de prazo fixo.
Público: Iniciantes e empreendedores que querem começar a produzir conteúdo e usar Inteligência Artificial para crescer no Instagram e outras redes, incluindo micro e pequenos negócios em fase inicial.
Dores do público: Eu não sei usar Inteligência Artificial para criar conteúdo. | Eu não sei o básico do Instagram para começar. | Eu não sei por onde começar meu calendário de posts.
Desejos do público: Quero dominar ferramentas de Inteligência Artificial de forma simples. | Quero crescer seguidores qualificados de forma consistente. | Quero gerar leads a partir do meu conteúdo.
Posicionamento: Eu ajudo iniciantes, empreendedores e pequenos negócios a criar conteúdo com IA para crescer nas redes e captar leads, solucionando a falta de clareza, tempo e consistência, por meio de uma comunidade com aulas gravadas, templates, prompts, checklists, tutoriais e feedback em grupo.
Método/diferencial: Leveza no Digital — Cria conteúdo com IA, publica com consistência e capta leads sem complicar.
Tom de voz: Escreva como quem mostra o próximo passo, não como quem despeja uma aula inteira.
Use palavras simples como processo, clareza, consistência, publicar e leads.
Mostre exemplos concretos antes de explicar a teoria.
Fale da Inteligência Artificial como apoio prático para sair do bloqueio, não como assunto técnico.

TAREFA: Crie 3 versões de bio para o Instagram de Cátia Creator.

Cada bio deve ter no máximo 150 caracteres no total (limite do Instagram).
Use emojis com moderação — só se combinar com o tom dela.

BIO 1 — Foco no resultado que entrega:
(quem é + o que entrega + CTA ou link)

BIO 2 — Foco na dor/desejo do público:
(fala diretamente com a dor/desejo + quem ela ajuda + CTA)

BIO 3 — Foco no posicionamento/método:
(o diferencial dela + para quem + próximo passo)

REGRAS:
- Direto ao ponto, sem floreios
- Linguagem da mulher que ela é (arquétipo: Sábia)
- CTA pode ser: "Link abaixo", "Me chama no DM", "Baixe grátis" etc.
- NÃO use: "apaixonada por", "especialista em ajudar", "mãe e", "sempre amei"`;

function BioPasso1() {
  const [copiado, setCopiado] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  function copiar() {
    navigator.clipboard?.writeText(PROMPT_BIO);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 mb-4">
      <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-1">Passo 1 — Gere com Inteligência Artificial</p>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-serif text-xl text-ink">Crie sua bio do Instagram</h3>
          <p className="text-sm text-ink/55 mt-1 leading-relaxed">
            Copie o prompt abaixo, cole no ChatGPT e receba 3 versões de bio prontas para você escolher a melhor.
          </p>
        </div>
        <button
          onClick={copiar}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          {copiado ? <Check size={14} /> : <Copy size={14} />}
          {copiado ? "Copiado!" : "Copiar prompt"}
        </button>
      </div>
      <button
        onClick={() => setMostrar(v => !v)}
        className="w-full flex items-center justify-between text-sm text-ink/50 hover:text-ink transition-colors border-t border-[var(--color-border)] pt-3"
      >
        <span>Ver prompt completo</span>
        <span className="flex items-center gap-1 text-xs tracking-[0.1em] uppercase font-semibold text-ink/40">
          {mostrar ? "Ocultar" : "Mostrar"}
          <ChevronDown size={13} className={`transition-transform ${mostrar ? "rotate-180" : ""}`} />
        </span>
      </button>
      {mostrar && (
        <pre className="mt-3 text-xs bg-[#F5EFE6] rounded-xl p-4 whitespace-pre-wrap text-ink/60 leading-relaxed">
          {PROMPT_BIO}
        </pre>
      )}
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
          ⚠️ Preencha o seu Método (nome, promessa e pilares) no O Seu Método para o prompt ficar completo.
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

const TABS = [
  { id: "modelos", label: "Modelos de Posts" },
  { id: "linha", label: "Linha Editorial" },
  { id: "calendario", label: "Calendário Editorial" },
  { id: "bio", label: "Bio" },
  { id: "projeto", label: "Projeto de Post" },
  { id: "agendar", label: "Como agendar" },
];

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
  const [params, setParams] = useSearchParams();
  const aba = params.get("aba") || "modelos";
  const [formato, setFormato] = useState<"reels" | "estatico" | null>(null);

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
    <p class="kicker">Leveza no Digital · Pilar 2</p>
    <h1>Calendário Editorial da Semana</h1>
    <p class="sub">${nome ? escHtml(nome) + " · " : ""}7 dias · tema, formato e story por dia</p>
  </div>
  <table>
    <thead><tr><th>Dia</th><th>Tema do post</th><th>Formato</th><th>Story do dia</th></tr></thead>
    <tbody>${linhas}</tbody>
  </table>
  <p class="foot">Gerado em Leveza no Digital</p>
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
      <PilarBreadcrumb pilar="redes" pilarLabel="Criando para as Redes Sociais" backTo="/" backLabel="Voltar para Início" />
      <TodoBanner texto="Etapa 4 — conteúdo pendente. Aguardando documentação detalhada de Redes Sociais (prompts, calendário, modelos)." />
      <div className="px-5 md:px-10 py-10 max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Redes Sociais</h1>
        <p className="italic text-muted mb-6">Comece pelos modelos de posts e depois entre nas redes.</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setParams({ aba: t.id })}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${aba === t.id ? "bg-gradient-to-br from-terracotta to-terracotta-dark text-cream border-transparent" : "bg-white border-border text-ink hover:border-terracotta/50"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {aba === "modelos" && (
          <>
            <div className="mb-6"><VideoPlaceholder label="Criando carrosséis com IA: como ajustar e refinar seus posts" /></div>
            <div className="mb-6">
              <ModeloPost />
            </div>
            <Link to="/metodo/pilar-2/redes-sociais?aba=linha" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">
              Ir para Linha Editorial <ArrowRight size={15} />
            </Link>
          </>
        )}

        {aba === "linha" && (
          <>
            {/* Passo 1 — escolha de formato */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 mb-4">
              <p className="text-[11px] tracking-[0.2em] uppercase text-ink/45 mb-1">Passo 1 — Antes de gerar</p>
              <h2 className="font-serif text-xl text-ink mb-1.5">Você vai aparecer em vídeo?</h2>
              <p className="text-sm text-ink/55 mb-5">
                Isto define se o seu calendário vai incluir Reels ou só posts estáticos (carrossel e imagem única).
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <OpcaoFormato
                  ativo={formato === "reels"}
                  onClick={() => setFormato("reels")}
                  icon={<Play size={18} />}
                  titulo="Apareço em Reels"
                  desc="Gravo vídeo — quero Reels no calendário"
                />
                <OpcaoFormato
                  ativo={formato === "estatico"}
                  onClick={() => setFormato("estatico")}
                  icon={<FileText size={18} />}
                  titulo="Prefiro posts estáticos"
                  desc="Carrossel e imagem única — sem precisar aparecer"
                />
              </div>
              {!formato && (
                <p className="text-xs text-terracotta mt-4">
                  ⚠️ Escolha um formato para o prompt ser gerado corretamente.
                </p>
              )}
            </div>

            <LinhaEditorial formato={formato} />
            <ColarResultado label="Cole o que a IA te devolveu" />
          </>
        )}

        {aba === "calendario" && (
          <>
            {/* Cabeçalho do card */}
            <div className="rounded-2xl border border-border bg-white overflow-hidden mb-5">
              <div className="bg-gradient-to-br from-terracotta to-terracotta-dark px-6 py-5">
                <p className="text-[11px] tracking-[0.22em] uppercase text-cream/70 mb-1">Pilar 2 · Etapa 4</p>
                <h2 className="font-serif text-2xl text-cream">Calendário Editorial da Semana</h2>
                <p className="text-sm text-cream/75 mt-1">
                  Distribui os temas, formatos e stories pelos 7 dias — a partir da tua Linha Editorial.
                </p>
              </div>
              <div className="p-6">
                <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5 block">
                  Cola aqui o resultado da Linha Editorial
                </label>
                <textarea
                  rows={4}
                  value={colado}
                  onChange={(e) => setColado(e.target.value)}
                  placeholder="Cola o que a IA devolveu (inclui o bloco CALENDARIO_INICIO … CALENDARIO_FIM)…"
                  className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-terracotta resize-none mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={preencherDaLinha}
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-terracotta text-cream hover:bg-terracotta-dark transition-colors"
                  >
                    ✨ Preencher calendário a partir da Linha Editorial
                  </button>
                  <button
                    onClick={preencherStories}
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-border text-ink hover:border-terracotta/50 transition-colors"
                  >
                    Preencher stories automaticamente
                  </button>
                </div>
                {aviso && <p className="text-xs text-sage mt-3">{aviso}</p>}
              </div>
            </div>

            {/* Tabela dos 7 dias */}
            <div className="rounded-2xl border border-border bg-white overflow-hidden">
              <div className="hidden md:grid grid-cols-[90px_1fr_150px_1fr] gap-3 px-4 py-3 bg-cream-warm/60 border-b border-border text-[10px] tracking-[0.14em] uppercase text-ink/50 font-medium">
                <span>Dia</span>
                <span>Tema do post</span>
                <span>Formato</span>
                <span>Story do dia</span>
              </div>
              {DIAS.map((dia, i) => (
                <div
                  key={dia}
                  className="grid grid-cols-1 md:grid-cols-[90px_1fr_150px_1fr] gap-2 md:gap-3 px-4 py-3 border-b border-border last:border-0 md:items-center"
                >
                  <p className="font-serif text-base md:text-sm text-terracotta">{dia}</p>
                  <input
                    value={cal[i]?.tema || ""}
                    onChange={(e) => setDia(i, { tema: e.target.value })}
                    placeholder="[BASTIDOR] tema — Pilar 2"
                    className="w-full rounded-lg border border-border p-2 text-sm"
                  />
                  <select
                    value={cal[i]?.formato || ""}
                    onChange={(e) => setDia(i, { formato: e.target.value })}
                    className="w-full rounded-lg border border-border p-2 text-sm"
                  >
                    <option value="">Formato…</option>
                    {cal[i]?.formato && !["Carrossel", "Reels", "Imagem única"].includes(cal[i].formato) && (
                      <option value={cal[i].formato}>{cal[i].formato}</option>
                    )}
                    <option>Carrossel</option>
                    <option>Reels</option>
                    <option>Imagem única</option>
                  </select>
                  <input
                    value={cal[i]?.story || ""}
                    onChange={(e) => setDia(i, { story: e.target.value })}
                    placeholder="Story do dia"
                    className="w-full rounded-lg border border-border p-2 text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Ações */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={zerarCal}
                className="text-sm px-4 py-2 rounded-full border border-border text-ink hover:border-terracotta/50 transition-colors"
              >
                Zerar
              </button>
              <button
                onClick={baixarCalPDF}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-border text-ink hover:border-terracotta/50 transition-colors"
              >
                <FileText size={14} /> Baixar PDF
              </button>
              <button
                onClick={salvarCal}
                className="text-sm px-4 py-2 rounded-full bg-terracotta text-cream hover:bg-terracotta-dark transition-colors"
              >
                Salvar
              </button>
              <Link
                to="/metodo/pilar-2/redes-sociais?aba=bio"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-ink text-cream ml-auto"
              >
                Ir para a próxima fase: Bio <ArrowRight size={15} />
              </Link>
            </div>
          </>
        )}

        {aba === "bio" && (
          <>
            <BioPasso1 />
            <BioPasso2 />
            <BioConquista />
            <div className="flex justify-end">
              <Link
                to="/metodo/pilar-2/redes-sociais?aba=projeto"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors"
              >
                Ir para a próxima fase: Projeto de Posts <ArrowRight size={15} />
              </Link>
            </div>
          </>
        )}

        {aba === "projeto" && (
          <>
            <div className="mb-6"><VideoPlaceholder label="Como criar seu agente de conteúdo com IA" /></div>
            <div className="rounded-2xl border border-border bg-white p-5">
              <p className="font-serif text-lg text-ink mb-2">Seu assistente de conteúdo no ChatGPT</p>
              <p className="text-sm text-muted mb-3">
                Configura um projeto no ChatGPT com toda a sua identidade — ele cria carrosséis, roteiros de Reels e
                stories no seu tom, sem precisares de explicar tudo de novo.
              </p>
              <div className="flex gap-2">
                <button className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border">Baixar PDF</button>
                <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-ink text-cream">Copiar instrução</button>
              </div>
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
      </div>
    </Layout>
  );
}

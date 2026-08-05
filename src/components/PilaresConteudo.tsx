import { useEffect, useState } from "react";
import { TrendingUp, Users, DollarSign, Plus, X, Check, Wand2 } from "lucide-react";
import PromptCard from "./PromptCard";
import TarefaCompleta from "./TarefaCompleta";

// Os Pilares de Conteúdo — os 3 a 5 grandes temas que organizam tudo o que a
// pessoa publica. Vivem numa página própria dentro de "Cria o teu plano".
// (Antes estavam embutidos na página de Boas-vindas.)

const PILARES_KEY = "leveza.pilares-conteudo.v1";

const OBJETIVOS = [
  { id: "Autoridade", icon: TrendingUp, desc: "Posicionar-se como referência", cor: "#C8487E" },
  { id: "Seguidores", icon: Users, desc: "Alcance e identificação", cor: "#F0A766" },
  { id: "Vendas", icon: DollarSign, desc: "Conduzir à decisão", cor: "#2E7CB8" },
];
const OBJ_IDS = OBJETIVOS.map((o) => o.id);

// Prompt pronto (preenchido com o Documento Mestre pelo PromptCard) para sugerir pilares.
const PROMPT_PILARES = `Você é o meu estrategista de conteúdo para Instagram. Com base no meu contexto, ajude-me a definir os meus PILARES DE CONTEÚDO.

📋 MEU CONTEXTO (Documento Mestre)
- Nome: [nome]
- Especialidade: [profissao]
- O que faço: [o_que_faz]
- Como resolvo: [como_resolve]
- Público: [publico]
- Dores do público:
[dores_lista]
- Promessa do método: [promessa]
- Tom de voz: [tom_de_voz]

🎯 TAREFA
Proponha de 3 a 5 PILARES DE CONTEÚDO — os grandes temas que vou usar para organizar TUDO o que publico. Baseie-se nas dores do meu público e no meu método.

Para CADA pilar, entregue exatamente:
- **Nome do pilar** (curto e claro)
- **O que ensina** ao meu seguidor (1 frase)
- **Objetivo principal**: Autoridade, Seguidores OU Vendas

No fim, explique em 2 linhas como eu rodo estes pilares ao longo da semana (Reels para atrair, carrosséis para aprofundar, stories para vender). Use o meu tom de voz.`;

type Pilar = { nome: string; ensina: string; objetivo: string };
const pilarVazio = (): Pilar => ({ nome: "", ensina: "", objetivo: "Autoridade" });

// Deteta o objetivo (Autoridade / Seguidores / Vendas) numa linha de texto.
function objetivoDe(s: string): string {
  const l = s.toLowerCase();
  if (/vend/.test(l)) return "Vendas";
  if (/segui/.test(l)) return "Seguidores";
  if (/autorid/.test(l)) return "Autoridade";
  return "";
}
// Limpa markdown/bullets/numeração do início de uma linha.
function limparLinha(s: string): string {
  return s.replace(/\*\*/g, "").replace(/^[\s\-*#>•·–—]+/, "").replace(/^\d+[.)]\s*/, "").replace(/[:：]\s*$/, "").trim();
}
const aposDoisPontos = (s: string): string => { const i = s.search(/[:：]/); return i >= 0 ? s.slice(i + 1) : s; };

// Lê o resultado colado do ChatGPT e extrai os pilares (nome, o que ensina, objetivo).
// Tolerante a formatos: "Pilar N:", listas numeradas, negrito, com/sem rótulos.
export function parsePilaresResultado(texto: string): Pilar[] {
  const t = (texto || "").replace(/\r/g, "").trim();
  if (!t) return [];
  // 1) tenta partir por cabeçalho "Pilar N"
  let blocos = t.split(/\n(?=\s*(?:[-*#>]*\s*)?\**\s*pilar\s*\d+\b)/i).map((b) => b.trim()).filter(Boolean);
  // 2) senão, por linhas numeradas "1." / "2)"
  if (blocos.length < 2) blocos = t.split(/\n(?=\s*\d+[.)]\s+\S)/).map((b) => b.trim()).filter(Boolean);
  // 3) senão, por linhas em branco
  if (blocos.length < 2) blocos = t.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  const out: Pilar[] = [];
  for (const bloco of blocos) {
    const linhas = bloco.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!linhas.length) continue;

    // Caso "tudo numa linha": "Nome — ensina X. Objetivo: Y"
    if (linhas.length === 1) {
      const obj1 = objetivoDe(linhas[0]) || "Autoridade";
      let l = limparLinha(linhas[0])
        .replace(/[.\-–—(]*\s*objetivo\b[^:：]*[:：]?\s*(autoridade|seguidores|vendas)\s*\)?\s*\.?\s*$/i, "")
        .replace(/\((autoridade|seguidores|vendas)\)\s*\.?\s*$/i, "")
        .trim();
      const partes = l.split(/\s*[—–:]\s*|\s+-\s+/);
      const nome1 = (partes[0] || "").trim();
      const ensina1 = (partes.slice(1).join(" - ") || "").replace(/^ensina(?:\s+(?:a|o|que))?\s*[:：]?\s*/i, "").trim();
      if (nome1 || ensina1) out.push({ nome: nome1, ensina: ensina1, objetivo: obj1 });
      continue;
    }

    let nome = "", ensina = "", objetivo = "";
    for (const l of linhas) {
      const low = l.toLowerCase();
      if (!nome && /nome do pilar|^nome\b/.test(low)) { nome = limparLinha(aposDoisPontos(l)); continue; }
      if (!ensina && /(o que ensina|ensina|ensino|1 frase|descri)/.test(low)) { ensina = limparLinha(aposDoisPontos(l)); continue; }
      if (!objetivo && /objetivo/.test(low)) { objetivo = objetivoDe(l); continue; }
    }
    if (!nome) {
      const m = linhas[0].match(/pilar\s*\d+\s*[:\-–—]\s*(.+)/i);
      if (m) nome = limparLinha(m[1]);
      else { const neg = bloco.match(/\*\*([^*]+)\*\*/); nome = limparLinha(neg ? neg[1] : linhas[0]); }
    }
    if (!ensina) {
      const cand = linhas.find((l) => {
        const c = limparLinha(l);
        return c && c !== nome && !/^pilar\s*\d+/i.test(l) && !/objetivo/i.test(l);
      });
      if (cand) ensina = limparLinha(aposDoisPontos(cand));
    }
    if (!objetivo) objetivo = objetivoDe(bloco) || "Autoridade";
    if (nome || ensina) out.push({ nome, ensina, objetivo });
  }
  return out.slice(0, 5);
}

export default function PilaresConteudo() {
  const [pilares, setPilares] = useState<Pilar[]>([pilarVazio(), pilarVazio(), pilarVazio()]);
  const [saved, setSaved] = useState(false);
  const [colar, setColar] = useState("");
  const [aviso, setAviso] = useState<{ t: string; erro?: boolean }>({ t: "" });

  // Carrega uma vez (só leitura).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PILARES_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) setPilares(arr);
      }
    } catch { /* ignora */ }
  }, []);

  // Persistência EXPLÍCITA em cada alteração — evita a corrida de mount.
  const update = (fn: (prev: Pilar[]) => Pilar[]) =>
    setPilares((prev) => {
      const next = fn(prev);
      try { localStorage.setItem(PILARES_KEY, JSON.stringify(next)); } catch { /* ignora */ }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1500);
      return next;
    });

  const setPilar = (i: number, patch: Partial<Pilar>) =>
    update((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const addPilar = () => update((prev) => (prev.length < 5 ? [...prev, pilarVazio()] : prev));
  const removePilar = (i: number) => update((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const preenchidos = pilares.filter((p) => p.nome.trim()).length;

  // Lê o resultado colado do ChatGPT e preenche os pilares de uma vez.
  const aplicarColado = () => {
    const novos = parsePilaresResultado(colar).map((p) => ({
      ...p,
      objetivo: OBJ_IDS.includes(p.objetivo) ? p.objetivo : "Autoridade",
    }));
    if (!novos.length) {
      setAviso({ t: "Não consegui ler os pilares. Cola o resultado completo do ChatGPT (com o nome, o que ensina e o objetivo de cada pilar).", erro: true });
      window.setTimeout(() => setAviso({ t: "" }), 4500);
      return;
    }
    update(() => novos);
    setColar("");
    setAviso({ t: `${novos.length} ${novos.length === 1 ? "pilar preenchido" : "pilares preenchidos"} ✓ — confere e ajusta se precisares.` });
    window.setTimeout(() => setAviso({ t: "" }), 4000);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Passo 1 · Definir</p>
        <h3 className="font-serif text-xl text-ink mb-1.5">Os teus Pilares de Conteúdo</h3>
        <p className="text-sm text-ink/60 leading-relaxed max-w-2xl mb-5">
          Os pilares são os <b>3 a 5 grandes temas</b> que organizam tudo o que publicas. Cada post nasce de um pilar e serve
          um objetivo: <b>autoridade</b>, <b>seguidores</b> ou <b>vendas</b>. Define-os aqui uma vez — depois é só criar.
        </p>

        {/* Ajuda: prompt para sugerir pilares a partir do Doc Mestre */}
        <PromptCard
          titulo="Precisas de ajuda para começar?"
          descricao="Copia este prompt (já vem com o teu Documento Mestre), cola no ChatGPT e recebe uma sugestão de pilares. Depois preenche os campos abaixo."
          prompt={PROMPT_PILARES}
          rotuloBotao="Copiar prompt de sugestão"
        />

        {/* Colar o resultado do ChatGPT e aplicar direto nos pilares */}
        <div className="rounded-2xl border border-terracotta/25 bg-terracotta/5 p-4 mt-3">
          <p className="text-sm font-semibold text-ink mb-1">Já tens a resposta do ChatGPT?</p>
          <p className="text-[13px] text-ink/60 mb-2.5 leading-relaxed">
            Cola aqui o que o ChatGPT respondeu e eu preencho os pilares abaixo automaticamente. Depois é só rever.
          </p>
          <textarea
            value={colar}
            onChange={(e) => setColar(e.target.value)}
            rows={4}
            placeholder="Cola aqui a resposta do ChatGPT (com o nome de cada pilar, o que ensina e o objetivo)…"
            className="w-full rounded-xl border border-border p-2.5 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-terracotta transition-colors resize-y mb-2 bg-white"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={aplicarColado}
              disabled={!colar.trim()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-ink text-cream hover:bg-terracotta transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Wand2 size={14} /> Aplicar aos pilares
            </button>
            {aviso.t && (
              <span className={`text-xs font-medium ${aviso.erro ? "text-amber-700" : "text-sage"}`}>{aviso.t}</span>
            )}
          </div>
        </div>

        {/* Editor dos pilares */}
        <div className="space-y-3 mt-2">
          {pilares.map((p, i) => (
            <div key={i} className="rounded-2xl border border-border bg-white shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="w-6 h-6 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  Pilar {i + 1}
                </span>
                {pilares.length > 1 && (
                  <button onClick={() => removePilar(i)} className="text-ink/30 hover:text-terracotta transition-colors" aria-label="Remover pilar">
                    <X size={16} />
                  </button>
                )}
              </div>
              <input
                value={p.nome}
                onChange={(e) => setPilar(i, { nome: e.target.value })}
                placeholder="Nome do pilar (ex.: Bastidores do método)"
                className="w-full rounded-xl border border-border p-2.5 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-terracotta transition-colors mb-2"
              />
              <input
                value={p.ensina}
                onChange={(e) => setPilar(i, { ensina: e.target.value })}
                placeholder="O que ensina ao seguidor (1 frase)"
                className="w-full rounded-xl border border-border p-2.5 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-terracotta transition-colors mb-3"
              />
              <div className="flex flex-wrap gap-1.5">
                {OBJ_IDS.map((o) => (
                  <button
                    key={o}
                    onClick={() => setPilar(i, { objetivo: o })}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${p.objetivo === o ? "bg-terracotta text-cream border-terracotta" : "bg-white border-border text-ink/70 hover:border-terracotta/50"}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          {pilares.length < 5 ? (
            <button onClick={addPilar} className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:text-terracotta-dark transition-colors">
              <Plus size={15} /> Adicionar pilar
            </button>
          ) : <span />}
          <span className={`text-xs inline-flex items-center gap-1.5 transition-opacity ${saved ? "text-sage opacity-100" : "text-ink/35 opacity-100"}`}>
            {saved ? <><Check size={13} /> Guardado</> : `${preenchidos} de ${pilares.length} preenchidos · guarda automaticamente`}
          </span>
        </div>
      </div>

      {/* Objetivos + próximo passo */}
      <div>
        <p className="text-sm font-semibold text-ink mb-3">Cada pilar serve um destes objetivos:</p>
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {OBJETIVOS.map((o) => {
            const Icon = o.icon;
            return (
              <div key={o.id} className="rounded-2xl border border-border bg-white p-4 flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${o.cor}1a`, color: o.cor }}>
                  <Icon size={17} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{o.id}</p>
                  <p className="text-xs text-ink/55 leading-snug mt-0.5">{o.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <TarefaCompleta id="redes.pilares" tipo="etapa" />
      </div>
    </div>
  );
}

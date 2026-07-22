import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { TrendingUp, Users, DollarSign, ArrowRight, Plus, X, Check } from "lucide-react";
import PromptCard from "./PromptCard";

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

export default function PilaresConteudo() {
  const [pilares, setPilares] = useState<Pilar[]>([pilarVazio(), pilarVazio(), pilarVazio()]);
  const [saved, setSaved] = useState(false);

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
        <Link
          to="/maquina-analises"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors"
        >
          Próximo passo · Máquina de Análises <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

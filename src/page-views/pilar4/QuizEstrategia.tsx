import { useState } from "react";
import { Link } from "@/lib/router-compat";
import { Compass, RotateCcw, ArrowRight, Sparkles } from "lucide-react";

type Estrategia = "alto" | "lancamento" | "eventos" | "low";
type Scores = Record<Estrategia, number>;

const ZERO: Scores = { alto: 0, lancamento: 0, eventos: 0, low: 0 };

type Opcao = { label: string; scores: Partial<Scores> };
type Pergunta = { q: string; opcoes: Opcao[] };

const PERGUNTAS: Pergunta[] = [
  {
    q: "Quanto custa (ou vai custar) a tua oferta principal?",
    opcoes: [
      { label: "Até R$ 197", scores: { low: 2 } },
      { label: "Entre R$ 200 e R$ 2.000", scores: { lancamento: 1, low: 1 } },
      { label: "R$ 2.000 ou mais", scores: { alto: 2 } },
    ],
  },
  {
    q: "Como preferes vender?",
    opcoes: [
      { label: "1 a 1, com proximidade", scores: { alto: 2 } },
      { label: "Em escala, para muitos ao mesmo tempo", scores: { lancamento: 1, low: 1 } },
      { label: "Ao vivo, num palco", scores: { eventos: 2 } },
    ],
  },
  {
    q: "Já tens audiência para aquecer antes de vender?",
    opcoes: [
      { label: "Sim, tenho seguidores ou lista", scores: { lancamento: 2 } },
      { label: "Pouca ou nenhuma ainda", scores: { alto: 1, eventos: 1 } },
    ],
  },
  {
    q: "Estás confortável em aparecer e falar em público?",
    opcoes: [
      { label: "Sim, adoro palco e presencial", scores: { eventos: 2 } },
      { label: "Prefiro vender online", scores: { alto: 1, lancamento: 1 } },
    ],
  },
  {
    q: "Qual é o teu objetivo agora?",
    opcoes: [
      { label: "Validar uma ideia com algo acessível", scores: { low: 2 } },
      { label: "Faturar alto com poucos clientes", scores: { alto: 2 } },
      { label: "Fazer um lançamento com escala", scores: { lancamento: 2 } },
      { label: "Vender no palco, num evento", scores: { eventos: 2 } },
    ],
  },
];

const RESULTADOS: Record<Estrategia, { titulo: string; desc: string; to: string }> = {
  alto: {
    titulo: "Venda de Alto Ticket",
    desc: "Produtos de R$ 2.000+ com sessão de diagnóstico ou pitch presencial. Poucos clientes, alto valor.",
    to: "/metodo/pilar-4/alto-ticket",
  },
  lancamento: {
    titulo: "Lançamento — Sala Secreta",
    desc: "Aquece a tua audiência num espaço fechado e abre a oferta em escala.",
    to: "/metodo/pilar-4/lancamentos",
  },
  eventos: {
    titulo: "Venda Presencial",
    desc: "Cria o projeto do teu evento e vende com pitch de palco — alta taxa de conversão.",
    to: "/metodo/pilar-4/eventos-presenciais",
  },
  low: {
    titulo: "Low Ticket",
    desc: "Produtos até R$ 197 para validar, recuperar vendas e escalar.",
    to: "/metodo/pilar-4/low-ticket",
  },
};

// Desempate: ordem de prioridade quando há empate de pontos.
const PRIORIDADE: Estrategia[] = ["alto", "lancamento", "eventos", "low"];

function vencedor(s: Scores): Estrategia {
  let best: Estrategia = PRIORIDADE[0];
  for (const e of PRIORIDADE) {
    if (s[e] > s[best]) best = e;
  }
  return best;
}

export default function QuizEstrategia() {
  const [iniciado, setIniciado] = useState(false);
  const [passo, setPasso] = useState(0);
  const [scores, setScores] = useState<Scores>(ZERO);
  const [resultado, setResultado] = useState<Estrategia | null>(null);

  function responder(op: Opcao) {
    const novos = { ...scores };
    (Object.keys(op.scores) as Estrategia[]).forEach((k) => {
      novos[k] += op.scores[k] || 0;
    });
    if (passo + 1 >= PERGUNTAS.length) {
      setScores(novos);
      setResultado(vencedor(novos));
    } else {
      setScores(novos);
      setPasso(passo + 1);
    }
  }

  function recomecar() {
    setIniciado(false);
    setPasso(0);
    setScores(ZERO);
    setResultado(null);
  }

  // Intro
  if (!iniciado) {
    return (
      <div className="rounded-2xl border border-terracotta/30 bg-white p-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Compass size={16} className="text-terracotta" />
          <p className="font-serif text-lg text-ink">Descobrir minha estratégia</p>
        </div>
        <p className="text-sm text-ink/60 mb-4">
          Responde a 5 perguntas rápidas e a IA indica qual estratégia de venda faz mais sentido para ti
          agora — depois abrimos só o caminho que precisas de estudar.
        </p>
        <button
          onClick={() => setIniciado(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors"
        >
          <Sparkles size={15} /> Começar
        </button>
      </div>
    );
  }

  // Resultado
  if (resultado) {
    const r = RESULTADOS[resultado];
    return (
      <div className="rounded-2xl border border-terracotta/30 bg-white p-6">
        <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta mb-1">
          A tua estratégia recomendada
        </p>
        <h3 className="font-serif text-2xl text-ink mb-2">{r.titulo}</h3>
        <p className="text-sm text-ink/65 mb-5 max-w-xl">{r.desc}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            to={r.to}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors"
          >
            Estudar este caminho <ArrowRight size={15} />
          </Link>
          <button
            onClick={recomecar}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--color-border)] text-sm text-ink hover:border-terracotta transition-colors"
          >
            <RotateCcw size={14} /> Refazer
          </button>
        </div>
      </div>
    );
  }

  // Pergunta atual
  const p = PERGUNTAS[passo];
  const pct = Math.round((passo / PERGUNTAS.length) * 100);

  return (
    <div className="rounded-2xl border border-terracotta/30 bg-white p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] tracking-[0.2em] uppercase text-ink/45">
          Pergunta {passo + 1} de {PERGUNTAS.length}
        </p>
        <button onClick={recomecar} className="text-xs text-ink/45 hover:text-ink inline-flex items-center gap-1">
          <RotateCcw size={11} /> Recomeçar
        </button>
      </div>
      <div className="h-1.5 rounded-full bg-cream-warm overflow-hidden mb-5">
        <div className="h-full bg-terracotta transition-all" style={{ width: `${pct}%` }} />
      </div>

      <h3 className="font-serif text-xl text-ink mb-4">{p.q}</h3>
      <div className="space-y-2.5">
        {p.opcoes.map((op, i) => (
          <button
            key={i}
            onClick={() => responder(op)}
            className="w-full text-left rounded-xl border border-[var(--color-border)] bg-cream-warm/40 px-4 py-3 text-sm text-ink hover:border-terracotta hover:bg-terracotta/5 transition-colors"
          >
            {op.label}
          </button>
        ))}
      </div>
    </div>
  );
}

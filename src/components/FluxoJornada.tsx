// Fluxo horizontal da jornada de conteúdo — cards clicáveis ligados por linhas,
// com bifurcação no fim (Plano de Posts vs Criação Livre). Cada card tem a sua
// cor (paleta Instagram), mostra a % de conclusão e um check no canto superior
// direito quando está a 100%.

import type { ComponentType } from "react";
import { Link } from "@/lib/router-compat";
import {
  Brain,
  Crown,
  LayoutGrid,
  LineChart,
  CalendarDays,
  Sparkles,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { useFluxoProgresso, type CardProgresso } from "@/lib/fluxo-jornada";

type CardDef = {
  key: string;
  passo: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  titulo: string;
  sub: string;
  to: string;
  cor: string; // cor principal (Instagram)
  cor2: string; // cor secundária (para o gradiente)
};

// Paleta Instagram — cada card a sua cor.
const CAMINHO: CardDef[] = [
  { key: "cerebro", passo: "Passo 1", icon: Brain, titulo: "Documento Mestre", sub: "A base que alimenta todo o teu conteúdo.", to: "/doc-mestre", cor: "#833AB4", cor2: "#5851DB" },
  { key: "autoridade", passo: "Passo 2", icon: Crown, titulo: "Criar autoridade", sub: "Mostra o que sabes às pessoas certas.", to: "/metodo/pilar-2/identidade", cor: "#C13584", cor2: "#833AB4" },
  { key: "pilares", passo: "Passo 3", icon: LayoutGrid, titulo: "Os teus pilares de conteúdo", sub: "Os temas que vais dominar.", to: "/metodo/pilar-2/redes-sociais?aba=pilares", cor: "#E1306C", cor2: "#C13584" },
  { key: "analise", passo: "Passo 4", icon: LineChart, titulo: "Analisar o teu perfil", sub: "Vê o que resulta e o que falta.", to: "/maquina-analises", cor: "#F56040", cor2: "#E1306C" },
  { key: "plano", passo: "Passo 5", icon: CalendarDays, titulo: "Plano de Posts · Conteúdo Viral", sub: "Planeia e agenda o que vais publicar.", to: "/metodo/pilar-2/redes-sociais?aba=plano", cor: "#FCAF45", cor2: "#F56040" },
];

// Ramo à parte — sozinho numa linha por baixo do fluxo principal.
const RAMO_LIVRE: CardDef = {
  key: "livre", passo: "", icon: Sparkles, titulo: "Criação Livre", sub: "Tu é que decides o que crias — todas as ferramentas que precisas.", to: "/criacao-livre", cor: "#405DE6", cor2: "#5851DB",
};

// Selo no canto: check (100%), anel de progresso, ou seta (ferramenta aberta).
function Selo({ prog, cor }: { prog: CardProgresso; cor: string }) {
  if (prog.done) {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full text-white" style={{ background: cor }}>
        <Check size={14} strokeWidth={3} />
      </span>
    );
  }
  if (!prog.rastreado) {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-ink/40">
        <ArrowUpRight size={14} />
      </span>
    );
  }
  const r = 12;
  const circ = 2 * Math.PI * r;
  return (
    <span className="relative flex h-7 w-7 items-center justify-center">
      <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90">
        <circle cx="14" cy="14" r={r} fill="none" strokeWidth="3" className="stroke-black/10" />
        <circle
          cx="14"
          cy="14"
          r={r}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ stroke: cor }}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - prog.pct / 100)}
        />
      </svg>
      <span className="absolute text-[8px] font-bold text-ink/60">{prog.pct}</span>
    </span>
  );
}

function Cartao({ card, prog, largura = "w-[210px]" }: { card: CardDef; prog: CardProgresso; largura?: string }) {
  const Icon = card.icon;
  const grad = `linear-gradient(135deg, ${card.cor}, ${card.cor2})`;
  return (
    <Link
      to={card.to}
      className={`group relative flex min-h-[200px] ${largura} shrink-0 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1`}
    >
      {/* barra de cor no topo */}
      <span className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${card.cor}, ${card.cor2})` }} />

      <div className="mb-2.5 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm" style={{ background: grad }}>
          <Icon size={17} strokeWidth={2} />
        </span>
        <Selo prog={prog} cor={card.cor} />
      </div>

      {card.passo && (
        <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: card.cor }}>
          {card.passo}
        </p>
      )}
      <p className="mt-0.5 text-[15px] font-semibold leading-tight text-ink">{card.titulo}</p>
      <p className="mt-1 line-clamp-2 text-xs text-ink/50">{card.sub}</p>

      <div className="mt-auto pt-3">
        {prog.rastreado ? (
          <>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${prog.pct}%`, background: `linear-gradient(90deg, ${card.cor}, ${card.cor2})` }} />
            </div>
            <p className="mt-1 text-[11px] text-ink/45">
              {prog.done ? "Concluído" : prog.pct > 0 ? `${prog.pct}% concluído` : "Por começar"}
            </p>
          </>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: card.cor }}>
            Abrir <ArrowUpRight size={13} />
          </span>
        )}
      </div>
    </Link>
  );
}

// Seta sólida (como a imagem PNG) — usa currentColor para herdar o cinza atual.
function Seta({ className }: { className?: string }) {
  return (
    <svg width="30" height="14" viewBox="0 0 24 16" fill="currentColor" aria-hidden className={className}>
      <path d="M0 6 H14 V2.5 L23 8 L14 13.5 V10 H0 Z" />
    </svg>
  );
}

function Conector() {
  return (
    <div className="flex shrink-0 items-center self-center px-2 text-ink/25">
      <Seta />
    </div>
  );
}

export default function FluxoJornada() {
  const prog = useFluxoProgresso();
  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-3 md:mx-0 md:px-0">
      <div className="flex min-w-max flex-col gap-3">
        {/* Fila principal: Passo 1 → 5 */}
        <div className="flex items-start gap-0">
          {CAMINHO.map((card, i) => (
            <div key={card.key} className="flex items-center">
              <Cartao card={card} prog={prog[card.key]} />
              {i < CAMINHO.length - 1 && <Conector />}
            </div>
          ))}
        </div>

        {/* Linha a separar a fila de cima do card Criação Livre */}
        <div className="mt-[50px] w-full border-t border-black/10" />

        {/* Criação Livre — mesmo design dos outros cards, mas maior (420px) */}
        <div className="mt-8 flex w-[420px] flex-col">
          <Cartao card={RAMO_LIVRE} prog={prog[RAMO_LIVRE.key]} largura="w-[420px]" />
        </div>
      </div>
    </div>
  );
}

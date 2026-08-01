// Criação Livre — hub com cards para todas as páginas do "Conteúdo Todo Dia"
// que antes estavam no menu lateral (posts avulsos, formatos/aulas, ferramentas…).
// Entra-se aqui a partir do fluxo da jornada (Passo 5 · B).

import type { ComponentType } from "react";
import Layout from "../components/Layout";
import PillarHeader from "../components/PillarHeader";
import PilarBreadcrumb from "../components/PilarBreadcrumb";
import { Link } from "@/lib/router-compat";
import {
  ArrowUpRight,
  LayoutGrid,
  Sparkles,
  UserRound,
  Film,
  MessageSquare,
  Bot,
} from "lucide-react";

type Item = { label: string; to: string; icon: ComponentType<{ size?: number }> };
type Grupo = { titulo: string; itens: Item[] };

const GRUPOS: Grupo[] = [
  {
    titulo: "Aulas e formatos",
    itens: [
      { label: "Posicionamento e Bio", to: "/metodo/pilar-2/redes-sociais?aba=bio", icon: UserRound },
      { label: "Formatos de Conteúdo", to: "/formatos", icon: Film },
    ],
  },
  {
    titulo: "Ferramentas essenciais",
    itens: [
      { label: "Automação de mensagens", to: "/metodo/pilar-2/redes-sociais?aba=automacao", icon: MessageSquare },
      { label: "Carousel Snap", to: "/metodo/pilar-2/redes-sociais?aba=carousel-snap", icon: LayoutGrid },
      { label: "Assistente Cat.IA", to: "/metodo/pilar-2/redes-sociais?aba=assistente", icon: Bot },
    ],
  },
];

export default function CriacaoLivre() {
  return (
    <Layout>
      <PilarBreadcrumb
        pilar="redes"
        pilarLabel="Conteúdo Todo Dia"
        backTo="/metodo"
        backLabel="Voltar atrás"
        historyBack
      />
      <PillarHeader
        numeral="✦"
        icon={<Sparkles size={18} />}
        pilarLabel="Conteúdo Todo Dia"
        titulo="Criação Livre"
        tituloHighlight="ao teu ritmo"
        subtitulo="Todas as ferramentas e aulas num só sítio — entra onde precisares."
        bg="linear-gradient(115deg, #405DE6 0%, #833AB4 40%, #C13584 65%, #F56040 88%, #FCAF45 100%)"
      />
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        {GRUPOS.map((g) => (
          <div key={g.titulo} className="mb-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta">{g.titulo}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.itens.map((it) => {
                const Icon = it.icon;
                return (
                  <Link
                    key={it.label}
                    to={it.to}
                    className="group flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 transition-colors hover:border-terracotta"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
                      <Icon size={19} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium text-ink">{it.label}</span>
                    <ArrowUpRight size={16} className="shrink-0 text-ink/30 transition-colors group-hover:text-terracotta" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

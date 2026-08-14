// Ferramentas Essenciais — hub das ferramentas (automação, Carousel Snap,
// assistente). Ligada a partir da jornada ("Criar com os Agentes").

import type { ComponentType } from "react";
import Layout from "../components/Layout";
import PillarHeader from "../components/PillarHeader";
import PilarBreadcrumb from "../components/PilarBreadcrumb";
import { Link } from "@/lib/router-compat";
import { ArrowUpRight, Wrench, MessageSquare, LayoutGrid, Bot } from "lucide-react";

type Item = { label: string; sub: string; to: string; icon: ComponentType<{ size?: number }> };

const ITENS: Item[] = [
  { label: "Automação de mensagens", sub: "Respostas automáticas nas DM.", to: "/metodo/pilar-2/redes-sociais?aba=automacao", icon: MessageSquare },
  { label: "Carousel Snap", sub: "Transforma imagens em carrosséis.", to: "/metodo/pilar-2/redes-sociais?aba=carousel-snap", icon: LayoutGrid },
  { label: "Assistente Cat.IA", sub: "O teu assistente de conteúdo.", to: "/metodo/pilar-2/redes-sociais?aba=assistente", icon: Bot },
];

export default function Ferramentas() {
  return (
    <Layout>
      <PilarBreadcrumb
        pilar="redes"
        pilarLabel="A tua jornada"
        backTo="/metodo"
        backLabel="Voltar atrás"
        historyBack
      />
      <PillarHeader
        numeral="✦"
        icon={<Wrench size={18} />}
        pilarLabel="A tua jornada"
        titulo="Ferramentas"
        tituloHighlight="Essenciais"
        subtitulo="As ferramentas que te poupam tempo — automação, carrosséis e o teu assistente."
        bg="linear-gradient(115deg, #405DE6 0%, #833AB4 40%, #C13584 65%, #F56040 88%, #FCAF45 100%)"
      />
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ITENS.map((it) => {
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
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">{it.label}</span>
                  <span className="block text-xs text-ink/55">{it.sub}</span>
                </span>
                <ArrowUpRight size={16} className="shrink-0 text-ink/30 transition-colors group-hover:text-terracotta" />
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

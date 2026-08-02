// Criação Livre — hub com cards para todas as páginas do "Conteúdo Todo Dia"
// que antes estavam no menu lateral (posts avulsos, formatos/aulas, ferramentas…).
// Entra-se aqui a partir do fluxo da jornada (Passo 5 · B).

import { useState, type ComponentType } from "react";
import Layout from "../components/Layout";
import PillarHeader from "../components/PillarHeader";
import PilarBreadcrumb from "../components/PilarBreadcrumb";
import PromptCard from "../components/PromptCard";
import { Link } from "@/lib/router-compat";
import { CRIAR_CONTEUDO, type Objetivo } from "@/data/criar-conteudo";
import {
  ArrowUpRight,
  LayoutGrid,
  Sparkles,
  UserRound,
  Film,
  MessageSquare,
  Bot,
  BookOpen,
  Video,
  Images,
  Layers,
  AlignLeft,
  Zap,
} from "lucide-react";

type Item = { label: string; to: string; icon: ComponentType<{ size?: number }> };
type Grupo = { titulo: string; itens: Item[] };

const GRUPOS: Grupo[] = [
  {
    titulo: "Aulas e formatos",
    itens: [
      { label: "Posicionamento e Bio", to: "/metodo/pilar-2/redes-sociais?aba=bio", icon: UserRound },
    ],
  },
  {
    titulo: "Cria o teu conteúdo",
    itens: [
      { label: "Cria a tua série", to: "/metodo/pilar-2/reels-em-serie", icon: Film },
      { label: "Yap Content", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=roteiros", icon: BookOpen },
      { label: "Reels virais", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=reels", icon: Video },
      { label: "Carrosséis virais", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=carrossel", icon: Images },
      { label: "Stories que vendem", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=stories", icon: Layers },
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

// Prompts prontos que vivem diretamente na Criação Livre (não têm página própria).
const OBJETIVOS: { id: Objetivo; label: string }[] = [
  { id: "autoridade", label: "Autoridade" },
  { id: "seguidores", label: "Seguidores" },
  { id: "vendas", label: "Vendas" },
];

const META_PROMPT: Record<string, { Icon: ComponentType<{ size?: number }>; cor: string }> = {
  legendas: { Icon: AlignLeft, cor: "#2FA98A" },
  ganchos: { Icon: Zap, cor: "#E0567A" },
};

const PROMPTS_LIVRE = CRIAR_CONTEUDO.filter((c) => c.id === "legendas" || c.id === "ganchos");

export default function CriacaoLivre() {
  const [objetivo, setObjetivo] = useState<Objetivo>("autoridade");

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
        {GRUPOS.map((g) => {
          const eConteudo = g.titulo === "Cria o teu conteúdo";
          return (
            <div key={g.titulo} className="mb-8">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-terracotta">{g.titulo}</p>

              {/* Seletor de objetivo (só na secção de conteúdo) */}
              {eConteudo && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mr-1">Objetivo do prompt</span>
                  {OBJETIVOS.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setObjetivo(o.id)}
                      className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${objetivo === o.id ? "bg-gradient-to-br from-terracotta to-terracotta-dark text-cream border-transparent" : "bg-white border-border text-ink hover:border-terracotta/50"}`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 items-start">
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

                {/* Prompts prontos — como cards na mesma grelha */}
                {eConteudo &&
                  PROMPTS_LIVRE.map((c) => {
                    const meta = META_PROMPT[c.id];
                    return (
                      <PromptCard
                        key={c.id}
                        titulo={c.titulo}
                        descricao={c.descricao}
                        prompt={c.prompts[objetivo]}
                        rotuloBotao="Copiar prompt"
                        icon={meta ? <meta.Icon size={20} /> : undefined}
                        cor={meta?.cor}
                        botaoCor="#C8487E"
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

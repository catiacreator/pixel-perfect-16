import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import EtapaCard from "../../components/EtapaCard";
import {
  Compass,
  Search,
  Zap,
  Rocket,
  Layers,
  CalendarDays,
  FileText,
  Megaphone,
  Trophy,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

type Etapa = {
  num: number;
  tipo: string;
  titulo: string;
  sub: string;
  to: string;
  icon: ReactNode;
  enBreve?: boolean;
  subLinks?: { label: string; to: string }[];
};

const ETAPAS: Etapa[] = [
  {
    num: 1,
    tipo: "Decisão",
    titulo: "Por onde você quer começar?",
    sub: "Escolha entre Atalho com Skill ou Caminho Passo a Passo.",
    to: "/metodo/pilar-4/atalho-skill",
    icon: <Compass size={18} />,
    subLinks: [
      { label: "Atalho com Skill", to: "/metodo/pilar-4/atalho-skill" },
      { label: "Caminho Passo a Passo", to: "/metodo/pilar-4/passo-a-passo" },
    ],
  },
  {
    num: 2,
    tipo: "Base",
    titulo: "Fundação da venda",
    sub: "Antes de qualquer estratégia, valide e saiba responder objeções.",
    to: "/metodo/pilar-4/fundacao",
    icon: <Search size={18} />,
  },
  {
    num: 3,
    tipo: "Alto Ticket",
    titulo: "Venda de alto ticket",
    sub: "Quando o produto vale R$ 2.000+, você precisa de outras estratégias.",
    to: "/metodo/pilar-4/alto-ticket",
    icon: <Zap size={18} />,
  },
  {
    num: 4,
    tipo: "Lançamento",
    titulo: "Lançamentos e estratégias",
    sub: "Estratégias de venda em escala — prepare o público antes de vender.",
    to: "/metodo/pilar-4/lancamentos",
    icon: <Rocket size={18} />,
  },
  {
    num: 5,
    tipo: "Escala",
    titulo: "Venda de low ticket",
    sub: "Produtos até R$ 197 — estratégia diferente, escala diferente.",
    to: "/metodo/pilar-4/low-ticket",
    icon: <Layers size={18} />,
    enBreve: true,
  },
  {
    num: 6,
    tipo: "Palco",
    titulo: "Venda presencial",
    sub: "Crie o projeto do seu evento e venda com pitch de palco.",
    to: "/metodo/pilar-4/eventos-presenciais",
    icon: <CalendarDays size={18} />,
  },
  {
    num: 7,
    tipo: "Texto",
    titulo: "Copy de venda",
    sub: "Crie a sua oferta: textos que vendem, narrativas e persuasão.",
    to: "/metodo/pilar-4/copy",
    icon: <FileText size={18} />,
  },
  {
    num: 8,
    tipo: "Anúncio",
    titulo: "Tráfego pago",
    sub: "Quando você já vende organicamente e quer escalar.",
    to: "/metodo/pilar-4/trafego-pago",
    icon: <Megaphone size={18} />,
    enBreve: true,
  },
  {
    num: 9,
    tipo: "Fechar",
    titulo: "Revise sua estratégia de venda",
    sub: "Veja sua jornada completa nos 4 pilares.",
    to: "/metodo/pilar-4/conclusao",
    icon: <Trophy size={18} />,
  },
];

const NUMERAL = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

export default function Pilar4Hub() {
  return (
    <Layout>
      <PilarBreadcrumb
        pilar={4}
        pilarLabel="Aprender a Vender"
        backTo="/metodo"
        backLabel="Voltar para Jornada"
      />
      <PillarHeader
        numeral="04"
        icon={<Wallet size={18} />}
        pilarLabel="Pilar 4"
        titulo="Aprender a Vender"
        tituloHighlight="no Digital"
        subtitulo="Porque ninguém te ensinou isso na faculdade."
      />

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-10 md:pt-14 pb-24">
        {/* Etapa 1 — bifurcação em destaque */}
        <Link
          to="/metodo/pilar-4/atalho-skill"
          className="group relative overflow-hidden bg-terracotta rounded-2xl border border-terracotta shadow-[0_14px_36px_-18px_rgba(90,40,25,0.55)] px-6 md:px-8 py-7 md:py-8 mb-8 grid grid-cols-[3.5rem_1fr_auto] md:grid-cols-[4rem_1fr_auto] gap-5 md:gap-8 items-center transition-all duration-300 hover:-translate-y-1"
        >
          <div className="font-display text-4xl md:text-5xl text-cream/30 tabular-nums leading-none">I</div>
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.25em] uppercase text-cream/80 font-medium mb-1.5">
              Etapa 1 · Decisão — comece por aqui
            </p>
            <h3 className="font-display text-lg md:text-xl tracking-tight text-cream leading-snug mb-1.5">
              Por onde você quer começar?
            </h3>
            <p className="text-sm md:text-[15px] text-cream/75 leading-relaxed max-w-2xl">
              Escolha o <strong className="text-cream">Atalho com Skill</strong> (sessão guiada de 60 min no
              Claude) ou o <strong className="text-cream">Caminho Passo a Passo</strong>.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 bg-cream text-ink pl-5 pr-4 py-2.5 rounded-full text-sm font-medium">
            Escolher
          </span>
        </Link>

        <p className="text-[11px] tracking-[0.28em] uppercase text-ink/45 font-medium mb-5">
          As etapas do Pilar 4
        </p>

        <div className="space-y-4">
          {ETAPAS.slice(1).map((e) => (
            <EtapaCard
              key={e.num}
              numero={NUMERAL[e.num - 1]}
              icon={e.icon}
              label={`Etapa ${e.num} · ${e.tipo}`}
              titulo={e.titulo}
              descricao={e.sub}
              to={e.enBreve ? "" : e.to}
              bloqueado={e.enBreve}
              bloqueadoMsg={e.enBreve ? "Em construção — disponível em breve." : undefined}
              subLinks={e.subLinks}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

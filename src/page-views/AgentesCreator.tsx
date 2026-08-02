import { useState } from "react";
import Layout from "../components/Layout";
import PilarSidebar from "../components/PilarSidebar";
import PilarBreadcrumb from "../components/PilarBreadcrumb";
import ContentRenderer from "../components/agentes/ContentRenderer";
import VideoArea from "../components/curso/VideoArea";
import { Link, useSearchParams } from "@/lib/router-compat";
import { Sparkles, ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";
import { agents, type Agent } from "@/data/agentes-creator";

// "Agentes Creator" — grelha + detalhes dos agentes.
// Vive em dois sítios (mesmo conteúdo, contextos diferentes):
//  - contexto "curso": dentro do mini-curso Conteúdo com IA (barra lateral).
//  - contexto "livre": página autónoma, ligada a partir da Criação Livre.
// O `basePath` mantém os links internos (grelha ↔ detalhe) dentro do contexto certo.

function Intro({ basePath }: { basePath: string }) {
  return (
    <section className="px-5 md:px-10 pt-10 md:pt-14 pb-14 max-w-4xl mx-auto">
      <span className="inline-flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.24em] uppercase text-terracotta font-semibold">
          <Sparkles size={13} /> Coleção de Agentes IA
        </span>
        <span className="text-[8.5px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-full font-semibold bg-amber-400/20 text-amber-700">Bónus</span>
      </span>
      <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight mb-3">
        Agentes <span className="text-terracotta">Creator</span>
      </h1>
      <p className="text-ink/70 text-lg mb-2 max-w-2xl">
        Explora os agentes que criei, aprende como funcionam e começa a usá-los. Clica num agente para ver a aula e aceder ao link.
      </p>
      <p className="text-[13px] text-ink/50 mb-6">{agents.length} agentes · ChatGPT · Nível iniciante</p>

      {/* Vídeo da aula */}
      <VideoArea videoUrl="https://dlyzjirpovfqgchfwnrh.supabase.co/storage/v1/object/public/videos/curso-conteudo-ia/agentes-creator.mp4?v=3" titulo="Agentes Creator" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((a) => (
          <Link
            key={a.id}
            to={`${basePath}?agente=${a.id}`}
            className="group rounded-2xl border border-border bg-white p-5 hover:border-terracotta transition-colors flex flex-col"
          >
            <div className="text-4xl mb-3">{a.icon}</div>
            <p className="text-[10px] tracking-[0.18em] uppercase text-terracotta font-semibold mb-1">{a.category}</p>
            <h3 className="font-serif text-lg text-ink group-hover:text-terracotta transition-colors mb-1.5 leading-snug">{a.name}</h3>
            <p className="text-[13.5px] text-ink/60 leading-relaxed line-clamp-4 flex-1">{a.description}</p>
            <span className="inline-flex items-center gap-1.5 text-[13px] text-terracotta font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              Ver detalhes <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Detalhe({ agent, prev, next, basePath }: { agent: Agent; prev: Agent | null; next: Agent | null; basePath: string }) {
  const [tab, setTab] = useState(agent.tabs[0]?.label ?? "");
  const ativo = agent.tabs.find((t) => t.label === tab) ?? agent.tabs[0];

  return (
    <section className="px-5 md:px-10 pt-8 md:pt-10 pb-14 max-w-4xl mx-auto">
      <Link to={basePath} className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-terracotta transition-colors mb-5">
        <ArrowLeft size={15} /> Todos os agentes
      </Link>

      {agent.banner && (
        <div className="mb-7 rounded-2xl overflow-hidden border border-border">
          <img src={agent.banner} alt={agent.name} className="w-full h-44 md:h-60 object-cover" />
        </div>
      )}

      <div className="flex items-center gap-4 mb-3">
        <span className="text-5xl shrink-0">{agent.icon}</span>
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">{agent.category}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-ink leading-tight">{agent.name}</h1>
        </div>
      </div>
      <p className="text-ink/70 text-[15px] leading-relaxed mb-6 max-w-2xl">{agent.description}</p>

      <a
        href={agent.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors mb-8"
      >
        <ExternalLink size={15} /> Abrir Agente
      </a>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5 border-b border-border pb-3">
        {agent.tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.label)}
            className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
              (ativo?.label === t.label)
                ? "bg-terracotta text-cream"
                : "bg-ink/5 text-ink/65 hover:bg-ink/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-white p-5 md:p-7">
        {ativo && <ContentRenderer content={ativo.content} />}
      </div>

      {/* Nav entre agentes */}
      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-3">
        {prev ? (
          <Link to={`${basePath}?agente=${prev.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 hover:text-terracotta transition-colors">
            <ArrowLeft size={15} /> {prev.name}
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`${basePath}?agente=${next.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors">
            {next.name} <ArrowRight size={15} />
          </Link>
        ) : <span />}
      </div>
    </section>
  );
}

export default function AgentesCreator({
  basePath = "/agentes-creator",
  contexto = "curso",
}: {
  basePath?: string;
  contexto?: "curso" | "livre";
} = {}) {
  const [params] = useSearchParams();
  const id = params.get("agente");
  const idx = agents.findIndex((a) => a.id === id);
  const sel = idx >= 0 ? agents[idx] : null;

  const conteudo = sel ? (
    <Detalhe
      agent={sel}
      prev={idx > 0 ? agents[idx - 1] : null}
      next={idx < agents.length - 1 ? agents[idx + 1] : null}
      basePath={basePath}
    />
  ) : (
    <Intro basePath={basePath} />
  );

  // Contexto "livre": página autónoma ligada à Criação Livre (sem barra do curso).
  if (contexto === "livre") {
    return (
      <div className="theme-jornada">
        <Layout>
          <PilarBreadcrumb
            pilar="redes"
            pilarLabel="A tua jornada"
            backTo="/criacao-livre"
            backLabel="Voltar atrás"
          />
          {conteudo}
        </Layout>
      </div>
    );
  }

  // Contexto "curso": dentro do mini-curso Conteúdo com IA (com barra lateral).
  return (
    <div className="theme-cafe">
      <PilarSidebar pilar="conteudo-ia" />
      <div className="lg:pl-[280px]">
        <Layout>{conteudo}</Layout>
      </div>
    </div>
  );
}

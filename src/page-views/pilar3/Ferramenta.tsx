import { Link, useParams } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import PromptCard from "../../components/PromptCard";
import { Bot, ArrowLeft, ArrowRight, Check, ArrowUpRight } from "lucide-react";
import { FERRAMENTAS } from "@/data/pilar3";

export default function Ferramenta() {
  const { slug } = useParams<{ slug: string }>();
  const f = slug ? FERRAMENTAS[slug] : undefined;

  if (!f) {
    return (
      <Layout>
        <div className="px-5 md:px-10 py-16 max-w-3xl mx-auto text-center">
          <h1 className="font-display text-3xl text-ink mb-3">Ferramenta não encontrada</h1>
          <Link to="/metodo/pilar-3/descobrir" className="inline-flex items-center gap-1 text-sm text-terracotta font-semibold">
            <ArrowLeft size={14} /> Voltar a Descobrir
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo/pilar-3/descobrir" backLabel="Voltar a Descobrir" />
      <PillarHeader numeral="01" icon={<Bot size={18} />} pilarLabel={f.agente} titulo={f.nome} subtitulo={f.descricao} />

      <div className="max-w-[900px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        {f.videoUrl && (
          <div className="rounded-2xl overflow-hidden border border-border bg-black mb-6 aspect-video">
            <iframe
              src={f.videoUrl}
              title={f.nome}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        <div className="rounded-2xl border border-border bg-white p-5 md:p-6">
          <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-4 font-semibold">O que vais aprender</p>
          <ul className="space-y-3">
            {f.conteudo.map((c, i) => (
              <li key={i} className="flex gap-3 items-start text-sm md:text-base text-ink/80">
                <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA principal */}
        {f.cta && (
          <a
            href={f.cta.url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-terracotta text-cream px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-terracotta/90 transition-colors"
          >
            {f.cta.label} <ArrowUpRight size={15} strokeWidth={2.25} />
          </a>
        )}

        {/* Prompts (preenchidos com o Documento Mestre) */}
        {f.prompts?.map((p) => (
          <div key={p.titulo} className="mt-6">
            <PromptCard titulo={p.titulo} descricao={p.descricao} prompt={p.prompt} rotuloBotao={p.rotulo} />
          </div>
        ))}

        {/* Robô de apoio */}
        {f.roboApoio && (
          <div className="mt-6 rounded-2xl border border-border bg-white p-5 md:p-6">
            <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-3 font-semibold inline-flex items-center gap-2">
              <Bot size={14} /> Robô de apoio
            </p>
            <a
              href={f.roboApoio.url || "#"}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-terracotta/30 bg-terracotta/5 p-4 hover:bg-terracotta/10 transition-colors"
            >
              <span className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </span>
                <span className="min-w-0">
                  {f.roboApoio.tag && (
                    <span className="block text-[10px] uppercase tracking-[0.18em] text-terracotta font-semibold">{f.roboApoio.tag}</span>
                  )}
                  <span className="block text-sm font-semibold text-ink">{f.roboApoio.nome}</span>
                  <span className="block text-sm text-ink/60">{f.roboApoio.desc}</span>
                </span>
              </span>
            </a>
          </div>
        )}

        {/* Inspiração por nicho */}
        {f.nichos && f.nichos.length > 0 && (
          <div className="mt-8">
            <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-2 font-semibold">{f.nichosTitulo || "Inspiração por nicho"}</p>
            {f.nichosIntro && <p className="text-sm text-ink/60 mb-4 leading-relaxed">{f.nichosIntro}</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              {f.nichos.map((n) => (
                <div key={n.titulo} className="rounded-2xl border border-border bg-white p-5">
                  <p className="text-sm font-semibold text-ink mb-3">{n.titulo}</p>
                  <ul className="space-y-1.5">
                    {n.ideias.map((idea) => (
                      <li key={idea} className="flex gap-2 items-start text-sm text-ink/70">
                        <span className="w-1 h-1 rounded-full bg-terracotta shrink-0 mt-2" />
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-8">
          {f.prev ? (
            <Link to={`/metodo/pilar-3/ferramentas/${f.prev}`} className="inline-flex items-center gap-2 text-sm text-ink/65 hover:text-terracotta transition-colors">
              <ArrowLeft size={14} /> {FERRAMENTAS[f.prev].nome}
            </Link>
          ) : <span />}
          {f.next && (
            <Link to={`/metodo/pilar-3/ferramentas/${f.next}`} className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta">
              {FERRAMENTAS[f.next].nome} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}

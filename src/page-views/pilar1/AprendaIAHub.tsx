import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Link } from "@/lib/router-compat";
import { GraduationCap, Sparkles, Video, Wrench, ArrowUpRight } from "lucide-react";

const CARDS = [
  {
    icon: Sparkles,
    titulo: "Principais IAs",
    desc: "Aulas práticas de cada ferramenta de IA, com prompts e exemplos.",
    to: "/metodo/pilar-1/aprenda-ia/principais-ias",
    tags: ["ChatGPT", "Claude", "Gemini", "Grok", "NotebookLM", "Lovable"],
  },
  {
    icon: Video,
    titulo: "Vídeos profissionais com IA",
    desc: "Clones falantes, personagens animados e edição — HeyGen, Kling, Hedra e mais.",
    to: "/metodo/pilar-1/aprenda-ia/videos",
    tags: ["HeyGen", "Kling", "Hedra", "Flow", "CapCut"],
  },
  {
    icon: Wrench,
    titulo: "Ferramentas de produtividade",
    desc: "As ferramentas que tornam a sua produção mais rápida e profissional.",
    to: "/metodo/pilar-1/aprenda-ia/produtividade",
    tags: ["Tella", "OBS", "Notion"],
  },
];

export default function AprendaIAHub() {
  return (
    <Layout>
      <PilarBreadcrumb
        pilar="academia"
        pilarLabel="Academia de IA"
        backTo="/"
        backLabel="Voltar para Início"
      />
      <PillarHeader
        numeral="IA"
        icon={<GraduationCap size={18} />}
        pilarLabel="Academia de IA"
        titulo="Domine as Principais IAs para seu Negócio"
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-10 pb-24">
        <p className="text-ink/70 text-sm md:text-base mb-8 max-w-2xl">
          Escolha por onde começar. Cada área abre uma jornada de aulas, prompts e exemplos práticos.
        </p>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.titulo}
                to={c.to}
                className="group relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-7 flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-22px_rgba(90,40,25,0.4)] hover:border-terracotta/45"
              >
                <div className="mb-6">
                  <span className="w-[52px] h-[52px] rounded-2xl bg-terracotta text-cream flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(124,61,41,0.6)] transition-transform group-hover:scale-105">
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                </div>

                <h3 className="font-display text-2xl md:text-[1.7rem] leading-[1.1] tracking-[-0.02em] text-ink">
                  {c.titulo}
                </h3>
                <p className="text-sm text-ink/55 mt-2.5 leading-relaxed flex-1">{c.desc}</p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-terracotta/[0.08] text-terracotta"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <span className="mt-6 inline-flex items-center gap-2.5 text-sm font-semibold text-terracotta">
                  Abrir
                  <span className="w-9 h-9 rounded-full border border-terracotta/30 flex items-center justify-center transition-all duration-300 group-hover:bg-terracotta group-hover:text-cream group-hover:border-terracotta group-hover:translate-x-0.5">
                    <ArrowUpRight size={15} strokeWidth={2.25} />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

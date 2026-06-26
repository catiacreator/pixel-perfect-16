import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Link } from "@/lib/router-compat";
import { Wrench, Video, Monitor, FileText, ArrowUpRight } from "lucide-react";

type Ferramenta = {
  nome: string;
  desc: string;
  icon: typeof Video;
  to?: string;
  emBreve?: boolean;
};

const FERRAMENTAS: Ferramenta[] = [
  {
    nome: "Tella",
    desc: "Grava ecrã e câmara ao mesmo tempo, com edição automática — ideal para aulas e demos.",
    icon: Video,
    to: "/metodo/pilar-1/aprenda-ia/tella",
  },
  {
    nome: "OBS",
    desc: "Gravação e transmissão profissional, gratuita e flexível — para lives e captura de ecrã.",
    icon: Monitor,
    emBreve: true,
  },
  {
    nome: "Notion",
    desc: "Organize ideias, conteúdos e calendário num só lugar — a sua central de produtividade.",
    icon: FileText,
    emBreve: true,
  },
];

export default function Produtividade() {
  return (
    <Layout>
      <PilarBreadcrumb
        pilar="academia"
        pilarLabel="Academia de IA"
        backTo="/metodo/pilar-1/aprenda-ia"
        backLabel="Voltar para a Academia de IA"
      />
      <PillarHeader
        numeral="IA"
        icon={<Wrench size={18} />}
        pilarLabel="Academia de IA"
        titulo="Ferramentas de produtividade"
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-10 pb-24">
        <p className="text-ink/70 text-sm md:text-base mb-8 max-w-2xl">
          As ferramentas que tornam a sua produção mais rápida e profissional.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {FERRAMENTAS.map((f) => {
            const Icon = f.icon;
            const disponivel = !f.emBreve && f.to;
            const Wrapper: any = disponivel ? Link : "div";
            const props = disponivel ? { to: f.to } : {};
            return (
              <Wrapper
                key={f.nome}
                {...props}
                className={`group relative overflow-hidden rounded-3xl border p-6 md:p-7 flex flex-col transition-all duration-300 ease-out ${
                  disponivel
                    ? "bg-white border-[var(--color-border)] hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-22px_rgba(90,40,25,0.4)] hover:border-terracotta/45 cursor-pointer"
                    : "bg-cream-warm/40 border-dashed border-[var(--color-border)]"
                }`}
              >
                <div className="mb-6">
                  <span
                    className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      disponivel ? "bg-terracotta text-cream shadow-[0_8px_20px_-8px_rgba(124,61,41,0.6)]" : "bg-ink/5 text-ink/30"
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                </div>

                <h3 className={`font-display text-2xl leading-[1.1] tracking-[-0.02em] ${disponivel ? "text-ink" : "text-ink/50"}`}>
                  {f.nome}
                </h3>
                <p className={`text-sm mt-2.5 leading-relaxed flex-1 ${disponivel ? "text-ink/55" : "text-ink/40"}`}>
                  {f.desc}
                </p>

                <div className="mt-6 flex items-center justify-between gap-3">
                  {disponivel ? (
                    <span className="inline-flex items-center gap-2.5 text-sm font-semibold text-terracotta">
                      Abrir
                      <span className="w-9 h-9 rounded-full border border-terracotta/30 flex items-center justify-center transition-all duration-300 group-hover:bg-terracotta group-hover:text-cream group-hover:border-terracotta group-hover:translate-x-0.5">
                        <ArrowUpRight size={15} strokeWidth={2.25} />
                      </span>
                    </span>
                  ) : (
                    <span />
                  )}
                  {f.emBreve && (
                    <span className="text-[10px] font-medium tracking-[0.18em] uppercase px-3 py-1.5 rounded-full bg-ink/5 text-ink/40">
                      Em breve
                    </span>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Link } from "@/lib/router-compat";
import { TOOLS } from "@/data/aulas";
import { useAulaProgress } from "@/lib/use-aula-progress";
import { ArrowRight, Check, Hourglass, ImagePlus, Video, ArrowUpRight } from "lucide-react";

// Mapeia foto por slug — substitui pelos URLs reais depois do upload.
// Ex.: chatgpt: "/fotos/chatgpt.jpg"
const TOOL_PHOTOS: Record<string, string> = {};

export default function AprendaIAHub() {
  const { countDone } = useAulaProgress();

  return (
    <Layout>
      <PilarBreadcrumb
        pilar="academia"
        pilarLabel="Academia de IA"
        backTo="/"
        backLabel="Voltar para Início"
      />
      <PillarHeader
        numeral="01"
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1"
        titulo="Domine as Principais IAs para seu Negócio"
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-10 pb-24">
        <p className="text-ink/70 text-sm md:text-base mb-8 max-w-2xl">
          Escolha a IA que você quer aprender. Cada card abre uma jornada com aulas, prompts e
          exemplos práticos.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {TOOLS.map((tool) => {
            const ids = tool.aulas.map((a) => a.id);
            const done = countDone(tool.slug, ids);
            const total = ids.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            const photo = TOOL_PHOTOS[tool.slug];

            return (
              <Link
                key={tool.slug}
                to={`/metodo/pilar-1/aprenda-ia/${tool.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-ink shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Imagem ou placeholder */}
                {photo ? (
                  <img
                    src={photo}
                    alt={tool.nome}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tool.cor} flex items-center justify-center`}
                    aria-hidden
                  >
                    <div className="text-center px-3">
                      <ImagePlus size={28} className="mx-auto text-cream/40 mb-1.5" />
                      <p className="text-[10px] tracking-[0.2em] uppercase text-cream/55 font-medium">
                        Adiciona foto
                      </p>
                    </div>
                  </div>
                )}

                {/* Sobreposição escura inferior */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Conteúdo */}
                <div className="relative h-full flex flex-col justify-end p-3.5 md:p-4 text-cream">
                  <h3 className="font-tool text-lg md:text-xl uppercase tracking-tight leading-none drop-shadow-md">
                    {tool.nome}
                  </h3>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-medium">
                    <span className="text-cream/85">
                      {pct === 100 ? (
                        <span className="inline-flex items-center gap-1 text-sage">
                          <Check size={11} /> 100% visto
                        </span>
                      ) : (
                        <>{pct}% visto</>
                      )}
                    </span>
                    <span className="text-cream/75 tabular-nums">
                      {done}/{total}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-cream/15 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-terracotta to-gold transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Card — Vídeos com IA */}
        <Link
          to="/metodo/pilar-1/aprenda-ia/videos"
          className="group relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-8 mt-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-5 md:gap-8 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_55px_-22px_rgba(90,40,25,0.4)] hover:border-terracotta/45"
        >
          <span className="w-[60px] h-[60px] rounded-2xl bg-terracotta text-cream flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(124,61,41,0.6)] transition-transform group-hover:scale-105">
            <Video size={26} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-2xl md:text-[1.7rem] leading-[1.1] tracking-[-0.02em] text-ink">
              Vídeos profissionais com IA
            </h3>
            <p className="text-sm text-ink/55 mt-2 max-w-xl leading-relaxed">
              Clones falantes, personagens animados e edição — aulas práticas com HeyGen, Kling, Hedra e mais.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {["HeyGen", "Kling", "Hedra", "Flow", "CapCut"].map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-terracotta/[0.08] text-terracotta"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <span className="hidden md:flex w-11 h-11 rounded-full border border-terracotta/30 items-center justify-center text-terracotta transition-all group-hover:bg-terracotta group-hover:text-cream group-hover:border-terracotta shrink-0">
            <ArrowUpRight size={18} strokeWidth={2} />
          </span>
        </Link>

        {/* CTA próximo passo */}
        <div className="mt-10 flex justify-end">
          <Link
            to="/metodo/pilar-1/detetive-do-tempo"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-terracotta to-gold text-cream text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Próximo passo: Mapa do Tempo <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

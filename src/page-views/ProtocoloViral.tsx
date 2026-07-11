import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import { ArrowUpRight, ArrowLeft, Compass, Instagram, FileText, Lock } from "lucide-react";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";
import { useBloqueios } from "@/lib/bloqueios";

const CARDS = [
  {
    key: "jornada",
    tag: "O método · 4 pilares",
    titulo: "O Teu Método",
    desc: "Do tempo recuperado à venda — encontra o que ensinar e como te posicionar, passo a passo.",
    to: "/metodo",
    cta: "Ver a jornada",
    img: "/card-jornada.jpg",
    pos: "center calc(38% - 25px)",
    cor: "#C0653A",
    icon: Compass,
    estruturaId: "jornada",
  },
  {
    key: "instagram",
    tag: "Conteúdo · Instagram",
    titulo: "Conteúdo Todo Dia",
    desc: "Transforma o teu método em posts, linha editorial e calendário — para crescer com consistência.",
    to: "/metodo/pilar-2/redes-sociais",
    cta: "Criar conteúdo",
    img: "/redes-sociais.png?v=3",
    pos: "center 42%",
    cor: "#C8487E",
    icon: Instagram,
    estruturaId: "redes",
  },
];

export default function ProtocoloViral() {
  const bloqueadoParaAlunos = useBloqueadoParaAlunos();
  const { isBloqueado } = useBloqueios();
  return (
    <Layout>
      <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-10 md:pt-16 pb-20 md:pb-28">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-terracotta transition-colors mb-6">
          <ArrowLeft size={14} /> Voltar
        </Link>

        <div className="max-w-2xl mb-8 md:mb-10 fade-up">
          <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta mb-2">Mentoria · Instagram · não é sorte, é método</p>
          <h1 className="font-display text-6xl md:text-8xl tracking-[-0.03em] text-ink leading-[0.95]">
            Leveza <span className="italic font-normal text-terracotta">no Digital</span>
          </h1>
          <p className="text-ink/55 mt-5 leading-relaxed">
            O método que descobres na tua jornada vira conteúdo no Instagram. Começa pela base e escolhe por onde continuar.
          </p>
        </div>

        {/* Começa aqui → Documento Mestre */}
        <Link
          to="/doc-mestre"
          className="fade-up group relative flex items-center gap-4 md:gap-5 rounded-3xl bg-gradient-to-r from-terracotta to-terracotta-dark text-cream p-6 md:p-7 mb-5 md:mb-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_55px_-26px_rgba(90,40,25,0.7)]"
        >
          <span aria-hidden className="pointer-events-none absolute -top-16 -right-10 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <span className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <FileText size={22} strokeWidth={1.75} />
          </span>
          <div className="relative min-w-0 flex-1">
            <p className="text-[11px] tracking-[0.28em] uppercase text-cream/80 font-semibold">Começa aqui</p>
            <h2 className="font-display text-2xl md:text-3xl leading-tight mt-0.5">Documento Mestre</h2>
            <p className="text-sm text-cream/85 mt-1.5 leading-relaxed max-w-lg">
              A base que alimenta todo o teu conteúdo. Preenche uma vez — usa em todo o método.
            </p>
          </div>
          <span className="relative w-11 h-11 rounded-full border border-cream/50 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-cream group-hover:text-terracotta group-hover:translate-x-0.5">
            <ArrowUpRight size={17} strokeWidth={2.25} />
          </span>
        </Link>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            const eid = (c as { estruturaId?: string }).estruturaId;
            const locked = !!eid && isBloqueado(eid) && bloqueadoParaAlunos;
            const Wrapper: any = locked ? "div" : Link;
            const wrapperProps = locked ? { "aria-disabled": true } : { to: c.to };
            return (
              <Wrapper
                key={c.key}
                {...wrapperProps}
                className={`fade-up group relative overflow-hidden rounded-[28px] border border-white/60 flex flex-col justify-end min-h-[420px] md:min-h-[480px] p-7 md:p-9 transition-all duration-300 ${locked ? "cursor-not-allowed" : "hover:-translate-y-1.5 hover:shadow-[0_34px_70px_-30px_rgba(40,20,15,0.55)]"}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 bg-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${c.img})`, backgroundColor: c.cor, backgroundPosition: c.pos }}
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/92 via-black/62 to-transparent" />
                <span aria-hidden className="absolute top-0 left-0 right-0 h-1.5" style={{ background: c.cor }} />
                {locked && <div aria-hidden className="absolute inset-0 bg-black/35" />}

                <span className="absolute top-6 left-7 md:left-9 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 bg-white/12 border border-white/25 rounded-full px-3 py-1.5 backdrop-blur-sm">
                  <Icon size={13} /> {c.tag}
                </span>
                {locked && (
                  <span className="absolute top-6 right-7 md:right-9 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white bg-white/15 border border-white/30 rounded-full px-3 py-1.5 backdrop-blur-sm">
                    <Lock size={12} /> Em breve
                  </span>
                )}

                <div className="relative [text-shadow:0_2px_18px_rgba(0,0,0,0.6)]">
                  <h2 className="font-display text-3xl md:text-[2.4rem] leading-[1.02] tracking-[-0.02em] text-white">
                    {c.titulo}
                  </h2>
                  <p className="text-sm md:text-[15px] text-white/90 mt-3 leading-relaxed max-w-md">{c.desc}</p>
                  {locked ? (
                    <span className="mt-7 inline-flex items-center gap-2.5 text-sm font-semibold text-white/85">
                      <Lock size={15} /> Disponível em breve
                    </span>
                  ) : (
                    <span className="mt-7 inline-flex items-center gap-2.5 text-sm font-semibold text-white">
                      {c.cta}
                      <span className="w-9 h-9 rounded-full border border-white/60 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-ink group-hover:translate-x-0.5">
                        <ArrowUpRight size={15} strokeWidth={2.25} />
                      </span>
                    </span>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}

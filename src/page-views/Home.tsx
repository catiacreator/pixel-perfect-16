import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import { ArrowUpRight, Hourglass, Crown, Lightbulb, TrendingUp, Briefcase } from "lucide-react";

const PILARES = [
  {
    n: "01",
    icon: Hourglass,
    titulo: "Recuperar seu tempo",
    sub: "porque uma especialista exausta não cria futuro, só apaga incêndio.",
    to: "/metodo/pilar-1",
    ativo: true,
  },
  {
    n: "02",
    icon: Crown,
    titulo: "Criar autoridade",
    sub: "porque você estudou demais para continuar invisível.",
    to: "/metodo/pilar-2",
    ativo: true,
  },
  {
    n: "03",
    icon: Lightbulb,
    titulo: "Soluções digitais com seu conhecimento",
    sub: "para transformar o que você sabe em ativos que vendem.",
    to: "#",
    ativo: false,
  },
  {
    n: "04",
    icon: TrendingUp,
    titulo: "Aprender a vender no digital",
    sub: "porque ninguém te ensinou isso na faculdade.",
    to: "#",
    ativo: false,
  },
];

export default function Home() {
  return (
    <Layout>
      {/* HERO — editorial split */}
      <section className="border-b border-border/70">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left label */}
          <aside className="lg:col-span-3 flex lg:flex-col justify-between gap-6">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-terracotta mb-3">
                Identidade Visual
              </p>
              <p className="text-[11px] tracking-[0.25em] uppercase text-muted">
                Método · 01
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="h-px w-16 bg-ink mb-4" />
              <p className="text-xs text-muted leading-relaxed max-w-[200px]">
                Ajudo iniciantes a criarem conteúdos com inteligência artificial, de forma simples e estratégica.
              </p>
            </div>
          </aside>

          {/* Main headline */}
          <div className="lg:col-span-9">
            <h1 className="font-serif text-[44px] md:text-[88px] leading-[0.95] text-ink tracking-tight">
              Visual<br />
              que ensina.
            </h1>
            <p className="font-script text-3xl md:text-5xl text-ink/80 mt-4">
              conteúdo que transforma.
            </p>
            <div className="h-px w-40 bg-ink mt-8 mb-8" />

            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-cream-warm text-ink text-[11px] tracking-[0.25em] uppercase px-4 py-2">
                método
              </span>
              <span className="text-muted">·</span>
              <span className="bg-cream-warm text-ink text-[11px] tracking-[0.25em] uppercase px-4 py-2">
                clareza
              </span>
              <span className="text-muted">·</span>
              <span className="bg-cream-warm text-ink text-[11px] tracking-[0.25em] uppercase px-4 py-2">
                resultado
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED — Comece por aqui */}
      <section className="bg-forest text-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            <p className="text-[10px] tracking-[0.4em] uppercase text-gold">
              Por onde começar
            </p>
          </div>
          <div className="lg:col-span-6">
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] text-cream">
              Pilar 1 — <em className="not-italic text-gold">Recuperar</em> seu tempo.
            </h2>
            <p className="text-cream/65 mt-5 max-w-lg">
              Porque uma especialista exausta não cria futuro, só apaga incêndio. Comece pela base do método.
            </p>
          </div>
          <div className="lg:col-span-3 flex lg:items-end lg:justify-end">
            <Link
              to="/metodo/pilar-1"
              className="group inline-flex items-center gap-3 border border-cream/30 hover:border-gold hover:text-gold px-5 py-3.5 text-[11px] tracking-[0.3em] uppercase transition-colors"
            >
              Entrar no pilar
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* PILARES — editorial index */}
      <section>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="flex items-end justify-between mb-12 border-b border-border pb-6">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-terracotta mb-2">
                Índice
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-ink">Os quatro pilares.</h2>
            </div>
            <p className="hidden md:block text-[11px] tracking-[0.25em] uppercase text-muted">
              04 capítulos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {PILARES.map((p) => {
              const Icon = p.icon;
              const Wrapper: any = p.ativo ? Link : "div";
              const wrapperProps = p.ativo ? { to: p.to } : {};
              return (
                <Wrapper
                  key={p.n}
                  {...wrapperProps}
                  className={`group block bg-cream p-8 md:p-10 transition-colors ${
                    p.ativo ? "hover:bg-cream-warm/40 cursor-pointer" : "opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-8">
                    <span className="font-serif text-6xl text-terracotta leading-none">
                      {p.n}
                    </span>
                    <div className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-ink/70">
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl md:text-[28px] leading-tight text-ink mb-3">
                    {p.titulo}
                  </h3>
                  <p className="text-sm text-muted italic leading-relaxed mb-6 max-w-md">
                    {p.sub}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase">
                    {p.ativo ? (
                      <>
                        <span className="text-ink">Ler capítulo</span>
                        <ArrowUpRight
                          size={14}
                          strokeWidth={1.5}
                          className="text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </>
                    ) : (
                      <span className="text-muted">Em breve</span>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAMINHO PARALELO */}
      <section className="border-t border-border/70 bg-cream-warm/30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-3">
            <p className="text-[10px] tracking-[0.4em] uppercase text-terracotta mb-2">
              Caminho especial
            </p>
            <div className="w-12 h-12 rounded-full border border-ink/20 flex items-center justify-center text-ink">
              <Briefcase size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div className="lg:col-span-6">
            <h3 className="font-serif text-3xl md:text-4xl text-ink leading-tight">
              Consultoria de Inteligência Artificial.
            </h3>
            <p className="font-script text-2xl text-ink/70 mt-2">
              para quem quer transformar IA em serviço premium.
            </p>
          </div>
          <div className="lg:col-span-3 flex lg:justify-end">
            <Link
              to="/metodo/consultoria-ia"
              className="group inline-flex items-center gap-3 bg-ink text-cream px-5 py-3.5 text-[11px] tracking-[0.3em] uppercase hover:bg-forest transition-colors"
            >
              Entrar
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

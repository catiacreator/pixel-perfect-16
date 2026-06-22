import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import { Hourglass, Crown, Lightbulb, TrendingUp, Briefcase, ArrowRight, Compass, Clock } from "lucide-react";

const PILARES = [
  { n: "I", num: "1", icon: Hourglass, titulo: "Recuperar seu tempo", sub: "porque uma especialista exausta não cria futuro, só apaga incêndio.", to: "/metodo/pilar-1", ativo: true },
  { n: "2", num: "2", icon: Crown, titulo: "Criar autoridade", sub: "porque você estudou demais para continuar invisível.", to: "/metodo/pilar-2", ativo: true },
  { n: "3", num: "3", icon: Lightbulb, titulo: "Criar soluções digitais com seu conhecimento", sub: "para transformar o que você sabe em ativos que vendem.", to: "#", ativo: false },
  { n: "4", num: "4", icon: TrendingUp, titulo: "Aprender a vender no digital", sub: "porque ninguém te ensinou isso na faculdade.", to: "#", ativo: false },
];

export default function Home() {
  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-5xl mx-auto">
        {/* Title */}
        <div className="flex items-start gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-cream-warm/60 border border-border flex items-center justify-center text-terracotta flex-shrink-0 mt-1">
            <Compass size={18} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-serif text-3xl md:text-[42px] leading-tight text-ink">Trilha Rápida Paraíso Digital</h1>
            <p className="text-sm text-sage mt-2 max-w-2xl">
              O caminho mais rápido para transformar seu conhecimento em liberdade, autoridade e lucro com Inteligência
              Artificial.
            </p>
          </div>
        </div>

        {/* Hero: Por onde começar */}
        <div className="mt-8 rounded-2xl bg-forest text-cream p-6 md:p-7 flex flex-wrap items-center justify-between gap-4 shadow-[0_20px_50px_-25px_rgba(15,32,24,0.6)]">
          <div className="flex-1 min-w-[260px]">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gold mb-2 font-medium">Por onde começar</p>
            <h2 className="font-serif text-xl md:text-2xl text-cream mb-1.5">Comece por aqui — Pilar 1: Recuperar seu tempo</h2>
            <p className="text-sm text-cream/70">porque uma especialista exausta não cria futuro, só apaga incêndio.</p>
          </div>
          <Link
            to="/metodo/pilar-1"
            className="px-6 py-3 rounded-md bg-gold text-ink text-sm font-semibold flex items-center gap-2 hover:bg-gold/90 transition-colors"
          >
            Entrar <ArrowRight size={15} />
          </Link>
        </div>

        {/* Pilares grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {PILARES.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.titulo}
                className={`rounded-2xl border p-6 ${
                  p.ativo
                    ? "bg-white border-border shadow-[0_8px_24px_-18px_rgba(46,43,40,0.25)]"
                    : "bg-navy/5 border-navy/10"
                }`}
              >
                <p className={`text-[11px] tracking-[0.25em] uppercase mb-3 font-medium ${p.ativo ? "text-terracotta" : "text-navy/40"}`}>
                  Pilar {p.num}
                </p>
                <div className="flex items-start gap-5">
                  <span className={`font-serif text-5xl leading-none ${p.ativo ? "text-terracotta" : "text-navy/30"}`}>
                    {p.n}
                  </span>
                  <h3 className={`font-serif text-xl md:text-2xl flex-1 ${p.ativo ? "text-ink" : "text-navy/40"}`}>
                    {p.titulo}
                  </h3>
                </div>
                <div className="mt-5 flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      p.ativo ? "bg-cream-warm/60 border border-border text-terracotta" : "bg-navy/5 border border-navy/10 text-navy/30"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm italic mb-3 ${p.ativo ? "text-sage" : "text-navy/40"}`}>{p.sub}</p>
                    {p.ativo ? (
                      <Link to={p.to} className="text-sm font-semibold text-terracotta flex items-center gap-1.5">
                        Entrar no pilar <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <span className="text-sm text-navy/40 flex items-center gap-1.5">
                        <Clock size={13} /> Em breve
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-12">
          <div className="h-px w-32 bg-border" />
          <div className="w-1.5 h-1.5 rounded-full bg-terracotta" />
          <div className="h-px w-32 bg-border" />
        </div>

        {/* Caminhos paralelos */}
        <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta text-center mb-5 font-medium">Caminhos Paralelos</p>
        <div className="rounded-2xl border border-border bg-white p-6 flex items-start gap-5 shadow-[0_8px_24px_-18px_rgba(46,43,40,0.25)]">
          <div className="w-12 h-12 rounded-xl bg-cream-warm/60 border border-border text-terracotta flex items-center justify-center flex-shrink-0">
            <Briefcase size={20} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] tracking-[0.25em] uppercase text-terracotta mb-1 font-medium">Caminho especial</p>
            <h3 className="font-serif text-xl md:text-2xl text-ink mb-1.5">Consultoria de Inteligência Artificial</h3>
            <p className="text-sm italic text-sage mb-3">para quem quer transformar Inteligência Artificial em serviço premium.</p>
            <Link to="/metodo/consultoria-ia" className="text-sm font-semibold text-terracotta flex items-center gap-1.5">
              Entrar no caminho <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

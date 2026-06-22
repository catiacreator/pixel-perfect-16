import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import { Hourglass, Crown, Lightbulb, TrendingUp, Briefcase, ArrowRight, Compass } from "lucide-react";

const PILARES = [
  { n: "I", icon: <Hourglass size={18} />, titulo: "Recuperar seu tempo", sub: "porque uma especialista exausta não cria futuro, só apaga incêndio.", to: "/metodo/pilar-1", ativo: true },
  { n: "2", icon: <Crown size={18} />, titulo: "Criar autoridade", sub: "porque você estudou demais para continuar invisível.", to: "/metodo/pilar-2", ativo: true },
  { n: "3", icon: <Lightbulb size={18} />, titulo: "Criar soluções digitais com seu conhecimento", sub: "para transformar o que você sabe em ativos que vendem.", to: "#", ativo: false },
  { n: "4", icon: <TrendingUp size={18} />, titulo: "Aprender a vender no digital", sub: "porque ninguém te ensinou isso na faculdade.", to: "#", ativo: false },
];

export default function Home() {
  return (
    <Layout>
      <div className="px-5 md:px-8 py-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-2 text-terracotta">
          <Compass size={18} />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">Trilha Rápida Paraíso Digital</h1>
        <p className="text-muted mb-8">
          O caminho mais rápido para transformar seu conhecimento em liberdade, autoridade e lucro com Inteligência
          Artificial.
        </p>

        <div className="rounded-2xl border border-terracotta bg-white p-5 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-1">Por onde começar</p>
            <p className="font-serif text-lg text-ink mb-1">Comece por aqui — Pilar 1: Recuperar seu tempo</p>
            <p className="text-sm italic text-muted">porque uma especialista exausta não cria futuro, só apaga incêndio.</p>
          </div>
          <Link to="/metodo/pilar-1" className="px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold flex items-center gap-2">
            Entrar <ArrowRight size={15} />
          </Link>
        </div>

        <div className="space-y-4 mb-10">
          {PILARES.map((p) => (
            <div key={p.titulo} className="rounded-2xl border border-border bg-white p-5 flex items-start gap-4">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <span className="font-serif text-2xl text-ink">{p.n}</span>
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${p.ativo ? "border-terracotta text-terracotta" : "border-border text-muted"}`}>
                  {p.icon}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs tracking-[0.15em] uppercase text-muted mb-1">Pilar {p.n === "I" ? "1" : p.n}</p>
                <h3 className="font-serif text-xl text-ink mb-1">{p.titulo}</h3>
                <p className="text-sm italic text-muted mb-3">{p.sub}</p>
                {p.ativo ? (
                  <Link to={p.to} className="text-sm font-semibold text-terracotta flex items-center gap-1.5">
                    Entrar no pilar <ArrowRight size={14} />
                  </Link>
                ) : (
                  <span className="text-sm text-muted">⏱ Em breve</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs tracking-[0.2em] uppercase text-muted text-center mb-4">Caminhos paralelos</p>
        <div className="rounded-2xl border border-border bg-white p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl border border-terracotta text-terracotta flex items-center justify-center flex-shrink-0">
            <Briefcase size={18} />
          </div>
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-1">Caminho especial</p>
            <h3 className="font-serif text-xl text-ink mb-1">Consultoria de Inteligência Artificial</h3>
            <p className="text-sm italic text-muted mb-3">para quem quer transformar IA em serviço premium.</p>
            <Link to="/metodo/consultoria-ia" className="text-sm font-semibold text-terracotta flex items-center gap-1.5">
              Entrar no caminho <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

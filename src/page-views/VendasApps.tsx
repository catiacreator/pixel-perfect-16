import Layout from "../components/Layout";
import { Link } from "@/lib/router-compat";
import { Rocket, ArrowLeft, Clock } from "lucide-react";

// Mini-curso "Página de vendas e aplicações profissionais" — em breve.
export default function VendasApps() {
  return (
    <Layout>
      <section className="mx-auto max-w-2xl px-5 md:px-10 py-16 text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta/12 text-terracotta">
          <Rocket size={26} strokeWidth={1.6} />
        </span>
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-terracotta/30 bg-terracotta/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
          <Clock size={13} /> Em breve
        </span>
        <h1 className="mb-3 font-serif text-3xl md:text-4xl leading-tight text-ink">Página de vendas e aplicações profissionais</h1>
        <p className="mx-auto max-w-lg text-lg text-ink/70">
          Cria as tuas páginas e aplicativos <strong>sem saber programar</strong>. Este mini-curso está a chegar — em breve tens tudo aqui.
        </p>
        <Link to="/" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:text-terracotta-dark">
          <ArrowLeft size={14} /> Voltar ao início
        </Link>
      </section>
    </Layout>
  );
}

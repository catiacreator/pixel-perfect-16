import Layout from "../components/Layout";
import { Link } from "@/lib/router-compat";
import { Lock, EyeOff, Loader2, ArrowLeft, Plus } from "lucide-react";
import { useAccess } from "@/lib/use-access";

// Mini-curso "rascunho" — visível SÓ para o admin. Os alunos que abram o URL
// veem uma página neutra (não revela que existe um curso escondido).
export default function MiniCursoOculto() {
  const { loading, isAdmin } = useAccess();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center gap-2 py-24 text-ink/40">
          <Loader2 size={18} className="animate-spin" /> A carregar…
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="mx-auto max-w-md px-5 py-24 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ink/8 text-ink/50">
            <Lock size={22} />
          </span>
          <h1 className="mb-1 font-serif text-2xl text-ink">Página não disponível</h1>
          <p className="text-ink/60">Esta página não está disponível.</p>
          <Link to="/" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:text-terracotta-dark">
            <ArrowLeft size={14} /> Voltar ao início
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-5 md:px-10 pt-10 md:pt-14 pb-20">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-terracotta transition-colors">
          <ArrowLeft size={14} /> Voltar
        </Link>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-navy/30 bg-navy/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy">
          <EyeOff size={13} /> Rascunho · só tu vês isto
        </div>

        <h1 className="mb-3 font-serif text-3xl md:text-5xl leading-tight text-ink">Novo Mini-curso</h1>
        <p className="mb-8 max-w-2xl text-lg text-ink/70">
          Este mini-curso está <strong>invisível para os alunos</strong> — só tu (admin) o vês, na Home e aqui. Constrói-o com calma; quando estiver pronto, dizes-me e ponho-o visível.
        </p>

        {/* Placeholder da estrutura — a preencher */}
        <div className="space-y-3">
          {["Introdução", "Aula 1", "Aula 2", "Aula 3", "Próximo passo"].map((t, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-cream-warm/30 px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink/8 text-sm font-semibold text-ink/50">{i}</span>
              <span className="text-ink/60">{t} <span className="text-ink/35">— por preencher</span></span>
            </div>
          ))}
          <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border px-5 py-4 text-ink/45">
            <Plus size={16} /> Adiciona aqui as aulas (diz-me o conteúdo e eu preencho)
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-terracotta/25 bg-terracotta/[0.05] px-5 py-4 text-[14px] text-ink/70">
          💡 Diz-me o <strong>nome</strong>, o <strong>tema</strong> e as <strong>aulas</strong> deste mini-curso e eu construo a página completa (vídeos, textos, prompts). Quando quiseres torná-lo visível para os alunos, é só pedires.
        </div>
      </section>
    </Layout>
  );
}

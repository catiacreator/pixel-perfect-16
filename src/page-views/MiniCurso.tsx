import Layout from "../components/Layout";
import { Link } from "@/lib/router-compat";
import { Sparkles, ArrowRight, PlayCircle, Check, ListChecks } from "lucide-react";
import TarefaCompleta from "../components/TarefaCompleta";
import { CURSO_INTRO, AULAS, CURSO_BONUS, type Secao } from "@/data/curso-conteudo-ia";

// Curso "Conteúdo com IA" — 6 módulos (a Cátia coloca o vídeo de cada aula).

function SecaoView({ s }: { s: Secao }) {
  return (
    <div className="mb-4">
      {s.titulo && <p className="text-sm font-semibold text-ink mb-1.5">{s.titulo}</p>}
      {s.paragrafos?.map((p, i) => (
        <p key={i} className="text-[15px] text-ink/70 leading-relaxed mb-2">{p}</p>
      ))}
      {s.lista && (
        <ul className="space-y-1.5 mt-1">
          {s.lista.map((li, i) => (
            <li key={i} className="flex items-start gap-2 text-[15px] text-ink/70 leading-relaxed">
              <Check size={15} className="text-terracotta mt-1 shrink-0" /> <span>{li}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MiniCurso() {
  return (
    <Layout>
      <div className="theme-roxo">
        {/* Hero */}
        <section className="px-5 md:px-10 pt-10 md:pt-14 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.24em] uppercase text-terracotta font-semibold mb-3">
            <Sparkles size={13} /> Mini-curso
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight mb-3">{CURSO_INTRO.titulo}</h1>
          <p className="text-ink/70 text-lg mb-1">{CURSO_INTRO.subtitulo}</p>
          <p className="text-[13px] text-ink/50">{CURSO_INTRO.ferramentas} · {CURSO_INTRO.nivel}</p>

          <div className="mt-6 space-y-3">
            {CURSO_INTRO.paragrafos.map((p, i) => (
              <p key={i} className="text-[15px] text-ink/70 leading-relaxed">{p}</p>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-white p-5">
            <p className="text-sm font-semibold text-ink mb-1.5">Como funciona o método</p>
            <p className="text-[15px] text-ink/70 leading-relaxed">{CURSO_INTRO.metodo}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-white p-5">
            <p className="text-sm font-semibold text-ink mb-2 inline-flex items-center gap-2"><ListChecks size={16} className="text-terracotta" /> O que precisas para começar</p>
            <ul className="space-y-1.5">
              {CURSO_INTRO.requisitos.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] text-ink/70 leading-relaxed">
                  <Check size={15} className="text-terracotta mt-1 shrink-0" /> <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Índice dos módulos */}
          <div className="mt-6 flex flex-wrap gap-2">
            {AULAS.map((a) => (
              <a key={a.id} href={`#${a.id}`} className="text-[13px] font-semibold px-3 py-1.5 rounded-full border border-border text-ink/70 hover:border-terracotta hover:text-terracotta transition-colors">
                {a.numero}
              </a>
            ))}
          </div>
        </section>

        {/* Módulos */}
        <section className="px-5 md:px-10 pt-10 pb-6 max-w-4xl mx-auto space-y-8">
          {AULAS.map((a) => (
            <div key={a.id} id={a.id} className="scroll-mt-24 rounded-3xl border border-border bg-white p-6 md:p-8">
              <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">{a.numero}</p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink mb-1.5">{a.titulo}</h2>
              {a.subtitulo && <p className="text-sm text-ink/55 mb-4">{a.subtitulo}</p>}

              {/* Vídeo da aula */}
              <div className="rounded-2xl overflow-hidden border border-border bg-ink/90 aspect-video flex items-center justify-center text-cream mb-5">
                {a.videoUrl ? (
                  <iframe src={a.videoUrl} title={a.titulo} className="w-full h-full" allowFullScreen />
                ) : (
                  <div className="text-center">
                    <PlayCircle size={40} className="mx-auto mb-2 opacity-80" />
                    <p className="text-sm opacity-80">Vídeo do {a.numero} — em breve</p>
                  </div>
                )}
              </div>

              {a.secoes.map((s, i) => (
                <SecaoView key={i} s={s} />
              ))}

              <div className="mt-4 pt-4 border-t border-border flex justify-end">
                <TarefaCompleta id={`aula:conteudo-ia/${a.id}`} tipo="aula" />
              </div>
            </div>
          ))}
        </section>

        {/* Bónus */}
        <section className="px-5 md:px-10 pb-6 max-w-4xl mx-auto">
          <div className="rounded-3xl border border-terracotta/25 bg-terracotta/5 p-6 md:p-8">
            <h2 className="font-serif text-2xl text-ink mb-1.5">{CURSO_BONUS.titulo}</h2>
            <p className="text-[15px] text-ink/70 leading-relaxed mb-4">{CURSO_BONUS.intro}</p>
            <div className="flex flex-wrap gap-2">
              {CURSO_BONUS.blocos.map((b) => (
                <span key={b} className="text-[13px] font-semibold px-3 py-1.5 rounded-full bg-white border border-border text-ink/70">{b}</span>
              ))}
            </div>
            <p className="text-[15px] text-ink/70 leading-relaxed mt-5 italic">{CURSO_BONUS.fecho}</p>
          </div>
        </section>

        {/* CTA — método completo */}
        <section className="px-5 md:px-10 pb-14 max-w-4xl mx-auto">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-cream-warm to-cream p-7 md:p-8 text-center">
            <h2 className="font-serif text-2xl text-ink mb-2">Queres ir mais longe?</h2>
            <p className="text-ink/60 max-w-xl mx-auto leading-relaxed mb-6">
              No método completo tens o teu Documento Mestre, a Cat.IA adaptada a ti, o Plano de Posts e a competição mensal.
            </p>
            <Link to="/protocolo" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors">
              Ver o método completo <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

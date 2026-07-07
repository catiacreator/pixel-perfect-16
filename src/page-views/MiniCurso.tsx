import Layout from "../components/Layout";
import PilarSidebar from "../components/PilarSidebar";
import { Link, useSearchParams } from "@/lib/router-compat";
import { Sparkles, ArrowRight, ArrowLeft, PlayCircle, Check, ListChecks } from "lucide-react";
import TarefaCompleta from "../components/TarefaCompleta";
import { CURSO_INTRO, AULAS, CURSO_BONUS, type Aula, type Secao } from "@/data/curso-conteudo-ia";

// Curso "Conteúdo com IA" — cada módulo na sua página (via ?aula=mX).

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

function Intro() {
  return (
    <>
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
      </section>

      {/* Módulos do curso */}
      <section className="px-5 md:px-10 pt-8 max-w-4xl mx-auto">
        <p className="text-sm font-semibold text-ink mb-3">Módulos do curso</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {AULAS.map((a) => (
            <Link key={a.id} to={`/conteudo-ia?aula=${a.id}`} className="rounded-2xl border border-border bg-white p-4 hover:border-terracotta transition-colors group">
              <p className="text-[10px] tracking-[0.18em] uppercase text-terracotta font-semibold mb-1">{a.numero}</p>
              <p className="text-sm font-semibold text-ink group-hover:text-terracotta transition-colors">{a.titulo}</p>
              {a.subtitulo && <p className="text-[13px] text-ink/50 mt-0.5">{a.subtitulo}</p>}
            </Link>
          ))}
        </div>
      </section>

      {/* Bónus */}
      <section className="px-5 md:px-10 pt-8 pb-6 max-w-4xl mx-auto">
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

      {/* CTA */}
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
    </>
  );
}

function Modulo({ aula, prev, next }: { aula: Aula; prev: Aula | null; next: Aula | null }) {
  return (
    <section className="px-5 md:px-10 pt-8 md:pt-10 pb-14 max-w-4xl mx-auto">
      <Link to="/conteudo-ia" className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-terracotta transition-colors mb-5">
        <ArrowLeft size={15} /> Início do curso
      </Link>

      <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">{aula.numero}</p>
      <h1 className="font-serif text-3xl md:text-4xl text-ink mb-1.5">{aula.titulo}</h1>
      {aula.subtitulo && <p className="text-sm text-ink/55 mb-5">{aula.subtitulo}</p>}

      {/* Vídeo da aula */}
      <div className="rounded-2xl overflow-hidden border border-border bg-ink/90 aspect-video flex items-center justify-center text-cream mb-6">
        {aula.videoUrl ? (
          <iframe src={aula.videoUrl} title={aula.titulo} className="w-full h-full" allowFullScreen />
        ) : (
          <div className="text-center">
            <PlayCircle size={40} className="mx-auto mb-2 opacity-80" />
            <p className="text-sm opacity-80">Vídeo do {aula.numero} — em breve</p>
          </div>
        )}
      </div>

      {aula.secoes.map((s, i) => (
        <SecaoView key={i} s={s} />
      ))}

      <div className="mt-6 flex justify-end">
        <TarefaCompleta id={`aula:conteudo-ia/${aula.id}`} tipo="aula" />
      </div>

      {/* Navegação anterior / próximo */}
      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-3">
        {prev ? (
          <Link to={`/conteudo-ia?aula=${prev.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 hover:text-terracotta transition-colors">
            <ArrowLeft size={15} /> {prev.numero}
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/conteudo-ia?aula=${next.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors">
            Próximo: {next.numero} <ArrowRight size={15} />
          </Link>
        ) : (
          <Link to="/conteudo-ia" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors">
            Concluir <Check size={15} />
          </Link>
        )}
      </div>
    </section>
  );
}

export default function MiniCurso() {
  const [params] = useSearchParams();
  const aula = params.get("aula");
  const idx = AULAS.findIndex((a) => a.id === aula);
  const aulaSel = idx >= 0 ? AULAS[idx] : null;

  return (
    <div className="theme-roxo">
      <PilarSidebar pilar="conteudo-ia" />
      <div className="lg:pl-[280px]">
        <Layout>
          {aulaSel ? (
            <Modulo
              aula={aulaSel}
              prev={idx > 0 ? AULAS[idx - 1] : null}
              next={idx < AULAS.length - 1 ? AULAS[idx + 1] : null}
            />
          ) : (
            <Intro />
          )}
        </Layout>
      </div>
    </div>
  );
}

import Layout from "../components/Layout";
import PilarSidebar from "../components/PilarSidebar";
import PromptBox from "../components/curso/PromptBox";
import { Link, useSearchParams } from "@/lib/router-compat";
import { Sparkles, ArrowRight, ArrowLeft, PlayCircle, Check } from "lucide-react";
import TarefaCompleta from "../components/TarefaCompleta";
import { CURSO_INTRO, AULAS, CURSO_BONUS, type Aula, type Bloco, type Secao } from "@/data/curso-conteudo-ia";

// Curso "Conteúdo com IA" — cada módulo na sua página (via ?aula=mX).

// Realça **negrito** dentro de texto simples.
function Bold({ texto }: { texto: string }) {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {partes.map((p, i) =>
        /^\*\*[^*]+\*\*$/.test(p) ? <b key={i} className="text-ink">{p.slice(2, -2)}</b> : <span key={i}>{p}</span>,
      )}
    </>
  );
}

function BlocoView({ b }: { b: Bloco }) {
  switch (b.t) {
    case "p":
      return <p className="text-[15px] text-ink/70 leading-relaxed mb-2.5"><Bold texto={b.texto} /></p>;
    case "sub":
      return <p className="text-[15px] font-semibold text-terracotta mt-4 mb-1">{b.titulo}</p>;
    case "ul":
      return (
        <ul className="my-2">
          {b.itens.map((li, i) => (
            <li key={i} className="flex items-start gap-2 text-[15px] text-ink/70 leading-relaxed py-1.5 border-b border-border/60 last:border-0">
              <Check size={15} className="text-terracotta mt-1 shrink-0" /> <span><Bold texto={li} /></span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="my-2 space-y-1.5">
          {b.itens.map((li, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] text-ink/70 leading-relaxed">
              <span className="w-6 h-6 rounded-lg bg-terracotta text-cream text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <span><Bold texto={li} /></span>
            </li>
          ))}
        </ol>
      );
    case "prompt":
      return <PromptBox agente={b.agente} nome={b.nome} texto={b.texto} />;
    case "nota":
      return (
        <div className={`rounded-xl px-4 py-3 my-3 text-[14px] leading-relaxed ${b.v === "warn" ? "bg-amber-50 border-l-4 border-amber-400 text-amber-900" : "bg-ink/5 border-l-4 border-terracotta text-ink/75"}`}>
          <Bold texto={b.texto} />
        </div>
      );
    case "tabela":
      return (
        <div className="overflow-x-auto my-4 rounded-xl border border-border">
          <table className="w-full text-[14px] border-collapse">
            <thead>
              <tr>{b.cab.map((c, i) => <th key={i} className="text-left bg-terracotta text-cream px-3 py-2 text-[13px] font-semibold">{c}</th>)}</tr>
            </thead>
            <tbody>
              {b.linhas.map((row, ri) => (
                <tr key={ri} className="even:bg-cream-warm/40">
                  {row.map((cell, ci) => <td key={ci} className="px-3 py-2 border-t border-border align-top text-ink/70"><Bold texto={cell} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

function SecaoView({ s }: { s: Secao }) {
  return (
    <div className="mb-4">
      {s.titulo && <h3 className="text-lg font-semibold text-ink mt-6 mb-2">{s.titulo}</h3>}
      {s.blocos.map((b, i) => <BlocoView key={i} b={b} />)}
    </div>
  );
}

function VideoArea({ numero, videoUrl, titulo }: { numero: string; videoUrl?: string; titulo: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-ink/90 aspect-video flex items-center justify-center text-cream mb-6">
      {videoUrl ? (
        <iframe src={videoUrl} title={titulo} className="w-full h-full" allowFullScreen />
      ) : (
        <div className="text-center">
          <PlayCircle size={40} className="mx-auto mb-2 opacity-80" />
          <p className="text-sm opacity-80">Vídeo do {numero} — em breve</p>
        </div>
      )}
    </div>
  );
}

function Intro() {
  return (
    <>
      <section className="px-5 md:px-10 pt-10 md:pt-14 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.24em] uppercase text-terracotta font-semibold mb-3">
          <Sparkles size={13} /> Curso · Mini-curso
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight mb-3">{CURSO_INTRO.titulo}</h1>
        <p className="text-ink/70 text-lg mb-2">{CURSO_INTRO.subtitulo}</p>
        <p className="text-[13px] text-ink/50">{CURSO_INTRO.ferramentas} · {CURSO_INTRO.nivel}</p>

        {/* Como funciona o método */}
        <div className="mt-6 rounded-2xl border border-border bg-white p-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Como funciona o método</p>
          <h2 className="font-serif text-2xl text-ink mb-2">{CURSO_INTRO.metodoTitulo}</h2>
          <p className="text-[15px] text-ink/70 leading-relaxed">{CURSO_INTRO.metodoTexto}</p>
          <BlocoView b={{ t: "tabela", cab: CURSO_INTRO.metodoTabela.cab, linhas: CURSO_INTRO.metodoTabela.linhas }} />
          <BlocoView b={{ t: "nota", v: "info", texto: CURSO_INTRO.metodoNota }} />
        </div>

        {/* Módulos do curso */}
        <p className="text-sm font-semibold text-ink mt-8 mb-3">Módulos do curso</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {AULAS.map((a) => (
            <Link key={a.id} to={`/conteudo-ia?aula=${a.id}`} className="rounded-2xl border border-border bg-white p-4 hover:border-terracotta transition-colors group">
              <p className="text-[10px] tracking-[0.18em] uppercase text-terracotta font-semibold mb-1">{a.numero}</p>
              <p className="text-sm font-semibold text-ink group-hover:text-terracotta transition-colors">{a.titulo}</p>
            </Link>
          ))}
          <Link to="/conteudo-ia?aula=bonus" className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-4 hover:border-terracotta transition-colors group sm:col-span-2">
            <p className="text-[10px] tracking-[0.18em] uppercase text-terracotta font-semibold mb-1">Bónus</p>
            <p className="text-sm font-semibold text-ink group-hover:text-terracotta transition-colors">Banco de prompts rápidos</p>
          </Link>
        </div>
      </section>

      <div className="pb-14" />
    </>
  );
}

function Modulo({ aula, prev, next }: { aula: Aula; prev: Aula | null; next: Aula | null }) {
  return (
    <section className="px-5 md:px-10 pt-8 md:pt-10 pb-14 max-w-3xl mx-auto">
      <Link to="/conteudo-ia" className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-terracotta transition-colors mb-5">
        <ArrowLeft size={15} /> Início do curso
      </Link>

      <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">{aula.numero}</p>
      <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">{aula.titulo}</h1>

      <VideoArea numero={aula.numero} videoUrl={aula.videoUrl} titulo={aula.titulo} />

      {aula.objetivo && (
        <div className="rounded-r-xl border-l-4 border-terracotta bg-terracotta/8 px-4 py-3 mb-4 text-[15px] text-ink/75">
          <b className="text-ink">Objetivo:</b> {aula.objetivo}
        </div>
      )}

      {aula.secoes.map((s, i) => <SecaoView key={i} s={s} />)}

      <div className="mt-6 flex justify-end">
        <TarefaCompleta id={`aula:conteudo-ia/${aula.id}`} tipo="aula" />
      </div>

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
          <Link to="/conteudo-ia?aula=bonus" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors">
            Bónus: banco de prompts <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </section>
  );
}

function Bonus() {
  return (
    <section className="px-5 md:px-10 pt-8 md:pt-10 pb-14 max-w-3xl mx-auto">
      <Link to="/conteudo-ia" className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-terracotta transition-colors mb-5">
        <ArrowLeft size={15} /> Início do curso
      </Link>
      <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Bónus</p>
      <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">Banco de prompts rápidos</h1>
      <p className="text-[15px] text-ink/70 leading-relaxed mb-4">{CURSO_BONUS.intro}</p>
      {CURSO_BONUS.prompts.map((p, i) => <PromptBox key={i} agente={p.agente} nome={p.nome} texto={p.texto} />)}
      <div className="mt-8 rounded-3xl bg-gradient-to-br from-terracotta-dark to-terracotta text-cream p-8 text-center">
        <h2 className="font-serif text-2xl mb-2">Agora é contigo.</h2>
        <p className="text-cream/85 max-w-xl mx-auto leading-relaxed">{CURSO_BONUS.fecho}</p>
      </div>
    </section>
  );
}

export default function MiniCurso() {
  const [params] = useSearchParams();
  const aula = params.get("aula");
  const idx = AULAS.findIndex((a) => a.id === aula);
  const aulaSel = idx >= 0 ? AULAS[idx] : null;

  let conteudo: React.ReactNode;
  if (aula === "bonus") conteudo = <Bonus />;
  else if (aulaSel) {
    conteudo = (
      <Modulo aula={aulaSel} prev={idx > 0 ? AULAS[idx - 1] : null} next={idx < AULAS.length - 1 ? AULAS[idx + 1] : null} />
    );
  } else conteudo = <Intro />;

  return (
    <div className="theme-roxo">
      <PilarSidebar pilar="conteudo-ia" />
      <div className="lg:pl-[280px]">
        <Layout>{conteudo}</Layout>
      </div>
    </div>
  );
}

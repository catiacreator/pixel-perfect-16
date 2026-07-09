import Layout from "../components/Layout";
import PilarSidebar from "../components/PilarSidebar";
import PromptBox from "../components/curso/PromptBox";
import { Link, useSearchParams } from "@/lib/router-compat";
import { Sparkles, ArrowRight, ArrowLeft, Check, ExternalLink, Download, Instagram, GraduationCap, MessageCircle } from "lucide-react";
import { WHATSAPP_CATIA } from "@/lib/turmas";
import TarefaCompleta from "../components/TarefaCompleta";
import EmManutencao from "../components/EmManutencao";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";
import { useBloqueios } from "@/lib/bloqueios";
import { CURSO_INTRO, AULAS, SUBAULAS, CURSO_BONUS, type Aula, type Bloco, type Secao } from "@/data/curso-conteudo-ia";

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
      return <PromptBox agente={b.agente} nome={b.nome} texto={b.texto} textoBr={b.textoBr} />;
    case "video":
      return <div className="my-4"><VideoArea videoUrl={b.url} titulo={b.titulo ?? "Vídeo"} /></div>;
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
    case "aulas":
      return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          {b.itens.map((a) => (
            <Link
              key={a.aula}
              to={`/conteudo-ia?aula=${a.aula}`}
              className="rounded-2xl border border-border bg-white p-4 hover:border-terracotta transition-colors group flex flex-col"
            >
              <p className="text-sm font-semibold text-ink group-hover:text-terracotta transition-colors mb-1">{a.titulo}</p>
              <p className="text-[12.5px] text-ink/60 leading-snug flex-1">{a.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-terracotta font-semibold mt-2.5">
                Abrir aula <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      );
    case "downloads":
      return (
        <div className="flex flex-col sm:flex-row gap-3 my-4">
          {b.itens.map((d) => (
            <a
              key={d.url}
              href={d.url}
              download
              className="flex-1 flex items-center gap-3 rounded-2xl border border-terracotta/30 bg-terracotta/5 px-4 py-3.5 hover:border-terracotta hover:bg-terracotta/10 transition-colors group"
            >
              <span className="w-10 h-10 rounded-xl bg-terracotta text-cream flex items-center justify-center shrink-0">
                <Download size={17} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink group-hover:text-terracotta transition-colors">{d.nome}</span>
                {d.desc && <span className="block text-[12px] text-ink/55 leading-snug">{d.desc}</span>}
              </span>
            </a>
          ))}
        </div>
      );
    case "funil": {
      const larguras = ["100%", "82%", "64%", "46%"];
      const cores = ["bg-terracotta-dark", "bg-terracotta", "bg-terracotta/80", "bg-amber-400"];
      return (
        <div className="flex flex-col items-center gap-1.5 my-4">
          {b.niveis.map((n, i) => (
            <div
              key={i}
              className={`rounded-xl px-4 py-3 flex flex-col items-center text-center ${cores[i] ?? "bg-terracotta"} ${i === 3 ? "text-ink" : "text-cream"}`}
              style={{ width: larguras[i] ?? "100%" }}
            >
              <span className="font-bold text-[15px]">{n.titulo}</span>
              <span className="text-[12.5px] opacity-90">{n.desc}</span>
            </div>
          ))}
        </div>
      );
    }
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

function VideoArea({ videoUrl, titulo }: { videoUrl?: string; titulo: string }) {
  // Sem vídeo → não mostra nada (sem placeholder "em breve").
  if (!videoUrl) return null;
  // Ficheiro de vídeo direto (ex.: .mp4 no Supabase Storage) → player nativo;
  // caso contrário assume link de embed (YouTube/Vimeo/Tella) → iframe.
  const isFicheiro = /\.(mp4|webm|m4v|mov)(\?|#|$)/i.test(videoUrl);
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-ink/90 aspect-video flex items-center justify-center text-cream mb-6">
      {isFicheiro ? (
        <video src={videoUrl} title={titulo} className="w-full h-full" controls playsInline preload="metadata" />
      ) : (
        <iframe src={videoUrl} title={titulo} className="w-full h-full" allowFullScreen />
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
        <p className="text-[13px] text-ink/50 mb-6">{CURSO_INTRO.ferramentas} · {CURSO_INTRO.nivel}</p>

        {/* Vídeo de boas-vindas */}
        <VideoArea videoUrl={CURSO_INTRO.videoUrl} titulo="Boas-vindas ao curso" />

        {/* Secções do método */}
        {CURSO_INTRO.secoes.map((s, i) => (
          <div key={i} className="mt-6 rounded-2xl border border-border bg-white p-6">
            {s.label && <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">{s.label}</p>}
            {s.titulo && <h2 className="font-serif text-2xl text-ink mb-2">{s.titulo}</h2>}
            {s.blocos.map((b, j) => <BlocoView key={j} b={b} />)}
          </div>
        ))}

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

      <VideoArea videoUrl={aula.videoUrl} titulo={aula.titulo} />

      {aula.objetivo && (
        <div className="rounded-r-xl border-l-4 border-terracotta bg-terracotta/8 px-4 py-3 mb-4 text-[15px] text-ink/75">
          <b className="text-ink">Objetivo:</b> {aula.objetivo}
        </div>
      )}

      {aula.links && aula.links.length > 0 && (
        <div className="flex flex-wrap gap-2.5 mb-5">
          {aula.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors"
            >
              <ExternalLink size={15} /> {l.nome}
            </a>
          ))}
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
      {CURSO_BONUS.prompts.map((p, i) => <PromptBox key={i} agente={p.agente} nome={p.nome} texto={p.texto} textoBr={(p as { textoBr?: string }).textoBr} />)}
      <div className="mt-8 rounded-3xl bg-gradient-to-br from-terracotta-dark to-terracotta text-cream p-8 text-center">
        <h2 className="font-serif text-2xl mb-2">Agora é contigo.</h2>
        <p className="text-cream/85 max-w-xl mx-auto leading-relaxed">{CURSO_BONUS.fecho}</p>
      </div>
      <div className="mt-6 flex justify-end">
        <Link to="/conteudo-ia?aula=final" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors">
          O teu próximo passo <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

// Capítulo final: convite para o método completo (Leveza no Digital).
function FinalCTA() {
  const cursos = [
    {
      titulo: "Protocolo Viral",
      tag: "Mentoria · Instagram",
      desc: "O método de IA para crescer e vender no Instagram — transforma o teu perfil numa máquina de crescimento.",
      to: "/protocolo",
      icon: Instagram,
      cor: "#C8487E",
    },
    {
      titulo: "Academia de IA",
      tag: "Ferramentas",
      desc: "Aulas práticas, ferramenta a ferramenta, para te tornares especialista em Inteligência Artificial.",
      to: "/metodo/pilar-1/aprenda-ia",
      icon: GraduationCap,
      cor: "#2E7CB8",
    },
  ];
  return (
    <section className="px-5 md:px-10 pt-8 md:pt-10 pb-14 max-w-3xl mx-auto">
      <Link to="/conteudo-ia" className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-terracotta transition-colors mb-5">
        <ArrowLeft size={15} /> Início do curso
      </Link>
      <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">O teu próximo passo</p>
      <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">Continua na Leveza no Digital</h1>
      <p className="text-[15px] text-ink/70 leading-relaxed mb-8 max-w-2xl">
        Já tens a equipa de IAs a trabalhar por ti. O próximo passo é o <b className="text-ink">método completo</b> — dentro da Leveza no Digital tens dois caminhos para ires mais longe:
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {cursos.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.to} to={c.to} className="group rounded-2xl border border-border bg-white p-5 hover:border-terracotta hover:-translate-y-0.5 transition-all flex flex-col">
              <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${c.cor}18`, color: c.cor }}>
                <Icon size={20} />
              </span>
              <p className="text-[10px] tracking-[0.18em] uppercase font-semibold mb-1" style={{ color: c.cor }}>{c.tag}</p>
              <h3 className="font-serif text-xl text-ink group-hover:text-terracotta transition-colors mb-1.5">{c.titulo}</h3>
              <p className="text-[13.5px] text-ink/60 leading-relaxed flex-1">{c.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold mt-3" style={{ color: c.cor }}>
                Conhecer <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-3xl bg-gradient-to-br from-terracotta-dark to-terracotta text-cream p-8 text-center">
        <h2 className="font-serif text-2xl mb-2">Pronta para o próximo nível?</h2>
        <p className="text-cream/85 max-w-xl mx-auto leading-relaxed mb-5">
          Fala comigo e escolhe o caminho certo para ti — crescer no Instagram, dominar a IA, ou os dois.
        </p>
        <a
          href={WHATSAPP_CATIA}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1FB855] transition-colors"
        >
          <MessageCircle size={17} /> Falar com a Cátia no WhatsApp
        </a>
      </div>
    </section>
  );
}

export default function MiniCurso() {
  const [params] = useSearchParams();
  const aula = params.get("aula");
  const idx = AULAS.findIndex((a) => a.id === aula);
  const aulaSel = idx >= 0 ? AULAS[idx] : null;
  const subSel = SUBAULAS.find((a) => a.id === aula) ?? null;

  // Cada capítulo pode ser marcado "Em breve/Bloqueado" no painel (Estrutura).
  // Segue diretamente a lista do painel (isBloqueadoRaw) para funcionar mesmo com
  // o "Geral" desligado e sem depender das turmas. Admin (vista admin) vê tudo.
  const bloqueadoParaAlunos = useBloqueadoParaAlunos();
  const { isBloqueadoRaw, modoBloqueio } = useBloqueios();
  const cid = "conteudo-ia." + (aula || "intro");
  const paiCid = aula && /[a-z]$/.test(aula) ? "conteudo-ia." + aula.replace(/[a-z]$/, "") : null; // m4b → conteudo-ia.m4
  const capBloqueado = bloqueadoParaAlunos && (isBloqueadoRaw(cid) || (!!paiCid && isBloqueadoRaw(paiCid)));

  let conteudo: React.ReactNode;
  if (capBloqueado) {
    conteudo = (
      <section className="px-5 md:px-10 pt-8 pb-14 max-w-3xl mx-auto">
        <EmManutencao modo={modoBloqueio(cid) === "bloqueado" ? "bloqueado" : "em-breve"} />
      </section>
    );
  } else if (aula === "final") conteudo = <FinalCTA />;
  else if (aula === "bonus") conteudo = <Bonus />;
  else if (aulaSel) {
    conteudo = (
      <Modulo aula={aulaSel} prev={idx > 0 ? AULAS[idx - 1] : null} next={idx < AULAS.length - 1 ? AULAS[idx + 1] : null} />
    );
  } else if (subSel) {
    // sub-aula (ex.: m4b) — navega em cadeia entre irmãs do mesmo módulo:
    // pai (m4) → aula 1 (m4b) → aula 2 (m4c) → … → módulo seguinte (m5)
    const paiBase = subSel.id.replace(/[a-z]$/, "");
    const pIdx = AULAS.findIndex((a) => a.id === paiBase);
    const irmas = SUBAULAS.filter((s) => s.id.replace(/[a-z]$/, "") === paiBase);
    const sIdx = irmas.findIndex((s) => s.id === subSel.id);
    conteudo = (
      <Modulo
        aula={subSel}
        prev={sIdx > 0 ? irmas[sIdx - 1] : pIdx >= 0 ? AULAS[pIdx] : null}
        next={sIdx < irmas.length - 1 ? irmas[sIdx + 1] : pIdx >= 0 && pIdx < AULAS.length - 1 ? AULAS[pIdx + 1] : null}
      />
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

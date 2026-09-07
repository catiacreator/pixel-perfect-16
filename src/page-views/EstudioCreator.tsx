import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import PromptBox from "../components/curso/PromptBox";
import { Link } from "@/lib/router-compat";
import { useAccess } from "@/lib/use-access";
import {
  Sparkles, ArrowLeft, Copy, Check, Camera, Layers, Target,
  FlaskConical, Images, Shirt, Lock, ChevronRight, Wand2, Repeat,
} from "lucide-react";
import {
  FLUXO, CAMADAS, CENARIOS, ROUPAS, POSES, LUZES, CAMARAS, COMPOSICOES, ESTETICAS, EVITAR,
  PROMPT_ABERTURA, PROMPT_REALISMO, POSES_INTENCAO, BANCO_FUNIL, GUARDA_ROUPA,
  PROMPTS_CONTEUDO, LAB_USOS, SITUACOES, SISTEMA_PECAS, MVP, type Opcao,
} from "@/data/estudio-creator";

// Estúdio Creator — biblioteca de prompts + construtor de combinações.
// Baseado no Ecossistema de Produto e no Método Europeu de Conteúdo.

// —— pequenos blocos reutilizáveis ————————————————————————————
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] tracking-[0.24em] uppercase font-bold text-[#C13584] mb-2">{children}</p>;
}
function SecTitulo({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl md:text-3xl text-ink leading-tight mb-1.5">
      <span className="text-[#C13584] font-mono text-lg mr-2">{num}</span>{children}
    </h2>
  );
}
function Secao({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`max-w-4xl mx-auto px-5 md:px-8 py-8 md:py-10 ${className}`}>{children}</section>;
}

// —— Construtor de prompt fotográfico ————————————————————————
function Seletor({ label, opcoes, valor, onChange }: { label: string; opcoes: Opcao[]; valor: number; onChange: (i: number) => void }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-ink/55 mb-1.5">{label}</span>
      <div className="relative">
        <select
          value={valor}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none rounded-xl border border-[#E4D9EC] bg-white px-3.5 py-2.5 pr-9 text-sm text-ink font-medium focus:border-[#C13584] focus:outline-none focus:ring-2 focus:ring-[#C13584]/20 transition-colors"
        >
          {opcoes.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
        </select>
        <ChevronRight size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-ink/40" />
      </div>
    </label>
  );
}

function Construtor() {
  const [c, setC] = useState(0);
  const [r, setR] = useState(0);
  const [p, setP] = useState(0);
  const [l, setL] = useState(0);
  const [cam, setCam] = useState(0);
  const [comp, setComp] = useState(0);
  const [est, setEst] = useState(0);
  const [ev, setEv] = useState(0);
  const [copiado, setCopiado] = useState(false);

  const prompt = useMemo(() => {
    return [
      PROMPT_ABERTURA,
      "",
      `CENÁRIO:\n${CENARIOS[c].frag}`,
      `AÇÃO E POSIÇÃO:\n${POSES[p].frag}`,
      `ROUPA:\n${ROUPAS[r].frag}`,
      `ILUMINAÇÃO:\n${LUZES[l].frag}`,
      `CÂMARA:\n${CAMARAS[cam].frag}`,
      `COMPOSIÇÃO:\n${COMPOSICOES[comp].frag}`,
      `ESTÉTICA:\n${ESTETICAS[est].frag}`,
      `REALISMO:\n${PROMPT_REALISMO}`,
      `EVITAR:\n${EVITAR[ev].frag}`,
    ].join("\n");
  }, [c, r, p, l, cam, comp, est, ev]);

  const copiar = async () => {
    try { await navigator.clipboard?.writeText(prompt); } catch { /* ignora */ }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1600);
  };

  const total = CENARIOS.length * ROUPAS.length * POSES.length * LUZES.length;

  return (
    <div className="rounded-3xl border border-[#E4D9EC] bg-gradient-to-br from-[#FBF6FD] to-white p-5 md:p-7">
      <div className="grid sm:grid-cols-2 gap-3.5 mb-5">
        <Seletor label="Cenário" opcoes={CENARIOS} valor={c} onChange={setC} />
        <Seletor label="Roupa" opcoes={ROUPAS} valor={r} onChange={setR} />
        <Seletor label="Pose / ação" opcoes={POSES} valor={p} onChange={setP} />
        <Seletor label="Iluminação" opcoes={LUZES} valor={l} onChange={setL} />
        <Seletor label="Câmara" opcoes={CAMARAS} valor={cam} onChange={setCam} />
        <Seletor label="Composição" opcoes={COMPOSICOES} valor={comp} onChange={setComp} />
        <Seletor label="Estética" opcoes={ESTETICAS} valor={est} onChange={setEst} />
        <Seletor label="Evitar" opcoes={EVITAR} valor={ev} onChange={setEv} />
      </div>

      {/* Saída — prompt montado */}
      <div className="rounded-2xl overflow-hidden border border-[#2E2748] bg-[#1C1830]">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#272042] border-b border-[#38305C]">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white">
            <span className="bg-[#833AB4] text-white text-[10px] px-2 py-0.5 rounded">Foto</span>
            <span className="truncate">Prompt montado</span>
          </span>
          <button
            onClick={copiar}
            className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 ${copiado ? "bg-emerald-600 text-white" : "bg-[#C13584] text-white hover:brightness-110"}`}
          >
            {copiado ? <Check size={13} /> : <Copy size={13} />} {copiado ? "Copiado!" : "Copiar"}
          </button>
        </div>
        <pre className="m-0 px-4 py-4 text-[12.5px] leading-relaxed text-[#E9E5F5] font-mono whitespace-pre-wrap break-words max-h-[360px] overflow-y-auto">
          {prompt}
        </pre>
      </div>

      <p className="mt-3.5 text-[13px] text-ink/60 leading-relaxed">
        <b className="text-ink">{CENARIOS.length} cenários × {ROUPAS.length} roupas × {POSES.length} poses × {LUZES.length} luzes = {total.toLocaleString("pt-PT")} combinações</b> — e ainda multiplicas por câmara, composição e estética. O valor está no <i>menu</i>, não na lista fixa de prompts.
      </p>
    </div>
  );
}

// —— Página ————————————————————————————————————————————————
function Conteudo() {
  return (
    <div>
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#833AB4] via-[#C13584] to-[#F56040] opacity-[0.96]" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 pt-12 md:pt-16 pb-10 md:pb-14 text-white">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors mb-6">
            <ArrowLeft size={15} /> Início
          </Link>
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.24em] uppercase font-bold text-white/85 mb-3">
            <Sparkles size={13} /> Rouba como um Criador · do prompt avulso ao sistema
          </span>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] mb-3">Estúdio Creator</h1>
          <p className="text-white/90 text-lg leading-relaxed max-w-2xl">
            A arquitetura de um produto modular: estúdio virtual, motor de substância própria e laboratório de otimização — construído sobre o Método Europeu de Conteúdo.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-6">
            <span className="text-[12px] font-semibold rounded-full bg-white/15 border border-white/25 px-3.5 py-1.5">BASE · Método Europeu de Conteúdo</span>
            <span className="text-[12px] font-semibold rounded-full bg-white/15 border border-white/25 px-3.5 py-1.5">SAÍDA · 30 dias de conteúdo numa tarde</span>
          </div>
        </div>
      </header>

      {/* Fluxo visual */}
      <Secao>
        <Eyebrow>Como funciona</Eyebrow>
        <SecTitulo num="→">O fluxo, do objetivo ao próximo ciclo</SecTitulo>
        <p className="text-ink/65 text-[15px] leading-relaxed mb-5">A pessoa escolhe, preenche e publica. Cada passo alimenta o seguinte.</p>
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
          {FLUXO.map((f, i) => (
            <div key={i} className="flex items-center shrink-0">
              <div className="w-[132px] rounded-2xl border border-[#E4D9EC] bg-white p-3.5">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C13584]/10 text-[#C13584] text-[11px] font-bold mb-2">{i + 1}</span>
                <p className="text-[13px] font-bold text-ink leading-tight">{f.passo}</p>
                <p className="text-[11px] text-ink/55 leading-snug mt-1">{f.desc}</p>
              </div>
              {i < FLUXO.length - 1 && <ChevronRight size={16} className="text-[#C13584]/50 mx-0.5 shrink-0" />}
            </div>
          ))}
        </div>
      </Secao>

      {/* Construtor */}
      <Secao className="pt-2">
        <Eyebrow><span className="inline-flex items-center gap-1.5"><Camera size={12} /> Estúdio Virtual</span></Eyebrow>
        <SecTitulo num="01">Construtor de fotografia</SecTitulo>
        <p className="text-ink/65 text-[15px] leading-relaxed mb-5">O esqueleto é sempre o mesmo; muda o que está entre parênteses. Escolhe nos menus e o prompt monta-se sozinho, pronto a copiar para o teu gerador de imagem.</p>
        <Construtor />
      </Secao>

      {/* Coleções + guarda-roupa */}
      <Secao className="pt-2">
        <Eyebrow>Bibliotecas de variáveis</Eyebrow>
        <SecTitulo num="02">Coleções & guarda-roupa</SecTitulo>
        <p className="text-ink/65 text-[15px] leading-relaxed mb-5">Sessões completas — cada uma gera 10 a 30 imagens coerentes. Combina com os packs de guarda-roupa.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#E4D9EC] bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#C13584] mb-3 inline-flex items-center gap-1.5"><Images size={13} /> Coleções de cenário</p>
            <div className="flex flex-wrap gap-1.5">
              {CENARIOS.map((c, i) => <span key={i} className="text-[12px] rounded-full bg-[#F6EEFA] text-ink/75 px-2.5 py-1">{c.label}</span>)}
            </div>
          </div>
          <div className="rounded-2xl border border-[#E4D9EC] bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#C13584] mb-3 inline-flex items-center gap-1.5"><Shirt size={13} /> Guarda-roupa estratégico</p>
            <div className="flex flex-wrap gap-1.5">
              {GUARDA_ROUPA.map((g, i) => <span key={i} className="text-[12px] rounded-full bg-[#F6EEFA] text-ink/75 px-2.5 py-1">{g}</span>)}
            </div>
          </div>
        </div>
      </Secao>

      {/* Poses por intenção */}
      <Secao className="pt-2">
        <Eyebrow>Não é a posição — é a mensagem</Eyebrow>
        <SecTitulo num="03">Poses com intenção</SecTitulo>
        <p className="text-ink/65 text-[15px] leading-relaxed mb-5">Organiza pelo que a imagem deve comunicar. Resolve o problema de saber onde aparecer, mas não o que fazer com o corpo.</p>
        <div className="grid sm:grid-cols-2 gap-3.5">
          {POSES_INTENCAO.map((cat) => (
            <div key={cat.categoria} className="rounded-2xl border border-[#E4D9EC] bg-white p-4">
              <p className="font-serif text-lg text-ink mb-0.5">{cat.categoria}</p>
              <p className="text-[12.5px] text-ink/60 leading-snug mb-2.5">{cat.mensagem}</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.poses.map((p, i) => <span key={i} className="text-[11.5px] rounded-full bg-[#F6EEFA] text-ink/70 px-2 py-0.5">{p}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Secao>

      {/* Banco por função no funil */}
      <Secao className="pt-2">
        <Eyebrow>Liga a foto à estratégia</Eyebrow>
        <SecTitulo num="04">Banco de imagens por função no funil</SecTitulo>
        <p className="text-ink/65 text-[15px] leading-relaxed mb-5">Deixa de perguntar “que fotografia publico?” e passa a “que função precisa de ser cumprida hoje?”.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {BANCO_FUNIL.map((f) => (
            <div key={f.funcao} className="rounded-2xl border border-[#E4D9EC] bg-white overflow-hidden">
              <div className="px-4 py-2.5 text-white font-bold text-sm" style={{ backgroundColor: f.cor }}>{f.funcao}</div>
              <ul className="p-4 space-y-1.5">
                {f.guia.map((g, i) => <li key={i} className="text-[12.5px] text-ink/70 leading-snug flex gap-1.5"><span style={{ color: f.cor }}>·</span>{g}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Secao>

      {/* Motor de conteúdo — prompts prontos */}
      <Secao className="pt-2">
        <Eyebrow><span className="inline-flex items-center gap-1.5"><Wand2 size={12} /> Substância própria</span></Eyebrow>
        <SecTitulo num="05">Motor de conteúdo original</SecTitulo>
        <p className="text-ink/65 text-[15px] leading-relaxed mb-4">A IA organiza, mas não inventa a tua identidade. Estes prompts extraem a tua substância antes de escrever — prontos a copiar.</p>
        {PROMPTS_CONTEUDO.map((p, i) => <PromptBox key={i} agente={p.agente} nome={p.nome} texto={p.texto} />)}
      </Secao>

      {/* Sistemas por situação */}
      <Secao className="pt-2">
        <Eyebrow>Packs específicos = fáceis de vender</Eyebrow>
        <SecTitulo num="06">Sistemas de conteúdo por situação</SecTitulo>
        <p className="text-ink/65 text-[15px] leading-relaxed mb-5">Cada sistema responde a uma frase que a cliente já diz por palavras dela — e combina nove peças.</p>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {SITUACOES.map((s, i) => <span key={i} className="text-[12.5px] rounded-full bg-white border border-[#E4D9EC] text-ink/70 px-3 py-1.5">“{s}”</span>)}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
          {SISTEMA_PECAS.map((pc) => (
            <div key={pc.n} className="rounded-xl border border-[#E4D9EC] bg-white p-3">
              <span className="text-[#C13584] font-mono text-xs font-bold">{pc.n}</span>
              <p className="text-[13px] font-bold text-ink leading-tight mt-0.5">{pc.titulo}</p>
              <p className="text-[11px] text-ink/55 leading-snug mt-0.5">{pc.desc}</p>
            </div>
          ))}
        </div>
      </Secao>

      {/* Laboratório */}
      <Secao className="pt-2">
        <Eyebrow><span className="inline-flex items-center gap-1.5"><FlaskConical size={12} /> Depois de publicar</span></Eyebrow>
        <SecTitulo num="07">Laboratório de análise e otimização</SecTitulo>
        <p className="text-ink/65 text-[15px] leading-relaxed mb-4">O produto não termina quando o conteúdo é criado. Continua depois da publicação.</p>
        <div className="rounded-2xl border border-[#E4D9EC] bg-white p-5 mb-4">
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {LAB_USOS.map((u, i) => <p key={i} className="text-[13px] text-ink/70 leading-snug flex gap-1.5"><Repeat size={13} className="text-[#C13584] shrink-0 mt-0.5" />{u}</p>)}
          </div>
        </div>
        <PromptBox agente={PROMPTS_CONTEUDO[2].agente} nome={PROMPTS_CONTEUDO[2].nome} texto={PROMPTS_CONTEUDO[2].texto} />
      </Secao>

      {/* Arquitetura em 5 camadas */}
      <Secao className="pt-2">
        <Eyebrow><span className="inline-flex items-center gap-1.5"><Layers size={12} /> A arquitetura</span></Eyebrow>
        <SecTitulo num="08">Cinco camadas, do princípio ao fim</SecTitulo>
        <div className="space-y-2.5 mt-5">
          {CAMADAS.map((cam) => (
            <div key={cam.n} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-2xl border border-[#E4D9EC] bg-white p-4">
              <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#C13584] text-white text-sm font-bold">{cam.n}</span>
                <span className="font-serif text-lg text-ink">{cam.titulo}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cam.itens.map((it, i) => <span key={i} className="text-[12px] rounded-full bg-[#F6EEFA] text-ink/70 px-2.5 py-0.5">{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Secao>

      {/* MVP */}
      <Secao className="pt-2 pb-14">
        <div className="rounded-3xl bg-gradient-to-br from-[#833AB4] to-[#C13584] text-white p-7 md:p-9">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.24em] uppercase font-bold text-white/85 mb-3"><Target size={13} /> O MVP a lançar primeiro</span>
          <h2 className="font-serif text-2xl md:text-3xl leading-tight mb-2">{MVP.nome}</h2>
          <p className="text-white/90 text-[15px] leading-relaxed mb-6 max-w-2xl"><b>A promessa:</b> {MVP.promessa}</p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {MVP.inclui.map((it, i) => <p key={i} className="text-[13.5px] text-white/90 flex gap-1.5"><Check size={14} className="shrink-0 mt-0.5" />{it}</p>)}
          </div>
        </div>
      </Secao>
    </div>
  );
}

export default function EstudioCreator() {
  const { isAdmin, loading } = useAccess();

  if (loading) {
    return <Layout><div className="min-h-[60vh] flex items-center justify-center text-ink/50">A verificar acesso…</div></Layout>;
  }
  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center p-8 text-center">
          <div>
            <Lock size={28} className="mx-auto text-ink/30 mb-3" />
            <p className="text-ink/80 font-semibold">Página restrita</p>
            <p className="text-sm text-ink/50 mt-1">Só a administradora tem acesso ao Estúdio Creator.</p>
            <Link to="/" className="mt-4 inline-block text-sm font-semibold text-[#C13584]">Voltar ao início</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return <Layout><Conteudo /></Layout>;
}

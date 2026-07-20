// PLANO LEVEZA — junta o Documento Mestre com a análise do perfil e devolve o
// prompt que gera o calendário de 90 dias. Limitado a 2 por mês (ver
// lib/plano-leveza.functions).
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@/lib/router-compat";
import { CalendarDays, Upload, X, Sparkles, ArrowRight } from "lucide-react";
import PromptCard from "@/components/PromptCard";
import { notify } from "@/lib/toast";
import { loadInitial as loadDocMestre } from "@/lib/doc-mestre";
import {
  BRIEFING_VAZIO, montarPromptPlanoLeveza, type BriefingLeveza,
} from "@/data/prompts/plano-leveza";
import { getUsosPlanoLeveza, registarUsoPlanoLeveza } from "@/lib/plano-leveza.functions";

const COR = "#C8487E";
const inputCls =
  "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-[#C8487E] transition-colors";

/** Preenche o briefing com o que já existe no Documento Mestre. */
function briefingDoDocMestre(): BriefingLeveza {
  const d = loadDocMestre();
  const dores = d.dores.filter((x) => x.trim());
  const produtos = d.produtos.filter((p) => p.nome.trim());
  const rotulo = (i: number) =>
    produtos[i] ? [produtos[i].nome, produtos[i].ticketMedio].filter(Boolean).join(" · ") : "";

  return {
    ...BRIEFING_VAZIO,
    nome: d.nome.trim(),
    nicho: [d.profissao.trim(), d.oQueFaz.trim()].filter(Boolean).join(" — "),
    avatar: d.publico.trim(),
    dor: dores[0] ?? "",
    tomDeVoz: d.tomDeVoz.trim(),
    // Do mais barato para o mais caro: a entrada costuma ser o 1º produto.
    ofertaEntrada: rotulo(0),
    ofertaFundo: rotulo(1) || rotulo(0),
  };
}

function Campo({ label, ajuda, children }: { label: string; ajuda?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-ink mb-1.5 block">
        {label} {ajuda && <span className="font-normal text-ink/45">{ajuda}</span>}
      </label>
      {children}
    </div>
  );
}

export default function PlanoLeveza() {
  const [b, setB] = useState<BriefingLeveza>(BRIEFING_VAZIO);
  const [analise, setAnalise] = useState("");
  const [nomeFicheiro, setNomeFicheiro] = useState("");
  const [prompt, setPrompt] = useState("");
  const [restantes, setRestantes] = useState<number | null>(null);
  const [aGerar, setAGerar] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const lerUsos = useServerFn(getUsosPlanoLeveza);
  const registarUso = useServerFn(registarUsoPlanoLeveza);

  useEffect(() => {
    setB(briefingDoDocMestre());
    lerUsos({ data: undefined })
      .then((r) => setRestantes(r.restantes))
      .catch(() => setRestantes(null)); // sem sessão/servidor: não bloqueia a interface
  }, [lerUsos]);

  const set = (k: keyof BriefingLeveza, v: string) => setB((s) => ({ ...s, [k]: v }));

  const aoCarregarFicheiro = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 2_000_000) {
      notify("O ficheiro é muito grande (máximo 2 MB).", "error");
      return;
    }
    try {
      const txt = await f.text();
      // Se for o .html do artefacto, tira as etiquetas para sobrar só o texto.
      const limpo = /<[a-z][\s\S]*>/i.test(txt)
        ? txt.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " ")
        : txt;
      setAnalise(limpo.trim());
      setNomeFicheiro(f.name);
      notify("Análise carregada ✓", "success");
    } catch {
      notify("Não foi possível ler esse ficheiro.", "error");
    }
  };

  const gerar = async () => {
    if (!b.nome.trim() || !b.nicho.trim()) {
      notify("Preenche pelo menos o nome e o nicho.", "error");
      return;
    }
    setAGerar(true);
    try {
      const r = await registarUso({ data: undefined });
      setRestantes(r.restantes);
      setPrompt(montarPromptPlanoLeveza(b, analise));
      notify("Plano gerado ✓", "success");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Não foi possível gerar.", "error");
    } finally {
      setAGerar(false);
    }
  };

  const semUsos = restantes !== null && restantes <= 0;

  return (
    <>
      <div className="rounded-2xl border p-5 mb-6" style={{ borderColor: `${COR}40`, background: `${COR}0d` }}>
        <p className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-1" style={{ color: COR }}>
          Plano Leveza · 90 dias
        </p>
        <h2 className="font-serif text-2xl text-ink mb-1.5">O teu calendário completo, escrito de uma vez</h2>
        <p className="text-sm text-ink/60 leading-relaxed">
          Junta o teu <b>Documento Mestre</b> com a <b>análise do teu perfil</b> e devolve um prompt que gera
          um calendário de 90 dias com tudo escrito: Reels em fala natural, carrosséis slide a slide, stories e
          legendas — num ficheiro onde marcas cada peça como gravada ou publicada.
        </p>
        {restantes !== null && (
          <p className="text-[12.5px] mt-3 font-semibold" style={{ color: semUsos ? "#b91c1c" : COR }}>
            {semUsos
              ? "Já usaste os 2 planos deste mês. O contador reinicia no dia 1."
              : `Tens ${restantes} ${restantes === 1 ? "plano disponível" : "planos disponíveis"} este mês (de 2).`}
          </p>
        )}
      </div>

      {/* 1 · Análise do perfil */}
      <div className="rounded-2xl border border-border bg-white p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-6 rounded-full text-[11px] font-bold text-white flex items-center justify-center" style={{ background: COR }}>1</span>
          <h3 className="text-sm font-semibold text-ink">A tua análise de perfil</h3>
        </div>
        <p className="text-[13px] text-ink/55 mb-3 ml-8">
          Carrega o ficheiro que recebeste na{" "}
          <Link to="/maquina-analises" className="font-semibold underline" style={{ color: COR }}>
            Máquina de Análises
          </Link>
          . Serve para o plano partir dos teus números reais, não de suposições.
        </p>
        <input ref={fileInput} type="file" accept=".txt,.md,.html,.htm,.json" className="hidden" onChange={aoCarregarFicheiro} />
        <div className="ml-8">
          {nomeFicheiro ? (
            <div className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2" style={{ borderColor: `${COR}55`, background: `${COR}0d` }}>
              <span className="text-[13px] font-semibold text-ink">{nomeFicheiro}</span>
              <span className="text-[11.5px] text-ink/45">{analise.length.toLocaleString("pt-PT")} caracteres</span>
              <button onClick={() => { setAnalise(""); setNomeFicheiro(""); }} aria-label="Remover ficheiro" className="text-ink/40 hover:text-ink">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-dashed px-4 py-2.5 text-[13px] font-bold transition-colors hover:bg-[#FDF2F6]" style={{ borderColor: "#e3c7d6", color: COR }}>
              <Upload size={15} /> Carregar ficheiro da análise
            </button>
          )}
          <p className="text-[11.5px] text-ink/40 mt-2">Aceita .txt, .md, .html ou .json — até 2 MB. Opcional, mas o plano fica muito melhor com ele.</p>
        </div>
      </div>

      {/* 2 · Briefing */}
      <div className="rounded-2xl border border-border bg-white p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-6 h-6 rounded-full text-[11px] font-bold text-white flex items-center justify-center" style={{ background: COR }}>2</span>
          <h3 className="text-sm font-semibold text-ink">O teu briefing</h3>
        </div>
        <p className="text-[13px] text-ink/55 mb-4 ml-8">
          Já vem preenchido com o teu Documento Mestre. Confirma e completa o que falta.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Campo label="Nome / marca"><input className={inputCls} value={b.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Cátia Creator" /></Campo>
          <Campo label="@handle"><input className={inputCls} value={b.handle} onChange={(e) => set("handle", e.target.value)} placeholder="@catiacreator" /></Campo>
          <Campo label="Nicho" ajuda="o que ensinas ou vendes"><input className={inputCls} value={b.nicho} onChange={(e) => set("nicho", e.target.value)} /></Campo>
          <Campo label="Tom de voz"><input className={inputCls} value={b.tomDeVoz} onChange={(e) => set("tomDeVoz", e.target.value)} placeholder="próximo e direto" /></Campo>
          <Campo label="Avatar" ajuda="cliente ideal"><input className={inputCls} value={b.avatar} onChange={(e) => set("avatar", e.target.value)} /></Campo>
          <Campo label="Dor principal"><input className={inputCls} value={b.dor} onChange={(e) => set("dor", e.target.value)} /></Campo>
          <Campo label="Seguidores hoje"><input className={inputCls} value={b.seguidores} onChange={(e) => set("seguidores", e.target.value)} placeholder="2.400" /></Campo>
          <Campo label="Meta e prazo"><input className={inputCls} value={b.meta} onChange={(e) => set("meta", e.target.value)} placeholder="10.000 em 6 meses" /></Campo>
          <Campo label="Oferta grátis" ajuda="isca de lista"><input className={inputCls} value={b.ofertaGratis} onChange={(e) => set("ofertaGratis", e.target.value)} placeholder="guia, e-book" /></Campo>
          <Campo label="Oferta de entrada"><input className={inputCls} value={b.ofertaEntrada} onChange={(e) => set("ofertaEntrada", e.target.value)} /></Campo>
          <Campo label="Oferta de fundo" ajuda="alto valor"><input className={inputCls} value={b.ofertaFundo} onChange={(e) => set("ofertaFundo", e.target.value)} /></Campo>
          <Campo label="Palavras-chave de CTA"><input className={inputCls} value={b.ctas} onChange={(e) => set("ctas", e.target.value)} placeholder="GUIA, DESAFIO, EU QUERO" /></Campo>
          <Campo label="Duração do plano"><input className={inputCls} value={b.duracao} onChange={(e) => set("duracao", e.target.value)} /></Campo>
          <Campo label="Restrições de voz" ajuda="o que nunca dizer"><input className={inputCls} value={b.restricoes} onChange={(e) => set("restricoes", e.target.value)} /></Campo>
        </div>

        <button onClick={() => setB(briefingDoDocMestre())} className="text-[12.5px] font-semibold mt-4 underline" style={{ color: COR }}>
          Voltar a puxar do Documento Mestre
        </button>
      </div>

      {/* 3 · Gerar */}
      {!prompt ? (
        <button
          onClick={gerar}
          disabled={aGerar || semUsos}
          className="w-full px-6 py-3.5 rounded-xl text-white text-sm font-bold inline-flex items-center justify-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed"
          style={{ background: COR }}
        >
          <Sparkles size={16} />
          {aGerar ? "A gerar…" : semUsos ? "Sem planos disponíveis este mês" : "Gerar o meu Plano Leveza"}
        </button>
      ) : (
        <>
          <div className="rounded-2xl border p-4 mb-4 flex items-start gap-2.5" style={{ borderColor: `${COR}40`, background: `${COR}0d` }}>
            <CalendarDays size={17} className="mt-0.5 shrink-0" style={{ color: COR }} />
            <p className="text-[13px] text-ink/70">
              Copia o prompt e cola-o no <b>Claude</b>. Ele devolve um ficheiro <b>.html</b> — guarda-o no computador
              e abre-o no browser. É esse o teu calendário, com botões para copiar cada peça e marcar o que já gravaste.
            </p>
          </div>
          <PromptCard
            titulo="O teu Plano Leveza de 90 dias"
            descricao="Cola no Claude. Devolve o calendário completo, com todas as peças escritas."
            prompt={prompt}
            rotuloBotao="Copiar prompt"
            agente="Claude"
            botaoCor={COR}
          />
          <Link to="/metodo/pilar-2/redes-sociais?aba=plano" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold mt-2">
            Organizar no Plano de Posts <ArrowRight size={15} />
          </Link>
        </>
      )}
    </>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Film,
  Loader2,
  RefreshCw,
  Sparkles,
  FileDown,
  CalendarPlus,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useServerFn } from "@tanstack/react-start";
import { getUsoReelsSerie, consumirReelsSerie } from "@/lib/reels-serie.functions";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { usePilar2 } from "@/lib/pilar2-hooks";
import { perfilContexto, readDocMestre, type DocMestre } from "@/lib/pilar4-prompts";
import { adicionarPostsPlano } from "@/lib/plano-conteudo";

type NomeSugestao = {
  nome: string;
  molde?: string;
  ingrediente?: string;
  porque?: string;
};

type Roteiro = {
  n: number;
  gancho: string;
  dorCulpa: string;
  corpo: string;
  transicao: string;
  passo1: string;
  passo2: string;
  passo3: string;
};

type Etapa = "ideia" | "nomes" | "roteiros";


// Junta um roteiro num bloco de texto pronto a copiar/gravar.
function roteiroTexto(r: Roteiro): string {
  return [
    r.gancho,
    "",
    r.dorCulpa,
    "",
    r.corpo,
    "",
    r.transicao,
    "",
    r.passo1,
    r.passo2,
    r.passo3,
  ]
    .join("\n")
    .trim();
}

function CopyButton({ text, small }: { text: string; small?: boolean }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white font-medium text-ink transition-colors hover:border-terracotta ${
        small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      {ok ? <Check size={small ? 13 : 15} /> : <Copy size={small ? 13 : 15} />}
      {ok ? "Copiado!" : "Copiar"}
    </button>
  );
}

export default function ReelsEmSerie() {
  const { state: metodo } = usePilar2();
  const [doc, setDoc] = useState<DocMestre>({});
  useEffect(() => {
    setDoc(readDocMestre());
    const onChange = () => setDoc(readDocMestre());
    window.addEventListener("leveza:hydrated", onChange);
    return () => window.removeEventListener("leveza:hydrated", onChange);
  }, []);

  const userContext = useMemo(() => perfilContexto(doc, metodo), [doc, metodo]);
  const ofertaDoc = (doc.produtos || [])
    .map((p) => p?.nome)
    .filter(Boolean)
    .join(", ");

  const [etapa, setEtapa] = useState<Etapa>("ideia");
  const [ideia, setIdeia] = useState("");
  const [modo, setModo] = useState<"exata" | "explorar">("exata");

  // Limite de 5 séries por mês (servidor, por aluno; admin ilimitado).
  const usoFn = useServerFn(getUsoReelsSerie);
  const consumirFn = useServerFn(consumirReelsSerie);
  const [uso, setUso] = useState<{ usados: number; limite: number; restantes: number; ilimitado: boolean } | null>(null);
  useEffect(() => {
    usoFn()
      .then((r) => setUso(r as { usados: number; limite: number; restantes: number; ilimitado: boolean }))
      .catch(() => {});
  }, [usoFn]);
  const semSaldo = !!uso && !uso.ilimitado && uso.restantes <= 0;
  const [publico, setPublico] = useState("");
  const [oferta, setOferta] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  // Preenche público/oferta a partir do Documento Mestre assim que hidratar.
  useEffect(() => {
    if (prefilled) return;
    if (doc.publico || ofertaDoc) {
      if (doc.publico) setPublico((v) => v || doc.publico!);
      if (ofertaDoc) setOferta((v) => v || ofertaDoc);
      setPrefilled(true);
    }
  }, [doc.publico, ofertaDoc, prefilled]);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [temaNota, setTemaNota] = useState("");
  const [nomes, setNomes] = useState<NomeSugestao[]>([]);
  const [nomeSel, setNomeSel] = useState<string | null>(null);
  const [direcao, setDirecao] = useState("");

  const [quantidade, setQuantidade] = useState(7);
  const [maisN, setMaisN] = useState(3);
  const [entregas, setEntregas] = useState<string[]>([]);
  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);

  async function chamar(payload: Record<string, unknown>) {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch("/api/reels-serie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, userContext }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Algo correu mal.");
      return data;
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Algo correu mal.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function gerarNomes(opts?: { mais?: boolean }) {
    const data = await chamar({
      action: "nomes",
      ideia,
      publico,
      oferta,
      direcao: direcao || undefined,
      modo,
      evitar: opts?.mais ? nomes.map((n) => n.nome) : undefined,
    });
    if (!data) return;
    setTemaNota(data.temaNota || "");
    setNomes(opts?.mais ? [...nomes, ...(data.nomes || [])] : data.nomes || []);
    setNomeSel(null);
    setEtapa("nomes");
  }

  async function gerarRoteiros(opts?: { mais?: number }) {
    if (!nomeSel) return;
    const cont = !!opts?.mais && roteiros.length > 0;
    // Limite mensal — só conta séries NOVAS (continuações não gastam saldo).
    if (!cont && uso && !uso.ilimitado && uso.restantes <= 0) {
      setErro(`Atingiste o limite de ${uso.limite} séries este mês. Volta no próximo mês para gerares mais.`);
      return;
    }
    const qtd = cont ? opts!.mais! : quantidade;
    const data = await chamar({
      action: "roteiros",
      nome: nomeSel,
      ideia,
      publico,
      oferta,
      quantidade: qtd,
      desde: cont ? roteiros.length : 0,
      jaEntregues: cont ? entregas : undefined,
    });
    if (!data) return;
    if (cont) {
      // Continuação: numera a partir do último episódio e anexa (não substitui).
      const base = roteiros.length;
      const novos: Roteiro[] = (data.roteiros || []).map((r: Roteiro, i: number) => {
        const num = base + i + 1;
        return { ...r, n: num, gancho: String(r.gancho || "").replace(/parte\s*\d+/i, `parte ${num}`) };
      });
      setEntregas([...entregas, ...(data.entregas || [])]);
      setRoteiros([...roteiros, ...novos]);
    } else {
      setEntregas(data.entregas || []);
      setRoteiros(data.roteiros || []);
      setEtapa("roteiros");
      // Série nova gerada com sucesso → gasta 1 crédito do mês.
      if (!uso?.ilimitado) {
        try {
          const r = await consumirFn();
          setUso((u) => (u ? { ...u, usados: r.usados, restantes: r.restantes } : u));
        } catch {
          /* ignora — não bloqueia a geração já feita */
        }
      }
    }
  }

  function recomecar() {
    setEtapa("ideia");
    setNomes([]);
    setNomeSel(null);
    setEntregas([]);
    setRoteiros([]);
    setDirecao("");
    setErro(null);
  }

  function descarregarTudo() {
    const bloco = [
      `SÉRIE: ${nomeSel}`,
      ideia ? `Ideia base: ${ideia}` : "",
      "",
      "LISTA DE ENTREGAS",
      ...entregas.map((e, i) => `${i + 1}. ${e}`),
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      ...roteiros.map((r) => `EPISÓDIO ${r.n}\n\n${roteiroTexto(r)}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`),
    ]
      .filter((l) => l !== undefined)
      .join("\n");
    const nomeFicheiro = (nomeSel || "reels-em-serie")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const blob = new Blob([bloco], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nomeFicheiro}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportarPdf() {
    const esc = (s: string) =>
      (s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
    const arco = entregas.length
      ? `<div class="arco"><h3>O arco da série</h3><ol>${entregas.map((e) => `<li>${esc(e)}</li>`).join("")}</ol></div>`
      : "";
    const eps = roteiros
      .map(
        (r) => `<section><h2>Episódio ${r.n}</h2>
        <p class="g">${esc(r.gancho)}</p><p>${esc(r.dorCulpa)}</p><p>${esc(r.corpo)}</p>
        <p class="t">${esc(r.transicao)}</p>
        <ul><li>${esc(r.passo1)}</li><li>${esc(r.passo2)}</li><li>${esc(r.passo3)}</li></ul></section>`,
      )
      .join("");
    const html = `<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>${esc(nomeSel || "Série de Reels")}</title>
    <style>
      body{font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;color:#1a1a1a;max-width:720px;margin:32px auto;padding:0 24px;line-height:1.55}
      h1{font-size:26px;margin:0 0 2px}.sub{color:#8a8a8a;margin:0 0 24px;font-size:13px}
      .arco{background:#faf6ef;border:1px solid #eadfce;border-radius:12px;padding:14px 20px;margin-bottom:20px}
      .arco h3{margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#b23c6e}
      .arco ol{margin:0;padding-left:18px}
      section{border:1px solid #eadfce;border-radius:12px;padding:16px 20px;margin-bottom:14px;page-break-inside:avoid}
      h2{color:#b23c6e;font-size:13px;text-transform:uppercase;letter-spacing:.06em;margin:0 0 10px}
      .g{font-weight:600;font-size:17px}.t{color:#666}
      ul{border-left:3px solid #e7b9cd;padding-left:14px;margin:10px 0;list-style:none}
      ul li{margin:2px 0}
      @media print{body{margin:0}}
    </style></head><body>
    <h1>${esc(nomeSel || "Série de Reels")}</h1>
    <p class="sub">${roteiros.length} episódios · Leveza no Digital</p>
    ${arco}${eps}</body></html>`;
    const w = window.open("", "_blank");
    if (!w) {
      alert("Permite pop-ups neste site para exportar o PDF.");
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 350);
  }

  const [guardados, setGuardados] = useState(0);
  function guardarNoCalendario() {
    const itens = roteiros.map((r) => ({
      tipo: "Reel",
      titulo: `${nomeSel || "Série"} — Ep. ${r.n}: ${r.gancho}`.slice(0, 90),
      conteudo: roteiroTexto(r),
    }));
    const n = adicionarPostsPlano(itens);
    setGuardados(n);
    setTimeout(() => setGuardados(0), 6000);
  }

  const copiarTudoTexto = roteiros
    .map((r) => `EPISÓDIO ${r.n}\n${roteiroTexto(r)}`)
    .join("\n\n━━━━━━━━━━\n\n");

  return (
    <Layout>
      <PilarBreadcrumb
        pilar="redes"
        pilarLabel="Conteúdo Todo Dia"
        backTo="/metodo/pilar-2/redes-sociais?aba=formatos&fmt=reels"
        backLabel="Voltar aos formatos"
      />
      <PillarHeader
        numeral="II"
        icon={<Film size={22} />}
        pilarLabel="Reels em Série"
        titulo="Reels em Série"
        subtitulo="Uma ideia entra, uma série de Reels sai — nomes que travam o dedo e roteiros prontos para gravar, na sua voz."
      />

      <div className="max-w-3xl mx-auto px-5 md:px-10 pt-8 pb-16">
        {/* Barra de passos */}
        <div className="mb-8 flex items-center gap-2 text-xs font-medium">
          {(["ideia", "nomes", "roteiros"] as Etapa[]).map((e, i) => {
            const idx = ["ideia", "nomes", "roteiros"].indexOf(etapa);
            const ativo = i <= idx;
            const rotulo = ["1 · A ideia", "2 · Os nomes", "3 · Os roteiros"][i];
            return (
              <div key={e} className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 ${
                    ativo ? "bg-terracotta text-cream" : "bg-ink/8 text-ink/55"
                  }`}
                >
                  {rotulo}
                </span>
                {i < 2 && <span className="text-ink/25">→</span>}
              </div>
            );
          })}
        </div>

        {erro && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {/* ETAPA 1 — A IDEIA */}
        {etapa === "ideia" && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <label className="mb-1.5 block text-sm font-semibold text-ink">A tua ideia ou tema</label>
            <p className="mb-2 text-xs text-ink/55">
              Amplo é ouro. "Hábitos para postar sempre" &gt; "como postar 1 reel por semana".
            </p>
            <textarea
              value={ideia}
              onChange={(e) => setIdeia(e.target.value)}
              rows={3}
              placeholder="Ex.: organização de casa para mães cansadas"
              className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[#FCFAF6] px-4 py-3 text-sm text-ink outline-none focus:border-terracotta"
            />

            {/* Modo: focar na ideia vs. explorar variações à volta */}
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-ink">O que queres que eu sugira?</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setModo("exata")}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                    modo === "exata"
                      ? "border-terracotta bg-terracotta/8"
                      : "border-[var(--color-border)] bg-white hover:border-terracotta/50"
                  }`}
                >
                  <span className={`block text-sm font-semibold ${modo === "exata" ? "text-terracotta-dark" : "text-ink"}`}>
                    A minha ideia
                  </span>
                  <span className="mt-0.5 block text-xs text-ink/55">Séries centradas exatamente no que escreveste.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModo("explorar")}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                    modo === "explorar"
                      ? "border-terracotta bg-terracotta/8"
                      : "border-[var(--color-border)] bg-white hover:border-terracotta/50"
                  }`}
                >
                  <span className={`block text-sm font-semibold ${modo === "explorar" ? "text-terracotta-dark" : "text-ink"}`}>
                    Explorar à volta
                  </span>
                  <span className="mt-0.5 block text-xs text-ink/55">A minha ideia + ângulos melhorados do mesmo tema.</span>
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Para quem é</label>
                <input
                  value={publico}
                  onChange={(e) => setPublico(e.target.value)}
                  placeholder="O teu público / avatar"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[#FCFAF6] px-4 py-2.5 text-sm text-ink outline-none focus:border-terracotta"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">
                  O que vendes <span className="font-normal text-ink/45">(opcional)</span>
                </label>
                <input
                  value={oferta}
                  onChange={(e) => setOferta(e.target.value)}
                  placeholder="Serviço / produto — para os CTA"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[#FCFAF6] px-4 py-2.5 text-sm text-ink outline-none focus:border-terracotta"
                />
              </div>
            </div>
            {prefilled && (
              <p className="mt-2 text-xs text-ink/45">
                ✨ Preenchi o público e a oferta a partir do teu Documento Mestre. Podes editar.
              </p>
            )}

            <button
              onClick={() => gerarNomes()}
              disabled={loading || !ideia.trim()}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark disabled:opacity-40"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? "A pensar em nomes…" : "Sugerir nomes de série"}
            </button>

            {uso && !uso.ilimitado && (
              <p className={`mt-3 text-xs ${semSaldo ? "text-red-500" : "text-ink/55"}`}>
                ℹ️ Podes gerar até <strong className="font-semibold">{uso.limite} séries por mês</strong>
                {semSaldo
                  ? ` — já atingiste o limite este mês.`
                  : uso.usados > 0
                    ? ` — já usaste ${uso.usados}, restam ${uso.restantes}.`
                    : ` — este mês ainda tens ${uso.restantes}.`}
              </p>
            )}
          </div>
        )}

        {/* ETAPA 2 — OS NOMES */}
        {etapa === "nomes" && (
          <div>
            <button
              onClick={() => setEtapa("ideia")}
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-terracotta"
            >
              <ArrowLeft size={14} /> Mudar a ideia
            </button>

            {temaNota && (
              <div className="mb-4 rounded-xl border-l-4 border-terracotta bg-terracotta/5 px-4 py-3 text-sm text-ink/75">
                {temaNota}
              </div>
            )}

            <p className="mb-3 font-serif text-lg text-ink">
              Escolhe o nome da série <span className="text-ink/45">(o que puxa o dedo a parar)</span>
            </p>

            <div className="grid gap-3">
              {nomes.map((n, i) => {
                const ativo = nomeSel === n.nome;
                return (
                  <button
                    key={`${n.nome}-${i}`}
                    onClick={() => setNomeSel(n.nome)}
                    className={`relative rounded-2xl border p-4 text-left transition-colors ${
                      ativo
                        ? "border-terracotta bg-terracotta/5"
                        : "border-[var(--color-border)] bg-white hover:border-terracotta/50"
                    }`}
                  >
                    <p className={`font-serif text-base ${ativo ? "text-terracotta" : "text-ink"}`}>
                      {n.nome}
                    </p>
                    <p className="mt-1 text-xs text-ink/55">
                      {[n.molde, n.ingrediente].filter(Boolean).join(" · ")}
                      {n.porque ? ` — ${n.porque}` : ""}
                    </p>
                    {ativo && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-cream">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => gerarNomes({ mais: true })}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-terracotta disabled:opacity-40"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                Gerar mais nomes
              </button>
              <input
                value={direcao}
                onChange={(e) => setDirecao(e.target.value)}
                placeholder="Outra direção? (mais casual, mais provocador…)"
                className="min-w-0 flex-1 rounded-full border border-[var(--color-border)] bg-[#FCFAF6] px-4 py-2 text-sm text-ink outline-none focus:border-terracotta"
              />
              {direcao.trim() && (
                <button
                  onClick={() => gerarNomes()}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-ink/85 px-4 py-2 text-sm font-medium text-cream hover:bg-ink disabled:opacity-40"
                >
                  Aplicar direção
                </button>
              )}
            </div>

            {/* Selecionar quantidade + gerar */}
            <div className="mt-6 rounded-2xl border border-terracotta/30 bg-white p-5">
              <p className="mb-2 text-sm font-semibold text-ink">Quantos episódios queres?</p>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 10))}
                  aria-label="Número de episódios"
                  className="h-10 w-20 rounded-xl border border-[var(--color-border)] bg-white px-3 text-center text-sm text-ink outline-none focus:border-terracotta"
                />
                <span className="text-sm text-ink/55">episódios</span>
              </div>
              <p className="mb-4 text-xs text-ink/45">Até 10 de cada vez — depois podes pedir a continuação.</p>
              <button
                onClick={() => gerarRoteiros()}
                disabled={loading || !nomeSel || semSaldo}
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark disabled:opacity-40"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {loading
                  ? "A escrever os roteiros…"
                  : semSaldo
                    ? "Limite mensal atingido"
                    : nomeSel
                      ? `Gerar ${quantidade} roteiros`
                      : "Escolhe um nome acima"}
              </button>
              {uso && !uso.ilimitado && (
                <p className={`mt-3 text-xs ${semSaldo ? "text-red-500" : "text-ink/55"}`}>
                  {semSaldo
                    ? `Atingiste o limite de ${uso.limite} séries este mês.`
                    : `Séries este mês: ${uso.usados}/${uso.limite} · restam ${uso.restantes}`}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ETAPA 3 — OS ROTEIROS */}
        {etapa === "roteiros" && (
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-serif text-xl text-ink">{nomeSel}</p>
                <p className="text-sm text-ink/55">{roteiros.length} episódios prontos para gravar</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <CopyButton text={copiarTudoTexto} />
                <button
                  onClick={descarregarTudo}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-terracotta"
                >
                  <Download size={15} /> .txt
                </button>
                <button
                  onClick={exportarPdf}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-terracotta"
                >
                  <FileDown size={15} /> Exportar PDF
                </button>
                <button
                  onClick={guardarNoCalendario}
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
                >
                  <CalendarPlus size={15} /> Guardar no calendário
                </button>
              </div>
            </div>

            {guardados > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-terracotta/30 bg-terracotta/[0.06] px-4 py-3 text-sm text-ink">
                <Check size={16} className="text-terracotta" />
                {guardados} {guardados === 1 ? "episódio guardado" : "episódios guardados"} no calendário de conteúdo — agora escolhe a data de cada um.
                <Link
                  to="/metodo/pilar-2/redes-sociais?aba=plano"
                  className="inline-flex items-center gap-1 font-semibold text-terracotta hover:text-terracotta-dark"
                >
                  Ir agendar <ArrowUpRight size={14} />
                </Link>
              </div>
            )}

            {/* Lista de entregas */}
            {entregas.length > 0 && (
              <div className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[#FCFAF6] p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-terracotta">
                  O arco da série
                </p>
                <ol className="space-y-1.5">
                  {entregas.map((e, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink/80">
                      <span className="font-semibold text-terracotta">{i + 1}.</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Roteiros */}
            <div className="space-y-4">
              {roteiros.map((r) => (
                <div key={r.n} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta">
                      Episódio {r.n}
                    </span>
                    <CopyButton small text={roteiroTexto(r)} />
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-ink/85">
                    <p className="font-serif text-base text-ink">{r.gancho}</p>
                    <p>{r.dorCulpa}</p>
                    <p>{r.corpo}</p>
                    <p className="text-ink/70">{r.transicao}</p>
                    <div className="space-y-1.5 border-l-2 border-terracotta/30 pl-3">
                      <p>{r.passo1}</p>
                      <p>{r.passo2}</p>
                      <p>{r.passo3}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-[var(--color-border)] bg-white px-4 py-3 text-sm text-ink/60">
              💡 Lê cada roteiro em voz alta e troca qualquer palavra que tu não dirias — o método vive
              da tua voz. A estrutura e a primeira versão são minhas; a voz é tua.
            </div>

            {/* Continuar a série — gera mais episódios sem perder os atuais */}
            <div className="mt-6 rounded-2xl border border-terracotta/30 bg-white p-5">
              <p className="mb-1 text-sm font-semibold text-ink">Continuar a série</p>
              <p className="mb-3 text-sm text-ink/55">
                Gera mais episódios a partir do {roteiros.length + 1}º — os {roteiros.length} atuais mantêm-se.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={maisN}
                  onChange={(e) => setMaisN(Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 10))}
                  aria-label="Quantos episódios a mais"
                  className="h-10 w-20 rounded-xl border border-[var(--color-border)] bg-white px-3 text-center text-sm text-ink outline-none focus:border-terracotta"
                />
                <button
                  onClick={() => gerarRoteiros({ mais: maisN })}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark disabled:opacity-40"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {loading ? "A escrever…" : `Gerar mais ${maisN} episódios`}
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => setEtapa("nomes")}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-ink hover:border-terracotta"
              >
                <ArrowLeft size={14} /> Voltar aos nomes
              </button>
              <button
                onClick={recomecar}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-ink hover:border-terracotta"
              >
                <RefreshCw size={14} /> Nova série
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

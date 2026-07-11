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
} from "lucide-react";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { usePilar2 } from "@/lib/pilar2-hooks";
import { perfilContexto, readDocMestre, type DocMestre } from "@/lib/pilar4-prompts";

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

const QTD_OPCOES = [3, 5, 7, 10];

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
      evitar: opts?.mais ? nomes.map((n) => n.nome) : undefined,
    });
    if (!data) return;
    setTemaNota(data.temaNota || "");
    setNomes(opts?.mais ? [...nomes, ...(data.nomes || [])] : data.nomes || []);
    setNomeSel(null);
    setEtapa("nomes");
  }

  async function gerarRoteiros() {
    if (!nomeSel) return;
    const data = await chamar({ action: "roteiros", nome: nomeSel, ideia, publico, oferta, quantidade });
    if (!data) return;
    setEntregas(data.entregas || []);
    setRoteiros(data.roteiros || []);
    setEtapa("roteiros");
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
                    ativo ? "bg-terracotta text-cream" : "bg-[#F5EFE6] text-ink/45"
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
              <div className="mb-4 flex gap-2">
                {QTD_OPCOES.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuantidade(q)}
                    className={`h-10 w-12 rounded-xl border text-sm font-medium transition-colors ${
                      quantidade === q
                        ? "border-terracotta bg-terracotta text-cream"
                        : "border-[var(--color-border)] bg-white text-ink hover:border-terracotta/50"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <button
                onClick={gerarRoteiros}
                disabled={loading || !nomeSel}
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark disabled:opacity-40"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {loading
                  ? "A escrever os roteiros…"
                  : nomeSel
                    ? `Gerar ${quantidade} roteiros`
                    : "Escolhe um nome acima"}
              </button>
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
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
                >
                  <Download size={15} /> Descarregar
                </button>
              </div>
            </div>

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

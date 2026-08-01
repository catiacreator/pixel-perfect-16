import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Check, ArrowRight, Compass, PartyPopper } from "lucide-react";
import { useBloqueios } from "@/lib/bloqueios";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";

// ─────────────────────────────────────────────────────────────────────────────
// TRILHO GUIADO — o "por onde começo?" da plataforma.
// Um percurso numerado (do início ao fim) com estados: ✓ feito · ▶ agora · a seguir.
// Adapta-se à turma: passos sem acesso não aparecem. É a "instrução de trabalho"
// dentro do produto — a aluna nunca fica sem saber o próximo passo.
// ─────────────────────────────────────────────────────────────────────────────

const VISITADO_KEY = "leveza.trilho-visto.v1";

// Lê um blob de localStorage e diz se algum dos campos indicados está preenchido.
function preenchido(raw: string | null, campos: string[]): boolean {
  if (!raw) return false;
  try {
    const o = JSON.parse(raw);
    return campos.some((c) => typeof o?.[c] === "string" && o[c].trim().length > 0);
  } catch {
    return false;
  }
}

function esteiraFeita(raw: string | null): boolean {
  if (!raw) return false;
  try {
    const o = JSON.parse(raw);
    const n = o?.niveis ?? {};
    return ["low", "medio", "alto"].some((k) => (n[k]?.nome ?? "").trim().length > 0);
  } catch {
    return false;
  }
}

type Passo = {
  key: string;
  id: string; // id na ESTRUTURA — para respeitar o acesso da turma
  to: string;
  label: string;
  sub: string;
  feito?: () => boolean; // deteção automática; se ausente, usa "visitado"
};

const PASSOS: Passo[] = [
  { key: "doc", id: "doc-mestre", to: "/doc-mestre", label: "Documento Mestre", sub: "Quem és, para quem e a tua voz — a base de tudo",
    feito: () => preenchido(localStorage.getItem("leveza.doc-mestre.v1"), ["nome", "publico", "o_que_faz"]) },
  { key: "tom", id: "pilar-2.tom", to: "/metodo/pilar-2/tom-de-voz", label: "Tom de Voz", sub: "Como escreves e o que defendes",
    feito: () => preenchido(localStorage.getItem("leveza.pilar2.v1"), ["tomDeVoz", "crencaCentral"]) },
  { key: "visual", id: "pilar-2.visual", to: "/metodo/pilar-2/identidade-visual", label: "Identidade Visual", sub: "Cores, tipografia e mood",
    feito: () => preenchido(localStorage.getItem("leveza.pilar2.v1"), ["vibeMarca", "paleta"]) },
  { key: "criar", id: "redes.criar", to: "/metodo/pilar-2/redes-sociais?aba=criar", label: "Criar Conteúdo", sub: "O teu primeiro post ou reel" },
  { key: "plano", id: "redes.desafio", to: "/metodo/pilar-2/redes-sociais?aba=desafio", label: "Plano de 30 dias", sub: "Publicar com consistência" },
  { key: "produto", id: "criar-produto", to: "/criar-produto", label: "Criar Produto", sub: "Transformar tudo em vendas",
    feito: () => esteiraFeita(localStorage.getItem("leveza.esteira.v1")) },
];

function lerVisitados(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(VISITADO_KEY) || "[]")); } catch { return new Set(); }
}

export default function TrilhoGuiado() {
  const { isBloqueado, carregado } = useBloqueios();
  const bloqueadoParaAlunos = useBloqueadoParaAlunos();
  const [tick, setTick] = useState(0); // re-lê o progresso quando volta à página
  const [visitados, setVisitados] = useState<Set<string>>(new Set());

  useEffect(() => {
    setVisitados(lerVisitados());
    const on = () => { setVisitados(lerVisitados()); setTick((t) => t + 1); };
    window.addEventListener("focus", on);
    window.addEventListener("storage", on);
    return () => { window.removeEventListener("focus", on); window.removeEventListener("storage", on); };
  }, []);

  // Só mostra os passos a que a aluna tem acesso (admin vê todos).
  const visiveis = PASSOS.filter((p) => !bloqueadoParaAlunos || !isBloqueado(p.id));
  if (!carregado || visiveis.length === 0) return null;

  const estaFeito = (p: Passo) => (p.feito ? safeCheck(p.feito) : visitados.has(p.key));
  const estados = visiveis.map((p) => ({ passo: p, feito: estaFeito(p) }));
  const idxAtual = estados.findIndex((e) => !e.feito);
  const tudoFeito = idxAtual === -1;

  const marcarVisitado = (key: string) => {
    const s = lerVisitados(); s.add(key);
    try { localStorage.setItem(VISITADO_KEY, JSON.stringify([...s])); } catch { /* ignora */ }
    setVisitados(s);
  };

  const feitos = estados.filter((e) => e.feito).length;

  return (
    <section className="mt-2 mb-4" key={tick}>
      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 md:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-terracotta" />
            <h2 className="font-display text-lg text-ink">O teu percurso</h2>
          </div>
          <span className="text-[12px] text-ink/50 shrink-0">{feitos}/{visiveis.length} passos</span>
        </div>

        {tudoFeito ? (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3.5">
            <PartyPopper size={20} className="text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-800">Completaste o percurso — parabéns! Volta a qualquer passo quando quiseres.</p>
          </div>
        ) : null}

        <ol className="mt-1 space-y-2">
          {estados.map((e, i) => {
            const atual = i === idxAtual;
            const feito = e.feito;
            return (
              <li key={e.passo.key}>
                <Link
                  to={e.passo.to}
                  onClick={() => marcarVisitado(e.passo.key)}
                  className={`flex items-center gap-3.5 rounded-2xl border p-3.5 transition-colors ${
                    atual
                      ? "border-terracotta/40 bg-terracotta/[0.05] hover:bg-terracotta/[0.09]"
                      : feito
                        ? "border-[var(--color-border)] bg-white hover:bg-ink/[0.02]"
                        : "border-[var(--color-border)] bg-white hover:bg-ink/[0.02] opacity-70"
                  }`}
                >
                  {/* estado / número */}
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold ${
                      feito ? "bg-emerald-500 text-white" : atual ? "bg-terracotta text-cream" : "bg-ink/8 text-ink/45"
                    }`}
                  >
                    {feito ? <Check size={15} /> : i + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-[15px] font-semibold ${feito || atual ? "text-ink" : "text-ink/70"}`}>{e.passo.label}</p>
                      {atual && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta bg-terracotta/10 rounded-full px-2 py-0.5">
                          Continua aqui
                        </span>
                      )}
                      {feito && !atual && <span className="text-[11px] text-emerald-600 font-medium">feito</span>}
                    </div>
                    <p className="text-[12.5px] text-ink/50 truncate">{e.passo.sub}</p>
                  </div>

                  <ArrowRight size={16} className={`shrink-0 ${atual ? "text-terracotta" : "text-ink/25"}`} />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function safeCheck(fn: () => boolean): boolean {
  try { return fn(); } catch { return false; }
}

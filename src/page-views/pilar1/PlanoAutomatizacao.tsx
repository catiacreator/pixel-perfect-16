import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import { useServerFn } from "@tanstack/react-start";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import {
  Hourglass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Wand2,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  INITIAL_STATE,
  loadDetetive,
  calcularRelatorio,
  brl,
} from "@/lib/detetive-storage";
import { gerarPlanoAutomatizacao } from "@/lib/plano.functions";
import { TOOLS } from "@/data/aulas";

type Recomendacao = {
  tarefa: string;
  ferramenta: string;
  comoAutomatizar: string;
  economiaPct: number;
};

type Plano = {
  recomendacoes: Recomendacao[];
  ganhoTotalHoras: number;
  primeiroPasso: string;
};

export default function PlanoAutomatizacao() {
  const [state, setState] = useState(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [plano, setPlano] = useState<Plano | null>(null);
  const gerar = useServerFn(gerarPlanoAutomatizacao);

  useEffect(() => {
    setState(loadDetetive());
    setHydrated(true);
  }, []);

  const rel = useMemo(() => calcularRelatorio(state), [state]);
  const toolBySlug = useMemo(() => Object.fromEntries(TOOLS.map((t) => [t.slug, t])), []);

  const handleGerar = async () => {
    setErro(null);
    setLoading(true);
    try {
      const top = rel.tarefas.slice(0, 8).map((t) => ({
        nome: t.nome,
        categoria: t.categoria,
        horasMes: t.horasMes,
        custoMes: t.custoMes,
      }));
      const r = await gerar({ data: { tarefas: top } });
      setPlano(r as Plano);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao gerar plano.");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <Layout>
        <div className="px-5 py-10 max-w-4xl mx-auto text-muted text-sm">A carregar…</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PilarBreadcrumb
        pilar={1}
        pilarLabel="Recuperar seu Tempo"
        backTo="/metodo/pilar-1/detetive-do-tempo/relatorio"
        backLabel="Voltar para o Relatório"
      />
      <PillarHeader
        numeral="I"
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1"
        titulo="Plano de Automatização"
        subtitulo="A IA olha para as suas tarefas mais caras e diz exatamente por onde começar"
      />

      <div className="px-5 md:px-10 pb-16 max-w-4xl mx-auto">
        {!rel.preenchido ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-muted">
            Faltam dados. Preencha o Detetive do Tempo primeiro.
            <div className="mt-4">
              <Link
                to="/metodo/pilar-1/detetive-do-tempo"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
              >
                Ir para o Detetive <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : !plano ? (
          <div className="rounded-2xl border border-terracotta bg-white shadow-sm p-6">
            <div className="flex items-start gap-3 mb-4">
              <Wand2 size={20} className="text-terracotta flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-serif text-xl text-ink mb-1">Vamos gerar o seu plano</h2>
                <p className="text-sm text-muted">
                  A IA vai analisar as suas <span className="font-semibold text-ink">{Math.min(rel.tarefas.length, 8)}</span> tarefas
                  mais caras (total <span className="font-semibold text-ink">{brl(rel.totalCusto)}/mês</span>) e
                  recomendar qual ferramenta usar para cada uma.
                </p>
              </div>
            </div>
            {erro && (
              <div className="flex items-start gap-2 text-sm text-terracotta mb-3">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <p>{erro}</p>
              </div>
            )}
            <button
              onClick={handleGerar}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {loading ? "A pensar…" : "Gerar plano com IA"}
            </button>
          </div>
        ) : (
          <>
            {/* hero */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl border border-terracotta bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-terracotta text-[11px] tracking-[0.18em] uppercase mb-1">
                  <Clock size={13} /> Horas / mês a recuperar
                </div>
                <p className="font-serif text-2xl text-ink">{plano.ganhoTotalHoras.toFixed(1).replace(".", ",")}h</p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-muted text-[11px] tracking-[0.18em] uppercase mb-1">
                  <TrendingUp size={13} className="text-terracotta" /> Valor estimado
                </div>
                <p className="font-serif text-2xl text-ink">
                  {brl(plano.ganhoTotalHoras * rel.horaVale)}
                </p>
              </div>
            </div>

            {/* primeiro passo */}
            <div className="rounded-2xl border border-dashed border-terracotta bg-white p-5 mb-6">
              <p className="text-[11px] tracking-[0.18em] uppercase text-terracotta mb-1">Comece amanhã por aqui</p>
              <p className="text-ink leading-snug">{plano.primeiroPasso}</p>
            </div>

            {/* recomendações */}
            <div className="space-y-3 mb-6">
              {plano.recomendacoes.map((r, i) => {
                const tool = toolBySlug[r.ferramenta];
                return (
                  <div key={i} className="rounded-2xl border border-border bg-white shadow-sm p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="font-serif text-2xl text-terracotta w-7 flex-shrink-0 text-center">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink font-semibold leading-tight">{r.tarefa}</p>
                        <p className="text-xs text-muted mt-0.5">Economia estimada: <span className="font-semibold text-success">{r.economiaPct}%</span></p>
                      </div>
                    </div>
                    <p className="text-sm text-ink/85 leading-relaxed mb-3">{r.comoAutomatizar}</p>
                    {tool && (
                      <Link
                        to={`/metodo/pilar-1/aprenda-ia/${tool.slug}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-terracotta border border-terracotta rounded-full px-3 py-1.5 hover:bg-terracotta hover:text-cream transition-colors"
                      >
                        <span className="w-5 h-5 rounded-md bg-cream-warm/60 flex items-center justify-center font-serif text-[11px] text-ink">
                          {tool.inicial}
                        </span>
                        Aprender {tool.nome} <ArrowRight size={11} />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => { setPlano(null); }}
              className="text-xs text-muted underline mb-6 block mx-auto"
            >
              Gerar de novo
            </button>
          </>
        )}

        <div className="flex items-center justify-between mt-6">
          <Link to="/metodo/pilar-1/detetive-do-tempo/relatorio" className="inline-flex items-center gap-1.5 text-sm text-ink hover:opacity-70">
            <ArrowLeft size={14} /> Relatório
          </Link>
          <Link to="/metodo/pilar-1/conclusao" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink border border-ink rounded-full px-4 py-2 hover:bg-ink hover:text-cream transition-colors">
            Concluir Pilar 1 <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

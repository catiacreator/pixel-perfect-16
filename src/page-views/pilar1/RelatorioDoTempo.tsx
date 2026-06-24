import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import {
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Clock,
  Coins,
  TrendingDown,
  Sparkles,
  Hourglass,
  Printer,
} from "lucide-react";
import {
  DetetiveState,
  INITIAL_STATE,
  loadDetetive,
  calcularRelatorio,
  brl,
} from "@/lib/detetive-storage";

const CATEGORIA_COLOR: Record<string, string> = {
  "Produção": "bg-terracotta",
  "Marketing": "bg-ink",
  "Estratégia": "bg-success",
};

function fmtHoras(h: number) {
  if (h < 1) return `${Math.round(h * 60)} min`;
  return `${h.toFixed(1).replace(".", ",")} h`;
}

export default function RelatorioDoTempo() {
  const [state, setState] = useState<DetetiveState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadDetetive());
    setHydrated(true);
  }, []);

  const rel = useMemo(() => calcularRelatorio(state), [state]);

  if (!hydrated) {
    return (
      <Layout>
        <div className="px-5 py-10 max-w-4xl mx-auto text-muted text-sm">A carregar…</div>
      </Layout>
    );
  }

  if (!rel.preenchido) {
    return (
      <Layout>
        <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo="/metodo/pilar-1/detetive-do-tempo" backLabel="Voltar para o Mapa do Tempo" />
        <div className="px-5 md:px-10 py-10 max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl text-ink mb-4">Relatório — Mapa do Tempo</h1>
          <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-muted mb-6">
            Faltam dados. Volte para o Mapa do Tempo, preencha faturamento, horas, dias e adicione as suas tarefas.
          </div>
          <Link
            to="/metodo/pilar-1/detetive-do-tempo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
          >
            Ir para o Mapa do Tempo <ArrowRight size={15} />
          </Link>
        </div>
      </Layout>
    );
  }

  const top3 = rel.tarefas.slice(0, 3);
  const maxCat = Math.max(...rel.porCategoria.map((c) => c.custo), 1);

  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo="/metodo/pilar-1/detetive-do-tempo" backLabel="Voltar para o Mapa do Tempo" />
      <PillarHeader
        numeral="I"
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1"
        titulo="Relatório do Mapa do Tempo"
        subtitulo="Onde o seu tempo está realmente indo — em horas e em reais"
      />

      <div className="px-5 md:px-10 pb-16 max-w-4xl mx-auto print:max-w-none">
        {/* hero cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted text-[11px] tracking-[0.18em] uppercase mb-1">
              <Coins size={13} className="text-terracotta" /> Sua hora vale
            </div>
            <p className="font-serif text-2xl text-ink">{brl(rel.horaVale)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted text-[11px] tracking-[0.18em] uppercase mb-1">
              <Clock size={13} className="text-terracotta" /> Horas / mês
            </div>
            <p className="font-serif text-2xl text-ink">{fmtHoras(rel.totalHoras)}</p>
          </div>
          <div className="rounded-2xl border border-terracotta bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-terracotta text-[11px] tracking-[0.18em] uppercase mb-1">
              <BarChart3 size={13} /> Custo / mês
            </div>
            <p className="font-serif text-2xl text-ink">{brl(rel.totalCusto)}</p>
          </div>
        </div>

        {/* gráfico por categoria */}
        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 mb-6">
          <h3 className="font-serif text-xl text-ink mb-1">Onde o seu dinheiro vai por categoria</h3>
          <p className="text-xs text-muted mb-4">Custo mensal de cada bloco de trabalho.</p>
          <div className="space-y-3">
            {rel.porCategoria.map((c) => {
              const pct = (c.custo / maxCat) * 100;
              const color = CATEGORIA_COLOR[c.titulo] ?? "bg-ink";
              return (
                <div key={c.titulo}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink font-semibold">{c.titulo}</span>
                    <span className="text-muted">{fmtHoras(c.horas)} · <span className="text-ink font-semibold">{brl(c.custo)}</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-cream overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* top 3 tarefas mais caras */}
        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={16} className="text-terracotta" />
            <h3 className="font-serif text-xl text-ink">Tarefas que mais pesam no bolso</h3>
          </div>
          <p className="text-xs text-muted mb-4">Estas são as suas candidatas a automatizar primeiro.</p>
          <ol className="space-y-2">
            {top3.map((t, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="font-serif text-2xl text-terracotta w-6 text-center">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm text-ink font-semibold leading-tight">{t.nome}</p>
                  <p className="text-xs text-muted">{t.categoria} · {fmtHoras(t.horasMes)} / mês</p>
                </div>
                <p className="font-serif text-lg text-ink">{brl(t.custoMes)}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* lista completa */}
        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 mb-6">
          <h3 className="font-serif text-xl text-ink mb-4">Detalhe — todas as tarefas</h3>
          <div className="divide-y divide-border">
            {rel.tarefas.map((t, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5">
                <div className="flex-1">
                  <p className="text-sm text-ink leading-tight">{t.nome}</p>
                  <p className="text-[11px] text-muted">{t.categoria} · {fmtHoras(t.horasMes)} / mês</p>
                </div>
                <p className="text-sm font-semibold text-ink">{brl(t.custoMes)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* leveza insight */}
        <div className="rounded-2xl border border-dashed border-terracotta bg-white p-5 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-terracotta flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-serif text-base text-ink mb-1">A leveza começa aqui</p>
              <p className="text-sm text-muted">
                Você está gastando <span className="font-semibold text-ink">{brl(rel.totalCusto)}</span> por mês — e{" "}
                <span className="font-semibold text-ink">{fmtHoras(rel.totalHoras)}</span> da sua vida — nestas tarefas.{" "}
                Imagine devolver mesmo que só {top3[0] ? brl(top3[0].custoMes) : "uma parte"} disso pro seu negócio (ou pra você).
                É exatamente o que as IAs do Pilar 1 vão te ajudar a fazer.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to="/metodo/pilar-1/detetive-do-tempo/plano" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cream bg-terracotta rounded-full px-4 py-1.5">
                  Gerar plano de automatização <ArrowRight size={13} />
                </Link>
                <Link to="/metodo/pilar-1/aprenda-ia" className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta border border-terracotta rounded-full px-4 py-1.5">
                  Aprender as IAs <ArrowRight size={13} />
                </Link>
                <Link to="/metodo/pilar-1/conclusao" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink border border-ink rounded-full px-4 py-1.5">
                  Concluir Pilar 1 <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between print:hidden">
          <Link to="/metodo/pilar-1/detetive-do-tempo" className="inline-flex items-center gap-1.5 text-sm text-ink hover:opacity-70">
            <ArrowLeft size={14} /> Editar tarefas
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-sm text-ink border border-border rounded-full px-4 py-1.5 hover:bg-cream"
          >
            <Printer size={13} /> Imprimir
          </button>
        </div>
      </div>
    </Layout>
  );
}

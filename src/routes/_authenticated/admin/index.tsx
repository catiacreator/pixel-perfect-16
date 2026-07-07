import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Users, Coins, Activity, Trophy, PartyPopper, Crown } from "lucide-react";
import { getAdminOverview, getAlertaVencedor, premiarVencedor } from "@/lib/admin.functions";
import { notify } from "@/lib/toast";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

const MESES_PT = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
function nomeDoMes(mes: string): string {
  const [y, m] = mes.split("-").map(Number);
  return `${MESES_PT[(m || 1) - 1]} ${y}`;
}

function Overview() {
  const fetch = useServerFn(getAdminOverview);
  const { data } = useSuspenseQuery({ queryKey: ["admin-overview"], queryFn: () => fetch() });

  const cards = [
    { icon: Users, label: "Mentoradas", value: data.totalMentoradas },
    { icon: Coins, label: "Pontos no mês", value: data.pontosDistribuidos },
    { icon: Activity, label: "Ativas (7d)", value: data.ativas7d },
    { icon: Trophy, label: "Top pontuação", value: data.top5[0]?.pontos ?? 0 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">Visão geral</h1>
      <p className="text-sm text-ink/60 mt-1">Resumo da operação.</p>

      <VencedorAlerta />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
              <Icon size={18} className="text-terracotta" />
              <p className="text-[11px] uppercase tracking-wider text-ink/40 mt-3">{c.label}</p>
              <p className="text-2xl font-semibold mt-1">{c.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
          <h2 className="text-sm font-semibold">Top 5</h2>
          <div className="mt-4 flex flex-col">
            {data.top5.length === 0 && <p className="text-sm text-ink/50">Sem dados ainda.</p>}
            {data.top5.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink/40 w-5">{i + 1}</span>
                  <span className="text-sm">{p.nome ?? "Sem nome"}</span>
                  <span className="text-[10px] uppercase tracking-wider text-ink/40">{p.tier}</span>
                </div>
                <span className="text-sm font-medium">{p.pontos}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
          <h2 className="text-sm font-semibold">Atividade recente</h2>
          <div className="mt-4 flex flex-col">
            {data.atividade.length === 0 && <p className="text-sm text-ink/50">Sem atividade.</p>}
            {data.atividade.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                <div className="min-w-0">
                  <p className="text-sm truncate">{a.profiles?.nome ?? "Mentorada"}</p>
                  <p className="text-[11px] text-ink/50 truncate">{a.motivo}</p>
                </div>
                <span className={`text-sm font-medium ${a.delta >= 0 ? "text-sage" : "text-rose-700"}`}>
                  {a.delta >= 0 ? "+" : ""}{a.delta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Alerta da competição mensal de posts. A partir do dia 30, destaca-se para
// anunciar o vencedor (mais posts no mês → sessão de 30 min).
function VencedorAlerta() {
  const fetchAlerta = useServerFn(getAlertaVencedor);
  const premiar = useServerFn(premiarVencedor);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["alerta-vencedor"], queryFn: () => fetchAlerta() });
  const mut = useMutation({
    mutationFn: (v: { userId: string; mes: string }) => premiar({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerta-vencedor"] });
      notify("Vencedor premiado — +300 pontos e sessão de 30 min. 🎉", "success");
    },
    onError: (e: unknown) => notify(e instanceof Error ? e.message : "Erro ao premiar", "error"),
  });

  if (!data.lider) return null; // ninguém publicou este mês

  const destaque = data.alertar; // dia >= 30 e ainda não premiado
  const jaPremiado = data.lider.jaPremiado;

  return (
    <div
      className={`mt-6 rounded-2xl border p-5 flex flex-wrap items-center gap-4 ${
        destaque ? "border-amber-300 bg-amber-50" : "border-[var(--color-border)] bg-white"
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${destaque ? "bg-amber-100 text-amber-700" : "bg-terracotta/10 text-terracotta"}`}>
        {jaPremiado ? <PartyPopper size={22} /> : <Crown size={22} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wider text-ink/45">Competição · {nomeDoMes(data.mes)}</p>
        <p className="text-sm text-ink mt-0.5">
          <b>{data.lider.nome}</b> lidera com <b>{data.lider.posts}</b> post{data.lider.posts === 1 ? "" : "s"} este mês.
          {jaPremiado ? (
            <span className="text-emerald-700 font-semibold"> Vencedor já anunciado ✓</span>
          ) : destaque ? (
            <span className="text-amber-700 font-semibold"> Dia {data.dia} — hora de anunciar o vencedor!</span>
          ) : (
            <span className="text-ink/50"> O vencedor anuncia-se a partir do dia 30.</span>
          )}
        </p>
      </div>
      {!jaPremiado && (
        <button
          onClick={() => mut.mutate({ userId: data.lider!.userId, mes: data.mes })}
          disabled={mut.isPending}
          className={`shrink-0 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full transition-colors disabled:opacity-50 ${
            destaque ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-ink text-cream hover:bg-terracotta"
          }`}
        >
          <Crown size={15} /> {mut.isPending ? "A premiar…" : "Anunciar vencedor (sessão 30 min)"}
        </button>
      )}
    </div>
  );
}

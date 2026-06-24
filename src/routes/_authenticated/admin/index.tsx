import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Users, Coins, Activity, Trophy } from "lucide-react";
import { getAdminOverview } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

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

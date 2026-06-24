import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { getMentorada } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/mentoradas/$id")({
  component: MentoradaDetalhe,
});

function MentoradaDetalhe() {
  const { id } = Route.useParams();
  const fetch = useServerFn(getMentorada);
  const { data } = useSuspenseQuery({
    queryKey: ["admin-mentorada", id],
    queryFn: () => fetch({ data: { id } }),
  });

  if (!data.perfil) return <div className="p-8">Não encontrada.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/admin/mentoradas" className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink">
        <ArrowLeft size={14} /> Voltar
      </Link>

      <h1 className="text-2xl font-semibold mt-4">{data.perfil.nome}</h1>
      <p className="text-sm text-ink/60">{data.perfil.email}</p>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <Stat label="Tier" value={data.perfil.tier} />
        <Stat label="Pontos" value={String(data.perfil.pontos)} />
        <Stat label="Sequência" value={`${data.perfil.sequencia} dias`} />
      </div>

      <h2 className="text-sm font-semibold mt-8">Histórico de pontos</h2>
      <div className="mt-3 bg-white border border-[var(--color-border)] rounded-2xl divide-y divide-[var(--color-border)]">
        {data.log.length === 0 && <p className="p-5 text-sm text-ink/50">Sem registros.</p>}
        {data.log.map((l) => (
          <div key={l.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <p className="text-sm">{l.motivo}</p>
              <p className="text-[11px] text-ink/40">{new Date(l.created_at).toLocaleString("pt-BR")}</p>
            </div>
            <span className={`text-sm font-medium ${l.delta >= 0 ? "text-sage" : "text-rose-700"}`}>
              {l.delta >= 0 ? "+" : ""}{l.delta}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold mt-8">Conquistas</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {data.conquistas.length === 0 && <p className="text-sm text-ink/50">Nenhuma ainda.</p>}
        {data.conquistas.map((c: any) => (
          <div key={c.id} className="px-3 py-2 bg-white border border-[var(--color-border)] rounded-full text-xs">
            {c.conquista?.emoji} {c.conquista?.nome}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
      <p className="text-[11px] uppercase tracking-wider text-ink/40">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}

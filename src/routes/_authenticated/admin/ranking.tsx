import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listRanking, resetRanking } from "@/lib/admin.functions";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/ranking")({
  component: RankingPage,
});

function RankingPage() {
  const fetch = useServerFn(listRanking);
  const reset = useServerFn(resetRanking);
  const qc = useQueryClient();

  const { data } = useSuspenseQuery({ queryKey: ["admin-ranking"], queryFn: () => fetch() });

  const resetMut = useMutation({
    mutationFn: () => reset(),
    onSuccess: () => {
      toast.success("Ranking resetado");
      qc.invalidateQueries({ queryKey: ["admin-ranking"] });
      qc.invalidateQueries({ queryKey: ["admin-mentoradas"] });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ranking</h1>
          <p className="text-sm text-ink/60 mt-1">Top 50 por pontuação.</p>
        </div>
        <button
          onClick={() => {
            if (confirm("Zerar pontos e sequência de todas?")) resetMut.mutate();
          }}
          disabled={resetMut.isPending}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-full border border-[var(--color-border)] bg-white text-sm hover:bg-ink/5"
        >
          <RotateCcw size={14} /> Resetar ranking
        </button>
      </div>

      <div className="mt-5 bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-ink/50">
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3 font-medium w-12">#</th>
              <th className="text-left px-5 py-3 font-medium">Nome</th>
              <th className="text-left px-5 py-3 font-medium">Tier</th>
              <th className="text-right px-5 py-3 font-medium">Sequência</th>
              <th className="text-right px-5 py-3 font-medium">Pontos</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, i) => (
              <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-5 py-3 text-ink/40">{i + 1}</td>
                <td className="px-5 py-3">{p.nome ?? "—"}</td>
                <td className="px-5 py-3 text-ink/60">{p.tier}</td>
                <td className="px-5 py-3 text-right">{p.sequencia}</td>
                <td className="px-5 py-3 text-right font-medium">{p.pontos}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-ink/50">
                  Sem dados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

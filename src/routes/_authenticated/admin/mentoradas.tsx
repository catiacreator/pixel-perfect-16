import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo } from "react";
import { Search, Trash2, Coins, Check, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  listMentoradas,
  deleteMentorada,
  adjustPoints,
  setApproval,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/mentoradas")({
  component: MentoradasPage,
});

function MentoradasPage() {
  const fetch = useServerFn(listMentoradas);
  const del = useServerFn(deleteMentorada);
  const adjust = useServerFn(adjustPoints);
  const approve = useServerFn(setApproval);
  const qc = useQueryClient();

  const { data } = useSuspenseQuery({ queryKey: ["admin-mentoradas"], queryFn: () => fetch() });
  const [q, setQ] = useState("");
  const [adjusting, setAdjusting] = useState<{ id: string; nome: string } | null>(null);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return data.filter(
      (m) =>
        !term ||
        m.nome?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term),
    );
  }, [data, q]);

  const delMut = useMutation({
    mutationFn: (userId: string) => del({ data: { userId } }),
    onSuccess: () => {
      toast.success("Mentorada removida");
      qc.invalidateQueries({ queryKey: ["admin-mentoradas"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const approveMut = useMutation({
    mutationFn: (v: { userId: string; approved: boolean }) => approve({ data: v }),
    onSuccess: (_d, v) => {
      toast.success(v.approved ? "Acesso aprovado" : "Acesso revogado");
      qc.invalidateQueries({ queryKey: ["admin-mentoradas"] });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">Mentoradas</h1>
      <p className="text-sm text-ink/60 mt-1">{data.length} cadastradas.</p>

      <div className="relative mt-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar nome ou e-mail"
          className="w-full h-11 pl-10 pr-4 rounded-full border border-[var(--color-border)] bg-white text-sm"
        />
      </div>

      <div className="mt-5 bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-ink/50">
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3 font-medium">Nome</th>
              <th className="text-left px-5 py-3 font-medium">E-mail</th>
              <th className="text-left px-5 py-3 font-medium">Tier</th>
              <th className="text-left px-5 py-3 font-medium">Estado</th>
              <th className="text-right px-5 py-3 font-medium">Pontos</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-5 py-3">
                  <Link
                    to="/admin/mentoradas/$id"
                    params={{ id: m.id }}
                    className="hover:underline"
                  >
                    {m.nome ?? "—"}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink/60">{m.email}</td>
                <td className="px-5 py-3 text-ink/60">{m.tier}</td>
                <td className="px-5 py-3">
                  {m.approved ? (
                    <span className="inline-flex items-center gap-1 text-xs text-sage">
                      <Check size={13} /> Aprovada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-terracotta">
                      <Clock size={13} /> Pendente
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-right font-medium">{m.pontos}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() =>
                      approveMut.mutate({ userId: m.id, approved: !m.approved })
                    }
                    disabled={approveMut.isPending}
                    className="inline-flex items-center gap-1 text-xs text-ink/60 hover:text-ink mr-3 disabled:opacity-50"
                  >
                    {m.approved ? "Revogar" : "Aprovar"}
                  </button>
                  <button
                    onClick={() => setAdjusting({ id: m.id, nome: m.nome ?? "" })}
                    className="inline-flex items-center gap-1 text-xs text-ink/60 hover:text-ink mr-3"
                  >
                    <Coins size={13} /> Pontos
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remover ${m.nome}?`)) delMut.mutate(m.id);
                    }}
                    className="text-ink/40 hover:text-rose-700"
                    aria-label="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/50">
                  Nenhuma mentorada encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {adjusting && (
        <AdjustDialog
          nome={adjusting.nome}
          onClose={() => setAdjusting(null)}
          onConfirm={async (delta, motivo) => {
            await adjust({ data: { userId: adjusting.id, delta, motivo } });
            toast.success("Pontos ajustados");
            qc.invalidateQueries({ queryKey: ["admin-mentoradas"] });
            setAdjusting(null);
          }}
        />
      )}
    </div>
  );
}

function AdjustDialog({
  nome,
  onClose,
  onConfirm,
}: {
  nome: string;
  onClose: () => void;
  onConfirm: (delta: number, motivo: string) => Promise<void>;
}) {
  const [delta, setDelta] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-cream w-full max-w-md rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold">Ajustar pontos — {nome}</h2>
        <p className="text-xs text-ink/50 mt-1">Use número negativo para descontar.</p>
        <input
          type="number"
          value={delta}
          onChange={(e) => setDelta(e.target.value)}
          placeholder="ex: +20 ou -10"
          className="mt-4 w-full h-11 px-4 rounded-full border border-[var(--color-border)] bg-white text-sm"
        />
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Motivo"
          rows={3}
          className="mt-3 w-full p-3 rounded-2xl border border-[var(--color-border)] bg-white text-sm"
        />
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 h-11 rounded-full border border-[var(--color-border)] text-sm">
            Cancelar
          </button>
          <button
            disabled={loading || !delta || !motivo}
            onClick={async () => {
              setLoading(true);
              try { await onConfirm(Number(delta), motivo); } finally { setLoading(false); }
            }}
            className="flex-1 h-11 rounded-full bg-terracotta text-cream text-sm font-medium disabled:opacity-50"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo } from "react";
import { Search, Trash2, Coins, Check, Clock, UserPlus, ShieldCheck, Shield } from "lucide-react";
import { notify } from "@/lib/toast";
import {
  listMentoradas,
  deleteMentorada,
  adjustPoints,
  setApproval,
  createMentorada,
  setUserRole,
  checkIsAdmin,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/mentoradas")({
  component: MentoradasPage,
});

const ROLE_LABEL: Record<string, string> = { admin: "Admin", moderator: "Moderador", user: "Aluno" };

function MentoradasPage() {
  const fetch = useServerFn(listMentoradas);
  const del = useServerFn(deleteMentorada);
  const adjust = useServerFn(adjustPoints);
  const approve = useServerFn(setApproval);
  const create = useServerFn(createMentorada);
  const setRole = useServerFn(setUserRole);
  const ctxFn = useServerFn(checkIsAdmin);
  const qc = useQueryClient();

  const { data } = useSuspenseQuery({ queryKey: ["admin-mentoradas"], queryFn: () => fetch() });
  const { data: ctx } = useSuspenseQuery({ queryKey: ["admin-check"], queryFn: () => ctxFn() });
  const isOwner = Boolean(ctx?.isOwner);

  const [q, setQ] = useState("");
  const [adjusting, setAdjusting] = useState<{ id: string; nome: string } | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return data.filter(
      (m: any) =>
        !term ||
        m.nome?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term),
    );
  }, [data, q]);

  const delMut = useMutation({
    mutationFn: (userId: string) => del({ data: { userId } }),
    onSuccess: () => {
      notify("Aluno removido", "success");
      qc.invalidateQueries({ queryKey: ["admin-mentoradas"] });
    },
    onError: (e) => notify(e.message, "error"),
  });

  const approveMut = useMutation({
    mutationFn: (v: { userId: string; approved: boolean }) => approve({ data: v }),
    onSuccess: (_d, v) => {
      notify(v.approved ? "Acesso aprovado" : "Acesso revogado", "success");
      qc.invalidateQueries({ queryKey: ["admin-mentoradas"] });
    },
    onError: (e) => notify(e.message, "error"),
  });

  const roleMut = useMutation({
    mutationFn: (v: { userId: string; role: "admin" | "moderator" | "user" }) => setRole({ data: v }),
    onSuccess: (_d, v) => {
      notify(`Papel alterado para ${ROLE_LABEL[v.role]}`, "success");
      qc.invalidateQueries({ queryKey: ["admin-mentoradas"] });
    },
    onError: (e) => notify(e.message, "error"),
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Alunos</h1>
          <p className="text-sm text-ink/60 mt-1">{data.length} registados.</p>
        </div>
        {isOwner && (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors"
          >
            <UserPlus size={15} /> Adicionar aluno
          </button>
        )}
      </div>

      <div className="relative mt-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Procurar nome ou e-mail"
          className="w-full h-11 pl-10 pr-4 rounded-full border border-[var(--color-border)] bg-white text-sm"
        />
      </div>

      <div className="mt-5 bg-white border border-[var(--color-border)] rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-ink/50">
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-3 font-medium">Nome</th>
              <th className="text-left px-5 py-3 font-medium">E-mail</th>
              <th className="text-left px-5 py-3 font-medium">Papel</th>
              <th className="text-left px-5 py-3 font-medium">Estado</th>
              <th className="text-right px-5 py-3 font-medium">Pontos</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((m: any) => (
              <tr key={m.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-5 py-3">
                  <Link to="/admin/mentoradas/$id" params={{ id: m.id }} className="hover:underline">
                    {m.nome ?? "—"}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink/60">{m.email}</td>
                <td className="px-5 py-3">
                  {isOwner ? (
                    <select
                      value={m.role}
                      onChange={(e) =>
                        roleMut.mutate({ userId: m.id, role: e.target.value as any })
                      }
                      disabled={roleMut.isPending}
                      className="h-8 rounded-lg border border-[var(--color-border)] bg-white px-2 text-xs disabled:opacity-50"
                    >
                      <option value="user">Aluno</option>
                      <option value="moderator">Moderador</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <RoleBadge role={m.role} />
                  )}
                </td>
                <td className="px-5 py-3">
                  {m.approved ? (
                    <span className="inline-flex items-center gap-1 text-xs text-sage">
                      <Check size={13} /> Aprovado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-terracotta">
                      <Clock size={13} /> Pendente
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-right font-medium">{m.pontos}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => approveMut.mutate({ userId: m.id, approved: !m.approved })}
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
                  {isOwner && (
                    <button
                      onClick={() => {
                        if (confirm(`Eliminar ${m.nome ?? "este aluno"}? Esta ação é irreversível.`)) delMut.mutate(m.id);
                      }}
                      className="text-ink/40 hover:text-rose-700"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/50">
                  Nenhum aluno encontrado.
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
            notify("Pontos ajustados", "success");
            qc.invalidateQueries({ queryKey: ["admin-mentoradas"] });
            setAdjusting(null);
          }}
        />
      )}

      {adding && (
        <AddStudentDialog
          onClose={() => setAdding(false)}
          onConfirm={async (nome, email, password) => {
            await create({ data: { nome, email, password } });
            notify("Aluno adicionado", "success");
            qc.invalidateQueries({ queryKey: ["admin-mentoradas"] });
            setAdding(false);
          }}
        />
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  if (role === "admin")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-terracotta">
        <ShieldCheck size={13} /> Admin
      </span>
    );
  if (role === "moderator")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-700">
        <Shield size={13} /> Moderador
      </span>
    );
  return <span className="text-xs text-ink/50">Aluno</span>;
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

function AddStudentDialog({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (nome: string, email: string, password: string) => Promise<void>;
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-cream w-full max-w-md rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold">Adicionar aluno</h2>
        <p className="text-xs text-ink/50 mt-1">
          A conta fica criada e confirmada. Partilha a palavra-passe com o aluno (pode mudá-la depois em "Recuperar palavra-passe").
        </p>
        {erro && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {erro}
          </div>
        )}
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
          className="mt-4 w-full h-11 px-4 rounded-full border border-[var(--color-border)] bg-white text-sm"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="mt-3 w-full h-11 px-4 rounded-full border border-[var(--color-border)] bg-white text-sm"
        />
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Palavra-passe inicial (mín. 6)"
          className="mt-3 w-full h-11 px-4 rounded-full border border-[var(--color-border)] bg-white text-sm"
        />
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 h-11 rounded-full border border-[var(--color-border)] text-sm">
            Cancelar
          </button>
          <button
            disabled={loading || !nome || !email || password.length < 6}
            onClick={async () => {
              setLoading(true);
              setErro(null);
              try {
                await onConfirm(nome, email, password);
              } catch (e) {
                setErro(e instanceof Error ? e.message : "Não foi possível adicionar.");
              } finally {
                setLoading(false);
              }
            }}
            className="flex-1 h-11 rounded-full bg-terracotta text-cream text-sm font-medium disabled:opacity-50"
          >
            {loading ? "A criar..." : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}

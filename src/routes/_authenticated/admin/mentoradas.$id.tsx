import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, KeyRound, Copy, Check } from "lucide-react";
import { getMentorada, resetAlunoPassword } from "@/lib/admin.functions";
import { notify } from "@/lib/toast";

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

      <ResetPassword userId={id} nome={data.perfil.nome || "este aluno"} />
    </div>
  );
}

function ResetPassword({ userId, nome }: { userId: string; nome: string }) {
  const reset = useServerFn(resetAlunoPassword);
  const [password, setPassword] = useState("leveza123");
  const [loading, setLoading] = useState(false);
  const [feito, setFeito] = useState(false);
  const [copiado, setCopiado] = useState(false);

  async function aplicar() {
    if (password.length < 6) {
      notify("A palavra-passe deve ter pelo menos 6 caracteres.", "error");
      return;
    }
    if (!window.confirm(`Definir a palavra-passe de ${nome} para "${password}"?\n\nO aluno passa a entrar com esta palavra-passe (pode mudá-la depois).`)) return;
    setLoading(true);
    try {
      await reset({ data: { userId, password } });
      setFeito(true);
      notify("Palavra-passe reposta ✓", "success");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Não foi possível repor.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard?.writeText(password);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch { /* ignora */ }
  }

  return (
    <div className="mt-8 bg-white border border-[var(--color-border)] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <KeyRound size={15} className="text-terracotta" />
        <h2 className="text-sm font-semibold">Repor palavra-passe</h2>
      </div>
      <p className="text-[13px] text-ink/55 mb-3">
        Se o aluno se esqueceu, define aqui uma palavra-passe e partilha-a com ele. Ele pode mudá-la depois nas definições.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 border border-[var(--color-border)] rounded-full pl-4 pr-1.5 h-11 bg-cream">
          <input
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFeito(false); }}
            className="bg-transparent outline-none text-sm text-ink w-40"
            aria-label="Nova palavra-passe"
          />
          <button
            onClick={copiar}
            type="button"
            className="w-8 h-8 rounded-full hover:bg-ink/5 flex items-center justify-center text-ink/50"
            aria-label="Copiar"
          >
            {copiado ? <Check size={14} className="text-sage" /> : <Copy size={14} />}
          </button>
        </div>
        <button
          onClick={aplicar}
          disabled={loading}
          className="h-11 px-5 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
        >
          {loading ? "A repor..." : feito ? "Repor de novo" : "Repor palavra-passe"}
        </button>
      </div>
      {feito && (
        <p className="text-[13px] text-sage mt-3">
          Feito. Partilha com {nome}: entra com o e-mail e a palavra-passe <b>{password}</b>.
        </p>
      )}
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

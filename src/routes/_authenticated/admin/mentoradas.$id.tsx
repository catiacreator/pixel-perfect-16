import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, KeyRound, Copy, Check, Mail, ArrowRightLeft, Trash2 } from "lucide-react";
import {
  getMentorada,
  resetAlunoPassword,
  alterarEmailAluno,
  transferirDadosAluno,
  apagarMentoradaCompleto,
} from "@/lib/admin.functions";
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
      <AlterarEmail userId={id} emailAtual={data.perfil.email || ""} />
      <TransferirDados userId={id} nome={data.perfil.nome || "este aluno"} />
      <ApagarTudo userId={id} nome={data.perfil.nome || "este aluno"} />
    </div>
  );
}

// A pessoa registou-se com o email errado. Trocar o email mantém o mesmo id
// interno, por isso Documento Mestre, pontos e turma ficam todos intactos.
function AlterarEmail({ userId, emailAtual }: { userId: string; emailAtual: string }) {
  const alterar = useServerFn(alterarEmailAluno);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function aplicar() {
    const novo = email.trim().toLowerCase();
    if (!novo.includes("@")) {
      notify("Escreve um e-mail válido.", "error");
      return;
    }
    if (!window.confirm(`Trocar o e-mail de ${emailAtual} para ${novo}?\n\nA conta mantém-se a mesma — não se perde nada.`)) return;
    setLoading(true);
    try {
      await alterar({ data: { userId, email: novo } });
      notify("E-mail alterado ✓ — a pessoa entra agora com o novo.", "success");
      setEmail("");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Não foi possível alterar.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Cartao icone={<Mail size={15} className="text-terracotta" />} titulo="Corrigir e-mail">
      <p className="text-[13px] text-ink/55 mb-3">
        Se se registou com o e-mail errado, corrige aqui. A conta é a mesma, por isso o Documento
        Mestre, os pontos e a turma <b>não se perdem</b>.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="novo@email.com"
          type="email"
          className="border border-[var(--color-border)] rounded-full px-4 h-11 bg-cream outline-none text-sm text-ink w-64"
          aria-label="Novo e-mail"
        />
        <button
          onClick={aplicar}
          disabled={loading || !email.trim()}
          className="h-11 px-5 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
        >
          {loading ? "A alterar..." : "Alterar e-mail"}
        </button>
      </div>
    </Cartao>
  );
}

// A pessoa já se registou de novo por conta própria e ficou com uma conta vazia.
// Isto puxa o que ela tinha da conta antiga para a nova.
function TransferirDados({ userId, nome }: { userId: string; nome: string }) {
  const transferir = useServerFn(transferirDadosAluno);
  const [destino, setDestino] = useState("");
  const [apagarOrigem, setApagarOrigem] = useState(true);
  const [loading, setLoading] = useState(false);

  async function aplicar() {
    const email = destino.trim().toLowerCase();
    if (!email.includes("@")) {
      notify("Escreve o e-mail da conta nova.", "error");
      return;
    }
    if (
      !window.confirm(
        `Mover tudo o que ${nome} tem nesta conta para a conta ${email}?\n\n` +
          `Vai o Documento Mestre, pontos, conquistas, turma e código.` +
          (apagarOrigem ? "\n\nA conta ANTIGA será apagada no fim." : ""),
      )
    )
      return;
    setLoading(true);
    try {
      await transferir({ data: { origemUserId: userId, destinoEmail: email, apagarOrigem } });
      notify("Dados transferidos ✓", "success");
      setDestino("");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Não foi possível transferir.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Cartao icone={<ArrowRightLeft size={15} className="text-terracotta" />} titulo="Transferir para outra conta">
      <p className="text-[13px] text-ink/55 mb-3">
        Se {nome} se voltou a registar do zero e ficou com a conta vazia, escreve aqui o e-mail da
        conta <b>nova</b>. O Documento Mestre, pontos, conquistas, turma e código passam para lá.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          placeholder="e-mail da conta nova"
          type="email"
          className="border border-[var(--color-border)] rounded-full px-4 h-11 bg-cream outline-none text-sm text-ink w-64"
          aria-label="E-mail da conta nova"
        />
        <button
          onClick={aplicar}
          disabled={loading || !destino.trim()}
          className="h-11 px-5 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
        >
          {loading ? "A transferir..." : "Transferir dados"}
        </button>
      </div>
      <label className="flex items-center gap-2 mt-3 text-[13px] text-ink/60 cursor-pointer">
        <input type="checkbox" checked={apagarOrigem} onChange={(e) => setApagarOrigem(e.target.checked)} />
        Apagar a conta antiga depois de transferir
      </label>
    </Cartao>
  );
}

// Zona vermelha. Apagar é irreversível: o Documento Mestre desaparece com a conta.
function ApagarTudo({ userId, nome }: { userId: string; nome: string }) {
  const apagar = useServerFn(apagarMentoradaCompleto);
  const navigate = useNavigate();
  const [apagarCompras, setApagarCompras] = useState(true);
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);
  const podeApagar = confirmacao.trim().toUpperCase() === "APAGAR";

  async function aplicar() {
    if (!podeApagar) return;
    if (
      !window.confirm(
        `Apagar DEFINITIVAMENTE ${nome} e tudo o que tem?\n\n` +
          `Documento Mestre, pontos, conquistas e histórico desaparecem para sempre.\n` +
          `Isto não tem volta.`,
      )
    )
      return;
    setLoading(true);
    try {
      await apagar({ data: { userId, apagarCompras } });
      notify("Conta apagada.", "success");
      navigate({ to: "/admin/mentoradas" });
    } catch (e) {
      notify(e instanceof Error ? e.message : "Não foi possível apagar.", "error");
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 bg-white border border-rose-300 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <Trash2 size={15} className="text-rose-700" />
        <h2 className="text-sm font-semibold text-rose-800">Apagar tudo</h2>
      </div>
      <p className="text-[13px] text-ink/55 mb-3">
        Apaga a conta e todos os vestígios: Documento Mestre, pontos, conquistas, lugar na turma,
        código e permissões. <b className="text-rose-800">Não há forma de recuperar.</b> Se só
        queres que a pessoa volte a entrar, usa antes <i>Repor palavra-passe</i> — assim não se perde nada.
      </p>
      <label className="flex items-center gap-2 mb-3 text-[13px] text-ink/60 cursor-pointer">
        <input type="checkbox" checked={apagarCompras} onChange={(e) => setApagarCompras(e.target.checked)} />
        Apagar também as compras associadas ao e-mail
        <span className="text-ink/40">(senão recupera acesso se voltar a registar-se)</span>
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
          placeholder="Escreve APAGAR"
          className="border border-rose-300 rounded-full px-4 h-11 bg-cream outline-none text-sm text-ink w-48"
          aria-label="Escreve APAGAR para confirmar"
        />
        <button
          onClick={aplicar}
          disabled={loading || !podeApagar}
          className="h-11 px-5 rounded-full bg-rose-700 text-cream text-sm font-medium hover:bg-rose-800 transition-colors disabled:opacity-40"
        >
          {loading ? "A apagar..." : "Apagar definitivamente"}
        </button>
      </div>
    </div>
  );
}

function Cartao({ icone, titulo, children }: { icone: React.ReactNode; titulo: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 bg-white border border-[var(--color-border)] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-1">
        {icone}
        <h2 className="text-sm font-semibold">{titulo}</h2>
      </div>
      {children}
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

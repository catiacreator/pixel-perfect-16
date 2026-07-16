import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Trophy, Plus, Trash2, Save, Loader2, Check, Megaphone, Users } from "lucide-react";
import { notify } from "@/lib/toast";
import { Link } from "@/lib/router-compat";
import {
  listConquistas, criarConquista, apagarConquista, getPremioGeral, setPremioGeral,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/premios")({
  component: PremiosPage,
});

type Conquista = { id: string; nome: string; emoji?: string; descricao?: string; pontos: number };

function PremiosPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div className="flex items-start gap-3">
        <Trophy size={22} className="text-terracotta mt-0.5" />
        <div>
          <h1 className="text-2xl font-semibold">Prémios</h1>
          <p className="text-sm text-ink/60 mt-1 max-w-xl">
            Cria prémios (com pontos que entram na pontuação geral), define o prémio geral do momento, e atribui prémios
            a cada aluno em <Link to="/admin/mentoradas" className="font-semibold text-terracotta hover:text-terracotta-dark">Alunos</Link>.
          </p>
        </div>
      </div>

      <PremioGeral />
      <Conquistas />
    </div>
  );
}

// ── Prémio geral (visível a todos na página Vitórias) ──
function PremioGeral() {
  const fetchP = useServerFn(getPremioGeral);
  const saveP = useServerFn(setPremioGeral);
  const [emoji, setEmoji] = useState("🏆");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ativo, setAtivo] = useState(false);
  const [carregado, setCarregado] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    fetchP().then((p) => {
      const c = p as { titulo: string; descricao: string; emoji: string; ativo: boolean };
      setEmoji(c.emoji || "🏆"); setTitulo(c.titulo); setDescricao(c.descricao); setAtivo(c.ativo);
    }).catch(() => {}).finally(() => setCarregado(true));
  }, [fetchP]);

  async function guardar() {
    setAGuardar(true);
    try {
      await saveP({ data: { emoji: emoji.trim() || "🏆", titulo: titulo.trim(), descricao: descricao.trim(), ativo } });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Não foi possível guardar.", "error");
    } finally { setAGuardar(false); }
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><Megaphone size={16} className="text-terracotta" /> Prémio geral (para todos)</h2>
      {!carregado ? (
        <div className="flex items-center gap-2 text-sm text-ink/50"><Loader2 size={15} className="animate-spin" /> A carregar…</div>
      ) : (
        <>
          <p className="text-[13px] text-ink/60">Aparece um destaque a todos os alunos na página <b>Vitórias</b>. Usa-o para anunciar o prémio do mês/desafio.</p>
          <div className="flex gap-3">
            <div className="w-20">
              <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-muted">Emoji</label>
              <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4}
                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-center text-xl outline-none focus:border-terracotta" />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-muted">Título</label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Prémio do mês: sessão 1:1 com a Cátia"
                className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-[15px] text-ink outline-none focus:border-terracotta" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-muted">Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={2} placeholder="Como se ganha / o que inclui…"
              className="w-full resize-y rounded-xl border border-border bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-terracotta" />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <span onClick={() => setAtivo((v) => !v)} className={`w-10 h-6 rounded-full transition-colors relative ${ativo ? "bg-terracotta" : "bg-ink/20"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${ativo ? "left-[18px]" : "left-0.5"}`} />
            </span>
            <span className="text-sm font-medium text-ink">{ativo ? "Visível para os alunos" : "Escondido"}</span>
          </label>
          <div className="flex items-center gap-3 pt-1">
            <button onClick={guardar} disabled={aGuardar}
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream hover:bg-terracotta-dark disabled:opacity-60">
              {aGuardar ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Guardar
            </button>
            {guardado && <span className="inline-flex items-center gap-1 text-sm text-success"><Check size={15} /> Guardado</span>}
          </div>
        </>
      )}
    </div>
  );
}

// ── Criar / listar / apagar prémios (conquistas) ──
function Conquistas() {
  const fetchList = useServerFn(listConquistas);
  const criar = useServerFn(criarConquista);
  const apagar = useServerFn(apagarConquista);

  const [lista, setLista] = useState<Conquista[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [emoji, setEmoji] = useState("🏆");
  const [nome, setNome] = useState("");
  const [pontos, setPontos] = useState("50");
  const [descricao, setDescricao] = useState("");
  const [aCriar, setACriar] = useState(false);

  const carregar = () => fetchList().then((d) => setLista((d as Conquista[]) ?? [])).catch(() => {}).finally(() => setCarregado(true));
  useEffect(() => { carregar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function adicionar() {
    if (!nome.trim()) { notify("Dá um nome ao prémio.", "error"); return; }
    setACriar(true);
    try {
      await criar({ data: { nome: nome.trim(), emoji: emoji.trim() || "🏆", descricao: descricao.trim(), pontos: parseInt(pontos, 10) || 0 } });
      setNome(""); setDescricao(""); setPontos("50"); setEmoji("🏆");
      await carregar();
      notify("Prémio criado ✓", "success");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Não foi possível criar.", "error");
    } finally { setACriar(false); }
  }

  async function remover(id: string, nomeC: string) {
    if (!window.confirm(`Apagar o prémio "${nomeC}"?\n\nÉ removido também de quem o tinha.`)) return;
    try { await apagar({ data: { id } }); await carregar(); notify("Prémio apagado", "success"); }
    catch (e) { notify(e instanceof Error ? e.message : "Não foi possível apagar.", "error"); }
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><Trophy size={16} className="text-terracotta" /> Prémios (conquistas)</h2>

      {/* Criar */}
      <div className="rounded-xl border border-terracotta/20 bg-terracotta/[0.04] p-4 space-y-3">
        <p className="text-[13px] font-medium text-ink/70">Criar um prémio novo</p>
        <div className="flex flex-wrap gap-2">
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4} title="Emoji"
            className="h-11 w-14 rounded-xl border border-border bg-white px-2 text-center text-xl outline-none focus:border-terracotta" />
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do prémio (ex.: Primeira venda)"
            className="h-11 min-w-[180px] flex-1 rounded-xl border border-border bg-white px-3.5 text-[15px] outline-none focus:border-terracotta" />
          <input value={pontos} onChange={(e) => setPontos(e.target.value.replace(/[^0-9]/g, ""))} placeholder="pts" title="Pontos"
            className="h-11 w-20 rounded-xl border border-border bg-white px-3 text-center text-[15px] outline-none focus:border-terracotta" />
        </div>
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição (opcional)"
          className="h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm outline-none focus:border-terracotta" />
        <button onClick={adicionar} disabled={aCriar}
          className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream hover:bg-terracotta-dark disabled:opacity-60">
          {aCriar ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Criar prémio
        </button>
      </div>

      {/* Lista */}
      {!carregado ? (
        <div className="flex items-center gap-2 text-sm text-ink/50"><Loader2 size={15} className="animate-spin" /> A carregar…</div>
      ) : lista.length === 0 ? (
        <p className="text-[13px] text-ink/45">Ainda não há prémios. Cria o primeiro acima.</p>
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {lista.map((c) => (
            <div key={c.id} className="flex items-center gap-3 py-2.5">
              <span className="text-xl">{c.emoji || "🏆"}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink truncate">{c.nome}</span>
                {c.descricao && <span className="block text-[12px] text-ink/50 truncate">{c.descricao}</span>}
              </span>
              <span className="shrink-0 rounded-full bg-terracotta/10 px-2.5 py-0.5 text-[12px] font-semibold text-terracotta">+{c.pontos} pts</span>
              <button onClick={() => remover(c.id, c.nome)} className="shrink-0 p-1.5 text-ink/40 hover:text-rose-600" aria-label="Apagar"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}

      <p className="flex items-center gap-1.5 text-[12.5px] text-ink/50 pt-1">
        <Users size={13} /> Para dar um prémio a alguém: <Link to="/admin/mentoradas" className="font-semibold text-terracotta hover:text-terracotta-dark">Alunos</Link> → abre o aluno.
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";
import ConversaModal from "@/components/ConversaModal";
import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import {
  Hourglass,
  Plus,
  Trash2,
  Leaf,
  ArrowRight,
  PlayCircle,
  Clock,
  GripVertical,
  ArrowLeft,
  Check,
} from "lucide-react";
import {
  DetetiveState,
  Freq,
  Unidade,
  Moeda,
  MOEDAS,
  INITIAL_STATE,
  loadDetetive,
  saveDetetive,
  clearDetetive,
  custoHora,
  fmtMoeda,
} from "@/lib/detetive-storage";
import InfoButton from "@/components/InfoButton";

export default function DetetiveDoTempo() {
  const [state, setState] = useState<DetetiveState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const [conversaOpen, setConversaOpen] = useState(false);

  useEffect(() => {
    setState(loadDetetive());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveDetetive(state);
    const d = new Date();
    setSavedAt(`${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`);
  }, [state, hydrated]);

  const setTop = (patch: Partial<DetetiveState>) => setState((s) => ({ ...s, ...patch }));

  const updateTarefa = (ci: number, ti: number, patch: Partial<DetetiveState["categorias"][number]["tarefas"][number]>) =>
    setState((s) => ({
      ...s,
      categorias: s.categorias.map((c, i) =>
        i === ci
          ? { ...c, tarefas: c.tarefas.map((t, idx) => (idx === ti ? { ...t, ...patch } : t)) }
          : c,
      ),
    }));

  const addTarefa = (ci: number) =>
    setState((s) => ({
      ...s,
      categorias: s.categorias.map((c, i) =>
        i === ci ? { ...c, tarefas: [...c.tarefas, { nome: "", qtd: "", unidade: "h", freq: "dia" }] } : c,
      ),
    }));

  const removeTarefa = (ci: number, ti: number) =>
    setState((s) => ({
      ...s,
      categorias: s.categorias.map((c, i) =>
        i === ci ? { ...c, tarefas: c.tarefas.filter((_, idx) => idx !== ti) } : c,
      ),
    }));

  const zerar = () => {
    if (!confirm("Zerar todos os dados do Mapa do Tempo?")) return;
    clearDetetive();
    setState(INITIAL_STATE);
  };

  const hora = custoHora(state);
  const moedaAtual = MOEDAS.find((m) => m.code === state.moeda) ?? MOEDAS[0];

  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Crie com Leveza sem roubar o seu tempo" backTo="/metodo/pilar-1" backLabel="Voltar para o Pilar 1" />
      <PillarHeader
        numeral="I"
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1"
        titulo="Mapa do Tempo"
        subtitulo="Mapeie suas tarefas e descubra quanto custam — em horas e em dinheiro"
      />

      <div className="px-5 md:px-10 pb-16 max-w-4xl mx-auto">
        <div className="mb-4">
          <InfoButton titulo="Para que serve o Mapa do Tempo?" label="Para que serve o Mapa do Tempo?">
            <p>
              Aqui você mapeia todas as suas tarefas (Produção, Marketing e Estratégia) com o tempo
              gasto por dia/semana/mês e informa o seu faturamento. Se travar, a IA conversa consigo e
              monta a lista para você aprovar.
            </p>
            <p>
              É a <strong>porta de entrada do método</strong>: cria a consciência de quanto custa o seu
              tempo. Estes dados alimentam o <strong>Documento Mestre</strong> — a base que personaliza
              tudo, incluindo os prompts de oferta e preço do Pilar 4.
            </p>
            <p className="text-ink/55">
              A seguir, o <strong>Relatório</strong> cruza tudo com o faturamento e mostra onde priorizar.
            </p>
          </InfoButton>
        </div>
        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <PlayCircle size={22} className="text-terracotta flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-serif text-xl text-ink leading-tight mb-1">Comece por aqui</h2>
              <p className="text-sm text-muted">Assista ao vídeo antes de preencher as lacunas abaixo.</p>
            </div>
          </div>
          <VideoPlaceholder />
        </div>

        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <Clock size={20} className="text-terracotta flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="font-serif text-xl text-ink leading-tight mb-0.5">Vamos calcular o custo real do seu tempo</h2>
              <p className="text-xs text-muted">Leva 10 minutos. {savedAt && <span className="inline-flex items-center gap-1 ml-1"><Check size={11} /> Salvo às {savedAt}</span>}</p>
            </div>
            <button onClick={zerar} className="text-xs font-semibold text-muted hover:text-terracotta flex items-center gap-1">↺ Zerar tudo</button>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <label className="text-[11px] tracking-[0.18em] uppercase text-muted">Moeda</label>
            <select
              value={state.moeda}
              onChange={(e) => setTop({ moeda: e.target.value as Moeda })}
              className="rounded-xl border border-border p-2 text-sm bg-white outline-none focus:border-terracotta"
            >
              {MOEDAS.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1">
                Faturamento mensal ({moedaAtual.simbolo})
              </label>
              <input
                value={state.faturamento}
                onChange={(e) => setTop({ faturamento: e.target.value })}
                placeholder="Ex: 15000"
                className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1">Horas por dia</label>
              <input
                value={state.horasDia}
                onChange={(e) => setTop({ horasDia: e.target.value })}
                placeholder="Ex: 8"
                className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1">Dias por semana</label>
              <input
                value={state.diasSemana}
                onChange={(e) => setTop({ diasSemana: e.target.value })}
                placeholder="Ex: 5"
                className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta"
              />
            </div>
          </div>
          {hora > 0 && (
            <p className="mt-3 text-xs text-muted">
              Sua hora vale <span className="font-semibold text-ink">{fmtMoeda(hora, state.moeda)}</span>.
            </p>
          )}
        </div>

        {state.categorias.map((cat, ci) => (
          <div key={cat.titulo} className="rounded-2xl border border-border bg-white shadow-sm p-5 mb-4">
            <h3 className="font-serif text-xl text-ink mb-0.5">{cat.titulo}</h3>
            <p className="text-xs text-muted mb-4">{cat.desc}</p>
            <div className="space-y-2 mb-3">
              {cat.tarefas.map((t, ti) => (
                <div key={ti} className="flex flex-wrap items-center gap-2">
                  <GripVertical size={14} className="text-muted/60" />
                  <input
                    value={t.nome}
                    onChange={(e) => updateTarefa(ci, ti, { nome: e.target.value })}
                    placeholder="Ex: Responder emails de clientes"
                    className="flex-1 min-w-[160px] rounded-xl border border-border p-2 text-sm outline-none"
                  />
                  <input
                    value={t.qtd}
                    onChange={(e) => updateTarefa(ci, ti, { qtd: e.target.value })}
                    placeholder="Qtd"
                    className="w-16 rounded-xl border border-border p-2 text-sm outline-none"
                  />
                  <select
                    value={t.unidade}
                    onChange={(e) => updateTarefa(ci, ti, { unidade: e.target.value as Unidade })}
                    className="rounded-xl border border-border p-2 text-sm bg-white"
                  >
                    <option value="h">h</option>
                    <option value="min">min</option>
                  </select>
                  <select
                    value={t.freq}
                    onChange={(e) => updateTarefa(ci, ti, { freq: e.target.value as Freq })}
                    className="rounded-xl border border-border p-2 text-sm bg-white"
                  >
                    <option value="dia">/ dia</option>
                    <option value="semana">/ semana</option>
                    <option value="mes">/ mês</option>
                  </select>
                  <button
                    onClick={() => removeTarefa(ci, ti)}
                    className="text-muted hover:text-terracotta"
                    aria-label="remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => addTarefa(ci)}
              className="text-xs font-semibold text-terracotta flex items-center gap-1"
            >
              <Plus size={13} /> Adicionar tarefa
            </button>
          </div>
        ))}

        <div className="rounded-2xl border border-dashed border-terracotta bg-white p-5 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <Leaf size={18} className="text-terracotta flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-serif text-base text-ink mb-1">Travou? Não lembra de todas as suas tarefas?</p>
              <p className="text-sm text-muted">
                A Inteligência Artificial conversa sobre sua rotina e monta a lista pra você aprovar.
                Opcional — você pode preencher tudo manualmente se preferir.
              </p>
            </div>
          </div>
          <button
            onClick={() => setConversaOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta border border-terracotta rounded-full px-4 py-1.5 hover:bg-terracotta hover:text-cream transition-colors"
          >
            <Leaf size={13} /> Conversa comigo
          </button>
        </div>

        <ConversaModal
          open={conversaOpen}
          onClose={() => setConversaOpen(false)}
          onApply={(cats) => setState((s) => ({ ...s, categorias: cats }))}
        />

        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 text-center mb-6">
          <p className="font-serif text-base text-ink mb-3">Tarefas mapeadas? Veja o Relatório do Mapa do Tempo</p>
          <Link
            to="/metodo/pilar-1/detetive-do-tempo/relatorio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold shadow-sm"
          >
            Ver Relatório <ArrowRight size={14} />
          </Link>
        </div>

        <div className="text-center">
          <Link to="/metodo/pilar-1" className="inline-flex items-center gap-1.5 text-sm text-ink hover:opacity-70">
            <ArrowLeft size={14} /> Voltar para o Pilar 1
          </Link>
        </div>
      </div>
    </Layout>
  );
}

import { useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import { Hourglass, Plus, Trash2, Leaf, ArrowRight, PlayCircle, Clock, GripVertical, ArrowLeft } from "lucide-react";

type Tarefa = { nome: string; qtd: string; unidade: "h" | "min"; freq: "dia" | "semana" | "mes" };
type Categoria = { titulo: string; desc: string; tarefas: Tarefa[] };

const CATEGORIAS_INICIAIS: Categoria[] = [
  { titulo: "Produção", desc: "Tarefas que você faz pra entregar pro cliente", tarefas: [{ nome: "", qtd: "", unidade: "h", freq: "dia" }] },
  { titulo: "Marketing", desc: "Tarefas pra vender e atrair clientes", tarefas: [{ nome: "", qtd: "", unidade: "h", freq: "dia" }] },
  { titulo: "Estratégia", desc: "Pensar em crescer sem se matar", tarefas: [{ nome: "", qtd: "", unidade: "h", freq: "dia" }] },
];

export default function DetetiveDoTempo() {
  const [categorias, setCategorias] = useState(CATEGORIAS_INICIAIS);

  const addTarefa = (ci: number) =>
    setCategorias((prev) =>
      prev.map((c, i) => (i === ci ? { ...c, tarefas: [...c.tarefas, { nome: "", qtd: "", unidade: "h", freq: "dia" }] } : c))
    );

  const removeTarefa = (ci: number, ti: number) =>
    setCategorias((prev) => prev.map((c, i) => (i === ci ? { ...c, tarefas: c.tarefas.filter((_, idx) => idx !== ti) } : c)));

  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo="/metodo/pilar-1" backLabel="Voltar para o Pilar 1" />
      <PillarHeader
        numeral="I"
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1"
        titulo="Detetive do Tempo"
        subtitulo="Mapeie suas tarefas e descubra quanto custam em reais"
      />

      <div className="px-5 md:px-10 pb-16 max-w-2xl mx-auto">
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
              <p className="text-xs text-muted">Leva 10 minutos.</p>
            </div>
            <button className="text-xs font-semibold text-muted flex items-center gap-1">↺ Zerar tudo</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1">Faturamento mensal (R$)</label>
              <input placeholder="Ex: 15000" className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta" />
            </div>
            <div>
              <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1">Horas por dia</label>
              <input placeholder="Ex: 8" className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta" />
            </div>
            <div>
              <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1">Dias por semana</label>
              <input placeholder="Ex: 5" className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta" />
            </div>
          </div>
        </div>

        {categorias.map((cat, ci) => (
          <div key={cat.titulo} className="rounded-2xl border border-border bg-white shadow-sm p-5 mb-4">
            <h3 className="font-serif text-xl text-ink mb-0.5">{cat.titulo}</h3>
            <p className="text-xs text-muted mb-4">{cat.desc}</p>
            <div className="space-y-2 mb-3">
              {cat.tarefas.map((_t, ti) => (
                <div key={ti} className="flex flex-wrap items-center gap-2">
                  <GripVertical size={14} className="text-muted/60" />
                  <input placeholder="Ex: Responder emails de clientes" className="flex-1 min-w-[160px] rounded-xl border border-border p-2 text-sm outline-none" />
                  <input placeholder="Qtd" className="w-16 rounded-xl border border-border p-2 text-sm outline-none" />
                  <select className="rounded-xl border border-border p-2 text-sm bg-white">
                    <option>h</option><option>min</option>
                  </select>
                  <select className="rounded-xl border border-border p-2 text-sm bg-white">
                    <option>/ dia</option><option>/ semana</option><option>/ mês</option>
                  </select>
                  <button onClick={() => removeTarefa(ci, ti)} className="text-muted hover:text-terracotta">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => addTarefa(ci)} className="text-xs font-semibold text-terracotta flex items-center gap-1">
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
          <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta border border-terracotta rounded-full px-4 py-1.5">
            <Leaf size={13} /> Conversa comigo
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <button className="px-5 py-2.5 rounded-full bg-white border border-border text-muted text-sm">
            Salvar tarefas no Documento Mestre
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 text-center mb-6">
          <p className="font-serif text-base text-ink mb-3">Tarefas mapeadas? Veja o Relatório do Detetive do Tempo</p>
          <Link
            to="/metodo/pilar-1/detetive-do-tempo/relatorio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-border text-ink text-sm font-semibold shadow-sm"
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

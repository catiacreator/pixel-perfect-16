import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import { Plus, Trash2, Sparkles, ArrowRight } from "lucide-react";

type Tarefa = { nome: string; qtd: string; unidade: "h" | "min"; freq: "dia" | "semana" | "mes" };
type Categoria = { titulo: string; desc: string; tarefas: Tarefa[] };

const CATEGORIAS_INICIAIS: Categoria[] = [
  { titulo: "Produção", desc: "Tarefas que você faz para entregar pro cliente", tarefas: [] },
  { titulo: "Marketing", desc: "Tarefas para vender e atrair clientes", tarefas: [] },
  { titulo: "Estratégia", desc: "Pensar em crescer sem se matar", tarefas: [] },
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
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Detetive do Tempo</h1>
        <p className="text-muted mb-6">Mapeie suas tarefas e descubra quanto custam em reais.</p>

        <p className="text-sm text-muted mb-2">Assista ao vídeo antes de preencher as lacunas abaixo.</p>
        <div className="mb-8"><VideoPlaceholder /></div>

        <div className="rounded-2xl border border-border bg-white p-5 mb-6">
          <h2 className="font-serif text-lg text-ink mb-4">Vamos calcular o custo real do seu tempo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1">Faturamento mensal (R$)</label>
              <input placeholder="Ex: 15000" className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Horas por dia</label>
              <input placeholder="Ex: 8" className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Dias por semana</label>
              <input placeholder="Ex: 5" className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta" />
            </div>
          </div>
        </div>

        {categorias.map((cat, ci) => (
          <div key={cat.titulo} className="rounded-2xl border border-border bg-white p-5 mb-4">
            <h3 className="font-serif text-lg text-ink mb-1">{cat.titulo}</h3>
            <p className="text-xs text-muted mb-3">{cat.desc}</p>
            <div className="space-y-2 mb-3">
              {cat.tarefas.map((_t, ti) => (
                <div key={ti} className="flex flex-wrap items-center gap-2">
                  <input placeholder="Ex: Responder emails de clientes" className="flex-1 min-w-[160px] rounded-xl border border-border p-2 text-sm outline-none" />
                  <input placeholder="Qtd" className="w-16 rounded-xl border border-border p-2 text-sm outline-none" />
                  <select className="rounded-xl border border-border p-2 text-sm">
                    <option>h</option><option>min</option>
                  </select>
                  <select className="rounded-xl border border-border p-2 text-sm">
                    <option>/ dia</option><option>/ semana</option><option>/ mês</option>
                  </select>
                  <button onClick={() => removeTarefa(ci, ti)}><Trash2 size={14} className="text-muted" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => addTarefa(ci)} className="text-xs font-semibold text-terracotta flex items-center gap-1">
              <Plus size={13} /> Adicionar tarefa
            </button>
          </div>
        ))}

        <div className="rounded-2xl border border-dashed border-border bg-white p-5 mb-6 text-center">
          <p className="text-sm text-muted mb-3">Travou? Não lembra de todas as suas tarefas?</p>
          <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta">
            <Sparkles size={14} /> Conversa comigo
          </button>
        </div>

        <button className="w-full rounded-full bg-ink text-cream py-3 text-sm font-semibold mb-4">
          Salvar tarefas no Documento Mestre
        </button>

        <Link
          to="/metodo/pilar-1/detetive-do-tempo/relatorio"
          className="w-full flex items-center justify-center gap-2 rounded-full border border-terracotta text-terracotta py-3 text-sm font-semibold"
        >
          Tarefas mapeadas? Ver Relatório <ArrowRight size={15} />
        </Link>
      </div>
    </Layout>
  );
}

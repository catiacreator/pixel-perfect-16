import { useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { FileText, Download, Plus, Calendar, Trophy, Flag } from "lucide-react";

const DOCS = [
  { titulo: "Documento Mestre", to: "/doc-mestre" },
  { titulo: "Arquétipos e Tom de Voz", to: "/metodo/pilar-2/identidade" },
  { titulo: "Identidade Visual", to: "/metodo/pilar-2/identidade-visual" },
  { titulo: "Esboço do Método", to: "/metodo/pilar-2/metodo" },
];

const CONQUISTAS = [
  "Documento Mestre", "Detetive do Tempo", "Arquétipos Decifrados", "Voz Definida",
  "Identidade Visual", "Método Próprio", "Página Profissional", "Linha Editorial",
  "Bio do Instagram", "Rainha da Trilha",
];
const DESBLOQUEADAS = new Set(["Arquétipos Decifrados", "Método Próprio"]);

export default function MinhaBase() {
  const [tarefas, setTarefas] = useState(["", "", ""]);
  const hoje = new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" });

  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-4xl mx-auto">
        <p className="text-muted text-sm mb-1 capitalize">{hoje}</p>
        <h1 className="font-serif text-3xl text-ink mb-3">Olá, Cátia! 👋</h1>
        <span className="inline-block text-xs px-3 py-1.5 rounded-full bg-white border border-border mb-8">
          🚀 Em Movimento · 3/10 — ⭐ Expert em Formação em 3 conquistas
        </span>

        <h2 className="font-serif text-xl text-ink mb-3">Meus documentos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {DOCS.map((d) => (
            <div key={d.titulo} className="rounded-xl border border-border bg-white p-4 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm">
                <FileText size={15} className="text-terracotta" /> {d.titulo}
              </span>
              <div className="flex items-center gap-2">
                <Link to={d.to} className="text-xs font-semibold text-terracotta">Abrir</Link>
                <button><Download size={14} className="text-muted" /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="font-serif text-lg text-ink mb-3">Rotina do dia — Postagens</h2>
            {["Stories", "Post de Carrossel", "Reels"].map((f) => (
              <button key={f} className="w-full text-left text-sm rounded-xl border border-border px-3 py-2.5 mb-2">
                Ver ideias de {f}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="font-serif text-lg text-ink mb-3">Tarefas do Dia</h2>
            {tarefas.map((t, i) => (
              <input
                key={i}
                defaultValue={t}
                placeholder={`Tarefa ${i + 1}`}
                className="w-full mb-2 rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta"
              />
            ))}
            <button
              onClick={() => setTarefas((p) => [...p, ""])}
              className="text-xs flex items-center gap-1 text-terracotta font-semibold"
            >
              <Plus size={13} /> Adicionar mais uma tarefa
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 mb-10">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h2 className="font-serif text-lg text-ink flex items-center gap-2">
              <Calendar size={16} className="text-terracotta" /> Calendário Editorial
            </h2>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1 rounded-full border border-border">7 dias</button>
              <button className="text-xs px-3 py-1 rounded-full border border-border">30 dias</button>
            </div>
          </div>
          <Link to="/metodo/pilar-2/redes-sociais?aba=calendario" className="text-sm font-semibold text-terracotta">
            Editar calendário →
          </Link>
        </div>

        <h2 className="font-serif text-lg text-ink mb-3 flex items-center gap-2">
          <Trophy size={16} className="text-terracotta" /> Conquistas da trilha
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {CONQUISTAS.map((c) => {
            const done = DESBLOQUEADAS.has(c);
            return (
              <div
                key={c}
                className={`rounded-xl border p-3 text-center text-xs ${done ? "border-success bg-white" : "border-border bg-white opacity-50"}`}
              >
                {c}
              </div>
            );
          })}
        </div>

        <h2 className="font-serif text-lg text-ink mb-3 flex items-center gap-2">
          <Flag size={16} className="text-terracotta" /> Seus marcos
        </h2>
        <button className="text-xs flex items-center gap-1 text-terracotta font-semibold">
          <Plus size={13} /> Adicionar marco
        </button>
      </div>
    </Layout>
  );
}

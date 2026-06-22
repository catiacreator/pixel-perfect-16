import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import ProgressBar from "../../components/ProgressBar";
import { PartyPopper } from "lucide-react";

const ITENS = [
  { label: "Preenchi meu Documento Mestre", to: "/doc-mestre" },
  { label: "Explorei o ChatGPT e entendi como usá-lo", to: "/metodo/pilar-1/aprenda-ia/chatgpt" },
  { label: "Explorei o Claude e entendi como usá-lo", to: "/metodo/pilar-1/aprenda-ia/claude" },
  { label: "ChatGPT", to: "/metodo/pilar-1/aprenda-ia/chatgpt" },
  { label: "Claude", to: "/metodo/pilar-1/aprenda-ia/claude" },
  { label: "Gemini", to: "/metodo/pilar-1/aprenda-ia/gemini" },
  { label: "Grok", to: "/metodo/pilar-1/aprenda-ia/grok" },
  { label: "NotebookLM", to: "/metodo/pilar-1/aprenda-ia/notebooklm" },
  { label: "Lovable", to: "/metodo/pilar-1/aprenda-ia/lovable" },
  { label: "Tella", to: "/metodo/pilar-1/aprenda-ia/tella" },
  { label: "Mapeei minhas tarefas no Detetive do Tempo", to: "/metodo/pilar-1/detetive-do-tempo" },
  { label: "Gerei meu relatório e vi quanto cada tarefa custa", to: "/metodo/pilar-1/detetive-do-tempo/relatorio" },
];

export default function ConclusaoPilar1() {
  const [done, setDone] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const todasFeitas = done.size === ITENS.length;

  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo="/metodo/pilar-1" backLabel="Voltar para o Pilar 1" />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Revise e celebre</h1>
        <p className="italic text-muted mb-1">Checklist do Pilar 1 — RECUPERAR SEU TEMPO</p>
        <p className="text-sm text-muted mb-6">
          Marque o que você concluiu. Não precisa estar perfeito — feito é melhor que perfeito.
        </p>

        <div className="mb-6"><ProgressBar done={done.size} total={ITENS.length} /></div>

        <div className="rounded-2xl border border-border bg-white divide-y divide-border mb-6">
          {ITENS.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <button
                onClick={() => toggle(i)}
                className={`w-5 h-5 rounded-full border flex-shrink-0 ${done.has(i) ? "bg-success border-success" : "border-border"}`}
              />
              <span className={`flex-1 text-sm ${done.has(i) ? "text-muted line-through" : "text-ink"}`}>{item.label}</span>
              <Link to={item.to} className="text-xs font-semibold text-terracotta whitespace-nowrap">Abrir →</Link>
            </div>
          ))}
        </div>

        {todasFeitas && (
          <div className="rounded-2xl bg-success/10 border border-success p-5 flex items-center gap-3 mb-6">
            <PartyPopper size={20} className="text-success" />
            <p className="text-sm font-semibold text-ink">Pilar 1 fechado. O Pilar 2 já está destrancado.</p>
          </div>
        )}

        <Link
          to="/metodo/pilar-2"
          className={`w-full flex items-center justify-center rounded-full py-3 text-sm font-semibold ${
            todasFeitas ? "bg-ink text-cream" : "bg-border text-muted pointer-events-none"
          }`}
        >
          Avançar para o Pilar 2
        </Link>
      </div>
    </Layout>
  );
}

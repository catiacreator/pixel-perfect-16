import { useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import {
  Hourglass,
  Trophy,
  FileText,
  GraduationCap,
  Brain,
  Sparkles,
  Compass,
  Zap,
  BookOpen,
  Feather,
  Video,
  Search,
  BarChart3,
} from "lucide-react";

const ITENS = [
  { icon: FileText, label: "Preenchi meu Documento Mestre (nome, profissão, público e o que faço)", to: "/doc-mestre" },
  { icon: GraduationCap, label: "Explorei o ChatGPT e entendi como usá-lo", to: "/metodo/pilar-1/aprenda-ia/chatgpt" },
  { icon: GraduationCap, label: "Explorei o Claude e entendi como usá-lo", to: "/metodo/pilar-1/aprenda-ia/claude" },
  { icon: Brain, label: "ChatGPT", to: "/metodo/pilar-1/aprenda-ia/chatgpt" },
  { icon: Sparkles, label: "Claude", to: "/metodo/pilar-1/aprenda-ia/claude" },
  { icon: Compass, label: "Gemini", to: "/metodo/pilar-1/aprenda-ia/gemini" },
  { icon: Zap, label: "Grok", to: "/metodo/pilar-1/aprenda-ia/grok" },
  { icon: BookOpen, label: "NotebookLM", to: "/metodo/pilar-1/aprenda-ia/notebooklm" },
  { icon: Feather, label: "Lovable", to: "/metodo/pilar-1/aprenda-ia/lovable" },
  { icon: Video, label: "Tella", to: "/metodo/pilar-1/aprenda-ia/tella" },
  { icon: Search, label: "Mapeei minhas tarefas no Mapa do Tempo", to: "/metodo/pilar-1/detetive-do-tempo" },
  { icon: BarChart3, label: "Gerei meu relatório e vi quanto cada tarefa custa", to: "/metodo/pilar-1/detetive-do-tempo/relatorio" },
];

export default function ConclusaoPilar1() {
  const [done, setDone] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const pct = Math.round((done.size / ITENS.length) * 100);

  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Crie com Leveza sem roubar o seu tempo" backTo="/metodo/pilar-1" backLabel="Voltar para o Pilar 1" />
      <PillarHeader
        numeral="I"
        icon={<Hourglass size={18} />}
        pilarLabel="Pilar 1"
        titulo="Revise e celebre"
        subtitulo="Checklist do Pilar 1 — CRIE COM LEVEZA SEM ROUBAR O SEU TEMPO"
      />

      <div className="px-5 md:px-10 pb-16 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 mb-4">
          <p className="text-sm text-ink leading-relaxed">
            <span className="font-semibold">Marque o que você concluiu.</span>{" "}
            <span className="text-muted">
              Não precisa estar perfeito — feito é melhor que perfeito. Use este checklist pra ter clareza do que avançou e do que ainda pode fortalecer.
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white shadow-sm p-5 mb-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl border border-terracotta flex items-center justify-center text-terracotta flex-shrink-0">
            <Trophy size={20} />
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold tracking-tight text-ink">{done.size} de {ITENS.length} concluídos</p>
          </div>
          <p className="text-2xl font-bold tracking-tight text-ink">{pct}%</p>
        </div>

        <div className="space-y-2.5">
          {ITENS.map((item, i) => {
            const Icon = item.icon;
            const isDone = done.has(i);
            return (
              <div key={i} className="rounded-2xl border border-border bg-white shadow-sm p-3.5 flex items-center gap-3">
                <button
                  onClick={() => toggle(i)}
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${isDone ? "bg-success border-success" : "border-border"}`}
                  aria-label="marcar"
                />
                <Icon size={16} className="text-muted flex-shrink-0" />
                <span className={`flex-1 text-sm ${isDone ? "text-muted line-through" : "text-ink"}`}>{item.label}</span>
                <Link to={item.to} className="text-xs font-semibold text-terracotta whitespace-nowrap inline-flex items-center gap-1">
                  Abrir →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

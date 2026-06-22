import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import ProgressBar from "../../components/ProgressBar";
import { Check, AlertTriangle, Trophy } from "lucide-react";

const CONCLUIDOS = [
  { titulo: "Esboço do Método", to: "/metodo/pilar-2/metodo" },
  { titulo: "Identidade de Marca", to: "/metodo/pilar-2/identidade" },
];

const PENDENTES = [
  { titulo: "Página Profissional", to: "/metodo/pilar-2/pagina-profissional" },
  { titulo: "Redes Sociais", to: "/metodo/pilar-2/redes-sociais" },
  { titulo: "Vídeos", to: "/metodo/pilar-2/videos" },
];

export default function ConclusaoPilar2() {
  const total = CONCLUIDOS.length + PENDENTES.length;

  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2" backLabel="Voltar para o Pilar 2" />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Revise e celebre</h1>
        <p className="italic text-muted mb-1">Checklist do Pilar 2 — CRIAR AUTORIDADE</p>
        <p className="text-sm text-muted mb-6">
          Marque o que você concluiu. Não precisa estar perfeito — feito é melhor que perfeito.
        </p>

        <div className="rounded-2xl border border-border bg-white p-4 mb-6 flex items-center gap-3">
          <Trophy size={18} className="text-terracotta" />
          <div className="flex-1"><ProgressBar done={CONCLUIDOS.length} total={total} /></div>
        </div>

        <p className="text-xs tracking-[0.15em] uppercase text-success mb-2 flex items-center gap-1.5">
          <Check size={13} /> Concluído
        </p>
        <div className="rounded-2xl border border-border bg-white divide-y divide-border mb-6">
          {CONCLUIDOS.map((c) => (
            <div key={c.titulo} className="flex items-center gap-3 px-4 py-3.5">
              <Check size={16} className="text-success flex-shrink-0" />
              <span className="flex-1 text-sm text-ink line-through opacity-60">{c.titulo}</span>
              <span className="text-xs font-semibold text-muted">AUTO</span>
              <Link to={c.to} className="text-xs font-semibold text-terracotta">Ver →</Link>
            </div>
          ))}
        </div>

        <p className="text-xs tracking-[0.15em] uppercase text-gold mb-2 flex items-center gap-1.5">
          <AlertTriangle size={13} /> Para completar
        </p>
        <div className="rounded-2xl border border-border bg-white divide-y divide-border mb-8">
          {PENDENTES.map((p) => (
            <div key={p.titulo} className="flex items-center gap-3 px-4 py-3.5">
              <span className="w-4 h-4 rounded-full border border-gold flex-shrink-0" />
              <span className="flex-1 text-sm text-ink">{p.titulo}</span>
              <span className="text-xs font-semibold text-gold">NÃO DETECTADO</span>
              <Link to={p.to} className="text-xs font-semibold text-terracotta whitespace-nowrap">Voltar para completar →</Link>
            </div>
          ))}
        </div>

        <Link
          to="/metodo/pilar-3"
          className="w-full flex items-center justify-center rounded-full bg-border text-muted py-3 text-sm font-semibold pointer-events-none"
        >
          Pilar 3 — Em breve
        </Link>
      </div>
    </Layout>
  );
}

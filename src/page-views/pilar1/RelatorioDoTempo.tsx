import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import { ArrowRight } from "lucide-react";

export default function RelatorioDoTempo() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo="/metodo/pilar-1/detetive-do-tempo" backLabel="Voltar para o Detetive do Tempo" />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-4">Relatório — Detetive do Tempo</h1>
        <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-muted mb-6">
          Faltam dados. Volte para o Detetive do Tempo, preencha faturamento, horas, dias e adicione as suas tarefas.
        </div>
        <Link
          to="/metodo/pilar-1/detetive-do-tempo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
        >
          Ir para o Detetive <ArrowRight size={15} />
        </Link>
      </div>
    </Layout>
  );
}

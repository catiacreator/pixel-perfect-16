import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PillarHeader from "../../components/PillarHeader";
import { Wrench, ArrowLeft } from "lucide-react";

export default function ComoUsar() {
  return (
    <Layout>
      <PillarHeader
        numeral="✦"
        icon={null}
        pilarLabel="Consultoria de IA"
        titulo="Como instalar a skill"
      />
      <div className="px-5 md:px-10 pt-8 pb-10 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-muted mb-6">
          <Wrench size={26} className="mx-auto mb-3 opacity-50" />
          Esta página está em construção.
        </div>
        <Link to="/metodo/consultoria-ia" className="flex items-center gap-1.5 text-sm text-muted">
          <ArrowLeft size={14} /> Voltar para Consultoria de IA
        </Link>
      </div>
    </Layout>
  );
}

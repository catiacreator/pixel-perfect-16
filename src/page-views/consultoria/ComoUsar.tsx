import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import { Wrench, ArrowLeft } from "lucide-react";

export default function ComoUsar() {
  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-4">Como instalar a skill</h1>
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

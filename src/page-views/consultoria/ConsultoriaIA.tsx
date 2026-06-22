import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PromptStep from "../../components/PromptStep";
import { Briefcase, ArrowRight, ArrowLeft } from "lucide-react";

export default function ConsultoriaIA() {
  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl border border-terracotta text-terracotta flex items-center justify-center">
            <Briefcase size={18} />
          </div>
          <p className="text-xs tracking-[0.15em] uppercase text-muted">Caminho especial</p>
        </div>
        <h1 className="font-serif text-3xl text-ink mb-2">Consultoria de Inteligência Artificial</h1>
        <p className="italic text-muted mb-6">para quem quer transformar IA em serviço premium.</p>

        <div className="rounded-2xl border border-border bg-white p-5 mb-6">
          <p className="font-serif text-lg text-ink mb-2">Planejador de Evento de IA para Negócios</p>
          <p className="text-sm text-muted mb-4">
            Estrutura completa para vender e entregar um workshop, GPT Day ou imersão presencial de IA aplicada a
            negócios — do convite ao roteiro do dia.
          </p>
          <PromptStep
            numero={1}
            titulo="Planejador de Evento de IA"
            descricao="Gera a estrutura completa de um evento de IA para negócios, pronto a vender."
            prompt="Quero estruturar um evento (workshop, GPT Day ou imersão presencial) de Inteligência Artificial aplicada a negócios. Com base no meu Documento Mestre, sugere: formato, duração, agenda hora a hora, preço sugerido e um roteiro de convite para os participantes."
          />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link to="/metodo" className="flex items-center gap-1.5 text-sm text-muted">
            <ArrowLeft size={14} /> Voltar para a Trilha
          </Link>
          <Link to="/metodo/consultoria-ia/como-usar" className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta">
            Como instalar a skill <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import { ChevronDown, Shirt, Scissors, ArrowLeft } from "lucide-react";
import { useState } from "react";

function Acordeao({ icon, titulo, descricao }: { icon: React.ReactNode; titulo: string; descricao: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-white p-5 mb-3">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-3">
        <span className="flex items-center gap-3 text-left">
          <span className="w-9 h-9 rounded-xl border border-terracotta text-terracotta flex items-center justify-center flex-shrink-0">{icon}</span>
          <span>
            <p className="font-serif text-lg text-ink">{titulo}</p>
            <p className="text-sm text-muted">{descricao}</p>
          </span>
        </span>
        <ChevronDown size={16} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="text-sm text-muted mt-4 pl-12">Conteúdo desta consultoria — em construção.</p>}
    </div>
  );
}

export default function ConsultoriaImagem() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2/identidade" backLabel="Voltar para Identidade de Marca" />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-3">Consultoria de Imagem</h1>
        <p className="italic text-muted mb-6">
          Estudo Visual completo: seu estilo pessoal e o cabelo que valoriza sua presença nos vídeos.
        </p>
        <p className="text-sm text-muted mb-6">
          O que vestes e como está o teu cabelo comunicam antes de falares. Dois estudos especializados: um focado
          no teu estilo pessoal e outro no cabelo — pensados para brilhares na câmara.
        </p>

        <Acordeao icon={<Shirt size={16} />} titulo="Estudo Visual — Roupas, Cores e Acessórios" descricao="ChatGPT analisa a tua foto, entende o teu estilo e entrega looks prontos pra gravar." />
        <Acordeao icon={<Scissors size={16} />} titulo="Estudo de Cabelo — Cortes, Cores e Cuidados" descricao="ChatGPT analisa a tua foto e entrega um estudo completo do cabelo pra brilhares em vídeo." />

        <Link to="/metodo/pilar-2/identidade" className="inline-flex items-center gap-1.5 text-sm text-muted mt-4">
          <ArrowLeft size={14} /> Voltar para Identidade de Marca
        </Link>
      </div>
    </Layout>
  );
}

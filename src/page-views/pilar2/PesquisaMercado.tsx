import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function PesquisaMercado() {
  const [dores, setDores] = useState(["", "", "", "", ""]);

  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2" backLabel="Voltar para o Pilar 2" />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Pilar 2 · Pesquisa de Mercado</p>
        <h1 className="font-serif text-3xl text-ink mb-6">Pesquisa de Mercado — Pesquisa de Dores do Público</h1>

        <p className="text-xs tracking-[0.15em] uppercase text-muted mb-2">Passo 1</p>
        <h2 className="font-serif text-xl text-ink mb-2">Pesquisa de Dores do Público com NotebookLM</h2>
        <p className="text-sm text-muted mb-4">
          Aprenda a usar o NotebookLM para mapear dores, desejos e linguagem do seu público de forma inteligente.
        </p>
        <div className="mb-4"><VideoPlaceholder /></div>
        <a href="https://notebooklm.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta mb-10">
          Abrir NotebookLM <ExternalLink size={13} />
        </a>

        <p className="text-xs tracking-[0.15em] uppercase text-muted mb-2">Passo 2</p>
        <h2 className="font-serif text-xl text-ink mb-2">Caixinha de Dores do Público</h2>
        <p className="text-sm text-muted mb-4">
          Depois da pesquisa do NotebookLM, confirme se são essas as cinco dores mais fortes do seu público.
        </p>
        <div className="rounded-2xl border border-border bg-white p-5 mb-6">
          <p className="font-serif text-lg text-ink mb-3">As 5 maiores dores do seu público</p>
          {dores.map((d, i) => (
            <textarea
              key={i}
              value={d}
              onChange={(e) => setDores((p) => p.map((x, idx) => (idx === i ? e.target.value : x)))}
              rows={1}
              placeholder={`Dor ${i + 1}`}
              className="w-full mb-2 rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta resize-none"
            />
          ))}
          <button className="text-sm font-semibold text-terracotta">Salvar</button>
        </div>

        <Link to="/metodo/pilar-2/metodo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">
          Próxima aula: Definindo Seu Método <ArrowRight size={15} />
        </Link>
      </div>
    </Layout>
  );
}

import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PromptStep from "../../components/PromptStep";
import ColarResultado from "../../components/ColarResultado";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function PaginaProfissional() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2/redes-sociais/instagram" backLabel="Voltar para Instagram" />
      <div className="px-5 md:px-10 py-10 max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Página Profissional</h1>
        <p className="italic text-muted mb-6">
          Transforme tudo o que preencheu até aqui numa página que apresenta o seu trabalho.
        </p>

        <PromptStep
          numero={8}
          titulo="Gerar a estrutura da sua Página Profissional"
          descricao="Use o seu Documento Mestre, arquétipos, tom de voz e identidade visual para gerar o mockup de uma página de uma única secção: quem é, o que entrega, prova social e CTA."
          prompt="Com base no meu Documento Mestre, arquétipos, tom de voz e identidade visual, cria a estrutura de uma página profissional de uma secção: hero com promessa, sobre mim, o que entrego, prova social e CTA final."
        />

        <ColarResultado label="Cole aqui a estrutura gerada" />

        <div className="rounded-2xl border border-border bg-white p-5 my-6">
          <p className="font-serif text-lg text-ink mb-2">Construir a página no Lovable</p>
          <p className="text-sm text-muted mb-3">
            Cole a estrutura acima num novo projeto Lovable e pede para construir a página seguindo a sua identidade
            visual.
          </p>
          <a href="https://lovable.dev" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta">
            Abrir Lovable <ExternalLink size={13} />
          </a>
        </div>

        <Link to="/metodo/pilar-2/conclusao" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">
          Voltar para a Conclusão do Pilar 2 <ArrowRight size={15} />
        </Link>
      </div>
    </Layout>
  );
}

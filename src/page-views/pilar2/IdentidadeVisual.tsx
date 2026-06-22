import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PromptStep from "../../components/PromptStep";
import ColarResultado from "../../components/ColarResultado";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";

export default function IdentidadeVisual() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2/identidade" backLabel="Voltar para Identidade de Marca" />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Identidade de marca</h1>
        <p className="italic text-muted mb-6">Identidade Visual</p>

        <div className="rounded-2xl border border-border bg-white p-5 mb-6">
          <p className="text-sm text-ink mb-3">
            Anexa até 3 imagens do Pinterest no ChatGPT e ele devolve paleta, tipografia, elementos visuais e mood —
            direto da tua referência.
          </p>
          <ol className="text-sm text-muted space-y-1.5 list-decimal pl-4">
            <li>No Pinterest, salva até 3 imagens que representam o teu estilo. <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="text-terracotta font-semibold inline-flex items-center gap-1">Abrir Pinterest <ExternalLink size={11} /></a></li>
            <li>Abre o ChatGPT, anexa as imagens e cola o prompt de análise visual abaixo.</li>
            <li>Cola o resultado nos campos abaixo — vai direto para o teu Documento Mestre.</li>
          </ol>
        </div>

        <PromptStep numero={5} titulo="Análise de identidade visual" descricao="Gera vibe, paleta, tipografia e estilo a partir das tuas referências." prompt="Analisa estas imagens de referência e devolve: 1) vibe da marca, 2) paleta de 5 cores em hex, 3) tipografia (título, corpo, manuscrita), 4) estilo de imagem, 5) elementos visuais, 6) antipadrões visuais a evitar." />

        <div className="rounded-2xl border border-border bg-white p-5 mb-4">
          <ColarResultado label="Cole o resultado do ChatGPT aqui" />
          <button className="text-xs font-semibold text-terracotta flex items-center gap-1.5">
            <Sparkles size={13} /> Preencher campos automaticamente
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 mb-8 space-y-4">
          <ColarResultado label="Vibe da Marca" placeholder="Ex: moderna, com humor visual, paleta vibrante mas clean" />
          <ColarResultado label="Paleta" placeholder="Cor1 #hex / Cor2 #hex / Cor3 #hex / Cor4 #hex / Cor5 #hex" />
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Tipografia (Título)" className="rounded-xl border border-border p-2.5 text-sm" />
            <input placeholder="Tipografia (Corpo)" className="rounded-xl border border-border p-2.5 text-sm" />
            <input placeholder="Tipografia (Manuscrita)" className="rounded-xl border border-border p-2.5 text-sm" />
          </div>
          <ColarResultado label="Estilo de Imagem" />
          <ColarResultado label="Elementos Visuais" />
          <ColarResultado label="Antipadrões Visuais" />
          <ColarResultado label="Prompt pra capa de carrossel" />
          <ColarResultado label="Prompt pra capa de Reels" />
          <ColarResultado label="Prompt pra imagem lifestyle/bastidor" />
        </div>

        <div className="rounded-2xl border border-terracotta bg-white p-5 text-center">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próximo passo</p>
          <p className="font-serif text-lg text-ink mb-3">4. Redes Sociais</p>
          <Link to="/metodo/pilar-2/redes-sociais" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

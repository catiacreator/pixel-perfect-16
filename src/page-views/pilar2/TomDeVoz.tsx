import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import PromptStep from "../../components/PromptStep";
import ColarResultado from "../../components/ColarResultado";
import { ArrowRight } from "lucide-react";

export default function TomDeVoz() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2/identidade" backLabel="Voltar para Identidade de Marca" />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Identidade de marca</h1>
        <p className="italic text-muted mb-6">Tom de voz da marca</p>

        <div className="mb-6"><VideoPlaceholder /></div>

        <PromptStep
          numero={4}
          titulo="Tom de voz da marca"
          descricao="Usa os teus arquétipos, palavras a usar/evitar e os ajustes da ponte para entregar 4 campos: tom de voz, crença central, opiniões polémicas e 3 estudos de caso."
          prompt="Com base no meu Documento Mestre e nos meus arquétipos de marca e cliente, gera: 1) tom de voz (3-4 regras executáveis), 2) crença central (1-2 frases polémicas), 3) 3 opiniões polémicas que defendo, 4) 3 estudos de caso reais."
        />

        <div className="rounded-2xl border border-border bg-white p-5">
          <ColarResultado label="Tom de voz" placeholder="3 a 4 regras executáveis de como você escreve" />
          <ColarResultado label="Crença central" placeholder="A convicção que sustenta tudo que você faz" />
          <ColarResultado label="Opiniões polêmicas" placeholder="3 posições fortes — uma por linha" />
          <ColarResultado label="3 estudos de caso" placeholder="Quem era a cliente, situação antes, o que fez, resultado depois" />
        </div>

        <div className="rounded-2xl border border-terracotta bg-white p-5 text-center mt-8">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próximo passo</p>
          <p className="font-serif text-lg text-ink mb-3">3. Identidade Visual</p>
          <Link to="/metodo/pilar-2/identidade-visual" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

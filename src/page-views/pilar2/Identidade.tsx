import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import PromptStep from "../../components/PromptStep";
import ColarResultado from "../../components/ColarResultado";
import { ArrowRight } from "lucide-react";

const ARQUETIPOS = ["Sábia", "Inocente", "Explorador(a)", "Herói/Heroína", "Fora-da-lei", "Mago(a)", "Cara comum", "Amante", "Bobo da corte", "Cuidador(a)", "Governante", "Criador(a)"];

function SelectArquetipo({ label }: { label: string }) {
  return (
    <div>
      <label className="text-xs text-muted block mb-1">{label}</label>
      <select className="w-full rounded-xl border border-border p-2.5 text-sm">
        {ARQUETIPOS.map((a) => <option key={a}>{a}</option>)}
      </select>
    </div>
  );
}

export default function Identidade() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2" backLabel="Voltar para o Pilar 2" />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Identidade de marca</h1>
        <p className="italic text-muted mb-6">Descubra seu arquétipo, o do seu cliente e calibre a ponte entre os dois.</p>

        <div className="mb-6"><VideoPlaceholder label="Vídeo: Como definir arquétipos da sua marca com IA" /></div>

        <h2 className="font-serif text-xl text-ink mb-2">1. Seu arquétipo</h2>
        <p className="text-sm text-muted mb-3">Define como você ESCREVE: palavras a usar, palavras a evitar e estrutura de história.</p>
        <PromptStep numero={1} titulo="Seu arquétipo" descricao="Descobre o teu arquétipo dominante e secundário." prompt="Com base no meu Documento Mestre, identifica o meu arquétipo de marca dominante e secundário (modelo dos 12 arquétipos de Jung), e devolve: palavras a usar, palavras a evitar e estrutura de história ideal." />
        <div className="rounded-2xl border border-border bg-white p-5 mb-8">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <SelectArquetipo label="Arquétipo dominante" />
            <SelectArquetipo label="Arquétipo secundário" />
          </div>
          <ColarResultado label="Resultado completo do seu arquétipo" />
        </div>

        <h2 className="font-serif text-xl text-ink mb-2">2. Arquétipo do cliente</h2>
        <p className="text-sm text-muted mb-3">Define como você VENDE: dor a enfatizar, prova social e objeção a antecipar.</p>
        <PromptStep numero={2} titulo="Arquétipo do cliente" descricao="Descobre o arquétipo do teu público." prompt="Com base no meu Documento Mestre, identifica o arquétipo dominante e secundário do meu cliente ideal, a dor principal a enfatizar, e o tipo de prova social que mais ressoa com ele." />
        <div className="rounded-2xl border border-border bg-white p-5 mb-8">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <SelectArquetipo label="Arquétipo dominante" />
            <SelectArquetipo label="Arquétipo secundário" />
          </div>
          <ColarResultado label="Resultado completo do arquétipo do cliente" />
        </div>

        <h2 className="font-serif text-xl text-ink mb-2">3. O encontro entre os dois</h2>
        <p className="text-sm text-muted mb-3">Cruza os dois arquétipos e calibra a ponte: ajustes de comunicação, ganchos e frases de venda.</p>
        <PromptStep numero={3} titulo="O encontro entre os dois" descricao="Calibra a ponte entre a tua marca e o teu cliente." prompt="Cruza o meu arquétipo de marca com o arquétipo do meu cliente e devolve 5 ajustes concretos na minha comunicação para fechar a ponte entre os dois." />
        <ColarResultado label="Ajustes de comunicação" />

        <div className="rounded-2xl border border-terracotta bg-white p-5 text-center mt-8">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próximo passo</p>
          <p className="font-serif text-lg text-ink mb-3">2. Tom de Voz da Marca</p>
          <Link to="/metodo/pilar-2/tom-de-voz" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

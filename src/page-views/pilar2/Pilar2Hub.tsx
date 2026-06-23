import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import EtapaCard from "../../components/EtapaCard";
import { Crown, Search, Compass, Palette, Heart, Video, Trophy } from "lucide-react";

export default function Pilar2Hub() {
  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo" backLabel="Voltar para Trilha" />
      <PillarHeader
        numeral="2"
        icon={<Crown size={18} />}
        pilarLabel="Pilar 2"
        titulo="Pilar 2 — Criar Autoridade"
        subtitulo="porque você estudou demais pra ficar invisível"
      />
      <div className="px-5 md:px-10 pt-10 md:pt-14 pb-16 max-w-[1100px] mx-auto">
        <p className="text-[11px] tracking-[0.28em] uppercase text-ink/45 font-medium mb-5">
          As etapas do Pilar 2
        </p>
        <div className="space-y-4">
          <EtapaCard icon={<Search size={18} />} label="Etapa 1 · Público" titulo="Pesquisa de Mercado · Pesquisa de Dores do Público" descricao="Descubra o que seu público realmente quer e onde dói." to="/metodo/pilar-2/pesquisa-mercado" />
          <EtapaCard icon={<Compass size={18} />} label="Etapa 2 · Estratégia" titulo="Definindo Seu Método" descricao="Defina os passos do que você ensina. Esse rascunho alimenta tudo que vem depois." to="/metodo/pilar-2/metodo" concluido />
          <EtapaCard
            icon={<Palette size={18} />}
            label="Etapa 3 · Descoberta"
            titulo="Identidade de marca"
            descricao="Descubra como você quer ser vista."
            to="/metodo/pilar-2/identidade"
            concluido
            subLinks={[
              { label: "Tom de Voz", to: "/metodo/pilar-2/tom-de-voz" },
              { label: "Identidade Visual", to: "/metodo/pilar-2/identidade-visual" },
              { label: "Consultoria de Imagem", to: "/metodo/pilar-2/consultoria-imagem" },
            ]}
          />
          <EtapaCard
            icon={<Heart size={18} />}
            label="Etapa 4 · Conteúdo"
            titulo="Redes Sociais"
            descricao="O que você fala e como aparece."
            to="/metodo/pilar-2/redes-sociais"
            subLinks={[{ label: "Instagram", to: "/metodo/pilar-2/redes-sociais/instagram" }]}
          />
          <EtapaCard icon={<Video size={18} />} label="Etapa 5 · Produção" titulo="Vídeos profissionais sem gravar 50 vezes" descricao="Conteúdo em vídeo usando Inteligência Artificial." to="/metodo/pilar-2/videos" />
          <EtapaCard
            icon={<Trophy size={18} />}
            label="Etapa 6 · Fechar"
            titulo="Revise sua autoridade"
            descricao="Veja como sua identidade e presença ficaram."
            to="/metodo/pilar-2/conclusao"
            subLinks={[
              { label: "Revisar Documento Mestre", to: "/doc-mestre" },
              { label: "Checklist Pilar 2", to: "/metodo/pilar-2/conclusao" },
            ]}
          />
        </div>
      </div>
    </Layout>
  );
}

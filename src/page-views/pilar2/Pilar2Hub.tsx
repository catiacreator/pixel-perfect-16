import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ReactElement } from "react";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import EtapaCard from "../../components/EtapaCard";
import { Crown, Search, Compass, Palette, Heart, Video, Trophy, BookOpen, Play } from "lucide-react";
import { getPilarBySlug } from "@/lib/pilares.functions";

const ICONS: Record<string, ReactElement> = {
  "pesquisa-mercado": <Search size={18} />,
  metodo: <Compass size={18} />,
  identidade: <Palette size={18} />,
  "redes-sociais": <Heart size={18} />,
  videos: <Video size={18} />,
  conclusao: <Trophy size={18} />,
};

const LABEL: Record<string, string> = {
  "pesquisa-mercado": "Público",
  metodo: "Estratégia",
  identidade: "Descoberta",
  "redes-sociais": "Conteúdo",
  videos: "Produção",
  conclusao: "Fechar",
};

const SUBLINKS: Record<string, { label: string; to: string }[]> = {
  identidade: [
    { label: "Tom de Voz", to: "/metodo/pilar-2/tom-de-voz" },
    { label: "Identidade Visual", to: "/metodo/pilar-2/identidade-visual" },
    { label: "Consultoria de Imagem", to: "/metodo/pilar-2/consultoria-imagem" },
  ],
  "redes-sociais": [{ label: "Instagram", to: "/metodo/pilar-2/redes-sociais/instagram" }],
  conclusao: [
    { label: "Revisar Documento Mestre", to: "/doc-mestre" },
    { label: "Checklist Pilar 2", to: "/metodo/pilar-2/conclusao" },
  ],
};

export default function Pilar2Hub() {
  const fetchPilar = useServerFn(getPilarBySlug);
  const { data, isLoading } = useQuery({
    queryKey: ["pilar", "pilar-2"],
    queryFn: () => fetchPilar({ data: { slug: "pilar-2" } }),
  });

  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel={data?.titulo ?? "Pilar 2"} backTo="/metodo" backLabel="Voltar para Trilha" />
      <PillarHeader
        numeral="2"
        icon={<Crown size={18} />}
        pilarLabel="Pilar 2"
        titulo={data?.titulo ?? "Pilar 2"}
        subtitulo={data?.descricao ?? ""}
      />
      <div className="px-5 md:px-10 pt-10 md:pt-14 pb-16 max-w-[1100px] mx-auto">
        <p className="text-[11px] tracking-[0.28em] uppercase text-ink/45 font-medium mb-5">As etapas do Pilar 2</p>
        <div className="space-y-4">
          {isLoading && <p className="text-sm text-ink/50">Carregando etapas…</p>}
          {data?.etapas.map((e, idx) => (
            <div key={e.id} className="relative">
              <EtapaCard
                icon={ICONS[e.slug] ?? <BookOpen size={18} />}
                label={`Etapa ${idx + 1} · ${LABEL[e.slug] ?? ""}`.trim()}
                titulo={e.titulo}
                descricao={e.descricao ?? ""}
                to={`/metodo/pilar-2/${e.slug}`}
                subLinks={SUBLINKS[e.slug]}
              />
              {e.video_url && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-terracotta bg-cream-warm border border-[var(--color-border)] rounded-full px-2 py-1">
                  <Play size={10} /> Vídeo
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

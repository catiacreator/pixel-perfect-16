// Formatos de Conteúdo — sub-hub aberto a partir da Criação Livre. Cards para
// cada formato: série, yap content, reels, carrosséis, stories e posts express.

import type { ComponentType } from "react";
import Layout from "../components/Layout";
import PillarHeader from "../components/PillarHeader";
import PilarBreadcrumb from "../components/PilarBreadcrumb";
import { Link } from "@/lib/router-compat";
import { ArrowUpRight, Film, BookOpen, Video, Images, Layers, Sparkles } from "lucide-react";

type Item = { label: string; sub: string; to: string; icon: ComponentType<{ size?: number }> };

const ITENS: Item[] = [
  { label: "Cria a tua série", sub: "Uma ideia entra, uma série de Reels sai.", to: "/metodo/pilar-2/reels-em-serie", icon: Film },
  { label: "Yap Content", sub: "Roteiros de vídeo a falar para a câmara.", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=roteiros", icon: BookOpen },
  { label: "Reels virais", sub: "Reels curtos com potencial de alcance.", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=reels", icon: Video },
  { label: "Carrosséis virais", sub: "Carrosséis que prendem e vendem.", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=carrossel", icon: Images },
  { label: "Stories que vendem", sub: "Sequências de stories que convertem.", to: "/metodo/pilar-2/redes-sociais?aba=formatos&fmt=stories", icon: Layers },
  { label: "Posts Express", sub: "Posts avulsos, rápidos, à tua maneira.", to: "/metodo/pilar-2/redes-sociais?aba=avulsos", icon: Sparkles },
];

export default function FormatosHub() {
  return (
    <Layout>
      <PilarBreadcrumb
        pilar="redes"
        pilarLabel="Conteúdo Todo Dia"
        backTo="/criacao-livre"
        backLabel="Voltar atrás"
        historyBack
      />
      <PillarHeader
        numeral="✦"
        icon={<Film size={18} />}
        pilarLabel="Criação Livre"
        titulo="Formatos de Conteúdo"
        tituloHighlight="para gravar"
        subtitulo="Escolhe o formato e cria — cada um com o seu método."
        bg="linear-gradient(115deg, #405DE6 0%, #833AB4 40%, #C13584 65%, #F56040 88%, #FCAF45 100%)"
      />
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ITENS.map((it) => {
            const Icon = it.icon;
            return (
              <Link
                key={it.label}
                to={it.to}
                className="group flex flex-col rounded-2xl border border-[var(--color-border)] bg-white p-5 transition-colors hover:border-terracotta"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
                    <Icon size={19} />
                  </span>
                  <ArrowUpRight size={16} className="text-ink/30 transition-colors group-hover:text-terracotta" />
                </div>
                <p className="font-serif text-base text-ink">{it.label}</p>
                <p className="mt-1 text-xs text-ink/55">{it.sub}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

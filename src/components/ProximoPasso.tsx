// Botão "Próximo passo" no fim de cada página do fluxo da jornada — leva ao
// card seguinte. No "Analisar o teu perfil" (passo 4) mostra os dois ramos
// (5·A Plano de Posts e 5·B Criação Livre). Auto-gate: null fora do fluxo.

import { useLocation } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";

type Passo = { titulo: string; to: string };

function proximos(path: string, aba?: string): Passo[] {
  if (path.startsWith("/doc-mestre")) return [{ titulo: "Criar autoridade", to: "/metodo/pilar-2/identidade" }];
  if (path.startsWith("/metodo/pilar-2/redes-sociais")) {
    if (aba === "pilares") return [{ titulo: "Analisar o teu perfil", to: "/maquina-analises" }];
    return []; // outras abas de conteúdo — não fazem parte da linha do fluxo
  }
  // A Máquina de Análises trata do seu próprio "próximo passo" — só aparece no
  // fim, depois de a análise estar criada (ver MaquinaAnalises, passo 4).
  if (path.startsWith("/maquina-analises")) return [];
  if (path.startsWith("/metodo/pilar-2/reels-em-serie")) return [];
  // Páginas do "Criar autoridade" (identidade, tom de voz, etc.) — sem botão "Os teus pilares".
  if (path.startsWith("/metodo/pilar-2")) return [];
  return [];
}

export default function ProximoPasso() {
  const loc = useLocation();
  const aba = (loc.search as { aba?: string } | undefined)?.aba;
  const lista = proximos(loc.pathname, aba);
  if (!lista.length) return null;

  return (
    <div className="mx-auto max-w-[1280px] px-5 md:px-10 pb-16">
      {lista.map((p) => (
        <div key={p.to} className="mx-auto rounded-2xl border border-terracotta bg-white p-5 text-center md:max-w-[600px]">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próximo passo</p>
          <p className="font-serif text-lg text-ink mb-3">{p.titulo}</p>
          <Link
            to={p.to}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
          >
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      ))}
    </div>
  );
}

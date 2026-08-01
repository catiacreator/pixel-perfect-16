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
  if (path.startsWith("/metodo/pilar-2")) return [{ titulo: "Os teus pilares de conteúdo", to: "/metodo/pilar-2/redes-sociais?aba=pilares" }];
  return [];
}

export default function ProximoPasso() {
  const loc = useLocation();
  const aba = (loc.search as { aba?: string } | undefined)?.aba;
  const lista = proximos(loc.pathname, aba);
  if (!lista.length) return null;

  const bifurcacao = lista.length > 1;
  return (
    <div className="mx-auto max-w-[1280px] px-5 md:px-10 pb-16">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 md:max-w-[50%]">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-terracotta">
          {bifurcacao ? "Escolhe por onde continuar" : "Próximo passo"}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {lista.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-terracotta-dark"
            >
              {p.titulo}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

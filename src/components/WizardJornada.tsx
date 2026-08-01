// Wizard da jornada — barra de passos que mostra o que já foi, onde estás e o
// que vem. Aparece só nas páginas do fluxo (Documento Mestre, Pilar 2 / Redes
// Sociais, Máquina de Análises). Auto-gate: devolve null nas restantes páginas.

import { useLocation } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { Check } from "lucide-react";
import { useFluxoProgresso } from "@/lib/fluxo-jornada";

type Passo = { key: string; label: string; to: string; cor: string };

const PASSOS: Passo[] = [
  { key: "cerebro", label: "Segundo cérebro", to: "/doc-mestre", cor: "#833AB4" },
  { key: "autoridade", label: "Autoridade", to: "/metodo/pilar-2/identidade", cor: "#C13584" },
  { key: "pilares", label: "Pilares", to: "/metodo/pilar-2/redes-sociais?aba=pilares", cor: "#E1306C" },
  { key: "analise", label: "Analisar perfil", to: "/maquina-analises", cor: "#F56040" },
  { key: "criar", label: "Criar & Publicar", to: "/metodo/pilar-2/redes-sociais?aba=plano", cor: "#FCAF45" },
];

function indiceAtual(path: string, aba?: string): number {
  if (path.startsWith("/doc-mestre")) return 0;
  if (path.startsWith("/maquina-analises")) return 3;
  if (path.startsWith("/metodo/pilar-2/redes-sociais")) {
    if (aba === "pilares") return 2; // passo 3 do fluxo
    if (aba === "plano") return 4; // passo 5·A do fluxo
    return -1; // restantes abas = páginas da Criação Livre → sem wizard
  }
  if (path.startsWith("/metodo/pilar-2/reels-em-serie")) return -1; // formato → Criação Livre
  if (path.startsWith("/criacao-livre")) return -1; // hub da Criação Livre → sem wizard
  if (path.startsWith("/formatos")) return -1; // sub-hub de formatos → sem wizard
  if (path.startsWith("/metodo/pilar-2")) return 1;
  return -1;
}

export default function WizardJornada() {
  const loc = useLocation();
  const prog = useFluxoProgresso();
  const aba = (loc.search as { aba?: string } | undefined)?.aba;
  const atual = indiceAtual(loc.pathname, aba);
  if (atual < 0) return null;

  const feito = (p: Passo, i: number) => {
    if (i >= atual) return false; // à frente do atual nunca é "feito"
    const done = p.key === "criar" ? prog.plano?.done : prog[p.key]?.done;
    return i < atual || !!done; // passos anteriores contam como percorridos
  };

  return (
    <div className="border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-1 overflow-x-auto px-4 md:px-10 py-3">
        {PASSOS.map((p, i) => {
          const done = feito(p, i);
          const current = i === atual;
          const ativo = done || current;
          return (
            <div key={p.key} className="flex shrink-0 items-center">
              <Link
                to={p.to}
                className="flex items-center gap-2 rounded-full px-2.5 py-1 transition-colors hover:bg-black/[0.03]"
                aria-current={current ? "step" : undefined}
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: ativo ? p.cor : "rgba(0,0,0,0.16)" }}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={`whitespace-nowrap text-sm font-medium ${current ? "" : done ? "text-ink/60" : "text-ink/40"}`}
                  style={current ? { color: p.cor } : undefined}
                >
                  {p.label}
                </span>
              </Link>
              {i < PASSOS.length - 1 && <span className="mx-0.5 h-px w-5 shrink-0 bg-black/10" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

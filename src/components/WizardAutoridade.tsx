// Segunda wizard — o sub-fluxo dentro de "Criar autoridade":
// Identidade de marca → Tom de voz → Identidade visual → Consultoria de imagem.
// Aparece só nessas páginas (auto-gate) e realça a etapa atual.

import { useLocation } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { Check } from "lucide-react";

const COR = "#C13584";

type Passo = { key: string; label: string; to: string };

const PASSOS: Passo[] = [
  { key: "identidade", label: "Identidade de marca", to: "/metodo/pilar-2/identidade" },
  { key: "tom-de-voz", label: "Tom de voz", to: "/metodo/pilar-2/tom-de-voz" },
  { key: "identidade-visual", label: "Identidade visual", to: "/metodo/pilar-2/identidade-visual" },
  { key: "consultoria", label: "Consultoria de imagem", to: "/metodo/pilar-2/consultoria-imagem" },
];

function indiceAtual(path: string): number {
  // "identidade-visual" tem de ser testado antes de "identidade".
  if (path.startsWith("/metodo/pilar-2/identidade-visual")) return 2;
  if (path.startsWith("/metodo/pilar-2/consultoria-imagem")) return 3;
  if (path.startsWith("/metodo/pilar-2/tom-de-voz")) return 1;
  if (path.startsWith("/metodo/pilar-2/identidade")) return 0;
  return -1;
}

export default function WizardAutoridade() {
  const loc = useLocation();
  const atual = indiceAtual(loc.pathname);
  if (atual < 0) return null;

  return (
    <>
    {/* Hero pequeno "Autoridade" */}
    <div className="mx-auto max-w-[1280px] px-4 md:px-10 pt-4">
      <div
        className="rounded-2xl px-6 py-3.5 text-white"
        style={{ background: "linear-gradient(115deg, #833AB4 0%, #C13584 60%, #F56040 100%)" }}
      >
        <p className="text-[10px] tracking-[0.28em] uppercase text-white/80">Criar autoridade</p>
        <p className="font-editorial uppercase text-2xl md:text-3xl leading-none tracking-tight">Autoridade</p>
      </div>
    </div>

    {/* Segunda wizard */}
    <div className="border-b border-black/5 bg-white/60 backdrop-blur mt-3">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-1 overflow-x-auto px-4 md:px-10 py-2.5">
        {PASSOS.map((p, i) => {
          const done = i < atual;
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
                  style={{ background: ativo ? COR : "rgba(0,0,0,0.16)" }}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={`whitespace-nowrap text-sm font-medium ${current ? "" : done ? "text-ink/60" : "text-ink/40"}`}
                  style={current ? { color: COR } : undefined}
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
    </>
  );
}

import { Link } from "@/lib/router-compat";
import type { ReactNode } from "react";
import { ArrowUpRight, Check, Lock } from "lucide-react";

export default function EtapaCard({
  icon,
  label,
  titulo,
  descricao,
  to,
  concluido,
  bloqueado,
  bloqueadoMsg,
  subLinks,
  numero,
}: {
  icon: ReactNode;
  label: string;
  titulo: string;
  descricao: string;
  to: string;
  concluido?: boolean;
  bloqueado?: boolean;
  bloqueadoMsg?: string;
  subLinks?: { label: string; to: string }[];
  numero?: string;
}) {
  return (
    <div className="group relative grid grid-cols-[4rem_1fr_auto] md:grid-cols-[5rem_1fr_auto] items-start gap-6 md:gap-10 py-8 md:py-10 border-t border-[var(--color-border)] first:border-t-0">
      {/* Ícone / numeral */}
      <div className="font-display text-4xl md:text-5xl text-ink/20 tabular-nums tracking-tight leading-none pt-1">
        {numero || (
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cream-warm border border-[var(--color-border)] text-terracotta">
            {icon}
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="min-w-0">
        <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta font-medium mb-2">
          / {label}
        </p>
        <h3 className="font-display text-2xl md:text-3xl tracking-tight text-ink leading-tight mb-2">
          {titulo}
        </h3>
        <p className="text-sm md:text-[15px] text-ink/55 leading-relaxed max-w-xl">
          {descricao}
        </p>

        {concluido && (
          <p className="flex items-center gap-1.5 text-xs text-success mt-3">
            <Check size={13} /> Concluído
          </p>
        )}

        {subLinks && subLinks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {subLinks.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="text-[11px] tracking-wide px-3 py-1.5 rounded-full border border-[var(--color-border)] text-ink/70 hover:text-ink hover:border-ink/30 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA direita */}
      <div className="flex items-center gap-4 pt-2">
        {bloqueado ? (
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-ink/35">
            <Lock size={12} /> Em breve
          </span>
        ) : (
          <Link
            to={to}
            aria-label={`Acessar ${titulo}`}
            className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center text-ink/70 hover:bg-ink hover:text-cream hover:border-ink transition-all"
          >
            <ArrowUpRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>

      {bloqueado && bloqueadoMsg && (
        <p className="col-start-2 text-xs text-ink/40 -mt-4">{bloqueadoMsg}</p>
      )}
    </div>
  );
}

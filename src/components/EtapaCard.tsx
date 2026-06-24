import { Link } from "@/lib/router-compat";
import type { ReactNode } from "react";
import { ArrowRight, Check, Lock } from "lucide-react";

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
    <div className="group relative bg-white rounded-2xl border border-[var(--color-border)] shadow-[0_1px_2px_rgba(60,40,20,0.04)] hover:shadow-[0_8px_24px_-12px_rgba(60,40,20,0.12)] hover:border-terracotta/30 transition-all px-6 md:px-8 py-6 md:py-7">
      <div className="grid grid-cols-[3.5rem_1fr_auto] md:grid-cols-[4rem_1fr_auto] items-start gap-5 md:gap-8">
        {/* Ícone */}
        <div className="pt-1">
          <span className="inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white border border-[var(--color-border)] text-terracotta">
            {icon}
          </span>
        </div>

        {/* Conteúdo */}
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.25em] uppercase text-terracotta font-medium mb-1.5">
            {label}
          </p>
          <h3 className="font-display text-xl md:text-2xl tracking-tight text-ink leading-snug mb-2">
            {titulo}
          </h3>
          <p className="text-sm md:text-[15px] text-ink/55 leading-relaxed max-w-2xl">
            {descricao}
          </p>

          {concluido && (
            <p className="flex items-center gap-1.5 text-xs text-success mt-3">
              <Check size={13} /> Concluído
            </p>
          )}
        </div>

        {/* CTA direita */}
        <div className="pt-1">
          {bloqueado ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-ink/35 px-4 py-2.5 rounded-full border border-[var(--color-border)]">
              <Lock size={12} /> Em breve
            </span>
          ) : (
            <Link
              to={to}
              aria-label={`Acessar ${titulo}`}
              className="inline-flex items-center gap-2 bg-terracotta text-cream pl-5 pr-4 py-2.5 rounded-full text-sm font-medium hover:bg-terracotta/90 transition-all shadow-[0_2px_6px_-2px_rgba(180,90,40,0.4)]"
            >
              Acessar
              <ArrowRight size={15} strokeWidth={2.25} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>

      {/* SubLinks */}
      {subLinks && subLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5 ml-[4rem] md:ml-[4.75rem]">
          {subLinks.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="text-[12px] px-4 py-2 rounded-full bg-cream-warm/60 border border-[var(--color-border)] text-ink/75 hover:bg-white hover:text-ink hover:border-terracotta/40 transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </div>
      )}

      {bloqueado && bloqueadoMsg && (
        <p className="mt-3 ml-[4rem] md:ml-[4.75rem] text-xs text-ink/40">{bloqueadoMsg}</p>
      )}
    </div>
  );
}

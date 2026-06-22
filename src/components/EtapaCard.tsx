import { Link } from "react-router-dom";
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
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl border border-terracotta flex items-center justify-center text-terracotta flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs tracking-[0.15em] uppercase text-muted mb-1">{label}</p>
          <h3 className="font-serif text-xl text-ink mb-1.5">{titulo}</h3>
          <p className="text-sm text-muted leading-relaxed mb-3">{descricao}</p>

          {concluido && (
            <p className="flex items-center gap-1.5 text-sm text-success mb-2">
              <Check size={14} /> Concluído
            </p>
          )}

          {bloqueado ? (
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <Lock size={13} /> {bloqueadoMsg || "Será desbloqueado quando concluir os outros cards"}
            </p>
          ) : (
            <Link
              to={to}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink border border-border rounded-full px-4 py-2 hover:bg-cream transition-colors"
            >
              Acessar <ArrowRight size={14} />
            </Link>
          )}

          {subLinks && subLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {subLinks.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-ink hover:bg-cream"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

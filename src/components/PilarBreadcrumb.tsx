import { Link } from "@/lib/router-compat";
import { ArrowLeft, Menu } from "lucide-react";

export default function PilarBreadcrumb({
  pilar,
  pilarLabel,
  backTo,
  backLabel,
}: {
  pilar: 1 | 2;
  pilarLabel: string;
  backTo: string;
  backLabel: string;
}) {
  return (
    <div className="w-full">
      <div className="px-5 md:px-10 py-2.5 border-b border-border bg-cream flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-border bg-white text-ink">
          <Menu size={12} /> Pilar {pilar}
        </span>
        <span className="text-[11px] tracking-[0.18em] uppercase text-muted">{pilarLabel}</span>
      </div>

      <div className="px-5 md:px-10 py-4 max-w-2xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <Link to={backTo} className="flex items-center gap-1.5 text-sm text-ink hover:opacity-70">
          <ArrowLeft size={14} /> {backLabel}
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted tracking-[0.18em] uppercase">Ir para Pilar</span>
          <div className="inline-flex gap-1 rounded-full border border-border bg-white p-0.5">
            {[1, 2, 3, 4].map((n) => {
              const active = pilar === n;
              const enabled = n === 1 || n === 2;
              const cls = active
                ? "bg-ink text-cream"
                : enabled
                ? "text-ink"
                : "text-muted/60";
              return enabled && !active ? (
                <Link
                  key={n}
                  to={`/metodo/pilar-${n}`}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${cls}`}
                >
                  {n}
                </Link>
              ) : (
                <span
                  key={n}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${cls}`}
                >
                  {n}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

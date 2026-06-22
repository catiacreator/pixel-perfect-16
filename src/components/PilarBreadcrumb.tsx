import { Link } from "@/lib/router-compat";
import { ArrowLeft } from "lucide-react";

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
    <div className="px-5 md:px-10 py-3 border-b border-border bg-cream">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full border border-terracotta text-terracotta">
            Pilar {pilar}
          </span>
          <span className="text-xs tracking-[0.15em] text-muted uppercase">{pilarLabel}</span>
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link to={backTo} className="flex items-center gap-1.5 text-sm text-ink hover:opacity-70">
          <ArrowLeft size={14} /> {backLabel}
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted tracking-[0.15em] uppercase">Ir para pilar</span>
          <div className="flex gap-1">
            {[1, 2].map((n) => (
              <Link
                key={n}
                to={`/metodo/pilar-${n}`}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm border ${
                  pilar === n ? "bg-ink text-cream border-ink" : "border-border text-ink"
                }`}
              >
                {n}
              </Link>
            ))}
            {[3, 4].map((n) => (
              <span
                key={n}
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm border border-border text-muted opacity-50"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

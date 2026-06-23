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
    <div className="w-full border-b border-[var(--color-border)]">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-4 flex items-center justify-between flex-wrap gap-3">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-ink/55 hover:text-ink transition-colors"
        >
          <ArrowLeft size={13} strokeWidth={2} /> {backLabel}
        </Link>

        <div className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase">
          <span className="text-ink/40 hidden sm:inline">
            / Pilar {pilar} · {pilarLabel}
          </span>
          <div className="inline-flex gap-1.5">
            {[1, 2, 3, 4].map((n) => {
              const active = pilar === n;
              const enabled = n === 1 || n === 2;
              const base =
                "w-7 h-7 rounded-full flex items-center justify-center text-[12px] tracking-normal transition-colors";
              if (active) {
                return (
                  <span key={n} className={`${base} bg-ink text-cream`}>
                    {n}
                  </span>
                );
              }
              if (enabled) {
                return (
                  <Link
                    key={n}
                    to={`/metodo/pilar-${n}`}
                    className={`${base} border border-[var(--color-border)] text-ink/70 hover:border-ink/40 hover:text-ink`}
                  >
                    {n}
                  </Link>
                );
              }
              return (
                <span
                  key={n}
                  className={`${base} border border-[var(--color-border)] text-ink/25`}
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

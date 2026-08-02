import { Link } from "@/lib/router-compat";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import WizardJornada from "@/components/WizardJornada";
import WizardAutoridade from "@/components/WizardAutoridade";

export default function PilarBreadcrumb({
  pilar,
  pilarLabel,
  backTo,
  backLabel,
  historyBack = false,
}: {
  pilar: 1 | 2 | 3 | 4 | "academia" | "redes";
  pilarLabel: string;
  backTo: string;
  backLabel: string;
  /** true = volta à página anterior no histórico (em vez de ir para backTo).
   *  backTo fica como recurso, para quando se abre a página diretamente. */
  historyBack?: boolean;
}) {
  const router = useRouter();
  const voltar = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
    else router.navigate({ to: backTo });
  };

  const classesVoltar =
    "inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-ink/55 hover:text-ink transition-colors";

  return (
    <>
    <div className="w-full border-b border-[var(--color-border)]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-4 flex items-center justify-between flex-wrap gap-3">
        {historyBack ? (
          <button onClick={voltar} className={classesVoltar}>
            <ArrowLeft size={13} strokeWidth={2} /> {backLabel}
          </button>
        ) : (
          <Link to={backTo} className={classesVoltar}>
            <ArrowLeft size={13} strokeWidth={2} /> {backLabel}
          </Link>
        )}

        {typeof pilar === "number" && (
        <div className="flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase">
          <span className="text-ink/45 font-medium hidden sm:inline">
            Ir para pilar
          </span>
          <div className="inline-flex items-center gap-1 bg-white border border-[var(--color-border)] rounded-full p-1">
            {[1, 2, 3, 4].map((n) => {
              const active = pilar === n;
              const enabled = n === 1 || n === 2 || n === 4;
              const base =
                "w-7 h-7 rounded-full flex items-center justify-center text-[12px] tracking-normal font-medium transition-colors";
              if (active) {
                return (
                  <span key={n} className={`${base} bg-terracotta text-cream shadow-sm`}>
                    {n}
                  </span>
                );
              }
              if (enabled) {
                return (
                  <Link
                    key={n}
                    to={`/metodo/pilar-${n}`}
                    className={`${base} text-ink/60 hover:bg-cream hover:text-ink`}
                  >
                    {n}
                  </Link>
                );
              }
              return (
                <span key={n} className={`${base} text-ink/25`}>
                  {n}
                </span>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </div>
    <WizardJornada />
    <WizardAutoridade />
    </>
  );
}

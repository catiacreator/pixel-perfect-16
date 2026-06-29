import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import { Trophy, Check, ArrowRight } from "lucide-react";
import { CHECKLIST_PILAR3 } from "@/data/pilar3";

const KEY = "leveza.pilar3.checklist.v1";

export default function ConclusaoPilar3() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      setDone(new Set(Array.isArray(raw) ? raw : []));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  const toggle = (i: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      localStorage.setItem(KEY, JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <Layout>
      <PilarBreadcrumb pilar={3} pilarLabel="Criar Soluções Digitais" backTo="/metodo/pilar-3" backLabel="Voltar para o Pilar 3" />
      <PillarHeader
        numeral="06"
        icon={<Trophy size={18} />}
        pilarLabel="Etapa 6 · Conclusão"
        titulo="Revise e celebre"
        subtitulo="Veja tudo o que construiu neste pilar e marque o que já está feito."
      />

      <div className="max-w-[900px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <div className="rounded-2xl border border-border bg-white p-5 md:p-6 mb-6">
          <p className="text-lg font-semibold tracking-tight text-ink mb-4">
            {hydrated ? done.size : 0} de {CHECKLIST_PILAR3.length} concluídos
          </p>
          <ul className="space-y-2">
            {CHECKLIST_PILAR3.map((item, i) => {
              const isDone = done.has(i);
              return (
                <li key={i} className="flex items-center gap-3">
                  <button
                    onClick={() => toggle(i)}
                    aria-label="Marcar"
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isDone ? "bg-success border-success text-white" : "border-border"}`}
                  >
                    {isDone && <Check size={12} strokeWidth={3} />}
                  </button>
                  <span className={`flex-1 text-sm ${isDone ? "text-muted line-through" : "text-ink"}`}>{item.label}</span>
                  <Link to={item.to} className="text-xs font-semibold text-terracotta inline-flex items-center gap-1 shrink-0">
                    Abrir <ArrowRight size={12} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-[28px] bg-gradient-to-br from-ink to-terracotta-dark p-8 md:p-10 text-center">
          <Trophy size={28} className="text-gold mx-auto mb-3" />
          <h3 className="font-display text-2xl md:text-3xl text-cream mb-2">Solução criada!</h3>
          <p className="text-cream/70 text-sm max-w-md mx-auto mb-6">Agora é hora de vender. Avance para o Pilar 4 — Aprender a Vender.</p>
          <Link to="/metodo/pilar-4" className="inline-flex items-center gap-2 bg-cream text-ink px-6 py-3 rounded-full text-sm font-semibold">
            Ir para o Pilar 4 <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

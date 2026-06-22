import { useState } from "react";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import { Download, Check } from "lucide-react";
import { SKILLS_GERAIS, SKILLS_NICHO } from "../../lib/skills";

export default function InstalarSkills() {
  const [instaladas, setInstaladas] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setInstaladas((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <Layout>
      <PilarBreadcrumb pilar={1} pilarLabel="Recuperar seu Tempo" backTo="/metodo/pilar-1/aprenda-ia/claude" backLabel="Voltar para Claude" />
      <div className="px-5 md:px-10 py-10 max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Aula 1.5 · Claude</p>
        <h1 className="font-serif text-3xl text-ink mb-3">Instalando Skills no seu Claude</h1>
        <p className="text-muted mb-8">
          As 15 Skills gerais da Mentoria + as 6 Skills de mercado por nicho. Cada skill é um ficheiro .md instalado
          no Project Knowledge do Claude.
        </p>

        <h2 className="font-serif text-xl text-ink mb-1">15 Skills gerais</h2>
        <p className="text-xs text-muted mb-4">{instaladas.size}/15 instaladas</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {SKILLS_GERAIS.map((s) => {
            const done = instaladas.has(s.id);
            return (
              <div key={s.id} className="rounded-xl border border-border bg-white p-4 flex flex-col gap-2">
                <span className="text-2xl">{s.emoji}</span>
                <p className="text-sm font-semibold text-ink">{s.nome}</p>
                <p className="text-xs text-muted flex-1">{s.descricao}</p>
                <button
                  onClick={() => toggle(s.id)}
                  className={`text-xs font-semibold rounded-full py-2 flex items-center justify-center gap-1.5 ${
                    done ? "border border-success text-success" : "bg-ink text-cream"
                  }`}
                >
                  {done ? <Check size={13} /> : <Download size={13} />}
                  {done ? "Instalada" : "Baixar .md"}
                </button>
              </div>
            );
          })}
        </div>

        <h2 className="font-serif text-xl text-ink mb-1">6 Skills de mercado</h2>
        <p className="text-sm text-muted mb-4">Escolhe a tua área — depois é só pedir para instalar.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SKILLS_NICHO.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-white p-4 flex flex-col items-center text-center gap-2">
              <span className="text-2xl">{s.emoji}</span>
              <p className="text-sm font-semibold text-ink">{s.nome}</p>
              <p className="text-xs text-muted">{s.descricao}</p>
              <button className="text-xs font-semibold rounded-full px-3 py-1.5 border border-border w-full">
                Ver skill e instalar
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

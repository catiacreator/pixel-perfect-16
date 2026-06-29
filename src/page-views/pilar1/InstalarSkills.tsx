import { useState } from "react";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
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
      <PilarBreadcrumb pilar="academia" pilarLabel="Academia de IA" backTo="/metodo/pilar-1/aprenda-ia/claude" backLabel="Voltar para Claude" />
      <PillarHeader
        numeral="IA"
        icon={null}
        pilarLabel="Aula 1.5 · Claude"
        titulo="Instalando Skills no seu Claude"
        subtitulo="As 15 Skills gerais da Mentoria + as 6 Skills de mercado por nicho. Cada skill é um ficheiro .md instalado no Project Knowledge do Claude."
      />
      <div className="px-5 md:px-10 pt-8 pb-10 max-w-5xl mx-auto">
        <h2 className="font-serif text-xl text-ink mb-1">15 Skills gerais</h2>
        <p className="text-xs text-muted mb-4">{instaladas.size}/15 instaladas</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {SKILLS_GERAIS.map((s) => {
            const done = instaladas.has(s.id);
            const baseCls = `text-xs font-semibold rounded-full py-2 flex items-center justify-center gap-1.5 ${
              done ? "border border-success text-success" : s.file ? "bg-terracotta text-cream" : "bg-terracotta/40 text-cream/80 cursor-not-allowed"
            }`;
            return (
              <div key={s.id} className="rounded-xl border border-border bg-white p-4 flex flex-col gap-2">
                <span className="text-2xl">{s.emoji}</span>
                <p className="text-sm font-semibold text-ink">{s.nome}</p>
                <p className="text-xs text-muted flex-1">{s.descricao}</p>
                {s.file ? (
                  <a
                    href={s.file}
                    download
                    onClick={() => toggle(s.id)}
                    className={baseCls}
                  >
                    {done ? <Check size={13} /> : <Download size={13} />}
                    {done ? "Instalada" : "Baixar .md"}
                  </a>
                ) : (
                  <button disabled className={baseCls}>
                    <Download size={13} /> Em breve
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <h2 className="font-serif text-xl text-ink mb-1">6 Skills de mercado</h2>
        <p className="text-sm text-muted mb-4">Escolha a sua área — depois é só pedir para instalar.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SKILLS_NICHO.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-white p-4 flex flex-col items-center text-center gap-2">
              <span className="text-2xl">{s.emoji}</span>
              <p className="text-sm font-semibold text-ink">{s.nome}</p>
              <p className="text-xs text-muted">{s.descricao}</p>
              {s.file ? (
                <a
                  href={s.file}
                  download
                  className="text-xs font-semibold rounded-full px-3 py-1.5 bg-terracotta text-cream w-full flex items-center justify-center gap-1.5"
                >
                  <Download size={13} /> Baixar .md
                </a>
              ) : (
                <button disabled className="text-xs font-semibold rounded-full px-3 py-1.5 border border-border w-full opacity-60 cursor-not-allowed">
                  Em breve
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

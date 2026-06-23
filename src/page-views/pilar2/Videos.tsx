import { useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import ProgressBar from "../../components/ProgressBar";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import TodoBanner from "../../components/TodoBanner";
import { ChevronDown, PlayCircle, ArrowLeft } from "lucide-react";

const MODULOS = [
  { titulo: "Módulo 1: Estratégia de Clones", aulas: [
    { n: "1.1", t: "Estratégia de Clones" }, { n: "1.2", t: "Foto em Vídeo" }, { n: "1.4", t: "Clone em Vídeo" },
    { n: "1.5", t: "HeyGen Avançado" }, { n: "1.6", t: "Outras Línguas" }, { n: "1.7", t: "Mais Natural" },
    { n: "1.8", t: "Bônus — Ana Tex com HeyGen" },
  ]},
  { titulo: "Módulo 2: Kling — Clones, efeitos e movimento", aulas: [
    { n: "3.1", t: "Kling no Celular" }, { n: "3.2", t: "Motion Control" }, { n: "3.3", t: "Vídeos com Famosos" },
  ]},
  { titulo: "Módulo 3: Hedra — Sincronização Labial", aulas: [
    { n: "4.1", t: "Sincronização Labial de Clone com Hedra" },
  ]},
  { titulo: "Módulo 4: Personagens Falantes Educativos", aulas: [
    { n: "5.1", t: "Gerador de Objetos Falantes Educativos" },
  ]},
  { titulo: "Módulo 5: Flow e Seedance", aulas: [
    { n: "5.1", t: "Usando Flow e Seedance" },
  ]},
  { titulo: "Módulo 6: Edições no CapCut", aulas: [
    { n: "6.0", t: "Introdução ao CapCut" }, { n: "6.1", t: "Vídeos Reação Infográfico" },
    { n: "6.2", t: "Fazendo Personagem Falar" }, { n: "6.3", t: "IA pra Criar Vídeos de Histórias no CapCut" },
  ]},
];

export default function Videos() {
  const [abertos, setAbertos] = useState<Set<number>>(new Set([0]));
  const [aulaAberta, setAulaAberta] = useState<string | null>(null);
  const total = MODULOS.reduce((acc, m) => acc + m.aulas.length, 0);

  const toggleModulo = (i: number) =>
    setAbertos((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2" backLabel="Voltar para o Pilar 2" />
      <TodoBanner texto="Etapa 5 — Vídeos: conteúdo pendente. Aguardando documentação detalhada (estrutura definitiva das aulas, prompts e fluxo)." />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Vídeos profissionais sem gravar 50 vezes</h1>
        <p className="text-muted mb-6">
          Clones falantes, personagens animados e vídeos com IA — aulas práticas com HeyGen, Kling, Hedra e mais.
        </p>

        <div className="rounded-2xl border border-border bg-white p-4 mb-6">
          <ProgressBar done={0} total={total} />
        </div>

        {MODULOS.map((m, mi) => (
          <div key={m.titulo} className="rounded-2xl border border-border bg-white mb-3 overflow-hidden">
            <button onClick={() => toggleModulo(mi)} className="w-full flex items-center justify-between px-5 py-4">
              <div className="text-left">
                <p className="font-serif text-lg text-ink">{m.titulo}</p>
                <p className="text-xs text-muted">0/{m.aulas.length} aulas concluídas</p>
              </div>
              <ChevronDown size={16} className={`text-muted transition-transform ${abertos.has(mi) ? "rotate-180" : ""}`} />
            </button>
            {abertos.has(mi) && (
              <div className="divide-y divide-border border-t border-border">
                {m.aulas.map((a) => {
                  const key = `${mi}-${a.n}`;
                  return (
                    <div key={key}>
                      <button
                        onClick={() => setAulaAberta(aulaAberta === key ? null : key)}
                        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-cream text-left"
                      >
                        <PlayCircle size={15} className="text-terracotta flex-shrink-0" />
                        <span className="flex-1">
                          <span className="text-xs text-muted block">Aula {a.n}</span>
                          <span className="text-sm text-ink">{a.t}</span>
                        </span>
                      </button>
                      {aulaAberta === key && (
                        <div className="px-5 pb-5"><VideoPlaceholder /></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        <Link to="/metodo/pilar-2" className="flex items-center gap-1.5 text-sm text-muted mt-4">
          <ArrowLeft size={14} /> Voltar para o Pilar 2
        </Link>
      </div>
    </Layout>
  );
}

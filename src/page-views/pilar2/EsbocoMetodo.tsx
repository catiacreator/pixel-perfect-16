import { useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import SaveBar from "../../components/SaveBar";
import MetodoChat from "../../components/MetodoChat";
import { Sparkles, ArrowRight, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { usePilar2 } from "@/lib/pilar2-hooks";
import type { ParDorVitoria } from "@/lib/pilar2-storage";

const INTENSIDADES: Array<ParDorVitoria["intensidade"]> = ["Alta", "Moderada", "Baixa"];

export default function EsbocoMetodo() {
  const { state, update } = usePilar2();
  const [tab, setTab] = useState<"pares" | "metodo">("pares");
  const [chatOpen, setChatOpen] = useState(false);

  const setPar = (i: number, patch: Partial<ParDorVitoria>) =>
    update((prev) => ({
      ...prev,
      pares: prev.pares.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    }));

  const moverPar = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= state.pares.length) return;
    update((prev) => {
      const np = [...prev.pares];
      [np[i], np[j]] = [np[j], np[i]];
      return { ...prev, pares: np };
    });
  };

  // Pré-carrega as 5 dores do Doc Mestre / Etapa 1 nos cards vazios
  const doresFallback = state.doresTop5;
  const pares = state.pares.map((p, i) => ({
    ...p,
    dor: p.dor || doresFallback[i] || "",
  }));

  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2" backLabel="Voltar para o Pilar 2" />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">
          Etapa 2 · Estratégia
        </p>
        <h1 className="font-serif text-3xl text-ink mb-2">Definindo Seu Método</h1>
        <p className="italic text-muted mb-8">
          Da dor à vitória: a IA transforma as dores do público no seu método.
        </p>

        {/* PASSO 1 */}
        <p className="text-xs tracking-[0.15em] uppercase text-muted mb-2">Passo 1</p>
        <h2 className="font-serif text-xl text-ink mb-2">
          Criar o método com Inteligência Artificial
        </h2>
        <div className="rounded-2xl border border-dashed border-border bg-white p-5 mb-10">
          <p className="text-sm text-muted mb-3">
            A Inteligência Artificial vai confirmar as 5 dores do seu público, perguntar qual vitória
            você entrega para cada uma, e montar seu método com nome, pilares e promessa.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {(state.doresTop5.filter(Boolean).length
              ? state.doresTop5.filter(Boolean)
              : ["Eu não sei usar Inteligência Artificial…"]
            ).map((d, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-cream truncate max-w-[260px]"
                title={d}
              >
                {d}
              </span>
            ))}
          </div>
          <button
            onClick={() => setChatOpen(true)}
            className="text-sm font-semibold rounded-full bg-ink text-cream px-5 py-2.5 inline-flex items-center gap-2"
          >
            <Sparkles size={14} /> Criar meu método com Inteligência Artificial
          </button>
        </div>

        {/* PASSO 2 */}
        <p className="text-xs tracking-[0.15em] uppercase text-muted mb-2">Passo 2</p>
        <h2 className="font-serif text-xl text-ink mb-4">Revisar e Editar</h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("pares")}
            className={`text-sm px-4 py-1.5 rounded-full border ${
              tab === "pares" ? "bg-ink text-cream border-ink" : "border-border"
            }`}
          >
            Ponto A → Vitória
          </button>
          <button
            onClick={() => setTab("metodo")}
            className={`text-sm px-4 py-1.5 rounded-full border ${
              tab === "metodo" ? "bg-ink text-cream border-ink" : "border-border"
            }`}
          >
            Meu Método
          </button>
        </div>

        {tab === "pares" ? (
          <div className="space-y-4 mb-8">
            {pares.map((p, i) => (
              <div key={i} className="rounded-2xl border border-border bg-white p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs tracking-[0.1em] uppercase text-terracotta">
                    Ponto A · Dor {i + 1}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moverPar(i, -1)}
                      className="p-1 rounded-full border border-border text-muted disabled:opacity-30"
                      disabled={i === 0}
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={() => moverPar(i, 1)}
                      className="p-1 rounded-full border border-border text-muted disabled:opacity-30"
                      disabled={i === state.pares.length - 1}
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>
                </div>
                <textarea
                  value={p.dor}
                  onChange={(e) => setPar(i, { dor: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta mb-3 resize-none"
                />
                <div className="flex gap-2 mb-3 items-center">
                  <span className="text-[10px] tracking-[0.1em] uppercase text-muted">
                    Intensidade
                  </span>
                  {INTENSIDADES.map((n) => (
                    <button
                      key={n}
                      onClick={() => setPar(i, { intensidade: n })}
                      className={`text-xs px-3 py-1 rounded-full border ${
                        p.intensidade === n
                          ? "bg-terracotta text-cream border-terracotta"
                          : "border-border text-ink"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-xs tracking-[0.1em] uppercase text-success mb-2">
                  Ponto B · Vitória
                </p>
                <textarea
                  value={p.vitoria}
                  onChange={(e) => setPar(i, { vitoria: e.target.value })}
                  rows={2}
                  placeholder="O resultado concreto que ela conquista com você"
                  className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta resize-none"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-white p-5 mb-8 space-y-4">
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-muted block mb-1.5">
                Nome do método
              </label>
              <input
                value={state.nomeMetodo}
                onChange={(e) => update({ nomeMetodo: e.target.value })}
                placeholder="Ex: Método Paraíso Digital"
                className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta"
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.1em] uppercase text-muted block mb-1.5">
                Promessa
              </label>
              <textarea
                value={state.promessa}
                onChange={(e) => update({ promessa: e.target.value })}
                rows={3}
                placeholder="Em 1 frase: o que você entrega, para quem, sem o quê."
                className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta resize-none"
              />
            </div>
          </div>
        )}

        <SaveBar
          onSave={() => {}}
          label="Salvar esboço"
          extra={
            <Link
              to="/doc-mestre"
              className="text-sm px-4 py-2 rounded-full border border-border flex items-center gap-1.5"
            >
              <FileText size={14} /> Revisar Doc Mestre
            </Link>
          }
        />

        <div className="rounded-2xl border border-terracotta bg-white p-5 text-center mt-8">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próximo passo</p>
          <p className="font-serif text-lg text-ink mb-3">Identidade de marca</p>
          <Link
            to="/metodo/pilar-2/identidade"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
          >
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
      <MetodoChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </Layout>
  );
}

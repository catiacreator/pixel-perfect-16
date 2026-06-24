import { useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import SaveBar from "../../components/SaveBar";
import MetodoChat from "../../components/MetodoChat";
import { Sparkles, ArrowRight, FileText, Hourglass, PlayCircle, Check, Circle, Wand2 } from "lucide-react";
import { useAulaProgress } from "@/lib/use-aula-progress";
import { usePilar2 } from "@/lib/pilar2-hooks";
import type { ParDorVitoria } from "@/lib/pilar2-storage";

const INTENSIDADES: Array<{ id: ParDorVitoria["intensidade"]; dot: string }> = [
  { id: "Alta", dot: "bg-rose-500" },
  { id: "Moderada", dot: "bg-amber-500" },
  { id: "Baixa", dot: "bg-emerald-500" },
];

const AULA_TOOL = "pilar-2";
const AULA_ID = "definindo-metodo";

export default function EsbocoMetodo() {
  const { state, update } = usePilar2();
  const [tab, setTab] = useState<"pares" | "metodo">("pares");
  const [chatOpen, setChatOpen] = useState(false);
  const { isDone, toggle } = useAulaProgress();
  const concluida = isDone(AULA_TOOL, AULA_ID);

  const setPar = (i: number, patch: Partial<ParDorVitoria>) =>
    update((prev) => ({
      ...prev,
      pares: prev.pares.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    }));

  const doresFallback = state.doresTop5;
  const pares = state.pares.map((p, i) => ({
    ...p,
    dor: p.dor || doresFallback[i] || "",
  }));
  const vitoriasFeitas = pares.filter((p) => p.vitoria.trim().length > 0).length;

  return (
    <Layout>
      <PilarBreadcrumb
        pilar={2}
        pilarLabel="Criar Autoridade"
        backTo="/metodo/pilar-2"
        backLabel="Voltar para o Pilar 2"
      />

      {/* Hero do pilar */}
      <header className="bg-cream-warm/60 border-b border-[var(--color-border)]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-10 md:py-14 grid grid-cols-[auto_1fr] gap-5 md:gap-8 items-start">
          <div className="flex flex-col items-center gap-3">
            <span className="font-serif text-5xl md:text-6xl text-terracotta leading-none">2</span>
            <div className="w-12 h-12 rounded-2xl border border-[var(--color-border)] bg-white flex items-center justify-center text-ink/70">
              <Hourglass size={18} strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-terracotta mb-2">Pilar 2</p>
            <h1 className="font-serif text-3xl md:text-5xl text-ink tracking-tight">
              Definindo Seu Método
            </h1>
            <p className="italic text-ink/60 mt-3 max-w-2xl">
              Da dor à vitória: a IA transforma as dores do público no seu método.
            </p>
            <div className="flex items-center gap-3 mt-5 text-terracotta/70">
              <span className="h-px w-16 bg-terracotta/40" />
              <Sparkles size={12} />
              <span className="h-px w-16 bg-terracotta/40" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-10">
        {/* Vídeo da aula */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-ink/90 to-ink aspect-video flex items-center justify-center mb-5">
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-cream">
            <div>
              <p className="font-semibold text-base md:text-lg">Estruturando seu método com IA 🚀</p>
              <p className="text-xs text-cream/70 mt-1">Ana Tex</p>
            </div>
          </div>
          <button className="w-14 h-14 rounded-full bg-white/95 text-ink flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <PlayCircle size={28} strokeWidth={1.5} />
          </button>
        </div>

        {/* Aula concluída */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => toggle(AULA_TOOL, AULA_ID)}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
              concluida
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-white text-ink border-border hover:border-terracotta"
            }`}
          >
            {concluida ? <Check size={15} /> : <Circle size={15} />}
            {concluida ? "Aula concluída" : "Marcar como concluída"}
          </button>
        </div>

        {/* PASSO 1 */}
        <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-2">Passo 1</p>
        <h2 className="font-serif text-2xl text-ink mb-2">
          Criar o método com Inteligência Artificial
        </h2>
        <p className="text-sm text-ink/60 mb-4">
          Confirme as dores, defina 1 vitória para cada uma e deixe a IA montar o seu método.
        </p>

        <div className="rounded-2xl border border-dashed border-terracotta/40 bg-cream-warm/40 p-5 md:p-6 mb-12">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-terracotta/15 flex items-center justify-center text-terracotta shrink-0">
              <Wand2 size={16} />
            </div>
            <div>
              <p className="font-serif text-lg text-ink">Criar meu método com Inteligência Artificial</p>
              <p className="text-sm text-ink/60 mt-1">
                A IA vai confirmar as 5 dores do seu público, perguntar qual vitória você entrega
                para cada uma, e montar seu método com nome, pilares e promessa.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4 ml-13">
            {(state.doresTop5.filter(Boolean).length
              ? state.doresTop5.filter(Boolean)
              : ["Eu não sei usar Inteligência Artificial…"]
            ).map((d, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-white truncate max-w-[280px]"
                title={d}
              >
                {d}
              </span>
            ))}
          </div>
          <button
            onClick={() => setChatOpen(true)}
            className="text-sm font-semibold rounded-full bg-terracotta text-cream px-5 py-2.5 inline-flex items-center gap-2 hover:bg-terracotta-dark transition-colors"
          >
            <Wand2 size={14} /> Criar meu método
          </button>
        </div>

        {/* PASSO 2 */}
        <div className="text-center mb-6">
          <p className="text-[11px] tracking-[0.25em] uppercase text-ink/50">
            Passo 2 — Revisar e Editar
          </p>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab("pares")}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              tab === "pares"
                ? "bg-terracotta text-cream border-terracotta"
                : "bg-white border-border text-ink"
            }`}
          >
            Ponto A → Vitória
          </button>
          <button
            onClick={() => setTab("metodo")}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              tab === "metodo"
                ? "bg-terracotta text-cream border-terracotta"
                : "bg-white border-border text-ink"
            }`}
          >
            Meu Método
          </button>
        </div>

        {tab === "pares" ? (
          <>
            {/* Card de revisão */}
            <div className="rounded-2xl border border-border bg-white p-5 md:p-6 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-terracotta" />
                <p className="font-serif text-lg text-ink">Revisão: Ponto A → Vitória</p>
              </div>
              <p className="text-sm text-ink/65 leading-relaxed">
                Aqui ficam os pares preenchidos pela IA. Você pode <strong className="text-ink">editar</strong>{" "}
                qualquer dor ou vitória e marcar a <strong className="text-ink">intensidade</strong>. Tudo é
                salvo no Documento Mestre.
              </p>
              <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-terracotta/10 text-terracotta">
                {vitoriasFeitas} de {pares.length} vitórias preenchidas
              </span>
            </div>

            <div className="space-y-4 mb-8">
              {pares.map((p, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-white overflow-hidden grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]"
                >
                  {/* Ponto A · Dor */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="w-7 h-7 rounded-full bg-terracotta text-cream text-xs font-semibold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta">
                          Ponto A · Dor
                        </p>
                        <p className="text-xs text-ink/55 mt-0.5">O que a pessoa sente hoje</p>
                      </div>
                    </div>
                    <textarea
                      value={p.dor}
                      onChange={(e) => setPar(i, { dor: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-border bg-cream-warm/30 p-3 text-sm font-serif italic outline-none focus:border-terracotta resize-none mb-4"
                    />
                    <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-2">
                      Intensidade da dor
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {INTENSIDADES.map((n) => {
                        const active = p.intensidade === n.id;
                        return (
                          <button
                            key={n.id}
                            onClick={() => setPar(i, { intensidade: n.id })}
                            className={`text-xs px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5 transition-colors ${
                              active
                                ? "bg-ink/5 border-ink/30 text-ink"
                                : "bg-white border-border text-ink/70"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${n.dot}`} />
                            {n.id}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ponto B · Vitória */}
                  <div className="p-5 bg-cream-warm/20">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-emerald-700">
                      Ponto B · Vitória
                    </p>
                    <p className="text-xs text-ink/55 mt-0.5 mb-2">
                      O resultado concreto que ela conquista com você
                    </p>
                    <textarea
                      value={p.vitoria}
                      onChange={(e) => setPar(i, { vitoria: e.target.value })}
                      rows={6}
                      placeholder="Descreva a vitória que você entrega…"
                      className="w-full rounded-xl border border-border bg-white p-3 text-sm outline-none focus:border-terracotta resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
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

        <div className="flex items-center justify-between flex-wrap gap-3 mb-10">
          <Link
            to="/metodo/pilar-2"
            className="text-sm px-4 py-2 rounded-full border border-border bg-white inline-flex items-center gap-1.5"
          >
            ← Voltar
          </Link>
          <SaveBar
            onSave={() => {}}
            label="Salvar esboço"
            extra={
              <Link
                to="/doc-mestre"
                className="text-sm px-4 py-2 rounded-full border border-border bg-white flex items-center gap-1.5"
              >
                <FileText size={14} /> Revisar Doc Mestre
              </Link>
            }
          />
        </div>

        <div className="rounded-2xl border border-terracotta/40 bg-cream-warm/50 p-6 text-center">
          <Sparkles size={18} className="text-terracotta mx-auto mb-2" />
          <p className="font-serif text-lg text-ink">Próximo passo: Identidade de marca</p>
          <p className="text-sm text-ink/60 mt-1 mb-4">
            Defina os arquétipos da sua marca e do seu cliente.
          </p>
          <Link
            to="/metodo/pilar-2/identidade"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors"
          >
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
      <MetodoChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </Layout>
  );
}

import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import SaveBar from "../../components/SaveBar";
import { ArrowRight, ExternalLink, Check } from "lucide-react";
import { usePilar2 } from "@/lib/pilar2-hooks";

export default function PesquisaMercado() {
  const { state, update } = usePilar2();

  const toggleConcluido = (campo: "passo1Concluido" | "passo2Concluido") =>
    update({ [campo]: !state[campo] } as any);

  const setDor = (i: number, v: string) =>
    update((prev) => ({
      ...prev,
      doresTop5: prev.doresTop5.map((d, idx) => (idx === i ? v : d)),
    }));

  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2" backLabel="Voltar para o Pilar 2" />
      <PillarHeader
        numeral="✦"
        icon={null}
        pilarLabel="Etapa 1 · Público"
        titulo="Pesquisa de Mercado · Pesquisa de Dores do Público"
        subtitulo="Descubra o que seu público realmente quer e onde dói."
      />
      <div className="px-5 md:px-10 pt-8 pb-10 max-w-4xl mx-auto">

        {/* PASSO 1 */}
        <p className="text-xs tracking-[0.15em] uppercase text-muted mb-2">Passo 1</p>
        <h2 className="font-serif text-xl text-ink mb-2">
          Pesquisa de Dores do Público com NotebookLM
        </h2>
        <p className="text-sm text-muted mb-4">
          Use o NotebookLM para mapear dores, desejos e linguagem do seu público de forma inteligente.
        </p>
        <div className="mb-4">
          <VideoPlaceholder label="Pesquisa de Dores do Público com NotebookLM" />
        </div>
        <div className="flex flex-wrap gap-2 mb-10">
          <a
            href="https://notebooklm.google.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-ink text-cream"
          >
            Abrir NotebookLM <ExternalLink size={13} />
          </a>
          <button
            onClick={() => toggleConcluido("passo1Concluido")}
            className={`text-sm font-semibold px-4 py-2 rounded-full border flex items-center gap-1.5 ${
              state.passo1Concluido
                ? "border-success text-success bg-success/10"
                : "border-border text-ink"
            }`}
          >
            {state.passo1Concluido && <Check size={13} />}
            {state.passo1Concluido ? "Concluído" : "Marcar como concluído"}
          </button>
        </div>

        {/* PASSO 2 */}
        <p className="text-xs tracking-[0.15em] uppercase text-muted mb-2">Passo 2</p>
        <h2 className="font-serif text-xl text-ink mb-2">Caixinha de Dores do Público</h2>
        <p className="text-sm text-muted mb-4">
          As 5 maiores dores do seu público. Depois da pesquisa do NotebookLM, verifique se são
          essas as cinco dores mais fortes.
        </p>
        <div className="mb-4">
          <VideoPlaceholder label="Caixinha de Dores do Público" />
        </div>
        <button
          onClick={() => toggleConcluido("passo2Concluido")}
          className={`text-sm font-semibold px-4 py-2 rounded-full border flex items-center gap-1.5 mb-5 ${
            state.passo2Concluido
              ? "border-success text-success bg-success/10"
              : "border-border text-ink"
          }`}
        >
          {state.passo2Concluido && <Check size={13} />}
          {state.passo2Concluido ? "Concluído" : "Marcar como concluído"}
        </button>

        <div className="rounded-2xl border border-border bg-white p-5 mb-6">
          <p className="font-serif text-lg text-ink mb-3">As 5 maiores dores do seu público</p>
          {state.doresTop5.map((d, i) => (
            <div key={i} className="flex gap-2 items-start mb-2">
              <span className="text-xs font-semibold text-terracotta mt-3 w-4">{i + 1}.</span>
              <textarea
                value={d}
                onChange={(e) => setDor(i, e.target.value)}
                rows={1}
                placeholder={`Dor ${i + 1}`}
                className="flex-1 rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta resize-none"
              />
            </div>
          ))}
          <SaveBar onSave={() => {/* já é salvo on-change via update */}} label="Salvar" />
        </div>

        <div className="rounded-2xl border border-terracotta bg-white p-5 text-center">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próxima aula</p>
          <p className="font-serif text-lg text-ink mb-3">Definindo Seu Método</p>
          <Link
            to="/metodo/pilar-2/metodo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
          >
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

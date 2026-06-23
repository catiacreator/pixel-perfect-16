import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PromptCard from "../../components/PromptCard";
import SaveBar from "../../components/SaveBar";
import { ArrowRight, Wand2, Printer } from "lucide-react";
import { usePilar2 } from "@/lib/pilar2-hooks";
import { PROMPT_TOM_DE_VOZ } from "@/data/prompts/pilar2-tom-visual";
import { parseTomDeVoz } from "@/lib/pilar2-parsers";

function Area({
  value,
  onChange,
  label,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="mb-4">
      <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5 block">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-terracotta resize-none"
      />
    </div>
  );
}

export default function TomDeVoz() {
  const { state, update } = usePilar2();

  const parsearCola = () => {
    if (!state.tomDeVozCola.trim()) return;
    const r = parseTomDeVoz(state.tomDeVozCola);
    update({
      tomDeVoz: r.tomDeVoz || state.tomDeVoz,
      crencaCentral: r.crencaCentral || state.crencaCentral,
      opinioesPolemicas: r.opinioesPolemicas || state.opinioesPolemicas,
      cases: r.cases || state.cases,
    });
  };

  return (
    <Layout>
      <PilarBreadcrumb
        pilar={2}
        pilarLabel="Criar Autoridade"
        backTo="/metodo/pilar-2/identidade"
        backLabel="Voltar para Identidade de Marca"
      />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">
          Etapa 3.2 · Tom de Voz
        </p>
        <h1 className="font-serif text-3xl text-ink mb-2">Tom de Voz da Marca</h1>
        <p className="italic text-muted mb-8">
          Usa seus arquétipos, palavras a usar/evitar e ajustes da ponte para entregar 4 campos prontos.
        </p>

        <PromptCard
          numero={4}
          titulo="Tom de voz da marca"
          descricao="Os 4 campos abaixo são extraídos automaticamente do resultado do ChatGPT."
          prompt={PROMPT_TOM_DE_VOZ}
        />

        <div className="rounded-2xl border border-border bg-white p-5 mb-6">
          <Area
            label="Cole o resultado do ChatGPT"
            value={state.tomDeVozCola}
            onChange={(v) => update({ tomDeVozCola: v })}
            rows={6}
            placeholder="Cole aqui o resultado dos 4 campos…"
          />
          <button
            onClick={parsearCola}
            className="text-xs font-semibold text-terracotta flex items-center gap-1.5"
          >
            <Wand2 size={13} /> Preencher campos automaticamente
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 mb-6 space-y-1">
          <Area
            label="Tom de voz (regras de escrita)"
            value={state.tomDeVoz}
            onChange={(v) => update({ tomDeVoz: v })}
            rows={6}
          />
          <Area
            label="Crença central"
            value={state.crencaCentral}
            onChange={(v) => update({ crencaCentral: v })}
            rows={2}
          />
          <Area
            label="Opiniões polêmicas"
            value={state.opinioesPolemicas}
            onChange={(v) => update({ opinioesPolemicas: v })}
            placeholder="Coisas que você defende mesmo que incomodem — uma por linha"
            rows={4}
          />
          <Area
            label="3 estudos de caso"
            value={state.cases}
            onChange={(v) => update({ cases: v })}
            placeholder="Casos reais: quem era a cliente, situação antes, o que você fez, resultado depois"
            rows={6}
          />
          <SaveBar
            onSave={() => {}}
            extra={
              <button
                onClick={() => window.print()}
                className="text-sm px-4 py-2 rounded-full border border-border flex items-center gap-1.5"
              >
                <Printer size={14} /> Baixar PDF — Tom de Voz
              </button>
            }
          />
        </div>

        <div className="rounded-2xl border border-terracotta bg-white p-5 text-center mt-8">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próximo passo</p>
          <p className="font-serif text-lg text-ink mb-3">Identidade Visual</p>
          <Link
            to="/metodo/pilar-2/identidade-visual"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
          >
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

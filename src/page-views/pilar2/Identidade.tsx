import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import PromptCard from "../../components/PromptCard";
import SaveBar from "../../components/SaveBar";
import { ArrowRight } from "lucide-react";
import { usePilar2 } from "@/lib/pilar2-hooks";
import { ARQUETIPOS, type Arquetipo } from "@/lib/pilar2-storage";
import {
  PROMPT_ARQUETIPO_MENTORADA,
  PROMPT_ARQUETIPO_CLIENTE,
  PROMPT_ENCONTRO,
} from "@/data/prompts/pilar2-arquetipos";

function ArqSelect({
  value,
  onChange,
  label,
}: {
  value: Arquetipo;
  onChange: (v: Arquetipo) => void;
  label: string;
}) {
  return (
    <div>
      <label className="text-xs tracking-[0.1em] uppercase text-muted block mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Arquetipo)}
        className="w-full rounded-xl border border-border p-2.5 text-sm bg-white"
      >
        <option value="">Selecionar…</option>
        {ARQUETIPOS.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </div>
  );
}

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
        placeholder={placeholder || "Cole aqui o resultado do ChatGPT…"}
        className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-terracotta resize-none"
      />
    </div>
  );
}

export default function Identidade() {
  const { state, update } = usePilar2();

  return (
    <Layout>
      <PilarBreadcrumb
        pilar={2}
        pilarLabel="Criar Autoridade"
        backTo="/metodo/pilar-2"
        backLabel="Voltar para o Pilar 2"
      />
      <PillarHeader
        numeral="✦"
        icon={null}
        pilarLabel="Etapa 3 · Descoberta"
        titulo="Identidade de marca"
        subtitulo="Descubra seu arquétipo, o do seu cliente e calibre a ponte entre os dois."
      />
      <div className="px-5 md:px-10 pt-8 pb-10 max-w-4xl mx-auto">

        {/* 1. SEU ARQUÉTIPO */}
        <h2 className="font-serif text-xl text-ink mb-2">1. Seu arquétipo</h2>
        <p className="text-sm text-muted mb-3">
          Descubra o SEU arquétipo dominante e secundário. Define como você ESCREVE: palavras a usar,
          palavras a evitar e estrutura de história.
        </p>
        <PromptCard
          numero={1}
          titulo="Seu arquétipo"
          descricao="Entrevista guiada pela IA usando os dados do seu Doc Mestre."
          prompt={PROMPT_ARQUETIPO_MENTORADA}
        />
        <div className="rounded-2xl border border-border bg-white p-5 mb-8">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <ArqSelect
              label="Arquétipo dominante"
              value={state.arquetipoDominante}
              onChange={(v) => update({ arquetipoDominante: v })}
            />
            <ArqSelect
              label="Arquétipo secundário"
              value={state.arquetipoSecundario}
              onChange={(v) => update({ arquetipoSecundario: v })}
            />
          </div>
          <Area
            label="Palavras a USAR (5)"
            value={state.palavrasUsar}
            onChange={(v) => update({ palavrasUsar: v })}
            placeholder="palavra1, palavra2, palavra3, palavra4, palavra5"
            rows={2}
          />
          <Area
            label="Palavras a EVITAR (5)"
            value={state.palavrasEvitar}
            onChange={(v) => update({ palavrasEvitar: v })}
            placeholder="palavra1, palavra2, palavra3, palavra4, palavra5"
            rows={2}
          />
          <Area
            label="Resultado completo do seu arquétipo"
            value={state.arquetipoResultadoCompleto}
            onChange={(v) => update({ arquetipoResultadoCompleto: v })}
            rows={6}
          />
          <SaveBar onSave={() => {}} />
        </div>

        {/* 2. CLIENTE */}
        <h2 className="font-serif text-xl text-ink mb-2">2. Arquétipo do cliente</h2>
        <p className="text-sm text-muted mb-3">
          Descubra o arquétipo do seu público. Define como você VENDE: dor a enfatizar, prova social
          que ressoa, objeção a antecipar.
        </p>
        <PromptCard
          numero={2}
          titulo="Arquétipo do cliente"
          descricao="Use depois de descobrir o seu próprio arquétipo."
          prompt={PROMPT_ARQUETIPO_CLIENTE}
        />
        <div className="rounded-2xl border border-border bg-white p-5 mb-8">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <ArqSelect
              label="Arquétipo dominante"
              value={state.arquetipoClienteDominante}
              onChange={(v) => update({ arquetipoClienteDominante: v })}
            />
            <ArqSelect
              label="Arquétipo secundário"
              value={state.arquetipoClienteSecundario}
              onChange={(v) => update({ arquetipoClienteSecundario: v })}
            />
          </div>
          <Area
            label="Dor principal do cliente"
            value={state.dorPrincipalCliente}
            onChange={(v) => update({ dorPrincipalCliente: v })}
            rows={3}
          />
          <Area
            label="Prova social que ressoa"
            value={state.provaSocial}
            onChange={(v) => update({ provaSocial: v })}
            rows={3}
          />
          <Area
            label="Resultado completo do arquétipo do cliente"
            value={state.arquetipoClienteResultadoCompleto}
            onChange={(v) => update({ arquetipoClienteResultadoCompleto: v })}
            rows={6}
          />
          <SaveBar onSave={() => {}} />
        </div>

        {/* 3. ENCONTRO */}
        <h2 className="font-serif text-xl text-ink mb-2">3. O encontro entre os dois</h2>
        <p className="text-sm text-muted mb-3">
          Cruza seu arquétipo com o do seu cliente e calibra a ponte: ajustes de comunicação, ganchos
          de conteúdo e frases de venda.
        </p>
        <PromptCard
          numero={3}
          titulo="O encontro entre os arquétipos"
          descricao="Use as 4 caixinhas acima preenchidas."
          prompt={PROMPT_ENCONTRO}
        />
        <div className="rounded-2xl border border-border bg-white p-5 mb-8">
          <Area
            label="Ajustes de comunicação"
            value={state.ajustesComunicacao}
            onChange={(v) => update({ ajustesComunicacao: v })}
            rows={8}
          />
          <SaveBar onSave={() => {}} />
        </div>

        <div className="rounded-2xl border border-terracotta bg-white p-5 text-center mt-8">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próximo passo</p>
          <p className="font-serif text-lg text-ink mb-3">Tom de Voz da Marca</p>
          <Link
            to="/metodo/pilar-2/tom-de-voz"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
          >
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

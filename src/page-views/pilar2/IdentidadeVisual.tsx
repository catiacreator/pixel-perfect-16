import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PillarHeader from "../../components/PillarHeader";
import PromptCard from "../../components/PromptCard";
import SaveBar from "../../components/SaveBar";
import { ArrowRight, ExternalLink, Wand2, Printer } from "lucide-react";
import { usePilar2 } from "@/lib/pilar2-hooks";
import { PROMPT_IDENTIDADE_VISUAL } from "@/data/prompts/pilar2-tom-visual";
import { parseIdentidadeVisual } from "@/lib/pilar2-parsers";

function Area({
  value,
  onChange,
  label,
  placeholder,
  rows = 3,
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

function Input({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta"
      />
    </div>
  );
}

export default function IdentidadeVisual() {
  const { state, update } = usePilar2();

  const parsear = () => {
    if (!state.identidadeVisualCola.trim()) return;
    const r = parseIdentidadeVisual(state.identidadeVisualCola);
    update({
      vibeMarca: r.vibeMarca || state.vibeMarca,
      paleta: r.paleta || state.paleta,
      tipografiaTitulo: r.tipografiaTitulo || state.tipografiaTitulo,
      tipografiaCorpo: r.tipografiaCorpo || state.tipografiaCorpo,
      tipografiaManuscrita: r.tipografiaManuscrita || state.tipografiaManuscrita,
      estiloImagem: r.estiloImagem || state.estiloImagem,
      elementosVisuais: r.elementosVisuais || state.elementosVisuais,
      antipadroesVisuais: r.antipadroesVisuais || state.antipadroesVisuais,
      promptCarrossel: r.promptCarrossel || state.promptCarrossel,
      promptReels: r.promptReels || state.promptReels,
      promptLifestyle: r.promptLifestyle || state.promptLifestyle,
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
      <PillarHeader
        numeral="✦"
        icon={null}
        pilarLabel="Etapa 3.3 · Identidade Visual"
        titulo="Identidade Visual"
        subtitulo="Anexa até 3 imagens do Pinterest no ChatGPT e ele te devolve paleta, tipografia, elementos visuais e mood — direto da sua referência."
      />
      <div className="px-5 md:px-10 pt-8 pb-10 max-w-4xl mx-auto">

        <div className="rounded-2xl border border-border bg-white p-5 mb-6">
          <ol className="text-sm text-ink space-y-2 list-decimal pl-4">
            <li>
              No Pinterest, salve até 3 imagens que representam o estilo da sua marca e baixe no seu
              dispositivo.
              <div className="mt-1.5">
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-ink text-cream"
                >
                  Abrir Pinterest <ExternalLink size={11} />
                </a>
              </div>
            </li>
            <li>Abra o ChatGPT, anexe as imagens pelo clipe 📎 e cole o prompt abaixo.</li>
            <li>
              Quando o ChatGPT entregar o KIT FINAL (10 seções numeradas), cole tudo no campo e
              clique em "Preencher campos automaticamente".
            </li>
          </ol>
        </div>

        <PromptCard
          numero={5}
          titulo="Análise de identidade visual"
          descricao="Gera vibe, paleta, tipografia, estilo, elementos e 3 prompts de imagem."
          prompt={PROMPT_IDENTIDADE_VISUAL}
        />

        <div className="rounded-2xl border border-border bg-white p-5 mb-6">
          <Area
            label="Cole o KIT FINAL do ChatGPT aqui"
            value={state.identidadeVisualCola}
            onChange={(v) => update({ identidadeVisualCola: v })}
            rows={8}
            placeholder="Cole as 10 seções numeradas que o ChatGPT entregou…"
          />
          <button
            onClick={parsear}
            className="text-xs font-semibold text-terracotta flex items-center gap-1.5"
          >
            <Wand2 size={13} /> Preencher campos automaticamente
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 mb-6">
          <Area
            label="🧠 Vibe da Marca"
            value={state.vibeMarca}
            onChange={(v) => update({ vibeMarca: v })}
            rows={2}
          />
          <Area
            label="🎨 Paleta (5 cores com hex)"
            value={state.paleta}
            onChange={(v) => update({ paleta: v })}
            placeholder="Cor 1: Nome #hex (função)…"
            rows={5}
          />
          <Input
            label="🔤 Tipografia — Título"
            value={state.tipografiaTitulo}
            onChange={(v) => update({ tipografiaTitulo: v })}
            placeholder="Nome da fonte + link Google Fonts"
          />
          <Input
            label="🔤 Tipografia — Corpo"
            value={state.tipografiaCorpo}
            onChange={(v) => update({ tipografiaCorpo: v })}
            placeholder="Nome da fonte + link Google Fonts"
          />
          <Input
            label="🖨️ Tipografia — Manuscrita"
            value={state.tipografiaManuscrita}
            onChange={(v) => update({ tipografiaManuscrita: v })}
            placeholder="Nome da fonte manuscrita + link Google Fonts"
          />
          <Area
            label="🖼️ Estilo de Imagem"
            value={state.estiloImagem}
            onChange={(v) => update({ estiloImagem: v })}
          />
          <Area
            label="🧩 Elementos Visuais"
            value={state.elementosVisuais}
            onChange={(v) => update({ elementosVisuais: v })}
          />
          <Area
            label="🚫 Antipadrões Visuais"
            value={state.antipadroesVisuais}
            onChange={(v) => update({ antipadroesVisuais: v })}
          />
          <Area
            label="✍️ Prompt — Capa de Carrossel"
            value={state.promptCarrossel}
            onChange={(v) => update({ promptCarrossel: v })}
          />
          <Area
            label="🎬 Prompt — Capa de Reels"
            value={state.promptReels}
            onChange={(v) => update({ promptReels: v })}
          />
          <Area
            label="📸 Prompt — Imagem Lifestyle/Bastidor"
            value={state.promptLifestyle}
            onChange={(v) => update({ promptLifestyle: v })}
          />
          <SaveBar
            onSave={() => {}}
            extra={
              <button
                onClick={() => window.print()}
                className="text-sm px-4 py-2 rounded-full border border-border flex items-center gap-1.5"
              >
                <Printer size={14} /> Baixar PDF — Identidade Visual
              </button>
            }
          />
        </div>

        <div className="rounded-2xl border border-terracotta bg-white p-5 text-center mt-8">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próximo passo</p>
          <p className="font-serif text-lg text-ink mb-3">Consultoria de Imagem</p>
          <Link
            to="/metodo/pilar-2/consultoria-imagem"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
          >
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

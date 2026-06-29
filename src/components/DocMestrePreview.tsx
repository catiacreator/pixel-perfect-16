import { createPortal } from "react-dom";
import { Download, X } from "lucide-react";

type AnyRec = Record<string, any>;

function Campo({ label, value }: { label: string; value?: string }) {
  if (!value || !String(value).trim()) return null;
  return (
    <div className="mb-3">
      <p className="text-[10px] tracking-[0.18em] uppercase text-ink/45 mb-0.5">{label}</p>
      <p className="text-[13px] text-ink/85 leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function Seccao({ n, titulo, children }: { n: string; titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 break-inside-avoid">
      <h2 className="font-serif text-lg text-ink mb-3 pb-1.5 border-b border-[var(--color-border)]">
        <span className="text-terracotta">{n}</span> {titulo}
      </h2>
      {children}
    </section>
  );
}

export default function DocMestrePreview({
  doc,
  metodo,
  onClose,
}: {
  doc: AnyRec;
  metodo: AnyRec;
  onClose: () => void;
}) {
  const dores: string[] = Array.isArray(doc.dores) ? doc.dores.filter(Boolean) : [];
  const desejos: string[] = Array.isArray(doc.desejos) ? doc.desejos.filter(Boolean) : [];

  const baixar = () => {
    document.body.classList.add("pdf-printing");
    const cleanup = () => {
      document.body.classList.remove("pdf-printing");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    setTimeout(cleanup, 1500);
  };

  return createPortal(
    <div className="pdf-portal fixed inset-0 z-[80] bg-ink/50 flex flex-col">
      {/* Barra de ações (escondida na impressão) */}
      <div className="pdf-chrome shrink-0 flex items-center justify-between gap-3 px-4 md:px-6 py-3 bg-white border-b border-[var(--color-border)]">
        <p className="font-semibold text-ink text-sm">Pré-visualização — Documento Mestre</p>
        <div className="flex items-center gap-2">
          <button
            onClick={baixar}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta/90 transition-colors"
          >
            <Download size={15} /> Baixar PDF
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-ink/60 hover:bg-ink/5"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Área de scroll com a "folha" A4 */}
      <div className="flex-1 overflow-auto py-6 px-3">
        <div className="pdf-sheet mx-auto bg-white shadow-xl w-full max-w-[820px] p-8 md:p-12">
          {/* Capa */}
          <div className="mb-8">
            <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta font-semibold">● Leveza no Digital · Jornada 2026</p>
            <h1 className="font-display text-4xl text-ink mt-2 leading-tight">Documento Mestre</h1>
            <p className="text-sm text-ink/60 mt-2">
              Tudo o que a IA precisa para trabalhar como se fosse {doc.nome || "você"}.
            </p>
          </div>

          <Seccao n="01" titulo="Quem és tu">
            <Campo label="Nome" value={doc.nome} />
            <Campo label="Profissão / Especialidade" value={doc.profissao} />
            <Campo label="Há quanto tempo atuas" value={doc.tempoAtuacao} />
          </Seccao>

          <Seccao n="02" titulo="O que entregas">
            <Campo label="O que faz" value={doc.oQueFaz} />
            <Campo label="Como resolve" value={doc.comoResolve} />
          </Seccao>

          <Seccao n="03" titulo="O teu público">
            <Campo label="Público que atende" value={doc.publico} />
            {dores.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] tracking-[0.18em] uppercase text-ink/45 mb-1">Dores principais</p>
                <ul className="list-disc pl-5 text-[13px] text-ink/85 space-y-0.5">{dores.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
            )}
            {desejos.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] tracking-[0.18em] uppercase text-ink/45 mb-1">Desejos principais</p>
                <ul className="list-disc pl-5 text-[13px] text-ink/85 space-y-0.5">{desejos.map((d, i) => <li key={i}>{d}</li>)}</ul>
              </div>
            )}
          </Seccao>

          <Seccao n="04" titulo="Detetive do tempo">
            <Campo label="Faturação mensal" value={doc.faturamentoMensal} />
            <Campo label="Horas por dia" value={doc.horasDia} />
            <Campo label="Dias por semana" value={doc.diasSemana} />
          </Seccao>

          <Seccao n="05" titulo="Arquétipos da marca">
            <Campo label="Dominante" value={doc.arquetipoDominante} />
            <Campo label="Secundário" value={doc.arquetipoSecundario} />
            <Campo label="Combinação" value={doc.combinacaoArquetipos} />
            <Campo label="Arquétipo do cliente" value={doc.arquetipoCliente} />
          </Seccao>

          <Seccao n="06" titulo="Tom de voz & linguagem">
            <Campo label="Tom de voz" value={doc.tomVoz} />
            <Campo label="Palavras para usar" value={doc.palavrasUsar} />
            <Campo label="Palavras para evitar" value={doc.palavrasEvitar} />
            <Campo label="Crença central" value={doc.crencaCentral} />
          </Seccao>

          <Seccao n="07" titulo="O teu método">
            <Campo label="Nome do método" value={metodo.nomeMetodo} />
            <Campo label="Promessa" value={metodo.promessa} />
            <Campo label="Pilares" value={metodo.pilares} />
            <Campo label="Posicionamento" value={metodo.posicionamento} />
          </Seccao>

          <Seccao n="08" titulo="Identidade visual">
            <Campo label="Vibe da marca" value={doc.vibeMarca} />
            {(doc.cor1 || doc.cor2 || doc.cor3 || doc.cor4 || doc.corDestaque) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {[doc.cor1, doc.cor2, doc.cor3, doc.cor4, doc.corDestaque].filter(Boolean).map((c: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-[11px] text-ink/70 border border-[var(--color-border)] rounded-full pl-1.5 pr-2 py-0.5">
                    <span className="w-3 h-3 rounded-full" style={{ background: c }} /> {c}
                  </span>
                ))}
              </div>
            )}
            <Campo label="Tipografia" value={[doc.fonteTitulo, doc.fonteCorpo, doc.fonteMao].filter(Boolean).join(" · ")} />
            <Campo label="Estilo de imagem" value={doc.estiloImagem} />
            <Campo label="Antipadrões" value={doc.antipadroes} />
          </Seccao>

          <Seccao n="09" titulo="Bio & posicionamento">
            <Campo label="Opinião 1" value={doc.opiniao1} />
            <Campo label="Opinião 2" value={doc.opiniao2} />
            <Campo label="Opinião 3" value={doc.opiniao3} />
            <Campo label="Formato de conteúdo" value={doc.formatoConteudo} />
            <Campo label="Página / URL" value={doc.url} />
            <Campo label="Formato de entrega" value={doc.formatoEntrega} />
          </Seccao>

          <p className="text-[11px] text-ink/40 mt-8 pt-4 border-t border-[var(--color-border)]">
            Este documento alimenta todo o sistema — use-o como fonte da verdade em cada prompt. · Leveza no Digital
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

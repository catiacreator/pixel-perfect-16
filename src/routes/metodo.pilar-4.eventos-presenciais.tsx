import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";
import { ArrowRight } from "lucide-react";

const IMPACTO = [
  { v: "20–40%", l: "da sala compra a oferta" },
  { v: "R$ 3k–15k", l: "ticket da oferta (consultoria/mentoria)" },
  { v: "R$ 60k–300k", l: "potencial num evento de 20 pessoas" },
];

function EventosPresenciais() {
  return (
    <Pilar4Page
      etapa="Etapa 6 · Palco"
      titulo="Venda presencial"
      subtitulo="Crie o projeto completo do seu evento e venda com pitch de palco."
    >
      <div className="grid grid-cols-3 gap-3 mb-6">
        {IMPACTO.map((m, i) => (
          <div key={i} className="rounded-2xl border border-[var(--color-border)] bg-white p-4 text-center">
            <p className="font-serif text-xl text-terracotta">{m.v}</p>
            <p className="text-xs text-ink/55 mt-1 leading-snug">{m.l}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-terracotta/30 bg-white p-5 mb-5">
        <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta mb-1">
          Prompt — Crie seu Projeto de Evento
        </p>
        <p className="text-sm text-ink/60 mb-3">
          O prompt é gerado com os teus dados do Documento Mestre e entrega um projeto completo: nome e
          conceito, público, formato, programação, experiência, precificação, copy de divulgação e
          logística.
        </p>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors">
          Copiar prompt
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/metodo/pilar-4/copy"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta"
        >
          Criar minha Oferta Completa <ArrowRight size={14} />
        </Link>
        <Link
          to="/metodo/pilar-4/alto-ticket"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta"
        >
          Estratégia de Alto Ticket <ArrowRight size={14} />
        </Link>
      </div>
    </Pilar4Page>
  );
}

export const Route = createFileRoute("/metodo/pilar-4/eventos-presenciais")({
  component: EventosPresenciais,
});

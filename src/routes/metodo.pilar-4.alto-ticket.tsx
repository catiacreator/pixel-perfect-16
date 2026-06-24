import { createFileRoute } from "@tanstack/react-router";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import { Mic, MonitorSmartphone } from "lucide-react";

function AltoTicket() {
  return (
    <Pilar4Page
      etapa="Etapa 3 · Alto Ticket"
      titulo="Venda de alto ticket"
      subtitulo="Estratégias para produtos e serviços a partir de R$ 2.000."
    >
      <div className="space-y-5">
        {/* Sub-caminho A */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <Mic size={16} className="text-terracotta" />
            <p className="font-serif text-lg text-ink">A · Venda em Eventos Presenciais</p>
          </div>
          <p className="text-sm text-ink/60 mb-3">
            Case real: <strong className="text-ink">Daiane Garcia</strong> com o GPT-Day (Curitiba) —
            vende consultorias e mentorias no palco.
          </p>
          <VideoPlaceholder label="Aula 1 — Como Vender Consultoria e Mentorias em Eventos Presenciais (com Daiane Garcia)" />
        </div>

        {/* Sub-caminho B */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <MonitorSmartphone size={16} className="text-terracotta" />
            <p className="font-serif text-lg text-ink">B · Venda Online</p>
          </div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta mt-2 mb-1">
            Estratégia: Sessão de Diagnóstico
          </p>
          <ul className="space-y-1.5 text-sm text-ink/70">
            <li>· Oferece uma sessão de diagnóstico gratuita (conversa 1:1).</li>
            <li>· Entende a dor → mostra o caminho → apresenta a consultoria como solução.</li>
          </ul>
          <p className="text-xs text-ink/50 mt-3 italic">
            Modelo simples, escalável e com altíssima taxa de conversão.
          </p>
        </div>
      </div>
    </Pilar4Page>
  );
}

export const Route = createFileRoute("/metodo/pilar-4/alto-ticket")({
  component: AltoTicket,
});

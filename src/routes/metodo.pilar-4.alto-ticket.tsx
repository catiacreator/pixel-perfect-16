import { createFileRoute } from "@tanstack/react-router";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import { Mic, MonitorSmartphone, Sparkles } from "lucide-react";

function AltoTicket() {
  return (
    <Pilar4Page
      etapa="Etapa 3 · Alto Ticket"
      titulo="Venda de alto ticket"
      subtitulo="Estratégias para produtos e serviços a partir de R$ 2.000."
    >
      {/* Intro — confiança */}
      <div className="rounded-2xl border border-terracotta/30 bg-cream-warm/50 p-5 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-terracotta" />
          <p className="font-serif text-lg text-ink">Alto ticket exige confiança</p>
        </div>
        <p className="text-sm text-ink/70 leading-relaxed">
          Quando o investimento é alto, a pessoa precisa sentir segurança antes de comprar. Por isso
          existem dois caminhos principais: vender em <strong className="text-ink">eventos presenciais</strong>,
          onde a confiança é construída ao vivo, e vender <strong className="text-ink">online</strong>, com
          processos e conteúdos que esquentam o público até à decisão.
        </p>
      </div>

      <div className="space-y-5">
        {/* Caminho A — Eventos Presenciais */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <Mic size={16} className="text-terracotta" />
            <p className="font-serif text-lg text-ink">Venda em Eventos Presenciais</p>
          </div>
          <p className="text-sm text-ink/60 mb-3">
            Aprende a vender consultorias e mentorias no palco, convertendo uma sala de participantes em
            clientes de alto ticket.
          </p>
          <VideoPlaceholder label="Aula 1 — Como Vender Consultoria e Mentorias em Eventos Presenciais" />
        </div>

        {/* Caminho B — Venda Online */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <MonitorSmartphone size={16} className="text-terracotta" />
            <p className="font-serif text-lg text-ink">Venda Online</p>
          </div>
          <p className="text-sm text-ink/60 mb-4">
            Estratégias digitais para vender produtos de alto ticket sem depender de eventos ao vivo.
          </p>

          <div className="rounded-xl border border-[var(--color-border)] bg-cream-warm/40 p-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta mb-1.5">Estratégia</p>
            <p className="font-serif text-base text-ink mb-2">Venda com Sessão de Diagnóstico</p>
            <p className="text-sm text-ink/70 leading-relaxed mb-2">
              Uma das formas mais poderosas de vender alto ticket online é oferecer uma sessão de
              diagnóstico gratuita. Nessa conversa 1:1 entendes a dor do potencial cliente, mostras o
              caminho da transformação e apresentas a sua consultoria ou mentoria como a melhor solução.
            </p>
            <p className="text-sm text-ink/70 leading-relaxed">
              É um modelo simples, escalável e com altíssima taxa de conversão — ideal para quem está a
              começar a vender online ou quer estruturar um processo comercial consistente.
            </p>
          </div>
        </div>
      </div>
    </Pilar4Page>
  );
}

export const Route = createFileRoute("/metodo/pilar-4/alto-ticket")({
  component: AltoTicket,
});

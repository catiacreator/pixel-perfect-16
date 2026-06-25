import { createFileRoute } from "@tanstack/react-router";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import { Bot, ExternalLink } from "lucide-react";
import QuizEstrategia from "@/page-views/pilar4/QuizEstrategia";

function Fundacao() {
  return (
    <Pilar4Page
      etapa="Etapa 2 · Base"
      titulo="Fundação da venda"
      subtitulo="Antes de qualquer estratégia, vamos descobrir o caminho certo pra você."
    >
      <div className="space-y-4">
        <VideoPlaceholder label="Aula 1 — Fundação e Vendas" />
        <p className="text-sm text-ink/60 -mt-2 mb-2">
          Uma fundação de vendas para quem quer vender serviços de Inteligência Artificial (ou feitos
          com IA), do básico ao avançado.
        </p>

        <VideoPlaceholder label="Aula 2 — Prospecção de Clientes com Claude" />

        {/* Robô BALDE */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <Bot size={16} className="text-terracotta" />
            <p className="font-serif text-lg text-ink">BALDE — Pesca em Balde</p>
            <span className="text-[10px] uppercase tracking-wider text-ink/40 border border-[var(--color-border)] rounded-full px-2 py-0.5">
              ChatGPT GPT
            </span>
          </div>
          <p className="text-sm text-ink/60 mb-3">
            Sobe o print de um comentário ou post e recebe 3 respostas prontas para conectar — sem
            parecer venda.
          </p>
          <a
            href="https://chatgpt.com/g/g-69af1af6dfa881918a4ad61bfb8abfec-balde-pesca-em-balde"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta"
          >
            Abrir o BALDE <ExternalLink size={13} />
          </a>
        </div>

        {/* Bloco de raciocínio */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-cream-warm/50 p-5">
          <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta mb-2">
            Por que fazer a Fundação primeiro?
          </p>
          <p className="text-sm text-ink/70 leading-relaxed">
            Existem várias formas de vender — alto ticket, lançamento, low ticket, presencial. Cada uma
            exige uma estratégia diferente. A IA vai descobrir qual é a certa pra você com 4–5 perguntas
            rápidas, e o Pilar 4 abre só o caminho que você precisa estudar.
          </p>
        </div>

        <QuizEstrategia />
      </div>
    </Pilar4Page>
  );
}

export const Route = createFileRoute("/metodo/pilar-4/fundacao")({
  component: Fundacao,
});

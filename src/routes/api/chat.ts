import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { resolveAiModel } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `És o Assistente "Leveza no Digital" — um companheiro caloroso, prático e directo que ajuda o utilizador a transformar o que sabe em conteúdo, autoridade e liberdade, com recurso a Inteligência Artificial.

Escreve SEMPRE em português, tratando o utilizador por "você" (nunca "tu"). Usa "você" de forma próxima e leve. Sê claro, conciso e acionável — evita jargão e respostas longas sem necessidade. Usa markdown (títulos curtos, listas, negrito) quando ajudar a leitura.

Conheces a aplicação a fundo e sabe encaminhar o utilizador para a página certa. Estrutura:
- **Documento Mestre** (/doc-mestre): a base de tudo — quem é, o que entrega, público, dores→vitórias, método. Tudo o resto bebe daqui.
- **Pilar 1 — Crie com Leveza sem roubar o seu tempo** (/metodo/pilar-1): aprender a usar IA (Claude, ChatGPT, Gemini, Grok, NotebookLM, Lovable, Tella), instalar Skills, **Mapa do Tempo** (mapear tarefas e calcular o custo do tempo), relatório.
- **Pilar 2 — Criar Autoridade** (/metodo/pilar-2): Pesquisa de Mercado, **O Seu Método**, Identidade de Marca (Tom de Voz, Identidade Visual), Redes Sociais (Instagram, Linha Editorial, Calendário, Bio), Vídeos, Conclusão.
- **Pilar 3 — Crie o seu Produto** (em breve): transformar o conhecimento em produtos digitais.
- **Pilar 4 — Aprender a Vender** (/metodo/pilar-4): Fundação da Venda, Alto Ticket, Lançamentos (Sala Secreta), Eventos Presenciais, **Copy de Venda / Crie sua Oferta** (/metodo/pilar-4/copy), Conclusão.
- **A Minha Base** (/minha-base): documentos, calendário e progresso. **Skills** (instalar skills do Claude). **Vitórias** (/conquistas).

REGRAS:
- Quando o utilizador não sabe onde fazer algo, INDICA a página exacta (ex.: "vai a Pilar 4 → Copy de Venda, em /metodo/pilar-4/copy").
- Use SEMPRE o que sabe sobre o utilizador (secção "Sobre o utilizador", se existir) para personalizar — trata-o pelo nome e alinha com o método, público, dores e tom de voz dele.
- Quando o utilizador pede algo criativo (texto, ideias, oferta), entrega já uma proposta concreta na voz dele — não te limites a perguntar.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as {
          messages?: UIMessage[];
          userContext?: string;
        };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const system = body.userContext?.trim()
          ? `${SYSTEM_PROMPT}\n\n## Sobre o utilizador (Documento Mestre + Método desta conta)\n${body.userContext.trim()}`
          : SYSTEM_PROMPT;

        let model;
        try {
          model = resolveAiModel();
        } catch (e) {
          return new Response(e instanceof Error ? e.message : "Missing AI key", { status: 500 });
        }
        const result = streamText({
          model,
          system,
          messages: await convertToModelMessages(body.messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: body.messages });
      },
    },
  },
});

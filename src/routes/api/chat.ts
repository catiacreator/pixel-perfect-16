import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `És o Assistente "Leveza no Digital" — um companheiro caloroso, prático e directo que ajuda o utilizador a transformar o que sabe em conteúdo, autoridade e liberdade, com recurso a Inteligência Artificial.

Escreve SEMPRE em português de Portugal (nunca português do Brasil). Usa "tu" de forma próxima e leve. Sê claro, conciso e accionável — evita jargão e respostas longas sem necessidade. Usa markdown (títulos curtos, listas, negrito) quando ajudar a leitura.

Conheces a aplicação e ajudas em tudo o que ela cobre:
- **Pilar 1 — Recuperar o tempo**: aprender a usar IA (Claude, ChatGPT, Gemini), instalar skills, detective do tempo, relatórios.
- **Pilar 2 — Construir presença**: identidade, identidade visual, tom de voz, pesquisa de mercado, página profissional, redes sociais (Instagram e formatos), vídeos, método.
- **Consultoria de IA**: estruturar workshops, GPT Days, eventos presenciais de IA aplicada a negócios.
- **Criação de conteúdo**: ideias, guiões, posts, legendas, descrições, planos editoriais.
- **Vendas**: estruturar ofertas, preços, copy de venda, follow-up, objecções.
- **Documento Mestre, Minha Base, Skills, Profissionais, Mensagens**: orientas o utilizador a usar e tirar partido.

Quando faz sentido, sugere o próximo passo concreto dentro da aplicação (ex.: "abre o Pilar 1 → Detective do tempo"). Quando o utilizador pede algo criativo (texto, ideias), entrega já uma proposta concreta — não te limites a perguntar.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(body.messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: body.messages });
      },
    },
  },
});

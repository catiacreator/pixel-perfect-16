import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const FERRAMENTAS = ["chatgpt", "claude", "gemini", "notebooklm", "grok", "lovable", "tella"] as const;

const RecomendacaoSchema = z.object({
  tarefa: z.string(),
  ferramenta: z.enum(FERRAMENTAS).describe("Slug da ferramenta recomendada."),
  comoAutomatizar: z.string().describe("Frase curta e prática (até 200 caracteres) explicando como usar a ferramenta para esta tarefa."),
  economiaPct: z.number().min(0).max(95).describe("Percentagem estimada de tempo que se ganha (0-95)."),
});

const PlanoSchema = z.object({
  recomendacoes: z.array(RecomendacaoSchema),
  ganhoTotalHoras: z.number().describe("Soma estimada de horas/mês que se podem recuperar."),
  primeiroPasso: z.string().describe("Por onde começar amanhã, em 1-2 frases."),
});

const SYSTEM = `És um consultor de IA prático para experts digitais brasileiros.
Recebes uma lista de tarefas (com horas/mês e custo em reais) e recomendas, para cada uma:
- Qual a ferramenta de IA mais adequada (apenas das disponíveis).
- Como exatamente automatizar (1 frase concreta).
- Estimativa realista de economia de tempo (entre 20% e 80% para a maioria; 90% só para casos muito mecânicos).

Ferramentas disponíveis:
- chatgpt: chat geral, escrita, brainstorming, e-mails, propostas.
- claude: análise longa, edição de textos, programação leve, raciocínio profundo.
- gemini: pesquisa com Google, integração com Docs/Sheets, multimodal.
- notebooklm: estudar PDFs, transcrições, gerar resumos a partir de fontes próprias.
- grok: pesquisa em tempo real / X / tendências.
- lovable: criar páginas, dashboards, ferramentas internas sem código.
- tella: gravar vídeos profissionais com edição automática.

Sê honesto: se a tarefa NÃO faz sentido automatizar (ex: reuniões 1-a-1), recomenda chatgpt com economia 20% e explica que serve para preparar/recapitular.`;

export const gerarPlanoAutomatizacao = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        tarefas: z.array(
          z.object({
            nome: z.string(),
            categoria: z.string(),
            horasMes: z.number(),
            custoMes: z.number(),
          }),
        ).min(1).max(15),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const lista = data.tarefas
      .map((t, i) => `${i + 1}. [${t.categoria}] ${t.nome} — ${t.horasMes.toFixed(1)}h/mês · R$${Math.round(t.custoMes)}`)
      .join("\n");
    const { object } = await generateObject({
      model: gateway("google/gemini-3-flash-preview"),
      schema: PlanoSchema,
      system: SYSTEM,
      prompt: `Tarefas do utilizador (ordenadas por custo):\n${lista}\n\nGera o plano.`,
    });
    return object;
  });

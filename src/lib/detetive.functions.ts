import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const TarefaSchema = z.object({
  nome: z.string().describe("Nome curto e claro da tarefa, como uma frase de ação."),
  qtd: z.string().describe("Quantidade numérica (ex: '2', '30')."),
  unidade: z.enum(["h", "min"]).describe("Unidade de tempo."),
  freq: z.enum(["dia", "semana", "mes"]).describe("Frequência."),
  categoria: z
    .enum(["Produção", "Marketing", "Estratégia"])
    .describe("Categoria de negócio a que pertence."),
});

const ExtractSchema = z.object({
  tarefas: z.array(TarefaSchema).max(20),
  resumo: z.string().describe("Resumo curto e empático em 1-2 frases sobre o que foi mapeado."),
});

const SYSTEM = `És um coach que ajuda um expert digital a mapear as tarefas que ocupam o seu tempo.
Lês uma descrição livre da rotina (em português do Brasil) e devolves uma lista estruturada
de tarefas com duração e frequência. Regras:
- Categoriza cada tarefa como Produção (entregar para o cliente), Marketing (vender/atrair)
  ou Estratégia (planeamento, finanças, decisões).
- Use nomes curtos, na voz do utilizador. Não invente tarefas que não foram mencionadas.
- Se a pessoa der intervalos ("2 a 3 horas"), usa o valor mais alto.
- Se a frequência for ambígua, assume "/ semana".
- O resumo deve ser empático e celebrar o esforço de mapear.`;

export const extractTarefas = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ text: z.string().min(3).max(8000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const { object } = await generateObject({
      model: gateway("google/gemini-3-flash-preview"),
      schema: ExtractSchema,
      system: SYSTEM,
      prompt: `Descrição da rotina do utilizador:\n\n${data.text}\n\nExtrai as tarefas.`,
    });
    return object;
  });

// Pergunta de aquecimento para guiar o utilizador na conversa
export const PERGUNTAS_GUIA = [
  "Conta-me um dia típico de trabalho — do momento em que abres o computador até fechares.",
  "Quais são as tarefas que você próprio faz para entregar para os clientes?",
  "E para vender / atrair novos clientes — o que faz (redes sociais, propostas, reuniões)?",
  "Há tarefas de bastidores (financeiro, planeamento, e-mails) que comem o seu tempo?",
];

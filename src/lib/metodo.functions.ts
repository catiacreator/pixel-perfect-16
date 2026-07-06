import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { withAiModel } from "@/lib/ai-gateway.server";

const PassoSchema = z.object({
  nome: z.string().describe("Nome curto e memorável do passo/pilar do método"),
  dor_base: z.string().describe("A dor do público (texto da dor) que este passo resolve"),
  vitoria: z.string().describe("A vitória concreta e confirmada para esta dor (o ponto B: específica, mensurável, algo que a cliente consegue FAZER, TER ou SENTIR)"),
});

const OutSchema = z.object({
  type: z
    .enum(["mensagem", "metodo"])
    .describe("'mensagem' enquanto ainda recolhes/confirmas vitórias (uma dor de cada vez); 'metodo' apenas quando TODAS as dores já têm vitória confirmada."),
  mensagem: z
    .string()
    .describe("Quando type='mensagem': a tua próxima fala — perguntar a vitória de UMA dor, pedir mais especificidade, recusar dar a vitória, ou confirmar ('Então a vitória aqui é: X. Correto?'). Vazio quando type='metodo'."),
  nome_metodo: z.string().describe("Quando type='metodo': nome do método. Caso contrário, vazio."),
  promessa_final: z.string().describe("Quando type='metodo': promessa principal numa frase. Caso contrário, vazio."),
  passos: z.array(PassoSchema).describe("Quando type='metodo': UM passo por cada dor, com dor_base e a vitória confirmada. Caso contrário, lista vazia."),
  mensagem_fechamento: z.string().describe("Quando type='metodo': mensagem final breve e calorosa. Caso contrário, vazio."),
});

const SYSTEM = `És a assistente da Cátia Creator. O teu papel é ajudar a expert a estruturar o MÉTODO dela, definindo UMA vitória concreta para cada dor do público.

Escreve SEMPRE em português, tratando a expert por "você" de forma próxima e leve.

O QUE É UMA VITÓRIA:
- Cada dor do público tem exatamente UMA vitória (o ponto B): específica, mensurável, algo que a cliente consegue FAZER, TER ou SENTIR e que antes não conseguia.
- A vitória tem de ser específica para AQUELA dor — não vale uma vitória genérica que serviria para todas.

FLUXO (segue à risca, UMA dor de cada vez):
1. A conversa abre com a lista de dores e uma pergunta de confirmação. Quando a expert confirmar (ex.: "sim"), começa pela 1.ª dor.
2. Para cada dor, pergunta exatamente neste espírito: 'Para a dor "<dor>": qual é a 1 vitória concreta que a sua cliente conquista consigo? O que ela consegue fazer, ter ou sentir que antes não conseguia?'
3. Quando a expert responder:
   - Se a vitória for vaga, ampla ou genérica → NÃO confirmes; pede mais especificidade focada naquela dor (ex.: "Isso parece uma vitória geral. Pense em '<tema da dor>': o que ela consegue FAZER que antes não conseguia? Dê um resultado que dê para medir ou mostrar a alguém.").
   - Se a expert disser apenas que não sabe (sem pedir ajuda) → guia-a com UMA pergunta concreta para ela própria chegar à vitória; não a dês tu.
   - Se a expert PEDIR AJUDA ou SUGESTÕES (ex.: "ajuda-me", "dá-me sugestões", "podes sugerir?", "que exemplos?") → primeiro reafirma que o método é dela e a decisão é dela, e só depois oferece 2 a 3 SUGESTÕES de possíveis vitórias para aquela dor, como exemplos a adaptar. Termina sempre a devolver-lhe a escolha. Ex.: "Claro que ajudo — mas a decisão é sua, este método é seu. Aqui ficam algumas hipóteses para a dor '<dor>': 1) … 2) … 3) … Qual destas encaixa melhor consigo, ou como a adaptaria?"
   - Nunca decidas pela expert nem assumas uma vitória sem ela confirmar — mesmo quando sugeres.
   - Se for específica → confirma SEMPRE assim: "Então a vitória aqui é: <vitória reformulada e clara>. Correto?"
4. Só depois de a expert confirmar a vitória (ex.: "sim", "correto", "isso") é que avanças para a dor SEGUINTE (volta ao ponto 2).
5. Quando TODAS as dores tiverem vitória confirmada, devolve type="metodo" com nome_metodo, promessa_final, um passo por dor (com dor_base + vitória confirmada e um nome curto) e mensagem_fechamento.

REGRAS:
- Uma pergunta de cada vez. Nunca peças duas vitórias ao mesmo tempo nem avances sem confirmação.
- Não inventes a vitória pela expert — guia-a com perguntas.
- Enquanto não tiveres TODAS as vitórias confirmadas, devolve sempre type="mensagem".
- Olha para o histórico da conversa para saber em que dor estás e quais já foram confirmadas.`;

export const construirMetodo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        messages: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
          .default([]),
        nome: z.string().optional().default(""),
        profissao: z.string().optional().default(""),
        o_que_faz: z.string().optional().default(""),
        como_resolve: z.string().optional().default(""),
        publico: z.string().optional().default(""),
        dores_publico: z.string().optional().default(""),
        desejos_publico: z.string().optional().default(""),
        dores_array: z.array(z.string()).optional().default([]),
        desejos_array: z.array(z.string()).optional().default([]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const doresNumeradas =
      data.dores_array.length > 0
        ? data.dores_array.map((d, i) => `${i + 1}. ${d}`).join("\n")
        : data.dores_publico;

    const perfil = [
      `Expert: ${data.nome || "(sem nome)"} — ${data.profissao || ""}`,
      data.o_que_faz && `O que faz: ${data.o_que_faz}`,
      data.como_resolve && `Como resolve: ${data.como_resolve}`,
      data.publico && `Público: ${data.publico}`,
      doresNumeradas && `DORES A MAPEAR (uma vitória por dor):\n${doresNumeradas}`,
      data.desejos_publico && `Desejos do público:\n${data.desejos_publico}`,
    ]
      .filter(Boolean)
      .join("\n");

    const conversa = data.messages
      .map((m) => `${m.role === "user" ? "Expert" : "Assistente"}: ${m.content}`)
      .join("\n");

    const { object } = await withAiModel((model) =>
      generateObject({
        model,
        schema: OutSchema,
        system: SYSTEM,
        prompt: `CONTEXTO DO ESPECIALISTA:\n${perfil}\n\nCONVERSA ATÉ AGORA:\n${conversa || "(ainda sem conversa)"}\n\nDecide a tua próxima fala segundo o fluxo (uma dor de cada vez) ou, se todas as vitórias já estiverem confirmadas, monta o método.`,
      }),
    );

    if (object.type === "metodo" && object.passos.length > 0) {
      return {
        type: "metodo" as const,
        data: {
          nome_metodo: object.nome_metodo,
          promessa_final: object.promessa_final,
          passos: object.passos,
          mensagem_fechamento:
            object.mensagem_fechamento || "Pronto! Montei o seu método. Pode revê-lo e editá-lo abaixo.",
        },
      };
    }

    return {
      type: "mensagem" as const,
      content: object.mensagem || "Pode contar-me um pouco mais?",
    };
  });

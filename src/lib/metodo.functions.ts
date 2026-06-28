import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { withAiModel } from "@/lib/ai-gateway.server";

const PassoSchema = z.object({
  nome: z.string().describe("Nome curto e memorável do passo/pilar do método"),
  vitoria: z.string().describe("A vitória/transformação concreta que este passo entrega ao público"),
  dor_base: z.string().describe("A dor do público que este passo resolve"),
});

const OutSchema = z.object({
  type: z
    .enum(["pergunta", "metodo"])
    .describe("'pergunta' para fazer UMA pergunta de seguimento; 'metodo' quando já há informação suficiente para montar o método."),
  pergunta: z.string().describe("Quando type='pergunta': uma única pergunta curta e clara. Caso contrário, string vazia."),
  nome_metodo: z.string().describe("Quando type='metodo': nome do método. Caso contrário, vazio."),
  promessa_final: z.string().describe("Quando type='metodo': a promessa principal do método numa frase. Caso contrário, vazio."),
  passos: z.array(PassoSchema).describe("Quando type='metodo': um passo por cada dor principal (3 a 6 passos). Caso contrário, lista vazia."),
  mensagem_fechamento: z.string().describe("Quando type='metodo': mensagem final breve e calorosa. Caso contrário, vazio."),
});

const SYSTEM = `És a assistente da plataforma "Leveza no Digital", criada pela Cátia Creator. Ajudas a expert a transformar as dores do seu público num MÉTODO próprio (nome + promessa + passos).

Escreve SEMPRE em português de Portugal, tratando a expert por "você" de forma próxima e leve.

Regras:
- Recebes o perfil da expert (quem é, o que faz, público) e as DORES do público.
- Se faltar UMA informação essencial para montar o método, devolve type="pergunta" com uma única pergunta curta.
- Assim que a expert confirmar as dores (por exemplo responde "sim") ou já houver informação suficiente, devolve type="metodo".
- No método: cria um PASSO por cada dor principal (entre 3 e 6 passos). Cada passo tem um nome curto e memorável, a vitória concreta que entrega e a dor_base que resolve.
- Os passos devem seguir uma ordem lógica de transformação (do início ao resultado).
- Não inventes dados pessoais que não foram dados. Sê concreto, prático e específico do negócio da expert.`;

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
    const perfil = [
      `Expert: ${data.nome || "(sem nome)"} — ${data.profissao || ""}`,
      data.o_que_faz && `O que faz: ${data.o_que_faz}`,
      data.como_resolve && `Como resolve: ${data.como_resolve}`,
      data.publico && `Público: ${data.publico}`,
      data.dores_publico && `Dores do público:\n${data.dores_publico}`,
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
        prompt: `PERFIL E DADOS:\n${perfil}\n\nCONVERSA ATÉ AGORA:\n${conversa || "(ainda sem conversa)"}\n\nDecide: fazer uma pergunta de seguimento ou montar o método final.`,
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
      content: object.pergunta || "Pode contar-me um pouco mais sobre o que entrega ao seu público?",
    };
  });

import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { withAiModel } from "@/lib/ai-gateway.server";

const DocMestreSchema = z.object({
  nome: z.string().optional().default(""),
  profissao: z.string().optional().default(""),
  tempoAtuacao: z.string().optional().default(""),
  localizacao: z.string().optional().default(""),
  oQueFaz: z.string().optional().default(""),
  comoResolve: z.string().optional().default(""),
  publico: z.string().optional().default(""),
  dores: z.array(z.string()).optional().default([]),
  desejos: z.array(z.string()).optional().default([]),
  produtos: z
    .array(
      z.object({
        nome: z.string().default(""),
        descricao: z.string().default(""),
        ticketMedio: z.string().default(""),
      }),
    )
    .optional()
    .default([]),
  horasDia: z.string().optional().default(""),
  diasSemana: z.string().optional().default(""),
  faturamentoMensal: z.string().optional().default(""),
  tomDeVoz: z.string().optional().default(""),
});

const SYSTEM = `És um extractor estruturado. Lês um texto livre sobre um expert/mentor digital
e extrais os campos pedidos para um Documento Mestre, em português de Portugal.
Mantém a voz original sempre que possível. NÃO invente informação — se um campo
não estiver presente, deixa-o vazio ("") ou array vazio. Limita "dores" e "desejos"
a no máximo 5 itens cada, ordenados por urgência/relevância.`;

export const extractDocMestre = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ text: z.string().min(1).max(60000) }).parse(input))
  .handler(async ({ data }) => {
    const { object } = await withAiModel((model) =>
      generateObject({
        model,
        schema: DocMestreSchema,
        system: SYSTEM,
        prompt: `Texto fornecido pelo utilizador:\n\n${data.text}\n\nExtrai os campos do Documento Mestre.`,
      }),
    );
    return object;
  });

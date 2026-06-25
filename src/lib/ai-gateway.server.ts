import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createLovableAiGatewayProvider(lovableApiKey: string, initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  let resolveRunId: (value: string | undefined) => void = () => {};
  let runIdResolved = false;
  const runIdReady = new Promise<string | undefined>((resolve) => {
    resolveRunId = resolve;
  });
  const publishRunId = (value?: string) => {
    const next = value?.trim() || undefined;
    if (!runId && next) runId = next;
    if (!runIdResolved) {
      runIdResolved = true;
      resolveRunId(runId);
    }
  };
  if (runId) publishRunId(runId);

  const provider = createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }
      try {
        const response = await fetch(input, { ...init, headers });
        publishRunId(response.headers.get(LOVABLE_AIG_RUN_ID_HEADER) ?? undefined);
        return response;
      } catch (error) {
        publishRunId(undefined);
        throw error;
      }
    },
  });

  return Object.assign(provider, {
    getRunId: () => runId,
    waitForRunId: () => (runId ? Promise.resolve(runId) : runIdReady),
  });
}

/**
 * Resolve o modelo de IA a usar conforme as chaves disponíveis no ambiente:
 *  1. LOVABLE_API_KEY  -> gateway do Lovable (produção; injetada automaticamente no Lovable)
 *  2. GEMINI_API_KEY   -> Gemini direto do Google (grátis em https://aistudio.google.com/apikey),
 *                         útil para correr/testar localmente sem a chave do Lovable
 *
 * A API do Gemini é compatível com OpenAI, por isso usamos o mesmo cliente.
 * Lança um erro claro (em PT) se nenhuma chave estiver definida.
 */
export function resolveAiModel(runId?: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  if (lovableKey) {
    const gateway = createLovableAiGatewayProvider(lovableKey, runId);
    return gateway("google/gemini-3-flash-preview");
  }

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey) {
    const google = createOpenAICompatible({
      name: "google",
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
      headers: { Authorization: `Bearer ${geminiKey}` },
    });
    return google("gemini-2.0-flash");
  }

  throw new Error(
    "Falta a chave de IA. Define LOVABLE_API_KEY (Lovable) ou GEMINI_API_KEY " +
      "(grátis em https://aistudio.google.com/apikey) no ficheiro .env e reinicia o servidor.",
  );
}

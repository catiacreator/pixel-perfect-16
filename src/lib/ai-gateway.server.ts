import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createAnthropic } from "@ai-sdk/anthropic";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

/**
 * Modelo Claude (Anthropic) — só disponível se ANTHROPIC_API_KEY estiver definida.
 * Usado onde queremos fiabilidade/qualidade paga (ex.: Reels em Série), em vez do
 * gateway gratuito (que dá "Too Many Requests" sob carga). Devolve null se não houver chave.
 * O modelo pode ser trocado via ANTHROPIC_MODEL (por defeito: Haiku 4.5, barato e rápido).
 */
export function resolveAnthropicModel() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const anthropic = createAnthropic({ apiKey: key });
  const modelo = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
  return anthropic(modelo);
}

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

// Modelos Gemini (free tier) por ordem de preferência — todos validados como
// existentes e com quota. Servem de cadeia de fallback em erros transitórios
// (503 Service Unavailable / 429 rate limit), comuns no free tier sob carga.
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-flash-lite-latest", "gemini-2.5-flash-lite"] as const;

type AiModel = ReturnType<ReturnType<typeof createOpenAICompatible>>;

function geminiProvider(key: string) {
  return createOpenAICompatible({
    name: "google",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    headers: { Authorization: `Bearer ${key}` },
    // Essencial: sem isto o AI SDK envia { type: "json_object" } (sem schema)
    // e o Gemini devolve um objeto vazio. Com isto envia json_schema + strict.
    supportsStructuredOutputs: true,
  });
}

/**
 * Modelos candidatos por ordem de preferência, conforme as chaves do ambiente:
 *  1. LOVABLE_API_KEY  -> gateway do Lovable (produção; um único modelo estável)
 *  2. GEMINI_API_KEY   -> Gemini direto do Google (grátis), com cadeia de fallback
 *
 * Lança um erro claro (em PT) se nenhuma chave estiver definida.
 */
function aiModelCandidates(runId?: string): AiModel[] {
  const lovableKey = process.env.LOVABLE_API_KEY;
  if (lovableKey) {
    const gateway = createLovableAiGatewayProvider(lovableKey, runId);
    return [gateway("google/gemini-3-flash-preview") as AiModel];
  }

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey) {
    const google = geminiProvider(geminiKey);
    return GEMINI_MODELS.map((m) => google(m));
  }

  throw new Error(
    "Falta a chave de IA. Define LOVABLE_API_KEY (Lovable) ou GEMINI_API_KEY " +
      "(grátis em https://aistudio.google.com/apikey) no ficheiro .env e reinicia o servidor.",
  );
}

/** Modelo principal (1.º candidato). Usado onde não há fallback. */
export function resolveAiModel(runId?: string): AiModel {
  return aiModelCandidates(runId)[0];
}

/**
 * Modelo para o chat em streaming — prioriza BAIXA LATÊNCIA.
 * Usa o candidato mais leve (ex.: gemini-2.5-flash-lite), que responde mais
 * depressa (menos "thinking") do que o flash normal.
 */
export function resolveChatModel(runId?: string): AiModel {
  const models = aiModelCandidates(runId);
  return models[models.length - 1];
}

function isRetryableAiError(e: unknown): boolean {
  const msg = (e instanceof Error ? e.message : String(e)).toLowerCase();
  return /service unavailable|unavailable|overloaded|\b503\b|\b429\b|resource_exhausted|rate.?limit|too many requests/.test(
    msg,
  );
}

/**
 * Corre `run` com o 1.º modelo disponível; em erro transitório (503/429) tenta
 * o modelo seguinte da cadeia. Erros não-transitórios falham de imediato.
 * Para generateObject/generateText (não para streaming).
 */
export async function withAiModel<T>(run: (model: AiModel) => Promise<T>): Promise<T> {
  const models = aiModelCandidates();
  let lastErr: unknown;
  for (const model of models) {
    try {
      return await run(model);
    } catch (e) {
      lastErr = e;
      if (!isRetryableAiError(e)) throw e;
    }
  }
  throw lastErr;
}

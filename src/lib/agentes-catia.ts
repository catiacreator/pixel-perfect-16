// Links dos GPTs (agentes Cat.IA) no ChatGPT, por nome do agente.
export const AGENTE_URL: Record<string, string> = {
  // Yap Content não tem agente dedicado — usa o ChatGPT normal.
  "ChatGPT": "https://chatgpt.com",
  "cat.ia — Criação de Reels Virais":
    "https://chatgpt.com/g/g-6a4b7b87e8a481918f6cc14082d0f597-cat-ia-criacao-de-reels-virais",
  "cat.ia — Criação de Stories que Vendem":
    "https://chatgpt.com/g/g-6a4b7c8ef87c819185826318cbe1f23b-cat-ia-criacao-de-stories-que-vendem",
  "cat.ia — Criação de Posts que Vendem (Carrossel)":
    "https://chatgpt.com/g/g-6a4b7d5ef8b08191bacb91e61c9f2365-cat-ia-criacao-de-posts-que-vendem",
  "cat.ia — Criador de Posicionamento e Bio":
    "https://chatgpt.com/g/g-6a4b7e1af2388191ae1fff3d096e655f-cat-ia-criador-de-posicionamento-e-bio",
};

export function agenteUrl(nome?: string): string | undefined {
  return nome ? AGENTE_URL[nome] : undefined;
}

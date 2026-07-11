// Helper partilhado do "Plano de Posts" (calendário de conteúdo).
// Mesma chave e forma que o componente PlanoConteudo usa, para que os posts
// criados noutras páginas (ex.: Reels em Série) apareçam lá para agendar.

export type PlanoPost = {
  id: string;
  tipo: string;
  titulo: string;
  conteudo: string;
  link: string;
  data: string; // YYYY-MM-DD (vazio = por agendar)
  hora: string;
  pubId?: string;
};

export const PLANO_KEY = "leveza.plano-conteudo.v1";

function uid(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fallback */
  }
  return `p_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/** Acrescenta posts ao Plano de Posts (por agendar). Devolve quantos criou. */
export function adicionarPostsPlano(
  itens: { tipo: string; titulo: string; conteudo: string }[],
): number {
  if (typeof window === "undefined" || !itens.length) return 0;
  let posts: PlanoPost[] = [];
  try {
    const raw = window.localStorage.getItem(PLANO_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.posts)) posts = parsed.posts;
    }
  } catch {
    /* ignora */
  }
  const novos: PlanoPost[] = itens.map((it) => ({
    id: uid(),
    tipo: it.tipo,
    titulo: it.titulo,
    conteudo: it.conteudo,
    link: "",
    data: "",
    hora: "",
  }));
  try {
    window.localStorage.setItem(PLANO_KEY, JSON.stringify({ posts: [...posts, ...novos] }));
  } catch {
    /* quota cheia */
  }
  return novos.length;
}

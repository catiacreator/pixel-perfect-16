// Leitura síncrona e fiável da sessão Supabase a partir do localStorage.
//
// O `supabase.auth.getSession()`/`getUser()` pode pendurar neste ambiente
// (iframe/preview, instâncias de módulo via HMR). Para decidir se há sessão
// (mostrar avatar vs "Entrar") lemos diretamente o token guardado — é
// instantâneo e nunca bloqueia. A validação real continua a ser feita pelo
// servidor (middleware) nas chamadas autenticadas.

export type StoredSession = {
  access_token: string;
  expires_at?: number;
  user?: { id: string; email?: string; user_metadata?: Record<string, any> };
};

/** Chave de storage usada pela supabase-js: sb-<ref>-auth-token. */
function storageKey(): string | null {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    if (!url) return null;
    const ref = new URL(url).hostname.split(".")[0];
    return `sb-${ref}-auth-token`;
  } catch {
    return null;
  }
}

/** Devolve a sessão guardada (se existir e não estiver expirada), senão null. */
export function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  const key = storageKey();
  if (!key) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const sess: StoredSession | undefined = parsed?.access_token ? parsed : parsed?.currentSession;
    if (!sess?.access_token) return null;
    if (sess.expires_at && sess.expires_at < Math.floor(Date.now() / 1000)) return null;
    return sess;
  } catch {
    return null;
  }
}

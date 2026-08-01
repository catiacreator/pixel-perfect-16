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
// Acesso automático APENAS em desenvolvimento local com a chave fictícia
// (a que contém "dummy_local_only"). No site publicado (Lovable) a chave é real
// e `import.meta.env.DEV` é falso, por isso isto nunca ativa em produção.
function devFallbackSession(): StoredSession | null {
  try {
    if (!import.meta.env.DEV) return null;
    const k = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) || "";
    if (!k.includes("dummy_local_only")) return null;
    return {
      access_token: "dev-local",
      user: { id: "dev-admin", email: "catiasmgon@gmail.com", user_metadata: { nome: "Cátia" } },
    };
  } catch {
    return null;
  }
}

export function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  const key = storageKey();
  if (key) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        const sess: StoredSession | undefined = parsed?.access_token ? parsed : parsed?.currentSession;
        if (sess?.access_token && !(sess.expires_at && sess.expires_at < Math.floor(Date.now() / 1000))) {
          return sess;
        }
      }
    } catch {
      /* ignora — cai no fallback de dev abaixo */
    }
  }
  return devFallbackSession();
}

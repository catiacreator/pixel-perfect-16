import { createMiddleware } from '@tanstack/react-start'
import { readStoredSession } from '@/lib/session'

// Must be registered as a global `functionMiddleware` in `src/start.ts`; otherwise
// the browser never attaches the bearer token to serverFn RPCs.
//
// IMPORTANTE: lemos o token de forma SÍNCRONA do localStorage (readStoredSession),
// NÃO com `supabase.auth.getSession()`. O getSession() pode pendurar/não resolver
// em certos browsers (observado no Chrome): quando isso acontece, nenhuma chamada
// ao servidor leva o Authorization, o servidor responde "Unauthorized" e a app
// fica aparentemente vazia (Documento Mestre e restantes dados não carregam),
// enquanto noutros browsers (Safari) resolve e funciona. Ler direto do storage é
// instantâneo, nunca bloqueia e é a mesma fonte que o resto da app já usa.
// (O autoRefreshToken do supabase-js mantém este token fresco no localStorage.)
export const attachSupabaseAuth = createMiddleware({ type: 'function' }).client(
  async ({ next }) => {
    const token = readStoredSession()?.access_token
    // Só anexa JWTs reais (3 segmentos) — evita mandar o token fictício de dev.
    const isJwt = !!token && token.split('.').length === 3
    return next({
      headers: isJwt ? { Authorization: `Bearer ${token}` } : {},
    })
  },
)

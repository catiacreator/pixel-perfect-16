// Sincroniza o estado local (localStorage) com a tabela Supabase `master_documents`.
//
// Estratégia: o Supabase é a fonte de verdade persistente (por utilizador,
// multi-dispositivo); o localStorage funciona como cache local para que todo o
// código existente — que lê de forma síncrona — continue a funcionar.
//
//  - Ao iniciar sessão: PULL → hidrata o localStorage a partir do Supabase.
//  - Em cada escrita no localStorage: PUSH (debounce 1s) → grava de volta.
//
// A escrita é capturada de forma central interceptando localStorage.setItem,
// por isso não é preciso instrumentar cada página individualmente.

import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

// Chaves sincronizadas (estado persistente do utilizador).
// A sessão volátil do assistente fica de fora de propósito.
const SYNC_KEYS = [
  "leveza.doc-mestre.v1",
  "leveza.pilar2.v1",
  "leveza.detetive.v1",
  "leveza.minha-base.v1",
  "leveza.calendario.v1",
  "leveza.bio.v1",
  "leveza.bio.conquista.v1",
  "leveza.aulas-concluidas.v1",
  "leveza.agenda.v1",
];

// Disparado depois de o localStorage ser hidratado a partir do Supabase.
// Componentes que só leem no mount devem escutar este evento para recarregar.
export const HYDRATED_EVENT = "leveza:hydrated";

let currentUserId: string | null = null;
let initialized = false;
let hydrating = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;

const origSetItem =
  typeof window !== "undefined"
    ? window.localStorage.setItem.bind(window.localStorage)
    : null;

function installInterceptor() {
  if (typeof window === "undefined" || !origSetItem) return;
  window.localStorage.setItem = (key: string, value: string) => {
    origSetItem(key, value);
    if (!hydrating && currentUserId && SYNC_KEYS.includes(key)) schedulePush();
  };
}

async function pull(userId: string) {
  const { data, error } = await supabase
    .from("master_documents")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data?.data || typeof window === "undefined" || !origSetItem) return;

  const blob = data.data as Record<string, Json>;
  hydrating = true;
  let changed = false;
  for (const key of SYNC_KEYS) {
    const val = blob[key];
    if (val !== undefined && val !== null) {
      origSetItem(key, typeof val === "string" ? val : JSON.stringify(val));
      changed = true;
    }
  }
  hydrating = false;
  if (changed) window.dispatchEvent(new Event(HYDRATED_EVENT));
}

function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => void pushNow(), 1000);
}

async function pushNow() {
  if (!currentUserId || typeof window === "undefined") return;
  const blob: Record<string, Json> = {};
  for (const key of SYNC_KEYS) {
    const raw = window.localStorage.getItem(key);
    if (raw == null) continue;
    try {
      blob[key] = JSON.parse(raw);
    } catch {
      blob[key] = raw;
    }
  }
  try {
    await supabase.from("master_documents").upsert(
      { user_id: currentUserId, data: blob, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
  } catch {
    // offline ou tabela ainda não aplicada — mantém-se o localStorage
  }
}

// Idempotente — seguro chamar em cada mount (ex.: no Layout).
// Sem sessão iniciada, não faz nada (a app continua só com localStorage).
export async function initMasterDocSync() {
  if (initialized || typeof window === "undefined") return;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  initialized = true;
  currentUserId = data.user.id;
  installInterceptor();
  await pull(currentUserId);
}

// Limpa o estado ao terminar sessão (chamar no logout).
export function resetMasterDocSync() {
  initialized = false;
  currentUserId = null;
}

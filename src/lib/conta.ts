// Conta — dados pessoais da aluna que não pertencem ao Documento Mestre:
// a foto (avatar) e o(s) handle(s) do Instagram. O handle é obrigatório.
//
// Guardado em localStorage (`leveza.conta.v1`) para funcionar no local e para
// o aluno. Os handles são indexados pela posição do perfil (0 e 1), já que cada
// pessoa pode ter até 2 perfis (ver perfis.ts). A password NÃO fica aqui — é
// tratada diretamente pelo Supabase (auth.updateUser).

import { useEffect, useState } from "react";

export const CONTA_KEY = "leveza.conta.v1";
export const CONTA_EVENT = "leveza:conta";

export type ContaState = {
  foto: string; // data URL ou "" (sem foto)
  handles: string[]; // handle por índice de perfil (ex.: ["@ana", "@ana.coach"])
};

const VAZIO: ContaState = { foto: "", handles: [""] };

export function getConta(): ContaState {
  if (typeof window === "undefined") return { ...VAZIO };
  try {
    const s = JSON.parse(window.localStorage.getItem(CONTA_KEY) || "null");
    if (s && typeof s === "object") {
      return {
        foto: typeof s.foto === "string" ? s.foto : "",
        handles: Array.isArray(s.handles) ? s.handles.map((h: unknown) => (typeof h === "string" ? h : "")) : [""],
      };
    }
  } catch { /* ignora */ }
  return { ...VAZIO };
}

export function setConta(patch: Partial<ContaState>): void {
  if (typeof window === "undefined") return;
  const atual = getConta();
  const novo: ContaState = {
    foto: patch.foto !== undefined ? patch.foto : atual.foto,
    handles: patch.handles !== undefined ? patch.handles : atual.handles,
  };
  try { window.localStorage.setItem(CONTA_KEY, JSON.stringify(novo)); } catch { /* ignora */ }
  window.dispatchEvent(new Event(CONTA_EVENT));
}

/** Normaliza um handle: garante o "@" à frente e sem espaços. "" continua "". */
export function normalizarHandle(v: string): string {
  const limpo = (v || "").trim().replace(/^@+/, "");
  return limpo ? `@${limpo}` : "";
}

/** Hook reativo. */
export function useConta(): ContaState {
  const [c, setC] = useState<ContaState>(getConta);
  useEffect(() => {
    const on = () => setC(getConta());
    window.addEventListener(CONTA_EVENT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(CONTA_EVENT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return c;
}

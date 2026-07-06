// Lista de contactos aprovados ("Aluno do Estúdio Creator"). Por agora guarda
// localmente (protótipo). Depois liga-se a uma tabela na Supabase.
export type Contacto = { id: string; nome: string; dial: string; numero: string };

const KEY = "leveza.estudio-contactos.v1";

// Só dígitos — para comparar independentemente de espaços, traços, parênteses.
export function normalizar(dial: string, numero: string): string {
  return (dial + numero).replace(/\D/g, "");
}

export function readContactos(): Contacto[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function writeContactos(list: Contacto[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignora */ }
}

// Verifica se um número consta na lista aprovada.
export function contactoAprovado(dial: string, numero: string): Contacto | null {
  const alvo = normalizar(dial, numero);
  if (alvo.length < 6) return null;
  return readContactos().find((c) => normalizar(c.dial, c.numero) === alvo) || null;
}

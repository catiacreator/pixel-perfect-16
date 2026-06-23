// Registro automático de conteúdo customizado por aula.
//
// Para customizar uma aula, cria um ficheiro em:
//   src/page-views/pilar1/aulas/<tool-slug>/<aula-id>.tsx
//
// Exemplo: src/page-views/pilar1/aulas/chatgpt/1-1.tsx
//
// O ficheiro pode exportar:
//   - videoUrl: string  → URL do vídeo (iframe embed)
//   - default: React component  → conteúdo livre (texto, imagens, etc.)
//
// Se o ficheiro não existir, a AulaPage usa o conteúdo padrão de src/data/aulas.ts.

import type { ComponentType } from "react";

export type AulaOverride = {
  videoUrl?: string;
  default?: ComponentType;
};

// Vite glob: importa todos os ficheiros .tsx em aulas/<tool>/<id>.tsx
const modules = import.meta.glob<AulaOverride>("./*/*.tsx", { eager: true });

export function getAulaOverride(tool: string, aulaId: string): AulaOverride | null {
  const key = `./${tool}/${aulaId}.tsx`;
  return modules[key] ?? null;
}

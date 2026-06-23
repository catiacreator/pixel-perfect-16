# Páginas individuais de cada aula

Cada aula do Pilar 1 pode ter o seu próprio ficheiro onde colocas o vídeo e o texto.

## Como funciona

Estrutura: `src/page-views/pilar1/aulas/<tool-slug>/<aula-id>.tsx`

Exemplos:
- `chatgpt/1-1.tsx` → aula "ChatGPT no desktop"
- `claude/1-2.tsx` → aula "Como organizar Projetos no Claude"
- `lovable/1-1.tsx` → aula "Como criar sites no Lovable"

Slugs disponíveis: `chatgpt`, `claude`, `lovable`, `gemini`, `notebooklm`, `grok`, `tella`.

## O que exportar

```tsx
// src/page-views/pilar1/aulas/chatgpt/1-1.tsx

// Opcional: URL do vídeo (YouTube embed, Vimeo, Loom, etc.)
export const videoUrl = "https://www.youtube.com/embed/XXXXXXXXXXX";

// Opcional: conteúdo livre — substitui os tópicos padrão.
// Se não exportares default, a AulaPage mostra os tópicos de src/data/aulas.ts.
export default function Aula() {
  return (
    <div className="prose prose-ink max-w-none">
      <h3>O que vais aprender</h3>
      <p>O teu texto aqui...</p>
    </div>
  );
}
```

Se o ficheiro não existir para uma aula, a `AulaPage` usa o conteúdo padrão (tópicos + vídeo placeholder) definido em `src/data/aulas.ts`.

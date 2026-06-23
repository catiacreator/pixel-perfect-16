Seguindo o fluxo do Pilar 1, a **Etapa 2 — Hub das IAs + Aulas** é o próximo passo natural depois do Documento Mestre.

## O que está feito
- Etapa 1 — `/doc-mestre` completo (autosave, import, refinar com IA, CTA → `/metodo/pilar-1/aprenda-ia`)
- Existem rotas vazias: `metodo.pilar-1.aprenda-ia.tsx`, `metodo.pilar-1.aprenda-ia.$tool.tsx`, `metodo.pilar-1.aprenda-ia.$tool.$lessonSlug.tsx`, `metodo.pilar-1.aprenda-ia.claude.instalar-skills.tsx`

## O que vou construir

### 1. Modelo de dados das aulas (`src/data/aulas.ts`)
Estrutura única que alimenta o hub, cada hub-por-IA e cada página de aula:
```
tools: [
  { slug: "chatgpt", nome, descricao, totalAulas, modulos: [...] },
  { slug: "claude", ... },
  { slug: "gemini", ... },
  { slug: "notebooklm", ... },
  { slug: "grok", ... },
  { slug: "lovable", ... },
  { slug: "tella", ... },
]
```
Cada aula tem: `id` (ex. "1-1"), `titulo`, `modulo`, `videoUrl?`, `topicos[]`, `links[]`, `promptPersonalizado?` (template com placeholders `[NOME]`, `[PROFISSÃO]`, etc.).

Conteúdo: copio fielmente o texto fornecido (ChatGPT 1.1–4.1, Claude 1.1–2.1, Gemini 1.1–1.2, NotebookLM 1.1–1.3, Grok 1.1–1.2, Lovable 1.1–1.5, Tella 1.1). A spec corta a meio da última frase do Lovable 1.4 e Lovable 1.5/Tella 1.1 não vieram — uso placeholders curtos marcados visualmente até receberes o texto.

### 2. Progresso por aula (localStorage)
Chave `leveza.aulas-concluidas.v1` = `{ "chatgpt/1-1": true, … }`. Hook `useAulaProgress` para ler/escrever. Toggle "Marcar como concluída" em cada aula, barra de % calculada por IA e total.

### 3. Hub geral `/metodo/pilar-1/aprenda-ia`
- Mantém o mesmo design system (cream/terracotta/gold/forest/ink, Lora + Work Sans)
- Cabeçalho com título e descrição
- Grid de 7 cards (uma IA por card) com thumbnail/inicial, nome, barra de progresso "X% · Y/Z aulas"
- CTA inferior **"Próximo passo: Detetive do Tempo →"** para `/metodo/pilar-1/detetive-do-tempo`

### 4. Hub por IA `/metodo/pilar-1/aprenda-ia/$tool`
- Cabeçalho com nome + descrição da IA + progresso geral
- Lista de aulas agrupada por módulo, com check ao lado das concluídas
- Link de aula → `/metodo/pilar-1/aprenda-ia/$tool/$lessonSlug`
- Para Claude, link extra "Instalar Skills" → `/metodo/pilar-1/aprenda-ia/claude/instalar-skills` (já existe; mantenho)

### 5. Página de aula `/metodo/pilar-1/aprenda-ia/$tool/$lessonSlug`
Layout único reutilizado por todas as 25+ aulas:
- Breadcrumb "Aprenda IA › ChatGPT › Aula 1.1"
- Título + módulo
- Slot de vídeo (16:9 com placeholder estilo Doc Mestre quando `videoUrl` não existe)
- Tópicos de referência (lista com bullets)
- Links externos como botões (ex. "Acessar o Grok", "Instalar Go Full Page")
- Bloco **Prompt personalizado** quando a aula o tem:
  - Lê o Documento Mestre do localStorage e substitui `[NOME]`, `[PROFISSÃO]`, `[O QUE FAZ]`, `[COMO RESOLVE]`, `[PÚBLICO]`, `[5 DORES]`, `[5 DESEJOS]`, `[PRODUTOS]`, `[TICKET MÉDIO]`, `[TOM DE VOZ]`, `[NOME DO MÉTODO]`, `[PROMESSA]`, `[PILARES]`, `[HORAS/DIA]`, `[DIAS/SEMANA]` (campos em falta ficam como "(não preenchido)" + aviso "Completa o Documento Mestre para personalizar este prompt")
  - Botão "Copiar prompt" + label contextual ("Cole dentro do seu Projeto no ChatGPT", etc.)
- Botão "Marcar como concluída" (toggle)
- Navegação anterior / próxima (linear dentro da IA; última aula da IA → primeira aula da IA seguinte conforme spec)

### 6. Página "Instalar Skills" (Claude)
A rota já existe vazia; preencho com o texto fornecido (intro + 3 passos). Lista de skills com botões "Baixar .md" fica como placeholder até me dares os ficheiros reais.

## Detalhes técnicos
- **Stack**: TanStack Start file routes, `Link` do `router-compat`, `lucide-react`, Tailwind v4 com tokens existentes
- **Sem nova migração / sem backend**: progresso vive em `localStorage`, igual ao Doc Mestre
- **SSR-safe**: leitura de `localStorage` só dentro de `useEffect`
- **Conteúdo das aulas**: ficheiro `aulas.ts` simples — fácil de editar depois

## O que NÃO vou fazer neste passo
- Páginas das Etapas 3, 4, 5 (Detetive do Tempo, Relatório, Conclusão) — ficam para depois
- Upload/gestão real de Skills .md (sem ficheiros ainda)
- Lovable 1.5 e Tella 1.1 (texto em falta — placeholders visíveis)

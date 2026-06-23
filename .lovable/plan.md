
# Pilar 2 — Criar Autoridade · Plano de Implementação

Escopo: reescrever as 6 etapas do Pilar 2 do zero, alinhadas à documentação enviada. Os arquivos já existem como stubs (50–150 linhas cada) e serão substituídos por implementações completas.

## Aviso sobre conteúdo truncado

Sua mensagem cortou no meio do **Prompt Consultoria 1 — Estudo Visual de Roupas** (no "Look 1"). Como você pediu para começar com o que já tenho, vou marcar como `// TODO: completar prompt` os seguintes blocos e deixar placeholders claros na UI:

- Prompt Consultoria 1 — final do bloco "3 LOOKS BASE PRONTOS PRA GRAVAR" em diante
- Prompt Consultoria 2 — Cabelo (não enviado)
- Etapa 4 — Redes Sociais (estrutura, prompts, formulários não enviados)
- Etapa 5 — Vídeos (não enviada)
- Etapa 6 — Conclusão / Checklist (não enviada)

Você cola depois e eu completo sem refazer o resto.

## Etapa 1 — Pesquisa de Mercado (`/metodo/pilar-2/pesquisa-mercado`)

- 2 passos com vídeo placeholder (`VideoPlaceholder`) + botão "Marcar como concluído" usando `use-aula-progress`.
- Passo 1: botão externo "Abrir NotebookLM" → `https://notebooklm.google.com/`.
- Passo 2: caixinha com 5 inputs numerados ("As 5 maiores dores do seu público").
- Persistência via campo `dores_publico_top5` no Doc Mestre (server fn `salvar-dores-publico`).
- Link "Próxima aula → Definindo Seu Método".

## Etapa 2 — Definindo Seu Método (`/metodo/pilar-2/metodo`)

- Reaproveita o componente atual `EsbocoMetodo.tsx` como base.
- PASSO 1: botão "Criar meu método com Inteligência Artificial" abre `ConversaModal` apontando para edge function `construir-metodo` (já existente em `mekzmmliixsxgtnbfgiy`).
- Payload do POST conforme documentação (mensagens + dados Doc Mestre + arrays de dores/desejos).
- Estado de chat persistido em localStorage por sessão; botão "Recomeçar".
- PASSO 2: tabs `Ponto A → Vitória` (5 cards editáveis com select de Intensidade Alta/Moderada/Baixa + setas de reordenar) e `Meu Método` (nome + promessa).
- Botões "Salvar esboço" (server fn `salvar-esboco-metodo`) e "Revisar Doc Mestre".

## Etapa 3 — Identidade de Marca (4 sub-rotas)

### 3.1 Arquétipos (`/metodo/pilar-2/identidade`)

3 seções (Seu arquétipo / Cliente / Encontro) cada uma com:
- Descrição
- Botões "Copiar prompt N" (preenche placeholders com dados do Doc Mestre via `fill-prompt`) e "Ver prompt" (modal scroll)
- Formulários com persistência (selects de 12 arquétipos + textareas)

Prompts 1, 2 e 3 (verbatim, ~10KB texto) vão para `src/data/prompts/pilar2-arquetipos.ts`.

### 3.2 Tom de Voz (`/metodo/pilar-2/tom-de-voz`)

- Botões prompt 4 + textarea de cola + 4 campos auto-preenchidos (regex parser nos rótulos `Campo: tom_de_voz` etc).
- Botão "Baixar PDF — Tom de Voz" (gerador simples com `jspdf` se já instalado; senão `window.print()` em rota dedicada).

### 3.3 Identidade Visual (`/metodo/pilar-2/identidade-visual`)

- Instruções com botão "Abrir Pinterest" + botão "Copiar prompt 5".
- Parser do KIT FINAL (10 seções numeradas com emojis) para preencher os campos automaticamente quando o usuário cola.
- Campos: vibe, paleta (5 cores), 3 tipografias com link Google Fonts, estilo de imagem, elementos, antipadrões, 3 prompts de imagem.

### 3.4 Consultoria de Imagem (`/metodo/pilar-2/consultoria-imagem`)

- 2 cards (Roupas / Cabelo), cada um com "Copiar prompt" + "Ver prompt".
- Prompt 1 cheio; Prompt 2 com placeholder TODO.

Prompts 4 e 5 + Consultoria → `src/data/prompts/pilar2-tom-visual.ts`.

## Etapa 4 — Redes Sociais (`/metodo/pilar-2/redes-sociais`)

Manter estrutura atual (Instagram + formatos). Adicionar TODO no topo:
"Conteúdo pendente — aguardando documentação detalhada".

## Etapa 5 — Vídeos (`/metodo/pilar-2/videos`)

Mesmo TODO. Estrutura atual preservada.

## Etapa 6 — Conclusão (`/metodo/pilar-2/conclusao`)

Mesmo TODO. Checklist atual preservado até nova doc.

## Modelo de dados — Doc Mestre

Migration adicionando colunas ao `doc_mestre` (tabela existente):

```sql
ALTER TABLE public.doc_mestre ADD COLUMN IF NOT EXISTS
  dores_publico_top5 jsonb,
  metodo_esboco jsonb,                 -- { pontos: [{dor, intensidade, vitoria}], nome, promessa }
  arquetipo_dominante text,
  arquetipo_secundario text,
  arquetipo_palavras_usar text,
  arquetipo_palavras_evitar text,
  arquetipo_resultado_completo text,
  arquetipo_cliente_dominante text,
  arquetipo_cliente_secundario text,
  arquetipo_cliente_dor_principal text,
  arquetipo_cliente_prova_social text,
  arquetipo_cliente_resultado_completo text,
  arquetipo_ajustes_comunicacao text,
  tom_de_voz text,
  crenca_central text,
  opinioes_polemicas text,
  cases text,
  identidade_visual jsonb;             -- vibe, paleta, tipografias, estilo, elementos, antipadrões, prompts
```

Server functions novas em `src/lib/pilar2.functions.ts`:
- `salvarDoresPublico`, `salvarEsbocoMetodo`, `salvarArquetipos`, `salvarTomDeVoz`, `salvarIdentidadeVisual`
- Cada uma com `requireSupabaseAuth`, upsert por `user_id`

## Arquivos a criar/editar

**Novos:**
- `src/data/prompts/pilar2-arquetipos.ts` (3 prompts verbatim)
- `src/data/prompts/pilar2-tom-visual.ts` (prompts 4, 5, consultoria 1)
- `src/lib/pilar2.functions.ts`
- `src/lib/pilar2-parsers.ts` (parsers para tom de voz e identidade visual)
- `src/components/PromptBlock.tsx` (componente "Copiar prompt" + "Ver prompt" reutilizável)
- `supabase/migrations/<ts>_pilar2_doc_mestre.sql`

**Reescritos:**
- `src/page-views/pilar2/PesquisaMercado.tsx`
- `src/page-views/pilar2/EsbocoMetodo.tsx`
- `src/page-views/pilar2/Identidade.tsx`
- `src/page-views/pilar2/TomDeVoz.tsx`
- `src/page-views/pilar2/IdentidadeVisual.tsx`
- `src/page-views/pilar2/ConsultoriaImagem.tsx`

**Intocados nesta rodada:** Pilar2Hub, RedesSociais*, Videos, ConclusaoPilar2, PaginaProfissional (recebem TODO banner).

## Ordem de execução

1. Migration + server fns + tipos
2. Componente `PromptBlock` + arquivos de prompts (verbatim)
3. Etapa 1 → Etapa 2 → Etapa 3 (4 sub-rotas)
4. Banner TODO nas etapas 4/5/6

## Detalhes técnicos

- Persistência: `requireSupabaseAuth` + upsert no `doc_mestre`; client invoca via `useServerFn`.
- Edge function `construir-metodo`: chamada client-side direta (já hospedada em projeto separado), com `fetch` POST e streaming de mensagens (ConversaModal já implementa).
- "Copiar prompt": `navigator.clipboard.writeText(fillPrompt(template, docMestre))` + toast.
- Selects de arquétipos: array constante com os 12 nomes (INOCENTE, EXPLORADORA, …).
- PDFs: rotas separadas `/pdf/pilar-2/tom-de-voz` e `/pdf/pilar-2/identidade-visual` com layout print-friendly e `window.print()` automático.

Confirme para eu começar.

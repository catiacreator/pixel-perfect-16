# Reimplementar Pilar 1 do zero, alinhado à documentação

O Pilar 1 já existe (~2.3k linhas em `src/page-views/pilar1/` + 14 rotas em `src/routes/`). A doc agora é a fonte da verdade. Vou reescrever cada camada (dados → componentes → páginas) para bater 1:1 com a doc, reusando a infra que já provou funcionar (Doc Mestre, edge functions `refinar-doc-mestre`, `detetive-tempo-ia`, hooks de progresso, `PromptCard`, `fillPrompt`).

## Estrutura final de rotas

```text
/doc-mestre                                           Documento Mestre
/metodo/pilar-1                                       Hub do Pilar 1 (6 etapas)
/metodo/pilar-1/aprenda-ia                            Hub das 7 ferramentas
/metodo/pilar-1/aprenda-ia/$tool                      Hub de uma ferramenta
/metodo/pilar-1/aprenda-ia/$tool/$lessonSlug          Aula individual
/metodo/pilar-1/aprenda-ia/claude/instalar-skills     Página completa das 15+6 Skills
/metodo/pilar-1/detetive-do-tempo                     Mapeamento de tarefas
/metodo/pilar-1/detetive-do-tempo/relatorio           Relatório com custos
/metodo/pilar-1/detetive-do-tempo/plano               (mantido)
/metodo/pilar-1/conclusao                             Checklist 12 itens
/metodo/consultoria-ia                                Bônus (mantido)
```

Sem rotas novas — só conteúdo reescrito.

## Camada de dados (`src/data/`)

- **`pilar1-curriculum.ts`** (novo, substitui `curriculum.ts` no que toca a Pilar 1): catálogo único e tipado de ferramentas e aulas.
  - 7 ferramentas: `chatgpt` (9 aulas), `claude` (15 aulas + página Skills), `gemini` (2), `notebooklm` (3), `grok` (2), `lovable` (5), `tella` (1).
  - Cada aula: `{ id, slug, titulo, descricao, videoUrl?, promptId?, gptUrl?, links? }`.
  - Marca explicitamente aulas com prompt (`1-3` ChatGPT, `1-2` Claude) e aulas com link de GPT/externo (`2-1/2-2/2-3`, `1-4 Lovable`, `1-5 Lovable`).
- **`src/data/prompts/pilar1-projetos.ts`** (novo): prompts verbatim "Criar Projetos no ChatGPT" (3481 chars) e "Organizar Projetos no Claude" (2817 chars), conforme doc.
- **`src/data/prompts/pilar1-automatize.ts`** (novo): as 10 automações da aula `chatgpt/3-1` (e-mails, redes sociais, reuniões, resumos, apresentações, projetos, pesquisa, aprender, documentos, decisões), cada uma com prompt pré-preenchido pelo Doc Mestre.
- **`src/data/prompts/consultoria-ia.ts`** (novo/atualizado): prompt "Planejador de Evento de IA" (2066 chars).
- **`src/data/skills-mentoria.ts`** (novo): array tipado das 15 Skills da mentoria + 6 Skills de mercado (com emoji, nome, descrição, link de download `.md`).

Prompts são strings cruas com placeholders `[nome]`, `[profissao]`, `[dores_array]`, etc. `fillPrompt` (já existe) faz a substituição com o Doc Mestre.

## Camada de servidor (`src/lib/`)

Reaproveitar o que existe; nenhum novo edge function. Confirmar que estes server fns continuam funcionando e estão protegidos:

- `doc-mestre.functions.ts` → `salvarDocMestre`, `carregarDocMestre`, `refinarDocMestre` (chama edge `refinar-doc-mestre`).
- `detetive.functions.ts` → `salvarTarefas`, `chatDetetiveTempo` (chama edge `detetive-tempo-ia`), `gerarRelatorio`.
- `fill-prompt.ts` → permanece como helper único de preenchimento.

Se algum estiver desalinhado com a doc (ex.: faltam campos novos do Doc Mestre), eu adiciono coluna na tabela `doc_mestre` via migração e atualizo o server fn.

## Camada de componentes (`src/components/`)

Reusar o que já existe (`PromptCard`, `SaveBar`, `TodoBanner`, `EtapaCard`, `PilarBreadcrumb`, `PilarSidebar`, `VideoPlaceholder`, `ConversaModal`).

Pequenos novos:
- **`AulaLayout.tsx`** — shell padrão de aula (breadcrumb, vídeo, descrição, opcional `PromptCard`, opcional GPT/link externo, navegação prev/next dentro da ferramenta).
- **`SkillCard.tsx`** — card de uma Skill (emoji + nome + descrição + botão "Baixar .md").
- **`ChecklistItem.tsx`** — item do checklist de conclusão (com persistência por usuário em `localStorage` por enquanto, no mesmo padrão do Pilar 2).

## Camada de páginas (`src/page-views/`)

Reescritas para casar com a doc:

1. **`DocMestre.tsx`** — formulário com todos os campos da doc (Nome, Profissão, Tempo de atuação, Localização, O que faço, Como resolvo, Público, 5 Dores, 5 Desejos, Horas/dia, Dias/semana, Faturamento, Produtos/serviços dinâmicos, Tom). Ações: Visualizar PDF, Subir PDF/TXT, Colar texto, Zerar tudo, Refinar com IA (expande copy-prompt + aplicar via edge fn).
2. **`pilar1/Pilar1Hub.tsx`** — hero "RECUPERAR SEU TEMPO" + 5 cards de etapa (Doc Mestre · Aprenda IA · Detetive · Relatório · Conclusão).
3. **`pilar1/AprendaIAHub.tsx`** — 7 cards de ferramenta com contagem de aulas concluídas.
4. **`pilar1/ToolHub.tsx`** — lista de aulas da ferramenta (chips "com prompt", "com GPT", "vídeo").
5. **`pilar1/AulaPage.tsx`** — renderiza aula via `AulaLayout`, lendo do `pilar1-curriculum`. Se tiver prompt, monta `PromptCard` com `fillPrompt(promptTemplate, docMestre)`.
6. **`pilar1/InstalarSkills.tsx`** — grid das 15 Skills da Mentoria + seção "Skills de Mercado" (6 nichos). Cada card com download.
7. **`pilar1/DetetiveDoTempo.tsx`** — 3 categorias (Produção, Marketing, Estratégia), inputs Faturamento/Horas/Dias, lista dinâmica de tarefas, botões Adicionar/Zerar/Salvar. Botão "Conversa comigo" abre `ConversaModal` ligado à edge `detetive-tempo-ia`.
8. **`pilar1/RelatorioDoTempo.tsx`** — tabela Tarefa/Categoria/h-sem/R$/sem/R$/mês, cards de totais por categoria, top-3 tarefas mais caras, sugestões de automação.
9. **`pilar1/ConclusaoPilar1.tsx`** — checklist de 12 itens conforme doc; mensagem ao bater 12/12 e CTA "Avançar para Pilar 2".
10. **`consultoria/ConsultoriaIA.tsx`** — descrição + `PromptCard` (Planejador de Evento) + download da Skill `consultoria-ia.md`.

## Ordem de execução

1. Camada de dados (curriculum + prompts + skills).
2. Componentes (`AulaLayout`, `SkillCard`, `ChecklistItem`).
3. Server fns — checar/ajustar Doc Mestre e Detetive.
4. Páginas, na ordem: DocMestre → Pilar1Hub → AprendaIAHub → ToolHub → AulaPage → InstalarSkills → Detetive → Relatorio → Conclusao → ConsultoriaIA.
5. Limpar/ajustar arquivos das rotas para apontarem para as novas páginas (assinaturas permanecem).

## Detalhes técnicos

- Persistência do progresso de aula: `use-aula-progress.ts` (já existe) — manter chave por `tool/lessonSlug`.
- Persistência do checklist Pilar 1: `localStorage` (mesmo padrão de Pilar 2) — chave `pilar1:checklist`.
- Edge functions: nenhuma nova; chamadas via `createServerFn` em `src/lib/*.functions.ts` com `requireSupabaseAuth` quando tocam tabelas do usuário.
- Estado de Detetive vive em `detetive-storage.ts` (já existe) + `doc_mestre`.
- PDFs: `window.print()` com folha de estilo print-only (mesmo padrão Pilar 2).
- Tudo o que a doc lista mas eu não tenho dado real (IDs de vídeo, IDs reais de GPT, URLs reais dos `.md` das Skills) entra como `TODO` visível na UI via `TodoBanner` — sem inventar.

## Riscos / pontos a confirmar enquanto executo

- Se `doc_mestre` no banco não tem colunas para "Tempo de atuação" / "Localização" / "Tom" / "Produtos[]" → migração com `GRANT` + RLS, conforme regra do projeto.
- Se `curriculum.ts` é usado por código fora do Pilar 1, eu mantenho compat e migro só Pilar 1 para `pilar1-curriculum.ts`.

# Plano: Página Admin

## Pré-requisito: autenticação

O projeto ainda não tem login. Para "apenas eu" funcionar de verdade, preciso:

1. Ativar e-mail/senha + Google no backend.
2. Criar `/auth` (login/signup) e o layout protegido `_authenticated`.
3. Criar tabela `user_roles` (enum `app_role`: `admin`, `user`) + função `has_role` — mesmo só com você dentro, evita refazer depois quando outras admins entrarem.
4. Migração já insere seu `user_id` como `admin` (você me passa o e-mail e eu pego o id depois do primeiro login, ou seedo via SQL).

## Estrutura de rotas

```text
src/routes/
  _authenticated/
    _admin.tsx                  layout: gate has_role('admin') + sidebar admin
    _admin.admin.index.tsx      /admin  → visão geral
    _admin.admin.mentoradas.tsx
    _admin.admin.mentoradas.$id.tsx
    _admin.admin.conteudo.tsx
    _admin.admin.ranking.tsx
```

`_admin` é um layout sem path; redireciona pra `/` se o usuário não for admin (checa via server fn `requireAdmin` que usa `has_role`).

## Páginas

### 1. Visão geral (`/admin`)
Cards com: total de mentoradas, pontos distribuídos no mês, ativas nos últimos 7 dias, top 5 do ranking. Lista de atividade recente (últimos pontos somados / conquistas desbloqueadas).

### 2. Mentoradas (`/admin/mentoradas`)
- Tabela: nome, e-mail, tier atual, pontos, última atividade.
- Busca + filtro por tier.
- Ações por linha: ver detalhe, editar pontos, mudar tier, remover.
- Detalhe (`/admin/mentoradas/$id`): perfil + histórico de pontos + conquistas + botão "ajustar pontos" (modal com motivo).

### 3. Conteúdo dos pilares (`/admin/conteudo`)
- Lista os pilares e etapas atuais (lê a mesma estrutura que `src/page-views/pilar*` consome).
- Edição inline de títulos, descrições, vídeos e textos via formulário → grava em tabelas `pilar_conteudo` / `etapa_conteudo` (hoje está hardcoded; vou migrar pra DB).
- Markdown simples nos blocos de texto longo.

### 4. Ranking & Conquistas (`/admin/ranking`)
- Tabela com ranking atual.
- Botão "resetar ranking" (zera pontos do ciclo, mantém histórico).
- Atribuir/remover conquista manualmente.
- Editar sequência (streak) de uma mentorada.

## Componentes novos

- `src/components/admin/AdminSidebar.tsx` (4 itens: Visão geral, Mentoradas, Conteúdo, Ranking)
- `src/components/admin/AdminShell.tsx` (sidebar + header + Outlet)
- `src/components/admin/StatCard.tsx`, `DataTable.tsx` (encapsula shadcn `table` + busca/paginação)
- `src/components/admin/AdjustPointsDialog.tsx`

## Backend (server functions, em `src/lib/admin.functions.ts`)

Todas com `.middleware([requireSupabaseAuth])` + check `has_role(userId, 'admin')` no handler:

- `listMentoradas`, `getMentorada(id)`, `updateMentoradaTier`, `adjustMentoradaPoints`, `deleteMentorada`
- `listAtividadeRecente`, `getMetricasGerais`
- `listConteudoPilares`, `updateEtapaConteudo`
- `resetRanking`, `grantConquista`, `revokeConquista`, `updateSequencia`

## Tabelas novas (migração)

- `app_role` enum + `user_roles` + `has_role()` (padrão Lovable).
- `mentoradas` (perfil estendido por user_id) — se ainda não existe.
- `pontos_log` (id, mentorada_id, delta, motivo, criado_por, created_at).
- `conquistas` e `mentorada_conquistas` (se ainda não modeladas).
- `pilar_conteudo` / `etapa_conteudo` para o editor de conteúdo.

Todas com RLS: admin lê/escreve tudo (`has_role(auth.uid(),'admin')`), usuária comum só lê o que é dela.

## Detalhes técnicos

- Sidebar usa `shadcn/ui sidebar` com `collapsible="icon"`, item ativo via `useRouterState`.
- Tabelas usam `@tanstack/react-table` (já em uso? checar) + shadcn.
- Loaders chamam server fns via `ensureQueryData` + `useSuspenseQuery`.
- Gate do layout `_admin`: `beforeLoad` chama `requireAdmin` server fn; se 403 → `throw redirect({ to: '/' })`.
- Nenhum admin check no client (segurança real é a RLS + server fn).

## Ordem de implementação

1. Migração: auth roles + tabelas faltantes + RLS.
2. Auth: `/auth`, `_authenticated/route.tsx`, Google + email.
3. Layout `_admin` + sidebar + rota índice (visão geral com dados mock primeiro pra validar shell).
4. Server fns + página Mentoradas (CRUD completo).
5. Página Ranking & Conquistas.
6. Página Conteúdo dos pilares (depois de migrar conteúdo hardcoded pra DB).

## Pendências pra você confirmar antes de eu codar

1. Qual e-mail vai ser o admin? (pra eu seedar na migração)
2. Posso adicionar login (email + Google) agora? Sem isso, "apenas eu" não tem como ser enforced de verdade.
3. O conteúdo dos pilares hoje é hardcoded nos `.tsx` — migrar pra DB é trabalho considerável. Quer já nessa leva, ou deixo a aba "Conteúdo" pra depois?

# The Content Lab — engenharia reversa completa
**Alvo:** `https://contentlabia.com.br`
**Data da análise:** 18 de agosto de 2026
**Método:** navegação autenticada + inspeção do bundle JavaScript + interceção das chamadas de rede (fetch/Web Worker) na sessão da própria conta.
> Tudo o que está aqui foi obtido do que o browser recebe publicamente (código do cliente, chamadas de rede da minha própria sessão). O código do servidor — os *system prompts* dentro das Edge Functions — não é visível e **não** está reconstruído aqui. O que está reconstruído são os *user prompts* montados no cliente, que são visíveis.

---

## 1. Veredito em 30 segundos
The Content Lab é um **SaaS de geração de conteúdo para Instagram** construído no **Lovable** (React + Vite + shadcn/ui + Supabase), com toda a lógica de IA em **Supabase Edge Functions** que fazem streaming SSE de modelos Gemini/GPT.
O produto em si é tecnicamente simples. **O valor não está no código — está em três coisas:**
1. **O briefing estruturado** (20 perguntas sobre nicho, público, posicionamento e autoridade) que vai em *todas* as chamadas de IA.
2. **O catálogo de formatos** (20 formatos de Reels/Carrossel/Stories, cada um com definição, estrutura obrigatória e exemplos reais do Instagram).
3. **A memória** que extrai preferências das conversas e as reinjeta nas seguintes.
Isto é replicável por uma pessoa em poucas semanas. A parte difícil é a metodologia editorial, não a engenharia.

---

## 2. Stack técnica confirmada

| Camada | Tecnologia | Como sei |
|---|---|---|
| Build | **Vite** (SPA, sem SSR) | `assets/index-CMMcQCCK.js` + `index-CetovVz3.css` com hash Vite |
| UI | **React + React Router** | global `__reactRouterVersion`; `path:"..."` em array de rotas |
| Componentes | **shadcn/ui** (Radix) + Tailwind + **lucide-react** + **sonner** (toasts) | strings `radix`, `lucide`, `sonner` no bundle; classes `text-muted-foreground`, `bg-background` |
| Origem | **Lovable** | script `/~flock.js` (analytics do Lovable), OG image em `pub-*.r2.dev/.../id-preview-*` (padrão de preview do Lovable) |
| Backend | **Supabase** — projeto `jweqsctpjjzuwkjfljqs` | `supabase.co/rest/v1/...`, `/auth/v1/...`, `/functions/v1/...` |
| Auth | Supabase Auth (JWT em `localStorage`, chave `sb-<ref>-auth-token`) | |
| Base de dados | Postgres + PostgREST (`.from("tabela").select(...)` no cliente) | 36 tabelas identificadas |
| Lógica de IA | **Supabase Edge Functions** (Deno) | 26 funções identificadas |
| Modelos | `google/gemini-2.5-flash`, `2.5-flash-lite`, `2.5-pro`, `3-flash-preview`, `3.5-flash`, `3.6-flash`, `3.1-flash-lite`, `3-pro-preview`, `3.1-pro-preview`, `3-pro-image-preview`, `3.1-flash-image-preview`, `openai/gpt-5`, `gpt-5-mini`, `gpt-5-nano`, `gpt-5.2` | tabela de preços por 1M tokens embutida no painel admin |
| Gateway de IA | **Lovable AI Gateway** (inferência forte, ver §12) | prefixos `google/` e `openai/` + resposta SSE formato OpenAI |
| Pagamentos | **Stripe** (internacional) + **Pagar.me** (Brasil, Pix/boleto) | funções `create-checkout`, `customer-portal`, `pagarme-checkout`, `public-checkout`, `get-pagarme-email` |
| Analytics | Meta Pixel (`fbq`), Microsoft Clarity, endpoint próprio `/~api/analytics` | |
| i18n | **i18next** — pt / en / es, dicionários embutidos no bundle | `cl_ui_language` no localStorage |
| Extras no bundle | `jsPDF` + `html2canvas` (exportar PDF), `recharts` (gráficos admin), `react-markdown` + `DOMPurify` (render das respostas), `zod`, `react-hook-form`, `date-fns`, `embla` (carrosséis de UI) | |

**Tamanho do bundle:** 3,23 MB num único ficheiro JS. Não há code-splitting. É a assinatura clássica de app Lovable que cresceu muito.

---

## 3. Mapa de rotas (~68 rotas)

### App (autenticado)
```
/                       hub "O que vamos criar?" → Reels | Carrossel | Stories
/criar/reels            wizard: objetivo → formato → gerar
/criar/carrossel        idem
/criar/stories          idem
/chat                   ecrã de conversa/geração (destino dos wizards)
/historico              histórico com filtros por tipo/formato/objetivo
/assistente             "Estrategista de Criação" (BETA) — chat aberto
/assistente/:conversationId
/memorias               "Memória da IA" (4 tabs: Memórias | Campanhas | Histórias | Diagnóstico)
/analise-perfil         análise de perfil de Instagram por colagem de dados
/design-templates       100 templates de Canva
/desafios               "Content Sprint" — turmas/desafios gamificados
/desafio-sprint/:day    desafio do dia
/desafio-sprint-t2/:day turma 2
/configuracoes          hub de definições
/briefing-score         formulário do briefing + avaliação por IA
/tutorial               vídeos de onboarding
```

### Auth
```
/login  /cadastro  /reset-password  /completar-perfil
```

### Admin
```
/admin/usuarios  /admin/consumo  /admin/leads-vsl  /admin/links
/admin/anti-patterns  /admin/liberar-teste  /admin/afiliados
/admin/test-email  /admin/backfill-telefones  /admin/sprint-entregas
```

### Marketing / funil (é aqui que está metade da app)
```
/vendas  /vendas-nova  /vendas-promo  /vendas-vsl-promo  /vendas-mentorados  /vendas-alunas-gio
/assinar  /assinar-promo
/teste-gratis  /teste-gratis-desconto  /teste-gratis-agencias
/garantir-teste  /garantir-teste-30  /garantir-teste-15
/captura-vsl  /captura-vsl-promo  /aula
/ofertaCL  /desconto-especial  /desconto-especial-limitado  /desconto-especial-planos
/promo-alunos  /promo-agencia  /grupo-aceleracao  /mentorados-gio
/grupovip  /grupovipdesafiosprint  /garantirdesafiosprint
/afiliados  /adicionarcontas  /diagnostico  /unsubscribe
```
**Nota estratégica:** cerca de 30 das 68 rotas são páginas de venda. É um produto de infoproduto/lançamento com um SaaS por baixo, não o contrário. Cada campanha tem a sua landing page dedicada no mesmo código.

---

## 4. Modelo de dados (36 tabelas)

### Núcleo
| Tabela | Papel |
|---|---|
| `profiles` | **O briefing.** Uma linha por "conta de Instagram gerida". Colunas: `id, user_id, email, nome, contact_email, whatsapp, cpf, genero, instagram_handle, avatar_url, is_active, nicho, subnicho, info_adicional, cliente_ideal, frustra_cliente, desejo_cliente, objecoes, perfil_comprador, historia_origem, defesas_nicho, valores, tom_voz, assuntos_evitar, resultado_cliente, diferencial, produtos, promessas_produtos, concorrentes, ui_language, content_language, created_at, updated_at` |
| `content_history` | Um registo por conteúdo gerado: `id, user_id, profile_id, conversation_id, title, title_is_final, preview, full_content, content_type, content_format, content_objective, source, metadata, created_at` |
| `chat_messages` | Mensagens do criador: `id, user_id, profile_id, conversation_id, role, content, is_initial_prompt` |
| `assistant_conversations` / `assistant_messages` | Threads do Estrategista (separado do criador) |
| `user_ai_memory` | **A memória.** `user_id, profile_id, memory_type ('learning' \| 'rule' \| 'preference'), content, importance (1–5)` |
| `content_feedback` | 👍/👎 por mensagem: `user_id, conversation_id, message_index, rating` (upsert com onConflict) |
| `user_roles` | RBAC (`role = 'admin'`) — tabela separada, padrão correto no Supabase |

### Camada editorial (curada pelo admin, injetada nos prompts)
| Tabela | Papel |
|---|---|
| `reference_templates` | Modelos de referência por formato — "a BASE para criar o conteúdo" |
| `content_guidelines` | Diretrizes/regras por formato |
| `content_anti_patterns` | O que a IA **não** pode fazer (tem painel admin próprio em `/admin/anti-patterns`) |

Este trio é o segredo do produto. É o que faz a saída soar a método próprio em vez de ChatGPT genérico.

### Análise de perfil e planeamento
`my_profile_info` (`instagram_username, strategic_name, biography, highlights, no_highlights, followers_count, followers_updated_at`), `saved_profile_analyses`, `weekly_diagnostics`, `campaigns`, `user_stories` (banco de histórias pessoais reutilizáveis), `briefing_scores`.

### Negócio
`user_plan_cache` (`plan_label, plan_variant, payment_failed, payment_failed_at`), `trial_grants`, `affiliates` (`pix_key, pix_key_type, pix_holder_name`), `affiliate_referrals` (`amount_cents, commission_cents, status, payout_status`), `vsl_leads`, `cancellation_reasons`, `ai_usage_logs`, `user_tracking_checks`, `welcome_messages_sent`.

### Gamificação (Content Sprint)
`sprint_config`, `sprint_challenges` (`day_number, title, unlock_at`), `sprint_challenge_examples`, `sprint_challenge_files`, `sprint_checklist_items`, `sprint_progress` (`instagram_url, submission_status, submission_note, admin_feedback, reviewed_at, is_draft`).

### Outras
`tutorial_seen`, `tutorial_config`, `community_popup_seen`, `design_template_thumbnails`.

---

## 5. Edge Functions (26)

### IA
| Função | O que faz |
|---|---|
| `generate-content` | **O motor.** Streaming SSE do conteúdo. |
| `assistant-chat` | Estrategista (chat aberto, streaming). |
| `extract-memory` | Corre em background depois da conversa; extrai aprendizados → `user_ai_memory`. |
| `analyze-instagram` | Análise de perfil a partir de bio/destaques/métricas coladas. |
| `help-chat` | Chat de suporte (só precisa da anon key, sem login). |
| `evaluate-briefing` | Dá nota ao briefing → `briefing_scores`. |
| `transcribe-audio` | Ditado por voz no input. |
| `extract-briefing-pdf` | Importar briefing de um PDF. |

### Pagamentos e acessos
`check-subscription`, `create-checkout`, `customer-portal`, `pagarme-checkout`, `public-checkout`, `get-checkout-email`, `get-pagarme-email`, `create-additional-account-checkout`, `grant-trial-access`, `claim-trial`, `connect-onboarding`.

### Admin/ops
`admin-users`, `admin-affiliates`, `admin-send-test-email`, `admin-backfill-customer-phones`, `admin-export-subscribers`, `handle-email-unsubscribe`, `check-sprint-links`.

---

## 6. Contrato da API de geração (capturado ao vivo)
`POST https://<ref>.supabase.co/functions/v1/generate-content`
Headers: `Content-Type: application/json`, `Authorization: Bearer <access_token do utilizador>`, `apikey: <anon key>`
```jsonc
{
  "messages": [                       // histórico completo da conversa
    { "role": "user",      "content": "Criar conteúdo para:\nTipo: Reels\nObjetivo: Crescimento\nDireção estratégica do objetivo: Atrair novos seguidores com conteúdo educativo e dicas práticas\nFormato: Lo-fi" },
    { "role": "assistant", "content": "Boa escolha 🔥 **Lo-fi** é uma boa pedida...." },
    { "role": "user",      "content": "Sugere 1 tema e escreve o roteiro completo" }
  ],
  "profile": {                        // o briefing inteiro, em TODAS as chamadas
    "genero": "...", "nicho": "...", "subnicho": "...",
    "cliente_ideal": "...", "frustra_cliente": "...", "desejo_cliente": "...",
    "objecoes": "...", "perfil_comprador": "...",
    "historia_origem": "...", "defesas_nicho": "...", "valores": "...",
    "tom_voz": "...", "assuntos_evitar": "...",
    "resultado_cliente": "...", "diferencial": "...",
    "produtos": "...", "promessas_produtos": "...", "concorrentes": "..."
  },
  "contentType": "reels",             // reels | carrossel | stories
  "objective": "Crescimento",         // Crescimento | Engajamento | Vendas
  "format": "Lofi",
  "userId": "<uuid>",
  "profileId": "<uuid>",
  "conversationId": "<uuid>",
  "source": "criador"                 // criador | assistente | sprint | captura-vsl
}
```
**Modo secundário — gerar título:** o mesmo endpoint com `{ titleOnly: true, contentToSummarize: "<1500 chars>", contentType, format }`. Devolve JSON normal (sem streaming). É como as conversas ganham nome no histórico.
**Resposta:** SSE compatível com OpenAI.
```
data: {"choices":[{"delta":{"content":"texto"}}]}
data: [DONE]
```
Parsing no cliente: `response.body.getReader()`, split por `\n`, ignora linhas `:` e vazias, corta o prefixo `data: `, `JSON.parse`, lê `choices[0].delta.content`.
**Detalhe de engenharia que vale copiar:** o streaming corre dentro de um **Web Worker** (`postMessage({type:'start', url, headers, body})` → `{type:'chunk'|'done'|'error'}`). Motivo: quando o utilizador muda de separador ou o telemóvel bloqueia, o main thread é estrangulado pelo browser e a stream morre a meio. No worker, sobrevive. Há ainda `visibilitychange`/`pagehide` handlers e backup do rascunho em `localStorage` (`current-chat-backup-<profileId>`), com retry uma vez em caso de erro do worker.

---

## 7. A camada de inteligência (o que realmente faz o produto)
O prompt final que chega ao modelo é montado em **duas metades**:

**No cliente** (visível, reconstruído abaixo) — a mensagem de utilizador:
```
Quero criar Stories para Instagram no formato {LABEL_DO_FORMATO}.
## MEU BRIEFING/CONTEXTO:
- Nicho: {nicho}
- Resultado que gero para clientes: {resultado_cliente}
- Cliente ideal: {cliente_ideal}
- Meu diferencial: {diferencial}
- Produtos e preços: {produtos}
IMPORTANTE SOBRE O BRIEFING: NÃO copie literalmente o que está escrito no briefing.
INTERPRETE o briefing para entender o contexto, o tom, o público e o posicionamento —
e use essa compreensão para criar o conteúdo de forma natural e estratégica.
Nem tudo do briefing precisa aparecer em todos os conteúdos.
## ESPECIFICAÇÕES DO CONTEÚDO:
Tipo de conteúdo: {descrição do tipo}
Objetivo: {descrição do objetivo}
Formato: {descrição do formato}
IMPORTANTE: Siga OBRIGATORIAMENTE os Templates de Referência e as Diretrizes de
Conteúdo cadastradas. Eles são a BASE para criar o conteúdo.
INSTRUÇÃO OBRIGATÓRIA: NÃO crie o conteúdo agora. Esta é a PRIMEIRA mensagem. Você DEVE primeiro:
1. Perguntar se já tem tema/ideia em mente, ou se prefere que você sugira algo estratégico.
2. Perguntar se tem conteúdo de referência (link, print, texto) para usar como base.
Só crie DEPOIS que o usuário responder.
```

**No servidor** (invisível) — o system prompt + `reference_templates` + `content_guidelines` + `content_anti_patterns` + memórias + histórico recente, tudo lido da base de dados e concatenado dentro da Edge Function.

### Estruturas obrigatórias por tipo (extraídas do bundle)
**Carrossel — ESTRUTURA PADRÃO:**
```
[CAPA]              Título claro, persuasivo, direto ao ponto. Promessa + lacuna de
                    interesse. Gancho forte, frase curta e curiosa.
[SLIDE 2]           Aquecimento/Contexto: introduz o tema, gera identificação ou quebra
                    crença. Dispositivos: reforço da promessa, explicativo,
                    identificação/história, transformação, contra-intuitivo, sumário,
                    posicionamento/opinião.
[SLIDES 3-6]        Conteúdo: desenvolvimento claro e objetivo, UMA ideia por página.
                    Entregue bem, mas não entregue tudo.
                    Dispositivos: lista, analogia, análise, história + moral, ponto de vista.
[ÚLTIMAS PÁGINAS]   Conclusão + CTA: continuidade lógica, tom coerente, reforço de benefício.
+ Sugestões visuais para cada slide
+ Legenda completa
(recomendação: 7–10 slides)
```
**Reels — estrutura:** `[GANCHO] → [IDENTIFICAÇÃO] → [CONTEÚDO] → [CTA]`
Saída real observada: blocos `[GANCHO]`, `[CONTEÚDO]`, `[CTA - FINALIZAÇÃO]`, depois `GRAVAÇÃO:` (instruções de câmara/cenário) e `LEGENDA:` (legenda completa pronta a colar).
**Stories:** antes de gerar, faz um **QUESTIONÁRIO DE ROTINA** obrigatório — pergunta como é o dia da pessoa, e depois insere os stories nesse fluxo real. Formatos "conexão"/"desejo" → 3-4 stories independentes. Formatos "narrativa-vendas"/"conteúdo-premium" → sequência encadeada a partir de um ponto da rotina.

### Padrão de conversa em vez de formulário
O sistema **nunca gera à primeira**. A primeira resposta é sempre uma pergunta ("já tens tema ou queres que sugira?"). Isto:
- baixa a taxa de output mau (o modelo tem contexto do tema real antes de escrever),
- faz o utilizador sentir que está a colaborar, não a receber output de máquina,
- e cria mais turnos → mais material para a memória extrair.

### Fecho de ciclo — sugestões encadeadas
No fim de cada geração, a IA sugere 3 conteúdos seguintes, um de cada tipo, com formato nomeado:
> Carrossel (Dualidade): "..." · Reels (Fala Dinâmica): "..." · Stories (Conexão): "..."
Isto é o motor de retenção. O utilizador nunca sai do produto sem saber qual é o próximo passo.

### Memória
`extract-memory` corre depois da conversa (≥2 mensagens), envia `{userId, profileId, conversationId, messages}` e grava em `user_ai_memory` com `memory_type` (vi `learning` e `rule` no código; a UI agrupa em Aprendizado e Preferência) e `importance` 1–5 (mostrado como estrelas na UI). O utilizador pode ver, editar, adicionar regras manuais e limpar tudo em `/memorias`. Exemplos reais que vi na conta:
- *"O usuário gosta do formato 'Dualidade' para carrosséis, com contraste lado a lado no mesmo slide"* ★★★★★
- *"Valoriza um tom de voz íntimo, com pausas e verdade, ideal para formatos como Lo-fi"* ★★★★☆

---

## 8. Catálogo de formatos (o IP editorial)
**3 objetivos**, cada um com uma "direção estratégica" que entra literalmente no prompt:

| Objetivo | Direção estratégica injetada |
|---|---|
| Crescimento | Atrair novos seguidores com conteúdo educativo e dicas práticas |
| Engajamento | Gerar interação com perguntas, enquetes e conteúdo relatable |
| Vendas | Converter seguidores em clientes com gatilhos mentais e CTAs |

**Reels (9 formatos)**
| id | Label | Descrição |
|---|---|---|
| `lo-fi` | Lo-fi | Conteúdo autêntico e casual, sem produção elaborada |
| `leia-legenda` | Leia a Legenda | Vídeo visual com texto completo na legenda |
| `fala-dinamica` | Fala Dinâmica | Pessoa falando com cortes rápidos e energia |
| `serie` | Série | Conteúdo em episódios que gera recorrência |
| `sketch` | Sketch | Encenação ou humor para transmitir uma mensagem |
| `rotina` | Rotina | Bastidores e dia a dia que geram conexão |
| `pauta-quente` | Pauta Quente | Conteúdo sobre assunto atual e relevante do nicho |
| `narrado` | Narrado | Voz sobre imagens ou vídeos de apoio |
| `outro` | Outro Formato | Formato livre com estrutura estratégica personalizada |

**Carrossel (7 formatos)**
| id | Label | Descrição |
|---|---|---|
| `storytelling` | Storytelling | Narrativa envolvente que conecta emocionalmente |
| `dualidade` | Dualidade | Comparação entre dois lados opostos de um tema |
| `erro-comum` | Erro Comum | Erros frequentes que o público comete e como evitar |
| `pauta-quente` | Pauta Quente | Conteúdo sobre trends e assuntos do momento |
| `jeito-certo-errado` | Jeito Certo / Errado | Contraste entre o que funciona e o que não funciona |
| `lista` | Lista | Lista de itens empilháveis: ferramentas, apps, livros |
| `outro` | Outro Formato | Estrutura padrão de carrossel |

**Stories (4 formatos)**
| id | Label | Descrição |
|---|---|---|
| `conexao` | Story de Conexão | Sequência que cria proximidade e identificação |
| `desejo` | Story de Desejo | Desperta desejo e aspiração através de narrativa estratégica |
| `narrativa-vendas` | Narrativa de Vendas | Sequência estratégica para conduzir até a compra |
| `conteudo-premium` | Conteúdo Premium | Ensina de forma leve dentro da rotina, gerando autoridade |

**Categorias de gravação** (segunda dimensão, para Reels): `humanizado`, `editado`, `broll_texto`, `narrado`, `encenado` — cada uma com descrição e **um link real de Instagram como exemplo**. Cada formato de carrossel também tem 1–4 URLs de posts reais como referência visual.
> Copiar este catálogo tal e qual seria copiar o produto dela. O que vale copiar é a **arquitetura**: `objetivo × formato × categoria de gravação`, cada um com definição curta + descrição longa + exemplos reais. Os teus formatos têm de sair do teu método.

---

## 9. Fluxos de UX
**Criar conteúdo (3 cliques até à IA):**
`/` escolhe tipo → `/criar/{tipo}` escolhe objetivo + formato (cards em carrossel horizontal, com ⓘ para ver detalhes) → botão "Gerar" → `/chat` com mensagem de boas-vindas escrita **no cliente**, sem chamar a IA:
> "Boa escolha 🔥 **Lo-fi** é uma boa pedida. Funciona muito bem quando a entrega é íntima, com pausas e verdade. Você já tem alguma ideia ou tema em mente, ou prefere que eu sugira?"
Truque barato e eficaz: percepção de resposta instantânea, custo zero de tokens.

**Durante a geração:** frases rotativas de "a pensar" — *"Consultando seu briefing" → "Analisando seu perfil" → "Revisando o histórico da conversa" → "Pensando na melhor abordagem" → "Organizando as ideias" → "Estruturando a resposta"*. Não é telemetria real; é gestão de expectativa. Mas ensina ao utilizador o que o sistema faz.

**Depois:** 👍/👎 por mensagem (`content_feedback`), input de refinamento ("Peça alterações ou refinamentos no conteúdo gerado"), anexos e ditado por voz.

**Estrategista** (`/assistente`): chat aberto com 6 prompts de arranque em cartões — Analisar meu perfil / Planejar minha semana / Revisar posicionamento / Ideias agora / Melhorar bio / Estratégia de vendas.

**Briefing** (`/briefing-score`): 4 tabs com 20 perguntas em português coloquial (não "value proposition", mas "Por que você é diferente?"). Tem vídeo de apoio embutido e botão **"Avaliar Briefing"** que dá nota por IA — gamificação que resolve o problema n.º 1 destes produtos: briefings preenchidos à pressa.

| Tab | Perguntas |
|---|---|
| **Nicho** | Qual o seu @ no Instagram? · Você é homem/mulher? · Qual o seu nicho? · Qual seu subnicho / temas que você fala? · Informações adicionais sobre você |
| **Público** | Descreva o seu cliente ideal · O que eles odeiam / os frustra? · O que eles amam / querem alcançar? · Quais suas maiores objeções de venda? · Quem mais compra seus produtos? |
| **Posicionamento** | Como você começou a fazer o que faz? · O que você defende no seu nicho? · Seus valores (vida e trabalho)? · Tom de voz e comunicação? · Assuntos ou termos que você evita falar? |
| **Autoridade** | Que resultado você gera para seu cliente? · Por que você é diferente? · Produtos e preços? · Promessas de cada produto? · Seus maiores concorrentes (URLs)? |

**Multi-perfil:** `profiles` é 1-para-N com o utilizador. Trocar de perfil troca todo o contexto (briefing, memória, histórico). Contas extra são um upsell (`create-additional-account-checkout`) — é assim que o plano de agências funciona.

---

## 10. Modelo de negócio
**Preços** (agosto 2026):
- Mensal **R$ 297/mês** — só cartão
- Anual **R$ 2.997/ano** (≈R$ 250/mês, −16%), até 12x, aceita Pix/boleto, com 3 bónus em vídeo (Reels Milionários, Stories Premium, Carrosséis Engajados)
- Agências: a partir de 2 contas, sob consulta

**Mecânicas de crescimento observadas:**
- Trial com "garantia" (`/garantir-teste`, `-30`, `-15` → provavelmente R$30 e R$15 de entrada), `grant-trial-access` + `claim-trial`
- Funil de VSL com captura de leads (`vsl_leads`, `/captura-vsl`, `/aula`)
- Programa de afiliados com pagamento por Pix (`affiliates`, `affiliate_referrals`, comissões em cêntimos, estado de payout)
- **Content Sprint**: desafio por turmas, um desafio por dia com `unlock_at`, entrega via link do Instagram, revisão manual pelo admin com feedback, ranking, checklist e ficheiros. Sistema de validação de links com razões de rejeição (`not_reel`, `duplicate_other_user`, `profile_link`, `unavailable_link`…). É retenção e prova social ao mesmo tempo.
- Popup de comunidade, mensagens de boas-vindas rastreadas, motivo de cancelamento registado, `ai_usage_logs` + `/admin/consumo` para vigiar margem por utilizador.

---

## 11. Como construir a tua versão

### Fase 0 — decidir o teu IP editorial (antes de tocar em código)
Isto é 80% do trabalho e não envolve programar.
1. Escreve **os teus formatos**: 6–8 para começar, cada um com `id`, label, descrição de 1 linha, "detalhes" de 3 linhas e 1–3 exemplos reais.
2. Escreve **a estrutura obrigatória** de cada tipo de conteúdo (o teu equivalente ao `[CAPA] → [SLIDE 2] → ...`).
3. Escreve os **anti-padrões**: o que a IA nunca pode fazer (no teu caso já tens isto no briefing — "fórmulas mágicas", "segredo revelado", urgência artificial).
4. Define as **perguntas do briefing** na tua linguagem.
Guarda tudo em tabelas, não hard-coded. Queres poder afinar sem deploy.

### Fase 1 — MVP (1–2 semanas)
Stack recomendada, quase idêntica à deles porque é a certa para isto:
```
Frontend   React + Vite + TypeScript + Tailwind + shadcn/ui
Router     react-router
Backend    Supabase (Auth + Postgres + RLS + Edge Functions + Storage)
IA         SDK do provedor direto (Anthropic ou Google) numa Edge Function,
           com streaming SSE. Não precisas de gateway no início.
Pagamentos Stripe (Portugal/EU). Adiciona Pagar.me/Mercado Pago só se fores ao Brasil.
Deploy     Vercel/Netlify para o SPA; Supabase aloja o resto.
```
Tabelas mínimas:
```sql
profiles          -- briefing (as tuas 15-20 colunas de texto)
content_history   -- id, user_id, profile_id, conversation_id, title, preview,
                  -- full_content, content_type, content_format, content_objective,
                  -- source, metadata jsonb, created_at
chat_messages     -- conversation_id, role, content, created_at
user_ai_memory    -- profile_id, memory_type, content, importance
content_formats   -- id, content_type, label, description, details, examples jsonb
content_guidelines -- content_type, format_id, body
content_anti_patterns -- body, is_active
content_feedback  -- conversation_id, message_index, rating
user_roles        -- role
```
**RLS obrigatória em todas.** É o único ponto onde um erro te expõe: com Supabase o cliente fala diretamente com o Postgres. Política base: `auth.uid() = user_id`. Nunca uses a service-role key no frontend.
Uma única Edge Function `generate-content` que:
1. valida o JWT,
2. carrega `profile`, `content_formats`, `content_guidelines`, `content_anti_patterns`, últimas N memórias e últimos M títulos do histórico,
3. monta o system prompt,
4. faz streaming SSE de volta.

### Fase 2 — o que torna o produto pegajoso
- Memória (função assíncrona de extração + página para o utilizador ver e editar)
- Sugestões dos 3 próximos conteúdos no fim de cada geração
- Histórico com filtros
- 👍/👎 por mensagem

### Fase 3 — negócio
Stripe + checkout, trial, página de preços, analytics de consumo por utilizador.

### Detalhes de engenharia que vale a pena roubar
- **Streaming num Web Worker.** Poupa-te dias de bugs "a resposta parou a meio no telemóvel".
- **Backup do rascunho em `localStorage`** por conversa, restaurado ao voltar.
- **Primeira mensagem escrita no cliente**, sem chamar a IA.
- **Título gerado numa segunda chamada barata** (`titleOnly: true`) com um modelo lite.
- **Cache do perfil em `localStorage`** (`cl_profile_cache_v1:<profileId>`) para não bloquear o primeiro render.
- **Frases rotativas de "a pensar"** que descrevem o que o sistema realmente faz.
- **Roteamento de modelos por tarefa:** flash-lite para títulos e memória, pro para o conteúdo. Eles têm 15 modelos configurados e um painel de custo — a margem vive aqui.
- **`user_roles` em tabela separada** com função `has_role()` em SQL, não uma coluna `is_admin` no perfil.

### Prompt de arranque, se fores construir com Lovable/Claude Code
```
Constrói um SaaS em React + Vite + TypeScript + Tailwind + shadcn/ui com Supabase.
Auth por email/password. Uma tabela `profiles` (1:N com auth.users) com o briefing:
nicho, subnicho, cliente_ideal, frustra_cliente, desejo_cliente, objecoes,
perfil_comprador, historia_origem, defesas_nicho, valores, tom_voz,
assuntos_evitar, resultado_cliente, diferencial, produtos, promessas_produtos.
RLS em tudo (auth.uid() = user_id).
Fluxo principal: hub → escolher tipo (Reels/Carrossel/Stories) → escolher objetivo
(Crescimento/Engajamento/Vendas) e formato (cards horizontais com descrição e ⓘ)
→ ecrã de chat.
No chat, a primeira mensagem do assistente é gerada no cliente (sem IA) e pergunta
ao utilizador se já tem tema. As respostas seguintes vêm de uma Edge Function
`generate-content` que faz streaming SSE, executado num Web Worker no cliente.
A Edge Function monta o system prompt com: briefing + definição do formato +
diretrizes + anti-padrões + memórias + últimos títulos do histórico.
Guardar cada geração em `content_history`. Página `/historico` com filtros.
Página `/memorias` para ver e editar o que a IA aprendeu.
```

---

## 12. Suposições e limites desta análise
**Confirmado por observação direta:** stack, rotas, tabelas, nomes das Edge Functions, payload da API, formato SSE, catálogo de formatos, estruturas de conteúdo citadas, briefing, preços, saída real do produto.

**Inferência forte (não confirmada):**
- **Lovable AI Gateway** como provedor. Evidência: IDs de modelo com prefixo `google/`/`openai/` no mesmo namespace, resposta SSE em formato OpenAI, e o resto da app é Lovable. Não vi o hostname do gateway porque a chamada acontece no servidor. Pode ser OpenRouter — o padrão é o mesmo.
- Valores dos trials (`-30`, `-15`) inferidos dos nomes das rotas.

**Não acessível:** system prompts dentro das Edge Functions, conteúdo das tabelas `reference_templates` / `content_guidelines` / `content_anti_patterns` (só o admin lê), código das funções, políticas RLS exatas.

**Nota legal, sem drama:** analisar o cliente de um site e perceber a arquitetura é normal e é para isso que existem as devtools. Construir um produto concorrente com a mesma arquitetura também é normal — nada disto é patenteável. O que **não** deves fazer é copiar textualmente o catálogo de formatos, as descrições, os textos das landing pages ou a identidade visual: isso é o trabalho autoral deles e é onde há risco real. Usa a estrutura, escreve o conteúdo com o teu método.

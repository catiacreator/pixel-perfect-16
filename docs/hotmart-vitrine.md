# Vitrine + desbloqueio por compra na Hotmart

Guia para ativar a venda por módulo: os cards da homepage e as rotas ficam **bloqueados** até a pessoa comprar na Hotmart; a compra **desbloqueia automaticamente** (webhook) para o email do comprador.

---

## Como funciona

```
Card/rota bloqueado ──► "Desbloquear na Hotmart" ──► checkout Hotmart
                                                          │ compra aprovada
                                                          ▼
                       Hotmart envia postback ──► /api/hotmart-webhook
                                                          │ grava em module_purchases (por email)
                                                          ▼
                       Pessoa entra com esse email ──► módulo desbloqueado ✅
```

- **Admin (mentora)** vê tudo desbloqueado — nunca fica trancada fora.
- O acesso é verificado pelo **email** do utilizador autenticado.

## Módulos (produtos separados)
| Módulo | Card / rotas | Produto Hotmart |
|--------|--------------|-----------------|
| `jornada` | A sua jornada · `/metodo`, pilares 1–4, `/doc-mestre` | (a definir) |
| `academia` | Academia de IA · `/metodo/pilar-1/aprenda-ia/*` | (a definir) |
| `redes` | Criando para as Redes Sociais · `/metodo/pilar-2/redes-sociais/*` | (a definir) |

---

## Checklist de ativação

### 1. Aplicar a migração da base de dados
Cria a tabela `module_purchases` (+ RLS): `supabase/migrations/20260629120000_module_purchases.sql`.
- No **Lovable/Supabase**, aplica as migrações (ou cola o SQL no SQL Editor do Supabase).

### 2. Variáveis de ambiente (servidor)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase → Settings → API Keys → chave **service_role** (secreta). O webhook precisa dela para gravar.
- `HOTMART_HOTTOK` — o token (hottok) do webhook da Hotmart.
> Secretas: só em variáveis de ambiente do servidor. Nunca no frontend nem no git.

### 3. Preencher os produtos em `src/lib/access.ts`
Para cada módulo:
- `checkoutUrl` — link de checkout da Hotmart (faz o botão "Desbloquear na Hotmart" abrir a compra).
- `hotmartProductId` — id do produto na Hotmart (o webhook usa-o para desbloquear o módulo certo).

### 4. Configurar a postback/webhook na Hotmart
- Em cada produto: **Ferramentas → Webhook (Postback)**.
- URL: `https://<o-teu-dominio>/api/hotmart-webhook`
- Versão: **2.0** (envia JSON com `data.product.id`, `data.buyer.email`, `event`).
- Eventos: Compra aprovada/completa + reembolso/chargeback/cancelamento.
- Copia o **hottok** gerado → coloca em `HOTMART_HOTTOK`.

---

## Eventos tratados pelo webhook
- **Ativa:** `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`, `PURCHASE_PROTEST_REVERSAL`
- **Revoga:** `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`, `PURCHASE_CANCELED`, `PURCHASE_EXPIRED`, `SUBSCRIPTION_CANCELLATION`

## Testar
1. Faz uma compra de teste (ou usa o botão "Enviar teste" da Hotmart).
2. Confirma que aparece uma linha em `module_purchases` (status `active`, email certo).
3. Entra na app com esse email → o módulo deixa de estar bloqueado.

## Notas
- Enquanto `checkoutUrl` estiver vazio, o card bloqueado fica "Em breve na Hotmart" (não clicável).
- Se a pessoa comprou antes de ter conta: a compra fica gravada pelo email; ao criar conta com o mesmo email, desbloqueia.
- Ficheiros: `src/lib/access.ts`, `src/lib/use-access.ts`, `src/routes/api/hotmart-webhook.ts`, `src/components/ModulePaywall.tsx`, `src/components/Layout.tsx` (guard), `src/page-views/Home.tsx` (cards).

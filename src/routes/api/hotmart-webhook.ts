import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { moduleByHotmartProduct } from "@/lib/access";

// Eventos que ATIVAM o acesso / que o REVOGAM.
const ATIVA = ["PURCHASE_APPROVED", "PURCHASE_COMPLETE", "PURCHASE_PROTEST_REVERSAL"];
const REVOGA = [
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED",
  "PURCHASE_EXPIRED",
  "SUBSCRIPTION_CANCELLATION",
];

function ok(msg: string, status = 200) {
  return new Response(JSON.stringify({ ok: status === 200, msg }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/hotmart-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1) Validar o token (hottok) da Hotmart
        const expected = process.env.HOTMART_HOTTOK;
        if (!expected) return ok("HOTMART_HOTTOK não configurado", 500);

        const url = new URL(request.url);
        let body: any = {};
        try {
          body = await request.json();
        } catch {
          /* body pode vir vazio */
        }
        const token =
          request.headers.get("x-hotmart-hottok") ||
          url.searchParams.get("hottok") ||
          body?.hottok;
        if (token !== expected) return ok("Token inválido", 401);

        // 2) Extrair dados (formato webhook Hotmart 2.0)
        const event: string = body?.event || "";
        const data = body?.data || {};
        const productId = String(data?.product?.id ?? "");
        const email: string = (data?.buyer?.email || "").trim().toLowerCase();
        const transaction: string = data?.purchase?.transaction || "";

        if (!email || !productId) return ok("Sem email/produto — ignorado");

        const moduleKey = moduleByHotmartProduct(productId);
        if (!moduleKey) return ok(`Produto ${productId} não mapeado a nenhum módulo`);

        const status = ATIVA.includes(event) ? "active" : REVOGA.includes(event) ? "inactive" : null;
        if (!status) return ok(`Evento ${event} ignorado`);

        // 3) Tentar ligar ao utilizador pelo email (se já tem conta)
        let userId: string | null = null;
        try {
          const { data: prof } = await (supabaseAdmin as any)
            .from("profiles")
            .select("id")
            .ilike("email", email)
            .maybeSingle();
          userId = prof?.id ?? null;
        } catch {
          /* sem profile ainda — fica só pelo email */
        }

        // 4) Gravar/atualizar a compra (service role ignora RLS)
        try {
          await (supabaseAdmin as any)
            .from("module_purchases")
            .upsert(
              {
                user_id: userId,
                email,
                module_key: moduleKey,
                status,
                hotmart_product_id: productId,
                hotmart_transaction: transaction,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "email,module_key" },
            );
        } catch (e) {
          return ok("Erro a gravar compra: " + (e instanceof Error ? e.message : String(e)), 500);
        }

        return ok(`Módulo ${moduleKey} -> ${status} para ${email}`);
      },
    },
  },
});

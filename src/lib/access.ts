// Controlo de acesso — vitrine na homepage + desbloqueio via compra na Hotmart.
//
// MODELO: PRODUTO ÚNICO. A plataforma é vendida como UM só produto.
// Comprar esse produto desbloqueia TODOS os módulos de uma vez.

// Admin FIXO no código — só a conta dona, para nunca perder acesso.
// Todos os outros admins são geridos pelo painel (papel na base de dados,
// tabela user_roles). Assim, marcar um email como aluno no painel passa a
// funcionar — deixa de haver emails "presos" como admin no código.
export const ADMIN_EMAILS = [
  "catiasmgon@gmail.com",
];

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

// ── Produto único ──────────────────────────────────────────────
// Preenche estes dois quando criares o produto na Hotmart:
//  - CHECKOUT_URL: o link de checkout (botão "Comprar acesso").
//  - FULL_ACCESS_PRODUCT_ID: o id do produto (o webhook usa-o para desbloquear o acesso).
export const CHECKOUT_URL = ""; // TODO: link de checkout do produto único na Hotmart
export const FULL_ACCESS_PRODUCT_ID = ""; // TODO: id do produto único na Hotmart

// Os "módulos" são apenas as áreas da plataforma (todos abrem com a mesma compra).
export type ModuleKey = "jornada" | "academia" | "redes";

export const MODULE_LABELS: Record<ModuleKey, string> = {
  jornada: "A sua jornada",
  academia: "Academia de IA",
  redes: "Criando para as Redes Sociais",
};

/** Produto único: só o produto de acesso total concede acesso (a todos os módulos). */
export function moduleByHotmartProduct(productId: string): ModuleKey | null {
  if (FULL_ACCESS_PRODUCT_ID && productId === FULL_ACCESS_PRODUCT_ID) return "jornada";
  return null;
}

// Controlo de acesso por módulo (vitrine + desbloqueio via compra na Hotmart).
//
// Cada card da homepage é um "módulo" vendido como produto Hotmart separado.
// Preenche `checkoutUrl` (link de checkout da Hotmart) e `hotmartProductId`
// (id do produto, usado pelo webhook para mapear a compra ao módulo).

// Emails de administração — vêem SEMPRE tudo desbloqueado (sem paywall).
export const ADMIN_EMAILS = [
  "catiacreator.oficial@gmail.com",
  "catiacreator@gmail.com",
  "catiasmgon@gmail.com",
];

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

// ── Produto único ──────────────────────────────────────────────
// A plataforma é vendida como UM só produto: comprar desbloqueia TUDO.
// Preenche estes dois quando criares o produto na Hotmart.
export const CHECKOUT_URL = ""; // TODO: link de checkout do produto único na Hotmart
export const FULL_ACCESS_PRODUCT_ID = ""; // TODO: id do produto único na Hotmart

export type ModuleKey = "jornada" | "academia" | "redes";

export type ModuleInfo = {
  label: string;
  /** Link de checkout da Hotmart deste produto. */
  checkoutUrl: string;
  /** ID do produto na Hotmart (o webhook usa-o para desbloquear o módulo certo). */
  hotmartProductId: string;
};

export const MODULES: Record<ModuleKey, ModuleInfo> = {
  jornada: {
    label: "A sua jornada",
    checkoutUrl: "", // TODO: colar o link de checkout da Hotmart
    hotmartProductId: "", // TODO: id do produto na Hotmart
  },
  academia: {
    label: "Academia de IA",
    checkoutUrl: "",
    hotmartProductId: "",
  },
  redes: {
    label: "Criando para as Redes Sociais",
    checkoutUrl: "",
    hotmartProductId: "",
  },
};

/** Mapa id-do-produto-Hotmart -> módulo (para o webhook).
 *  Produto único: qualquer compra (o produto único) concede acesso total,
 *  por isso registamos sob "jornada" — o `useAccess` desbloqueia tudo na mesma. */
export function moduleByHotmartProduct(productId: string): ModuleKey | null {
  if (FULL_ACCESS_PRODUCT_ID && productId === FULL_ACCESS_PRODUCT_ID) return "jornada";
  const entry = (Object.entries(MODULES) as [ModuleKey, ModuleInfo][]).find(
    ([, m]) => m.hotmartProductId && m.hotmartProductId === productId,
  );
  return entry ? entry[0] : null;
}

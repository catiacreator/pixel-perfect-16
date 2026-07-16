// Config do Cat.IA principal (link do GPT + palavra-passe), lida em qualquer
// sítio onde o Cat.IA aparece. A admin edita em /admin/cat-ia; guardado no servidor.
import { useEffect, useState } from "react";
import { getCatIaConfig, CAT_IA_URL_DEFAULT, CAT_IA_PASS_DEFAULT } from "@/lib/admin.functions";

export type CatIaConfig = { url: string; password: string };

export const CAT_IA_DEFAULT: CatIaConfig = { url: CAT_IA_URL_DEFAULT, password: CAT_IA_PASS_DEFAULT };

// Cache em memória — evita "piscar" e repetir o pedido entre componentes.
let cache: CatIaConfig | null = null;

export function useCatIaConfig(): CatIaConfig {
  const [cfg, setCfg] = useState<CatIaConfig>(cache ?? CAT_IA_DEFAULT);
  useEffect(() => {
    let vivo = true;
    getCatIaConfig()
      .then((c) => {
        if (!vivo || !c) return;
        cache = c as CatIaConfig;
        setCfg(c as CatIaConfig);
      })
      .catch(() => { /* usa os defaults */ });
    return () => { vivo = false; };
  }, []);
  return cfg;
}

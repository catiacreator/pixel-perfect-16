import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PilarPublic = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string | null;
  ordem: number;
  etapas: {
    id: string;
    slug: string;
    titulo: string;
    descricao: string | null;
    video_url: string | null;
    ordem: number;
  }[];
};

export const getPilarBySlug = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data, context }): Promise<PilarPublic | null> => {
    const { data: pilar, error } = await context.supabase
      .from("pilares")
      .select("id, slug, titulo, descricao, ordem")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!pilar) return null;

    const { data: etapas, error: e2 } = await context.supabase
      .from("etapas")
      .select("id, slug, titulo, descricao, video_url, ordem")
      .eq("pilar_id", pilar.id)
      .order("ordem", { ascending: true });
    if (e2) throw new Error(e2.message);

    return { ...pilar, etapas: etapas ?? [] };
  });

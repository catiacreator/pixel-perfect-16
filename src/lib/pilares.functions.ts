import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

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
  .inputValidator((input) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }): Promise<PilarPublic | null> => {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const { data: pilar, error } = await supabase
      .from("pilares")
      .select("id, slug, titulo, descricao, ordem")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!pilar) return null;

    const { data: etapas, error: e2 } = await supabase
      .from("etapas")
      .select("id, slug, titulo, descricao, video_url, ordem")
      .eq("pilar_id", pilar.id)
      .order("ordem", { ascending: true });
    if (e2) throw new Error(e2.message);

    return { ...pilar, etapas: etapas ?? [] };
  });

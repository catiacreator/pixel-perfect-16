
GRANT SELECT ON public.pilares TO anon;
GRANT SELECT ON public.etapas TO anon;
DROP POLICY IF EXISTS "everyone reads pilares" ON public.pilares;
DROP POLICY IF EXISTS "everyone reads etapas" ON public.etapas;
CREATE POLICY "public read pilares" ON public.pilares FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read etapas" ON public.etapas FOR SELECT TO anon, authenticated USING (true);

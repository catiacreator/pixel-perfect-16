-- Documento Mestre persistente por utilizador.
-- Guarda todo o estado partilhado entre páginas (Doc Mestre, Pilar 2, Detetive, etc.)
-- numa única linha por utilizador, sob a forma de um objeto JSON com as chaves do app.

CREATE TABLE public.master_documents (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.master_documents TO authenticated;
GRANT ALL ON public.master_documents TO service_role;
ALTER TABLE public.master_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own master_document"
  ON public.master_documents FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins read master_documents"
  ON public.master_documents FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER master_documents_updated_at
  BEFORE UPDATE ON public.master_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

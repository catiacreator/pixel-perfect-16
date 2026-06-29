-- ============================================================
-- Leveza no Digital — instalação completa do esquema Supabase
-- Cola este ficheiro inteiro no SQL Editor do NOVO projeto e corre.
-- (gerado a partir de supabase/migrations, por ordem cronológica)
-- ============================================================


-- ─────────────────────────────────────────────
-- 20260623150624_b900294f-a960-4ee2-a152-a6363e697ec3.sql
-- ─────────────────────────────────────────────
CREATE TABLE public.assistant_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX assistant_messages_session_idx ON public.assistant_messages(session_id, created_at);

GRANT SELECT, INSERT ON public.assistant_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assistant_messages TO authenticated;
GRANT ALL ON public.assistant_messages TO service_role;

ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;

-- Open policies (no auth in app); messages keyed by client-side session UUID stored in localStorage.
CREATE POLICY "anyone can read messages by session" ON public.assistant_messages FOR SELECT USING (true);
CREATE POLICY "anyone can insert messages" ON public.assistant_messages FOR INSERT WITH CHECK (true);

-- ─────────────────────────────────────────────
-- 20260623235030_08f68d1f-b4ae-4ad5-9270-a9f9a55f66f9.sql
-- ─────────────────────────────────────────────

-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Profiles (auto created on signup)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nome TEXT,
  avatar_url TEXT,
  tier TEXT NOT NULL DEFAULT 'Iniciante',
  pontos INTEGER NOT NULL DEFAULT 0,
  sequencia INTEGER NOT NULL DEFAULT 0,
  ultima_atividade TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "admins manage profiles" ON public.profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile + seed admin role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  IF NEW.email = 'catiacreator.oficial@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Pontos log
CREATE TABLE public.pontos_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  motivo TEXT NOT NULL,
  criado_por UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pontos_log TO authenticated;
GRANT ALL ON public.pontos_log TO service_role;
ALTER TABLE public.pontos_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own log" ON public.pontos_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins manage log" ON public.pontos_log FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Conquistas
CREATE TABLE public.conquistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  emoji TEXT,
  pontos INTEGER NOT NULL DEFAULT 0,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.conquistas TO authenticated;
GRANT ALL ON public.conquistas TO service_role;
ALTER TABLE public.conquistas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "everyone reads conquistas" ON public.conquistas FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage conquistas" ON public.conquistas FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.mentorada_conquistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conquista_id UUID NOT NULL REFERENCES public.conquistas(id) ON DELETE CASCADE,
  desbloqueada_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, conquista_id)
);
GRANT SELECT ON public.mentorada_conquistas TO authenticated;
GRANT ALL ON public.mentorada_conquistas TO service_role;
ALTER TABLE public.mentorada_conquistas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own conquistas" ON public.mentorada_conquistas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins manage user conquistas" ON public.mentorada_conquistas FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Pilares e etapas (conteúdo editável)
CREATE TABLE public.pilares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pilares TO authenticated;
GRANT ALL ON public.pilares TO service_role;
ALTER TABLE public.pilares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "everyone reads pilares" ON public.pilares FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage pilares" ON public.pilares FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER pilares_updated_at BEFORE UPDATE ON public.pilares FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TABLE public.etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilar_id UUID NOT NULL REFERENCES public.pilares(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  video_url TEXT,
  conteudo JSONB NOT NULL DEFAULT '{}'::jsonb,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(pilar_id, slug)
);
GRANT SELECT ON public.etapas TO authenticated;
GRANT ALL ON public.etapas TO service_role;
ALTER TABLE public.etapas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "everyone reads etapas" ON public.etapas FOR SELECT TO authenticated USING (true);
CREATE POLICY "admins manage etapas" ON public.etapas FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER etapas_updated_at BEFORE UPDATE ON public.etapas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Seed pilares iniciais
INSERT INTO public.pilares (slug, titulo, descricao, ordem) VALUES
  ('pilar-1', 'Pilar 1 — Domine a IA', 'Aprenda as ferramentas de IA e libere tempo na sua rotina.', 1),
  ('pilar-2', 'Pilar 2 — Defina seu Método', 'Construa identidade, método e presença profissional.', 2);


-- ─────────────────────────────────────────────
-- 20260623235048_96936e6c-44ea-404b-b527-3fdd5edb42ef.sql
-- ─────────────────────────────────────────────

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;


-- ─────────────────────────────────────────────
-- 20260623235740_b550264e-11f7-45c6-aaa8-96d2455c9868.sql
-- ─────────────────────────────────────────────

UPDATE public.pilares SET titulo='Recuperar o seu tempo', descricao='Porque sem tempo, não tem nada. Comece por organizar a sua rotina para criar com calma — não em pânico.', ordem=1 WHERE slug='pilar-1';
UPDATE public.pilares SET titulo='Criar Autoridade', descricao='Porque você estudou demais pra ficar invisível.', ordem=2 WHERE slug='pilar-2';

WITH p1 AS (SELECT id FROM public.pilares WHERE slug='pilar-1')
INSERT INTO public.etapas (pilar_id, slug, titulo, descricao, ordem) VALUES
((SELECT id FROM p1), 'aprenda-ia', 'Domine as principais IAs para o seu negócio', 'Agora que sabe o que pesa, domine as ferramentas — cada aula já traz ideias de como automatizar as tarefas que mapeou.', 2),
((SELECT id FROM p1), 'detetive-do-tempo', 'Detetive do Tempo', 'Mapeie as suas tarefas e veja, em euros, quanto cada uma está a custar — antes de automatizar seja o que for.', 3),
((SELECT id FROM p1), 'conclusao', 'Revise e celebre', 'Veja tudo o que construiu neste Pilar — e o que segue a seguir.', 4)
ON CONFLICT (pilar_id, slug) DO UPDATE SET titulo=EXCLUDED.titulo, descricao=EXCLUDED.descricao, ordem=EXCLUDED.ordem;

WITH p2 AS (SELECT id FROM public.pilares WHERE slug='pilar-2')
INSERT INTO public.etapas (pilar_id, slug, titulo, descricao, ordem) VALUES
((SELECT id FROM p2), 'pesquisa-mercado', 'Pesquisa de Mercado · Pesquisa de Dores do Público', 'Descubra o que seu público realmente quer e onde dói.', 1),
((SELECT id FROM p2), 'metodo', 'Definindo Seu Método', 'Defina os passos do que você ensina. Esse rascunho alimenta tudo que vem depois.', 2),
((SELECT id FROM p2), 'identidade', 'Identidade de marca', 'Descubra como você quer ser vista.', 3),
((SELECT id FROM p2), 'redes-sociais', 'Redes Sociais', 'O que você fala e como aparece.', 4),
((SELECT id FROM p2), 'videos', 'Vídeos profissionais sem gravar 50 vezes', 'Conteúdo em vídeo usando Inteligência Artificial.', 5),
((SELECT id FROM p2), 'conclusao', 'Revise sua autoridade', 'Veja como sua identidade e presença ficaram.', 6)
ON CONFLICT (pilar_id, slug) DO UPDATE SET titulo=EXCLUDED.titulo, descricao=EXCLUDED.descricao, ordem=EXCLUDED.ordem;


-- ─────────────────────────────────────────────
-- 20260624000123_57055a6b-2bbf-47b3-8205-56c07e6c8eec.sql
-- ─────────────────────────────────────────────

GRANT SELECT ON public.pilares TO anon;
GRANT SELECT ON public.etapas TO anon;
DROP POLICY IF EXISTS "everyone reads pilares" ON public.pilares;
DROP POLICY IF EXISTS "everyone reads etapas" ON public.etapas;
CREATE POLICY "public read pilares" ON public.pilares FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read etapas" ON public.etapas FOR SELECT TO anon, authenticated USING (true);


-- ─────────────────────────────────────────────
-- 20260624161719_add_profiles_approved.sql
-- ─────────────────────────────────────────────
-- Gate de aprovação: novas mentoradas ficam pendentes até a mentora aprovar.

-- 1. Coluna de aprovação (default false = pendente)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false;

-- 2. Todas as contas JÁ existentes ficam aprovadas.
--    Só contas novas (criadas após esta migration) é que ficam pendentes.
UPDATE public.profiles SET approved = true;

-- 3. Recriar handle_new_user para aprovar admins automaticamente no signup.
--    (mentoradas comuns continuam approved=false e dependem de aprovação manual)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  IF NEW.email = 'catiacreator.oficial@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    -- admin entra já aprovado
    UPDATE public.profiles SET approved = true WHERE id = NEW.id;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END; $$;


-- ─────────────────────────────────────────────
-- 20260624185246_master_documents.sql
-- ─────────────────────────────────────────────
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


-- ─────────────────────────────────────────────
-- 20260625120000_rename_pilar1_titulo.sql
-- ─────────────────────────────────────────────
-- Renomeia o título do Pilar 1 para a nova frase de marca
-- (o hub do Pilar 1 lê o título a partir desta tabela)
UPDATE public.pilares
SET titulo = 'Crie com Leveza sem roubar o seu tempo'
WHERE slug = 'pilar-1';


-- ─────────────────────────────────────────────
-- 20260629120000_module_purchases.sql
-- ─────────────────────────────────────────────
-- Vitrine + desbloqueio por compra na Hotmart.
-- Cada compra (por email do comprador) desbloqueia um módulo.

create table if not exists public.module_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  module_key text not null,
  status text not null default 'active', -- 'active' | 'inactive'
  hotmart_product_id text,
  hotmart_transaction text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email, module_key)
);

alter table public.module_purchases enable row level security;

-- A pessoa vê as suas próprias compras (pelo user_id ou pelo email do login).
drop policy if exists "ver as minhas compras" on public.module_purchases;
create policy "ver as minhas compras" on public.module_purchases
  for select using (
    auth.uid() = user_id
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- Inserções/atualizações são feitas SÓ pelo webhook (service role, que ignora RLS).

create index if not exists module_purchases_email_idx on public.module_purchases (lower(email));
create index if not exists module_purchases_user_idx on public.module_purchases (user_id);


-- ─────────────────────────────────────────────
-- 20260629130000_admin_catiasmgon.sql
-- ─────────────────────────────────────────────
-- Tornar catiasmgon@gmail.com administradora da plataforma.

-- 1. Se a conta já existir, concede admin + aprova já.
DO $$
DECLARE uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE lower(email) = 'catiasmgon@gmail.com' LIMIT 1;
  IF uid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    UPDATE public.profiles SET approved = true WHERE id = uid;
  END IF;
END $$;

-- 2. Reconhecer este email (além do oficial) como admin no signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  IF NEW.email IN ('catiacreator.oficial@gmail.com', 'catiasmgon@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    -- admin entra já aprovado
    UPDATE public.profiles SET approved = true WHERE id = NEW.id;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END; $$;


-- ─────────────────────────────────────────────
-- 20260629140000_admin_catiacreator_and_backfill.sql
-- ─────────────────────────────────────────────
-- Corrige acesso no projeto novo:
-- 1) cria perfis em falta para contas que se registaram antes de o esquema existir;
-- 2) reconhece também catiacreator@gmail.com como administradora;
-- 3) concede admin + aprova já as contas donas existentes.

-- 1. Backfill: garante um perfil para cada utilizador já existente em auth.users
INSERT INTO public.profiles (id, email, nome)
SELECT u.id, u.email, split_part(u.email, '@', 1)
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- 2. Reconhecer os 3 emails como admin no signup futuro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  IF NEW.email IN ('catiacreator.oficial@gmail.com', 'catiacreator@gmail.com', 'catiasmgon@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    UPDATE public.profiles SET approved = true WHERE id = NEW.id;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END; $$;

-- 3. Para as contas donas que JÁ existem: torna admin + aprova
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT id FROM auth.users
    WHERE lower(email) IN ('catiacreator.oficial@gmail.com', 'catiacreator@gmail.com', 'catiasmgon@gmail.com')
  LOOP
    INSERT INTO public.user_roles (user_id, role) VALUES (r.id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    UPDATE public.profiles SET approved = true WHERE id = r.id;
  END LOOP;
END $$;


-- ─────────────────────────────────────────────
-- 20260629150000_app_role_moderator.sql
-- ─────────────────────────────────────────────
-- Acrescenta o papel "moderator" ao enum de papéis (além de admin/user).
-- A gestão de papéis é feita pelo painel admin através do service role (ignora RLS),
-- por isso não são precisas novas políticas.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'moderator';


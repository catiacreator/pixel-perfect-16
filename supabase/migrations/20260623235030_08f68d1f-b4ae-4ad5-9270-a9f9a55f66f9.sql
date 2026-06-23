
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

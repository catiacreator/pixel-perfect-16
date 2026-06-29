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

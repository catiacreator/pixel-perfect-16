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

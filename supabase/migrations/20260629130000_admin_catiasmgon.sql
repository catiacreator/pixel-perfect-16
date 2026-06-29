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

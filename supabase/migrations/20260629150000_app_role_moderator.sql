-- Acrescenta o papel "moderator" ao enum de papéis (além de admin/user).
-- A gestão de papéis é feita pelo painel admin através do service role (ignora RLS),
-- por isso não são precisas novas políticas.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'moderator';

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

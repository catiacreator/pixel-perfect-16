-- Renomeia o título do Pilar 1 para a nova frase de marca
-- (o hub do Pilar 1 lê o título a partir desta tabela)
UPDATE public.pilares
SET titulo = 'Crie com Leveza sem roubar o seu tempo'
WHERE slug = 'pilar-1';

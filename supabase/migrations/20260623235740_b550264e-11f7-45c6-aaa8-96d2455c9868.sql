
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

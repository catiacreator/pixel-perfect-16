// Prompt do passo 2 da Máquina de Análises: corre no Claude in Chrome, com o
// perfil de Instagram aberto. O formato de saída é rígido de propósito — é o
// que permite à plataforma preencher os campos sozinha (ver lib/maquina-analises).
export const PROMPT_EXTRAIR_PERFIL = `Estás a ver um perfil de Instagram aberto nesta página. Extrai e organiza TODA a informação pública relevante para uma análise de perfil. Não inventes nada: se um dado não estiver visível, escreve "não visível".

Devolve em texto estruturado, exatamente com estes títulos:

## Identificação
- Utilizador (@), nome de exibição, nicho aparente, localização

## Métricas
- Nº de publicações, seguidores, a seguir

## Bio
- Texto integral da bio
- Link na bio
- Destaques (highlights) visíveis

## Conteúdo (feed + Reels)
- Lista dos posts visíveis com o texto do gancho/thumbnail
- Para CADA Reel, regista o nº de views se estiver visível (isto é o mais importante)
- Formatos dominantes (Reel em câmara, carrossel, imagem estática)
- Com que frequência a pessoa aparece em câmara
- Padrão visual (cores, tipografia, consistência) e língua do conteúdo

## Negócio, ofertas e links
- Para CADA coisa que a pessoa parece vender, uma linha no formato: "Vende: [nome] | [preço se visível] | [link do produto]"
- Procura e guarda TODOS os links visíveis (bio, linktree, destaques, posts). Regista cada URL.
- Público-alvo aparente (a quem fala) — linha "Publico-alvo: ..."
- Dor principal que a comunicação toca — linha "Dor principal: ..."
- Palavra-chave / CTA de DM, se houver — linha "Palavra-chave: ..."`;

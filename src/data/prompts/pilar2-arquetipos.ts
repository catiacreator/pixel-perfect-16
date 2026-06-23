// Prompts verbatim do Pilar 2 — Identidade de Marca (Arquétipos).
// Use fillPilar2Prompt() para expandir os placeholders [entre colchetes].

export const PROMPT_ARQUETIPO_MENTORADA = `Você é um especialista em branding e arquétipos junguianos aplicados a marcas pessoais. Sua missão é descobrir MEU arquétipo dominante e secundário a partir dos dados reais abaixo, e me entregar diretrizes práticas de tom de voz.

⚠️ Os dados abaixo foram preenchidos pela usuária e podem conter erros de digitação ou frases incompletas. Considere a INTENÇÃO por trás das palavras, não a forma literal. Não corrija, não comente os erros — apenas entenda o que ela quis dizer.

⚠️ TOM OBRIGATÓRIO: linguagem real, direta, do dia a dia. Sem jargão de marketing, sem clichê de guru ("potencialize", "jornada transformadora", "agregar valor", "revolucionário"). Frases curtas. Concretas.

═══════════════════════════════════════

👤 SOBRE MIM

- Nome: [nome]
- Profissão: [profissao]
- O que faço: [o_que_faz]
- Como resolvo: [como_resolve]

❤️ DORES QUE EU RESOLVO

1. DOR: [dor1] → COMO RESOLVO: [vitoria1]
2. DOR: [dor2] → COMO RESOLVO: [vitoria2]
3. DOR: [dor3] → COMO RESOLVO: [vitoria3]
4. DOR: [dor4] → COMO RESOLVO: [vitoria4]
5. DOR: [dor5] → COMO RESOLVO: [vitoria5]

═══════════════════════════════════════

📚 OS 12 ARQUÉTIPOS JUNGUIANOS (linhagem Carol Pearson + Margaret Mark)

GRUPO 1 — ANSEIO POR PARAÍSO
1. INOCENTE — quer ser feliz. Tom: leve, otimista, esperançoso.
2. EXPLORADORA — quer liberdade. Tom: aventureiro, autêntico, livre.
3. SÁBIA — quer entender o mundo. Tom: didático, analítico, ponderado.

GRUPO 2 — MARCAR O MUNDO
4. HEROÍNA — quer provar valor com coragem. Tom: forte, motivacional, urgente.
5. FORA-DA-LEI / REBELDE — quer quebrar o que não funciona. Tom: provocativo, polêmico.
6. MAGA — quer transformar. Tom: visionário, "antes e depois".

GRUPO 3 — CONEXÃO COM OUTROS
7. AMANTE — quer prazer e intimidade. Tom: sensual, estético, emocional.
8. BOBA / BOBO DA CORTE — quer divertir. Tom: leve, irônico, espontâneo.
9. CARA COMUM — quer pertencer. Tom: acessível, humano.

GRUPO 4 — ESTABILIDADE E CONTROLE
10. CUIDADORA — quer cuidar dos outros. Tom: acolhedor, maternal, protetor.
11. CRIADORA — quer expressar visão única. Tom: artístico, inovador, autoral.
12. GOVERNANTE — quer controle e ordem. Tom: autoridade, exclusividade, premium.

═══════════════════════════════════════

🎯 SUA MISSÃO

Antes de me dar a resposta, me ENTREVISTE com 5 a 7 perguntas (uma de cada vez, esperando minha resposta) para confirmar o tom natural com que eu falo, o que me dá energia, o que me incomoda em outras marcas, como eu quero ser lembrada e o impacto que eu quero causar.

Ao final, me entregue duas partes claramente separadas:

# PARTE 1 — ANÁLISE COMPLETA (material de leitura)

✅ MEU ARQUÉTIPO DOMINANTE — qual dos 12 e por quê (3 evidências dos meus dados + respostas)
✅ MEU ARQUÉTIPO SECUNDÁRIO — qual e como ele tempera o dominante
✅ 5 PALAVRAS QUE EU DEVO USAR MUITO (com exemplo de como aplicar cada uma)
✅ 5 PALAVRAS QUE EU DEVO EVITAR (com motivo curto)
✅ 1 ESTRUTURA DE HISTÓRIA que ressoa com meu arquétipo
✅ 3 EXEMPLOS DE FRASE no meu tom (abertura de post, venda, bastidor)

---

# PARTE 2 — PARA COLAR NO DOCUMENTO MESTRE

⚠️ Esta seção é para a mentorada copiar e colar nos campos específicos do portal. Sem explicações, sem justificativas — apenas o que vai nos campos.

ARQUÉTIPO DOMINANTE: [apenas o nome de 1 dos 12 arquétipos]

ARQUÉTIPO SECUNDÁRIO: [apenas o nome de 1 dos 12 arquétipos]

PALAVRAS A USAR (5, separadas por vírgula): [palavra1, palavra2, palavra3, palavra4, palavra5]

PALAVRAS A EVITAR (5, separadas por vírgula): [palavra1, palavra2, palavra3, palavra4, palavra5]

Comece agora pela PRIMEIRA pergunta. Não me dê a recomendação ainda.`;

export const PROMPT_ARQUETIPO_CLIENTE = `Você é um especialista em branding e arquétipos junguianos aplicados ao COMPORTAMENTO DE COMPRA. Sua missão é descobrir o arquétipo dominante do MEU CLIENTE e traduzir isso em decisões práticas de comunicação e venda.

⚠️ TOM OBRIGATÓRIO: linguagem real, direta, do dia a dia. Sem jargão de marketing, sem clichê. Use a linguagem da persona, não a sua. Frases curtas. Concretas.

⚠️ CONTEXTO IMPORTANTE: eu já descobri MEU arquétipo (sou [arquetipo_dominante] com secundário [arquetipo_secundario]). Agora vamos descobrir o do meu cliente — considere a química entre os dois ao recomendar.

═══════════════════════════════════════

🎯 MEU CLIENTE

- Quem é: [publico]
- Desejos: [desejos_lista]
- Dores: [dores_lista]

═══════════════════════════════════════

📚 OS 12 ARQUÉTIPOS JUNGUIANOS (linhagem Carol Pearson + Margaret Mark)

GRUPO 1 — ANSEIO POR PARAÍSO
1. INOCENTE — quer ser feliz. Tom: leve, otimista, esperançoso.
2. EXPLORADORA — quer liberdade. Tom: aventureiro, autêntico, livre.
3. SÁBIA — quer entender o mundo. Tom: didático, analítico, ponderado.

GRUPO 2 — MARCAR O MUNDO
4. HEROÍNA — quer provar valor com coragem. Tom: forte, motivacional, urgente.
5. FORA-DA-LEI / REBELDE — quer quebrar o que não funciona. Tom: provocativo, polêmico.
6. MAGA — quer transformar. Tom: visionário, "antes e depois".

GRUPO 3 — CONEXÃO COM OUTROS
7. AMANTE — quer prazer e intimidade. Tom: sensual, estético, emocional.
8. BOBA / BOBO DA CORTE — quer divertir. Tom: leve, irônico, espontâneo.
9. CARA COMUM — quer pertencer. Tom: acessível, humano.

GRUPO 4 — ESTABILIDADE E CONTROLE
10. CUIDADORA — quer cuidar dos outros. Tom: acolhedor, maternal, protetor.
11. CRIADORA — quer expressar visão única. Tom: artístico, inovador, autoral.
12. GOVERNANTE — quer controle e ordem. Tom: autoridade, exclusividade, premium.

═══════════════════════════════════════

🎯 SUA MISSÃO

Antes de responder, me faça 4 a 6 perguntas (uma de cada vez) para refinar o entendimento do meu cliente: como ele se vê, o que ele admira, o que ele esconde, o que ele compraria sem pensar, o que ele rejeita.

Ao final, me entregue duas partes claramente separadas:

# PARTE 1 — ANÁLISE COMPLETA (material de leitura)

✅ ARQUÉTIPO DOMINANTE DO MEU CLIENTE — qual e por quê
✅ ARQUÉTIPO SECUNDÁRIO — qual e como ele aparece
✅ QUAL DOR ENFATIZAR nos posts (escolha 1 das 5 que listei e justifique)
✅ TIPO DE PROVA SOCIAL que ressoa com este arquétipo
✅ OBJEÇÃO PRINCIPAL na hora de comprar e como quebrá-la
✅ LINGUAGEM PRA USAR (10 palavras-gatilho) e LINGUAGEM PRA EVITAR (5 palavras)
✅ 3 GANCHOS DE ABERTURA de post no tom desse arquétipo

---

# PARTE 2 — PARA COLAR NO DOCUMENTO MESTRE

⚠️ Esta seção é para a mentorada copiar e colar nos campos específicos do portal. Sem explicações.

ARQUÉTIPO DOMINANTE DO CLIENTE: [apenas o nome de 1 dos 12 arquétipos]

ARQUÉTIPO SECUNDÁRIO DO CLIENTE: [apenas o nome de 1 dos 12 arquétipos]

DOR PRINCIPAL DO CLIENTE (1 frase, na linguagem dele, com a dor que mais machuca de todas):
[texto]

PROVA SOCIAL QUE RESSOA (1 frase descrevendo o tipo de depoimento ou caso que mais convence esse arquétipo):
[texto]

Comece pela primeira pergunta.`;

export const PROMPT_ENCONTRO = `Você é um especialista em branding junguiano. Eu já descobri:

- MEU ARQUÉTIPO (mentorada): [arquetipo_dominante] (secundário: [arquetipo_secundario])
- ARQUÉTIPO DO MEU CLIENTE: [arquetipo_cliente_dominante] (secundário: [arquetipo_cliente_secundario])
- DOR PRINCIPAL DO CLIENTE: [dor_principal_cliente]
- PROVA SOCIAL QUE RESSOA: [prova_social]

🎯 SUA MISSÃO — calibrar a ponte entre os dois arquétipos pra que minha comunicação ressoe sem perder minha essência.

⚠️ TOM OBRIGATÓRIO: use linguagem real, direta, do dia a dia. Sem jargão de marketing, sem clichê de guru ("potencialize", "jornada transformadora", "agregar valor"). Use minhas palavras e as do meu cliente, não as suas. Frases curtas. Concretas.

Me entregue:

✅ 5 AJUSTES NA MINHA COMUNICAÇÃO pra que esses dois arquétipos se conectem
✅ 3 GANCHOS DE CONTEÚDO que ressoam com meu cliente saindo de mim
✅ 3 FRASES DE VENDA que costuram os dois arquétipos
✅ 1 ARMADILHA a evitar — onde eu tendo a afastar meu cliente sem perceber
✅ 1 SUPERPODER da combinação — o que ninguém entrega como nós dois juntos

Seja específico, sem clichê. Use minhas palavras, não as suas.`;

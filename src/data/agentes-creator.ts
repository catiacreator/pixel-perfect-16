export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  link: string;
  banner?: string;
  tabs: {
    label: string;
    content: string;
  }[];
}

export const agents: Agent[] = [
  {
    id: "agente-1",
    name: "Otimizador de Bio",
    description: "Transforma perfis que não convertem em máquinas de geração de seguidores e clientes. Pega no que tens para oferecer e apresenta de forma irresistível.",
    icon: "✍️",
    category: "Conversão",
    link: "https://chatgpt.com/g/g-697965c10e9081919055540881bb6883-optimizador-de-bio",
    banner: "/agentes/bio-banner.png",
    tabs: [
      {
        label: "Sobre",
        content: `Criaste conteúdo incrível. Tens produto que vende. Mas há um problema: metade das pessoas que visitam o teu perfil... vão-se embora.

Eles chegam ao teu perfil através de um post viral, olham 3 segundos para a tua bio, e decidem: "Não é para mim". Clicam para trás. Nunca mais voltam. Perdeste um potencial cliente para sempre.

É como teres uma loja com produtos fantásticos, mas com uma montra tão confusa que as pessoas nem sequer entram. A tua bio é a tua montra digital. E se ela não converter em 3 segundos, não converte nunca.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O PROBLEMA DA PRIMEIRA IMPRESSÃO

Porque 1ª impressão decide em 3 segundos

O cérebro humano forma opinião sobre alguém em 0,1 segundos. No digital, tens um pouco mais: 3 segundos inteiros. É o tempo que pessoa leva para:
• Ler linha 1 da bio
• Decidir se é relevante para ela
• Ficar ou ir embora

Se linha 1 não grita "isto é para ti", perdeste. Não importa se linha 2, 3, 4 são brilhantes. Pessoa já não está lá para ler.


A diferença entre bio que informa e bio que converte

Bio que informa: "Marketeer digital. Ajudo empresas com redes sociais. Mais de 5 anos de experiência. Contacta-me para saber mais."

Bio que converte: "Startups tech que eu ajudo faturam +340% em 90 dias 📈 Para founders que têm produto incrível mas vendas fracas Método GROWTH validado em 47 empresas 👇 Curso gratuito: como vender sem parecer desesperado"

Primeira informa (cargo, experiência, contacto). Segunda converte (resultado específico, para quem, prova, ação).


O erro de copiar bio de grandes contas

Vês um influencer com 2 milhões de seguidores: "Empreendedora 💪 Mãe 👶 Inspirando mulheres pelo mundo 🌍"

Copias formato para o teu perfil de 3.500 seguidores. Resultado: zero conversão.

❓Porquê? Porque quem tem 2 milhões já estabeleceu autoridade. Eles podem ser vagos porque já são conhecidos. Tu precisas ser específico porque ainda estás a construir confiança.

Grandes contas vendem pela notoriedade. Tu vendes pela especificidade.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 O QUE ESTE AGENTE CRIA

O Otimizador de Bio transforma perfis que não convertem em máquinas de geração de seguidores e clientes.

✨ Bio otimizada para conversão (seguidores + clientes)
Não é só "bio bonita". É bio que funciona como funil:
• Linha 1: Para o scroll (gancho)
• Linha 2: Qualifica audiência certa (filtro)
• Linha 3: Promete resultado específico (valor)
• Linha 4: Prova que és credível (autoridade)
• Linha 5: Diz exatamente o que fazer (ação)

✨ Estrutura de destaques (highlights estratégicos)
Destaques não são para "guardar Stories bonitos". São continuação do funil:
• Destaque 1: "Quem sou" (autoridade)
• Destaque 2: "Como funciona" (método)
• Destaque 3: "Resultados" (prova social)
• Destaque 4: "Testemunhos" (credibilidade)
• Destaque 5: "FAQ" (objeções)
• Destaque 6: "Contacto" (conversão)

🔥 CTA específico por objetivo
• Para seguidores: "Segue para dicas diárias"
• Para leads: "E-book gratuito no link"
• Para vendas: "Curso com 50% desconto hoje"
• Para autoridade: "Últimos artigos no blog"

🔑 Teste A/B de variações
Agente sugere 2-3 versões diferentes. Testas, medes conversão, ficas com vencedora.

Análise de concorrência no nicho
O que funciona no teu setor? O que está saturado? Como te diferenciares mantendo conversão alta?`
      },
      {
        label: "Quando Usar",
        content: `✨ QUANDO USAR ESTE AGENTE

Quando taxa de conversão perfil→seguidor está baixa
Posts virais trazem 5.000 visitas ao perfil, mas apenas 50 novos seguidores. Taxa de 1%. Deveria ser pelo menos 15%.

Para lançar produto novo
Bio atual fala do antigo posicionamento. Produto novo exige bio nova que conecte posicionamento atual com oferta específica.

Quando mudas de nicho/posicionamento
Eras coach de emagrecimento, agora és consultora de negócios. Bio precisa refletir mudança sem confundir audiência existente.

Para criar perfil profissional do zero
Começaste agora, não sabes por onde começar. Agente cria bio com autoridade mesmo sem grande histórico.

Para otimizar conversão de tráfego pago
Investindo em anúncios para trazer tráfego ao perfil. Cada visita custa dinheiro. Bio tem que converter ou estás a desperdiçar investimento.

Quando queres aumentar DMs/vendas diretas
Objetivo não é só ganhar seguidores. É gerar contactos qualificados que abrem conversa por DM.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ QUANDO NÃO USAR

• Não uses se não tens conteúdo consistente. Bio atrai pessoas, mas se não publicas regularmente, elas deseguem rapidamente.

• Não uses se o teu produto/serviço ainda não está definido. Bio específica exige oferta específica.

• Não uses para perfis pessoais sem objetivo comercial. Este agente é para conversão, não para expressão pessoal.

• Não uses se não consegues medir resultados. Otimização precisa de dados: seguidores, DMs, cliques no link.`
      },
      {
        label: "Como Usar",
        content: `COMO USAR

Passo 1: Acesse o agente
Clique no link Otimizador de Bio

Passo 2: Prepara o teu input completo
Usa este template - detalhe é crucial para bio eficaz:

Plataforma: [Instagram/TikTok/LinkedIn/Twitter]
Nicho: [a tua área específica - não genérica]
Público-alvo: [demográfica + psicográfica específica]
Principal oferta: [produto/serviço que mais vendes]
Objetivo: [seguidores/leads/vendas/autoridade/networking]
Bio atual: [cola aqui se já tiveres uma]
Diferencial: [o que te torna único vs concorrência]
CTA desejado: [link/DM/comentário/partilha]
Prova social disponível: [números, casos, certificações]

Passo 3: Define tom e personalidade
• Formal ou descontraído?
• Técnico ou simples?
• Inspiracional ou prático?
• Local ou internacional?

Passo 4: Lista resultados específicos
Não digas "ajudo pessoas". Diz:
• "Clientes aumentam faturamento em X%"
• "Y empresas implementaram método"
• "Z pessoas conseguiram resultado"

Passo 5: Identifica obstáculos da audiência
Que objeções têm? Porque não te seguem? Porque não compram? Bio deve endereçar resistências principais.

Passo 6: Recebe e testa variações
Agente entrega 2-3 opções. Testa cada uma por 3-5 dias. Mede:
• Taxa visita→seguidor
• Número de DMs
• Cliques no link
• Menções/partilhas

Passo 7: Refina baseado em dados
"Versão A teve mais seguidores mas menos DMs"
"Versão B gerou mais cliques mas público menos qualificado"
"Quero combinar gancho da A com CTA da B"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXEMPLO PRÁTICO COMPLETO

CONTEXTO:
Carla é designer gráfica freelancer. Tem 2.800 seguidores, publica regularmente, conteúdo tem qualidade. Mas taxa de conversão perfil→cliente é terrível.
Por cada 100 pessoas que visitam perfil, apenas 8 seguem. Dos seguidores, <2% alguma vez abriram DM para orçamento.

BIO ATUAL DA CARLA:
🎨 Designer Gráfica
Criativa apaixonada por branding
Lisboa, Portugal 🇵🇹
Há 6 anos no mercado
DM para projetos

Taxa conversão: 8% visita→seguidor, 1,2% seguidor→DM

O QUE CARLA ENVIOU:
Plataforma: Instagram
Nicho: Design gráfico para pequenos negócios locais
Público-alvo: Donos de pequenos negócios em Lisboa, 25-45 anos
Principal oferta: Branding completo (logo + identidade visual) por 850€
Objetivo: Gerar leads qualificados por DM
Diferencial: Especialização em pequenos negócios locais + preço acessível + processo rápido (15 dias)
Prova social: 47 projetos entregues, cliente aumentou vendas 60% após rebrand

O QUE O AGENTE RESPONDEU:

ANÁLISE DA BIO ATUAL:
❌ Gancho genérico ("Designer Gráfica") - não para scroll
❌ "Criativa apaixonada" = fluff, zero valor específico
❌ Localização é irrelevante para linha 2
❌ "6 anos experiência" não gera urgência
❌ "DM para projetos" vago demais

VERSÃO A: FOCO EM RESULTADO
Pequenos negócios que redesenhei faturam +60% 📈
Branding completo em 15 dias (não 3 meses)
47 projetos • Featured Designs Lisboa
Especialista em restaurantes + lojas locais
💬 DM: orçamento gratuito hoje

VERSÃO B: FOCO EM PROCESSO
Da ideia ao logo profissional em 15 dias ⚡
Para donos de negócios fartos de parecer "amadores"
Branding 850€ • 47 projetos entregues
Logo + identidade completa + ficheiros finais
🎯 DM para começar esta semana

VERSÃO C: FOCO EM ESPECIALIZAÇÃO
A designer que os restaurantes de Lisboa escolhem 🍽️
Branding que aumenta vendas (não só "fica bonito")
15 dias da ideia à identidade completa
47 negócios locais já confiaram em mim
✉️ DM: quero ver o teu projeto

RESULTADOS REAIS (após 2 semanas cada):

Versão A (resultado): 22% conversão (+175%), 12 DMs/semana (+400%)
Versão B (processo): 18% conversão (+125%), 8 DMs/semana (+233%)
Versão C (especialização): 16% conversão (+100%), 6 DMs/semana (+150%), mas 45% DM→cliente

VERSÃO VENCEDORA: A (resultado)

3 meses depois:
• Agenda completa para próximos 2 meses
• Faturamento: de 2.400€/mês para 6.800€/mês
• Lista de espera de 12 projetos
• Preços aumentados para 1.200€ por excesso de procura

Carla: "Nunca pensei que 5 linhas pudessem mudar tanto o meu negócio."`
      },
      {
        label: "Anatomia da Bio",
        content: `ANATOMIA DE UMA BIO QUE CONVERTE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ELEMENTO 1: GANCHO (linha 1)

Primeira frase que faz pessoa parar scroll. Tens 3 segundos.

Fórmulas que funcionam:
• Resultado específico: "Clientes faturam +240% em 90 dias"
• Método único: "O único sistema de vendas para introvertidos"
• Contraste: "De 500€/mês para 50.000€/mês em 18 meses"
• Especificação: "A psicóloga que CEOs procuram em burnout"
• Promessa ousada: "Inglês fluente em 90 dias (ou devolvo dinheiro)"

Exemplos por nicho:
Fitness: "Perdi 40kg sem ginásio nem dieta restritiva"
Business: "Startups que aconselho levantam +2M€ funding"
Relacionamentos: "Salvei 847 casamentos à beira do divórcio"
Design: "Marcas que criei aumentaram vendas 340%"
Tech: "Apps que programo têm 1M+ downloads"

O que evitar:
❌ Cargo genérico ("Consultora", "Coach", "Designer")
❌ Palavras vazias ("Apaixonada", "Criativa", "Experiente")
❌ Sobre ti ("Mãe de 2", "Lisboa", "Formada em X")


ELEMENTO 2: PARA QUEM SERVES (linha 2)

Qualificação da audiência. Filtra pessoas certas, repele pessoas erradas.

Fórmulas:
• Por situação: "Para mães que voltam ao trabalho após licença"
• Por problema: "Para quem tem produto bom mas vendas fracas"
• Por objetivo: "Para freelancers que querem cobrar +200€/hora"
• Por fase: "Para empresas 1-10 funcionários em crescimento"

Vago: "Para mulheres empreendedoras"
Específico: "Para consultoras com agenda lotada mas sem escala"

Erros comuns:
❌ Demasiado amplo ("Para toda a gente")
❌ Demasiado restritivo ("Para homens diabéticos de Lisboa")


ELEMENTO 3: O QUE ENTREGAS (linha 3)

Transformação específica que prometes. Não o que fazes, mas o resultado final.

Fraco: "Ajudo com produtividade"
Forte: "6 horas de trabalho = 12 horas de resultados"

Fraco: "Ensino vendas"
Forte: "SDRs batem meta 3 meses seguidos"


ELEMENTO 4: PROVA SOCIAL (linha 4)

Tipos de prova:
• Numérica: "147 clientes atendidos"
• Resultado: "95% aprovação em exames"
• Reconhecimento: "Featured Forbes Under 30"
• Empresas: "Trabalho com Microsoft, Google, Amazon"

❌ Números baixos ("Ajudei 3 pessoas")
❌ Reconhecimentos irrelevantes ("Formada pela universidade X")


ELEMENTO 5: CTA CLARO (linha 5)

CTAs por objetivo:
• Para seguidores: "Segue para dicas diárias"
• Para leads: "E-book gratuito no link abaixo"
• Para vendas: "Curso com 40% desconto (só hoje)"
• Para networking: "DM para colaborações"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OS 7 TIPOS DE BIO POR OBJETIVO

1. BIO PARA GANHAR SEGUIDORES
Dicas diárias para freelancers ganharem +3.000€/mês 💰
Para quem trabalha sozinho mas quer viver bem
Estratégias testadas em 200+ projetos próprios
Post novo todo dia às 8h da manhã
👆 Segue para não perder nenhuma dica

2. BIO PARA GERAR LEADS
Eliminei ansiedade social sem terapia nem medicação 🧠
Para introvertidos que evitam eventos networking
Método testado por 500+ pessoas (94% sucesso)
E-book gratuito: 7 técnicas para confiança instantânea
📩 DM 'EBOOK' para receber hoje

3. BIO PARA VENDER PRODUTO
Inglês fluente em 90 dias (garantido ou €€ devolvidos) 🇬🇧
Para executivos que precisam inglês para trabalho
347 alunos fluentes • Método aprovado Cambridge
Curso completo: apenas 297€ (era 597€)
⏰ Promoção acaba domingo: link na bio

4. BIO PARA AUTORIDADE
Economista-chefe Banco Millennium • 15 anos mercados 📊
Especialista em investimentos para classe média portuguesa
Artigos Expresso, SIC Notícias, Podcast "Dinheiro Inteligente"
Explico finanças em linguagem simples (sem jargão)
📖 Artigo semanal no blog: link abaixo

5. BIO PARA NETWORKING B2B
Head Marketing @ SaaS startup • Ex-Google Portugal 🚀
Scaleups B2B: growth de 0 a 1M€ ARR
Ajudei Talkdesk, Outsystems, Remote crescer 300%+
Aberto a: mentoria, consultoria, investimento anjo
💼 Parcerias sérias: LinkedIn ou email abaixo

6. BIO PARA TRÁFEGO PARA BLOG/SITE
Estratégias marketing digital que realmente funcionam 📱
Para PMEs que desperdiçam € em campanhas erradas
2 artigos/semana • 150+ posts publicados
Aprende sem gastar milhares em "gurus"
🔗 Artigos gratuitos: www.marketingreal.pt

7. BIO PARA COMUNIDADE
Construindo comunidade de mães empreendedoras 👶💼
700+ mães que equilibram família e negócios
Partilhamos recursos, fazemos parcerias, apoiamo-nos
Networking real + oportunidades concretas
💬 Junta-te: grupo privado no link da bio`
      },
      {
        label: "Destaques",
        content: `ESTRATÉGIA DE DESTAQUES (HIGHLIGHTS)

Os destaques são continuação do teu funil. Pessoa seguiu por causa da bio, agora quer saber mais. Destaques educam e convertem.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORDEM ESTRATÉGICA (quais primeiro)

Pessoas leem destaques da esquerda para direita. Ordem importa:

Posição 1: "Sobre mim" - Quem és, credenciais, por que confiar
Posição 2: "Como funciona" - Teu método/processo/sistema
Posição 3: "Resultados" - Casos de sucesso, antes/depois
Posição 4: "Testemunhos" - Clientes a falar por ti
Posição 5: "Preços" - Transparência sobre investimento
Posição 6: "FAQ" - Objeções principais respondidas
Posição 7: "Contacto" - Como chegar até ti
Posição 8: "Novidades" - Lançamentos, promoções atuais


NOMES QUE CONVERTEM vs GENÉRICOS

❌ Genéricos: "Sobre", "Trabalhos", "Contactos", "Info"
✅ Convertem: "Quem sou", "Portfólio", "Orçamentos", "Como funciona"

"Sobre" não promete valor específico. "Quem sou" sugere história interessante.
"Trabalhos" é lista aborrecida. "Portfólio" promete inspiração visual.


CONTEÚDO DENTRO DE CADA DESTAQUE

DESTAQUE 1 - QUEM SOU (3-5 Stories):
Story 1: Foto profissional + nome + função principal
Story 2: Credenciais principais (números, reconhecimentos)
Story 3: Por que fazes o que fazes (missão pessoal)
Story 4: Diferencial único vs concorrência
Story 5: "Queres saber mais? Vê próximos destaques"

DESTAQUE 2 - COMO FUNCIONA (4-6 Stories):
Story 1: "O meu método em 4 passos"
Story 2-5: Cada passo explicado com exemplo
Story 6: "Pronto para começar? Contacta-me"

DESTAQUE 3 - RESULTADOS (6-8 Stories):
Story 1: "Casos reais de clientes"
Story 2-7: Antes/depois de diferentes clientes
Story 8: Estatísticas gerais (% sucesso, tempo médio)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXEMPLO COMPLETO: NUTRICIONISTA

1. QUEM SOU 👩‍⚕️
Dra. Ana Silva, Nutricionista
8 anos experiência + 300+ pacientes
Especialização emagrecimento sustentável
"Odeio dietas restritivas - ensino estilo de vida"

2. MÉTODO SLIM 📋
Passo 1: Avaliação metabólica completa
Passo 2: Plano alimentar personalizado
Passo 3: Acompanhamento semanal
Passo 4: Manutenção para vida

3. ANTES & DEPOIS ⚖️
Case 1: Maria -15kg em 4 meses
Case 2: João -22kg em 6 meses
Case 3: Carla -8kg + músculos
Estatística: 87% mantêm peso após 1 ano

4. TESTEMUNHOS 💬
Vídeo Maria: "Mudou a minha vida"
Texto João: "Sem sofrimento nem fome"
Audio Carla: "Aprendi a comer bem"

5. PREÇOS CLAROS 💰
Consulta inicial: 60€ (1h30)
Acompanhamento mensal: 45€/sessão
Pacote 6 meses: 450€ (poupas 120€)
Plano online: 27€/mês

6. FAQ PRINCIPAIS ❓
"Posso comer de tudo?" → Sim, com moderação
"Quanto tempo demora?" → 3-8 meses média
"É muito caro?" → Menos que ginásio + suplementos

7. COMO COMEÇAR 🚀
Passo 1: DM ou WhatsApp
Passo 2: Agendamento consulta
Passo 3: Avaliação inicial
Passo 4: Início do plano

8. NOVIDADES 🆕
Novo: Consultas online disponíveis
Promoção: 20% desconto novos clientes
Workshop gratuito: "5 erros em dietas"


DESIGN CONSISTENTE
Todos destaques devem ter:
• Cor de fundo igual (brand color)
• Tipografia igual
• Layout semelhante
• Logo/marca presente
• CTA no final de cada destaque

Ferramentas recomendadas: Canva, Unfold, Story Art`
      },
      {
        label: "Técnicas Avançadas",
        content: `TÉCNICAS AVANÇADAS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TÉCNICA 1: TESTE A/B DE BIO

Métricas principais:
• Taxa visita→seguidor (analytics Instagram Business)
• Número DMs recebidos/semana
• Cliques no link (analytics link ou Bitly)
• Menções/tags por outros utilizadores

Setup do teste:
Semana 1-2: Bio A
Semana 3-4: Bio B
Semana 5-6: Bio vencedora
Controla outras variáveis (tipo posts, horários, hashtags)

Exemplo de medição:
BIO A: 1.247 visitas → 89 seguidores (7,1%) → 12 DMs/semana
BIO B: 1.156 visitas → 178 seguidores (15,4%) → 23 DMs/semana
Bio B vence em todas métricas.


TÉCNICA 2: BIO SAZONAL

Bio não é "set and forget". Atualiza conforme campanhas.

Lançamento produto: Linha 5: "Novo curso: 50% desconto só esta semana"
Black Friday: Linha 1: Inclui "Black Friday: 70% desconto"
Natal: Tons mais relacionais, CTAs sobre "oferecer como presente"
Verão (fitness): Foco "corpo de verão", urgência temporal
Setembro (educação): "Volta às aulas" para adultos

Como automatizar:
• Calendário editorial anual
• Templates sazonais prontos
• Lembretes para atualizar


TÉCNICA 3: EMOJIS ESTRATÉGICOS (não decorativos)

Funções estratégicas:
• Quebrar texto: Tornar bio mais fácil de ler
• Destacar números: 📈 +240% faturamento
• Indicar ação: 👆 Segue para dicas diárias
• Criar urgência: ⏰ Oferta acaba domingo

Emojis por nicho:
Business/Finanças: 📈📊💰🚀⚡💼
Fitness/Saúde: 💪⚖️🏃‍♀️🥗❤️✨
Educação/Coaching: 🧠📚✅🎯💡🏆
Design/Criativo: 🎨📸✨💻🖌️🔥
Tech/Digital: 💻📱⚙️🔧📊🚀

Regras: Máximo 3-4 emojis total na bio. Só usar se acrescentar valor.

❌ Excessivo:
🌟Consultora de negócios🌟
✨Ajudo empresas a crescer✨
💖Apaixonada por resultados💖

✅ Estratégico:
Consultora: empresas crescem +180% em 6 meses 📈
Para CEOs com equipas 5-50 pessoas
47 empresas transformadas • Featured Forbes
💼 DM para consultoria gratuita


TÉCNICA 4: LINK NA BIO OTIMIZADO

Link direto simples:
Para 1 objetivo específico. Máxima conversão, zero fricção.

Linktree/similares:
Para múltiplos destinos. Várias opções numa página mas dispersa atenção.

Página própria:
Controlo total da experiência. Brand consistente, dados próprios.

Otimização Linktree:
• Título da página = proposta valor clara
• Links ordenados por prioridade
• Botões com CTA específico ("Baixar ebook", não "Clica aqui")
• Design alinhado com marca

Otimização página própria:
• Loading rápido (mobile-first)
• CTA acima da fold
• Sem menu/distrações
• Foco numa ação principal


TÉCNICA 5: BIO MULTI-IDIOMA

Opção 1 - Bio bilíngue:
Português: Ajudo freelancers a cobrar 3x mais
English: I help freelancers charge 3x higher rates
🌍 PT/EN support available

Opção 2 - Bio principal + nota:
Freelancers que aconselho cobram +200% 📈
Para designers, copywriters, consultores
200+ clientes • 15 países
🌍 English support: DM "ENGLISH"

Opção 3 - Destaques separados:
Bio em português + Destaque "ENGLISH" com versão inglesa

Cuidados: Não misturar idiomas numa frase. Tradução profissional. Testar com nativos.`
      },
      {
        label: "Por Plataforma",
        content: `OTIMIZAÇÃO POR PLATAFORMA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTAGRAM
Limite: 150 caracteres máximo

Estrutura otimizada:
• Linha 1: 25-30 caracteres (gancho forte)
• Linha 2: 35-40 caracteres (público-alvo)
• Linha 3: 30-35 caracteres (resultado/prova)
• Linha 4: 30-35 caracteres (método/diferencial)
• Linha 5: 20-25 caracteres (CTA direto)

Exemplo (147 caracteres):
Clientes faturam +340% em 90 dias 📈
CEOs startups tech 1-50 funcionários
47 empresas • Método GROWTH validado
Ex-Google • MBA Wharton • Forbes 30u30
💼 Consultoria gratuita: link bio

Uso de emojis: 2-3 estratégicos, não mais
Destaques: Máximo 9 visíveis, ordem estratégica


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIKTOK
Audiência mais jovem (18-35). Tom mais descontraído.

Exemplo:
POV: Ensino o que escolas não ensinaram 🎓
Finanças pessoais para Geração Z
1M+ views • 89% seguidores poupam mais €
Sem jargão financeiro (só linguagem normal)
📱 App gratuita: link na bio

CTA específico TikTok:
• "Segue para mais dicas"
• "Guarda este vídeo"
• "Partilha se concordas"
• "Comenta tua situação"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LINKEDIN
Tom profissional obrigatório. Limite: 220 caracteres.

Exemplo:
Head of Sales @ SaaS startup | Ex-Microsoft Portugal
Ajudo startups B2B escalarem de 0 a €1M ARR em 18 meses
47 empresas aceleradas • Método validado Techstars + 500 Startups
Especialização: SaaS, Fintech, HealthTech
Aberto a: Mentoria, Consultoria, Board Advisory
📧 Contacto: [email] | 🔗 Case studies: [link]

Elementos LinkedIn específicos:
• Cargo atual + empresa
• Historial profissional relevante
• Especialização técnica específica
• Abertura a oportunidades


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TWITTER/X
Brevidade extrema: 160 caracteres. Foco em autoridade + opinião forte.

Exemplo:
Ex-CTO 3 unicórnios • Invisto em startups AI/ML
Opiniões sobre tech, growth, product
Newsletter semanal: 12k+ subs
👇 Thread diário às 9h

Tom Twitter:
• Mais direto/assertivo
• Opiniões fortes permitidas
• Menos "vendinha"
• Mais thought leadership`
      },
      {
        label: "Problemas Comuns",
        content: `PROBLEMAS COMUNS (E SOLUÇÕES)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEMA 1: "Muito tráfego mas poucos seguidores"
Sintomas: Posts virais 50k+ views, 2k+ visitas perfil, apenas 30-50 seguidores (<3%)
Causa: Bio não fala com público que tráfego viral trouxe.
Solução: Analisa que posts geram mais tráfego. Ajusta bio para esse público.

Antes:
Coach de vida • Ajudo pessoas
Transformação pessoal e profissional

Depois:
4 horas trabalho = 12 horas resultados ⚡
Para founders que trabalham muito mas faturam pouco
500+ CEOs implementaram método FOCUS
📋 Sistema gratuito: link na bio


PROBLEMA 2: "Bio parece genérica"
Causa: Copias estrutura de outros sem adicionar diferencial único.
Solução: Exercício - Lista 5 concorrentes, anota bios, identifica padrões comuns, brainstorm o que tens que eles não têm.

Concorrentes (todos iguais):
Personal trainer • Ajudo a emagrecer

Tu (diferente):
Ex-obeso: -47kg sem dieta restritiva 💪
Para homens +40 que desistiram de emagrecer
Método HOMEM: sem fome, sem suplementos caros
🍕 Como emagreci comendo pizza: link bio


PROBLEMA 3: "Seguidores mas nenhum contacto/venda"
Causa: CTA fraco ou inexistente.

❌ Fraco: "DM para mais informações"
✅ Forte: "DM 'PREÇOS' para orçamento hoje"

❌ Fraco: "Link na bio"
✅ Forte: "E-book gratuito: 5 estratégias comprovadas"

❌ Fraco: "Contacta-me"
✅ Forte: "Consultoria gratuita 30min: calendário no link"


PROBLEMA 4: "Taxa alta de unfollow após seguir"
Causa: Bio promete uma coisa, conteúdo entrega outra.
Solução: Auditoria de alinhamento:
• Bio promete: ____
• Últimos 10 posts foram sobre: ____
• Match? Se não: muda bio ou muda conteúdo


PROBLEMA 5: "Bio atrai curiosos, não clientes"
Causa: Bio demasiado ampla. Não filtra pessoas com problema/orçamento.
Solução: Incluir qualificadores.

Antes (atrai curiosos):
Ajudo pessoas a ganhar dinheiro online 💰

Depois (filtra qualificados):
Freelancers: de 500€ para 5000€/mês em 8 meses 📈
Apenas consultoria premium (investimento 2000€+)
Vagas limitadas: 5 clientes novos/trimestre
📧 Candidatura: link na bio (processo seletivo)


PROBLEMA 6: "Bio boa mas destaques vazios"
Causa: Bio é porta de entrada, destaques são sala de espera.
Solução: Auditoria destaques:
• Quantos tens? (ideal: 6-8)
• Ordem faz sentido? (mais importante primeiro)
• Nomes convertem? (evita genéricos)
• Conteúdo atualizado? (<6 meses)
• Design consistente? (mesmas cores/fonte)
• CTA em cada um? (próximo passo claro)`
      },
      {
        label: "Fluxos & Checklist",
        content: `INTERAGINDO COM OUTROS AGENTES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FLUXO DE LANÇAMENTO DE PRODUTO:
Semana -4: Arquiteto de Infoprodutos (define produto + posicionamento)
Semana -3: Otimizador de Bio (bio nova focada no produto + destaques)
Semana -2: Batch Creator (sequência de aquecimento)
Semana -1: Escritor de Copy (copy de pré-lançamento)
Semana 0: Analisador de Viralização (otimiza posts de lançamento)
→ Bio alinhada com produto desde início maximiza conversão.


FLUXO DE CRESCIMENTO:
Dia 1: Gerador de Ideias (conteúdo viral para nicho)
Dia 2: Mestre dos Ganchos (ganchos irresistíveis)
Dia 3: Criador de Carrossel (formato educativo)
Dia 4: Publica conteúdo
Dia 5: Otimizador de Bio (ajusta bio para tráfego recebido)
Dia 6-7: Analisador (mede conversão perfil→seguidor)
→ Tráfego viral converte melhor com bio otimizada.


FLUXO DE REPOSICIONAMENTO:
Semana 1: Otimizador de Bio (nova bio + destaques)
Semana 2: Batch Creator (conteúdo alinhado com nova bio)
Semana 3: Mestre dos Ganchos (ganchos consistentes)
Semana 4: Analisador (mede aceitação da mudança)
→ Transição suave sem confundir audiência existente.


FLUXO PERPÉTUO:
Conteúdo viral (Gerador de Ideias + Mestre dos Ganchos)
→ Visitam perfil
→ Bio converte em seguidor (Otimizador de Bio)
→ Destaques educam (processo, resultados, testemunhos)
→ CTA converte em cliente (Escritor de Copy + Analisador)
→ Sistema automatizado de conversão 24/7.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHECKLIST

Antes de passar para a próxima aula, confirme:

☐ Acessei o Agente 1
☐ Fiz meu primeiro teste com contexto específico
☐ Recebi variações de bio estruturadas
☐ Escolhi 1 versão para testar
☐ Sei que o próximo passo é usar Agente 2

Pronto. Você nunca mais vai ter uma bio que não converte.

Próxima aula: transformar essas ideias em conteúdo completo.`
      },
    ],
  },
  {
    id: "agente-2",
    name: "Gerador de Ideias",
    description: "Gera ideias de conteúdo viral com relevância específica, gancho forte e ângulo único. Nunca mais ficas sem saber o que publicar.",
    icon: "💡",
    category: "Ideias",
    link: "https://chatgpt.com/g/g-69794e103e208191988041faba1f0f31-gerador-de-ideias-virais",
    banner: "/agentes/gerador-banner.png",
    tabs: [
      {
        label: "Sobre",
        content: `Sabe aquela sensação de sentar na frente do computador e a mente ficar completamente em branco?

Você abre o Instagram. Olha o feed. Vê outras pessoas do seu nicho postando. E nada.

Zero ideias.

Isso não acontece porque você não é criativo. Acontece porque criatividade sob pressão é praticamente impossível. Quando você precisa de uma ideia agora, seu cérebro trava.

É tipo pedir para alguém "seja engraçado agora". Não funciona assim.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SOBRE O AGENTE GERADOR DE IDEIAS

💡 O problema não é falta de criatividade

E é exatamente isso que o Gerador de Ideias faz.

Uma ideia verdadeiramente boa tem três coisas:

Relevância específica. Fala direto com uma dor do seu público.

Um gancho forte. Primeira frase que prende a atenção.

Um ângulo único. Abordagem diferente do óbvio.

"Vou falar sobre produtividade" não é uma ideia. É um tópico vago. Milhares de pessoas falam sobre produtividade. Por que alguém pararia o scroll para te ouvir?

O problema é que ter "uma ideia qualquer" não é suficiente.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 O QUE ESTE AGENTE CRIA

O Gerador de Ideias não joga tópicos vagos na sua cara. Ele entrega ideias estruturadas e prontas para desenvolver.

Cada ideia inclui:

• Título/Gancho - A primeira linha que vai na capa do seu post. Otimizada para fazer a pessoa parar o scroll.

• Ângulo Estratégico - A abordagem psicológica. Contradição (vai contra o senso comum), Facilidade (promete algo simples), Medo (aponta um risco), Curiosidade (cria lacuna de informação).

• Formato Recomendado - Se funciona melhor como Carrossel, Reels ou Post simples.

• Direção de Desenvolvimento - Como desenvolver a ideia, que pontos abordar, que emoção ativar.

Exemplo real:
IDEIA 3:
Título: "5 erros que matam sua produtividade (e você nem percebe)"
Ângulo: Revelação + Autodiagnóstico
Formato: Carrossel lista
Desenvolvimento: Listar erros sutis, explicar por que prejudicam, dar alternativa simples para cada.

Percebe a diferença? Não é "fale sobre produtividade". É uma ideia completa, estruturada, pronta para virar conteúdo.`
      },
      {
        label: "Quando Usar",
        content: `✨ QUANDO USAR ESTE AGENTE

Segunda-feira de manhã
Para planejar a semana. Uma sessão de 15 minutos gera 10 ideias - mais de uma semana de conteúdo.

Quando algo viraliza no seu nicho
Peça "ideias contra-intuitivas sobre [tópico viral]". Você surfa a onda com perspectiva original.

Antes de lançar um produto
Peça "ideias que preparem minha audiência para comprar [produto]". Ele cria conteúdo que educa e aquece sem ser invasivo.

Quando quer expandir
Se quer explorar subtemas, seja específico. "Ideias sobre produtividade para mães empreendedoras" vs "ideias sobre produtividade para freelancers".

Quando o alcance está baixo
Peça "ideias polêmicas" ou "ideias que geram debate" para reativar a audiência.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ QUANDO NÃO USAR

• Para copy de vendas, use o Agente 6.

• Para otimizar conteúdo que já existe, use o Agente 4.

• Para escrever o post, use o Agente 2.

Não use este agente para criar o conteúdo final. Ele é gerador de faíscas, não o escritor completo.`
      },
      {
        label: "Como Usar",
        content: `COMO USAR

Passo 1: Acesse o agente

Clique no link Gerador de Ideias Virais

Você vai ver uma tela do ChatGPT com o agente carregado. Ele se apresenta e pergunta como pode ajudar. Não precisa configurar nada.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Passo 2: Prepare sua solicitação

O segredo está em dar contexto específico. Use este template:

Olá! Sou [seu nicho/profissão].
Minha audiência são [descrição do público].
Eles têm dificuldade com [dor principal].
Quero [quantidade] ideias de [tipo de conteúdo] sobre [tema específico].
O objetivo é [atrair/educar/preparar para venda].
Meu tom é [descontraído/profissional/motivador].

Quanto mais contexto, melhores as ideias.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Passo 3: Envie e aguarde

Geralmente leva 30-60 segundos para gerar 10 ideias completas.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Passo 4: Analise os resultados

Leia todas antes de escolher. Pergunte a si mesmo:

• Qual me empolga mais?
• Qual minha audiência reagiria melhor?
• Qual tenho mais conhecimento para desenvolver?
• Qual é mais única?


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Passo 5: Refine se necessário

Se as ideias ficaram genéricas, dê feedback específico:

"Ficaram muito básicas, pode ser mais ousado?"
"Preciso de algo mais prático, menos teórico"
"O tom ficou muito sério, pode ser mais descontraído?"

O agente ajusta na mesma conversa.`
      },
      {
        label: "Exemplo",
        content: `EXEMPLO PRÁTICO COMPLETO

CONTEXTO:

Marina é coach de produtividade para empreendedores sobrecarregados. Sua audiência trabalha 10+ horas por dia mas sente que não avança. Eles vivem "correndo" e "apagando fogos".

Marina quer criar conteúdo que faça essas pessoas pensarem "isso sou eu!" e começarem a segui-la.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O QUE MARINA ENVIOU:

Olá! Sou coach de produtividade especializada em empreendedores sobrecarregados.

Minha audiência são donos de pequenos negócios (25-40 anos) que trabalham 10+ horas por dia mas sentem que não avançam. Eles vivem "sempre correndo" e "apagando fogos".

Suas maiores dores:
- Não ter tempo para pensar estrategicamente
- Trabalhar muito mas crescer pouco
- Sentir que estão sempre atrasados
- Não conseguir delegar

Quero 10 ideias de carrossel que os façam pensar "isso sou eu!" e me sigam para aprenderem a sair disso.

Tom: prático, direto, sem enrolação. Foco em soluções reais.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O QUE O AGENTE RESPONDEU:

Aqui estão 10 ideias focadas em identificação imediata:

1. "Por que você trabalha 12h mas seu concorrente de 6h fatura mais"
   Ângulo: Contradição/Eficiência
   Formato: Carrossel comparativo

2. "5 sinais que você virou funcionário do próprio negócio"
   Ângulo: Autodiagnóstico/Despertar
   Formato: Carrossel lista

3. "O que fazer quando tudo é urgente (spoiler: não é)"
   Ângulo: Priorização/Alívio
   Formato: Carrossel educativo

4. "Como ganhei 3 horas por dia sem contratar ninguém"
   Ângulo: Resultado pessoal/Curiosidade
   Formato: Carrossel storytelling

5. "Você não precisa trabalhar mais, precisa trabalhar diferente"
   Ângulo: Alívio/Mudança de perspectiva
   Formato: Carrossel antes vs depois

6. "3 tarefas que você faz mas deveria parar hoje"
   Ângulo: Subtração/Liberdade
   Formato: Carrossel ação imediata

7. "Por que sua agenda lotada é sinal de fracasso"
   Ângulo: Provocação
   Formato: Carrossel reflexão

8. "O teste dos 15 minutos que vai mudar seu negócio"
   Ângulo: Curiosidade/Ação simples
   Formato: Carrossel passo a passo

9. "Como parei de ser bombeira e virei CEO"
   Ângulo: Transformação pessoal
   Formato: Carrossel narrativo

10. "O que seus concorrentes fazem em 2h que você leva 8h"
    Ângulo: Competitividade/Eficiência
    Formato: Carrossel revelação


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POR QUE ISSO FUNCIONA:

Repara como cada ideia ataca diretamente as dores que Marina mencionou.

A ideia 2 ("5 sinais que você virou funcionário do próprio negócio") é particularmente forte. Muitos empreendedores sentem isso mas nunca verbalizaram dessa forma.

A ideia 5 oferece alívio imediato. Não é sobre trabalhar mais - eles já fazem demais. É sobre trabalhar diferente. Isso remove a resistência.

A ideia 7 é provocativa mas não ofensiva. Transforma algo que eles veem como positivo (agenda lotada) em sinal de problema. Gera curiosidade.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O QUE FAZER AGORA:

Marina escolheu a ideia 2 porque combina autodiagnóstico + identificação + solução.

Próximo passo: levar para o Agente 2 (Criador de Carrossel) e desenvolver slide por slide.`
      },
      {
        label: "Técnicas",
        content: `TÉCNICAS QUE FUNCIONAM

Técnica 1: Re-prompt

Se as ideias ficaram mornas, responda: "Seja mais agressivo e polêmico" ou "Simplifique para uma criança de 5 anos".

O agente aguenta feedback direto.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Técnica 2: Fusão de ideias

Às vezes a ideia 3 e a 7 são boas mas incompletas sozinhas. Combine: "Crie uma ideia que junte o ângulo da 3 com o formato da 7".


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Técnica 3: Validação prévia

Pergunte: "Dessa lista, qual tem maior probabilidade de viralizar e por quê?". O agente faz auto-análise baseada em padrões de engajamento.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Técnica 4: Exploração de subtemas

Pegue uma ideia que gostou e peça: "Dê-me 5 variações desta ideia para diferentes ângulos".


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INTERAGINDO COM OUTROS AGENTES

Fluxo mais comum:
Gerador de Ideias (cria ideias) → Escolhe uma → Criador de Carrossel (desenvolve)

Fluxo otimizado:
Gerador de Ideias (cria ideias) → Escolhe uma → Mestre dos Ganchos (refina o gancho) → Criador de Carrossel (desenvolve com gancho otimizado)

Fluxo estratégico:
Gerador de Ideias (cria ideias) → Analisador de Viralização (avalia o potencial de cada) → Escolhe a melhor → Criador de Carrossel (desenvolve)

Fluxo de validação:
Gerador de Ideias (ideias sobre tópico X) → Testa 2–3 nos Stories → Vê qual teve mais engajamento → Desenvolve a vencedora com Criador de Carrossel


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEMAS COMUNS (E SOLUÇÕES)

Problema 1: "As ideias ficaram muito genéricas"
Por quê acontece: Input vago gera output vago.
Solução: Seja mais específico no contexto. Em vez de "sou coach", diga "sou coach de produtividade para mães empreendedoras que trabalham de casa".

Problema 2: "Não sei qual ideia escolher"
Por quê acontece: Todas parecem boas (ou todas parecem ruins).
Solução: Pergunte ao agente: "Qual dessas tem maior potencial viral considerando meu público?" Ou escolha a que mais te empolga - paixão transparece no conteúdo.

Problema 3: "As ideias não parecem comigo"
Por quê acontece: O tom não foi especificado ou foi genérico.
Solução: Seja específico sobre tom. "Tom sarcástico como stand-up comedy" vs "Tom empático como terapeuta" vs "Tom direto como treinador militar".

Problema 4: "Sempre recebo as mesmas ideias"
Por quê acontece: Você está usando os mesmos inputs.
Solução: Varie os ângulos. Peça "ideias polêmicas", depois "ideias inspiradoras", depois "ideias práticas". Mude o contexto.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXERCÍCIO PRÁTICO

Agora é sua vez.

Exercício 1 (5 minutos):
Acesse o Agente 1 e peça 10 ideias sobre seu nicho. Use o template que te dei. Veja o que acontece.

Exercício 2 (10 minutos):
Se as ideias ficaram genéricas, refine. Dê feedback específico. Veja como ele ajusta.

Exercício 3 (15 minutos):
Escolha a melhor ideia. Leve para o Agente 2 (próxima aula). Desenvolva em post completo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHECKLIST

Antes de passar para a próxima aula, confirme:

☐ Acessei o Agente 1
☐ Fiz meu primeiro teste com contexto específico
☐ Recebi 10 ideias estruturadas
☐ Escolhi 1 ideia que me empolgou
☐ Sei que o próximo passo é usar Agente 2

Pronto. Você nunca mais vai ficar sem ideias.

Próxima aula: transformar essas ideias em conteúdo completo.`
      },
    ],
  },
  {
    id: "agente-3",
    name: "Criador de Carrossel Completo",
    description: "Transforma ideias em carrosséis prontos para publicar, slide por slide. Estrutura narrativa que prende, educa e converte.",
    icon: "📑",
    category: "Conteúdo",
    link: "https://chatgpt.com/g/g-69794fb6c9a481919c170f5a221fb317-criador-de-carrossel-completo",
    banner: "/agentes/carrossel-banner.png",
    tabs: [
      {
        label: "Sobre",
        content: `Você tem uma ótima ideia.

Sabe que vai funcionar, que sua audiência vai amar, que tem tudo para viralizar.

Aí senta para escrever e... trava.

Como transformar essa ideia numa sequência de slides que prende a atenção do começo ao fim? Quantos slides fazer? O que escrever em cada um? Como terminar sem soar forçado?

É aí que o Criador de Carrossel entra.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A DIFERENÇA ENTRE IDEIA E CONTEÚDO

Ter uma boa ideia é 20% do trabalho. Os outros 80% são execução.

Você pode ter a ideia mais genial do mundo, mas se não souber desenvolver, vira só mais um post que passa despercebido no feed.

O Criador de Carrossel é especialista nessa execução. Ele pega sua ideia (ou uma ideia do Gerador de Ideias) e transforma numa estrutura completa, slide por slide.

Não é só "escrever sobre o tópico". É construir uma narrativa que prende, educa, entretém e converte.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 O QUE ESTE AGENTE CRIA

O Criador de Carrossel entrega posts prontos para usar. Você literalmente pode copiar e colar no Canva.

Cada carrossel inclui:

• Slide 1 - Gancho forte: A primeira frase que faz a pessoa parar e pensar "preciso ler isso".

• Slides 2-8 - Desenvolvimento: Cada slide desenvolve um ponto específico. Informação densa mas digestível. Nada de enchimento.

• Slide 9 - Conclusão impactante: Uma frase que resume tudo e dá sensação de "nossa, faz todo sentido".

• Slide 10 - CTA suave: Call-to-action que não parece vendinha. Convida para ação natural.

Plus: ele te dá sugestões visuais simples para cada slide. Nada complexo. Coisas que você consegue fazer no Canva mesmo sendo iniciante.`
      },
      {
        label: "Quando Usar",
        content: `✨ QUANDO USAR ESTE AGENTE

Quando tem uma ideia boa mas não sabe desenvolver
Você sabe que "5 erros de produtividade" vai funcionar, mas não sabe quais erros abordar nem como explicar cada um.

Quando quer transformar conteúdo antigo em carrossel
Aquele post que você escreveu há 6 meses e fez sucesso? O agente transforma em carrossel atualizado.

Quando precisa explicar algo complexo de forma simples
Tem conhecimento avançado no seu nicho mas quer tornar acessível? Ele quebra em pedaços digestíveis.

Quando quer criar conteúdo educativo que prende
Diferente de um tutorial chato, ele cria fluxo narrativo que mantém a pessoa grudada até o final.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ QUANDO NÃO USAR

• Não use para posts simples de uma imagem só. Ele é para conteúdo estruturado.

• Não use para Stories. É específico para carrossel feed.

• Não use para copy de vendas direta. Para isso, use o Escritor de Copy.`
      },
      {
        label: "Como Usar",
        content: `COMO USAR

Passo 1: Acesse o agente
Clique no link Criador de Carrossel Completo


Passo 2: Escolha seu input

Opção A: Ideia do Gerador de Ideias
"Desenvolva esta ideia em carrossel: [cola a ideia completa]"

Opção B: Sua própria ideia
"Crie carrossel sobre: [sua ideia] para [seu público] com foco em [objetivo]"

Opção C: Conteúdo existente
"Transforme este texto em carrossel: [cola seu texto]"


Passo 3: Seja específico sobre seu público
Sempre mencione para quem é o conteúdo:
• "Para empreendedores iniciantes"
• "Para mães que trabalham de casa"
• "Para designers freelancers"
• "Para pessoas querendo emagrecer"


Passo 4: Defina o objetivo
• Educar
• Inspirar
• Gerar debate
• Posicionar autoridade
• Preparar para venda


Passo 5: Revise e ajuste
O primeiro resultado já é bom, mas você pode pedir ajustes:
• "Slide 3 ficou confuso, pode simplificar?"
• "Preciso de mais um slide entre o 5 e 6"
• "CTA ficou muito vendinha"`
      },
      {
        label: "Exemplo Prático",
        content: `EXEMPLO PRÁTICO COMPLETO

CONTEXTO:
Marina escolheu a ideia "5 sinais que você virou funcionário do próprio negócio" para desenvolver.

O QUE MARINA ENVIOU:
Desenvolva esta ideia em carrossel:
Título: "5 sinais que você virou funcionário do próprio negócio"
Ângulo: Autodiagnóstico/Despertar
Formato: Carrossel lista
Público: Empreendedores sobrecarregados (25-40 anos) que trabalham 10+ horas mas sentem que não crescem.
Objetivo: Fazer eles se identificarem e perceberem que precisam mudar.


O QUE O AGENTE RESPONDEU:

SLIDE 1 (CAPA):
"5 sinais que você virou funcionário do próprio negócio"
(E não é brincadeira)

SLIDE 2:
Se você se identifica com 3+ sinais...
É hora de parar e repensar sua estratégia.
Ser dono não significa trabalhar mais. Significa trabalhar melhor.

SLIDE 3 - SINAL 1: Você não tira férias
"Não posso sair, o negócio para"
Se sua empresa não funciona sem você presente 24h, você não tem um negócio. Tem um emprego caro.

SLIDE 4 - SINAL 2: Você faz tudo sozinho
Atendimento, vendas, marketing, financeiro, entrega...
Parabéns! Você tem 5 empregos e paga pra trabalhar.

SLIDE 5 - SINAL 3: Sua agenda não tem espaços em branco
Reunião, tarefa, emergência, reunião, tarefa...
Onde está o tempo para pensar estratégia? Para planejar crescimento? Para ser CEO de verdade?

SLIDE 6 - SINAL 4: Você ganha por hora trabalhada
Trabalhou menos = ganhou menos. Não trabalhou = não ganhou nada.
Isso não é empreendedorismo. É freelance disfarçado.

SLIDE 7 - SINAL 5: Você tem medo de delegar
"Ninguém faz como eu faço" / "Vai dar mais trabalho ensinar"
Mentira. Você tem medo de perder controle.

SLIDE 8 - A REAL:
Funcionário resolve problemas. Empreendedor cria sistemas.
Funcionário trabalha no negócio. Empreendedor trabalha no crescimento.

SLIDE 9:
Se você se reconheceu em 3+ sinais...
Não é culpa sua. Ninguém te ensinou a diferença entre ser dono e ser CEO. Mas agora você sabe.

SLIDE 10:
Próximos passos: Escolha 1 sinal que mais te incomoda. Crie 1 ação para mudá-lo esta semana. Comente qual escolheu 👇


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POR QUE ISSO FUNCIONA:

Slide 1 promete informação valiosa. Slide 2 cria expectativa. Slides 3-7 entregam valor puro — cada um é um "aha moment".

Slide 8 eleva o nível — sai do diagnóstico e vai para solução conceitual. Slide 9 remove culpa e empodera. Slide 10 convida para ação sem pressionar.

O CTA não pede follow, não vende nada. Pede engajamento genuíno. Isso gera comentários e aumenta alcance.


O RESULTADO:
Marina postou exatamente como estava. O carrossel teve 847 likes, 156 comentários e 23 salvamentos. Ela ganhou 89 seguidores novos em 24h.
Mais importante: recebeu 12 DMs de pessoas interessadas no seu trabalho.`
      },
      {
        label: "Técnicas Avançadas",
        content: `TÉCNICAS AVANÇADAS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TÉCNICA 1: O SLIDE GANCHO

Se o Slide 1 não está prendendo, peça: "Crie 3 versões diferentes do slide 1, mais provocativas".

O agente vai testar ângulos como:
• Pergunta direta: "Você é dono ou funcionário do seu negócio?"
• Estatística chocante: "87% dos 'empreendedores' são funcionários disfarçados"
• Contradição: "Ter um negócio não faz de você empreendedor"


TÉCNICA 2: O SLIDE PONTE

Se a transição entre dois slides está abrupta, peça um slide ponte:
"Preciso de um slide entre o 4 e o 5 que conecte 'fazer tudo sozinho' com 'agenda lotada'"


TÉCNICA 3: PERSONALIZAÇÃO PROFUNDA

Dê exemplos específicos do seu nicho:
"Em vez de exemplos genéricos, use situações específicas de [seu nicho]. Por exemplo, no slide sobre delegar, fale sobre [situação específica que seu público vive]"


TÉCNICA 4: TOM ADJUSTMENT

Se o tom não está certo:
• "Menos provocativo, mais empático"
• "Mais direto, menos enrolação"
• "Tom de mentor, não de professor"


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VARIAÇÕES DE FORMATO

O Criador de Carrossel não faz só listas. Ele domina vários formatos:

• Formato Lista: Melhor para dicas, erros, sinais, ferramentas.
• Formato Storytelling: Sua jornada pessoal dividida em momentos marcantes.
• Formato Antes vs Depois: Transformação mostrada slide a slide.
• Formato Tutorial: Passo a passo visual de um processo.
• Formato Mito vs Verdade: Derruba crenças limitantes do seu nicho.

Para mudar formato:
"Transforme esta ideia em carrossel storytelling"
"Quero formato antes vs depois"`
      },
      {
        label: "Fluxos & Checklist",
        content: `INTERAGINDO COM OUTROS AGENTES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FLUXO CLÁSSICO:
Gerador de Ideias (cria ideia) → Criador de Carrossel (desenvolve) → Publica

FLUXO OTIMIZADO:
Gerador de Ideias (cria ideia) → Mestre dos Ganchos (otimiza título) → Criador de Carrossel (desenvolve) → Analisador de Viralização (avalia) → Ajusta → Publica

FLUXO DE VENDAS:
Gerador de Ideias (ideia educativa) → Criador de Carrossel (desenvolve) → Escritor de Copy (cria legenda de vendas) → Publica

FLUXO DE VALIDAÇÃO:
Criador de Carrossel (cria carrossel) → Analisador de Viralização (avalia potencial) → Se score >40, publica. Se não, volta pro Criador de Carrossel para ajustar.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEMAS COMUNS (E SOLUÇÕES)

Problema 1: "Slides muito longos"
Causa: Input complexo demais ou público não especificado.
Solução: "Cada slide deve ter máximo 15 palavras. Simplifique a linguagem para [nível do seu público]."

Problema 2: "Não tem fluxo narrativo"
Causa: Ideia original não tinha estrutura clara.
Solução: "Reorganize os slides para contar uma história: problema → agitação → solução → ação."

Problema 3: "CTA muito forçado"
Causa: Agente tentou vender sem contexto.
Solução: "CTA só pode pedir engajamento (comentário, salvamento, compartilhamento). Nada de venda direta."

Problema 4: "Muito técnico para meu público"
Causa: Linguagem não calibrada.
Solução: "Reescreva como se estivesse explicando para [pessoa específica do seu público]. Use linguagem que ela usaria com amigos."


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXERCÍCIO PRÁTICO

Exercício 1 (10 minutos):
Pegue a ideia que você escolheu na Aula 1. Leve para o agente. Use o template que te mostrei.

Exercício 2 (15 minutos):
Se algum slide ficou confuso, peça para ajustar. Teste diferentes abordagens até ficar natural.

Exercício 3 (5 minutos):
Leve o carrossel pronto para o Analisador de Viralização e veja a avaliação. Score acima de 35 = pode publicar.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHECKLIST

☐ Acessei o Criador de Carrossel
☐ Desenvolvi uma ideia em carrossel completo
☐ Cada slide tem máximo 20 palavras
☐ O fluxo narrativo faz sentido
☐ O CTA convida para engajamento natural
☐ Sei como ajustar se necessário

Pronto. Agora você nunca mais vai ter ideia boa que não sabe desenvolver.

Próxima aula: como fazer seus ganchos pararem qualquer scroll.`
      },
    ],
  },
  {
    id: "agente-4",
    name: "Mestre dos Ganchos",
    description: "Transforma títulos fracos em scroll-stoppers usando gatilhos psicológicos. Cria várias versões para testar e maximizar alcance.",
    icon: "🎣",
    category: "Copywriting",
    link: "https://chatgpt.com/g/g-69795166e4ec81918f20acef0f9a70fb-mestre-dos-ganchos",
    banner: "/agentes/ganchos-banner.png",
    tabs: [
      {
        label: "Sobre",
        content: `Você fez um carrossel incrível.

Conteúdo denso, slides bem estruturados, CTA perfeito. Tudo certo para viralizar.

Aí publica e... 47 likes.

Sabe por quê? O gancho.

Se o primeiro slide não prender nos primeiros 0,5 segundos, não importa quão bom seja o resto. A pessoa vai passar direto.

O Mestre dos Ganchos resolve exatamente isso.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POR QUE O GANCHO É TUDO

No Instagram, você compete com gatinhos, memes, stories de influencers, notícias e milhões de outros posts pelo tempo de atenção da pessoa.

Você tem meio segundo — isso mesmo, 0,5 segundo — para fazer alguém parar o scroll.

Se falhar, perdeu. Não tem segunda chance.

"Como melhorar sua produtividade" não faz ninguém parar. É genérico, previsível, já viu mil vezes.

"Por que você nunca vai ser produtivo (e não é culpa sua)" faz parar. Cria contradição, remove culpa, promete revelação.

Mesma ideia, abordagem totalmente diferente.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 O QUE ESTE AGENTE FAZ

O Mestre dos Ganchos pega títulos fracos e os transforma em scroll-stoppers.

Ele não apenas melhora. Ele cria várias versões usando diferentes gatilhos psicológicos:

• Versão Curiosidade: Cria gap de informação que o cérebro precisa preencher.
• Versão Contradição: Vai contra o senso comum estabelecido.
• Versão Medo: Aponta um risco que a pessoa não percebeu.
• Versão Facilidade: Promete resultado com menos esforço.
• Versão Especificidade: Usa números e detalhes precisos.

Cada versão serve para teste. Você escolhe a que mais ressoa com sua audiência.`
      },
      {
        label: "Quando Usar",
        content: `✨ QUANDO USAR ESTE AGENTE

Quando seu alcance está baixo
Posts com poucos likes geralmente têm gancho fraco. O Mestre dos Ganchos revitaliza.

Antes de publicar conteúdo importante
Aquele carrossel que você sabe que pode viralizar? Teste 3-5 versões do gancho primeiro.

Para repostar conteúdo antigo
Post de 6 meses atrás que funcionou? Novo gancho pode fazê-lo viralizar de novo.

Quando quer testar ângulos
A/B test real: posta a mesma ideia com ganchos diferentes em dias diferentes. Vê qual performa melhor.`
      },
      {
        label: "Como Usar",
        content: `COMO USAR

Passo 1: Acesse o agente
Clique no link Mestre dos Ganchos


Passo 2: Envie seu gancho atual
Pode ser:
• Título que você criou
• Primeiro slide de um carrossel
• Ideia que quer transformar em gancho
• Gancho de outro post que quer melhorar


Passo 3: Dê contexto

Meu gancho atual: [seu gancho]
Meu público: [descrição]
Objetivo do post: [educar/inspirar/gerar debate/etc]
Meu tom habitual: [descontraído/sério/provocativo/etc]


Passo 4: Analise as versões
O agente vai entregar 5-7 versões diferentes. Cada uma com explicação do gatilho psicológico usado.


Passo 5: Escolha e teste
Escolha 2-3 que mais te chamaram atenção. Teste nos Stories primeiro ou poste versões diferentes ao longo da semana.`
      },
      {
        label: "Exemplo Prático",
        content: `EXEMPLO PRÁTICO COMPLETO

CONTEXTO:
Carlos é personal trainer online. Ele criou um carrossel sobre exercícios em casa, mas o alcance foi baixo.
Gancho original: "10 exercícios para fazer em casa"

O QUE CARLOS ENVIOU:
Meu gancho atual: "10 exercícios para fazer em casa"
Meu público: Pessoas sedentárias (25-45 anos) que querem começar a se exercitar mas não têm tempo/dinheiro para academia. Maioria são mulheres que trabalham e têm filhos.
Objetivo do post: Educar e mostrar que é possível se exercitar sem equipamentos.
Tom habitual: Motivador mas realista. Não uso fitness-talk exagerado.


O QUE O AGENTE RESPONDEU:

VERSÃO 1 - CONTRADIÇÃO:
"Por que academia é perda de tempo (10 exercícios que provam isso)"
Gatilho: Vai contra crença estabelecida de que só academia funciona.

VERSÃO 2 - ESPECIFICIDADE + TEMPO:
"10 exercícios que queimam mais que 30 min de esteira"
Gatilho: Comparação específica + eficiência de tempo.

VERSÃO 3 - PROBLEMA + ALÍVIO:
"Sem tempo para academia? Estes 10 exercícios resolvem"
Gatilho: Identifica dor específica + oferece solução direta.

VERSÃO 4 - AUTORIDADE + RESULTADO:
"10 exercícios que uso com clientes preguiçosas (e funcionam)"
Gatilho: Prova social + identificação com "preguiça".

VERSÃO 5 - CURIOSIDADE:
"O exercício que odeio ensinar (mas que mais funciona)"
Gatilho: Contradição interna + curiosidade sobre qual é.

VERSÃO 6 - FACILIDADE:
"Exercícios para quem odeia exercícios"
Gatilho: Remove resistência + identifica com aversão.

VERSÃO 7 - TRANSFORMAÇÃO:
"Como parei de pagar R$150/mês de academia"
Gatilho: Economia + storytelling pessoal.


ANÁLISE:
A versão 4 foi a que mais chamou atenção do Carlos. Por quê?
• Usa "preguiçosas" — palavra que ressoa com o público feminino que se sente culpada por não ser ativa.
• Usa "clientes" — estabelece autoridade sem ser arrogante.
• Usa "funcionam" — promete resultado baseado em experiência real.

RESULTADO FINAL:
Gancho original: 127 likes, 8 comentários
Novo gancho: 1.247 likes, 89 comentários, 156 salvamentos

Mesmo conteúdo. Só mudou o gancho.`
      },
      {
        label: "10 Gatilhos",
        content: `OS 10 GATILHOS PSICOLÓGICOS QUE FUNCIONAM

1. CONTRADIÇÃO
"Por que [crença comum] está te prejudicando"

2. CURIOSIDADE
"O segredo que [autoridade] não quer que você saiba"

3. ESPECIFICIDADE
"Exatamente 7 minutos para [resultado desejado]"

4. MEDO
"5 erros que estão sabotando seu [objetivo]"

5. FACILIDADE
"A maneira preguiçosa de [tarefa difícil]"

6. AUTORIDADE
"Depois de [X anos/casos/experiência], descobri que..."

7. TRANSFORMAÇÃO
"Como fui de [situação ruim] para [situação boa]"

8. EXCLUSIVIDADE
"Só 3% das pessoas sabem este [segredo/truque/método]"

9. URGÊNCIA
"Pare de [erro comum] antes que seja tarde"

10. IDENTIFICAÇÃO
"Para quem [situação específica do público]"

Você pode pedir versões específicas: "Crie versão de curiosidade" ou "Quero usar o padrão de transformação".


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FÓRMULAS PRONTAS PARA USAR

Para conteúdo educativo:
"[Número] [erros/sinais/dicas] que [consequência] ([qualificação específica])"

Para storytelling:
"Como [situação inicial ruim] me ensinou [lição valiosa]"

Para contradição:
"Por que [crença popular] está [te prejudicando/é mentira/não funciona]"

Para urgência:
"Pare de [fazer X] antes que [consequência ruim]"

Para facilidade:
"A maneira [adjetivo positivo] de [tarefa difícil/chata]"`
      },
      {
        label: "Técnicas Avançadas",
        content: `TÉCNICAS AVANÇADAS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TÉCNICA 1: STACKING DE GATILHOS
Combine dois gatilhos numa frase:
"5 erros [especificidade] que 90% dos coaches fazem [medo + autoridade]"


TÉCNICA 2: PERSONALIZAÇÃO EXTREMA
Use linguagem específica do seu nicho:
Em vez de "pessoas que querem emagrecer"
Use "mulheres que usam roupa tamanho M mas se sentem XL"


TÉCNICA 3: TESTE TEMPORAL
Poste o mesmo conteúdo com ganchos diferentes:
• Segunda: versão curiosidade
• Quarta: versão contradição
• Sexta: versão facilidade
Vê qual performa melhor e usa esse padrão nos próximos posts.


TÉCNICA 4: GANCHO EM CAMADAS
CAMADA 1 (gancho): "Por que você nunca vai emagrecer"
CAMADA 2 (subtítulo): "(não é falta de força de vontade)"

A primeira camada para o scroll. A segunda remove objeção.`
      },
      {
        label: "Fluxos & Checklist",
        content: `INTERAGINDO COM OUTROS AGENTES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FLUXO DE OTIMIZAÇÃO:
Criador de Carrossel (cria carrossel) → Mestre dos Ganchos (otimiza gancho) → Analisador de Viralização (avalia) → Publica

FLUXO A/B TEST:
Mestre dos Ganchos (cria 5 versões) → Testa 2-3 nos Stories → Escolhe melhor → Criador de Carrossel (ajusta se necessário)

FLUXO DE REATIVAÇÃO:
Post antigo com baixo alcance → Mestre dos Ganchos (cria novo gancho) → Analisador de Viralização (confirma potencial) → Reposta

FLUXO DE IDEIAS:
Gerador de Ideias (cria ideias) → Mestre dos Ganchos (transforma cada ideia em gancho) → Escolhe melhor → Criador de Carrossel (desenvolve)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEMAS COMUNS (E SOLUÇÕES)

Problema 1: "Ganchos muito clickbait"
Solução: "Versões mais éticas. Quero curiosidade sem sensacionalismo. Tudo que prometo preciso entregar no conteúdo."

Problema 2: "Não combina com minha personalidade"
Solução: "Ajuste para tom mais [empático/técnico/descontraído]. Como se [pessoa que admira] escrevesse."

Problema 3: "Muito parecidos entre si"
Solução: "Crie versões mais contrastantes. Uma provocativa, uma empática, uma técnica, uma divertida."

Problema 4: "Não fazem sentido para meu nicho"
Solução: Dê exemplos específicos do público.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXERCÍCIO PRÁTICO

Exercício 1 (10 minutos):
Pegue o carrossel que você criou na Aula 2. Leve o primeiro slide para o Mestre dos Ganchos. Peça 5 versões otimizadas.

Exercício 2 (5 minutos):
Escolha a versão que mais te chamou atenção. Pergunte: "Eu pararia o scroll para ler isso?"

Exercício 3 (15 minutos):
Teste nos Stories. Poste as 2 melhores versões em Stories diferentes.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHECKLIST

☐ Acessei o Mestre dos Ganchos
☐ Testei otimização de um gancho
☐ Recebi pelo menos 5 versões diferentes
☐ Entendi qual gatilho psicológico cada uma usa
☐ Escolhi 1-2 para testar
☐ Sei como dar feedback para ajustar o tom

Agora você tem o poder de fazer qualquer pessoa parar o scroll.
Use com responsabilidade.

Próxima aula: como saber se seu conteúdo vai viralizar antes mesmo de publicar.`
      },
    ],
  },
  {
    id: "agente-5",
    name: "Analisador de Viralização",
    description: "Analisa o teu conteúdo em 6 critérios científicos e dá uma nota de 0 a 60. Sabe se o teu post vai viralizar antes de publicares.",
    icon: "📊",
    category: "Análise",
    link: "https://chatgpt.com/g/g-6979553c69408191acf2159a6487c82c-analisador-de-viralizacao",
    banner: "/agentes/analisador-banner.png",
    tabs: [
      {
        label: "Sobre",
        content: `Você criou um carrossel.

Está orgulhoso do resultado. Tem certeza que vai bombar.

Aí publica e... 73 likes.

Frustrante, né?

E se eu te dissesse que dá para saber se um post vai viralizar antes de publicar?

É exatamente isso que o Analisador de Viralização faz.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A CIÊNCIA POR TRÁS DA VIRALIZAÇÃO

Viralização não é sorte. Não é algoritmo misterioso. Não é hora certa de postar.

É ciência comportamental aplicada.

Todo conteúdo viral tem 6 elementos em comum. Sempre. Sem exceção.

Este agente analisa seu conteúdo nesses 6 critérios e dá uma nota de 0 a 60. Acima de 40 = alta chance de viralizar. Abaixo de 25 = volta para o rascunho.

É seu controle de qualidade antes de apertar "publicar".


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OS 6 CRITÉRIOS DE VIRALIZAÇÃO

1. GANCHO (0-10 pontos)
Para o scroll em 0,5 segundos? Cria curiosidade imediata? Usa linguagem do público-alvo?

2. RETENÇÃO (0-10 pontos)
Prende até o final? Cada slide adiciona valor? Tem ritmo narrativo?

3. VALOR GUARDÁVEL (0-10 pontos)
A pessoa salvaria para consultar depois? Tem informação densa? É referência no tema?

4. CONEXÃO EMOCIONAL (0-10 pontos)
Gera identificação ("isso sou eu!")? Toca em dores reais? Cria empatia?

5. CLAREZA (0-10 pontos)
Mensagem é cristalina? Linguagem adequada ao público? Sem ambiguidade?

6. CHAMADA PARA AÇÃO (0-10 pontos)
CTA natural e relevante? Convida para engajamento genuíno? Não força venda?


SCORE TOTAL: X/60
• 50-60: Viral quase garantido
• 40-49: Alta performance
• 30-39: Performance média
• 20-29: Baixa performance
• 0-19: Não publique`
      },
      {
        label: "Quando Usar",
        content: `✨ QUANDO USAR ESTE AGENTE

Antes de publicar conteúdo importante
Aquele post que você acha que pode viralizar? Analise antes. Se score baixo, ajuste.

Quando posts recentes tiveram baixo alcance
Pegue 2-3 posts que performaram mal. Analise. Vê o padrão dos problemas.

Para melhorar conteúdo existente
Post bom mas que pode ficar excelente? Análise + ajustes = segunda chance.

Para entender sua audiência
Posts com scores altos revelam o que sua audiência mais valoriza.`
      },
      {
        label: "Como Usar",
        content: `COMO USAR

Passo 1: Acesse o agente
Clique no link Analisador de Viralização


Passo 2: Envie seu conteúdo
Você pode enviar:
• Carrossel completo (slide por slide)
• Apenas o gancho (para análise rápida)
• Ideia que quer validar antes de desenvolver
• Post já publicado (para entender performance)


Passo 3: Dê contexto

Meu público: [descrição específica]
Objetivo deste post: [educar/inspirar/vender/etc]
Plataforma: [Instagram/LinkedIn/etc]


Passo 4: Receba análise detalhada
O agente entrega:
• Score total (/60)
• Nota individual para cada critério (/10)
• Explicação específica do que funcionou/não funcionou
• Sugestões práticas de melhoria
• Previsão de performance


Passo 5: Ajuste baseado no feedback
• Se score baixo em GANCHO → use Mestre dos Ganchos
• Se score baixo em CONTEÚDO → volte ao Criador de Carrossel
• Se score baixo geral → considere nova ideia`
      },
      {
        label: "Exemplo Prático",
        content: `EXEMPLO PRÁTICO COMPLETO

CONTEXTO:
Lúcia é consultora de marketing. Ela criou um carrossel sobre "Como conseguir mais clientes" mas estava insegura se ia funcionar.

O QUE LÚCIA ENVIOU:
SLIDE 1: "Como conseguir mais clientes"
SLIDE 2: "Ter mais clientes é o sonho de todo empreendedor"
SLIDE 3: "Dica 1: Poste mais no Instagram"
SLIDE 4: "Dica 2: Interaja com seu público"
SLIDE 5: "Dica 3: Faça parcerias"
SLIDE 6: "Dica 4: Invista em ads"
SLIDE 7: "Dica 5: Tenha um site profissional"
SLIDE 8: "Implementando essas dicas você terá sucesso"
SLIDE 9: "Qual dessas dicas você vai testar primeiro?"

Público: Empreendedores iniciantes (25-35 anos)
Objetivo: Educar e gerar engajamento
Plataforma: Instagram


O QUE O AGENTE RESPONDEU:

🎯 GANCHO: 3/10
"Como conseguir mais clientes" é genérico demais. Não para o scroll.
Melhoria: Ex: "5 estratégias que me trouxeram 47 clientes em 30 dias"

📚 RETENÇÃO: 4/10
Slides muito vazios. Pessoa lê rápido demais e sai.
Melhoria: Adicione mais informação por slide. Explique o "como" de cada dica.

💎 VALOR GUARDÁVEL: 2/10
Dicas muito genéricas. Nada que a pessoa não saiba.
Melhoria: Dê táticas específicas. "Poste mais" → "Poste 3x/dia: 9h, 14h, 19h"

🎯 CLAREZA: 7/10
Estrutura clara, fácil de seguir.
Ponto forte: Lista numerada funciona bem.

❤️ CONEXÃO EMOCIONAL: 5/10
Identifica problema mas não aprofunda a dor.
Melhoria: Fale sobre frustração de não conseguir clientes.

📢 CTA: 6/10
Pergunta boa para engajamento.
Melhoria: Seja mais específica. "Qual vai testar ESTA semana?"

SCORE TOTAL: 27/60 (BAIXO)
RECOMENDAÇÃO: Não publique assim. Refaça o gancho e adicione mais valor tático.


O QUE LÚCIA FEZ:
• Mudou gancho para: "5 táticas que me trouxeram 23 clientes em 2 meses (testei 17)"
• Adicionou detalhes específicos em cada dica
• Incluiu números e exemplos reais
• Reforçou conexão emocional no slide 2

RESULTADO:
Versão original teria ~200 likes.
Versão otimizada: 1.847 likes, 234 comentários, 89 salvamentos.
Score da versão final: 51/60 (Alto)`
      },
      {
        label: "6 Critérios",
        content: `OS 6 CRITÉRIOS EXPLICADOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. GANCHO (0-10)
Avalia se o primeiro slide/frase faz parar o scroll.
• Score 8-10: Contradição forte, curiosidade extrema, número chocante
• Score 5-7: Interessante mas não único
• Score 0-4: Genérico, já viu mil vezes


2. RETENÇÃO (0-10)
Avalia se a pessoa lê até o fim.
• Score 8-10: Cada slide adiciona informação nova, tem ganchos internos
• Score 5-7: Interessante mas alguns slides fracos
• Score 0-4: Enchimento, pessoa sai no meio


3. VALOR GUARDÁVEL (0-10)
Avalia se vale salvar para consultar depois.
• Score 8-10: Informação densa, tática, aplicável
• Score 5-7: Tem valor mas poderia ser mais prático
• Score 0-4: Genérico, óbvio, sem aplicabilidade


4. CLAREZA (0-10)
Avalia se a mensagem é cristalina.
• Score 8-10: Uma ideia por slide, linguagem simples, fluxo lógico
• Score 5-7: Claro mas poderia ser mais direto
• Score 0-4: Confuso, mistura ideias, jargões


5. CONEXÃO EMOCIONAL (0-10)
Avalia identificação com o público.
• Score 8-10: Pessoa pensa "isso sou eu", usa linguagem do público
• Score 5-7: Alguma identificação mas superficial
• Score 0-4: Frio, técnico, não gera identificação


6. CTA (0-10)
Avalia se convida para ação natural.
• Score 8-10: CTA específico, fácil de fazer, gera valor mútuo
• Score 5-7: CTA genérico mas funcional
• Score 0-4: Sem CTA ou muito forçado


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TÉCNICAS DE MELHORIA BASEADAS NO SCORE

Se GANCHO está baixo (0-6):
→ Leve para Mestre dos Ganchos. Peça versões mais provocativas/específicas/curiosas.

Se RETENÇÃO está baixa (0-6):
→ Volte para Criador de Carrossel. Peça: "Cada slide precisa ter informação nova. Corte enchimento."

Se VALOR GUARDÁVEL está baixo (0-6):
→ Adicione especificidade. Números, exemplos concretos, checklists, templates.

Se CONEXÃO EMOCIONAL está baixa (0-6):
→ Use mais linguagem do público. Exemplos que eles vivem. Dores específicas.

Se CLAREZA está baixa (0-6):
→ Simplifique. Uma ideia por slide. Remova jargões.

Se CTA está baixo (0-6):
→ Pergunte algo específico. Convide para ação que gera valor mútuo.`
      },
      {
        label: "Fluxos & Checklist",
        content: `INTERAGINDO COM OUTROS AGENTES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FLUXO DE QUALIDADE TOTAL:
Gerador de Ideias (cria ideia) → Criador de Carrossel (desenvolve) → Analisador de Viralização (avalia) → Ajustes → Analisador (nova análise) → Se >40, publica

FLUXO DE OTIMIZAÇÃO:
Analisador (identifica ponto fraco) → Agente específico (Carrossel ou Ganchos) para corrigir → Analisador (confirma melhoria)

FLUXO DE APRENDIZADO:
Post publicado → Analisador (analisa) → Compara score vs performance real → Aprende padrões

FLUXO A/B TEST:
Cria 2 versões → Analisador analisa ambas → Publica a de maior score → Confirma resultado


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEMAS COMUNS (E SOLUÇÕES)

Problema 1: "Score alto mas performance baixa"
Possíveis causas: Horário ruim, audiência pequena, saturação do tópico, problema técnico.
Solução: Reposte em horário diferente ou com gancho ajustado.

Problema 2: "Score baixo em todos os critérios"
Causa: O conteúdo em si está fraco.
Solução: Não publique. Volte para o Gerador de Ideias com contexto mais específico.

Problema 3: "O agente disse que vai viralizar mas eu não acredito"
Causa: Perdeu a confiança no próprio instinto.
Solução: O agente analisa padrões objetivos. Se score é alto, publique. Confie na ciência, não no medo.

Problema 4: "Preciso de score perfeito (60/60)"
Causa: Perfeccionismo paralisante.
Solução: Score 40+ já é excelente. 60/60 é quase impossível e desnecessário.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXERCÍCIO PRÁTICO

Exercício 1 (10 minutos):
Pegue seu último post com baixo alcance. Analise com o Analisador. Vê qual critério teve score mais baixo.

Exercício 2 (15 minutos):
Crie uma nova versão focando no critério fraco. Use o agente específico para melhorar.

Exercício 3 (5 minutos):
Analise a versão melhorada. Compare scores. Só publique se score total for >35.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHECKLIST

☐ Acessei o Analisador de Viralização
☐ Analisei pelo menos um post antes de publicar
☐ Entendi o que cada critério avalia
☐ Sei como melhorar pontos fracos
☐ Score do meu último teste foi >35
☐ Confio no feedback científico do agente

Agora você nunca mais vai publicar no escuro.

Próxima aula: como criar semana inteira de conteúdo em 30 minutos.`
      },
    ],
  },
  {
    id: "agente-6",
    name: "Batch Creator",
    description: "Cria semanas inteiras de conteúdo estratégico em 30 minutos. Cada post conecta-se ao próximo numa narrativa coesa.",
    icon: "📅",
    category: "Estratégia",
    link: "https://chatgpt.com/g/g-69795e97becc8191910d78f97a3d2a51-batch-creator-semana-de-conteudo-viral",
    banner: "/agentes/batch-banner.png",
    tabs: [
      {
        label: "Sobre",
        content: `Domingo de noite.

Você lembra que tem que postar segunda, terça, quarta, quinta, sexta... a semana inteira.

Pânico.

Vai ter que sentar todo santo dia e pensar "o que posto hoje?". E escrever. E criar. E publicar.

É exaustivo só de pensar.

E se eu te dissesse que dá para resolver a semana inteira em 30 minutos?

É exatamente isso que o Batch Creator faz.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O PROBLEMA DA CRIAÇÃO DIÁRIA

Criar conteúdo todo dia não é sustentável.

Você começa motivado. "Vou postar todo dia!". Primeira semana vai bem. Segunda semana, começa a pesar. Terceira semana, já está atrasado.

O problema não é falta de disciplina. É que o cérebro não funciona assim.

Criatividade exige espaço mental. Você não pode estar em "modo urgente" todo dia e esperar resultado consistente.

Além disso, criar um post por vez impede você de ver o panorama estratégico. Cada post vira uma peça isolada em vez de parte de uma narrativa maior.

O Batch Creator resolve isso criando semanas inteiras de conteúdo de uma vez. Mas não é só "7 posts aleatórios". É uma estratégia coesa onde cada post se conecta ao próximo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 O QUE ESTE AGENTE CRIA

O Batch Creator não joga 7 ideias aleatórias na sua cara. Ele cria uma semana estratégica completa.

Cada semana inclui:
• Tema central: Um tópico guarda-chuva que conecta todos os posts.
• Arco narrativo: Progressão lógica do dia 1 ao dia 7.
• Variedade de formato: Mix de educacional, inspiracional, engajamento, CTA.
• Estratégia de conversão: Posts iniciais educam, posts finais preparam para venda.
• Títulos otimizados: Cada post já vem com gancho forte.
• Sugestão de ordem: Qual postar segunda, terça, quarta, etc.

Exemplo real de semana criada:
Tema: Produtividade para empreendedores sobrecarregados

Segunda: "5 sinais que você virou funcionário do próprio negócio" (Diagnóstico)
Terça: "Por que sua agenda lotada é sinal de fracasso" (Provocação)
Quarta: "3 tarefas que você faz mas deveria parar hoje" (Ação rápida)
Quinta: "Como ganhei 3 horas por dia sem contratar ninguém" (Prova/Inspiração)
Sexta: "O teste dos 15 minutos que vai mudar seu negócio" (Ferramenta prática)
Sábado: "Você não precisa trabalhar mais, precisa trabalhar diferente" (Mindset)
Domingo: Descanso ou post leve de reflexão

Repara: não são 7 posts aleatórios. É uma jornada. Cada dia prepara o próximo.`
      },
      {
        label: "Quando Usar",
        content: `✨ QUANDO USAR ESTE AGENTE

Toda segunda-feira de manhã
Ritual semanal. 30 minutos e sua semana está resolvida. Resto da semana você só executa.

Quando está sem tempo
Semana corrida pela frente? Uma sessão de batch creation te livra da pressão diária.

Para manter consistência
A maior causa de parar de postar é cansaço mental. Batch creation remove 90% do esforço cognitivo.

Antes de lançamento
Aquecimento para lançar produto? Crie 2-3 semanas de conteúdo estratégico que prepara sua audiência.

Para testar temas
Quer validar se um tópico ressoa? Crie semana completa sobre ele e teste reação.

Quando quer elevar estratégia
Criando post por post, você pensa operacional. Criando semanas, você pensa estratégico.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ QUANDO NÃO USAR

• Não use para criar conteúdo reativo. Se algo viraliza no seu nicho hoje, reaja hoje.
• Não use se você gosta de criar no momento. Se precisa de espontaneidade, batch não é pra você.
• Não use para Stories. É específico para conteúdo feed estruturado.`
      },
      {
        label: "Como Usar",
        content: `COMO USAR

Passo 1: Acesse o agente
Clique no link Batch Creator


Passo 2: Defina o período
• 1 semana (7 posts)
• 2 semanas (14 posts)
• 1 mês (30 posts - só se já domina o processo)
Comece com 1 semana. Domine antes de escalar.


Passo 3: Dê contexto estratégico

Quero criar [número] posts para [período].

Sobre mim:
- Nicho: [seu nicho]
- Público: [descrição detalhada]
- Dores principais: [3-4 dores]
- Objetivo da semana: [educar/aquecer para venda/posicionar autoridade/etc]

Temas que quero abordar: [liste 2-3 se tiver preferência]
Tom: [seu estilo]
Formatos preferidos: [carrossel/texto/etc]

Quanto mais contexto, mais estratégica a semana.


Passo 4: Receba a estratégia completa
O agente entrega:
• Tema central da semana
• Racional estratégico (por que essa ordem)
• 7 ideias completas com título, ângulo, formato
• Sugestão de ordem de publicação
• Como cada post se conecta ao próximo


Passo 5: Ajuste se necessário
• "Substitua o post 3 por algo mais prático"
• "Inverta o dia 2 com o dia 5"
• "Expanda a ideia do post 4"


Passo 6: Desenvolva cada post
Pegue cada ideia e leve para o Criador de Carrossel. Ou desenvolva você mesmo.`
      },
      {
        label: "Exemplo Prático",
        content: `EXEMPLO PRÁTICO COMPLETO

CONTEXTO:
Marina (coach de produtividade) quer posicionar autoridade e preparar para vender mentoria de R$1.997. Tem 2 semanas até o lançamento.

O QUE MARINA ENVIOU:
Quero criar 7 posts para a próxima semana.
Nicho: Coach de produtividade para empreendedores
Público: Donos de pequenos negócios (25-40 anos) que trabalham 10+ horas mas não crescem
Dores: Não têm tempo para estratégia, trabalham muito mas faturam pouco, não conseguem delegar
Objetivo: Educar sobre "trabalhar muito" vs "trabalhar certo". Preparar para mentoria semana seguinte.
Tom: Direto, prático, empático mas provocativo.
Formatos: 80% carrossel, 20% texto simples


O QUE O AGENTE RESPONDEU:

SEMANA ESTRATÉGICA: "Do Caos ao Controle"

RACIONAL:
Dia 1-2: Diagnóstico (identificação com o problema)
Dia 3-4: Provocação (desconforto produtivo)
Dia 5: Prova (é possível mudar)
Dia 6: Ferramenta (vitória rápida)
Dia 7: Convite suave (preparação para venda)

POST 1 - SEGUNDA: "5 sinais que você virou funcionário do próprio negócio"
Ângulo: Autodiagnóstico. Formato: Carrossel 10 slides.
Por que segunda: Dia de recomeço, diagnóstico gera reflexão.

POST 2 - TERÇA: "Por que sua agenda lotada não é conquista, é fracasso"
Ângulo: Contradição/Provocação. Formato: Carrossel 8 slides.
Por que terça: Continua provocação do dia 1.

POST 3 - QUARTA: "3 tarefas que você faz mas deveria parar HOJE"
Ângulo: Subtração/Liberdade. Formato: Carrossel 7 slides.
Por que quarta: Meio de semana precisa de energia. Ação rápida.

POST 4 - QUINTA: "Como ganhei 3 horas por dia sem contratar ninguém"
Ângulo: Resultado pessoal/Prova. Formato: Carrossel storytelling 9 slides.
Por que quinta: Após diagnóstico + provocação + ação, pessoa quer prova.

POST 5 - SEXTA: "O teste dos 15 minutos que separa dono de CEO"
Ângulo: Ferramenta prática. Formato: Carrossel tutorial 7 slides.
Por que sexta: Dia de planejar próxima semana.

POST 6 - SÁBADO: "Você não precisa trabalhar mais. Precisa trabalhar diferente."
Ângulo: Alívio/Mindset. Formato: Texto simples + imagem.
Por que sábado: Dia de reflexão. Post mais leve.

POST 7 - DOMINGO: "O que realmente muda um negócio (não é o que você pensa)"
Ângulo: Preparação para venda. Formato: Texto médio.
Por que domingo: Audiência mais qualificada. Convite suave para segunda.

CONEXÃO: Post 1→Diagnóstico abre os olhos → Post 2→Provocação aprofunda → Post 3→Ação rápida → Post 4→Prova social → Post 5→Ferramenta → Post 6→Alívio → Post 7→Prepara solução.

RESULTADO:
• Engajamento 2,3x maior que média
• 347 novos seguidores
• 89 salvamentos (posts 1, 4 e 5)
• 47 DMs perguntando sobre mentoria ANTES de abrir vendas
• Segunda seguinte: 8 vagas vendidas (R$15.976) em 48h`
      },
      {
        label: "Estratégias",
        content: `A CIÊNCIA POR TRÁS DA BATCH CREATION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. FLUXO CRIATIVO
Quando cria 7 posts de uma vez, entra em estado de fluxo. Primeira ideia é boa. Segunda é melhor. Na quinta, está brilhante. Criar um post por dia interrompe esse fluxo.

2. VISÃO ESTRATÉGICA
Vendo 7 posts juntos, percebe padrões: "Esta semana está muito educativa, falta CTA" ou "Estou repetindo o mesmo ângulo 3 vezes". Criando um por vez, perde essa visão.

3. CARGA COGNITIVA
Decidir "o que posto hoje" consome energia mental todo dia. Batch creation move toda essa decisão para um momento só.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VARIAÇÕES DE ESTRATÉGIA SEMANAL

ESTRATÉGIA 1: EDUCAÇÃO PURA
Objetivo: Posicionar autoridade
Estrutura: 7 posts educacionais sobre diferentes aspectos
Quando usar: Construindo audiência, não vendendo ainda

ESTRATÉGIA 2: AQUECIMENTO PARA VENDA
Objetivo: Preparar lançamento
Estrutura: Dia 1-4 educa, Dia 5-7 mostra necessidade de solução completa
Quando usar: 1-2 semanas antes de abrir vendas

ESTRATÉGIA 3: ENGAJAMENTO MÁXIMO
Objetivo: Aumentar alcance
Estrutura: Mix de polêmicos + práticos + inspiracionais
Quando usar: Alcance baixo, precisa reativar audiência

ESTRATÉGIA 4: SÉRIE TEMÁTICA
Objetivo: Deep dive em um tópico
Estrutura: 7 posts sobre o MESMO assunto, ângulos diferentes
Quando usar: Muito conhecimento sobre um tema específico

ESTRATÉGIA 5: TRANSFORMAÇÃO COMPLETA
Objetivo: Mostrar jornada
Estrutura: Dia 1 = problema, Dia 2-6 = passos da solução, Dia 7 = resultado
Quando usar: Quer ensinar processo completo`
      },
      {
        label: "Fluxos & Checklist",
        content: `INTERAGINDO COM OUTROS AGENTES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FLUXO COMPLETO SEMANAL:
Batch Creator (cria 7 ideias) → Para cada: Mestre dos Ganchos (otimiza título) → Criador de Carrossel (desenvolve) → Analisador de Viralização (valida) → Publica

FLUXO RÁPIDO:
Batch Creator (cria 7 ideias) → Criador de Carrossel (desenvolve todas) → Analisador (valida as 2-3 mais importantes) → Publica

FLUXO DE VALIDAÇÃO:
Batch Creator (cria 14 ideias) → Analisador (avalia potencial de cada) → Escolhe as 7 melhores → Desenvolve → Publica

FLUXO DE TESTE:
Batch Creator (3 versões de semana com temas diferentes) → Escolhe a que mais ressoa → Desenvolve → Testa


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEMAS COMUNS (E SOLUÇÕES)

Problema 1: "Semana ficou muito genérica"
Solução: Refaça com contexto profundo. Liste 4-5 dores específicas. Defina objetivo claro.

Problema 2: "Posts não se conectam"
Solução: Adicione: "Quero arco progressivo. Cada post deve preparar o próximo."

Problema 3: "Muita coisa para uma semana"
Solução: Comece com 4 posts (seg/qua/sex/dom) e depois escale.

Problema 4: "Não sei qual ordem publicar"
Solução: "Se eu pudesse postar apenas 3, quais seriam e em que ordem?"

Problema 5: "Semana ficou sem conversão"
Solução: "Refaça posts 6 e 7 para preparar suavemente para [produto]. Sem ser vendinha."

Problema 6: "Na quarta já não quero mais postar esses posts"
Solução: Escolha temas que TE empolgam. Se não está animado na criação, não vai estar na publicação.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHECKLIST DE UMA BATCH CREATION PERFEITA

☐ Tema central claro - Dá para resumir a semana em uma frase?
☐ Progressão lógica - Cada post prepara o próximo?
☐ Variedade de formato - Não são 7 carrosséis iguais?
☐ Variedade de ângulo - Mix de educativo/provocativo/inspiracional?
☐ Valor crescente - Post 7 entrega mais que post 1?
☐ CTA variados - Não pede a mesma coisa em todos os posts?
☐ Ganchos fortes - Cada título para o scroll?
☐ Alinhado com objetivo - Serve o propósito estratégico da semana?
☐ Você está empolgado - Quer postar todos os 7?

Se responder "não" em 3+, refaça a batch.

Pronto. Você nunca mais vai ter domingo de pânico.

Próxima aula: como transformar conteúdo em conversão sem soar vendinha.`
      },
    ],
  },
  {
    id: "agente-7",
    name: "Arquiteto de Infoprodutos",
    description: "Transforma o teu conhecimento em produtos digitais que a tua audiência realmente quer comprar. Valida, estrutura, precifica e lança.",
    icon: "🏗️",
    category: "Monetização",
    link: "https://chatgpt.com/g/g-69796153b22081919137d3d195874341-arquitecto-de-infoprodutos",
    banner: "/agentes/arquitecto-banner.png",
    tabs: [
      {
        label: "Sobre",
        content: `Vendes bem. A tua audiência compra. Mas tens um problema: estás a vender o produto errado.

Todas as semanas recebes DMs a perguntar sobre consultoria individual. Cobras 500€/hora, a agenda fica lotada, o dinheiro entra. Mas trabalhas 12 horas por dia para faturar 15.000€/mês.

Entretanto, vês um concorrente que criou um curso de 497€ a faturar 80.000€/mês trabalhando 4 horas por dia. Tens mais conhecimento, mais experiência, mais resultados. Mas ele tem uma coisa que tu não tens: o produto certo.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 CRIAR INFOPRODUTO PARECE SIMPLES

Gravar algumas aulas, colocar numa plataforma, divulgar para a audiência. Deveria ser automático vender, não é?

‼️ Realidade: 87% dos infoprodutos vendem menos de 10 unidades no primeiro ano.

Porquê? Porque a maioria cria produto baseado no que QUER ensinar, não no que o mercado QUER aprender.

O que tu queres criar: "Curso completo de marketing digital com 47 módulos cobrindo desde o básico até estratégias avançadas"

O que a tua audiência quer comprar: "Como conseguir os primeiros 1000 seguidores no Instagram em 30 dias sem comprar seguidor"

A diferença? Especificidade.


⚠️ O ERRO DE COPIAR PRODUTOS DE OUTROS NICHOS

Vês um coach de relacionamentos a vender mentoria de 2.997€ e pensas: "Vou fazer igual no meu nicho."

Erro fatal. Cada nicho tem dores diferentes, poder aquisitivo diferente, formato preferido diferente.

Audiência de relacionamentos compra transformação emocional por 3.000€. Audiência de Excel compra competência técnica por 197€.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 O QUE ESTE AGENTE CRIA

• Validação de ideias antes de criar
• Estrutura completa do infoproduto (módulos, aulas, bónus)
• Precificação estratégica
• Roadmap de lançamento
• Posicionamento único no mercado

Plus: analisa o teu perfil, audiência e concorrência para sugerir produto com maior probabilidade de sucesso.`
      },
      {
        label: "Quando Usar",
        content: `✨ QUANDO USAR ESTE AGENTE

Quando queres criar primeiro infoproduto
Só vendias serviço até agora. Queres escalar criando produto digital. Precisas acertar na primeira.

Para validares ideia antes de investires tempo
Tens 3 ideias de curso. Não sabes qual criar primeiro. Testa qual tem mais procura antes de gravares uma aula.

Quando produto atual não vende
Criaste curso há 6 meses, vendeste 12 unidades. Problema pode ser posicionamento, preço, estrutura ou público errado.

Para criares produto complementar
Já tens curso de 90€ que vende bem. Queres criar upsell de 270€ sem canibalizar produto atual.

Para reposicionares produto existente
O teu curso de "Produtividade" não vende. Mas quando mudas para "Como trabalhar 6 horas e faturar mais que colegas que trabalham 12", venda multiplica por 4.

Para criares funil de produtos
Produto porta de entrada, core product, premium, continuidade. Ecossistema que maximiza lifetime value.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ QUANDO NÃO USAR

• Não uses se não tens audiência mínima (1000 seguidores envolvidos ou 500 e-mails).
• Não uses se ainda não dominas o assunto.
• Não uses para nicho que não atuas. Autenticidade é obrigatória.
• Não uses se não tens pelo menos 3 meses disponíveis.`
      },
      {
        label: "Como Usar",
        content: `COMO USAR

Passo 1: Acesse o agente
Clique no link Arquiteto de Infoprodutos


Passo 2: Prepara o teu input completo

Nicho: [a tua área específica de atuação]
Audiência atual: [tamanho e características]
Principais dores que resolves: [lista detalhada]
Produtos existentes no mercado: [3-5 concorrentes]
O teu diferencial: [o que fazes diferente/melhor]
Faixa de preço desejada: [bilhete baixo/médio/alto]
Tempo disponível para criar: [sê realista]
Formato preferido: [curso/mentoria/ebook/comunidade]
Prova de autoridade: [casos, certificações, resultados]


Passo 3: Define objetivo específico
• Estruturar primeiro produto
• Validar ideia existente
• Reposicionar produto atual
• Criar funil completo
• Definir precificação


Passo 4: Descreve situação atual
• Que conteúdo já crias?
• Como monetizas hoje?
• Qual o bilhete médio atual?
• Quantas horas trabalhas por semana?
• Onde queres chegar em 6 meses?


Passo 5: Contextualiza o mercado
• Quem são os concorrentes diretos?
• Como precificam?
• Que formato usam?
• Que lacuna não está a ser atendida?


Passo 6: Recebe e analisa
O agente entrega estrutura completa, precificação, posicionamento, roteiro de criação e estratégias de validação.


Passo 7: Refina baseado no feedback
• "Precificação ficou alta para a minha audiência"
• "Estrutura muito complexa, quero algo mais simples"
• "Como adaptar formato para o meu estilo?"`
      },
      {
        label: "Exemplo Prático",
        content: `EXEMPLO PRÁTICO COMPLETO

CONTEXTO:
Felipe é consultor de vendas B2B para empresas de tecnologia. Atende 4-5 empresas/mês a 1.440€/projeto. Quer escalar com infoproduto.

O QUE O AGENTE RESPONDEU:

PRODUTO: "SALES STACK"
Tagline: O método completo para startups tech venderem de forma previsível e escalável

ESTRUTURA PEDAGÓGICA:
• Módulo 1: Diagnóstico (Semana 1) - 3 aulas
• Módulo 2: Stack Foundation (Semana 2-3) - 4 aulas + Canvas do cliente ideal
• Módulo 3: Prospection Engine (Semana 4-5) - 4 aulas + 200 templates cold email
• Módulo 4: Conversion System (Semana 6-7) - 4 aulas + scripts de discovery
• Módulo 5: Scale Operations (Semana 8) - 4 aulas + dashboards prontos
• Módulo 6: Growth Hacking Sales (Semana 9-10) - 4 aulas + playbook expansão
• Módulo Bónus: Troubleshooting - 15 problemas comuns + updates trimestrais

PRECIFICAÇÃO: 234€ (ou 12x 23€)
Justificativa: Abaixo da consultoria (1.440€), acima de cursos genéricos (90€). Bilhete que startups pagam sem aprovação complexa.

COMUNIDADE: "Sales Stack Community" incluída
Grupo Telegram + Q&A semanal + networking entre founders

ROTEIRO DE LANÇAMENTO:
Fase 1 (Sem 1-2): Validação - posts LinkedIn, sondagens, entrevistas
Fase 2 (Sem 3-6): Pré-produção - módulos 1-2, setup plataforma
Fase 3 (Sem 7-10): Turma Beta - 12 clientes a 90€, feedback ativo
Fase 4 (Sem 11-12): Lançamento Público - pré-venda 180€, webinar gratuito
Fase 5 (Mês 3+): Escala - evergreen 234€, afiliados 20%

RESULTADO REAL:
• Turma Beta: 12 alunos, NPS 8,9, 11 casos de sucesso
• Lançamento: 89 alunos em 7 dias = 16.020€
• 6 meses: 347 alunos, 76.140€ faturados
• Felipe reduziu consultoria de 20h para 4h/semana
• Faturamento: de 5.760€/mês para 14.040€/mês`
      },
      {
        label: "Tipos & Pilares",
        content: `OS 5 TIPOS DE INFOPRODUTOS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIPO 1: CURSO GRAVADO
Videoaulas pré-gravadas + materiais de apoio. Cliente acede no próprio ritmo.
Precificação: 36€-180€
Quando: Processo sistemático, conteúdo evergreen, queres escalar sem limite.

TIPO 2: MENTORIA/GRUPO
Acompanhamento ao vivo + grupo privado. Calls, feedback, comunidade.
Precificação: 180€-540€
Quando: Método precisa de adaptação individual, audiência valoriza networking.

TIPO 3: EBOOK/MATERIAL DIGITAL
Conteúdo em texto/PDF com folhas de cálculo, checklists, templates.
Precificação: 5€-36€
Quando: Produto de entrada, conteúdo informacional, processo simples.

TIPO 4: COMUNIDADE/SUBSCRIÇÃO
Acesso contínuo + conteúdo mensal. Modelo de recorrência.
Precificação: 9€-54€/mês
Quando: Nicho precisa de atualização constante, queres receita recorrente.

TIPO 5: PRODUTO HÍBRIDO
Combina elementos de diferentes tipos (curso + mentoria, ebook + comunidade).
Precificação: 144€-540€
Quando: Público tem necessidades variadas, queres bilhete alto.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OS 7 PILARES DE UM INFOPRODUTO QUE VENDE

1. PROMESSA ESPECÍFICA E MENSURÁVEL
Não: "Curso de marketing digital"
Sim: "Como conseguir 1000 seguidores qualificados em 30 dias"

2. TRANSFORMAÇÃO CLARA (DO PONTO A AO B)
A: "Freelancer a cobrar 9€/hora" → B: "Especialista a cobrar 36€/hora com fila de espera"

3. MÉTODO ÚNICO (O TEU FRAMEWORK)
Ex: Método FAST, Framework SCALE, Sistema GROWTH

4. PROVA DE RESULTADO
"João aumentou faturamento em 340% em 90 dias"

5. FACILIDADE DE CONSUMO
Aulas 10-20min, linguagem simples, exercícios práticos, roteiro claro.

6. SUPORTE ADEQUADO AO PREÇO
36€: FAQ básico | 90€: Grupo | 270€: Individual | 540€: Mentoria direta

7. COMUNIDADE/REDE (QUANDO APLICÁVEL)
Para produtos >90€, networking é diferencial competitivo.`
      },
      {
        label: "Precificação & Funil",
        content: `PRECIFICAÇÃO ESTRATÉGICA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BILHETE BAIXO (5€-36€)
Produto de entrada. Ebook ou mini-curso. Audiência price-sensitive.
Volume necessário: 500-2000 vendas/mês

BILHETE MÉDIO (54€-180€)
Produto principal (core). Curso completo. Audiência estabelecida.
Volume necessário: 100-300 vendas/mês

BILHETE ALTO (270€-900€+)
Produto premium. Mentoria/acompanhamento. B2B ou nichos corporativos.
Volume necessário: 20-50 vendas/mês


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FUNIL DE PRODUTOS

PORTA DE ENTRADA (5€-18€): Ebook ou mini-curso. Converter audiência fria em cliente.

PRODUTO CORE (54€-180€): Curso completo. Principal fonte de receita. 60-80% do faturamento.

PRODUTO PREMIUM (270€-900€): Mentoria individual ou grupo VIP. 20-30% do faturamento, alta margem.

CONTINUIDADE (9€-36€/mês): Comunidade exclusiva. Receita previsível. Lifetime value alto.

Exemplo:
"Instagram Quick Start" - 9€
"Instagram Business Mastery" - 90€
"Mentoria Instagram Authority" - 360€
"Community Insider" - 18€/mês


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JORNADA DE CRIAÇÃO VALIDADA

FASE 1: Validação (2 semanas)
Posts, sondagens, entrevistas. Meta: 30%+ interesse.

FASE 2: MVP (4 semanas)
30% do conteúdo final, módulos essenciais, preço de teste.

FASE 3: Turma Beta (3 semanas)
10-20 pessoas, 50% desconto, feedback intenso. Meta: NPS >7.

FASE 4: Refinamento (2 semanas)
Ajustes baseados em dados da beta.

FASE 5: Escala (contínuo)
Automatização, evergreen ou lançamento, expansão.`
      },
      {
        label: "Técnicas Avançadas",
        content: `TÉCNICAS AVANÇADAS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TÉCNICA 1: MVP DE INFOPRODUTO
Não cries curso completo primeiro:
• 3 módulos essenciais → Vende para 10-20 pessoas → Feedback → Expande

TÉCNICA 2: VALIDAÇÃO PRÉ-VENDA
Vende antes de criar:
• Webinar com oferta no final
• Post "se eu criasse X por Y€, comprariam?"
• Landing page com "notificar quando pronto"
Meta: 30%+ taxa de interesse.

TÉCNICA 3: GAMIFICAÇÃO E RETENÇÃO
83% dos alunos não terminam curso online. Soluções:
• Certificados por módulo
• Progresso visual (barra de completude)
• Badges por conquistas
• Desafios semanais

TÉCNICA 4: UPSELL ESTRATÉGICO
Não vendas upsell imediatamente:
• Semana 2: Material complementar
• Semana 4: Convite para mentoria
• Semana 8: Produto avançado

TÉCNICA 5: EVERGREEN VS LANÇAMENTO
Evergreen: Venda sempre disponível, fluxo constante
Lançamento: Abertura/fechamento de carrinho, urgência real
Produto novo → Lançamento | Produto validado → Evergreen`
      },
      {
        label: "Fluxos & Checklist",
        content: `INTERAGINDO COM OUTROS AGENTES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FLUXO DE CRIAÇÃO COMPLETA:
Sem 1-2: Arquiteto (define estrutura, preço, posicionamento)
Sem 3-4: Batch Creator (sequência de aquecimento)
Sem 5-6: Gerador de Ideias (tópicos para cada módulo)
Sem 7-10: Cria conteúdo do produto
Sem 11: Escritor de Copy (copy de vendas)
Sem 12: Analisador (otimiza posts de divulgação)

FLUXO DE VALIDAÇÃO:
Dia 1: Arquiteto (gera 3 ideias) → Dia 2: Gerador de Ideias (posts de teste) → Dia 3-5: Mestre dos Ganchos (otimiza) → Dia 6-12: Publica e recolhe dados → Dia 13: Escolhe vencedor → Dia 14: Volta ao Arquiteto

FLUXO DE LANÇAMENTO:
Sem -3: Batch Creator (aquecimento - educar sobre problema)
Sem -2: Batch Creator (agitação - amplificar dor)
Sem -1: Escritor de Copy (pré-lançamento)
Sem 0: Escritor de Copy (carrinho aberto)
Diário: Analisador (otimiza performance)

FLUXO PERPÉTUO (EVERGREEN):
Seg: Criador de Carrossel (post educativo sobre problema)
Ter: Escritor de Copy (legenda mencionando solução)
Qua: Gerador de Ideias (novo ângulo)
Qui: Mestre dos Ganchos (testa variações)
Sex: Analisador (vê que post converteu mais)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEMAS COMUNS

Problema 1: "Ninguém compra"
Solução: Entrevista 10 pessoas. Reposiciona baseado nas respostas reais.

Problema 2: "Muitas ideias, não sei qual criar"
Solução: Matriz de priorização (procura × urgência × capacidade × concorrência × monetização).

Problema 3: "Ninguém termina o curso"
Solução: Regra 80/20. Foca nos 20% que geram 80% do resultado.

Problema 4: "Precificação errada"
Solução: Teste de Van Westendorp com 50+ pessoas da audiência.

Problema 5: "Posicionamento confuso"
Solução: "É um [FORMATO] de [DURAÇÃO] para [PÚBLICO] conseguir [RESULTADO] em [TEMPO]."

Problema 6: "Reembolso alto (>10%)"
Solução: Sê específico sobre o que está/não está incluído e quem NÃO deve comprar.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHECKLIST FINAL

☐ Acedi ao Arquiteto de Infoprodutos
☐ Validei procura antes de criar
☐ Tenho promessa específica e mensurável
☐ Estrutura tem transformação clara (A → B)
☐ Precificação está alinhada com entrega
☐ Tenho prova de que método funciona
☐ Produto resolve dor específica, não genérica
☐ Testei beta antes de lançar grande
☐ Tenho roteiro de lançamento
☐ Guardei esta aula para consultar sempre

Pronto. Agora crias produtos que a tua audiência realmente quer comprar.`
      },
    ],
  },
];

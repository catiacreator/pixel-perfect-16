// Estúdio Creator — "Do prompt avulso ao sistema" (Cátia Creator).
// Organiza o Ecossistema de Produto + o Método Europeu de Conteúdo numa
// biblioteca de prompts pronta a copiar, com um construtor de combinações.
// Fonte: Ecossistema-de-Produto.pdf + Metodo-Europeu-de-Conteudo.pdf.

// ————————————————————————————————————————————————————————————
// Fluxo visual: da ideia ao post publicado e analisado.
export const FLUXO: { passo: string; desc: string }[] = [
  { passo: "Objetivo", desc: "Atrair, autoridade, conexão ou venda" },
  { passo: "Cenário", desc: "Escolhe a coleção fotográfica" },
  { passo: "Mensagem", desc: "O que a imagem deve comunicar" },
  { passo: "Estética", desc: "Editorial, lifestyle ou documental" },
  { passo: "Variáveis", desc: "Roupa, pose, luz, câmara" },
  { passo: "Copia o prompt", desc: "Menu → prompt montado" },
  { passo: "Gera a fotografia", desc: "Cola no gerador de imagem" },
  { passo: "Converte em conteúdo", desc: "Reel, carrossel, stories" },
  { passo: "Publica", desc: "Com gancho, retenção e CTA" },
  { passo: "Analisa", desc: "Métricas → próximo ciclo" },
];

// Arquitetura em 5 camadas.
export const CAMADAS: { n: number; titulo: string; itens: string[] }[] = [
  { n: 1, titulo: "Identidade", itens: ["Voz", "Posicionamento", "Público", "Oferta", "Paleta", "Estética visual", "Características físicas a preservar"] },
  { n: 2, titulo: "Matéria-prima", itens: ["Dores", "Desejos", "Perguntas", "Objeções", "Histórias", "Casos reais", "Opiniões"] },
  { n: 3, titulo: "Produção", itens: ["Fotografias", "Reels", "Carrosséis", "Stories", "Legendas", "Emails", "Direct"] },
  { n: 4, titulo: "Campanhas", itens: ["Crescimento", "Autoridade", "Lançamento", "Venda contínua", "Reativação", "Sazonais"] },
  { n: 5, titulo: "Otimização", itens: ["Métricas", "Diagnóstico", "Reaproveitamento", "Testes", "Planeamento seguinte"] },
];

// ————————————————————————————————————————————————————————————
// CONSTRUTOR DE PROMPT FOTOGRÁFICO — menus por variável.
// Cada opção traz um `frag` = o texto que entra no prompt final.
export type Opcao = { label: string; frag: string };

export const CENARIOS: Opcao[] = [
  { label: "Café europeu · Paris", frag: "café parisiense clássico, mesa de mármore, chávena de expresso, montra com luz de rua ao fundo" },
  { label: "Café europeu · Lisboa", frag: "café lisboeta com azulejos, pastel de nata na mesa, luz quente de fim de tarde" },
  { label: "Café europeu · Milão", frag: "bar italiano elegante, balcão de mármore, cappuccino, estética minimalista" },
  { label: "Café europeu · Copenhaga", frag: "café escandinavo, madeira clara, cerâmica artesanal, luz suave nórdica" },
  { label: "Escritório de fundadora", frag: "escritório de fundadora sofisticado, secretária de madeira, portátil, plantas, prateleiras com livros" },
  { label: "Home office sofisticado", frag: "home office elegante, luz natural de janela grande, tons neutros, detalhes editoriais" },
  { label: "Casa luminosa", frag: "sala de casa luminosa, sofá de linho, luz natural difusa, estética clean e acolhedora" },
  { label: "Rua europeia", frag: "rua europeia com arquitetura clássica, fachadas históricas, movimento suave em fundo desfocado" },
  { label: "Estúdio minimalista", frag: "estúdio fotográfico minimalista, fundo liso neutro, luz controlada de estúdio" },
  { label: "Hotel / viagem de trabalho", frag: "quarto de hotel boutique, roupa de cama branca, mala de viagem, luz de manhã" },
  { label: "Bastidores de lançamento", frag: "bastidores de lançamento, notas e materiais em cima da mesa, ambiente de trabalho real" },
  { label: "Evento ou conferência", frag: "palco ou sala de conferência, iluminação de evento, público desfocado ao fundo" },
  { label: "Férias · estética editorial", frag: "cenário de férias com estética editorial, luz mediterrânica, tons quentes e aspiracionais" },
  { label: "Lifestyle de luxo discreto", frag: "ambiente de luxo discreto, materiais nobres, paleta neutra, elegância sem ostentação" },
];

export const ROUPAS: Opcao[] = [
  { label: "Fundadora premium", frag: "blazer estruturado de tom neutro, camisa de seda, calças de alfaiataria, acessórios minimais dourados" },
  { label: "Especialista acessível", frag: "malha fina em tom terroso, calças de linho, ténis limpos, ar profissional mas próximo" },
  { label: "Criadora artística", frag: "peças de corte criativo, texturas e camadas, paleta expressiva mas coerente" },
  { label: "Consultora corporativa", frag: "fato coordenado sóbrio, linhas direitas, paleta monocromática, autoridade formal" },
  { label: "Casual europeu", frag: "camisa branca de algodão, jeans de corte reto, casaco leve, elegância descontraída" },
  { label: "Wellness e saúde", frag: "roupa confortável e clean, tons claros e naturais, tecidos respiráveis" },
  { label: "Luxo discreto", frag: "cashmere e alfaiataria de qualidade, paleta bege/camel/marfim, sem logótipos" },
  { label: "Verão mediterrânico", frag: "vestido de linho leve, tons areia e branco, sandálias, luz solar" },
];

export const POSES: Opcao[] = [
  { label: "A trabalhar (secretária)", frag: "sentada à secretária a trabalhar no portátil, postura concentrada e natural" },
  { label: "A olhar para a câmara (segura)", frag: "de frente para a câmara, olhar direto e sereno, postura confiante" },
  { label: "A olhar para fora do enquadramento", frag: "olhar dirigido para fora do enquadramento, expressão pensativa, ar editorial" },
  { label: "Em movimento na rua", frag: "a caminhar na rua, movimento natural do corpo, captada a meio do passo" },
  { label: "A ensinar / apresentar", frag: "em pé a apresentar, gesto de mão a explicar, expressão de autoridade" },
  { label: "Interação com objeto", frag: "a interagir com um objeto em cena (chávena, livro, telemóvel), gesto natural" },
  { label: "Close-up de expressão", frag: "plano aproximado do rosto, expressão autêntica e forte, foco nos olhos" },
  { label: "Corpo inteiro editorial", frag: "corpo inteiro, pose editorial equilibrada, postura elegante" },
  { label: "Descontraída (bastidores)", frag: "pose descontraída de bastidores, sorriso genuíno, ar espontâneo" },
];

export const LUZES: Opcao[] = [
  { label: "Luz natural de janela (manhã)", frag: "luz natural suave de janela lateral, início de manhã, sombras longas e macias" },
  { label: "Golden hour", frag: "luz dourada de fim de tarde (golden hour), quente e envolvente" },
  { label: "Luz de estúdio suave", frag: "luz de estúdio difusa com softbox, sombras controladas, tom neutro" },
  { label: "Luz editorial de contraste", frag: "luz direcional de contraste, claro-escuro editorial, atmosfera dramática" },
  { label: "Luz nublada difusa", frag: "luz difusa de dia nublado, uniforme e lisonjeira, sem sombras duras" },
];

export const CAMARAS: Opcao[] = [
  { label: "Retrato 85mm, fundo desfocado", frag: "plano médio, lente 85mm, f/1.8, fundo suavemente desfocado (bokeh), ao nível dos olhos" },
  { label: "Plano aberto 35mm", frag: "plano aberto, lente 35mm, mais cenário visível, profundidade de campo média" },
  { label: "Close-up 50mm", frag: "grande plano, lente 50mm, foco no rosto, profundidade curta" },
  { label: "Ângulo ligeiramente acima", frag: "câmara ligeiramente acima do nível dos olhos, ângulo lisonjeiro" },
  { label: "Cinematográfico grande-angular", frag: "enquadramento cinematográfico, ligeira grande-angular, sensação de espaço" },
];

export const COMPOSICOES: Opcao[] = [
  { label: "Vertical (feed / Stories) + espaço p/ texto", frag: "orientação vertical 4:5, pessoa a um terço, amplo espaço negativo para colocar texto" },
  { label: "Vertical 9:16 (capa de Reel)", frag: "orientação vertical 9:16, pessoa descentrada, topo livre para o gancho" },
  { label: "Quadrada (feed)", frag: "orientação quadrada 1:1, composição equilibrada e centrada" },
  { label: "Horizontal (site / anúncio)", frag: "orientação horizontal 16:9, pessoa a um lado, espaço para título do outro" },
];

export const ESTETICAS: Opcao[] = [
  { label: "Editorial de revista", frag: "estética editorial de revista, cores calibradas, elegância intencional, referência: Kinfolk / Vogue" },
  { label: "Lifestyle natural", frag: "estética lifestyle natural, tons quentes, sensação autêntica e vivida" },
  { label: "Documental / bastidores", frag: "estética documental, luz real, momento capturado, sem pose forçada" },
  { label: "Cinematográfica", frag: "estética cinematográfica, gradação de cor suave, atmosfera de filme" },
  { label: "Minimalista clean", frag: "estética minimalista, paleta reduzida, muito espaço, calma visual" },
];

export const EVITAR: Opcao[] = [
  { label: "Padrão (recomendado)", frag: "mãos deformadas, dedos a mais, texto ilegível, pele plástica, olhos assimétricos, marcas/logótipos, distorções de fundo" },
  { label: "Sem objetos modernos", frag: "além do padrão: evitar objetos anacrónicos, ecrãs acesos e cabos à vista" },
  { label: "Sem excesso de saturação", frag: "além do padrão: evitar cores saturadas, HDR exagerado e vinhetas fortes" },
];

// Bloco fixo do prompt (identidade + realismo). Não muda entre combinações.
export const PROMPT_ABERTURA =
  "Cria uma fotografia editorial hiper-realista da pessoa da imagem de referência, preservando rigorosamente a identidade, proporções faciais, tom de pele, textura natural e características distintivas.";
export const PROMPT_REALISMO =
  "Textura de pele natural, mãos anatomicamente corretas, proporções realistas, cabelo detalhado, tecido com textura, sombras coerentes e ausência de aparência plástica.";

// ————————————————————————————————————————————————————————————
// Biblioteca de poses por intenção (o que a imagem comunica).
export const POSES_INTENCAO: { categoria: string; mensagem: string; poses: string[] }[] = [
  { categoria: "Autoridade", mensagem: "Prova que sabes. Ideal para carrosséis educativos e páginas de venda.", poses: ["A ensinar ou apresentar", "Retrato frontal seguro", "A trabalhar com foco", "Postura direita, queixo firme"] },
  { categoria: "Proximidade", mensagem: "Aproxima quem já te segue. Ideal para stories e bastidores.", poses: ["Café/passeio/casa", "Expressão descontraída", "Imperfeição intencional", "Momento íntimo e próximo"] },
  { categoria: "Confiança", mensagem: "Transmite segurança. Ideal para bio, capa e apresentação.", poses: ["Olhar direto para a câmara", "Braços relaxados", "Sorriso contido", "Postura aberta"] },
  { categoria: "Curiosidade", mensagem: "Cria gancho. Ideal para capas de Reel.", poses: ["Olhar para fora do enquadramento", "Expressão de surpresa contida", "Movimento sugerido", "Espaço grande para o gancho"] },
  { categoria: "Vulnerabilidade", mensagem: "Gera identificação. Ideal para storytelling.", poses: ["Olhar em baixo", "Mão no rosto", "Luz suave e íntima", "Expressão honesta"] },
  { categoria: "Energia", mensagem: "Comunica entusiasmo. Ideal para lançamentos.", poses: ["Em movimento", "Gesto expansivo", "Sorriso aberto", "Situação inesperada"] },
  { categoria: "Venda", mensagem: "Transforma confiança em cliente. Ideal para página de vendas.", poses: ["Fundadora com postura segura", "A usar o produto", "Resultado / transformação", "Prova social"] },
  { categoria: "Sofisticação", mensagem: "Posiciona no premium. Ideal para luxo discreto.", poses: ["Pose editorial estática", "Perfil elegante", "Detalhe de mãos/acessório", "Ambiente de materiais nobres"] },
];

// Banco de imagens por função no funil (liga foto ao Método Europeu).
export const BANCO_FUNIL: { funcao: string; cor: string; guia: string[] }[] = [
  { funcao: "Atrair", cor: "#C13584", guia: ["Imagens com movimento", "Situações inesperadas", "Expressões fortes", "Cenários aspiracionais", "Espaço para ganchos grandes", "Capas de Reel que criam curiosidade"] },
  { funcao: "Autoridade", cor: "#833AB4", guia: ["A trabalhar / a ensinar", "Secretária, quadro, portátil ou livro", "Retratos frontais seguros", "Detalhes profissionais", "Adequadas a checklists e passo a passo"] },
  { funcao: "Conexão", cor: "#E1306C", guia: ["Rotina real", "Café, passeio, casa ou bastidores", "Expressões descontraídas", "Imperfeição intencional", "Momentos íntimos e próximos"] },
  { funcao: "Venda", cor: "#F56040", guia: ["Utilização do produto", "Resultado ou transformação", "Celebração", "Prova social", "Fundadora com postura segura", "Para página de vendas e lançamento"] },
];

// Guarda-roupa estratégico (packs).
export const GUARDA_ROUPA: string[] = [
  "Fundadora premium", "Especialista acessível", "Criadora artística", "Consultora corporativa",
  "Educadora digital", "Wellness e saúde", "Beleza e moda", "Luxo discreto", "Casual europeu",
  "Poder feminino", "Verão mediterrânico", "Outono sofisticado",
];

// ————————————————————————————————————————————————————————————
// Prompts de conteúdo prontos a copiar (motor, fábrica, laboratório).
export type Prompt = { agente: string; nome: string; texto: string };

export const PROMPTS_CONTEUDO: Prompt[] = [
  {
    agente: "Claude",
    nome: "Extrator de Substância (motor de conteúdo)",
    texto: `Quero criar conteúdo sobre [tema], mas não quero produzir uma
versão genérica ou semelhante ao que já existe.

Entrevista-me com uma pergunta de cada vez para descobrir:
1. A minha opinião real sobre o tema;
2. Aquilo em que discordo da maioria;
3. Um erro que cometi;
4. Uma experiência ou caso concreto;
5. As palavras usadas pelos meus clientes;
6. O que normalmente fica por dizer;
7. O resultado que consigo ajudar a alcançar.

Depois da entrevista, apresenta:
- 5 ângulos originais;
- o que existe de distintivo em cada um;
- o melhor formato para cada ângulo;
- o objetivo: atrair, autoridade, conexão ou venda.

Não escrevas o conteúdo até eu escolher o ângulo.`,
  },
  {
    agente: "Claude",
    nome: "Fábrica Multiformato (1 ideia → ecossistema)",
    texto: `Transforma a matéria-prima abaixo num ecossistema de conteúdo.

MATÉRIA-PRIMA:
[história, opinião, pergunta, comentário ou problema]
PÚBLICO:
[quem é e em que momento se encontra]
OFERTA:
[o que vendo e que transformação oferece]
A MINHA POSIÇÃO:
[o que penso e o que faço de forma diferente]

Cria um percurso coerente:
1. REEL — atrair desconhecidos;
2. CARROSSEL — educar e gerar guardados;
3. STORIES — aprofundar conexão;
4. STORIES DE VENDA — apresentar o próximo passo;
5. DIRECT — iniciar uma conversa consultiva.

Para cada peça, indica:
- objetivo;
- gancho;
- conteúdo;
- CTA;
- visual ou fotografia recomendada;
- ligação à peça seguinte.

Não repitas o mesmo texto entre formatos. Cada peça deve
acrescentar uma nova camada à ideia.`,
  },
  {
    agente: "Claude",
    nome: "Diagnóstico de Resultados (laboratório)",
    texto: `Analisa estes resultados sem recorrer a conclusões genéricas:

Formato:
Objetivo:
Tema:
Gancho:
Alcance:
Retenção:
Guardados:
Partilhas:
Comentários:
Visitas ao perfil:
Novos seguidores:
Mensagens recebidas:
Vendas ou leads:

Distingue:
1. Problema de tema;
2. Problema de gancho;
3. Problema de retenção;
4. Problema de correspondência entre conteúdo e CTA;
5. Problema de distribuição;
6. Elementos que vale a pena repetir.

No final, cria três experiências concretas para o próximo
conteúdo, alterando apenas uma variável de cada vez.`,
  },
];

// Usos do laboratório de análise.
export const LAB_USOS: string[] = [
  "Analisar métricas de um post",
  "Comparar dois ganchos",
  "Identificar por que um carrossel não gerou guardados",
  "Descobrir padrões nos conteúdos de melhor desempenho",
  "Reescrever sem apagar a voz da autora",
  "Transformar comentários em novos conteúdos",
  "Extrair objeções de conversas no Direct",
  "Decidir o que repetir, adaptar ou abandonar",
  "Criar a semana seguinte a partir dos resultados reais",
];

// ————————————————————————————————————————————————————————————
// Sistemas de conteúdo por situação (packs que respondem a uma frase da cliente).
export const SITUACOES: string[] = [
  "Não sei o que publicar esta semana",
  "Tenho poucas fotografias minhas",
  "Vou lançar em 14 dias",
  "Preciso de vender sem parecer insistente",
  "As pessoas veem, mas não comentam",
  "Tenho alcance, mas não tenho clientes",
  "Quero voltar depois de desaparecer",
  "Mudei de nicho",
  "Tenho uma oferta nova",
  "O meu conteúdo parece igual ao de toda a gente",
  "Não gosto de aparecer",
  "Quero criar conteúdo sem gravar diariamente",
  "Preciso de um mês de conteúdo numa tarde",
  "Os meus Stories têm poucas visualizações",
  "Tenho testemunhos, mas não sei usá-los",
];

export const SISTEMA_PECAS: { n: number; titulo: string; desc: string }[] = [
  { n: 1, titulo: "Diagnóstico", desc: "Onde está o problema, em concreto." },
  { n: 2, titulo: "Estratégia", desc: "O caminho que resolve aquela situação." },
  { n: 3, titulo: "Extração", desc: "Perguntas para tirar matéria-prima." },
  { n: 4, titulo: "Prompts de conteúdo", desc: "As peças escritas." },
  { n: 5, titulo: "Prompts fotográficos", desc: "As imagens que as acompanham." },
  { n: 6, titulo: "Calendário", desc: "Quando sai cada coisa." },
  { n: 7, titulo: "Checklist", desc: "O que verificar antes de publicar." },
  { n: 8, titulo: "Métricas", desc: "O que observar depois." },
  { n: 9, titulo: "Análise", desc: "Prompt de melhoria e próximo ciclo." },
];

// O MVP (produto de entrada).
export const MVP = {
  nome: "30 Dias de Conteúdo com o Teu Estúdio Virtual",
  promessa: "Cria, numa tarde, as fotografias e a matéria-prima para 30 dias de conteúdo que parece teu.",
  inclui: [
    "5 cenários fotográficos", "3 looks por cenário", "5 poses por look",
    "Versões para feed, Stories e capas de Reels",
    "4 pilares: atrair, autoridade, conexão e venda",
    "30 ideias de conteúdo", "12 estruturas de carrossel", "12 guiões de Reel",
    "12 sequências de Stories", "Prompts para extrair histórias e opiniões próprias",
    "Gerador de legendas em PAS", "Gerador de CTA", "Analisador de métricas", "Calendário de 30 dias",
  ],
};

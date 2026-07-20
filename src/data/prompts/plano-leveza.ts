// ─────────────────────────────────────────────────────────────────────────────
// PLANO LEVEZA — Gerador de Sistema de Conteúdo de 90 dias.
//
// O prompt tem duas partes. O BLOCO 1 (briefing) é o único que muda de pessoa
// para pessoa, e montamo-lo a partir do Documento Mestre + da análise que a
// pessoa carrega. O BLOCO 2 são as instruções, sempre iguais.
//
// A pessoa cola tudo numa IA capaz de escrever código e recebe um .html
// interativo — por isso a plataforma não gasta API nenhuma.
// ─────────────────────────────────────────────────────────────────────────────

export type BriefingLeveza = {
  nome: string;
  handle: string;
  idioma: string;
  nicho: string;
  avatar: string;
  dor: string;
  seguidores: string;
  meta: string;
  tomDeVoz: string;
  ofertaGratis: string;
  ofertaEntrada: string;
  ofertaFundo: string;
  ctas: string;
  duracao: string;
  restricoes: string;
};

export const BRIEFING_VAZIO: BriefingLeveza = {
  nome: "",
  handle: "",
  idioma: "português de Portugal",
  nicho: "",
  avatar: "",
  dor: "",
  seguidores: "",
  meta: "",
  tomDeVoz: "",
  ofertaGratis: "",
  ofertaEntrada: "",
  ofertaFundo: "",
  ctas: "",
  duracao: "90 dias / 13 semanas — 3 posts por dia",
  restricoes: 'sem "fórmula mágica", "segredo", "guia definitivo"',
};

// Instruções fixas para a IA. Não muda de pessoa para pessoa.
const BLOCO_2 = `BLOCO 2 — INSTRUÇÕES PARA A IA

Vais construir um sistema de conteúdo interativo para a pessoa descrita no briefing acima. Trabalha em duas fases: primeiro a estratégia e a escrita de TODAS as peças; só depois o ficheiro HTML.

1) Estratégia (escreve primeiro, curto e honesto)
- Faz a matemática da meta: (meta − seguidores atuais) ÷ dias = quantos por dia. Diz a verdade sobre o esforço que isso exige. Se a meta implica multiplicar a conta, deixa claro que o crescimento vem de alcance para além dos seguidores (conteúdo partilhável + séries), não de mais posts educativos.
- Define as alavancas de crescimento: séries com nome, conteúdo relatable fora do nicho técnico (alcança 3-10x mais), colaborações/lives, trends/áudios, conteúdo salvável e partilhável, e constância de 3 posts/dia.

2) O motor diário (repete-se todos os dias)
- Manhã: Reel com a pessoa em câmara (série ou relatable) — o post de ALCANCE.
- Tarde: Carrossel salvável (checklist, prompts, antes/depois) — AUTORIDADE + guardados.
- Noite: Reel curto OU sequência de stories — ângulo diferente (prova, bastidor, opinião, CTA).
- Stories ao longo do dia como amplificador.

3) Séries (o coração do alcance)
Cria 4 a 5 séries com nome, adaptadas ao nicho, usando estes moldes (o nome É o gancho):
1. "Coisas que eu faria se recomeçasse [a atividade da pessoa] do zero hoje"
2. "O que tu nunca [ação típica do nicho], mas devias"
3. "Começa a [resultado que o avatar quer]"
4. "[Fazer a tarefa penosa] sem [a dor associada]"
5. Série de personagem: "Esta é a [nome] e ela [problema do avatar]" (arco de 5-7 episódios)
Regra: mesma estrutura em todos os episódios, muda só a entrega. Distribui as séries pelos dias.

4) Escreve TODAS as peças de cada dia (nada de placeholders)
Para cada dia produz:

Reel (manhã):
- gancho (0-3s): frase curiosa ou pergunta em tom de conversa; se for série, diz o nome + parte.
- texto_na_tela: 3-6 palavras (o que aparece grande no ecrã).
- fala: fala corrida e natural, 75-150 palavras (30-60s), como quem explica a uma amiga ao café. UMA ideia puxa a outra. Dá sempre uma analogia/exemplo do dia a dia ANTES da conclusão. PROIBIDO listas e "Passo 1/2/3" — se há método, conta-o a falar ("primeiro fazes… e só depois…").
- fechamento: frase curta e memorável; pode incluir um CTA de funil natural.
- legenda: método PAS (1ª linha vende o clique, não o produto → Problema → Agitação → Solução → CTA), pronta a colar, parágrafos curtos.
- hashtags: 5-8.
- dica_viral: 1 indicação concreta de edição/formato (primeiro frame, cortes a cada 2-3s, etc.).

Carrossel (tarde): titulo; slides (6-8; slide 1 = gancho, uma ideia por slide, último = CTA); legenda; dica_viral.

Noite: tipo (reel ou story). Se reel → fala corrida natural (mesmas regras). Se story → stories (sequência curta, uma entrada por story). Mais legenda e dica_viral.

Regras de voz (aplicam-se a tudo): idioma e tom do briefing; sempre "tu"; frases curtas; sem travessões no corpo; sem jargão sem tradução; respeita as restrições de voz do briefing. Antes de fechar cada fala, relê e pergunta: "isto soa a alguém a explicar a uma amiga, ou a ler um relatório?". Se soa a relatório, reescreve.

5) Arcos e CTA
Organiza os 3 meses: Mês 1 = alcance (lançar séries, relatable, sem vender), Mês 2 = autoridade (mostrar o método, começar colabs, isca paga suave), Mês 3 = prova + venda (casos, comunidade, oferta de fundo). CTA forte só no fundo de funil; nos posts de topo, CTA leve ou nenhum. Máx. 1-2 CTA fortes por semana.

6) O ARTEFACTO — HTML autocontido e interativo
Entrega um único ficheiro .html (todo o CSS e JS inline; sem bibliotecas externas obrigatórias; sem depender de localStorage para funcionar — usa estado em memória e oferece exportar/importar):
- Organizado por dia, agrupado por semana e por mês, com o tema de cada semana.
- Cada dia mostra as 3 peças (Reel / Carrossel / Noite). Cada peça tem os blocos acima, e um botão "Copiar" por bloco. No carrossel e nas stories, cada slide/story tem o seu próprio botão copiar, além de um "copiar todos".
- Três estados por peça: por fazer / gravado / publicado, com barra de progresso e contadores no topo (total, por fazer, gravadas, publicadas, % concluído).
- Filtros: por mês, por semana, por formato (Reel/Carrossel/Noite), por estado, e pesquisa por palavra. Botões "abrir tudo / fechar tudo".
- Botões Guardar progresso (exporta JSON) e Carregar (importa JSON), porque o estado pode não sobreviver a recarregar a página.
- Painel "Como tornar cada peça viral" no topo, com as regras: os 3 primeiros segundos, texto grande no primeiro frame (igual em toda a série), cortes a cada 2-3s, mostrar a cara, relatable 2x/semana, pedir partilha, séries, carrossel salvável, CTA no sítio certo, horário de pico, repetir o que rebentou.
- Identidade visual: usa as cores/estética da marca da pessoa (se não houver, usa uma paleta limpa e legível). Design arrumado, tipografia confortável, responsivo em telemóvel.

7) Verificação antes de entregar
- Confirma que existem TODOS os dias do plano, cada um com as 3 peças completas.
- Confirma que nenhuma fala tem passos numerados nem soa a manual.
- Confirma que o HTML abre sem erros de consola e que copiar/estados/filtros funcionam.
- Entrega o ficheiro .html e um resumo de 3-4 linhas do que foi criado.`;

/**
 * Monta o prompt final: briefing preenchido + instruções + a análise da
 * Máquina de Análises (se a pessoa a tiver carregado).
 */
export function montarPromptPlanoLeveza(b: BriefingLeveza, analise: string): string {
  const briefing = `BLOCO 1 — BRIEFING

NOME / MARCA: ${b.nome}
@HANDLE: ${b.handle}
IDIOMA: ${b.idioma}
NICHO / O QUE ENSINA/VENDE: ${b.nicho}
AVATAR (cliente ideal): ${b.avatar}
DOR PRINCIPAL (o que sente e raramente diz): ${b.dor}
SEGUIDORES HOJE: ${b.seguidores}
META E PRAZO: ${b.meta}
TOM DE VOZ: ${b.tomDeVoz}
OFERTA / ECOSSISTEMA (destinos de CTA):
  - Grátis (iscas de lista): ${b.ofertaGratis}
  - Pago entrada: ${b.ofertaEntrada}
  - Fundo: ${b.ofertaFundo}
PALAVRAS-CHAVE DE CTA por nível: ${b.ctas}
DURAÇÃO DO PLANO: ${b.duracao}
RESTRIÇÕES DE VOZ (o que nunca dizer): ${b.restricoes}`;

  const bloco0 = analise.trim()
    ? `BLOCO 0 — ANÁLISE DO PERFIL (feita na Máquina de Análises)

Usa isto como retrato real da conta: os formatos que já funcionam, os números e o
diagnóstico. O plano tem de partir daqui, não de suposições.

${analise.trim()}

`
    : "";

  return `${bloco0}${briefing}

${BLOCO_2}`;
}

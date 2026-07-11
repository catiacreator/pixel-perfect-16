import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { resolveChatModel } from "@/lib/ai-gateway.server";

// ─────────────────────────────────────────────────────────────────────────────
// REELS EM SÉRIE — o "cérebro" da ferramenta guiada.
//
// Duas ações, ambas devolvem JSON (a UI desenha cartões a partir dele):
//   • "nomes"    → uma ideia entra, 5–7 nomes de série saem.
//   • "roteiros" → o nome escolhido entra, N roteiros prontos para gravar saem.
//
// O método (voz Cat.IA + Modelo de Reels em Série) vive todo neste ficheiro,
// para a ferramenta ser autónoma dentro do site.
// ─────────────────────────────────────────────────────────────────────────────

const VOZ = `## A VOZ (mistura Modelo de Reels + autoridade Cat.IA)
- Trata a pessoa por "tu"/"você", tom de conversa de amiga no café — nunca manual frio nem anúncio agressivo. Frases curtas, ritmo de fala, dá para gravar em voz alta sem soar artificial.
- Autoridade por especificidade (números, cenas concretas, casos reais), NUNCA por promessa vaga.
- Cada peça serve o seguidor primeiro: tira UMA culpa da pessoa e entrega UMA coisa prática.
- Emojis com moderação (0–2 por bloco), como pontuação emocional.
- PROIBIDO: "fórmula mágica", "segredo revelado", "guia definitivo", e jargão de IA ("otimizar", "estratégico", "paradigma", "aproveite ao máximo").`;

const METODO_NOMES = `## O QUE É UM "NOME DE SÉRIE" (lê com atenção — é o mais importante)
O nome NÃO é um título de vídeo diferente a cada episódio. É UMA frase fixa, repetível, que
abre TODOS os episódios da série seguida de "— parte N". A mesma frase no Reel 1, no 12, no 80.
Por isso tem de ser uma FORMA que aguenta 30+ partes: uma promessa ou provocação que se pode
encher com um exemplo novo de cada vez. Pensa "molde", não "manchete".

Um bom nome de série cabe numa expressão curta (≤ 12 palavras), dá para dizer em voz alta a olhar
para a câmara sem vergonha, e a pessoa certa reconhece-se logo. Os 3 ingredientes continuam a valer:
promessa (o que ganha) + curiosidade (quebra de expectativa) + pessoalidade (soa a gente, não a manual).

## OS MOLDES QUE FUNCIONAM (são estes que dão série — usa-os quase sempre)
Exemplos são de vários nichos DE PROPÓSITO — troca pelo nicho da criadora, mantém a FORMA.

- MOLDE 1 — "O que toda [profissão/avatar] deveria postar, mas não posta"
  (o motor de série mais forte: serve para QUALQUER profissão, gera 80+ partes trocando a profissão)
  Ex.: "O que toda nutricionista deveria postar, mas não posta" · "O que toda advogada de família deveria postar, mas não posta"

- MOLDE 2 — "Comece a [ação específica que resolve a dor]"
  (ordem direta; a pessoa sente que tem algo a fazer já)
  Ex.: "Comece a fazer as pessoas saberem o seu nome" · "Comece a contar um caso real em vez de falar de si"

- MOLDE 3 — "O que [tu/você] devia estar a fazer [no assunto] e ainda não faz"
  Ex.: "O que tu devias estar a fazer nas tuas finanças e ainda não fazes"

- MOLDE 4 — "Coisas que eu faria se [recomeço]" / "Coisas que eu [ação] pra [resultado]"
  Ex.: "Coisas que eu faria se tivesse de recomeçar do zero" · "Coisas que eu guardo pra ter sempre em casa"

- MOLDE 5 — "O que eu como [profissão] [faria/mudaria] [na situação da pessoa]"
  Ex.: "O que eu como arquiteta mudaria na tua casa em 1 visita"

- MOLDE 6 — Gancho-aspas: uma frase que o público REALMENTE diz (queixa/desculpa), entre aspas
  Ex.: "Não tenho tempo pra isto" · "Isto não funciona pra mim"
  (a série responde/desmonta essa frase episódio a episódio)

- MOLDE 7 — "Hábitos de quem [conquista o desejo]" / "Livros/coisas que eu [reação forte]"
  Ex.: "Hábitos de quem consegue [resultado] todos os dias" · "Livros que eu li e não consegui calar a boca sobre"

## REGRAS (obrigatórias)
- É um MOLDE repetível, não uma manchete de um vídeo só. Se só serve para um episódio, está errado.
- Nada genérico ("Dicas de…", "Tudo sobre…"), nada que soe a artigo de blog, nada de "fórmula/segredo".
- Sem clickbait de exclamação exagerada ("!!!", "JURO", "CHOCANTE"). Tom de conversa, não de anúncio.
- Escreve como a criadora diria em voz alta. Curto. Concreto ao nicho dela.
- Varia os moldes entre as 6 opções (não repitas o mesmo molde) para dar ângulos diferentes.`;

const METODO_ROTEIROS = `## TEMPLATE DE CADA ROTEIRO (~60–90s ao ser lido em voz alta)
A alma: pega numa dor do dia a dia e TIRA A CULPA da pessoa — o problema nunca é ela, é o método.
1. gancho — o nome da série + "parte N". É SEMPRE a primeira coisa dita.
2. dorCulpa — "Se tu [dor], o problema não é [a culpa que ela se dá]. É que tu tá [o método errado]." A pessoa reconhece-se e sente alívio.
3. corpo — a crença errada que a maioria segue → a verdade/consequência → uma metáfora do dia a dia que gruda.
4. transicao — frase curta que promete o resultado e abre os passos.
5. passo1 — a ação principal + o ganho imediato.
6. passo2 — o detalhe que destrava o passo 1 + o erro de quem o ignora.
7. passo3 — a recompensa EMOCIONAL: o que muda na VIDA dela (liberdade, descanso, paz), não na técnica. Fecha aqui, na emoção.

Mantém a MESMA forma (gancho, ritmo, estrutura) em TODOS os episódios — é a repetição da forma que faz a série ser série. O que muda entre episódios é a entrega, não a estrutura. Numera de forma que dê para gravar ("1 passo…", "2 passo…").`;

function contextoBloco(userContext?: string): string {
  const c = userContext?.trim();
  return c ? `\n\n## SOBRE A CRIADORA (Documento Mestre — usa o nicho, público, dores e tom dela)\n${c}` : "";
}

function promptNomes(p: {
  ideia: string;
  publico?: string;
  oferta?: string;
  direcao?: string;
  evitar?: string[];
  userContext?: string;
}): string {
  const evitar = (p.evitar || []).filter(Boolean);
  return `${VOZ}

${METODO_NOMES}
${contextoBloco(p.userContext)}

## TAREFA
Ideia/tema da criadora: "${p.ideia}"
Para quem é (público/avatar): ${p.publico?.trim() || "—"}
O que ela vende (para os CTA de fundo de funil): ${p.oferta?.trim() || "—"}
${p.direcao?.trim() ? `Direção pedida para os nomes: ${p.direcao.trim()}` : ""}
${evitar.length ? `NÃO repitas nem sejas parecido com estes nomes já sugeridos: ${evitar.join(" | ")}` : ""}

Se o tema estiver estreito demais (ex: "postar 1 reel por semana"), alarga-o antes de nomear (ex: "hábitos para postar sempre") e explica isso em 1 frase no campo "temaNota". Um tema bom cabe numa expressão curta e ainda dá para 30+ partes.

Gera 6 nomes de série. CADA um tem de ser uma FRASE-MOLDE repetível que abre todos os episódios (nome + "— parte N") — não uma manchete de um vídeo só. Usa 6 moldes DIFERENTES da lista acima, adaptados ao nicho da criadora, e cada um tem de dar para dizer em voz alta a olhar para a câmara. Antes de escreveres cada nome, confirma: "isto aguenta 30 partes trocando só o exemplo?". Se não aguentar, troca.

Responde APENAS com JSON válido (sem markdown, sem texto à volta), exatamente nesta forma:
{
  "temaNota": "vazio, ou 1 frase se alargaste o tema",
  "nomes": [
    { "nome": "o nome da série", "molde": "Molde N", "ingrediente": "promessa | curiosidade | pessoalidade (o que ele usa)", "porque": "1 frase curta: por que trava o dedo de rolar" }
  ]
}`;
}

function promptRoteiros(p: {
  nome: string;
  quantidade: number;
  ideia: string;
  publico?: string;
  oferta?: string;
  userContext?: string;
  desde?: number;
  jaEntregues?: string[];
}): string {
  const n = Math.min(Math.max(p.quantidade || 7, 1), 12);
  const desde = Math.max(p.desde || 0, 0);
  const inicio = desde + 1;
  const fim = desde + n;
  const continuacao = desde > 0;
  const jaBloco =
    continuacao && p.jaEntregues?.length
      ? `\nJá existem ${desde} episódios nesta série — NÃO os repitas, continua o arco a partir do episódio ${inicio}. Episódios já feitos:\n${p.jaEntregues.map((e, i) => `${i + 1}. ${e}`).join("\n")}\n`
      : "";
  return `${VOZ}

${METODO_ROTEIROS}
${contextoBloco(p.userContext)}

## TAREFA
Série escolhida: "${p.nome}"
Ideia/tema base: "${p.ideia}"
Para quem é: ${p.publico?.trim() || "—"}
O que ela vende: ${p.oferta?.trim() || "—"}
${jaBloco}
${
  continuacao
    ? `Gera a CONTINUAÇÃO desta série: ${n} episódios NOVOS, numerados do ${inicio} ao ${fim}, que avançam o arco sem repetir nenhum dos já feitos acima.`
    : `Gera ${n} episódios desta série.`
} Primeiro a lista de entregas (uma frase específica por episódio — cada uma com uma dor real + uma culpa para reverter; NADA de "fale sobre X"). Depois o roteiro completo de cada episódio no template.

Cada episódio precisa de uma dor concreta e uma culpa clara para reverter — se não tiver, troca a ideia do episódio. O gancho de cada roteiro começa SEMPRE com "${p.nome} — parte N" (usa o número REAL do episódio, a começar em ${inicio}).

Responde APENAS com JSON válido (sem markdown, sem texto à volta), exatamente nesta forma:
{
  "entregas": ["episódio ${inicio} numa frase específica", "..."],
  "roteiros": [
    {
      "n": ${inicio},
      "gancho": "${p.nome} — parte ${inicio}. …",
      "dorCulpa": "Se tu …, o problema não é …. É que tu tá …",
      "corpo": "crença errada → a verdade → metáfora do dia a dia",
      "transicao": "frase curta que abre os passos",
      "passo1": "1 passo: ação principal + ganho imediato",
      "passo2": "2 passo: o detalhe que destrava + o erro de quem ignora",
      "passo3": "3 passo: a recompensa emocional — o que muda na vida dela. Fecha na emoção."
    }
  ]
}
A lista "entregas" e a lista "roteiros" têm de ter ${n} itens (episódios ${inicio} a ${fim}).`;
}

// Extrai o primeiro objeto JSON do texto do modelo, tolerante a cercas ```json.
function extrairJson(texto: string): unknown {
  let t = texto.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const ini = t.indexOf("{");
  const fim = t.lastIndexOf("}");
  if (ini === -1 || fim === -1 || fim <= ini) throw new Error("Sem JSON na resposta");
  return JSON.parse(t.slice(ini, fim + 1));
}

export const Route = createFileRoute("/api/reels-serie")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: {
          action?: "nomes" | "roteiros";
          userContext?: string;
          ideia?: string;
          publico?: string;
          oferta?: string;
          direcao?: string;
          evitar?: string[];
          nome?: string;
          quantidade?: number;
          desde?: number;
          jaEntregues?: string[];
        };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Pedido inválido." }, { status: 400 });
        }

        if (body.action === "nomes") {
          if (!body.ideia?.trim()) {
            return Response.json({ error: "Falta a ideia/tema." }, { status: 400 });
          }
        } else if (body.action === "roteiros") {
          if (!body.nome?.trim() || !body.ideia?.trim()) {
            return Response.json({ error: "Falta o nome da série ou a ideia." }, { status: 400 });
          }
        } else {
          return Response.json({ error: "Ação desconhecida." }, { status: 400 });
        }

        let model;
        try {
          model = resolveChatModel();
        } catch (e) {
          return Response.json(
            { error: e instanceof Error ? e.message : "Falta a chave de IA." },
            { status: 500 },
          );
        }

        const prompt =
          body.action === "nomes"
            ? promptNomes(body as Parameters<typeof promptNomes>[0])
            : promptRoteiros(body as Parameters<typeof promptRoteiros>[0]);

        try {
          const { text } = await generateText({ model, prompt });
          const data = extrairJson(text);
          return Response.json(data);
        } catch (e) {
          return Response.json(
            {
              error:
                "Não consegui gerar agora. Tenta outra vez daqui a um instante — às vezes a IA gratuita fica ocupada.",
              detail: e instanceof Error ? e.message : String(e),
            },
            { status: 502 },
          );
        }
      },
    },
  },
});

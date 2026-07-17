// ─────────────────────────────────────────────────────────────────────────────
// PESQUISA GLOBAL — índice construído a partir do registo da ESTRUTURA.
//
// Não há lista duplicada para manter: quem adicionar uma página em estrutura.ts
// fica automaticamente pesquisável. Os bloqueios são aplicados por quem consome
// (ver componente BuscaGlobal), para a aluna nunca ver o que não pode abrir.
// ─────────────────────────────────────────────────────────────────────────────

import { ESTRUTURA, type Nodo } from "@/lib/estrutura";

export type ItemBusca = {
  id: string;
  label: string;
  to: string;
  /** Módulo/pilar acima deste nó, ex.: "Conteúdo Todo Dia › Formatos de Conteúdo" */
  caminho: string;
  /** Palavras extra para encontrar a página (sinónimos do dia-a-dia). */
  termos: string;
};

/** Tira acentos e põe em minúsculas — "Carrosséis" encontra-se com "carrosseis". */
export function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Sinónimos: o que a pessoa escreve ≠ o nome oficial da página.
const SINONIMOS: Record<string, string> = {
  "redes.bio": "perfil instagram posicionamento biografia",
  "redes.formatos.carrossel": "carrossel slides post",
  "redes.formatos.reels": "reels video viral",
  "redes.formatos.stories": "stories story",
  "redes.formatos.roteiros": "yap content falar camara autentico roteiro guiao script gravar",
  "redes.plano": "calendario agenda planeamento",
  "redes.desafio": "30 dias posts consistencia",
  "redes.assistente": "cat.ia robot chatgpt agente",
  "redes.agendar": "publicar agendamento",
  "redes.automacao": "dm mensagens automaticas manychat",
  "doc-mestre": "documento mestre",
  "pilar-2.tom": "tom de voz escrita copy",
  "pilar-2.visual": "identidade visual cores tipografia paleta",
  "pilar-2.consultoria-imagem": "imagem roupa cabelo estilo",
  "pilar-2.pesquisa": "pesquisa mercado publico nicho concorrencia",
  "pilar-4.copy": "copy vendas texto persuasao",
  "pilar-4.trafego": "anuncios ads trafego pago",
  "criar-produto": "esteira produto low ticket medio alto infoproduto",
  "maquina-analises": "analise perfil plano 30 dias diagnostico",
  "vendas-apps": "landing page site aplicacao programar",
  "conteudo-ia": "mini curso primeiro mes posts",
  "academia": "aulas ferramentas ia",
  "encontros": "sessoes direto duvidas feedback",
  "saude": "saude bem estar",
};

/** Constrói a lista pesquisável a partir da árvore, guardando o caminho. */
export function construirIndice(nodos: Nodo[] = ESTRUTURA): ItemBusca[] {
  const out: ItemBusca[] = [];
  const walk = (ns: Nodo[], ancestrais: string[]) => {
    for (const n of ns) {
      if (n.to) {
        out.push({
          id: n.id,
          label: n.label,
          to: n.to,
          caminho: ancestrais.join(" › "),
          termos: SINONIMOS[n.id] ?? "",
        });
      }
      if (n.filhos) walk(n.filhos, [...ancestrais, n.label]);
    }
  };
  walk(nodos, []);
  return out;
}

export const INDICE: ItemBusca[] = construirIndice();

/**
 * Procura por termo. Ordena por relevância:
 * começa-por (3) > palavra-começa-por (2) > contém (1) > só sinónimo (0).
 */
export function procurar(termo: string, indice: ItemBusca[] = INDICE): ItemBusca[] {
  const q = normalizar(termo);
  if (q.length < 2) return [];

  const pontuados: { item: ItemBusca; pontos: number }[] = [];
  for (const item of indice) {
    const label = normalizar(item.label);
    const caminho = normalizar(item.caminho);
    const termos = normalizar(item.termos);

    let pontos = -1;
    if (label.startsWith(q)) pontos = 3;
    else if (label.split(/\s+/).some((p) => p.startsWith(q))) pontos = 2;
    else if (label.includes(q)) pontos = 1;
    else if (termos.includes(q) || caminho.includes(q)) pontos = 0;

    if (pontos >= 0) pontuados.push({ item, pontos });
  }

  pontuados.sort((a, b) => b.pontos - a.pontos || a.item.label.length - b.item.label.length);

  // O registo tem módulos e a sua "Introdução" a apontar para a mesma rota —
  // legítimo na árvore, ruído na pesquisa. Fica o de melhor pontuação.
  const vistos = new Set<string>();
  const unicos: ItemBusca[] = [];
  for (const { item } of pontuados) {
    if (vistos.has(item.to)) continue;
    vistos.add(item.to);
    unicos.push(item);
    if (unicos.length === 8) break;
  }
  return unicos;
}

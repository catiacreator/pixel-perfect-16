// Formata o Documento Mestre de um aluno (a partir do blob master_documents) num
// texto/markdown legível, e trata do download.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export function formatarDocMestre(blob: Record<string, Any> | null, nome: string): string {
  const doc = (blob?.["leveza.doc-mestre.v1"] as Any) || {};
  const p2 = (blob?.["leveza.pilar2.v1"] as Any) || {};
  const L: string[] = [];
  const add = (s = "") => L.push(s);
  const linha = (label: string, val: Any) => { if (val != null && String(val).trim()) add(`- ${label}: ${val}`); };
  const lista = (label: string, arr: Any[]) => {
    const items = (arr || []).filter((x: Any) => x && String(x).trim());
    if (items.length) { add(`\n${label}:`); items.forEach((x: Any) => add(`  • ${x}`)); }
  };

  add(`DOCUMENTO MESTRE — ${nome || doc.nome || "Aluno"}`);
  add("=".repeat(48));

  add(`\n## QUEM É`);
  linha("Nome", doc.nome);
  linha("Profissão", doc.profissao);
  linha("Tempo de atuação", doc.tempoAtuacao);
  linha("O que faz", doc.oQueFaz);
  linha("Como resolve", doc.comoResolve);
  linha("Público", doc.publico);
  lista("Dores do público", doc.dores);
  lista("Desejos do público", doc.desejos);
  linha("Tom de voz", doc.tomDeVoz);

  if (p2.nomeMetodo || p2.promessa || p2.posicionamento || p2.pilares) {
    add(`\n## O MÉTODO`);
    linha("Nome do método", p2.nomeMetodo);
    linha("Promessa", p2.promessa);
    linha("Posicionamento", p2.posicionamento);
    if (p2.pilares && String(p2.pilares).trim()) { add(`\nPilares:`); add(String(p2.pilares)); }
  }

  if (p2.arquetipoDominante || p2.arquetipoSecundario || p2.arquetipoClienteDominante) {
    add(`\n## ARQUÉTIPOS`);
    linha("Dominante", p2.arquetipoDominante);
    linha("Secundário", p2.arquetipoSecundario);
    linha("Cliente (dominante)", p2.arquetipoClienteDominante);
    linha("Cliente (secundário)", p2.arquetipoClienteSecundario);
  }

  if (p2.palavrasUsar || p2.palavrasEvitar || p2.crencaCentral || p2.opinioesPolemicas || p2.tomDeVoz) {
    add(`\n## TOM DE VOZ & LINGUAGEM`);
    linha("Tom de voz", p2.tomDeVoz);
    linha("Palavras a usar", p2.palavrasUsar);
    linha("Palavras a evitar", p2.palavrasEvitar);
    linha("Crença central", p2.crencaCentral);
    linha("Opiniões polémicas", p2.opinioesPolemicas);
  }

  const pares = (p2.pares || []).filter((x: Any) => x && (x.dor || x.vitoria));
  if (pares.length) {
    add(`\n## DOR → VITÓRIA`);
    pares.forEach((p: Any, i: number) => add(`${i + 1}. Dor: ${p.dor || "—"}  →  Vitória: ${p.vitoria || "—"}${p.intensidade ? `  [${p.intensidade}]` : ""}`));
  }

  if (p2.vibeMarca || p2.paleta || p2.estiloImagem) {
    add(`\n## IDENTIDADE VISUAL`);
    linha("Vibe da marca", p2.vibeMarca);
    linha("Paleta", p2.paleta);
    linha("Estilo de imagem", p2.estiloImagem);
  }

  if (L.length <= 5) return ""; // praticamente vazio
  return L.join("\n");
}

export function baixarTexto(nomeFicheiro: string, conteudo: string) {
  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeFicheiro;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

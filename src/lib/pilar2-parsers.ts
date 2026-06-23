// Parsers para resultados colados do ChatGPT.

export type TomDeVozResult = {
  tomDeVoz: string;
  crencaCentral: string;
  opinioesPolemicas: string;
  cases: string;
};

function grab(text: string, label: string, nextLabels: string[]): string {
  const labelRe = new RegExp(`Campo:\\s*${label}\\b[\\s:]*`, "i");
  const m = text.match(labelRe);
  if (!m) return "";
  const start = m.index! + m[0].length;
  let end = text.length;
  for (const next of nextLabels) {
    const re = new RegExp(`Campo:\\s*${next}\\b`, "i");
    const nm = text.slice(start).match(re);
    if (nm) end = Math.min(end, start + nm.index!);
  }
  return text.slice(start, end).trim();
}

export function parseTomDeVoz(text: string): TomDeVozResult {
  const labels = ["tom_de_voz", "crenca_central", "opinioes_polemicas", "cases"];
  return {
    tomDeVoz: grab(text, "tom_de_voz", labels.filter((l) => l !== "tom_de_voz")),
    crencaCentral: grab(text, "crenca_central", labels.filter((l) => l !== "crenca_central")),
    opinioesPolemicas: grab(text, "opinioes_polemicas", labels.filter((l) => l !== "opinioes_polemicas")),
    cases: grab(text, "cases", labels.filter((l) => l !== "cases")),
  };
}

export type IdentidadeVisualResult = {
  vibeMarca: string;
  paleta: string;
  tipografiaTitulo: string;
  tipografiaCorpo: string;
  tipografiaManuscrita: string;
  estiloImagem: string;
  elementosVisuais: string;
  antipadroesVisuais: string;
  promptCarrossel: string;
  promptReels: string;
  promptLifestyle: string;
};

// Procura uma seção pelo título numerado (ex: "1. VIBE DA MARCA").
function section(text: string, num: number, until: number[]): string {
  const re = new RegExp(`(?:^|\\n)[^\\n]*?\\b${num}\\.\\s+[A-ZÁÉÍÓÚÃÕÂÊÔÇ /]+\\n`, "i");
  const m = text.match(re);
  if (!m) return "";
  const start = m.index! + m[0].length;
  let end = text.length;
  for (const n of until) {
    const stopRe = new RegExp(`(?:^|\\n)[^\\n]*?\\b${n}\\.\\s+[A-ZÁÉÍÓÚÃÕÂÊÔÇ /]+`, "i");
    const sm = text.slice(start).match(stopRe);
    if (sm) end = Math.min(end, start + sm.index!);
  }
  return text.slice(start, end).trim();
}

export function parseIdentidadeVisual(text: string): IdentidadeVisualResult {
  const upcoming = (n: number) => Array.from({ length: 10 - n }, (_, i) => n + 1 + i);
  const tipo = section(text, 3, upcoming(3));
  const tituloMatch = tipo.match(/Título\s*:?\s*([\s\S]*?)(?:\n\s*Corpo\s*:|$)/i);
  const corpoMatch = tipo.match(/Corpo\s*:?\s*([\s\S]*?)$/i);

  return {
    vibeMarca: section(text, 1, upcoming(1)),
    paleta: section(text, 2, upcoming(2)),
    tipografiaTitulo: (tituloMatch?.[1] || "").trim(),
    tipografiaCorpo: (corpoMatch?.[1] || "").trim(),
    tipografiaManuscrita: section(text, 10, []),
    estiloImagem: section(text, 4, upcoming(4)),
    elementosVisuais: section(text, 5, upcoming(5)),
    antipadroesVisuais: section(text, 6, upcoming(6)),
    promptCarrossel: section(text, 7, upcoming(7)),
    promptReels: section(text, 8, upcoming(8)),
    promptLifestyle: section(text, 9, upcoming(9)),
  };
}

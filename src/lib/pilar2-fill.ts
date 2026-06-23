// Expande placeholders [entre_colchetes] usando Doc Mestre + estado Pilar 2.

import { readPilar2 } from "./pilar2-storage";

type DocMestre = {
  nome?: string;
  profissao?: string;
  oQueFaz?: string;
  comoResolve?: string;
  publico?: string;
  dores?: string[];
  desejos?: string[];
};

const VAZIO = "(não preenchido)";

function readDoc(): DocMestre {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem("leveza.doc-mestre.v1") || "{}");
  } catch {
    return {};
  }
}

function listLines(items: string[] | undefined): string {
  const list = (items || []).map((s) => (s || "").trim()).filter(Boolean);
  return list.length ? list.map((s, i) => `${i + 1}. ${s}`).join("\n") : VAZIO;
}

export function fillPilar2Prompt(template: string): string {
  const doc = readDoc();
  const p = readPilar2();

  const dores = p.doresTop5.some(Boolean) ? p.doresTop5 : doc.dores || [];
  const pares = p.pares;

  const map: Record<string, string> = {
    "[nome]": doc.nome || VAZIO,
    "[profissao]": doc.profissao || VAZIO,
    "[o_que_faz]": doc.oQueFaz || VAZIO,
    "[como_resolve]": doc.comoResolve || VAZIO,
    "[publico]": doc.publico || VAZIO,
    "[dores_lista]": listLines(dores),
    "[desejos_lista]": listLines(doc.desejos),

    "[dor1]": (pares[0]?.dor || dores[0] || VAZIO),
    "[dor2]": (pares[1]?.dor || dores[1] || VAZIO),
    "[dor3]": (pares[2]?.dor || dores[2] || VAZIO),
    "[dor4]": (pares[3]?.dor || dores[3] || VAZIO),
    "[dor5]": (pares[4]?.dor || dores[4] || VAZIO),

    "[vitoria1]": pares[0]?.vitoria || VAZIO,
    "[vitoria2]": pares[1]?.vitoria || VAZIO,
    "[vitoria3]": pares[2]?.vitoria || VAZIO,
    "[vitoria4]": pares[3]?.vitoria || VAZIO,
    "[vitoria5]": pares[4]?.vitoria || VAZIO,

    "[arquetipo_dominante]": p.arquetipoDominante || VAZIO,
    "[arquetipo_secundario]": p.arquetipoSecundario || VAZIO,
    "[arquetipo_cliente_dominante]": p.arquetipoClienteDominante || VAZIO,
    "[arquetipo_cliente_secundario]": p.arquetipoClienteSecundario || VAZIO,
    "[dor_principal_cliente]": p.dorPrincipalCliente || VAZIO,
    "[prova_social]": p.provaSocial || VAZIO,
    "[ajustes_comunicacao]": p.ajustesComunicacao || VAZIO,

    "[palavras_usar]": p.palavrasUsar || VAZIO,
    "[palavras_evitar]": p.palavrasEvitar || VAZIO,

    "[tom_de_voz]": p.tomDeVoz || VAZIO,
    "[promessa]": p.promessa || VAZIO,
  };

  let out = template;
  for (const [k, v] of Object.entries(map)) {
    out = out.split(k).join(v);
  }
  return out;
}

// Persistência localStorage para todos os campos do Pilar 2 — Criar Autoridade.
// Mantém o padrão do Doc Mestre (`leveza.doc-mestre.v1`).

export const ARQUETIPOS = [
  "INOCENTE",
  "EXPLORADORA",
  "SÁBIA",
  "HEROÍNA",
  "FORA-DA-LEI",
  "MAGA",
  "AMANTE",
  "BOBA",
  "CARA COMUM",
  "CUIDADORA",
  "CRIADORA",
  "GOVERNANTE",
] as const;

export type Arquetipo = (typeof ARQUETIPOS)[number] | "";

export type ParDorVitoria = {
  dor: string;
  intensidade: "Alta" | "Moderada" | "Baixa";
  vitoria: string;
};

export type Pilar2State = {
  // Etapa 1 — Pesquisa
  doresTop5: string[]; // 5 entradas
  passo1Concluido: boolean;
  passo2Concluido: boolean;

  // Etapa 2 — Método
  pares: ParDorVitoria[]; // até 5
  nomeMetodo: string;
  promessa: string;
  metodoChat: { role: "user" | "assistant"; content: string }[];

  // Etapa 3.1 — Arquétipos
  arquetipoDominante: Arquetipo;
  arquetipoSecundario: Arquetipo;
  palavrasUsar: string;
  palavrasEvitar: string;
  arquetipoResultadoCompleto: string;

  arquetipoClienteDominante: Arquetipo;
  arquetipoClienteSecundario: Arquetipo;
  dorPrincipalCliente: string;
  provaSocial: string;
  arquetipoClienteResultadoCompleto: string;

  ajustesComunicacao: string;

  // Etapa 3.2 — Tom de voz
  tomDeVozCola: string;
  tomDeVoz: string;
  crencaCentral: string;
  opinioesPolemicas: string;
  cases: string;

  // Etapa 3.3 — Identidade visual
  identidadeVisualCola: string;
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

const KEY = "leveza.pilar2.v1";

export const EMPTY_PILAR2: Pilar2State = {
  doresTop5: ["", "", "", "", ""],
  passo1Concluido: false,
  passo2Concluido: false,

  pares: [
    { dor: "", intensidade: "Alta", vitoria: "" },
    { dor: "", intensidade: "Alta", vitoria: "" },
    { dor: "", intensidade: "Alta", vitoria: "" },
    { dor: "", intensidade: "Alta", vitoria: "" },
    { dor: "", intensidade: "Alta", vitoria: "" },
  ],
  nomeMetodo: "",
  promessa: "",
  metodoChat: [],

  arquetipoDominante: "",
  arquetipoSecundario: "",
  palavrasUsar: "",
  palavrasEvitar: "",
  arquetipoResultadoCompleto: "",

  arquetipoClienteDominante: "",
  arquetipoClienteSecundario: "",
  dorPrincipalCliente: "",
  provaSocial: "",
  arquetipoClienteResultadoCompleto: "",

  ajustesComunicacao: "",

  tomDeVozCola: "",
  tomDeVoz: "",
  crencaCentral: "",
  opinioesPolemicas: "",
  cases: "",

  identidadeVisualCola: "",
  vibeMarca: "",
  paleta: "",
  tipografiaTitulo: "",
  tipografiaCorpo: "",
  tipografiaManuscrita: "",
  estiloImagem: "",
  elementosVisuais: "",
  antipadroesVisuais: "",
  promptCarrossel: "",
  promptReels: "",
  promptLifestyle: "",
};

export function readPilar2(): Pilar2State {
  if (typeof window === "undefined") return EMPTY_PILAR2;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_PILAR2;
    const parsed = JSON.parse(raw) as Partial<Pilar2State>;
    return { ...EMPTY_PILAR2, ...parsed };
  } catch {
    return EMPTY_PILAR2;
  }
}

export function writePilar2(state: Pilar2State) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("leveza:pilar2-changed"));
}

export function patchPilar2(patch: Partial<Pilar2State>) {
  const current = readPilar2();
  writePilar2({ ...current, ...patch });
}

// Séries de Reels guardadas — persistência por aluno.
//
// Segue o padrão da casa: escreve em localStorage sob uma chave `leveza.*.v1`.
// Como essa chave está em SYNC_KEYS (ver master-doc-sync.ts), a série é
// automaticamente sincronizada para a conta do aluno (master_documents),
// ficando disponível entre sessões e dispositivos. Guardar as séries também é
// o que permite CONTINUAR uma série sem repetir episódios: ao reabrir, o
// histórico de entregas volta, e a continuação parte do último episódio.

export type RoteiroGuardado = {
  n: number;
  gancho: string;
  dorCulpa: string;
  corpo: string;
  transicao: string;
  passo1: string;
  passo2: string;
  passo3: string;
};

export type SerieGuardada = {
  id: string;
  nome: string;
  ideia: string;
  publico?: string;
  oferta?: string;
  tom?: string; // "proximo" | "descontraido" | "inspirador" | "direto" | "formal"
  entregas: string[];
  roteiros: RoteiroGuardado[];
  criadoEm: number;
  atualizadoEm: number;
};

export const REELS_SERIES_KEY = "leveza.reels-series.v1";

function uid(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fallback */
  }
  return `s_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/** Todas as séries guardadas, da mais recente para a mais antiga. */
export function loadSeries(): SerieGuardada[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REELS_SERIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed?.series) ? parsed.series : [];
    return (arr as SerieGuardada[])
      .filter((s) => s && typeof s.id === "string")
      .sort((a, b) => (b.atualizadoEm || 0) - (a.atualizadoEm || 0));
  } catch {
    return [];
  }
}

function persist(list: SerieGuardada[]): void {
  try {
    window.localStorage.setItem(REELS_SERIES_KEY, JSON.stringify({ series: list }));
  } catch {
    /* quota cheia — mantém o que está */
  }
}

/**
 * Cria ou atualiza uma série guardada. Se `entrada.id` já existir, atualiza-a
 * (mantendo `criadoEm`); caso contrário cria uma nova. Devolve a série gravada.
 */
export function guardarSerie(
  entrada: Omit<SerieGuardada, "id" | "criadoEm" | "atualizadoEm"> & { id?: string },
): SerieGuardada {
  const agora = Date.now();
  const lista = loadSeries();
  const id = entrada.id && entrada.id.trim() ? entrada.id : uid();
  const existente = lista.find((s) => s.id === id);
  const serie: SerieGuardada = {
    id,
    nome: entrada.nome,
    ideia: entrada.ideia,
    publico: entrada.publico,
    oferta: entrada.oferta,
    tom: entrada.tom,
    entregas: entrada.entregas || [],
    roteiros: entrada.roteiros || [],
    criadoEm: existente?.criadoEm ?? agora,
    atualizadoEm: agora,
  };
  const resto = lista.filter((s) => s.id !== id);
  persist([serie, ...resto]);
  return serie;
}

/** Remove uma série guardada pelo id. */
export function removerSerie(id: string): void {
  persist(loadSeries().filter((s) => s.id !== id));
}

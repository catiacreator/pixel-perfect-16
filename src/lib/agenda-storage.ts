export type ColunaId = "todo" | "doing" | "done";

export type AgendaAula = { titulo: string; url: string };

export type Tarefa = {
  id: string;
  titulo: string;
  notas: string;
  coluna: ColunaId;
  aulas: AgendaAula[];
  criadaEm: number;
};

export type AgendaState = { tarefas: Tarefa[] };

export const COLUNAS: { id: ColunaId; titulo: string }[] = [
  { id: "todo", titulo: "A fazer" },
  { id: "doing", titulo: "Em progresso" },
  { id: "done", titulo: "Concluído" },
];

export const AGENDA_STORAGE_KEY = "leveza.agenda.v1";

export const INITIAL_AGENDA: AgendaState = { tarefas: [] };

export function uid(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fallback abaixo */
  }
  return `t_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function loadAgenda(): AgendaState {
  if (typeof window === "undefined") return INITIAL_AGENDA;
  try {
    const raw = window.localStorage.getItem(AGENDA_STORAGE_KEY);
    if (!raw) return INITIAL_AGENDA;
    const parsed = JSON.parse(raw) as Partial<AgendaState>;
    const tarefas = Array.isArray(parsed.tarefas) ? parsed.tarefas : [];
    return {
      tarefas: tarefas.map((t) => ({
        id: t.id ?? uid(),
        titulo: t.titulo ?? "",
        notas: t.notas ?? "",
        coluna: (t.coluna as ColunaId) ?? "todo",
        aulas: Array.isArray(t.aulas) ? t.aulas : [],
        criadaEm: t.criadaEm ?? Date.now(),
      })),
    };
  } catch {
    return INITIAL_AGENDA;
  }
}

export function saveAgenda(state: AgendaState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AGENDA_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota cheia — ignora */
  }
}

/** Adiciona uma aula (link/tag) a uma tarefa existente, sem duplicar. */
export function anexarAula(tarefaId: string, aula: AgendaAula): AgendaState {
  const state = loadAgenda();
  const next: AgendaState = {
    tarefas: state.tarefas.map((t) =>
      t.id === tarefaId && !t.aulas.some((a) => a.url === aula.url)
        ? { ...t, aulas: [...t.aulas, aula] }
        : t,
    ),
  };
  saveAgenda(next);
  return next;
}

/** Cria uma nova tarefa (opcionalmente já com uma aula anexada). */
export function criarTarefa(titulo: string, coluna: ColunaId = "todo", aula?: AgendaAula): AgendaState {
  const state = loadAgenda();
  const nova: Tarefa = {
    id: uid(),
    titulo: titulo.trim() || "Nova tarefa",
    notas: "",
    coluna,
    aulas: aula ? [aula] : [],
    criadaEm: Date.now(),
  };
  const next: AgendaState = { tarefas: [...state.tarefas, nova] };
  saveAgenda(next);
  return next;
}

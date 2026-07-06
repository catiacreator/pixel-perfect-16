export type Unidade = "h" | "min";
export type Freq = "dia" | "semana" | "mes";
export type Moeda = "BRL" | "EUR" | "USD";

export const MOEDAS: { code: Moeda; label: string; simbolo: string; locale: string }[] = [
  { code: "BRL", label: "Real (R$)", simbolo: "R$", locale: "pt-BR" },
  { code: "EUR", label: "Euro (€)", simbolo: "€", locale: "pt-PT" },
  { code: "USD", label: "Dólar ($)", simbolo: "$", locale: "en-US" },
];

export type Tarefa = {
  nome: string;
  qtd: string;
  unidade: Unidade;
  freq: Freq;
};

export type Categoria = {
  titulo: string;
  desc: string;
  tarefas: Tarefa[];
};

export type DetetiveState = {
  faturamento: string;
  horasDia: string;
  diasSemana: string;
  moeda: Moeda;
  categorias: Categoria[];
};

export const DETETIVE_STORAGE_KEY = "leveza.detetive.v1";

export const CATEGORIAS_INICIAIS: Categoria[] = [
  {
    titulo: "Produção",
    desc: "Tarefas que você faz pra entregar pro cliente",
    tarefas: [{ nome: "", qtd: "", unidade: "h", freq: "dia" }],
  },
  {
    titulo: "Marketing",
    desc: "Tarefas pra vender e atrair clientes",
    tarefas: [{ nome: "", qtd: "", unidade: "h", freq: "dia" }],
  },
  {
    titulo: "Estratégia",
    desc: "Pensar em crescer sem se matar",
    tarefas: [{ nome: "", qtd: "", unidade: "h", freq: "dia" }],
  },
];

export const INITIAL_STATE: DetetiveState = {
  faturamento: "",
  horasDia: "",
  diasSemana: "",
  moeda: "BRL",
  categorias: CATEGORIAS_INICIAIS,
};

export function loadDetetive(): DetetiveState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(DETETIVE_STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<DetetiveState>;
    return {
      faturamento: parsed.faturamento ?? "",
      horasDia: parsed.horasDia ?? "",
      diasSemana: parsed.diasSemana ?? "",
      moeda: parsed.moeda ?? "BRL",
      categorias: parsed.categorias?.length ? parsed.categorias : CATEGORIAS_INICIAIS,
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function saveDetetive(state: DetetiveState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DETETIVE_STORAGE_KEY, JSON.stringify(state));
}

export function clearDetetive() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DETETIVE_STORAGE_KEY);
}

// ------- cálculos -------

const SEMANAS_NO_MES = 4.33;

export function num(v: string): number {
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/** Custo por hora do dono: faturamento / (horasDia * diasSemana * 4.33) */
export function custoHora(s: DetetiveState): number {
  const f = num(s.faturamento);
  const h = num(s.horasDia);
  const d = num(s.diasSemana);
  const horasMes = h * d * SEMANAS_NO_MES;
  if (horasMes <= 0) return 0;
  return f / horasMes;
}

/** Horas mensais de uma tarefa */
export function horasMensais(t: Tarefa): number {
  const q = num(t.qtd);
  const horas = t.unidade === "min" ? q / 60 : q;
  switch (t.freq) {
    case "dia":
      // assumimos diasSemana já está no custoHora — aqui usamos dias úteis estimados
      // para simplificar: dia → 22 dias por mês
      return horas * 22;
    case "semana":
      return horas * SEMANAS_NO_MES;
    case "mes":
      return horas;
  }
}

export type TarefaComputada = {
  categoria: string;
  nome: string;
  horasMes: number;
  custoMes: number;
};

export type Relatorio = {
  horaVale: number;
  totalHoras: number;
  totalCusto: number;
  porCategoria: { titulo: string; horas: number; custo: number }[];
  tarefas: TarefaComputada[];
  preenchido: boolean;
};

export function calcularRelatorio(s: DetetiveState): Relatorio {
  const hora = custoHora(s);
  const tarefas: TarefaComputada[] = [];
  const porCategoria = s.categorias.map((c) => {
    let h = 0;
    let cu = 0;
    c.tarefas.forEach((t) => {
      if (!t.nome.trim() || num(t.qtd) <= 0) return;
      const hm = horasMensais(t);
      const cm = hm * hora;
      h += hm;
      cu += cm;
      tarefas.push({ categoria: c.titulo, nome: t.nome, horasMes: hm, custoMes: cm });
    });
    return { titulo: c.titulo, horas: h, custo: cu };
  });
  tarefas.sort((a, b) => b.custoMes - a.custoMes);
  const totalHoras = porCategoria.reduce((a, b) => a + b.horas, 0);
  const totalCusto = porCategoria.reduce((a, b) => a + b.custo, 0);
  return {
    horaVale: hora,
    totalHoras,
    totalCusto,
    porCategoria,
    tarefas,
    preenchido: hora > 0 && tarefas.length > 0,
  };
}

/** Formata um valor na moeda escolhida (R$ / € / $). */
export function fmtMoeda(n: number, moeda: Moeda = "BRL"): string {
  const m = MOEDAS.find((x) => x.code === moeda) ?? MOEDAS[0];
  return n.toLocaleString(m.locale, { style: "currency", currency: m.code, maximumFractionDigits: 0 });
}

/** @deprecated usar fmtMoeda(n, moeda) — mantido para compatibilidade. */
export function brl(n: number): string {
  return fmtMoeda(n, "BRL");
}

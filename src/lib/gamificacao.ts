// ─────────────────────────────────────────────────────────────────────────────
// Gamificação — valores, níveis e helpers puros (partilhados cliente + servidor).
// A tabela de pontos vive AQUI (um só sítio para ajustar).
// ─────────────────────────────────────────────────────────────────────────────

export type TipoTarefa = "aula" | "etapa" | "celebrar";

// Pontos por tipo de tarefa concluída.
export const PONTOS_TAREFA: Record<TipoTarefa, number> = {
  aula: 15, // uma aula da Academia
  etapa: 15, // uma etapa de um pilar
  celebrar: 10, // um item do "Revise e celebre"
};

// Pontos dos posts e prémios.
export const PONTOS = {
  post: 10, // cada post publicado
  bonusSemana: 30, // ao atingir LIMIAR.semanaPosts numa semana
  bonusMes: 150, // ao atingir LIMIAR.mesPosts num mês
  vencedorMes: 300, // prémio do vencedor da competição mensal
  campoDocMestre: 10, // cada campo preenchido do Documento Mestre
};

export const LIMIAR = { semanaPosts: 5, mesPosts: 20 };

// Níveis (calculados a partir dos pontos).
export type Tier = { label: string; min: number; next?: number };
export const TIERS: Tier[] = [
  { label: "Início", min: 0, next: 100 },
  { label: "Em Ação", min: 100, next: 500 },
  { label: "Pro", min: 500, next: 1500 },
  { label: "Master", min: 1500, next: 5000 },
  { label: "Lenda", min: 5000 },
];

export function tierFor(pontos: number): Tier {
  let atual = TIERS[0];
  for (const t of TIERS) if (pontos >= t.min) atual = t;
  return atual;
}

// ── Registo de posts (por aluno) ──
export type PostPublicado = {
  id: string;
  data: string; // "YYYY-MM-DD" (dia da publicação)
  titulo?: string;
  formato?: string;
};

// ── Tarefas concluídas (por aluno) ──
export type TarefaFeita = { tipo: TipoTarefa; data: string /* ISO */ };
export type MapaTarefas = Record<string, TarefaFeita>;

// "YYYY-MM" de uma data "YYYY-MM-DD".
export function chaveMes(dataYMD: string): string {
  return dataYMD.slice(0, 7);
}

// Chave de semana ISO ("YYYY-Www") de uma data "YYYY-MM-DD".
export function chaveSemana(dataYMD: string): string {
  const d = new Date(dataYMD + "T00:00:00");
  const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dia = dt.getUTCDay() || 7; // segunda=1 … domingo=7
  dt.setUTCDate(dt.getUTCDate() + 4 - dia); // quinta desta semana
  const inicioAno = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  const semana = Math.ceil(((dt.getTime() - inicioAno.getTime()) / 86400000 + 1) / 7);
  return `${dt.getUTCFullYear()}-W${String(semana).padStart(2, "0")}`;
}

// Agrupa contagens por chave.
export function contarPor(posts: PostPublicado[], chave: (ymd: string) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of posts) {
    const k = chave(p.data);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

// Calcula o total de pontos a partir do estado guardado.
export function calcularPontos(input: {
  tarefas: MapaTarefas;
  posts: PostPublicado[];
  camposDocMestre?: number; // nº de campos preenchidos do Documento Mestre
  pontosConquistas?: number; // soma dos pontos de conquistas atribuídas
  bonusVencedor?: number; // meses vencidos × PONTOS.vencedorMes
}): number {
  let total = 0;

  for (const t of Object.values(input.tarefas || {})) {
    total += PONTOS_TAREFA[t.tipo] ?? 0;
  }

  const posts = input.posts || [];
  total += posts.length * PONTOS.post;

  const porSemana = contarPor(posts, chaveSemana);
  for (const n of Object.values(porSemana)) if (n >= LIMIAR.semanaPosts) total += PONTOS.bonusSemana;

  const porMes = contarPor(posts, chaveMes);
  for (const n of Object.values(porMes)) if (n >= LIMIAR.mesPosts) total += PONTOS.bonusMes;

  total += (input.camposDocMestre ?? 0) * PONTOS.campoDocMestre;
  total += input.pontosConquistas ?? 0;
  total += input.bonusVencedor ?? 0;

  return total;
}

// Mês corrente "YYYY-MM" (para a competição). Recebe a data para ser testável.
export function mesCorrente(agora: Date): string {
  return `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}`;
}

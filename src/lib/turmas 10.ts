// Tipos partilhados das Turmas (grupos de alunos com permissões próprias).
export type Turma = {
  id: string;
  nome: string;
  cor?: string;
  membros: string[]; // userIds
  acessos: string[]; // ids da ESTRUTURA que a turma pode ver
};

export const CORES_TURMA = [
  "#C8487E", "#2E7CB8", "#9E7FEC", "#F0A766", "#2FA98A", "#E0567A", "#6C8CD5", "#D98C3F",
];

// id estável sem Date.now()/Math.random() (indisponíveis) — baseado no nome + tamanho.
export function novoTurmaId(nome: string, n: number): string {
  const slug = nome.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 24);
  return `turma-${slug || "nova"}-${n + 1}`;
}

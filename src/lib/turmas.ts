// Categoria da turma (tier do produto). Cursos e Mini-cursos veem a plataforma
// com os links do topo desativados (só o Início ativo).
export type TurmaCategoria = "mentoria" | "ferramentas" | "cursos" | "mini-cursos";

export const CATEGORIAS_TURMA: { id: TurmaCategoria; label: string }[] = [
  { id: "mentoria", label: "Mentoria" },
  { id: "ferramentas", label: "Ferramentas" },
  { id: "cursos", label: "Cursos" },
  { id: "mini-cursos", label: "Mini-cursos" },
];

// Cursos e Mini-cursos → links do topo desativados.
export function categoriaDesativaLinks(c?: string | null): boolean {
  return c === "cursos" || c === "mini-cursos";
}

// Contacto da Cátia (WhatsApp) mostrado quando um nó está "Bloqueado".
export const WHATSAPP_CATIA = "https://wa.link/jwr3yp";

// Tipos partilhados das Turmas (grupos de alunos com permissões próprias).
export type Turma = {
  id: string;
  nome: string;
  cor?: string;
  categoria?: TurmaCategoria;
  membros: string[]; // userIds
  acessos: string[]; // ids da ESTRUTURA que a turma pode ver
  // Por nó sem acesso: "em-breve" (morto) ou "bloqueado" (mostra contacto). Default em-breve.
  modos?: Record<string, string>;
};

// Estado por defeito (sem turma): o aluno segue o papel "Aluno" (ver /admin/papeis).
// Mostrado como "Iniciante (padrão)" na tabela de Alunos.
export const SEM_TURMA_LABEL = "Iniciante (padrão)";

export const CORES_TURMA = [
  "#C8487E", "#2E7CB8", "#9E7FEC", "#F0A766", "#2FA98A", "#E0567A", "#6C8CD5", "#D98C3F",
];

// id estável sem Date.now()/Math.random() (indisponíveis) — baseado no nome + tamanho.
export function novoTurmaId(nome: string, n: number): string {
  const slug = nome.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 24);
  return `turma-${slug || "nova"}-${n + 1}`;
}

// Tipos partilhados da página "Encontros" (mentoria ao vivo).
// Os encontros são guardados no blob da conta principal, sob a chave "__encontros__".
// Ficheiros (PDF, docx, pptx…) vivem no bucket público "encontros" do Supabase Storage.

export type EncontroLink = { nome: string; url: string };
export type EncontroFicheiro = { nome: string; url: string; tipo?: string };

export type Encontro = {
  id: string;
  titulo: string;
  data?: string; // texto livre, ex.: "12 jul · 21h"
  videoUrl?: string;
  descricao?: string;
  links?: EncontroLink[];
  ficheiros?: EncontroFicheiro[];
};

export type EncontroComentario = {
  id: string;
  encontroId: string;
  userId: string;
  nome: string;
  avatar?: string;
  texto: string;
  ts: string; // ISO
};

/** Extensão em maiúsculas para a etiqueta do ficheiro (PDF, DOCX, …). */
export function extLabel(nome: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(nome.trim());
  return m ? m[1].toUpperCase() : "FICHEIRO";
}

import { PlayCircle } from "lucide-react";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";

export default function VideoPlaceholder({ label }: { label?: string }) {
  // Os espaços reservados de vídeo são só para a Cátia (admin) saber onde vai
  // gravar. Os alunos não os veem — para eles é como se a secção não existisse.
  const soAlunos = useBloqueadoParaAlunos();
  if (soAlunos) return null;

  return (
    <div className="w-full aspect-video rounded-2xl border border-dashed border-border bg-white flex flex-col items-center justify-center gap-2 text-muted">
      <PlayCircle size={36} className="opacity-50" />
      <p className="text-xs text-center px-6">
        {label || "Espaço reservado para o vídeo desta aula — substitui este bloco pelo embed quando gravares."}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-terracotta/70 font-semibold">Só tu vês isto</p>
    </div>
  );
}

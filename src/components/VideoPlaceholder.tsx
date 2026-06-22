import { PlayCircle } from "lucide-react";

export default function VideoPlaceholder({ label }: { label?: string }) {
  return (
    <div className="w-full aspect-video rounded-2xl border border-dashed border-border bg-white flex flex-col items-center justify-center gap-2 text-muted">
      <PlayCircle size={36} className="opacity-50" />
      <p className="text-xs text-center px-6">
        {label || "Espaço reservado para o vídeo desta aula — substitui este bloco pelo embed quando gravares."}
      </p>
    </div>
  );
}

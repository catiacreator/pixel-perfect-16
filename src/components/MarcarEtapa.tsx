import { useRouterState } from "@tanstack/react-router";
import { nodeIdParaRota } from "@/lib/estrutura";
import TarefaCompleta from "./TarefaCompleta";

// Aparece automaticamente no fim das páginas de conteúdo dos pilares 2/3/4
// (exceto os "Revise e celebre", que já têm o seu próprio checklist). Marca a
// etapa como concluída — conta para os pontos. Injetado uma vez no Layout.
export default function MarcarEtapa() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const id = nodeIdParaRota(pathname);
  if (!id || !/^pilar-[234]\./.test(id) || id.endsWith(".conclusao")) return null;

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-10 pb-16 pt-2 flex flex-col items-center gap-2">
      <p className="text-xs text-ink/45">Terminou esta etapa?</p>
      <TarefaCompleta id={`etapa:${id}`} tipo="etapa" />
    </div>
  );
}

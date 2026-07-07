// Progresso das aulas — agora assente no servidor (gamificação), mantendo a
// mesma API para não mexer nos consumidores. Cada aula concluída é a tarefa
// "aula:<tool>/<aulaId>" e conta para os pontos.
import { useProgresso } from "@/lib/use-progresso";

export function key(tool: string, aulaId: string) {
  return `${tool}/${aulaId}`;
}

const tid = (tool: string, aulaId: string) => `aula:${key(tool, aulaId)}`;

export function useAulaProgress() {
  const { tarefas, isFeita, marcar } = useProgresso();

  // map compatível com os consumidores antigos: { "tool/aulaId": true }
  const map: Record<string, boolean> = {};
  for (const id of Object.keys(tarefas)) {
    if (id.startsWith("aula:")) map[id.slice("aula:".length)] = true;
  }

  const toggle = (tool: string, aulaId: string) => {
    void marcar(tid(tool, aulaId), "aula", !isFeita(tid(tool, aulaId)));
  };

  const isDone = (tool: string, aulaId: string) => isFeita(tid(tool, aulaId));

  const countDone = (tool: string, aulaIds: string[]) =>
    aulaIds.reduce((acc, id) => (isFeita(tid(tool, id)) ? acc + 1 : acc), 0);

  return { map, toggle, isDone, countDone };
}

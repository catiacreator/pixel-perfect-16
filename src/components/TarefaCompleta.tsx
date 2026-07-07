import { CheckCircle2, Circle } from "lucide-react";
import { useProgresso } from "@/lib/use-progresso";
import { PONTOS_TAREFA, type TipoTarefa } from "@/lib/gamificacao";

// Botão reutilizável "Marcar tarefa como completa". Grava no servidor (por aluno)
// e soma pontos. Usar em cada unidade concluível (aula, etapa, item de celebração).
export default function TarefaCompleta({
  id,
  tipo = "etapa",
  className = "",
  full = false,
}: {
  id: string;
  tipo?: TipoTarefa;
  className?: string;
  full?: boolean;
}) {
  const { isFeita, marcar, carregado } = useProgresso();
  const feita = isFeita(id);
  const pts = PONTOS_TAREFA[tipo];

  return (
    <button
      type="button"
      onClick={() => marcar(id, tipo, !feita)}
      disabled={!carregado}
      aria-pressed={feita}
      className={`inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full border transition-colors disabled:opacity-50 ${
        full ? "w-full" : ""
      } ${
        feita
          ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
          : "bg-white border-border text-ink hover:border-terracotta"
      } ${className}`}
    >
      {feita ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      {feita ? "Tarefa completa" : "Marcar tarefa como completa"}
      <span className={`text-[11px] font-semibold ${feita ? "text-emerald-600/70" : "text-terracotta"}`}>
        +{pts}
      </span>
    </button>
  );
}

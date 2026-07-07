import { AlertTriangle, type LucideIcon } from "lucide-react";

// Caixa de confirmação com o visual da plataforma (substitui o window.confirm
// do browser). Usar sempre que uma ação precise de confirmação do utilizador.
export default function ConfirmDialog({
  open,
  titulo,
  descricao,
  confirmarLabel = "Confirmar",
  cancelarLabel = "Cancelar",
  tom = "perigo",
  Icone = AlertTriangle,
  onConfirmar,
  onCancelar,
}: {
  open: boolean;
  titulo: string;
  descricao?: React.ReactNode;
  confirmarLabel?: string;
  cancelarLabel?: string;
  tom?: "perigo" | "neutro";
  Icone?: LucideIcon;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  if (!open) return null;

  const perigo = tom === "perigo";
  const badge = perigo ? "bg-rose-50 text-rose-600" : "bg-terracotta/10 text-terracotta";
  const botao = perigo
    ? "bg-rose-600 text-white hover:bg-rose-700"
    : "bg-ink text-cream hover:bg-terracotta";

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4"
      onClick={onCancelar}
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${badge}`}>
          <Icone size={22} />
        </div>
        <h2 className="text-lg font-semibold text-ink">{titulo}</h2>
        {descricao && <p className="text-sm text-ink/60 mt-2 leading-relaxed">{descricao}</p>}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onCancelar}
            className="flex-1 h-11 rounded-full border border-[var(--color-border)] text-sm font-medium text-ink hover:bg-ink/5 transition-colors"
          >
            {cancelarLabel}
          </button>
          <button
            onClick={onConfirmar}
            className={`flex-1 h-11 rounded-full text-sm font-semibold transition-colors ${botao}`}
          >
            {confirmarLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

import { Link } from "@/lib/router-compat";
import { Wrench, ArrowLeft } from "lucide-react";

// Ecrã mostrado quando a rota atual está bloqueada ("Em breve"/manutenção) para
// o aluno — esconde o conteúdo da página (cards, etapas, aulas) e impede o acesso.
export default function EmManutencao() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5 py-16">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-5">
          <Wrench size={26} />
        </div>
        <h1 className="font-serif text-3xl text-ink mb-2">Em manutenção</h1>
        <p className="text-sm text-ink/60 leading-relaxed max-w-sm mx-auto">
          Esta secção está a ser preparada e fica disponível em breve. Continue a avançar pelo que já está aberto.
        </p>
        <Link
          to="/metodo"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors"
        >
          <ArrowLeft size={15} /> Voltar à Jornada
        </Link>
      </div>
    </div>
  );
}

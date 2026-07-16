import { Link } from "@/lib/router-compat";
import { Sparkles, ArrowUpRight } from "lucide-react";

// Acesso rápido ao Robot Cat.IA no menu do topo → abre a página "Assistente Cat.IA"
// (o acesso é controlado por turma/aluno lá dentro).
export default function CatIaTopButton() {
  return (
    <Link
      to="/metodo/pilar-2/redes-sociais?aba=assistente"
      title="Assistente Cat.IA"
      className="hidden md:inline-flex items-center gap-1.5 text-[13px] pl-3.5 pr-3 py-2 bg-terracotta text-cream rounded-full font-medium transition-all hover:-translate-y-0.5 active:scale-[0.97]"
    >
      <Sparkles size={13} strokeWidth={2.25} /> Cat.IA
      <ArrowUpRight size={13} strokeWidth={2.25} />
    </Link>
  );
}

import { Link } from "@/lib/router-compat";
import { ArrowLeft, Lock } from "lucide-react";
import { useAccess } from "@/lib/use-access";
// Manual completo (HTML autónomo) importado como texto cru e mostrado num iframe
// isolado, para não colidir com os estilos da app.
import html from "@/data/metodo-catia.html?raw";

export default function MetodoCatia() {
  const { isAdmin, loading } = useAccess();

  if (loading) {
    return <div className="min-h-dvh flex items-center justify-center text-ink/50">A verificar acesso…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-8 text-center">
        <div>
          <Lock size={28} className="mx-auto text-ink/30 mb-3" />
          <p className="text-ink/80 font-semibold">Página restrita</p>
          <p className="text-sm text-ink/50 mt-1">Só a administradora tem acesso a esta página.</p>
          <Link to="/" className="mt-4 inline-block text-sm font-semibold text-terracotta">Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full bg-white">
      <Link
        to="/"
        className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-black/85"
      >
        <ArrowLeft size={14} /> Voltar
      </Link>
      <iframe title="Método Cat.IA" srcDoc={html} className="h-full w-full border-0" />
    </div>
  );
}

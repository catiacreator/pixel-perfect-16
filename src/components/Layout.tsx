import { Link } from "@/lib/router-compat";
import { useLocation } from "@tanstack/react-router";
import { FileText, Mail } from "lucide-react";

const NAV = [
  { to: "/", label: "Trilha" },
  { to: "/metodo/consultoria-ia", label: "Robô" },
  { to: "/minha-base", label: "Base" },
  { to: "/skills", label: "Skills" },
  { to: "/profissionais", label: "Profissionais" },
  { to: "/buscar", label: "Buscar" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen w-full flex flex-col bg-cream">
      {/* Top meta strip */}
      <div className="w-full border-b border-border/70 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-2 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-muted">
          <span>Edição 001 · Método</span>
          <span className="hidden md:inline">Leveza · Clareza · Resultado</span>
          <span>PT · 2026</span>
        </div>
      </div>

      {/* Main header */}
      <header className="w-full border-b border-border/70 bg-cream sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-baseline gap-2 leading-none">
            <span className="font-serif text-2xl text-ink tracking-tight">Leveza</span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-muted">no Digital</span>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {NAV.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative text-[11px] tracking-[0.25em] uppercase transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-terracotta" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/doc-mestre"
              className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase px-4 py-2.5 border border-ink text-ink hover:bg-ink hover:text-cream transition-colors"
            >
              <FileText size={13} strokeWidth={1.5} /> Documento
            </Link>
            <Link
              to="/mensagens"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-ink hover:bg-ink hover:text-cream transition-colors"
            >
              <Mail size={14} strokeWidth={1.5} />
            </Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cream-warm to-terracotta border border-border" />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="w-full border-t border-border/70 mt-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-serif text-xl text-ink">Leveza no Digital</p>
            <p className="text-[11px] tracking-[0.25em] uppercase text-muted mt-1">
              Conteúdo que informa · Estratégia que conecta
            </p>
          </div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-muted">
            © 2026 · Transforme conhecimento em liberdade
          </p>
        </div>
      </footer>
    </div>
  );
}

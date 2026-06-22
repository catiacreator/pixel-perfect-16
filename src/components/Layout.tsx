import { Link } from "@/lib/router-compat";
import { useLocation } from "@tanstack/react-router";
import { FileText, Mail, Map, Bot, Database, Award, Users, Search, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Início", icon: Map },
  { to: "/metodo/consultoria-ia", label: "Assistente IA", icon: Bot },
  { to: "/minha-base", label: "Minha base", icon: Database },
  { to: "/skills", label: "Skills", icon: Award },
  { to: "/profissionais", label: "Profissionais", icon: Users },
  { to: "/buscar", label: "Buscar", icon: Search },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen w-full flex flex-col bg-cream">
      {/* Header */}
      <header className="w-full border-b border-border bg-cream sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 md:h-18 grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-baseline gap-2 leading-none shrink-0">
            <span className="font-serif text-2xl text-ink tracking-tight">Leveza</span>
            <span className="hidden sm:inline text-[10px] tracking-[0.35em] uppercase text-muted">
              no Digital
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center justify-center gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-ink text-cream"
                      : "text-ink/70 hover:text-ink hover:bg-cream-warm/50"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.75} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2 justify-end">
            <Link
              to="/doc-mestre"
              className="hidden md:inline-flex items-center gap-2 text-sm px-4 py-2 bg-terracotta text-cream rounded-md hover:bg-terracotta-dark transition-colors"
            >
              <FileText size={14} strokeWidth={1.75} /> Documento
            </Link>
            <Link
              to="/mensagens"
              className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-ink hover:bg-cream-warm/50 transition-colors"
              aria-label="Mensagens"
            >
              <Mail size={15} strokeWidth={1.75} />
            </Link>
            <div className="hidden sm:block w-10 h-10 rounded-full bg-gradient-to-br from-cream-warm to-terracotta border border-border shrink-0" />
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-10 h-10 rounded-md border border-border flex items-center justify-center text-ink"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="lg:hidden border-t border-border bg-cream px-5 py-3 flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm ${
                    active ? "bg-ink text-cream" : "text-ink hover:bg-cream-warm/50"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="w-full border-t border-border mt-16">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="font-serif text-lg text-ink">Leveza no Digital</p>
            <p className="text-xs text-muted mt-1">
              Transforme conhecimento em liberdade.
            </p>
          </div>
          <p className="text-xs text-muted text-right">© 2026</p>
        </div>
      </footer>
    </div>
  );
}

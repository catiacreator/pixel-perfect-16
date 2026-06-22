import { Link } from "@/lib/router-compat";
import { useLocation } from "@tanstack/react-router";
import { FileText, Mail, Map, Bot, Database, Award, Users, Search, Menu, X, ArrowUpRight } from "lucide-react";
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
    <div className="min-h-screen w-full flex flex-col bg-ink text-cream font-sans selection:bg-gold selection:text-ink">
      {/* Cabeçalho */}
      <header className="w-full sticky top-0 z-40 bg-ink/80 backdrop-blur-md border-b border-cream/10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 md:h-18 grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8">
          <Link to="/" className="flex items-center gap-2.5 leading-none shrink-0 group">
            <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_18px_2px_var(--color-gold)]" />
            <span className="font-serif text-[17px] tracking-tight text-cream">Leveza</span>
            <span className="hidden sm:inline text-[10px] tracking-[0.35em] uppercase text-cream/40">
              no Digital
            </span>
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-1">
            {NAV.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-3.5 py-2 rounded-full text-[12px] tracking-[0.12em] uppercase transition-all ${
                    active
                      ? "bg-cream/10 text-cream"
                      : "text-cream/50 hover:text-gold"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 justify-end">
            <Link
              to="/doc-mestre"
              className="hidden md:inline-flex items-center gap-1.5 text-[12px] tracking-[0.15em] uppercase pl-4 pr-3 py-2 bg-gold text-ink rounded-none font-semibold hover:bg-cream transition-colors"
            >
              <FileText size={13} strokeWidth={2.25} /> Documento
              <ArrowUpRight size={13} strokeWidth={2.25} />
            </Link>
            <Link
              to="/mensagens"
              className="w-10 h-10 rounded-full border border-cream/15 flex items-center justify-center text-cream/70 hover:border-gold hover:text-gold transition-colors"
              aria-label="Mensagens"
            >
              <Mail size={15} strokeWidth={1.75} />
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-10 h-10 rounded-full border border-cream/15 flex items-center justify-center text-cream"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-cream/10 bg-ink px-5 py-3 flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm ${
                    active ? "bg-cream/10 text-cream" : "text-cream/70 hover:bg-cream/5"
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

      <footer className="w-full border-t border-cream/10 mt-24">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <p className="font-serif text-base text-cream">Leveza no Digital</p>
            </div>
            <p className="text-xs text-cream/50 mt-2 max-w-sm">
              Transformar conhecimento em liberdade. Uma trilha guiada com Inteligência Artificial.
            </p>
          </div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-cream/40 text-right">
            © 2026 · v1.0
          </p>
        </div>
      </footer>
    </div>
  );
}

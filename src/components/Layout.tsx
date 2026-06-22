import { Link, useLocation } from "@/lib/router-compat";
import { FileText, Mail, Map, Sparkles, Database, Award, Users, Search } from "lucide-react";

const NAV = [
  { to: "/", label: "Trilha Rápida", icon: Map },
  { to: "/metodo/consultoria-ia", label: "Robô da Mentoria", icon: Sparkles },
  { to: "/minha-base", label: "Minha Base", icon: Database },
  { to: "/skills", label: "Skills", icon: Award },
  { to: "/profissionais", label: "Profissionais", icon: Users },
  { to: "/buscar", label: "Buscar", icon: Search },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isActive = (to: string) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));

  return (
    <div className="min-h-screen w-full flex flex-col bg-cream">
      <header className="w-full bg-forest text-cream">
        <div className="w-full px-5 md:px-8 py-3 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 bg-cream rounded-md px-3 py-2 flex flex-col items-center leading-none">
            <span className="text-[7px] tracking-[0.3em] text-ink/70">MENTORIA</span>
            <span className="font-serif font-semibold text-ink text-[13px] mt-0.5">PARAÍSO</span>
            <span className="font-serif font-semibold text-ink text-[13px] -mt-0.5">DIGITAL</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-end gap-7 flex-1 justify-center">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex flex-col items-center gap-1 text-xs ${active ? "text-gold" : "text-cream/85 hover:text-cream"}`}
                >
                  <Icon size={20} strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/doc-mestre"
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-gold text-ink font-medium hover:bg-gold/90 transition-colors"
            >
              <FileText size={15} /> Documento Mestre
            </Link>
            <Link
              to="/mensagens"
              className="w-9 h-9 rounded-full border border-cream/20 bg-forest-soft flex items-center justify-center text-cream"
            >
              <Mail size={15} />
            </Link>
            <div className="flex items-center gap-2 pl-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cream-warm to-terracotta border border-cream/20" />
              <span className="text-sm text-cream hidden lg:inline">Cátia Creator</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="w-full px-5 md:px-10 py-6 text-center text-xs text-muted">
        © Paraíso Digital · Seu ambiente de evolução
      </footer>
    </div>
  );
}

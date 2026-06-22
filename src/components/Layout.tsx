import { Link } from "react-router-dom";
import { FileText, Mail, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";

const NAV: { label: string; to?: string; href?: string; external?: boolean }[] = [
  { label: "Trilha Rápida", to: "/metodo" },
  { label: "Robô da Mentoria", href: "https://chat.openai.com", external: true },
  { label: "Minha Base", to: "/meus-projetos" },
  { label: "Skills", to: "/metodo/pilar-1/aprenda-ia/claude/instalar-skills" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [profOpen, setProfOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <header className="w-full px-5 md:px-10 py-3 flex items-center justify-between gap-4 flex-wrap border-b border-border bg-cream">
        <Link to="/" className="flex flex-col leading-none">
          <span className="text-[9px] tracking-[0.25em] text-muted">HISTÓRIA</span>
          <span className="font-serif font-semibold text-terracotta text-lg -mt-0.5">PARAÍSO DIGITAL</span>
        </Link>

        <nav className="flex items-center gap-1 flex-wrap">
          {NAV.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm px-3 py-1.5 rounded-full text-ink hover:bg-white transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to!}
                className="text-sm px-3 py-1.5 rounded-full text-ink hover:bg-white transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
          <div className="relative">
            <button
              onClick={() => setProfOpen((v) => !v)}
              className="text-sm px-3 py-1.5 rounded-full text-ink hover:bg-white transition-colors flex items-center gap-1"
            >
              Profissionais <ChevronDown size={13} />
            </button>
            {profOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-border rounded-xl shadow-sm overflow-hidden z-30 min-w-[200px]">
                <div className="px-4 py-2.5 text-sm hover:bg-cream cursor-pointer">Diretório de profissionais</div>
                <div className="px-4 py-2.5 text-sm hover:bg-cream cursor-pointer">Indicar um profissional</div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/doc-mestre"
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-border bg-white"
          >
            <FileText size={14} /> Doc Mestre
          </Link>
          <Link
            to="/mensagens"
            className="w-8 h-8 rounded-full border border-border bg-white flex items-center justify-center"
          >
            <Mail size={14} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-border" />
            <span className="text-sm hidden md:inline">Cátia Creator</span>
          </div>
          <Menu size={18} className="text-muted" />
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="w-full px-5 md:px-10 py-6 text-center text-xs text-muted border-t border-border">
        © Paraíso Digital · Seu ambiente de evolução
      </footer>
    </div>
  );
}

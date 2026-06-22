import { Link } from "@/lib/router-compat";
import { FileText, Mail, Menu } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-cream">
      <header className="w-full px-5 md:px-10 py-3 flex items-center justify-between gap-4 bg-cream">
        <Link to="/" className="flex flex-col leading-none">
          <span className="text-[8px] tracking-[0.25em] text-muted">MENTORIA</span>
          <span className="font-serif font-semibold text-terracotta text-base -mt-0.5">PARAÍSO</span>
          <span className="font-serif font-semibold text-terracotta text-base -mt-0.5">DIGITAL</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/doc-mestre"
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-border bg-white text-ink"
          >
            <FileText size={14} /> Doc Mestre
          </Link>
          <Link
            to="/mensagens"
            className="w-8 h-8 rounded-full border border-border bg-white flex items-center justify-center text-ink"
          >
            <Mail size={14} />
          </Link>
          <div className="flex items-center gap-2 ml-1">
            <div className="w-8 h-8 rounded-full bg-ink/80" />
            <span className="text-sm text-ink hidden sm:inline">Cátia Creator</span>
          </div>
          <button className="w-8 h-8 rounded-full border border-border bg-white flex items-center justify-center text-ink ml-1">
            <Menu size={16} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="w-full px-5 md:px-10 py-6 text-center text-xs text-muted">
        © Paraíso Digital · Seu ambiente de evolução
      </footer>
    </div>
  );
}


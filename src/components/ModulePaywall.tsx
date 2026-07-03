import { Link } from "@/lib/router-compat";
import { Lock, LogIn, ArrowLeft } from "lucide-react";
import { type ModuleKey } from "@/lib/access";

// Acesso é gerido pela mentora — quem não tem sessão é convidado a entrar.
export default function ModulePaywall(_props: { module: ModuleKey; signedIn: boolean }) {
  return (
    <div className="max-w-xl mx-auto px-5 py-16 md:py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-terracotta/12 text-terracotta flex items-center justify-center mx-auto mb-6">
        <Lock size={28} strokeWidth={1.75} />
      </div>
      <p className="text-[11px] tracking-[0.28em] uppercase text-terracotta font-semibold mb-2">Área reservada</p>
      <h1 className="font-display text-3xl md:text-4xl text-ink tracking-tight">Entre para aceder</h1>
      <p className="text-ink/60 mt-3 leading-relaxed">
        Este conteúdo é para alunas da <strong>Leveza no Digital</strong>. Entre com a sua conta para continuar.
        Ainda não tem acesso? Fale com a mentora.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 bg-terracotta text-cream px-6 py-3 rounded-full text-sm font-semibold hover:bg-terracotta-dark transition-colors"
        >
          <LogIn size={15} /> Entrar
        </Link>
        <Link
          to="/mensagens"
          className="inline-flex items-center gap-2 border border-[var(--color-border)] text-ink px-6 py-3 rounded-full text-sm font-semibold hover:bg-ink/5 transition-colors"
        >
          Falar com a mentora
        </Link>
      </div>

      <div className="mt-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-terracotta transition-colors">
          <ArrowLeft size={14} /> Voltar ao início
        </Link>
      </div>
    </div>
  );
}

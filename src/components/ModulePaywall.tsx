import { Link } from "@/lib/router-compat";
import { Lock, ArrowUpRight, LogIn, ArrowLeft } from "lucide-react";
import { CHECKOUT_URL, type ModuleKey } from "@/lib/access";

export default function ModulePaywall({ signedIn }: { module: ModuleKey; signedIn: boolean }) {
  return (
    <div className="max-w-xl mx-auto px-5 py-16 md:py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-terracotta/12 text-terracotta flex items-center justify-center mx-auto mb-6">
        <Lock size={28} strokeWidth={1.75} />
      </div>
      <p className="text-[11px] tracking-[0.28em] uppercase text-terracotta font-semibold mb-2">Acesso bloqueado</p>
      <h1 className="font-display text-3xl md:text-4xl text-ink tracking-tight">Leveza no Digital</h1>
      <p className="text-ink/60 mt-3 leading-relaxed">
        Garante o teu acesso completo à plataforma. Com a compra na Hotmart, desbloqueias <strong>tudo</strong> de
        uma vez — e o acesso liberta-se automaticamente para o teu email.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        {CHECKOUT_URL ? (
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-terracotta text-cream px-6 py-3 rounded-full text-sm font-semibold hover:bg-terracotta/90 transition-colors"
          >
            Comprar acesso <ArrowUpRight size={15} strokeWidth={2.25} />
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 bg-ink/10 text-ink/50 px-6 py-3 rounded-full text-sm font-semibold cursor-default">
            <Lock size={14} /> Em breve na Hotmart
          </span>
        )}

        {!signedIn && (
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 border border-[var(--color-border)] text-ink px-6 py-3 rounded-full text-sm font-semibold hover:bg-ink/5 transition-colors"
          >
            <LogIn size={15} /> Já comprei — entrar
          </Link>
        )}
      </div>

      <div className="mt-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-terracotta transition-colors">
          <ArrowLeft size={14} /> Voltar ao início
        </Link>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/lib/router-compat";
import { useState } from "react";
import { Check, KeyRound, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/registo 2")({
  head: () => ({ meta: [{ title: "Registo — Estúdio Creator" }] }),
  component: RegistoPage,
});

// Código de acesso partilhado com os alunos do Estúdio Creator.
const CODIGO = "IAVIRAL";

function traduzErro(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("already") || m.includes("registered")) return "Já existe uma conta com este e-mail. Entre em vez de criar.";
  if (m.includes("password")) return "A palavra-passe deve ter pelo menos 6 caracteres.";
  if (m.includes("email")) return "Verifique o e-mail introduzido.";
  return "Ocorreu um erro. Tente novamente.";
}

function RegistoPage() {
  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [feito, setFeito] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (codigo.trim().toUpperCase() !== CODIGO) {
      setErro("Código de acesso inválido. Confirme o código que a Cátia lhe enviou.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: nome }, emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      setFeito(true);
    } catch (err) {
      setErro(traduzErro(err instanceof Error ? err.message : ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-display relative overflow-hidden"
      style={{ background: "radial-gradient(130% 130% at 82% 16%, #F0A766 0%, #C8487E 55%, #2E7CB8 100%)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "24px 24px" }} />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-terracotta shadow-[0_0_18px_2px_var(--color-terracotta)]" />
          <span className="font-sans font-semibold text-[16px] tracking-tight text-ink leading-none">Cátia Creator</span>
        </div>

        {feito ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-sage/15 text-sage flex items-center justify-center mb-4"><Check size={26} /></div>
            <h1 className="text-2xl font-semibold text-ink">Conta criada! 🎉</h1>
            <p className="text-sm text-ink/60 mt-2 mb-6">Verifique o seu e-mail para confirmar a conta e depois entre.</p>
            <Link to="/auth" className="inline-flex items-center justify-center w-full py-3 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors">
              Ir para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-terracotta mb-2">
              <Sparkles size={13} /> Estúdio Creator
            </span>
            <h1 className="text-2xl font-semibold text-ink leading-tight">Boas-vindas aos Alunos<br />do Estúdio Creator</h1>
            <p className="text-sm text-ink/60 mt-1.5 mb-5">Insira o seu código de acesso e crie a sua conta.</p>

            <label className="text-xs text-ink/60 mb-1.5 block">Código de acesso</label>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-3 mb-3 focus-within:border-terracotta">
              <KeyRound size={15} className="text-ink/40" />
              <input value={codigo} onChange={(e) => setCodigo(e.target.value)} required placeholder="Código" autoCapitalize="characters"
                className="flex-1 py-3 text-sm outline-none bg-transparent tracking-[0.15em] uppercase" />
            </div>

            <label className="text-xs text-ink/60 mb-1.5 block">Nome</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="O seu nome"
              className="w-full rounded-xl border border-[var(--color-border)] p-3 text-sm outline-none focus:border-terracotta mb-3" />

            <label className="text-xs text-ink/60 mb-1.5 block">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="voce@email.com"
              className="w-full rounded-xl border border-[var(--color-border)] p-3 text-sm outline-none focus:border-terracotta mb-3" />

            <label className="text-xs text-ink/60 mb-1.5 block">Palavra-passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="mínimo 6 caracteres"
              className="w-full rounded-xl border border-[var(--color-border)] p-3 text-sm outline-none focus:border-terracotta mb-4" />

            {erro && <p className="text-sm text-terracotta mb-4">{erro}</p>}

            <button type="submit" disabled={loading} className="w-full py-3 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors disabled:opacity-60">
              {loading ? "A criar conta…" : "Criar conta"}
            </button>
            <p className="text-xs text-ink/50 mt-4 text-center">Já tem conta? <Link to="/auth" className="text-terracotta font-semibold">Entrar</Link></p>
          </form>
        )}
      </div>
    </div>
  );
}

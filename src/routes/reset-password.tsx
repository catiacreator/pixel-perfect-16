import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [pronto, setPronto] = useState(false); // sessão de recuperação ativa?
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  // O link do e-mail traz a sessão de recuperação — confirmamos que existe.
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setPronto(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (active && session) setPronto(true);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (password.length < 6) {
      setErro("A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setErro("As palavras-passe não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setOk(true);
      setTimeout(() => navigate({ to: "/" }), 1500);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível redefinir a palavra-passe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 font-display">
      <div className="w-full max-w-md bg-white border border-[var(--color-border)] rounded-2xl p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-terracotta shadow-[0_0_18px_2px_var(--color-terracotta)]" />
          <span className="font-sans font-semibold text-[16px] tracking-tight text-ink leading-none">Leveza no Digital</span>
        </div>

        <h1 className="text-2xl font-semibold text-ink">Nova palavra-passe</h1>
        <p className="text-sm text-ink/60 mt-1">Defina a sua nova palavra-passe para entrar.</p>

        {!pronto && !ok && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>
              Abra esta página através do link enviado para o seu e-mail. Se o link expirou,{" "}
              <button onClick={() => navigate({ to: "/auth" })} className="underline font-medium">
                peça um novo
              </button>
              .
            </span>
          </div>
        )}

        {erro && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {ok ? (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>Palavra-passe atualizada! A entrar…</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
            <input
              required
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nova palavra-passe"
              minLength={6}
              disabled={!pronto}
              className="h-11 px-4 rounded-full border border-[var(--color-border)] bg-cream text-sm text-ink disabled:opacity-50"
            />
            <input
              required
              type="password"
              autoComplete="new-password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Confirmar palavra-passe"
              minLength={6}
              disabled={!pronto}
              className="h-11 px-4 rounded-full border border-[var(--color-border)] bg-cream text-sm text-ink disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !pronto}
              className="h-11 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
            >
              {loading ? "A guardar..." : "Guardar nova palavra-passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

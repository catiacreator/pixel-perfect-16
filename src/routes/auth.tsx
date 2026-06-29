import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

/** Traduz as mensagens do Supabase para português, de forma clara. */
function traduzErro(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou palavra-passe incorretos.";
  if (m.includes("email not confirmed")) return "Confirme o seu e-mail antes de entrar (veja a caixa de entrada).";
  if (m.includes("user already registered") || m.includes("already registered")) return "Já existe uma conta com este e-mail. Tente entrar.";
  if (m.includes("password should be at least")) return "A palavra-passe deve ter pelo menos 6 caracteres.";
  if (m.includes("unable to validate email") || m.includes("invalid email")) return "E-mail inválido.";
  if (m.includes("rate limit") || m.includes("too many")) return "Demasiadas tentativas. Aguarde um momento e tente novamente.";
  return msg;
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session?.user) navigate({ to: "/" });
    });
    // Se a sessão aparecer (ex.: noutro separador), entra automaticamente.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (active && session?.user) navigate({ to: "/" });
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [navigate]);

  function trocarModo(m: Mode) {
    setMode(m);
    setErro(null);
    setInfo(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: nome },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setInfo("Conta criada! Já pode entrar.");
        setMode("signin");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setInfo("Enviámos um link para o seu e-mail. Abra-o para definir uma nova palavra-passe.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      }
    } catch (err) {
      setErro(traduzErro(err instanceof Error ? err.message : "Ocorreu um erro. Tente novamente."));
    } finally {
      setLoading(false);
    }
  }

  const titulo = mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Recuperar palavra-passe";
  const subtitulo =
    mode === "signin"
      ? "Acesse a sua jornada."
      : mode === "signup"
        ? "Comece a sua jornada em segundos."
        : "Indique o seu e-mail e enviamos um link para redefinir a palavra-passe.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 font-display">
      <div className="w-full max-w-md bg-white border border-[var(--color-border)] rounded-2xl p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-terracotta shadow-[0_0_18px_2px_var(--color-terracotta)]" />
          <span className="font-sans font-semibold text-[16px] tracking-tight text-ink leading-none">Leveza no Digital</span>
        </div>

        {mode === "forgot" && (
          <button
            onClick={() => trocarModo("signin")}
            className="inline-flex items-center gap-1.5 text-xs text-ink/60 hover:text-ink mb-3"
          >
            <ArrowLeft size={13} /> Voltar a entrar
          </button>
        )}

        <h1 className="text-2xl font-semibold text-ink">{titulo}</h1>
        <p className="text-sm text-ink/60 mt-1">{subtitulo}</p>

        {/* Mensagem de erro (visível) */}
        {erro && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{erro}</span>
          </div>
        )}
        {/* Mensagem de sucesso/informação */}
        {info && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>{info}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-6">
          {mode === "signup" && (
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="O seu nome"
              className="h-11 px-4 rounded-full border border-[var(--color-border)] bg-cream text-sm text-ink"
            />
          )}
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="h-11 px-4 rounded-full border border-[var(--color-border)] bg-cream text-sm text-ink"
          />
          {mode !== "forgot" && (
            <input
              required
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Palavra-passe"
              minLength={6}
              className="h-11 px-4 rounded-full border border-[var(--color-border)] bg-cream text-sm text-ink"
            />
          )}

          {mode === "signin" && (
            <button
              type="button"
              onClick={() => trocarModo("forgot")}
              className="self-end -mt-1 text-xs text-terracotta hover:text-terracotta-dark font-medium"
            >
              Esqueceu a palavra-passe?
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors disabled:opacity-50"
          >
            {loading
              ? "Aguarde..."
              : mode === "signin"
                ? "Entrar"
                : mode === "signup"
                  ? "Criar conta"
                  : "Enviar link de recuperação"}
          </button>
        </form>

        {mode !== "forgot" && (
          <button
            onClick={() => trocarModo(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-center text-xs text-ink/60 hover:text-ink"
          >
            {mode === "signin" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
          </button>
        )}
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/pending")({
  ssr: false,
  component: PendingPage,
});

function PendingPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("approved")
        .eq("id", data.user.id)
        .maybeSingle();
      if (profile?.approved) {
        navigate({ to: "/" });
        return;
      }
      setChecking(false);
    });
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 font-display">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-terracotta shadow-[0_0_18px_2px_var(--color-terracotta)]" />
          <span className="font-sans font-semibold text-[16px] tracking-tight text-ink leading-none">Leveza</span>
          <span className="font-sans font-semibold text-[16px] tracking-tight text-ink leading-none">no Digital</span>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-10">
          <div className="mx-auto mb-6 w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
          </div>
          <h1 className="text-2xl font-semibold text-ink">Acesso pendente</h1>
          <p className="text-sm text-ink/60 mt-3 leading-relaxed">
            {checking
              ? "A verificar o seu acesso…"
              : "O seu pedido foi recebido. Aguarda que a mentora aprove o seu perfil — receberás um aviso assim que estiveres dentro."}
          </p>

          <button
            onClick={handleLogout}
            className="mt-8 text-xs text-ink/60 hover:text-ink transition-colors"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
}

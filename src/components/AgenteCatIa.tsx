import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, ExternalLink, Sparkles, KeyRound, Loader2, Lock } from "lucide-react";
import { useCatIaConfig } from "@/lib/cat-ia";
import { podeUsarAgente } from "@/lib/admin.functions";

const AGENTE_ID = "cat-ia";

// Cartão que apresenta o Cat.IA no ChatGPT (link + palavra-passe da config).
function CartaoChatGPT() {
  const catIa = useCatIaConfig();
  return (
    <div className="overflow-hidden rounded-2xl border border-terracotta/25 bg-white">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta">
          <Sparkles size={22} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">Também no ChatGPT</p>
          <h3 className="mt-0.5 font-serif text-xl text-ink">O teu Cat.IA no ChatGPT</h3>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink/70">
            O mesmo método Cat.IA, agora como um agente no ChatGPT. Escreves-lhe em linguagem normal
            (“cria um Reel sobre X”, “uma legenda para vender Y”) e ele devolve tudo pronto a publicar — na tua voz.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "Ganchos que travam o scroll",
              "Legendas no método PAS (Problema → Agitação → Solução)",
              "Roteiros de Reels de 30–60s",
              "Carrosséis escritos slide a slide",
              "Sequências de stories para vender no Direct",
              "Ideias e planos de conteúdo",
            ].map((t) => (
              <div key={t} className="flex items-start gap-2 text-[13.5px] text-ink/75">
                <Check size={15} className="mt-0.5 shrink-0 text-terracotta" /> {t}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-terracotta/15 bg-terracotta/[0.04] px-4 py-3 text-[13px] leading-relaxed text-ink/65">
            <strong className="text-ink/80">Como funciona:</strong> abre o Cat.IA, diz o tema ou o formato,
            e pede ajustes à vontade (“mais curto”, “outro gancho”, “mais próximo”). Precisa de conta ChatGPT
            (a gratuita funciona; sem limites no ChatGPT Plus).
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href={catIa.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream hover:bg-terracotta-dark transition-colors"
            >
              <Sparkles size={15} /> Abrir o Cat.IA no ChatGPT <ExternalLink size={14} />
            </a>
            {catIa.password && (
              <span className="inline-flex items-center gap-1.5 text-[12.5px] text-ink/60">
                <KeyRound size={13} className="text-terracotta" /> palavra-passe: <b className="text-ink/80 tracking-wide">{catIa.password}</b>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// O acesso é controlado em /admin/cat-ia (por turma/aluno). Aqui só se verifica.
export default function AgenteCatIa() {
  const check = useServerFn(podeUsarAgente);
  const [estado, setEstado] = useState<{ pode: boolean; admin: boolean } | null>(null);

  useEffect(() => {
    let vivo = true;
    check({ data: { agente: AGENTE_ID } })
      .then((r) => { if (vivo) setEstado(r as { pode: boolean; admin: boolean }); })
      .catch(() => { if (vivo) setEstado({ pode: false, admin: false }); });
    return () => { vivo = false; };
  }, [check]);

  if (!estado) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-ink/50">
        <Loader2 size={18} className="animate-spin" /> A carregar…
      </div>
    );
  }

  if (!estado.pode && !estado.admin) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta">
          <Lock size={22} />
        </span>
        <h3 className="mb-1 font-serif text-xl text-ink">Assistente Cat.IA</h3>
        <p className="text-[15px] text-ink/60">
          Este assistente está disponível para turmas selecionadas. Fala com a Cátia para teres acesso.
        </p>
      </div>
    );
  }

  return <CartaoChatGPT />;
}

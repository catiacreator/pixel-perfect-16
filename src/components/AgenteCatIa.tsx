import { Check, ExternalLink, Sparkles } from "lucide-react";

const CAT_IA_CHATGPT_URL = "https://chatgpt.com/g/g-6a56643a8dbc8191a122f9580a3e7edf-cat-ia";

// Cartão que apresenta o Cat.IA no ChatGPT: o que tem, como funciona e o botão.
// Aberto a todos (é só um link para o agente no ChatGPT).
export default function AgenteCatIa() {
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

          <a
            href={CAT_IA_CHATGPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream hover:bg-terracotta-dark transition-colors"
          >
            <Sparkles size={15} /> Abrir o Cat.IA no ChatGPT <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PilarBreadcrumb from "../components/PilarBreadcrumb";
import { LayoutGrid, Copy, Check, ArrowUpRight } from "lucide-react";

// Reúne todos os carrosséis do Plano de Posts numa caixa só-de-leitura, pronta
// a copiar, para a aluna criar as artes no Carousel Snap ou no carrossel.studio.

const PLANO_KEY = "leveza.plano-conteudo.v1";
const CAROUSELSNAP = "https://carouselsnap.app/";
const CARROSSELSTUDIO = "https://carrossel.studio/";

type PostPlano = { id: string; tipo: string; titulo: string; conteudo: string; data?: string };

function lerCarrosseis(): PostPlano[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PLANO_KEY);
    const p = raw ? JSON.parse(raw) : null;
    const posts: PostPlano[] = Array.isArray(p?.posts) ? p.posts : [];
    return posts.filter((x) => /carross/i.test(x.tipo || ""));
  } catch {
    return [];
  }
}

function montarTexto(cs: PostPlano[]): string {
  return cs
    .map((c, i) => `━━━━━━ CARROSSEL ${i + 1}${c.titulo ? ` · ${c.titulo}` : ""} ━━━━━━\n\n${(c.conteudo || "").trim()}`)
    .join("\n\n\n");
}

export default function CriarCarrosseis() {
  const [carrosseis, setCarrosseis] = useState<PostPlano[]>([]);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const carregar = () => setCarrosseis(lerCarrosseis());
    carregar();
    window.addEventListener("leveza:hydrated", carregar);
    return () => window.removeEventListener("leveza:hydrated", carregar);
  }, []);

  const texto = montarTexto(carrosseis);

  const copiar = async () => {
    if (!texto) return;
    try {
      await navigator.clipboard?.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* fallback silencioso */
    }
  };

  return (
    <Layout>
      <PilarBreadcrumb
        pilar="redes"
        pilarLabel="Plano de Posts"
        backTo="/metodo/pilar-2/redes-sociais?aba=plano"
        backLabel="Voltar ao plano"
      />
      <div className="px-5 md:px-10 py-8 max-w-3xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-terracotta/12 text-terracotta flex items-center justify-center shrink-0">
            <LayoutGrid size={20} />
          </span>
          <div>
            <h1 className="font-serif text-2xl text-ink leading-tight">Criar no Carousel Snap</h1>
            <p className="text-xs text-ink/50">Todos os carrosséis do teu Plano Estratégico, prontos a copiar.</p>
          </div>
        </div>

        {/* Como criar */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-ink/70 leading-relaxed mb-4">
            Copia os teus carrosséis (em baixo) e cria as artes no <b>Carousel Snap</b>:
          </p>
          <a
            href={CAROUSELSNAP}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 rounded-2xl border border-border bg-white p-4 hover:border-terracotta/50 hover:shadow-sm transition-all"
          >
            <span className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: "#F26B21" }}>
              <LayoutGrid size={20} />
            </span>
            <span className="min-w-0">
              <span className="text-[15px] font-bold text-ink flex items-center gap-1">
                Carousel Snap <ArrowUpRight size={14} className="text-ink/30 group-hover:text-terracotta transition-colors" />
              </span>
              <span className="block text-[12.5px] text-ink/55 leading-relaxed mt-0.5">Cria carrosséis com IA, Express ou vê os teus.</span>
            </span>
          </a>
          <div className="mt-4 rounded-xl border border-border bg-cream-warm/25 p-4">
            <p className="text-[12.5px] font-semibold text-ink mb-2">É a mesma ferramenta, com duas formas de usar:</p>
            <ul className="space-y-1.5 text-[12.5px] text-ink/70 leading-relaxed">
              <li className="flex gap-2"><span className="text-terracotta font-bold shrink-0">·</span><span><b>Criador de Carrosséis</b> — colas <b>um carrossel de cada vez</b> e crias post a post.</span></li>
              <li className="flex gap-2"><span className="text-terracotta font-bold shrink-0">·</span><span><b>CarouselStudio</b> (<a href={CARROSSELSTUDIO} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted text-terracotta">carrossel.studio</a>) — colas <b>todos os carrosséis de uma vez</b> e crias tudo de uma só vez.</span></li>
            </ul>
          </div>
        </div>

        {/* Caixa só-de-leitura com todos os carrosséis */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <p className="text-sm font-semibold text-ink">Os teus carrosséis ({carrosseis.length})</p>
            <button
              onClick={copiar}
              disabled={!texto}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-1.5 rounded-full bg-ink text-cream hover:bg-terracotta transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copiado ? <Check size={14} /> : <Copy size={14} />} {copiado ? "Copiado!" : "Copiar tudo"}
            </button>
          </div>
          {carrosseis.length === 0 ? (
            <p className="text-sm text-ink/55 py-8 text-center">
              Ainda não há carrosséis no teu plano. Gera o Plano Estratégico e importa-o primeiro (no Plano de Posts).
            </p>
          ) : (
            <textarea
              readOnly
              value={texto}
              onFocus={(e) => e.currentTarget.select()}
              rows={18}
              className="w-full text-xs bg-cream rounded-xl p-3 leading-relaxed text-ink/80 border border-border resize-y font-mono outline-none focus:border-terracotta"
            />
          )}
          <p className="text-[11px] text-ink/45 mt-2">Só de leitura — usa o botão “Copiar tudo” e cola no Carousel Snap.</p>
        </div>
      </div>
    </Layout>
  );
}

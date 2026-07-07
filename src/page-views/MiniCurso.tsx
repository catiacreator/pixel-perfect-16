import Layout from "../components/Layout";
import { Link } from "@/lib/router-compat";
import { Sparkles, ArrowRight, Lock, PlayCircle } from "lucide-react";
import PromptCard from "../components/PromptCard";

// Mini-curso "Conteúdo com IA" — porta de entrada grátis. Aulas curtas e prompts
// prontos (sem Documento Mestre), a mostrar o valor da plataforma para dar
// vontade de entrar no método completo.

const AULAS = [
  {
    n: 1,
    titulo: "O que postar (mesmo sem ideias)",
    desc: "Um prompt para receber 3 ideias de post prontas em segundos.",
    prompt: `Você é o meu estrategista de conteúdo para Instagram. Antes de responder, pergunte-me em 1 linha qual é o meu nicho e o meu público. Depois, dê-me 3 ideias de post para esta semana (1 Reel, 1 carrossel, 1 Stories), cada uma com: tema, gancho (0–3s) e objetivo (atrair, dar autoridade ou vender). Fale de forma simples e direta, sem termos vagos.`,
  },
  {
    n: 2,
    titulo: "O teu primeiro Reel em 30 segundos",
    desc: "Roteiro simples, fácil de gravar hoje.",
    prompt: `Crie um roteiro de Reel de até 30 segundos para o meu Instagram. Primeiro pergunte-me o tema em 1 linha. Depois entregue: 3 opções de gancho (0–3s) que fazem parar o scroll, um desenvolvimento curto (3 falas diretas) e 1 chamada para ação clara. Acrescente 1 linha de texto para pôr no ecrã. Linguagem simples.`,
  },
  {
    n: 3,
    titulo: "Legenda que prende (método PAS)",
    desc: "Problema → Agitação → Solução, numa legenda que gera salvamentos.",
    prompt: `Escreva 3 versões de legenda para um post de Instagram, no método PAS (Problema → Agitação → Solução). Pergunte-me primeiro o tema e a dor do público. Cada versão: 1ª linha = gancho que corta o scroll; 2–4 linhas de valor; chamada para ação final (comentar, guardar ou chamar no Direct). Sem promessas exageradas.`,
  },
];

export default function MiniCurso() {
  return (
    <Layout>
      <div className="theme-roxo">
        {/* Hero */}
        <section className="px-5 md:px-10 pt-10 md:pt-14 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.24em] uppercase text-terracotta font-semibold mb-3">
            <Sparkles size={13} /> Mini-curso · grátis
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight mb-3">
            Conteúdo com IA
          </h1>
          <p className="text-ink/60 leading-relaxed max-w-2xl">
            Uma amostra do método: aulas curtas e prompts prontos para criares conteúdo com
            Inteligência Artificial e publicares com consistência — sem travar antes de começar.
          </p>
        </section>

        {/* Vídeo de boas-vindas */}
        <section className="px-5 md:px-10 pt-8 max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-border bg-ink/90 aspect-video flex items-center justify-center text-cream">
            <div className="text-center">
              <PlayCircle size={40} className="mx-auto mb-2 opacity-80" />
              <p className="text-sm opacity-80">Boas-vindas ao mini-curso (2 min)</p>
            </div>
          </div>
        </section>

        {/* Aulas */}
        <section className="px-5 md:px-10 pt-10 max-w-4xl mx-auto">
          <h2 className="font-serif text-xl text-ink mb-1.5">As tuas 3 primeiras aulas</h2>
          <p className="text-sm text-ink/55 mb-5">Copia o prompt, cola no ChatGPT e adapta ao teu perfil.</p>
          {AULAS.map((a) => (
            <PromptCard
              key={a.n}
              numero={a.n}
              titulo={`Aula ${a.n} — ${a.titulo}`}
              descricao={a.desc}
              prompt={a.prompt}
              rotuloBotao="Copiar prompt"
              icon={<Sparkles size={18} />}
              cor="#7C56C9"
              botaoCor="#7C56C9"
            />
          ))}
        </section>

        {/* CTA — desejar entrar */}
        <section className="px-5 md:px-10 py-12 max-w-4xl mx-auto">
          <div className="rounded-3xl border border-terracotta/25 bg-gradient-to-br from-terracotta/8 to-cream p-7 md:p-9 text-center">
            <Lock size={22} className="mx-auto text-terracotta mb-3" />
            <h2 className="font-serif text-2xl md:text-3xl text-ink mb-2">Gostaste? Isto é só o início.</h2>
            <p className="text-ink/60 max-w-xl mx-auto leading-relaxed mb-6">
              No método completo tens <b>30 dias de conteúdo</b> gerados por ti, o teu
              <b> Documento Mestre</b>, a <b>Cat.IA adaptada a ti</b>, o Plano de Posts e a
              competição mensal. Tudo o que precisas para crescer com consistência.
            </p>
            <Link
              to="/protocolo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors"
            >
              Quero o método completo <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Zap, Trophy, Flame, ArrowRight, CalendarDays } from "lucide-react";
import PromptCard from "./PromptCard";

// 30 posts em 30 dias — a aluna usa a Cat.IA adaptada a ela (Documento Mestre)
// para gerar um mês inteiro de conteúdo, depois organiza no Plano de Posts.

const POSTS_KEY = "leveza.posts-publicados.v1";
const META = 30;

const PROMPT_30 = `🎯 DESAFIO: 30 POSTS EM 30 DIAS

Você é o meu estrategista de conteúdo para Instagram. Use SEMPRE o meu contexto e fale na minha voz.

📋 MEU CONTEXTO (Documento Mestre)
- Nome: [nome]
- Especialidade: [profissao]
- O que faço: [o_que_faz]
- Como resolvo: [como_resolve]
- Público: [publico]
- Dores do público:
[dores_lista]
- Promessa: [promessa]
- Tom de voz: [tom_de_voz]

🗓️ TAREFA
Monte um plano de 30 posts para 30 dias (1 por dia), pronto a publicar. Equilibre o funil ao longo do mês:
- Reels para ATRAIR (novos seguidores)
- Carrosséis para DOUTRINAR (autoridade)
- Stories para CONVERTER (vendas)
Faça um rodízio dos 3 objetivos (autoridade, seguidores, vendas), sempre ligados às minhas dores do público.

Para CADA dia (1 a 30), entregue numa linha, neste formato:
Dia N — [Formato: Reel / Carrossel / Stories] — [Objetivo] — Tema: … — Gancho: …

No fim, escolha os 4 posts com maior potencial do mês e desenvolva-os por completo (gancho, desenvolvimento e CTA).

Regras: fale na minha voz; números concretos em vez de vagos; nunca use "fórmula mágica", "segredo revelado" nem "guia definitivo"; não invente resultados.`;

export default function Desafio30Dias() {
  const [publicados, setPublicados] = useState(0);

  useEffect(() => {
    const read = () => { const n = Number(localStorage.getItem(POSTS_KEY)); setPublicados(Number.isFinite(n) ? n : 0); };
    read();
    window.addEventListener("focus", read);
    return () => window.removeEventListener("focus", read);
  }, []);

  const pct = Math.min(100, Math.round((publicados / META) * 100));
  const restante = Math.max(0, META - publicados);

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="rounded-2xl border border-terracotta/25 bg-terracotta/5 p-6">
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-2">
          <Zap size={13} /> Desafio
        </span>
        <h2 className="font-serif text-2xl md:text-3xl text-ink mb-2">30 posts em 30 dias</h2>
        <p className="text-sm text-ink/65 leading-relaxed max-w-2xl">
          A consistência é o que faz a conta crescer. Neste desafio, a Cat.IA — <b>adaptada a si</b> pelo seu Documento
          Mestre — gera um mês inteiro de conteúdo de uma só vez. Você organiza no Plano de Posts e publica 1 por dia.
        </p>
      </div>

      {/* Progresso */}
      <div className="rounded-2xl border border-border bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-ink inline-flex items-center gap-2"><Flame size={16} className="text-terracotta" /> O seu progresso</p>
          <p className="text-sm font-bold text-ink tabular-nums">{publicados} / {META}</p>
        </div>
        <div className="h-2.5 rounded-full bg-cream-warm/70 overflow-hidden">
          <div className="h-full bg-terracotta transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-ink/55 mt-2.5">
          {publicados >= META
            ? "🎉 Desafio concluído! 30 posts publicados."
            : `Faltam ${restante} posts. Cada post publicado no Plano conta — e vale +15 pontos nas Vitórias.`}
        </p>
      </div>

      {/* Passo 1 — gerar */}
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Passo 1 · Gerar o mês</p>
        <h3 className="font-serif text-xl text-ink mb-1.5">Gere os 30 posts com a Cat.IA</h3>
        <p className="text-sm text-ink/60 leading-relaxed max-w-2xl mb-4">
          Copie o prompt (já vem preenchido com o seu Documento Mestre), cole no ChatGPT e receba os 30 dias de conteúdo na sua voz.
        </p>
        <PromptCard
          titulo="Plano de 30 posts (adaptado a si)"
          descricao="1 post por dia, com rodízio de formatos e objetivos, ligado às suas dores do público."
          prompt={PROMPT_30}
          rotuloBotao="Copiar prompt do desafio"
        />
      </div>

      {/* Passo 2 — organizar */}
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Passo 2 · Organizar & publicar</p>
        <h3 className="font-serif text-xl text-ink mb-1.5">Leve para o Plano de Posts</h3>
        <p className="text-sm text-ink/60 leading-relaxed max-w-2xl mb-4">
          Cole o resultado no Plano de Posts, agende cada dia e, à medida que publica, cole o link. O seu progresso do desafio atualiza aqui.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/metodo/pilar-2/redes-sociais?aba=plano" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors">
            <CalendarDays size={15} /> Ir para o Plano de Posts
          </Link>
          <Link to="/conquistas" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-ink text-sm font-semibold hover:border-terracotta/50 transition-colors">
            <Trophy size={15} /> Ver as minhas Vitórias
          </Link>
        </div>
      </div>

      <Link to="/metodo/pilar-2/redes-sociais?aba=formatos" className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:text-terracotta-dark transition-colors">
        Rever os formatos de conteúdo <ArrowRight size={14} />
      </Link>
    </div>
  );
}

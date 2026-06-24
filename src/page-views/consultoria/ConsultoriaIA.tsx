import { useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PillarHeader from "../../components/PillarHeader";
import {
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Calendar,
  DollarSign,
  Megaphone,
  ClipboardList,
  Users,
  Copy,
  Check,
} from "lucide-react";

const PROMPT_EVENTO = `Você é uma especialista em consultoria de Inteligência Artificial e vai me ajudar a planejar um evento de IA nos negócios do zero.

Vamos trabalhar em duas fases:

---
FASE 1 — PLANEJAMENTO COMPLETO DO EVENTO
---

Primeiro, me faça as perguntas abaixo uma a uma, esperando minha resposta antes de avançar:

1. Qual é o seu nome e qual é o seu nicho ou área de atuação?
2. Qual é o público-alvo que você quer atingir com esse evento? (ex: donos de pequenas empresas, profissionais de RH, empreendedoras digitais…)
3. Qual formato você prefere? (presencial, online ao vivo, gravado, híbrido — pode ser mais de um)
4. Você já tem uma data ou período em mente? Se sim, qual? Quantas horas ou dias duraria o evento?
5. Qual é o seu objetivo principal com o evento? (ex: gerar leads, vender uma oferta, cobrar ingresso, construir autoridade, fazer parceria com empresas)
6. Você pretende cobrar ingresso? Se sim, qual faixa de valor você imagina? Se gratuito, qual será a oferta no final do evento?
7. Qual é o seu orçamento estimado para produção e divulgação? (pode ser R$ 0 por enquanto)
8. Quais ferramentas de IA você domina e pretende ensinar ou demonstrar no evento?
9. Você já realizou algum evento antes, ou será o primeiro?

Depois que eu responder tudo, crie para mim:

✅ TÍTULO e SUBTÍTULO do evento
✅ DESCRIÇÃO para divulgação (2 parágrafos)
✅ ESTRUTURA DO EVENTO (blocos com horários sugeridos)
✅ PRECIFICAÇÃO estratégica (ingresso, early bird, lote, gratuito + oferta)
✅ PLANO DE DIVULGAÇÃO em 3 semanas (com ações por semana)
✅ CHECKLIST DE PRODUÇÃO (o que preciso preparar)
✅ PITCH FINAL DO EVENTO (o que falar nos últimos 15 minutos para vender ou converter)

---
FASE 2 — PREPARAÇÃO ANTES DA APRESENTAÇÃO
---

Quando eu pedir, me ajude com:
- Roteiro detalhado da apresentação
- Slides sugeridos (títulos e o que mostrar em cada um)
- Respostas para objeções comuns do público
- Abertura com storytelling (história pessoal que conecta com o tema)
- Chamada para ação irresistível no fechamento

Pode começar pela Fase 1 agora — faça a primeira pergunta!`;

const DELIVERABLES = [
  { icon: Calendar, label: "Estrutura completa do evento", sub: "blocos, horários e dinâmica" },
  { icon: DollarSign, label: "Precificação estratégica", sub: "ingresso, early bird, lotes" },
  { icon: Megaphone, label: "Plano de divulgação", sub: "3 semanas de ações práticas" },
  { icon: ClipboardList, label: "Checklist de produção", sub: "tudo que precisa preparar" },
  { icon: Users, label: "Pitch final do evento", sub: "como fechar com autoridade" },
  { icon: Sparkles, label: "Roteiro com storytelling", sub: "abertura que conecta e converte" },
];

function CopiarPrompt() {
  const [copiado, setCopiado] = useState(false);
  function copiar() {
    navigator.clipboard?.writeText(PROMPT_EVENTO);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  }
  return (
    <button
      onClick={copiar}
      className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border border-[var(--color-border)] hover:bg-ink/5 transition-colors text-ink/70"
    >
      {copiado ? <Check size={14} className="text-terracotta" /> : <Copy size={14} />}
      {copiado ? "Copiado!" : "Copiar prompt"}
    </button>
  );
}

export default function ConsultoriaIA() {
  return (
    <Layout>
      <PillarHeader
        numeral="★"
        icon={<Briefcase size={18} />}
        pilarLabel="Caminho Especial"
        titulo="Consultoria de"
        tituloHighlight="Inteligência Artificial"
        subtitulo="para quem quer atender empresas e profissionais"
      />

      <div className="px-5 md:px-10 py-10 max-w-4xl mx-auto space-y-6">
        {/* Intro */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 space-y-3 text-sm text-ink/80 leading-relaxed">
          <p>
            Esse caminho é pra quem quer atender empresas e profissionais aplicando Inteligência Artificial no negócio deles, em vez de criar produto digital próprio.
          </p>
          <p>
            É um caminho paralelo aos 4 Pilares — vários mentorados do Paraíso já fizeram essa transição com sucesso.
          </p>
          <p>
            Você reaproveita tudo que aprendeu nos Pilares (Doc Mestre, autoridade, método, vendas) e aplica em formato B2B.
          </p>
        </div>

        {/* Como começar */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl border border-terracotta/40 bg-cream-warm text-terracotta flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-terracotta font-medium">Comece por aqui</p>
              <p className="font-display text-xl tracking-[0.04em] uppercase text-ink">Como Começar Agora</p>
            </div>
          </div>
          <p className="text-sm text-ink/70 mb-4">
            Use a skill <strong className="text-ink">"consultor-ia-para-nicho"</strong> no Claude. Ela te conduz por uma sessão guiada que te ajuda a estruturar sua oferta de consultoria de IA: público-alvo, entregáveis, diagnóstico, plano de implementação, precificação e proposta comercial.
          </p>
          <Link
            to="/metodo/consultoria-ia/como-usar"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta/90 transition-colors"
          >
            Como instalar a skill <ArrowRight size={14} />
          </Link>
        </div>

        {/* Planeje seu evento */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl border border-terracotta/40 bg-cream-warm text-terracotta flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-terracotta font-medium">Ferramenta Prática</p>
              <p className="font-display text-xl tracking-[0.04em] uppercase text-ink">Planeje seu Evento de IA</p>
            </div>
          </div>
          <p className="text-sm text-ink/70 mb-6">
            Eventos presenciais ou online de IA para empresas são uma das formas mais rápidas de gerar renda e autoridade B2B. Use este prompt no ChatGPT para planejar tudo do zero.
          </p>

          {/* Deliverables grid */}
          <p className="text-[10px] tracking-[0.22em] uppercase text-terracotta font-semibold mb-3">O que você vai criar</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {DELIVERABLES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 border border-[var(--color-border)] rounded-xl p-3">
                <Icon size={16} className="text-terracotta shrink-0" />
                <div>
                  <p className="text-sm font-medium text-ink">{label}</p>
                  <p className="text-xs text-ink/55">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Como usar */}
          <div className="rounded-xl bg-cream-warm/60 border border-[var(--color-border)] p-4 mb-6">
            <p className="text-sm font-semibold text-ink mb-3">Como usar</p>
            <ol className="space-y-2">
              {[
                <>Copie o prompt abaixo e abra o <strong>ChatGPT</strong></>,
                <>Crie um novo <strong>Projeto</strong> chamado "Evento de IA" (botão + à esquerda)</>,
                <>Cole o prompt e responda as perguntas — o ChatGPT monta tudo para você</>,
                <>Quando tiver o plano pronto, volte ao projeto para ajustar e preparar a apresentação (Fase 2)</>,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink/80">
                  <span className="w-6 h-6 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Prompt */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-ink">Prompt — Planejador de Evento de IA</p>
            <CopiarPrompt />
          </div>
          <pre className="text-xs bg-cream-warm/60 border border-[var(--color-border)] rounded-xl p-4 whitespace-pre-wrap text-ink/70 leading-relaxed max-h-64 overflow-y-auto">
            {PROMPT_EVENTO}
          </pre>
        </div>
      </div>
    </Layout>
  );
}

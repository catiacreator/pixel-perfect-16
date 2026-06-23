import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PromptStep from "../../components/PromptStep";
import { Briefcase, ArrowRight, ArrowLeft } from "lucide-react";

export default function ConsultoriaIA() {
  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl border border-terracotta text-terracotta flex items-center justify-center">
            <Briefcase size={18} />
          </div>
          <p className="text-xs tracking-[0.15em] uppercase text-muted">Caminho especial</p>
        </div>
        <h1 className="font-serif text-3xl text-ink mb-2">Consultoria de Inteligência Artificial</h1>
        <p className="italic text-muted mb-6">para quem quer transformar IA em serviço premium.</p>

        <div className="rounded-2xl border border-border bg-white p-5 mb-6">
          <p className="font-serif text-lg text-ink mb-2">Planejador de Evento de IA para Negócios</p>
          <p className="text-sm text-muted mb-4">
            Estrutura completa para vender e entregar um workshop, GPT Day ou imersão presencial de IA aplicada a
            negócios — do convite ao roteiro do dia.
          </p>
          <PromptStep
            numero={1}
            titulo="Planejador de Evento de IA"
            descricao="Gera a estrutura completa de um evento de IA para negócios — Fase 1 (planeamento) + Fase 2 (preparação da apresentação)."
            prompt={`Você é uma especialista em consultoria de Inteligência Artificial e vai me ajudar a planejar um evento de IA nos negócios do zero.

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

Pode começar pela Fase 1 agora — faça a primeira pergunta!`}
          />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link to="/metodo" className="flex items-center gap-1.5 text-sm text-muted">
            <ArrowLeft size={14} /> Voltar para a Trilha
          </Link>
          <Link to="/metodo/consultoria-ia/como-usar" className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta">
            Como instalar a skill <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

import { useState } from "react";
import { Link, useSearchParams } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import PromptStep from "../../components/PromptStep";
import ColarResultado from "../../components/ColarResultado";
import TodoBanner from "../../components/TodoBanner";
import { ArrowRight, Smartphone } from "lucide-react";

const TABS = [
  { id: "modelos", label: "Modelos de Posts" },
  { id: "linha", label: "Linha Editorial" },
  { id: "calendario", label: "Calendário Editorial" },
  { id: "bio", label: "Bio" },
  { id: "projeto", label: "Projeto de Post" },
  { id: "agendar", label: "Como agendar" },
];

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function RedesSociais() {
  const [params, setParams] = useSearchParams();
  const aba = params.get("aba") || "modelos";
  const [formato, setFormato] = useState<"reels" | "estatico" | null>(null);

  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2" backLabel="Voltar para o Pilar 2" />
      <TodoBanner texto="Etapa 4 — conteúdo pendente. Aguardando documentação detalhada de Redes Sociais (prompts, calendário, modelos)." />
      <div className="px-5 md:px-10 py-10 max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Redes Sociais</h1>
        <p className="italic text-muted mb-6">Comece pelos modelos de posts e depois entre nas redes.</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setParams({ aba: t.id })}
              className={`text-sm px-4 py-1.5 rounded-full border ${aba === t.id ? "bg-ink text-cream border-ink" : "border-border text-ink"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {aba === "modelos" && (
          <>
            <div className="mb-6"><VideoPlaceholder label="Criando carrosséis com IA: como ajustar e refinar seus posts" /></div>
            <Link to="/metodo/pilar-2/redes-sociais?aba=linha" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">
              Ir para Linha Editorial <ArrowRight size={15} />
            </Link>
          </>
        )}

        {aba === "linha" && (
          <>
            <p className="text-xs tracking-[0.15em] uppercase text-muted mb-2">Passo 1 — Antes de gerar</p>
            <h2 className="font-serif text-xl text-ink mb-3">Você vai aparecer em vídeo?</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => setFormato("reels")} className={`rounded-xl border p-4 text-left ${formato === "reels" ? "border-terracotta" : "border-border"}`}>
                <p className="text-sm font-semibold text-ink mb-1">Apareço em Reels</p>
                <p className="text-xs text-muted">Gravo vídeo — quero Reels no calendário</p>
              </button>
              <button onClick={() => setFormato("estatico")} className={`rounded-xl border p-4 text-left ${formato === "estatico" ? "border-terracotta" : "border-border"}`}>
                <p className="text-sm font-semibold text-ink mb-1">Prefiro posts estáticos</p>
                <p className="text-xs text-muted">Carrossel e imagem única — sem precisar aparecer</p>
              </button>
            </div>
            {!formato && <p className="text-xs text-terracotta mb-4">⚠️ Escolha um formato para o prompt ser gerado corretamente.</p>}
            <PromptStep numero={6} titulo="Crie sua linha editorial" descricao="Prompt personalizado com o teu Documento Mestre." prompt="Com base no meu Documento Mestre e na minha escolha de formato (Reels ou posts estáticos), cria a minha linha editorial: 5 a 7 categorias de conteúdo recorrentes, cada uma com objetivo e exemplos de tema." />
            <ColarResultado label="Cole o que a IA te devolveu" />
          </>
        )}

        {aba === "calendario" && (
          <>
            <h2 className="font-serif text-xl text-ink mb-2">Defina o tema de cada dia da semana</h2>
            <p className="text-sm text-muted mb-4">Use a tua linha editorial pra distribuir os temas pelos dias.</p>
            <div className="flex gap-2 mb-6">
              <button className="text-xs font-semibold text-terracotta">✨ Preencher calendário automaticamente</button>
            </div>
            <div className="space-y-4">
              {DIAS.map((dia) => (
                <div key={dia} className="rounded-2xl border border-border bg-white p-4">
                  <p className="font-serif text-lg text-ink mb-2">{dia}</p>
                  <input placeholder="Tema — ex: [BASTIDOR] Conexão" className="w-full rounded-xl border border-border p-2 text-sm mb-2" />
                  <select className="w-full rounded-xl border border-border p-2 text-sm mb-2">
                    <option>Selecione o formato…</option>
                    <option>Carrossel</option>
                    <option>Reels</option>
                    <option>Post único</option>
                  </select>
                  <input placeholder="Story do dia" className="w-full rounded-xl border border-border p-2 text-sm" />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <button className="text-sm px-4 py-2 rounded-full border border-border">Zerar calendário</button>
              <button className="text-sm px-4 py-2 rounded-full border border-border">Baixar PDF</button>
              <Link to="/metodo/pilar-2/redes-sociais?aba=bio" className="text-sm px-4 py-2 rounded-full bg-ink text-cream">Ir para a próxima fase: Bio</Link>
            </div>
          </>
        )}

        {aba === "bio" && (
          <>
            <div className="mb-6"><VideoPlaceholder label="Como criar sua bio do Instagram com ChatGPT" /></div>
            <PromptStep numero={7} titulo="Crie sua bio do Instagram" descricao="3 versões de bio prontas para escolher." prompt="Com base no meu Documento Mestre, cria 3 versões de bio para o meu Instagram — cada uma com tom diferente, mas sempre clara sobre o que faço e para quem." />
            <ColarResultado label="Cole a bio que você escolheu" />
            <p className="text-sm font-semibold text-ink mt-4 mb-2">Meu Instagram já tem bio</p>
            <div className="flex gap-2">
              <button className="text-sm px-4 py-1.5 rounded-full border border-border">Sim</button>
              <button className="text-sm px-4 py-1.5 rounded-full border border-border">Não</button>
            </div>
          </>
        )}

        {aba === "projeto" && (
          <>
            <div className="mb-6"><VideoPlaceholder label="Como criar seu agente de conteúdo com IA" /></div>
            <div className="rounded-2xl border border-border bg-white p-5">
              <p className="font-serif text-lg text-ink mb-2">Seu assistente de conteúdo no ChatGPT</p>
              <p className="text-sm text-muted mb-3">
                Configura um projeto no ChatGPT com toda a tua identidade — ele cria carrosséis, roteiros de Reels e
                stories no teu tom, sem precisares de explicar tudo de novo.
              </p>
              <div className="flex gap-2">
                <button className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border">Baixar PDF</button>
                <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-ink text-cream">Copiar instrução</button>
              </div>
            </div>
          </>
        )}

        {aba === "agendar" && (
          <div className="rounded-2xl border border-border bg-white p-5 text-center">
            <Smartphone size={24} className="mx-auto mb-3 text-terracotta" />
            <p className="text-sm text-muted mb-4">Agora que tudo está pronto, é hora de publicar no Instagram.</p>
            <Link to="/metodo/pilar-2/redes-sociais/instagram" className="text-sm font-semibold text-terracotta">
              Ir para Instagram →
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

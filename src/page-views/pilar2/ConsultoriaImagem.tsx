import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import PromptCard from "../../components/PromptCard";
import { ArrowRight, Shirt, Scissors, AlertCircle } from "lucide-react";
import {
  PROMPT_CONSULTORIA_ROUPAS,
  PROMPT_CONSULTORIA_CABELO,
} from "@/data/prompts/pilar2-tom-visual";

export default function ConsultoriaImagem() {
  return (
    <Layout>
      <PilarBreadcrumb
        pilar={2}
        pilarLabel="Criar Autoridade"
        backTo="/metodo/pilar-2/identidade"
        backLabel="Voltar para Identidade de Marca"
      />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">
          Etapa 3.4 · Consultoria de Imagem
        </p>
        <h1 className="font-serif text-3xl text-ink mb-2">Consultoria de Imagem</h1>
        <p className="italic text-muted mb-6">
          Estudo Visual completo: seu estilo pessoal e o cabelo que valoriza sua presença nos vídeos.
        </p>
        <p className="text-sm text-muted mb-8">
          O que você veste e como está seu cabelo comunicam antes de você falar. Aqui você tem dois
          estudos especializados: um focado no seu estilo pessoal (roupas, cores, acessórios) e outro
          focado no cabelo (cortes, cores, cuidados) — tudo pensado para você brilhar na câmera.
        </p>

        {/* Comando 1 — Roupas */}
        <div className="rounded-2xl border border-border bg-white p-5 mb-5">
          <div className="flex items-start gap-3 mb-3">
            <span className="w-9 h-9 rounded-xl border border-terracotta text-terracotta flex items-center justify-center flex-shrink-0">
              <Shirt size={16} />
            </span>
            <div>
              <p className="font-serif text-lg text-ink">
                Comando 1 — Estudo Visual (Roupas, Cores e Acessórios)
              </p>
              <p className="text-sm text-muted">
                ChatGPT analisa sua foto, entende seu estilo e entrega looks prontos pra gravar.
              </p>
            </div>
          </div>
          <p className="text-xs text-muted mb-3">
            Cole no ChatGPT. O prompt vai pedir uma foto sua (selfie ou corpo inteiro) antes de fazer
            as perguntas — isso é necessário para a análise de biotipo e caimento. Anexe pelo ícone 📎.
          </p>
          <PromptCard
            titulo="Estudo Visual de Roupas"
            prompt={PROMPT_CONSULTORIA_ROUPAS}
            rotuloBotao="Copiar prompt"
          />
          <p className="flex items-start gap-2 text-[11px] text-muted">
            <AlertCircle size={12} className="mt-0.5 flex-shrink-0 text-terracotta" />
            O final deste prompt (Looks 2 e 3) ainda não foi adicionado — pendente do envio da
            documentação completa.
          </p>
        </div>

        {/* Comando 2 — Cabelo */}
        <div className="rounded-2xl border border-border bg-white p-5 mb-8">
          <div className="flex items-start gap-3 mb-3">
            <span className="w-9 h-9 rounded-xl border border-terracotta text-terracotta flex items-center justify-center flex-shrink-0">
              <Scissors size={16} />
            </span>
            <div>
              <p className="font-serif text-lg text-ink">
                Comando 2 — Estudo de Cabelo (Cortes, Cores e Cuidados)
              </p>
              <p className="text-sm text-muted">
                ChatGPT analisa sua foto e entrega um estudo completo do cabelo pra brilhar em vídeo.
              </p>
            </div>
          </div>
          <PromptCard
            titulo="Estudo de Cabelo"
            prompt={PROMPT_CONSULTORIA_CABELO}
            rotuloBotao="Copiar prompt"
          />
          <p className="flex items-start gap-2 text-[11px] text-muted">
            <AlertCircle size={12} className="mt-0.5 flex-shrink-0 text-terracotta" />
            Conteúdo deste prompt pendente — aguardando documentação.
          </p>
        </div>

        <div className="rounded-2xl border border-terracotta bg-white p-5 text-center">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próximo passo</p>
          <p className="font-serif text-lg text-ink mb-3">Redes Sociais</p>
          <Link
            to="/metodo/pilar-2/redes-sociais"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
          >
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

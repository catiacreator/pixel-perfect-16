import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import VideoPlaceholder from "../../components/VideoPlaceholder";
import PromptStep from "../../components/PromptStep";
import ColarResultado from "../../components/ColarResultado";
import TodoBanner from "../../components/TodoBanner";
import { ArrowRight, Smartphone, Copy, Check, ChevronDown, ClipboardPaste } from "lucide-react";

const BIO_STORAGE_KEY = "leveza.bio.v1";
const BIO_CONQUISTA_KEY = "leveza.bio.conquista.v1";

const PROMPT_BIO = `Você é especialista em copywriting para Instagram de profissionais autônomos.

DADOS DA PROFISSIONAL:
Nome: Cátia Creator
Profissão: especialista em IA e criação de conteudo
O que faz: Ensino iniciantes e empreendedores a criar conteúdo com Inteligência Artificial por meio de uma comunidade com aulas gravadas. Ajudo a sair do zero até publicar e captar leads com consistência.
Como resolve: Aulas gravadas on‑demand com passo a passo, templates, prompts de Inteligência Artificial, checklists e tutoriais. Comunidade ativa para dúvidas e feedback em grupo, com trilhas do zero ao primeiro calendário de conteúdo e automações básicas. Sucesso medido por crescimento do perfil e leads gerados, sem promessa de prazo fixo.
Público: Iniciantes e empreendedores que querem começar a produzir conteúdo e usar Inteligência Artificial para crescer no Instagram e outras redes, incluindo micro e pequenos negócios em fase inicial.
Dores do público: Eu não sei usar Inteligência Artificial para criar conteúdo. | Eu não sei o básico do Instagram para começar. | Eu não sei por onde começar meu calendário de posts.
Desejos do público: Quero dominar ferramentas de Inteligência Artificial de forma simples. | Quero crescer seguidores qualificados de forma consistente. | Quero gerar leads a partir do meu conteúdo.
Posicionamento: Eu ajudo iniciantes, empreendedores e pequenos negócios a criar conteúdo com IA para crescer nas redes e captar leads, solucionando a falta de clareza, tempo e consistência, por meio de uma comunidade com aulas gravadas, templates, prompts, checklists, tutoriais e feedback em grupo.
Método/diferencial: Leveza no Digital — Cria conteúdo com IA, publica com consistência e capta leads sem complicar.
Tom de voz: Escreva como quem mostra o próximo passo, não como quem despeja uma aula inteira.
Use palavras simples como processo, clareza, consistência, publicar e leads.
Mostre exemplos concretos antes de explicar a teoria.
Fale da Inteligência Artificial como apoio prático para sair do bloqueio, não como assunto técnico.

TAREFA: Crie 3 versões de bio para o Instagram de Cátia Creator.

Cada bio deve ter no máximo 150 caracteres no total (limite do Instagram).
Use emojis com moderação — só se combinar com o tom dela.

BIO 1 — Foco no resultado que entrega:
(quem é + o que entrega + CTA ou link)

BIO 2 — Foco na dor/desejo do público:
(fala diretamente com a dor/desejo + quem ela ajuda + CTA)

BIO 3 — Foco no posicionamento/método:
(o diferencial dela + para quem + próximo passo)

REGRAS:
- Direto ao ponto, sem floreios
- Linguagem da mulher que ela é (arquétipo: Sábia)
- CTA pode ser: "Link abaixo", "Me chama no DM", "Baixe grátis" etc.
- NÃO use: "apaixonada por", "especialista em ajudar", "mãe e", "sempre amei"`;

function BioPasso1() {
  const [copiado, setCopiado] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  function copiar() {
    navigator.clipboard?.writeText(PROMPT_BIO);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 mb-4">
      <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-1">Passo 1 — Gere com Inteligência Artificial</p>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-serif text-xl text-ink">Crie sua bio do Instagram</h3>
          <p className="text-sm text-ink/55 mt-1 leading-relaxed">
            Copie o prompt abaixo, cole no ChatGPT e receba 3 versões de bio prontas para você escolher a melhor.
          </p>
        </div>
        <button
          onClick={copiar}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          {copiado ? <Check size={14} /> : <Copy size={14} />}
          {copiado ? "Copiado!" : "Copiar prompt"}
        </button>
      </div>
      <button
        onClick={() => setMostrar(v => !v)}
        className="w-full flex items-center justify-between text-sm text-ink/50 hover:text-ink transition-colors border-t border-[var(--color-border)] pt-3"
      >
        <span>Ver prompt completo</span>
        <span className="flex items-center gap-1 text-xs tracking-[0.1em] uppercase font-semibold text-ink/40">
          {mostrar ? "Ocultar" : "Mostrar"}
          <ChevronDown size={13} className={`transition-transform ${mostrar ? "rotate-180" : ""}`} />
        </span>
      </button>
      {mostrar && (
        <pre className="mt-3 text-xs bg-[#F5EFE6] rounded-xl p-4 whitespace-pre-wrap text-ink/60 leading-relaxed">
          {PROMPT_BIO}
        </pre>
      )}
    </div>
  );
}

function BioPasso2() {
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setBio(localStorage.getItem(BIO_STORAGE_KEY) || "");
  }, []);

  function handleChange(v: string) {
    setBio(v);
    localStorage.setItem(BIO_STORAGE_KEY, v);
    setSaved(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 mb-4">
      <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-1">Passo 2 — Cole e salve sua bio</p>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0">
          <ClipboardPaste size={18} />
        </div>
        <div>
          <h3 className="font-serif text-xl text-ink">Cole a bio que você escolheu</h3>
          <p className="text-sm text-ink/55 mt-0.5 leading-relaxed">
            Depois de gerar no ChatGPT, cole aqui a versão que mais combina com você. Ficará salva para consultar quando precisar.
          </p>
        </div>
      </div>
      <textarea
        rows={4}
        value={bio}
        onChange={e => handleChange(e.target.value)}
        placeholder="Cole aqui sua bio escolhida..."
        className="w-full rounded-xl border border-[var(--color-border)] p-4 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-terracotta transition-colors resize-none bg-[#FDFAF6]"
      />
      <p className="text-xs text-ink/35 mt-1.5">
        {saved ? "✓ Salvo" : "Suas alterações são salvas automaticamente"}
      </p>
    </div>
  );
}

function BioConquista() {
  const [resposta, setResposta] = useState<"sim" | "nao" | null>(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(BIO_CONQUISTA_KEY);
    if (v === "sim" || v === "nao") setResposta(v);
  }, []);

  function marcar(v: "sim" | "nao") {
    const anterior = resposta;
    setResposta(v);
    localStorage.setItem(BIO_CONQUISTA_KEY, v);
    if (v === "sim" && anterior !== "sim") {
      setToast(true);
      setTimeout(() => setToast(false), 3500);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 mb-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 mb-1">Conquista</p>
        <h3 className="font-serif text-xl text-ink mb-1">Meu Instagram já tem bio</h3>
        <p className="text-sm text-ink/55 mb-4 leading-relaxed">
          Marque "Sim" quando sua bio estiver publicada no Instagram. Isso conta como uma conquista na sua trilha.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => marcar("sim")}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium border transition-colors ${resposta === "sim" ? "bg-ink text-cream border-ink" : "border-[var(--color-border)] text-ink hover:border-ink"}`}
          >
            {resposta === "sim" && <Check size={13} />} Sim
          </button>
          <button
            onClick={() => marcar("nao")}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${resposta === "nao" ? "bg-ink text-cream border-ink" : "border-[var(--color-border)] text-ink hover:border-ink"}`}
          >
            Não
          </button>
        </div>
        {resposta === "sim" && (
          <p className="mt-3 text-sm text-terracotta font-medium">✨ Conquista desbloqueada — sua bio está no ar!</p>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-ink text-cream px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-in slide-in-from-bottom-4">
          <Check size={15} className="text-green-400" />
          Conquista registrada: você já tem sua bio! ✨
        </div>
      )}
    </>
  );
}

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
      <div className="px-5 md:px-10 py-10 max-w-4xl mx-auto">
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
            <BioPasso1 />
            <BioPasso2 />
            <BioConquista />
            <div className="flex justify-end">
              <Link
                to="/metodo/pilar-2/redes-sociais?aba=projeto"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors"
              >
                Ir para a próxima fase: Projeto de Posts <ArrowRight size={15} />
              </Link>
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

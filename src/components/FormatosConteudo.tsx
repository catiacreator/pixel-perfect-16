import { useState } from "react";
import { Link, useSearchParams } from "@/lib/router-compat";
import { Film, Sparkles, MessageCircle, LayoutGrid, ArrowRight, ArrowUpRight, Bot, ImageIcon, Mic, Check, X as XIcon } from "lucide-react";
import { agenteUrl } from "@/lib/agentes-catia";
import VideoPlaceholder from "./VideoPlaceholder";

// Formatos de Conteúdo — a navegação entre formatos é feita pelo submenu da
// barra lateral (Roteiros simples · Reels virais · Carrosséis · Stories).
// Cada formato mostra o vídeo (onde a Cátia explica), os exemplos e o agente
// Cat.IA correspondente. O formato "Reels virais" tem, além disso, um menu de
// separadores com os vários modelos de Reel (Oi nome, Faria/Não faria, Leia a
// legenda, etc.), cada um com o seu vídeo e exemplos.
// Base: manual dos 5 agentes cat.ia + funil (Reels atraem → Carrossel doutrina → Stories convertem → Direct fecha).

type Formato = {
  id: string;
  icon: typeof Film;
  nome: string;
  etapa: string;
  cor: string;
  agente: string;
  resumo: string;
  como: string;
  ideal: string;
};

const FORMATOS: Formato[] = [
  {
    id: "roteiros", icon: Mic, nome: "Yap Content", etapa: "Topo · atrair + ligação", cor: "#2E7CB8",
    agente: "ChatGPT",
    resumo: "Falar solto para a câmara. A tua presença é o conteúdo.",
    como: "Não te dá um texto para ler — dá-te um esqueleto para falar em cima: gancho falado, uma ideia só, gatilho de história, o teu ângulo e o convite. O objetivo é gravares hoje, na tua voz, sem produção. Volume acima de perfeição.",
    ideal: "Quando queres aparecer todos os dias, construir autoridade e ligação, e aquecer a audiência antes de vender.",
  },
  {
    id: "reels", icon: Sparkles, nome: "Reels virais", etapa: "Topo · atrair + reter", cor: "#C8487E",
    agente: "cat.ia — Criação de Reels Virais",
    resumo: "Versão avançada do roteiro, focada em retenção. Vários modelos de Reel para escolher.",
    como: "Entrega 4 opções de gancho (curiosidade, lado negativo, identificação, desejo vs. problema) e 2 de desenvolvimento, com o CTA \"me segue aí\" colocado a MEIO do vídeo e um fecho abrupto que segura até ao fim.",
    ideal: "Quando o objetivo é alcance e novos seguidores.",
  },
  {
    id: "carrossel", icon: LayoutGrid, nome: "Carrosséis que vendem", etapa: "Meio · doutrinar", cor: "#9E7FEC",
    agente: "cat.ia — Criação de Posts que Vendem (Carrossel)",
    resumo: "Educa, gera salvamento e prepara a venda.",
    como: "Cria carrosséis de 6 a 9 slides (capa/gancho → miolo com uma ideia por slide → virada → CTA), com 2 opções de capa, legenda em PAS e hashtags. Prova domínio e gera salvamento — sem vender direto.",
    ideal: "Quando quer construir autoridade e ser guardado.",
  },
  {
    id: "stories", icon: MessageCircle, nome: "Stories que vendem", etapa: "Fundo · converter", cor: "#F0A766",
    agente: "cat.ia — Criação de Stories que Vendem",
    resumo: "Levam o seguidor aquecido a chamar no Direct.",
    como: "Faz 3 perguntas antes de criar (nicho/avatar, dor/oferta, prova/palavra-chave). Depois monta 5 stories (identificação → agitação técnica → prova → quebra de objeção → convite) e um roteiro de Direct que abre com diagnóstico, nunca com preço.",
    ideal: "Quando quer transformar audiência em conversas de venda.",
  },
];

// Modelos de Reel — só aparecem no formato "Reels virais".
// Baseados nos formatos da skill cat.ia (Reels virais) + modelos que a Cátia usa.
type ReelModelo = { id: string; nome: string; resumo: string; como: string; ideal: string };

const REELS_MODELOS: ReelModelo[] = [
  {
    id: "oi-nome",
    nome: "Oi, [nome]",
    resumo: "Abre a olhar para a câmara e fala direto ao teu avatar.",
    como: "Começa o Reel a olhar para a câmara: «Oi, [o teu avatar — ex.: quem quer aprender a usar IA]…» e fala como se fosse para uma só pessoa. Quem se identifica sente que é com ela e para o scroll. Depois entrega 1 ideia ou dica curta e um CTA.",
    ideal: "Criar proximidade e prender quem se identifica logo no 1.º segundo.",
  },
  {
    id: "faria-nao-faria",
    nome: "Faria / Não faria",
    resumo: "Contraste entre o que farias e o que nunca farias sobre um tema.",
    como: "Divide o Reel em dois lados: o que EU FARIA e o que EU NÃO FARIA sobre [tema]. O contraste mostra o teu ponto de vista, educa e gera comentários de quem concorda ou discorda. Usa texto na tela a separar os dois lados.",
    ideal: "Mostrar autoridade e gerar opinião e comentários.",
  },
  {
    id: "leia-legenda",
    nome: "Leia a legenda",
    resumo: "Reel curto de ~6s — o gancho está na tela, o conteúdo na legenda.",
    como: "Reel de ~6 segundos: nos primeiros 3s uma cena curiosa + gancho escrito na tela; nos últimos 3s «Leia a legenda 👇». O conteúdo completo vai na legenda (motivo para salvar → valor em parágrafos curtos → CTA).",
    ideal: "Levar o seguidor a ler a legenda e a salvar o Reel.",
  },
  {
    id: "narracao",
    nome: "Narração (história)",
    resumo: "Contas uma história que prende do início ao fim.",
    como: "Estrutura: gancho (3s) → identificação → conflito → solução → CTA. Narras por cima de imagens ou a olhar para a câmara. É o formato que mais gera partilha porque a pessoa quer saber como acaba.",
    ideal: "Engajamento e partilha.",
  },
  {
    id: "atracao",
    nome: "Atração de seguidores",
    resumo: "Gancho direto + 3 passos práticos + «me segue».",
    como: "Gancho direto (quem + problema) → 3 passos práticos e rápidos → CTA «me segue para a parte 2 / para mais». Formato objetivo para atrair seguidores qualificados que querem aprender contigo.",
    ideal: "Ganhar novos seguidores qualificados.",
  },
  {
    id: "opiniao",
    nome: "Opinião",
    resumo: "Gancho provocador + o teu ponto de vista forte.",
    como: "Gancho provocador → 3 a 5 «takes» com a tua opinião e direção de cena (o que dizes, onde estás, o que fazes) → CTA. Assumes uma posição clara — é o que faz viralizar e atrair quem pensa como tu.",
    ideal: "Viralizar com um ponto de vista forte.",
  },
  {
    id: "infografico",
    nome: "Infográfico narrado",
    resumo: "Explicas o teu método sobre um infográfico desenhado à mão.",
    como: "Geras um infográfico (estilo quadro branco desenhado à mão) e narras por cima, explicando cada bloco. Montas no CapCut com o infográfico de fundo e tu num recorte no canto. Ideal para explicar algo que o público tem dificuldade em entender.",
    ideal: "Explicar visualmente uma parte do teu método.",
  },
];

// Teoria do Yap Content — os ingredientes + regras de ouro, antes do gerador.
const YAP_INGREDIENTES = [
  { n: "1", t: "Gancho falado (0–3s)", d: "Make or break. Uma opinião forte, uma dor, ou algo que corta o scroll. Não é só o que dizes — é como o dizes." },
  { n: "2", t: "Uma ideia só", d: "Um yap, um ponto. Se tens três ideias, tens três vídeos. A dispersão mata a retenção." },
  { n: "3", t: "História ou exemplo", d: "Dá carne à ideia: um caso, um \"no outro dia…\". É aqui que se cria a ligação." },
  { n: "4", t: "A tua opinião / a virada", d: "O teu ângulo, o que ninguém está a dizer. É isto que te dá autoridade." },
  { n: "5", t: "Convite (CTA)", d: "Leve, não agressivo. Um pedido claro, um só: \"segue para a parte 2\", \"guarda isto\"." },
];
const YAP_OURO = [
  "Olha para a lente, não para ti no ecrã — é assim que crias contacto visual.",
  "Energia um pouco acima do teu normal — a câmara \"come\" energia.",
  "Cadência e pausas fazem metade do trabalho. Não corras.",
  "Publica antes de estares pronta — o cringe desaparece com a prática.",
];
const YAP_ERROS = [
  "Ler um guião (ouve-se logo e mata a naturalidade).",
  "Enrolar nos primeiros segundos sem gancho.",
  "Meter ideias a mais.",
  "Energia morta ou monótona.",
  "Desistir aos 5 vídeos porque \"ninguém viu\".",
];

function YapTeoria() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-1.5">O que é</p>
        <p className="text-sm text-ink/75 leading-relaxed">
          Yap é falar. Pegas no telemóvel, olhas para a lente como quem olha para uma amiga, e despejas uma ideia
          com convicção — sem guião decorado, sem produção. Funciona porque as pessoas não seguem edições,
          <b> seguem pessoas</b>. Quando falas solto, a tua cadência e a tua energia constroem confiança em segundos.
        </p>
      </div>

      <div>
        <p className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-2.5">Os 5 ingredientes de um bom yap (≈60s)</p>
        <div className="space-y-2">
          {YAP_INGREDIENTES.map((i) => (
            <div key={i.n} className="flex gap-3 rounded-xl border border-border bg-cream-warm/25 p-3">
              <span className="w-6 h-6 rounded-full bg-[#2E7CB8]/12 text-[#2E7CB8] text-[12px] font-bold flex items-center justify-center shrink-0">{i.n}</span>
              <div>
                <p className="text-[13.5px] font-semibold text-ink">{i.t}</p>
                <p className="text-[12.5px] text-ink/60 leading-relaxed">{i.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-2">Regras de ouro</p>
          <ul className="space-y-1.5">
            {YAP_OURO.map((r) => (
              <li key={r} className="flex gap-2 text-[12.5px] text-ink/70 leading-relaxed">
                <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" /> {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-2">Erros a evitar</p>
          <ul className="space-y-1.5">
            {YAP_ERROS.map((r) => (
              <li key={r} className="flex gap-2 text-[12.5px] text-ink/70 leading-relaxed">
                <XIcon size={14} className="text-rose-500 shrink-0 mt-0.5" /> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-[12.5px] text-ink/55 italic">
        Equipamento não é desculpa — um telemóvel e um mini-micro chegam. Volume acima de perfeição.
      </p>
    </div>
  );
}

function ExemplosGrid({ bg }: { bg: string }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`aspect-[4/5] rounded-xl border border-dashed border-border ${bg} flex flex-col items-center justify-center gap-1.5 text-ink/35`}>
          <ImageIcon size={20} />
          <span className="text-[11px]">Exemplo {i + 1}</span>
        </div>
      ))}
    </div>
  );
}

function ReelsModelos({ cor }: { cor: string }) {
  const [modelo, setModelo] = useState(REELS_MODELOS[0].id);
  const m = REELS_MODELOS.find((x) => x.id === modelo) || REELS_MODELOS[0];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-2">Modelos de Reel</p>
        <div className="flex gap-2 flex-wrap">
          {REELS_MODELOS.map((x) => {
            const on = x.id === modelo;
            return (
              <button
                key={x.id}
                onClick={() => setModelo(x.id)}
                className={`text-[13px] px-3.5 py-1.5 rounded-full border transition-colors ${on ? "text-cream border-transparent" : "bg-white border-border text-ink hover:border-terracotta/50"}`}
                style={on ? { background: cor } : undefined}
              >
                {x.nome}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-cream-warm/25 p-4 space-y-4">
        <div>
          <h4 className="text-base font-semibold text-ink">{m.nome}</h4>
          <p className="text-sm text-ink/55 mt-0.5">{m.resumo}</p>
        </div>

        <VideoPlaceholder label={`Vídeo — Reel "${m.nome}"`} />

        <div>
          <p className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-1.5">Como funciona</p>
          <p className="text-sm text-ink/75 leading-relaxed mb-2">{m.como}</p>
          <p className="text-[13px] text-ink/60"><b className="text-ink/80">Ideal:</b> {m.ideal}</p>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-2">Exemplos</p>
          <ExemplosGrid bg="bg-white/60" />
          <p className="text-[11px] text-ink/40 mt-2">Espaço reservado — coloque aqui prints/exemplos deste modelo de Reel.</p>
        </div>
      </div>
    </div>
  );
}

export default function FormatosConteudo() {
  const [params] = useSearchParams();
  const fmt = params.get("fmt");
  const ativo = FORMATOS.some((x) => x.id === fmt) ? (fmt as string) : FORMATOS[0].id;
  const f = FORMATOS.find((x) => x.id === ativo) || FORMATOS[0];
  const Icon = f.icon;

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink/60 leading-relaxed max-w-2xl">
        Antes de criar, conheça os <b>formatos</b>. Escolha cada um no <b>menu ao lado</b> — cada um tem um papel no
        funil e um <b>agente Cat.IA</b> próprio, com o <b>vídeo</b> onde eu explico e <b>exemplos</b>. Depois, em <b>Criar
        Conteúdo</b>, escolhe o formato e usa o agente.
      </p>

      {/* Funil */}
      <div className="rounded-2xl border border-terracotta/25 bg-terracotta/5 p-4">
        <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-2">O funil do conteúdo</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[13px] text-ink/80">
          <b>Reels atraem</b> <ArrowRight size={13} className="text-ink/30" />
          <b>Carrosséis doutrinam</b> <ArrowRight size={13} className="text-ink/30" />
          <b>Stories convertem</b> <ArrowRight size={13} className="text-ink/30" />
          <b>Direct fecha</b>
        </div>
      </div>

      {/* Painel do formato ativo (o formato é escolhido no submenu da barra lateral) */}
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        {/* cabeçalho */}
        <div className="flex items-center gap-3.5 p-5 border-b border-border">
          <span className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${f.cor}1a`, color: f.cor }}>
            <Icon size={22} />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-ink">{f.nome}</h3>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full" style={{ background: `${f.cor}1a`, color: f.cor }}>{f.etapa}</span>
            </div>
            <p className="text-sm text-ink/55 mt-0.5">{f.resumo}</p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {f.id === "reels" ? (
            // Reels virais → menu de modelos de Reel (cada um com vídeo e exemplos)
            <ReelsModelos cor={f.cor} />
          ) : (
            <>
              {/* Vídeo */}
              <div>
                <p className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-2">Vídeo · a Cátia explica</p>
                <VideoPlaceholder label={`Vídeo — ${f.nome} (substitua pelo embed quando gravar)`} />
              </div>

              {/* Teoria do Yap Content (só neste formato) */}
              {f.id === "roteiros" && <YapTeoria />}

              {/* Como funciona */}
              <div>
                <p className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-2">Como funciona</p>
                <p className="text-sm text-ink/75 leading-relaxed mb-2">{f.como}</p>
                <p className="text-[13px] text-ink/60"><b className="text-ink/80">Ideal:</b> {f.ideal}</p>
              </div>

              {/* Exemplos */}
              <div>
                <p className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-2">Exemplos</p>
                <ExemplosGrid bg="bg-cream-warm/30" />
                <p className="text-[11px] text-ink/40 mt-2">Espaço reservado — coloque aqui prints/exemplos deste formato.</p>
              </div>
            </>
          )}

          {/* Agente (ou ChatGPT normal, quando o formato não tem agente próprio) */}
          <div className="flex items-center gap-2 flex-wrap rounded-xl bg-cream-warm/50 border border-border px-3 py-2.5">
            <span className="inline-flex items-center gap-2 text-sm text-ink/70">
              <Bot size={16} className="text-terracotta shrink-0" />
              {f.agente === "ChatGPT"
                ? <>Copia o prompt (em <b className="text-ink">Criar Conteúdo</b>) e cola no <b className="text-ink">ChatGPT</b>.</>
                : <>Agente no ChatGPT: <b className="text-ink">{f.agente}</b></>}
            </span>
            {agenteUrl(f.agente) && (
              <a
                href={agenteUrl(f.agente)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-cream rounded-full px-3 py-1.5 transition-opacity hover:opacity-90 ml-auto"
                style={{ background: "#C8487E" }}
              >
                {f.agente === "ChatGPT" ? "Abrir ChatGPT" : "Abrir agente"} <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>
      </div>

      <Link
        to="/metodo/pilar-2/redes-sociais?aba=criar"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors"
      >
        Ir para Criar Conteúdo <ArrowRight size={15} />
      </Link>
    </div>
  );
}

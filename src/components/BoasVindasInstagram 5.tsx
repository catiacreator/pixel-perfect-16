import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { FileText, Compass, Sparkles, TrendingUp, Users, DollarSign, ArrowRight, Plus, X, Check } from "lucide-react";
import PromptCard from "./PromptCard";
import { usePilar2 } from "@/lib/pilar2-hooks";
import { readDocMestre, type DocMestre } from "@/lib/pilar4-prompts";

const PILARES_KEY = "leveza.pilares-conteudo.v1";

const OBJETIVOS = [
  { id: "Autoridade", icon: TrendingUp, desc: "Posicionar-se como referência", cor: "#C8487E" },
  { id: "Seguidores", icon: Users, desc: "Alcance e identificação", cor: "#F0A766" },
  { id: "Vendas", icon: DollarSign, desc: "Conduzir à decisão", cor: "#2E7CB8" },
];
const OBJ_IDS = OBJETIVOS.map((o) => o.id);

// Prompt pronto (preenchido com o Documento Mestre) para sugerir pilares.
const PROMPT_PILARES = `Você é o meu estrategista de conteúdo para Instagram. Com base no meu contexto, ajude-me a definir os meus PILARES DE CONTEÚDO.

📋 MEU CONTEXTO (Documento Mestre)
- Nome: [nome]
- Especialidade: [profissao]
- O que faço: [o_que_faz]
- Como resolvo: [como_resolve]
- Público: [publico]
- Dores do público:
[dores_lista]
- Promessa do método: [promessa]
- Tom de voz: [tom_de_voz]

🎯 TAREFA
Proponha de 3 a 5 PILARES DE CONTEÚDO — os grandes temas que vou usar para organizar TUDO o que publico. Baseie-se nas dores do meu público e no meu método.

Para CADA pilar, entregue exatamente:
- **Nome do pilar** (curto e claro)
- **O que ensina** ao meu seguidor (1 frase)
- **Objetivo principal**: Autoridade, Seguidores OU Vendas

No fim, explique em 2 linhas como eu rodo estes pilares ao longo da semana (Reels para atrair, carrosséis para aprofundar, stories para vender). Use o meu tom de voz.`;

type Pilar = { nome: string; ensina: string; objetivo: string };
const pilarVazio = (): Pilar => ({ nome: "", ensina: "", objetivo: "Autoridade" });

function Campo({ label, value }: { label: string; value?: string }) {
  const v = (value || "").trim();
  return (
    <div>
      <p className="text-[10px] tracking-[0.14em] uppercase text-ink/40 mb-0.5">{label}</p>
      <p className={`text-sm leading-relaxed ${v ? "text-ink/85" : "text-ink/30 italic"}`}>{v || "— por preencher"}</p>
    </div>
  );
}

export default function BoasVindasInstagram() {
  const { state: metodo } = usePilar2();
  const [doc, setDoc] = useState<DocMestre>({});
  const [pilares, setPilares] = useState<Pilar[]>([pilarVazio(), pilarVazio(), pilarVazio()]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDoc(readDocMestre());
    const onChange = () => setDoc(readDocMestre());
    window.addEventListener("leveza:hydrated", onChange);
    return () => window.removeEventListener("leveza:hydrated", onChange);
  }, []);

  // Carrega uma vez (só leitura).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PILARES_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) setPilares(arr);
      }
    } catch { /* ignora */ }
  }, []);

  // Persistência EXPLÍCITA em cada alteração — evita a corrida de mount.
  const update = (fn: (prev: Pilar[]) => Pilar[]) =>
    setPilares((prev) => {
      const next = fn(prev);
      try { localStorage.setItem(PILARES_KEY, JSON.stringify(next)); } catch { /* ignora */ }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1500);
      return next;
    });

  const setPilar = (i: number, patch: Partial<Pilar>) =>
    update((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const addPilar = () => update((prev) => (prev.length < 5 ? [...prev, pilarVazio()] : prev));
  const removePilar = (i: number) => update((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const dores = (doc.dores || []).filter((d) => d && d.trim());
  const temDoc = Boolean((doc.nome || "").trim() || (doc.oQueFaz || "").trim() || (doc.publico || "").trim());
  const preenchidos = pilares.filter((p) => p.nome.trim()).length;

  return (
    <div className="space-y-8">
      {/* Boas-vindas */}
      <div className="rounded-2xl border border-terracotta/25 bg-terracotta/5 p-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Bem-vinda ao módulo</p>
        <h2 className="font-serif text-2xl md:text-3xl text-ink mb-2">Criar para o Instagram</h2>
        <p className="text-sm text-ink/65 leading-relaxed max-w-2xl">Aqui transforma o seu método em conteúdo. O caminho é simples:</p>
        <div className="flex flex-wrap items-center gap-2 mt-4 text-[13px]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-ink font-medium">
            <FileText size={14} className="text-terracotta" /> Documento Mestre
          </span>
          <ArrowRight size={14} className="text-ink/30" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-ink font-medium">
            <Compass size={14} className="text-terracotta" /> Definir pilares
          </span>
          <ArrowRight size={14} className="text-ink/30" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-ink font-medium">
            <Sparkles size={14} className="text-terracotta" /> Criar conteúdo
          </span>
        </div>
      </div>

      {/* Resumo do Documento Mestre */}
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-border bg-cream-warm/40">
          <div className="flex items-center gap-2.5">
            <FileText size={17} className="text-terracotta" />
            <h3 className="font-serif text-lg text-ink">O seu Documento Mestre</h3>
          </div>
          <Link to="/doc-mestre" className="text-xs font-semibold text-terracotta inline-flex items-center gap-1">
            {temDoc ? "Editar" : "Preencher"} <ArrowRight size={12} />
          </Link>
        </div>

        {temDoc ? (
          <div className="p-6 grid sm:grid-cols-2 gap-x-8 gap-y-4">
            <Campo label="Nome" value={doc.nome} />
            <Campo label="Profissão" value={doc.profissao} />
            <Campo label="O que faz" value={doc.oQueFaz} />
            <Campo label="Como resolve" value={doc.comoResolve} />
            <Campo label="Público" value={doc.publico} />
            <Campo label="Promessa do método" value={metodo.promessa} />
            <div className="sm:col-span-2">
              <p className="text-[10px] tracking-[0.14em] uppercase text-ink/40 mb-1">Maiores dores do público</p>
              {dores.length ? (
                <ul className="flex flex-wrap gap-1.5">
                  {dores.slice(0, 5).map((d, i) => (
                    <li key={i} className="text-xs bg-cream-warm/70 border border-border rounded-full px-2.5 py-1 text-ink/75">{d}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink/30 italic">— por preencher</p>
              )}
            </div>
            <Campo label="Tom de voz" value={metodo.tomDeVoz || doc.tomDeVoz} />
            <Campo label="Pilares do método" value={metodo.pilares?.replace(/\n/g, " · ")} />
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-ink/60 mb-4 max-w-md mx-auto">
              Ainda não preencheu o Documento Mestre. Ele é a base de tudo — sem ele, o conteúdo fica genérico.
            </p>
            <Link to="/doc-mestre" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors">
              Preencher o Documento Mestre <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>

      {/* ─── Ferramenta: Pilares de Conteúdo ─── */}
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Passo 1 · Definir</p>
        <h3 className="font-serif text-xl text-ink mb-1.5">Os seus Pilares de Conteúdo</h3>
        <p className="text-sm text-ink/60 leading-relaxed max-w-2xl mb-5">
          Os pilares são os <b>3 a 5 grandes temas</b> que organizam tudo o que publica. Cada post nasce de um pilar e serve
          um objetivo: <b>autoridade</b>, <b>seguidores</b> ou <b>vendas</b>. Defina-os aqui uma vez — depois é só criar.
        </p>

        {/* Ajuda: prompt para sugerir pilares a partir do Doc Mestre */}
        <PromptCard
          titulo="Precisa de ajuda para começar?"
          descricao="Copie este prompt (já vem com o seu Documento Mestre), cole no ChatGPT e receba uma sugestão de pilares. Depois preencha os campos abaixo."
          prompt={PROMPT_PILARES}
          rotuloBotao="Copiar prompt de sugestão"
        />

        {/* Editor dos pilares */}
        <div className="space-y-3 mt-2">
          {pilares.map((p, i) => (
            <div key={i} className="rounded-2xl border border-border bg-white shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  <span className="w-6 h-6 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  Pilar {i + 1}
                </span>
                {pilares.length > 1 && (
                  <button onClick={() => removePilar(i)} className="text-ink/30 hover:text-terracotta transition-colors" aria-label="Remover pilar">
                    <X size={16} />
                  </button>
                )}
              </div>
              <input
                value={p.nome}
                onChange={(e) => setPilar(i, { nome: e.target.value })}
                placeholder="Nome do pilar (ex.: Bastidores do método)"
                className="w-full rounded-xl border border-border p-2.5 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-terracotta transition-colors mb-2"
              />
              <input
                value={p.ensina}
                onChange={(e) => setPilar(i, { ensina: e.target.value })}
                placeholder="O que ensina ao seguidor (1 frase)"
                className="w-full rounded-xl border border-border p-2.5 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-terracotta transition-colors mb-3"
              />
              <div className="flex flex-wrap gap-1.5">
                {OBJ_IDS.map((o) => (
                  <button
                    key={o}
                    onClick={() => setPilar(i, { objetivo: o })}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${p.objetivo === o ? "bg-terracotta text-cream border-terracotta" : "bg-white border-border text-ink/70 hover:border-terracotta/50"}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          {pilares.length < 5 ? (
            <button onClick={addPilar} className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:text-terracotta-dark transition-colors">
              <Plus size={15} /> Adicionar pilar
            </button>
          ) : <span />}
          <span className={`text-xs inline-flex items-center gap-1.5 transition-opacity ${saved ? "text-sage opacity-100" : "text-ink/35 opacity-100"}`}>
            {saved ? <><Check size={13} /> Guardado</> : `${preenchidos} de ${pilares.length} preenchidos · guarda automaticamente`}
          </span>
        </div>
      </div>

      {/* Objetivos + próximo passo */}
      <div>
        <p className="text-sm font-semibold text-ink mb-3">Cada pilar serve um destes objetivos:</p>
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {OBJETIVOS.map((o) => {
            const Icon = o.icon;
            return (
              <div key={o.id} className="rounded-2xl border border-border bg-white p-4 flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${o.cor}1a`, color: o.cor }}>
                  <Icon size={17} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{o.id}</p>
                  <p className="text-xs text-ink/55 leading-snug mt-0.5">{o.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <Link
          to="/metodo/pilar-2/redes-sociais?aba=criar"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors"
        >
          Passo 2 · Criar conteúdo a partir dos pilares <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

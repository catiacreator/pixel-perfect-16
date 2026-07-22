import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { FileText, Compass, Sparkles, LineChart, CalendarDays, Rocket, ArrowRight } from "lucide-react";
import { usePilar2 } from "@/lib/pilar2-hooks";
import { readDocMestre, type DocMestre } from "@/lib/pilar4-prompts";

// Esquema do módulo "Cria o teu plano". Cada passo é clicável e abre a explicação.
// A base é o Documento Mestre; depois seguem-se os 5 passos numerados.
type Passo = {
  n: string;
  label: string;
  icon: typeof FileText;
  to: string;
  curto: string;
  longo: string;
};

const PASSOS: Passo[] = [
  {
    n: "Base", label: "Documento Mestre", icon: FileText, to: "/doc-mestre", curto: "Quem és",
    longo: "É a base de tudo: quem serves, o que resolves, os produtos e a tua voz. Preenches uma vez e alimenta todos os passos seguintes. Sem ele, o conteúdo fica genérico.",
  },
  {
    n: "1", label: "Os teus Pilares", icon: Compass, to: "/metodo/pilar-2/redes-sociais?aba=pilares", curto: "Os teus temas",
    longo: "Os 3 a 5 grandes temas que organizam tudo o que publicas. Cada post nasce de um pilar e serve um objetivo: autoridade, seguidores ou vendas.",
  },
  {
    n: "2", label: "Máquina de Análises", icon: LineChart, to: "/maquina-analises", curto: "Onde estás",
    longo: "Analisa o teu perfil a partir de screenshots e devolve um relatório em texto — o retrato real da tua conta hoje. Guarda-o para o levares ao passo seguinte.",
  },
  {
    n: "3", label: "Criar Conteúdo", icon: Sparkles, to: "/metodo/pilar-2/redes-sociais?aba=criar", curto: "O teu plano",
    longo: "Junta o Documento Mestre com a análise e gera o teu Plano Estratégico: um calendário com todas as peças escritas, pronto para copiar.",
  },
  {
    n: "4", label: "Plano de Posts", icon: CalendarDays, to: "/metodo/pilar-2/redes-sociais?aba=plano", curto: "Agendar",
    longo: "Importas o plano e ele fica guardado no teu calendário editorial. Aqui editas o conteúdo de cada post, mudas os dias e organizas o mês.",
  },
  {
    n: "5", label: "Publicar", icon: Rocket, to: "/metodo/pilar-2/redes-sociais?aba=agendar", curto: "Pôr no ar",
    longo: "Publicas no Instagram e marcas cada post como publicado. Cada publicação conta pontos nas tuas Vitórias.",
  },
];

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
  const [aberto, setAberto] = useState<number>(0); // qual passo está explicado

  useEffect(() => {
    setDoc(readDocMestre());
    const onChange = () => setDoc(readDocMestre());
    window.addEventListener("leveza:hydrated", onChange);
    return () => window.removeEventListener("leveza:hydrated", onChange);
  }, []);

  const dores = (doc.dores || []).filter((d) => d && d.trim());
  const temDoc = Boolean((doc.nome || "").trim() || (doc.oQueFaz || "").trim() || (doc.publico || "").trim());
  const passo = PASSOS[aberto];
  const PassoIcon = passo.icon;

  return (
    <div className="space-y-8">
      {/* Boas-vindas + esquema interativo */}
      <div className="rounded-2xl border border-terracotta/25 bg-terracotta/5 p-6">
        <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Bem-vinda ao módulo</p>
        <h2 className="font-serif text-2xl md:text-3xl text-ink mb-2">Conteúdo Todo Dia</h2>
        <p className="text-sm text-ink/65 leading-relaxed max-w-2xl mb-5">
          Aqui transformas o teu método em conteúdo. Este é o caminho — <b>toca em cada passo</b> para perceberes o que fazes em cada um.
        </p>

        {/* Fila de passos clicáveis */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PASSOS.map((p, i) => {
            const Icon = p.icon;
            const ativo = i === aberto;
            return (
              <div key={p.label} className="flex items-center gap-1.5">
                <button
                  onClick={() => setAberto(i)}
                  className={`inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border text-[13px] font-medium transition-colors ${
                    ativo ? "bg-terracotta text-cream border-terracotta shadow-sm" : "bg-white border-border text-ink hover:border-terracotta/50"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${ativo ? "bg-cream/25 text-cream" : "bg-terracotta/10 text-terracotta"}`}>
                    {p.n === "Base" ? <Icon size={11} /> : p.n}
                  </span>
                  {p.label}
                </button>
                {i < PASSOS.length - 1 && <ArrowRight size={13} className="text-ink/25 shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Explicação do passo selecionado */}
        <div className="mt-4 rounded-2xl bg-white border border-border p-4 flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
            <PassoIcon size={19} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[15px] font-bold text-ink">{passo.label}</h3>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-terracotta">{passo.curto}</span>
            </div>
            <p className="text-[13px] text-ink/65 leading-relaxed mt-1">{passo.longo}</p>
            <Link to={passo.to} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-terracotta mt-2 hover:text-terracotta-dark">
              Ir para {passo.label} <ArrowRight size={14} />
            </Link>
          </div>
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
    </div>
  );
}

import { Link, useParams, Navigate } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import { PlayCircle, FileText, Lock, Download, ArrowLeft } from "lucide-react";

type FormatoData = {
  titulo: string;
  subtitulo: string;
  dependencia?: string;
  progresso?: { done: number; total: number };
  pdfPlaybook?: string;
  aulas: { numero: string; titulo: string; status: "abrir" | "em-breve" | "pdf" }[];
  proximo?: { label: string; to: string };
};

const FORMATOS: Record<string, FormatoData> = {
  "posts-unicos": {
    titulo: "Posts Únicos",
    subtitulo: "Imagem única que comunica uma ideia forte de uma vez só",
    aulas: [{ numero: "1", titulo: "Como fazer post único no ChatGPT — editável no Canva", status: "abrir" }],
    proximo: { label: "Ir para Carrossel", to: "/metodo/pilar-2/redes-sociais/instagram/carrossel" },
  },
  carrossel: {
    titulo: "Carrossel",
    subtitulo: "Sua máquina de conteúdo em 4 etapas",
    dependencia: "Card Identidade Visual",
    progresso: { done: 0, total: 11 },
    aulas: [
      { numero: "1", titulo: "Criando seu carrossel e postando", status: "abrir" },
      { numero: "2", titulo: "Os 5 Estilos de Carrossel", status: "abrir" },
      { numero: "3", titulo: "Criando seu Prompt Mestre", status: "abrir" },
      { numero: "4", titulo: "Refinando no Canva", status: "em-breve" },
      { numero: "5", titulo: "Postando e Analisando Resultados", status: "em-breve" },
    ],
  },
  stories: {
    titulo: "Stories",
    subtitulo: "Bastidor real que vira conexão, autoridade e venda",
    pdfPlaybook: "Playbook do Agente de Stories do Mês Inteiro",
    aulas: [],
    proximo: { label: "Próximo: Reels", to: "/metodo/pilar-2/redes-sociais/instagram/reels" },
  },
  reels: {
    titulo: "Reels",
    subtitulo: "Vídeos curtos para alcance, descoberta e posicionamento",
    aulas: [
      { numero: "1", titulo: "Alimentando seu projeto com o que dá certo sobre Reels", status: "pdf" },
      { numero: "2", titulo: "Salvando Referências — Sort Feed: Analisando Conteúdos de Sucesso", status: "abrir" },
      { numero: "3", titulo: "Reels de Opinião / Novidade", status: "em-breve" },
      { numero: "4", titulo: "Reels Dinâmico", status: "em-breve" },
      { numero: "5", titulo: "Gravando seus Reels", status: "em-breve" },
      { numero: "6", titulo: "Filtro no Reels", status: "em-breve" },
      { numero: "7", titulo: "Editando o Reels", status: "em-breve" },
      { numero: "8", titulo: "Reels Teste — Postando Reels", status: "em-breve" },
      { numero: "9", titulo: "Avaliando Resultado", status: "em-breve" },
    ],
  },
};

export default function InstagramFormato() {
  const { formato: slug } = useParams();
  const formato = FORMATOS[slug || ""];
  if (!formato) return <Navigate to="/metodo/pilar-2/redes-sociais/instagram" replace />;

  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2/redes-sociais/instagram" backLabel="Voltar para Instagram" />
      <div className="px-5 md:px-10 py-10 max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">{formato.titulo}</h1>
        <p className="italic text-muted mb-6">{formato.subtitulo}</p>

        {formato.dependencia && (
          <div className="rounded-xl border border-gold bg-white p-4 mb-6 flex items-start gap-2">
            <Lock size={15} className="text-gold flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted">
              Pra essa jornada funcionar, precisa terminar antes: <strong className="text-ink">{formato.dependencia}</strong>.
              Você pode seguir mesmo assim, mas o prompt e os PDFs vão sair com lacunas.
            </p>
          </div>
        )}

        {formato.progresso && (
          <div className="rounded-2xl border border-border bg-white p-5 mb-6">
            <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1">Jornada · {formato.titulo}</p>
            <p className="font-serif text-lg text-ink mb-2">Sua máquina de carrosséis</p>
            <p className="text-sm text-muted mb-3">
              Cria um Projeto GPT que entende o seu jeito, a sua linha editorial e a sua identidade visual. Depois é
              só escolher um dos 5 estilos e pedir "me faça um carrossel EDUCATIVO sobre X".
            </p>
            <p className="text-xs text-muted">Progresso: {formato.progresso.done}/{formato.progresso.total}</p>
          </div>
        )}

        {formato.pdfPlaybook && (
          <div className="rounded-2xl border border-border bg-white p-5 mb-6">
            <p className="text-xs tracking-[0.1em] uppercase text-muted mb-1">Documento de contexto</p>
            <p className="font-serif text-lg text-ink mb-2">{formato.pdfPlaybook}</p>
            <p className="text-sm text-muted mb-3">
              Baixa este documento e coloca no seu agente GPT ou Claude como base de conhecimento — ele gera stories
              do mês inteiro seguindo o playbook.
            </p>
            <button className="text-xs font-semibold px-3 py-1.5 rounded-full bg-ink text-cream flex items-center gap-1.5">
              <Download size={13} /> Baixar PDF
            </button>
          </div>
        )}

        {formato.aulas.length > 0 && (
          <div className="rounded-2xl border border-border bg-white divide-y divide-border mb-6">
            {formato.aulas.map((a) => (
              <div key={a.numero} className="flex items-center gap-3 px-4 py-3.5">
                <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                  {a.status === "pdf" ? <FileText size={14} className="text-terracotta" /> : <PlayCircle size={14} className="text-terracotta" />}
                </span>
                <div className="flex-1">
                  <p className="text-xs text-muted">Aula {a.numero}</p>
                  <p className="text-sm text-ink">{a.titulo}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${a.status === "em-breve" ? "bg-cream text-muted" : "border border-terracotta text-terracotta"}`}>
                  {a.status === "em-breve" ? "Em breve" : a.status === "pdf" ? "PDF" : "Abrir"}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link to="/metodo/pilar-2/redes-sociais/instagram" className="flex items-center gap-1.5 text-sm text-muted">
            <ArrowLeft size={14} /> Voltar para Instagram
          </Link>
          {formato.proximo && (
            <Link to={formato.proximo.to} className="text-sm font-semibold px-4 py-2 rounded-full bg-ink text-cream">
              {formato.proximo.label} →
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}

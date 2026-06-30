import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import PillarHeader from "../components/PillarHeader";
import { HeartPulse, ArrowUpRight, ArrowLeft, Check } from "lucide-react";

const PROFISSOES = ["Médica", "Dentista", "Nutricionista", "Fisioterapeuta", "Psicóloga", "Enfermeira"];

const TOPICOS = [
  "Como usar IA na sua prática com ética e segurança dos dados do paciente.",
  "Criar conteúdo de autoridade na saúde sem cair em promessas proibidas.",
  "Agentes e apps úteis: ficha de anamnese, acompanhamento, relatórios, agendamento.",
  "Comunicação e captação de pacientes nas redes, dentro das regras do conselho.",
  "Transformar o seu conhecimento clínico num produto digital (curso, mentoria, app).",
];

export default function Saude() {
  return (
    <Layout>
      <div className="max-w-[1000px] mx-auto px-5 md:px-10 py-3">
        <Link to="/metodo" className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-terracotta transition-colors mb-2">
          <ArrowLeft size={14} /> Voltar à jornada
        </Link>
      </div>

      <PillarHeader
        numeral="+"
        icon={<HeartPulse size={18} />}
        pilarLabel="Caminho por segmento"
        titulo="Área da Saúde"
        subtitulo="Trilha pensada para profissionais de saúde aplicarem Inteligência Artificial com ética e resultado."
      />

      <div className="max-w-[1000px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <div className="flex flex-wrap gap-2 mb-8">
          {PROFISSOES.map((p) => (
            <span key={p} className="text-xs font-medium px-3 py-1.5 rounded-full border border-terracotta/30 text-terracotta">
              {p}
            </span>
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 md:p-6">
          <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-4 font-semibold">O que este caminho cobre</p>
          <ul className="space-y-3">
            {TOPICOS.map((t) => (
              <li key={t} className="flex gap-3 items-start text-sm md:text-base text-ink/80">
                <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-terracotta/30 bg-terracotta/5 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">Comece pelo método base</p>
            <p className="text-sm text-ink/60 mt-1">A trilha da Saúde acompanha os 4 pilares — comece por aqui e aplique ao seu nicho.</p>
          </div>
          <Link
            to="/metodo"
            className="inline-flex items-center gap-2 bg-terracotta text-cream px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-terracotta-dark transition-colors shrink-0"
          >
            Ir para os pilares <ArrowUpRight size={15} strokeWidth={2.25} />
          </Link>
        </div>

        <p className="text-xs text-ink/45 mt-6">
          Conteúdos específicos por especialidade vão sendo adicionados a este caminho.
        </p>
      </div>
    </Layout>
  );
}

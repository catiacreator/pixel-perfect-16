import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";
import { Sparkles, ArrowRight, FileText, Save } from "lucide-react";

const DORES = [
  "Eu não sei usar Inteligência Artificial para criar conteúdo.",
  "Eu não sei o básico do Instagram para começar.",
  "Eu não sei por onde começar meu calendário de posts.",
  "Eu travo na hora de transformar ideias em conteúdo.",
  "Eu não consigo ganhar seguidores no Instagram.",
];

export default function EsbocoMetodo() {
  const [tab, setTab] = useState<"pares" | "metodo">("pares");
  const [pares] = useState(DORES.map((d) => ({ dor: d, intensidade: "Alta", vitoria: "" })));

  return (
    <Layout>
      <PilarBreadcrumb pilar={2} pilarLabel="Criar Autoridade" backTo="/metodo/pilar-2" backLabel="Voltar para o Pilar 2" />
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Definindo Seu Método</h1>
        <p className="italic text-muted mb-6">Da dor à vitória: a IA transforma as dores do público no seu método.</p>

        <div className="rounded-2xl border border-dashed border-border bg-white p-5 mb-8">
          <p className="text-sm font-semibold text-ink mb-2 flex items-center gap-2">
            <Sparkles size={15} className="text-terracotta" /> Criar meu método com Inteligência Artificial
          </p>
          <p className="text-sm text-muted mb-3">
            A IA vai confirmar as 5 dores do seu público, perguntar qual vitória entregas para cada uma, e montar o
            teu método com nome, pilares e promessa.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {DORES.map((d) => (
              <span key={d} className="text-xs px-3 py-1.5 rounded-full border border-border bg-cream truncate max-w-[220px]">
                {d}
              </span>
            ))}
          </div>
          <button className="text-sm font-semibold rounded-full bg-ink text-cream px-5 py-2.5">Criar meu método</button>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab("pares")} className={`text-sm px-4 py-1.5 rounded-full border ${tab === "pares" ? "bg-ink text-cream border-ink" : "border-border"}`}>
            Ponto A → Vitória
          </button>
          <button onClick={() => setTab("metodo")} className={`text-sm px-4 py-1.5 rounded-full border ${tab === "metodo" ? "bg-ink text-cream border-ink" : "border-border"}`}>
            Meu Método
          </button>
        </div>

        {tab === "pares" ? (
          <div className="space-y-4 mb-8">
            {pares.map((p, i) => (
              <div key={i} className="rounded-2xl border border-border bg-white p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs tracking-[0.1em] uppercase text-terracotta">Ponto A · Dor {i + 1}</p>
                </div>
                <textarea defaultValue={p.dor} rows={2} className="w-full rounded-xl border border-border p-2.5 text-sm outline-none mb-3 resize-none" />
                <div className="flex gap-2 mb-3">
                  {["Alta", "Moderada", "Baixa"].map((n) => (
                    <button key={n} className="text-xs px-3 py-1 rounded-full border border-border">{n}</button>
                  ))}
                </div>
                <p className="text-xs tracking-[0.1em] uppercase text-success mb-2">Ponto B · Vitória</p>
                <textarea rows={2} placeholder="O resultado concreto que ela conquista com você" className="w-full rounded-xl border border-border p-2.5 text-sm outline-none resize-none" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-white p-5 mb-8 text-sm text-muted">
            Preenche os 5 pares acima — o nome do método, pilares e promessa aparecem aqui depois de gerados pela IA.
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-8">
          <button className="text-sm px-4 py-2 rounded-full border border-border flex items-center gap-1.5">
            <FileText size={14} /> Revisar Doc Mestre
          </button>
          <button className="text-sm px-4 py-2 rounded-full border border-border flex items-center gap-1.5">
            <Save size={14} /> Salvar esboço
          </button>
        </div>

        <div className="rounded-2xl border border-terracotta bg-white p-5 text-center">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próximo passo</p>
          <p className="font-serif text-lg text-ink mb-3">Identidade de marca — Defina os arquétipos da sua marca e do seu cliente</p>
          <Link to="/metodo/pilar-2/identidade" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold">
            Continuar <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

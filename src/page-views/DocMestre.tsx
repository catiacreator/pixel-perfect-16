import { useState } from "react";
import Layout from "../components/Layout";
import { FileUp, ClipboardPaste, Plus, X, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-compat";

function Field({ label, placeholder, textarea }: { label: string; placeholder?: string; textarea?: boolean }) {
  return (
    <div className="mb-4">
      <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5 block">{label}</label>
      {textarea ? (
        <textarea rows={3} placeholder={placeholder} className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-terracotta" />
      ) : (
        <input placeholder={placeholder} className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-terracotta" />
      )}
    </div>
  );
}

function DraggableList({ titulo, ajuda, itensIniciais }: { titulo: string; ajuda: string; itensIniciais: string[] }) {
  const [itens, setItens] = useState(itensIniciais);
  return (
    <div className="mb-4">
      <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1 block">{titulo}</label>
      <p className="text-xs text-muted mb-2">{ajuda}</p>
      <div className="space-y-2">
        {itens.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-muted w-4">{i + 1}</span>
            <textarea
              defaultValue={it}
              rows={1}
              className="flex-1 rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta resize-none"
            />
            <button onClick={() => setItens((p) => p.filter((_, idx) => idx !== i))}>
              <X size={14} className="text-muted" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => setItens((p) => [...p, ""])}
        className="mt-2 text-xs flex items-center gap-1 text-terracotta font-semibold"
      >
        <Plus size={13} /> Adicionar
      </button>
    </div>
  );
}

export default function DocMestre() {
  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-2xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-2">Seu mapa pessoal</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">Documento Mestre</h1>
        <p className="text-muted mb-6">
          Preencha o documento para aos poucos ter mais clareza do seu projeto. A cada passo entende melhor como ter
          mais liberdade, tempo e lucro.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button className="text-sm px-4 py-2 rounded-full border border-border bg-white">Zerar tudo</button>
          <button className="text-sm px-4 py-2 rounded-full border border-border bg-white">Visualizar PDF</button>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 mb-8 flex items-center gap-3 flex-wrap">
          <p className="text-sm flex-1">Já tem um documento sobre você? Importe e a IA preenche.</p>
          <button className="text-sm px-3 py-1.5 rounded-full border border-border flex items-center gap-1.5">
            <FileUp size={14} /> Subir PDF/TXT
          </button>
          <button className="text-sm px-3 py-1.5 rounded-full border border-border flex items-center gap-1.5">
            <ClipboardPaste size={14} /> Colar texto
          </button>
        </div>

        <section className="rounded-2xl border border-border bg-white p-5 mb-5">
          <h2 className="font-serif text-xl text-ink mb-4">1. Quem é Você</h2>
          <Field label="Nome" />
          <Field label="Profissão / Especialidade" />
          <Field label="Há quanto tempo atua" />
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 mb-5">
          <h2 className="font-serif text-xl text-ink mb-4">2. O que Você Entrega</h2>
          <Field label="O que você faz (em 1 frase)" textarea />
          <Field label="Como você resolve" textarea />
          <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5 block">Produtos / Serviços</label>
          <p className="text-sm text-muted mb-2">Nenhum produto ou serviço adicionado ainda.</p>
          <button className="text-xs flex items-center gap-1 text-terracotta font-semibold">
            <Plus size={13} /> Adicionar produto / serviço
          </button>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 mb-5">
          <h2 className="font-serif text-xl text-ink mb-4">3. Seu Público</h2>
          <Field label="Público que atende" textarea />
          <DraggableList
            titulo="Dores principais do seu público"
            ajuda="Escreva as 5 dores principais — uma em cada caixinha."
            itensIniciais={["", "", "", "", ""]}
          />
          <DraggableList
            titulo="Desejos do seu público"
            ajuda="Escreva os 5 desejos principais — um em cada caixinha."
            itensIniciais={["", "", "", "", ""]}
          />
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-xl text-ink">4. Seu Método</h2>
            <Link to="/metodo/pilar-2/metodo" className="text-xs font-semibold text-terracotta flex items-center gap-1">
              Editar método <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-sm text-muted">
            Estes campos vêm do Esboço do Método (Pilar 2). Preenche essa página primeiro para os veres aqui.
          </p>
        </section>

        <button className="w-full flex items-center justify-center gap-2 rounded-full border border-border bg-white py-3 text-sm font-semibold mb-8">
          <Sparkles size={15} className="text-terracotta" /> Refinar com IA
        </button>

        <div className="rounded-2xl border border-terracotta bg-white p-5 text-center">
          <p className="text-xs tracking-[0.15em] uppercase text-terracotta mb-2">Próxima fase</p>
          <p className="font-serif text-lg text-ink mb-3">Agora aprenda a usar Inteligência Artificial</p>
          <Link
            to="/metodo/pilar-1/aprenda-ia"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold"
          >
            Domine as Principais IAs para seu Negócio <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}

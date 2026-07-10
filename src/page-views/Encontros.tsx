import Layout from "../components/Layout";
import { Users, CalendarDays, MessageCircle } from "lucide-react";

const WHATSAPP_CATIA = "https://wa.link/jwr3yp";

// Página "Encontros" — mentoria em direto. Scaffold: a Cátia preenche
// depois com os encontros/datas.
export default function Encontros() {
  return (
    <Layout>
      <section className="px-5 md:px-10 pt-10 md:pt-14 pb-20 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.24em] uppercase text-terracotta font-semibold mb-3">
          <Users size={13} /> Mentoria · Encontros
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight mb-3">Encontros</h1>
        <p className="text-ink/70 text-lg mb-8 max-w-2xl">
          Sessões em direto comigo para tirares dúvidas, receberes feedback e avançares com acompanhamento — em grupo e ao vivo.
        </p>

        {/* O que são */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-2xl border border-border bg-white p-5">
            <span className="w-10 h-10 rounded-xl bg-terracotta/12 text-terracotta flex items-center justify-center mb-3">
              <CalendarDays size={18} />
            </span>
            <h3 className="font-serif text-lg text-ink mb-1">Ao vivo, com data marcada</h3>
            <p className="text-[13.5px] text-ink/60 leading-relaxed">Encontros regulares para não te perderes — com espaço para as tuas perguntas.</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <span className="w-10 h-10 rounded-xl bg-terracotta/12 text-terracotta flex items-center justify-center mb-3">
              <Users size={18} />
            </span>
            <h3 className="font-serif text-lg text-ink mb-1">Feedback e comunidade</h3>
            <p className="text-[13.5px] text-ink/60 leading-relaxed">Aprende com os casos dos outros e recebe direção sobre o teu conteúdo.</p>
          </div>
        </div>

        {/* Próximos encontros — a preencher */}
        <div className="rounded-2xl border border-dashed border-border bg-cream-warm/30 p-6 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 font-semibold mb-1">Próximos encontros</p>
          <p className="text-ink/60 text-sm">As datas dos próximos encontros aparecem aqui em breve.</p>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-3xl bg-gradient-to-br from-terracotta-dark to-terracotta text-cream p-8 text-center">
          <h2 className="font-serif text-2xl mb-2">Queres participar?</h2>
          <p className="text-cream/85 max-w-xl mx-auto leading-relaxed mb-5">
            Fala comigo para saberes as datas e como entrar nos próximos encontros.
          </p>
          <a
            href={WHATSAPP_CATIA}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1FB855] transition-colors"
          >
            <MessageCircle size={17} /> Falar com a Cátia no WhatsApp
          </a>
        </div>
      </section>
    </Layout>
  );
}

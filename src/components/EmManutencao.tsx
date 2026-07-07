import { Link } from "@/lib/router-compat";
import { Lock, ArrowLeft, MessageCircle } from "lucide-react";
import { WHATSAPP_CATIA } from "@/lib/turmas";

// Ecrã mostrado quando a rota atual está bloqueada para o aluno. Conforme o modo:
//  - "em-breve": nada a fazer (secção a chegar).
//  - "bloqueado": mostra o contacto da Cátia (WhatsApp) para desbloquear.
export default function EmManutencao({ modo = "em-breve" }: { modo?: "em-breve" | "bloqueado" }) {
  const bloqueado = modo === "bloqueado";
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5 py-16">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-5">
          <Lock size={26} />
        </div>
        <h1 className="font-serif text-3xl text-ink mb-2">{bloqueado ? "Bloqueado" : "Em breve"}</h1>
        <p className="text-sm text-ink/60 leading-relaxed max-w-sm mx-auto">
          {bloqueado
            ? "Esta secção faz parte do método completo. Fala com a Cátia Creator para desbloquear o teu acesso."
            : "Esta secção ainda não está disponível. Fica disponível em breve — continue a avançar pelo que já está aberto."}
        </p>
        {bloqueado ? (
          <a
            href={WHATSAPP_CATIA}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1FB855] transition-colors"
          >
            <MessageCircle size={16} /> Falar com a Cátia no WhatsApp
          </a>
        ) : (
          <Link
            to="/metodo"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors"
          >
            <ArrowLeft size={15} /> Voltar à Jornada
          </Link>
        )}
      </div>
    </div>
  );
}

import Layout from "../components/Layout";
import { Mail } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMensagens } from "@/lib/admin.functions";

type Mensagem = {
  id: string;
  titulo: string;
  corpo: string;
  turmaId: string;
  data: string;
  autor: string;
};

function formatarData(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function Mensagens() {
  const fetchFn = useServerFn(getMensagens);
  const { data } = useSuspenseQuery({ queryKey: ["mensagens-aluno"], queryFn: () => fetchFn() });
  const mensagens = (data as Mensagem[]) || [];

  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-5xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-8">Mensagens da sua mentora</h1>

        {mensagens.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-10 text-center text-muted">
            <Mail size={28} className="mx-auto mb-3 opacity-50" />
            Nenhuma mensagem ainda
          </div>
        ) : (
          <div className="space-y-4">
            {mensagens.map((m) => (
              <div key={m.id} className="rounded-2xl border border-border bg-white p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-full bg-terracotta/12 text-terracotta flex items-center justify-center text-sm font-semibold shrink-0">
                    {(m.autor || "C").charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink leading-tight">{m.autor || "Cátia Creator"}</p>
                    <p className="text-[11px] text-ink/40">{formatarData(m.data)}</p>
                  </div>
                </div>
                {m.titulo && <p className="font-serif text-lg text-ink mb-1.5">{m.titulo}</p>}
                <p className="text-[15px] text-ink/75 whitespace-pre-wrap leading-relaxed">{m.corpo}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

import Layout from "../components/Layout";
import { Mail } from "lucide-react";

export default function Mensagens() {
  return (
    <Layout>
      <div className="px-5 md:px-10 py-10 max-w-5xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-8">Mensagens da sua mentora</h1>
        <div className="rounded-2xl border border-border bg-white p-10 text-center text-muted">
          <Mail size={28} className="mx-auto mb-3 opacity-50" />
          Nenhuma mensagem ainda
        </div>
      </div>
    </Layout>
  );
}

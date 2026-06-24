import type { ReactNode } from "react";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";

export function Pilar4Page({
  etapa,
  titulo,
  subtitulo,
  emBreve,
  emBreveTexto,
  children,
}: {
  etapa: string;
  titulo: string;
  subtitulo?: string;
  emBreve?: boolean;
  emBreveTexto?: string;
  children?: ReactNode;
}) {
  return (
    <Layout>
      <PilarBreadcrumb
        pilar={4}
        pilarLabel="Aprender a Vender"
        backTo="/metodo/pilar-4"
        backLabel="Voltar para o Pilar 4"
      />
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-10">
        <p className="text-xs tracking-[0.2em] uppercase text-terracotta mb-2">{etapa}</p>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">{titulo}</h1>
        {subtitulo && <p className="text-muted mb-8 max-w-2xl">{subtitulo}</p>}
        {emBreve ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-10 text-center">
            <p className="text-2xl mb-2">🔧</p>
            <p className="font-serif text-lg text-ink mb-1">Em construção</p>
            <p className="text-sm text-muted max-w-md mx-auto">{emBreveTexto}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </Layout>
  );
}

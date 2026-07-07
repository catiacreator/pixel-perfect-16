import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Send, Trash2, Users } from "lucide-react";
import { notify } from "@/lib/toast";
import { getMensagens, setMensagens, getTurmas } from "@/lib/admin.functions";
import type { Turma } from "@/lib/turmas";

export const Route = createFileRoute("/_authenticated/admin/mensagens")({
  component: MensagensAdminPage,
});

type Mensagem = {
  id: string;
  titulo: string;
  corpo: string;
  turmaId: string; // "todas" ou o id de uma turma
  data: string; // ISO
  autor: string;
};

const AUTOR = "Cátia Creator";

function novoId(): string {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function formatarData(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

function MensagensAdminPage() {
  const fetchFn = useServerFn(getMensagens);
  const saveFn = useServerFn(setMensagens);
  const fetchTurmas = useServerFn(getTurmas);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin-mensagens"], queryFn: () => fetchFn() });
  const { data: turmasData } = useSuspenseQuery({ queryKey: ["admin-turmas"], queryFn: () => fetchTurmas() });
  const mensagens = (data as Mensagem[]) || [];
  const turmas = (turmasData as Turma[]) || [];
  const nomeTurma = (id: string) =>
    id === "todas" ? "Todas as turmas" : (turmas.find((t) => t.id === id)?.nome ?? "Iniciante (padrão)");

  const [titulo, setTitulo] = useState("");
  const [corpo, setCorpo] = useState("");
  const [turmaId, setTurmaId] = useState("todas");

  const mut = useMutation({
    mutationFn: (next: Mensagem[]) => saveFn({ data: { mensagens: next } }),
    onError: (e: unknown) => notify(e instanceof Error ? e.message : "Erro ao guardar", "error"),
  });
  const persist = (next: Mensagem[]) => { qc.setQueryData(["admin-mensagens"], next); mut.mutate(next); };

  function enviar() {
    const t = titulo.trim();
    const c = corpo.trim();
    if (!c) {
      notify("Escreva a mensagem antes de enviar.", "error");
      return;
    }
    const msg: Mensagem = {
      id: novoId(),
      titulo: t,
      corpo: c,
      turmaId,
      data: new Date().toISOString(),
      autor: AUTOR,
    };
    persist([msg, ...mensagens]);
    setTitulo("");
    setCorpo("");
    setTurmaId("todas");
    notify("Mensagem enviada.", "success");
  }

  const apagar = (id: string) => {
    if (!window.confirm("Apagar esta mensagem? Deixa de aparecer aos alunos.")) return;
    persist(mensagens.filter((m) => m.id !== id));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-terracotta mb-1">Leveza no Digital</p>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Mensagens aos alunos</h1>
      <p className="text-sm text-ink/60 mt-1 max-w-xl">
        Escreva uma mensagem que aparece aos alunos em <b>Mensagens da sua mentora</b>. Pode enviar para
        <b> todas</b> as turmas ou dirigir a uma turma específica.
      </p>

      {/* Escrever nova mensagem */}
      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-4 space-y-3">
        <div>
          <label className="block text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-1.5">Título (opcional)</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Aula ao vivo esta quinta"
            className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-1.5">Mensagem</label>
          <textarea
            value={corpo}
            onChange={(e) => setCorpo(e.target.value)}
            placeholder="Escreva aqui a sua mensagem para os alunos…"
            rows={5}
            className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] text-sm leading-relaxed resize-y"
          />
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-1.5">Para</label>
            <select
              value={turmaId}
              onChange={(e) => setTurmaId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm bg-white"
            >
              <option value="todas">Todas as turmas</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>
          <button
            onClick={enviar}
            disabled={mut.isPending}
            className="h-10 px-5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Send size={15} /> Enviar
          </button>
        </div>
      </div>

      <p className="text-[13px] text-ink/50 mt-6 mb-2">{mensagens.length} mensagem(ns) enviada(s)</p>

      {mensagens.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-10 text-center">
          <Mail size={26} className="mx-auto text-ink/30 mb-3" />
          <p className="text-sm text-ink/55">Ainda não enviou nenhuma mensagem.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mensagens.map((m) => (
            <div key={m.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  {m.titulo && <p className="text-sm font-semibold text-ink">{m.titulo}</p>}
                  <p className="text-sm text-ink/70 mt-0.5 whitespace-pre-wrap leading-relaxed">{m.corpo}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta">
                      <Users size={11} /> {nomeTurma(m.turmaId)}
                    </span>
                    <span className="text-[11px] text-ink/40">{formatarData(m.data)}</span>
                  </div>
                </div>
                <button onClick={() => apagar(m.id)} className="text-ink/30 hover:text-rose-600 shrink-0" aria-label="Apagar">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Ticket, Plus, Trash2, Copy, Check, Wand2 } from "lucide-react";
import { notify } from "@/lib/toast";
import { getCodigos, setCodigos } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/codigos 2")({
  component: CodigosPage,
});

type Codigo = { codigo: string; ativo: boolean; nota?: string };

function gerarCodigo(): string {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem 0/O/1/I
  let s = "";
  for (let i = 0; i < 6; i++) s += letras[Math.floor(Math.random() * letras.length)];
  return s;
}

function CodigosPage() {
  const fetchFn = useServerFn(getCodigos);
  const saveFn = useServerFn(setCodigos);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin-codigos"], queryFn: () => fetchFn() });
  const codigos = (data as Codigo[]) || [];

  const [novo, setNovo] = useState("");
  const [nota, setNota] = useState("");
  const [copiado, setCopiado] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: (next: Codigo[]) => saveFn({ data: { codigos: next } }),
    onError: (e: unknown) => notify(e instanceof Error ? e.message : "Erro ao guardar", "error"),
  });
  const persist = (next: Codigo[]) => { qc.setQueryData(["admin-codigos"], next); mut.mutate(next); };

  function adicionar() {
    const cod = (novo.trim() || gerarCodigo()).toUpperCase();
    if (codigos.some((c) => c.codigo.toUpperCase() === cod)) {
      notify("Esse código já existe.", "error");
      return;
    }
    persist([{ codigo: cod, ativo: true, nota: nota.trim() || undefined }, ...codigos]);
    setNovo("");
    setNota("");
  }
  const toggle = (cod: string) =>
    persist(codigos.map((c) => (c.codigo === cod ? { ...c, ativo: !c.ativo } : c)));
  const apagar = (cod: string) => {
    if (!window.confirm(`Apagar o código ${cod}?`)) return;
    persist(codigos.filter((c) => c.codigo !== cod));
  };
  async function copiar(cod: string) {
    try { await navigator.clipboard?.writeText(cod); setCopiado(cod); setTimeout(() => setCopiado(null), 1500); } catch { /* ignora */ }
  }

  const ativos = codigos.filter((c) => c.ativo).length;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-terracotta mb-1">Leveza no Digital</p>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Códigos de acesso</h1>
      <p className="text-sm text-ink/60 mt-1 max-w-xl">
        Crie códigos para novos alunos criarem conta. Só os códigos <b>ativos</b> funcionam — desative quando quiser
        fechar as inscrições.
      </p>

      {/* Adicionar */}
      <div className="mt-6 flex flex-wrap items-end gap-2 rounded-2xl border border-[var(--color-border)] bg-white p-4">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-1.5">Código</label>
          <div className="flex items-center gap-1.5">
            <input
              value={novo}
              onChange={(e) => setNovo(e.target.value.toUpperCase())}
              placeholder="Ex.: IAVIRAL"
              className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm font-mono tracking-wider"
            />
            <button onClick={() => setNovo(gerarCodigo())} className="h-10 px-3 rounded-lg border border-[var(--color-border)] text-ink/60 hover:text-ink" title="Gerar código">
              <Wand2 size={15} />
            </button>
          </div>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-1.5">Nota (opcional)</label>
          <input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ex.: Turma de janeiro"
            className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm"
          />
        </div>
        <button onClick={adicionar} className="h-10 px-4 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors inline-flex items-center gap-2">
          <Plus size={16} /> Adicionar
        </button>
      </div>

      <p className="text-[13px] text-ink/50 mt-4 mb-2">{codigos.length} código(s) · {ativos} ativo(s)</p>

      {codigos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-10 text-center">
          <Ticket size={26} className="mx-auto text-ink/30 mb-3" />
          <p className="text-sm text-ink/55">Ainda não há códigos. Crie o primeiro em cima.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white divide-y divide-[var(--color-border)]">
          {codigos.map((c) => (
            <div key={c.codigo} className="flex items-center gap-3 px-4 py-3">
              <span className="font-mono text-sm font-semibold tracking-wider text-ink">{c.codigo}</span>
              <button onClick={() => copiar(c.codigo)} className="text-ink/35 hover:text-ink" aria-label="Copiar">
                {copiado === c.codigo ? <Check size={14} className="text-sage" /> : <Copy size={14} />}
              </button>
              {c.nota && <span className="text-[13px] text-ink/50 truncate hidden sm:block">{c.nota}</span>}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => toggle(c.codigo)}
                  className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    c.ativo ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-ink/5 border-[var(--color-border)] text-ink/45"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.ativo ? "bg-emerald-500" : "bg-ink/30"}`} />
                  {c.ativo ? "Ativo" : "Inativo"}
                </button>
                <button onClick={() => apagar(c.codigo)} className="text-ink/30 hover:text-rose-600" aria-label="Apagar">
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

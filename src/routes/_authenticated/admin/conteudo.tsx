import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import {
  listPilares,
  upsertEtapa,
  deleteEtapa,
  upsertPilar,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/conteudo")({
  component: ConteudoPage,
});

type Pilar = { id: string; slug: string; titulo: string; descricao: string | null; ordem: number };
type Etapa = {
  id: string;
  pilar_id: string;
  slug: string;
  titulo: string;
  descricao: string | null;
  video_url: string | null;
  ordem: number;
};

function ConteudoPage() {
  const fetch = useServerFn(listPilares);
  const upPilar = useServerFn(upsertPilar);
  const upEtapa = useServerFn(upsertEtapa);
  const delE = useServerFn(deleteEtapa);
  const qc = useQueryClient();

  const { data } = useSuspenseQuery({ queryKey: ["admin-pilares"], queryFn: () => fetch() });
  const [openEtapa, setOpenEtapa] = useState<Partial<Etapa> & { pilar_id: string } | null>(null);
  const [openPilar, setOpenPilar] = useState<Partial<Pilar> | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-pilares"] });

  const savePilar = useMutation({
    mutationFn: (p: any) => upPilar({ data: p }),
    onSuccess: () => { toast.success("Salvo"); refresh(); setOpenPilar(null); },
    onError: (e) => toast.error(e.message),
  });
  const saveEtapa = useMutation({
    mutationFn: (p: any) => upEtapa({ data: p }),
    onSuccess: () => { toast.success("Etapa salva"); refresh(); setOpenEtapa(null); },
    onError: (e) => toast.error(e.message),
  });
  const removeEtapa = useMutation({
    mutationFn: (id: string) => delE({ data: { id } }),
    onSuccess: () => { toast.success("Etapa removida"); refresh(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Conteúdo dos pilares</h1>
          <p className="text-sm text-ink/60 mt-1">
            Estrutura editável dos pilares e suas etapas.
          </p>
        </div>
        <button
          onClick={() => setOpenPilar({ titulo: "", slug: "", ordem: data.pilares.length + 1 })}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-terracotta text-cream text-sm"
        >
          <Plus size={14} /> Novo pilar
        </button>
      </div>

      <div className="flex flex-col gap-6 mt-6">
        {data.pilares.map((p) => {
          const etapas = data.etapas.filter((e) => e.pilar_id === p.id);
          return (
            <div key={p.id} className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-ink/40">{p.slug}</p>
                  <h2 className="text-lg font-semibold mt-1">{p.titulo}</h2>
                  {p.descricao && <p className="text-sm text-ink/60 mt-1">{p.descricao}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setOpenPilar(p)} className="text-xs text-ink/60 hover:text-ink">Editar</button>
                  <button
                    onClick={() => setOpenEtapa({ pilar_id: p.id, ordem: etapas.length + 1 })}
                    className="text-xs inline-flex items-center gap-1 text-terracotta"
                  >
                    <Plus size={12} /> Etapa
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col divide-y divide-[var(--color-border)]">
                {etapas.length === 0 && <p className="text-sm text-ink/50 py-3">Sem etapas.</p>}
                {etapas.map((e) => (
                  <div key={e.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{e.titulo}</p>
                      <p className="text-[11px] text-ink/50 truncate">{e.slug} · ordem {e.ordem}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setOpenEtapa(e)} className="text-xs text-ink/60 hover:text-ink">Editar</button>
                      <button
                        onClick={() => { if (confirm("Remover etapa?")) removeEtapa.mutate(e.id); }}
                        className="text-ink/40 hover:text-rose-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {openPilar && (
        <PilarDialog
          initial={openPilar}
          onClose={() => setOpenPilar(null)}
          onSave={(p) => savePilar.mutate(p)}
        />
      )}
      {openEtapa && (
        <EtapaDialog
          initial={openEtapa}
          onClose={() => setOpenEtapa(null)}
          onSave={(e) => saveEtapa.mutate(e)}
        />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-ink/50">{label}</span>
      {children}
    </label>
  );
}

function PilarDialog({ initial, onClose, onSave }: { initial: Partial<Pilar>; onClose: () => void; onSave: (p: any) => void }) {
  const [f, setF] = useState({ ...initial });
  return (
    <Modal onClose={onClose} title={f.id ? "Editar pilar" : "Novo pilar"}>
      <Field label="Slug"><input value={f.slug ?? ""} onChange={(e) => setF({ ...f, slug: e.target.value })} className="input" /></Field>
      <Field label="Título"><input value={f.titulo ?? ""} onChange={(e) => setF({ ...f, titulo: e.target.value })} className="input" /></Field>
      <Field label="Descrição"><textarea rows={3} value={f.descricao ?? ""} onChange={(e) => setF({ ...f, descricao: e.target.value })} className="input" /></Field>
      <Field label="Ordem"><input type="number" value={f.ordem ?? 0} onChange={(e) => setF({ ...f, ordem: Number(e.target.value) })} className="input" /></Field>
      <Actions onClose={onClose} onSave={() => onSave(f)} />
    </Modal>
  );
}

function EtapaDialog({ initial, onClose, onSave }: { initial: Partial<Etapa> & { pilar_id: string }; onClose: () => void; onSave: (e: any) => void }) {
  const [f, setF] = useState({ ...initial });
  return (
    <Modal onClose={onClose} title={f.id ? "Editar etapa" : "Nova etapa"}>
      <Field label="Slug"><input value={f.slug ?? ""} onChange={(e) => setF({ ...f, slug: e.target.value })} className="input" /></Field>
      <Field label="Título"><input value={f.titulo ?? ""} onChange={(e) => setF({ ...f, titulo: e.target.value })} className="input" /></Field>
      <Field label="Descrição"><textarea rows={3} value={f.descricao ?? ""} onChange={(e) => setF({ ...f, descricao: e.target.value })} className="input" /></Field>
      <Field label="Vídeo (URL)"><input value={f.video_url ?? ""} onChange={(e) => setF({ ...f, video_url: e.target.value })} className="input" /></Field>
      <Field label="Ordem"><input type="number" value={f.ordem ?? 0} onChange={(e) => setF({ ...f, ordem: Number(e.target.value) })} className="input" /></Field>
      <Actions onClose={onClose} onSave={() => onSave(f)} />
    </Modal>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-cream w-full max-w-md rounded-2xl p-6 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold">{title}</h2>
        <style>{`.input{height:42px;padding:0 14px;border-radius:9999px;border:1px solid var(--color-border);background:var(--color-cream-warm,#f5efe6);font-size:13px;width:100%}textarea.input{height:auto;padding:12px;border-radius:16px;font-family:inherit}`}</style>
        {children}
      </div>
    </div>
  );
}

function Actions({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div className="flex gap-2 mt-2">
      <button onClick={onClose} className="flex-1 h-11 rounded-full border border-[var(--color-border)] text-sm">Cancelar</button>
      <button onClick={onSave} className="flex-1 h-11 rounded-full bg-terracotta text-cream text-sm font-medium">Salvar</button>
    </div>
  );
}

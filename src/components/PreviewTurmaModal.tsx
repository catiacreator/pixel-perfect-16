import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Eye, X, GraduationCap, Shield, LogOut } from "lucide-react";
import { getTurmas, getPapeis } from "@/lib/admin.functions";
import { ABRIR_PREVIEW_EVENT, setPreviewTurma, setAdminView, usePreviewTurma, useAdminView } from "@/lib/admin-view";
import type { Turma } from "@/lib/turmas";

export default function PreviewTurmaModal() {
  const [open, setOpen] = useState(false);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [papeis, setPapeis] = useState<{ aluno: string[]; moderador: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchTurmas = useServerFn(getTurmas);
  const fetchPapeis = useServerFn(getPapeis);
  const preview = usePreviewTurma();
  const [view] = useAdminView();

  useEffect(() => {
    const onOpen = async () => {
      setOpen(true);
      setLoading(true);
      try {
        const [t, p] = await Promise.all([fetchTurmas(), fetchPapeis()]);
        setTurmas((t as Turma[]) || []);
        setPapeis(p as { aluno: string[]; moderador: string[] });
      } catch { /* ignora */ } finally {
        setLoading(false);
      }
    };
    window.addEventListener(ABRIR_PREVIEW_EVENT, onOpen);
    return () => window.removeEventListener(ABRIR_PREVIEW_EVENT, onOpen);
  }, [fetchTurmas, fetchPapeis]);

  function escolher(nome: string, acessos: string[]) {
    setPreviewTurma({ nome, acessos });
    setAdminView("aluno");
    setOpen(false);
  }
  function sairPreview() {
    setPreviewTurma(null);
    setAdminView("admin");
  }

  return (
    <>
      {/* Banner enquanto pré-visualiza */}
      {preview && view === "aluno" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[55] inline-flex items-center gap-3 bg-ink text-cream rounded-full pl-4 pr-1.5 py-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]">
          <Eye size={14} className="shrink-0" />
          <span className="text-[13px]">A ver como <b>{preview.nome}</b></span>
          <button onClick={sairPreview} className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-cream/15 hover:bg-cream/25 rounded-full px-3 py-1.5 transition-colors">
            <LogOut size={12} /> Sair
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-ink flex items-center gap-2"><Eye size={18} className="text-terracotta" /> Pré-visualizar como aluno</h2>
              <button onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink" aria-label="Fechar"><X size={18} /></button>
            </div>
            <p className="text-sm text-ink/60 mb-4">Escolha a turma para testar as permissões ao longo da app. O “Em breve” global continua a esconder para todos.</p>

            {loading ? (
              <p className="text-sm text-ink/50 py-8 text-center">A carregar…</p>
            ) : (
              <div className="space-y-2 max-h-[52vh] overflow-y-auto">
                <Opcao icon={<GraduationCap size={16} />} nome="Aluno (padrão)" desc="O que um aluno sem turma vê (papel Aluno)" onClick={() => escolher("Aluno (padrão)", papeis?.aluno ?? [])} />
                <Opcao icon={<Shield size={16} />} nome="Moderador" desc="Permissões do papel Moderador" onClick={() => escolher("Moderador", papeis?.moderador ?? [])} />
                {turmas.map((t) => (
                  <Opcao key={t.id} dot={t.cor} nome={t.nome} desc={`${t.acessos.length} acesso(s) · ${t.membros.length} aluno(s)`} onClick={() => escolher(t.nome, t.acessos)} />
                ))}
                {turmas.length === 0 && <p className="text-[12px] text-ink/40 px-1 pt-1">Ainda não há turmas — crie em Admin → Turmas.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Opcao({ nome, desc, icon, dot, onClick }: { nome: string; desc: string; icon?: React.ReactNode; dot?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border border-[var(--color-border)] bg-white hover:border-terracotta/50 hover:bg-terracotta/[0.03] text-left transition-colors">
      {dot ? (
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dot }} />
      ) : (
        <span className="w-8 h-8 rounded-lg bg-ink/5 text-ink/60 flex items-center justify-center shrink-0">{icon}</span>
      )}
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink truncate">{nome}</span>
        <span className="block text-[11px] text-ink/50">{desc}</span>
      </span>
    </button>
  );
}

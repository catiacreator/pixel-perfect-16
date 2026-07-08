import { useEffect, useState } from "react";
import { useAccess } from "@/lib/use-access";

// Modo de visualização da admin: "admin" (com afordâncias de gestão) ou
// "aluno" (pré-visualiza a plataforma como uma aluna a vê). Guardado localmente
// e sincronizado entre componentes por evento.
export type AdminView = "admin" | "aluno";

const KEY = "leveza.admin-view";
const EVENT = "leveza:admin-view";

export function getAdminView(): AdminView {
  if (typeof window === "undefined") return "admin";
  try {
    return window.localStorage.getItem(KEY) === "aluno" ? "aluno" : "admin";
  } catch {
    return "admin";
  }
}

export function setAdminView(v: AdminView) {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* ignora */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: v }));
}

export function useAdminView(): [AdminView, (v: AdminView) => void] {
  const [view, setView] = useState<AdminView>(getAdminView);
  useEffect(() => {
    const on = () => setView(getAdminView());
    window.addEventListener(EVENT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return [view, setAdminView];
}

// Conteúdo bloqueado para alunos: fechado para quem não é admin e também para a
// admin quando está a pré-visualizar em "vista de aluno". Só desbloqueia para a
// admin na vista admin.
export function useBloqueadoParaAlunos(): boolean {
  const { isAdmin } = useAccess();
  const [view] = useAdminView();
  return !isAdmin || view === "aluno";
}

// ── Pré-visualização por turma ──
// Quando a admin escolhe "vista de aluno", pode simular a turma de um aluno para
// testar as permissões ao longo da app. Guardado localmente.
const PT_KEY = "leveza.preview-turma.v1";
const PT_EVENT = "leveza:preview-turma";
export const ABRIR_PREVIEW_EVENT = "leveza:abrir-preview-turma";

export type PreviewTurma = { nome: string; acessos: string[]; categoria?: string | null } | null;

export function getPreviewTurma(): PreviewTurma {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PT_KEY);
    return raw ? (JSON.parse(raw) as PreviewTurma) : null;
  } catch {
    return null;
  }
}

export function setPreviewTurma(v: PreviewTurma) {
  try {
    if (v) window.localStorage.setItem(PT_KEY, JSON.stringify(v));
    else window.localStorage.removeItem(PT_KEY);
  } catch { /* ignora */ }
  window.dispatchEvent(new CustomEvent(PT_EVENT, { detail: v }));
}

export function usePreviewTurma(): PreviewTurma {
  const [v, setV] = useState<PreviewTurma>(getPreviewTurma);
  useEffect(() => {
    const on = () => setV(getPreviewTurma());
    window.addEventListener(PT_EVENT, on);
    window.addEventListener("storage", on);
    return () => { window.removeEventListener(PT_EVENT, on); window.removeEventListener("storage", on); };
  }, []);
  return v;
}

// Abre a pop-up de escolha de turma (a Layout renderiza o modal e escuta isto).
export function abrirPreviewTurma() {
  window.dispatchEvent(new Event(ABRIR_PREVIEW_EVENT));
}

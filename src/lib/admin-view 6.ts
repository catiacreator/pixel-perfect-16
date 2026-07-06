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

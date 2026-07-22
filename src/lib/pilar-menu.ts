// Liga o hamburger do canto superior esquerdo (no cabeçalho) ao menu do curso
// atual (a PilarSidebar), que é renderizada pelas páginas e não pelo Layout.
//
// Segue o mesmo padrão do admin-view: eventos de janela, sem contexto React.
// A sidebar ANUNCIA-SE ao montar; assim o cabeçalho só mostra o hamburger nas
// páginas que têm mesmo um menu de curso para abrir.

import { useEffect, useState } from "react";

const EVENT_ABRIR = "leveza:pilar-menu-abrir";
const EVENT_PRESENTE = "leveza:pilar-menu-presente";

let presente = false;

/** Chamado pelo cabeçalho quando a pessoa toca no hamburger. */
export function abrirPilarMenu() {
  window.dispatchEvent(new CustomEvent(EVENT_ABRIR));
}

/** A sidebar diz "existo" ao montar, e "desapareci" ao desmontar. */
export function anunciarPilarMenu(existe: boolean) {
  presente = existe;
  window.dispatchEvent(new CustomEvent(EVENT_PRESENTE, { detail: existe }));
}

/** true quando a página atual tem menu de curso. */
export function usePilarMenuPresente(): boolean {
  const [v, setV] = useState(presente);
  useEffect(() => {
    const on = (e: Event) => setV(!!(e as CustomEvent).detail);
    window.addEventListener(EVENT_PRESENTE, on);
    // Estado inicial: a sidebar pode ter montado antes deste componente.
    setV(presente);
    return () => window.removeEventListener(EVENT_PRESENTE, on);
  }, []);
  return v;
}

/** A sidebar ouve os pedidos de abertura vindos do cabeçalho. */
export function useAbrirPilarMenu(abrir: () => void) {
  useEffect(() => {
    const on = () => abrir();
    window.addEventListener(EVENT_ABRIR, on);
    return () => window.removeEventListener(EVENT_ABRIR, on);
  }, [abrir]);
}

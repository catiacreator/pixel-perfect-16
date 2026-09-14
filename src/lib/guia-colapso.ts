import { useEffect, useState } from "react";

// Estado partilhado (entre os botões flutuantes "O teu guia" e "Escreva as suas
// ideias") para colapsar/expandir: colapsado = só ícones, texto escondido.
const KEY = "leveza.guia-colapsado";
const EVENT = "leveza:guia-colapso";

export function lerColapsado(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function alternarColapso() {
  const v = !lerColapsado();
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* ignora */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useColapsado(): boolean {
  const [c, setC] = useState(false); // começa expandido (igual no servidor)
  useEffect(() => {
    setC(lerColapsado());
    const on = () => setC(lerColapsado());
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return c;
}

// Toast simples e auto-contido (sem dependências externas).
type Listener = (msg: string) => void;
const listeners = new Set<Listener>();

/** Mostra um toast de confirmação (ex.: "Guardado ✓"). */
export function notifySaved(msg = "Guardado ✓") {
  listeners.forEach((l) => l(msg));
}

export function subscribeToast(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

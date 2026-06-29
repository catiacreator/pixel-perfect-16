// Toast simples e auto-contido (sem dependências externas).
export type ToastType = "success" | "warning" | "error";
export type ToastPayload = { msg: string; type: ToastType };

type Listener = (p: ToastPayload) => void;
const listeners = new Set<Listener>();

/** Mostra um toast com o tipo dado (cor de sucesso/aviso/erro). */
export function notify(msg: string, type: ToastType = "success") {
  listeners.forEach((l) => l({ msg, type }));
}

/** Atalho para confirmação de gravação. */
export function notifySaved(msg = "Guardado ✓") {
  notify(msg, "success");
}

export function subscribeToast(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

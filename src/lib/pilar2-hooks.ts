import { useEffect, useState, useCallback } from "react";
import { EMPTY_PILAR2, readPilar2, writePilar2, type Pilar2State } from "./pilar2-storage";

export function usePilar2() {
  const [state, setState] = useState<Pilar2State>(EMPTY_PILAR2);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readPilar2());
    setHydrated(true);
    const onChange = () => setState(readPilar2());
    window.addEventListener("leveza:pilar2-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("leveza:pilar2-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const update = useCallback((patch: Partial<Pilar2State> | ((p: Pilar2State) => Pilar2State)) => {
    setState((prev) => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      writePilar2(next);
      return next;
    });
  }, []);

  return { state, update, hydrated };
}

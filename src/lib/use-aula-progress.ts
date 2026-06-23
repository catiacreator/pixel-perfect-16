import { useEffect, useState, useCallback } from "react";

const KEY = "leveza.aulas-concluidas.v1";

function read(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(map: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("leveza:aulas-changed"));
}

export function key(tool: string, aulaId: string) {
  return `${tool}/${aulaId}`;
}

export function useAulaProgress() {
  const [map, setMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMap(read());
    const onChange = () => setMap(read());
    window.addEventListener("leveza:aulas-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("leveza:aulas-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const toggle = useCallback((tool: string, aulaId: string) => {
    const k = key(tool, aulaId);
    setMap((prev) => {
      const next = { ...prev, [k]: !prev[k] };
      if (!next[k]) delete next[k];
      write(next);
      return next;
    });
  }, []);

  const isDone = useCallback(
    (tool: string, aulaId: string) => Boolean(map[key(tool, aulaId)]),
    [map],
  );

  const countDone = useCallback(
    (tool: string, aulaIds: string[]) =>
      aulaIds.reduce((acc, id) => (map[key(tool, id)] ? acc + 1 : acc), 0),
    [map],
  );

  return { map, toggle, isDone, countDone };
}

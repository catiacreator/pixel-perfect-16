// Progresso do "fluxo da jornada" — calcula, por card, a % de conclusão a
// partir dos dados que já existem no localStorage (espelhados no Supabase via
// master-doc-sync). Abordagem pragmática: onde há sinal fino mostra-se %; onde
// só há ferramenta aberta (análise de perfil, criação livre) o card não é
// "rastreado" e mostra-se como "Abrir".

import { useEffect, useState } from "react";
import { loadInitial, docMestrePct } from "@/lib/doc-mestre";

export type CardProgresso = { pct: number; done: boolean; rastreado: boolean };
export type FluxoProgresso = Record<string, CardProgresso>;

const VAZIO: FluxoProgresso = {
  cerebro: { pct: 0, done: false, rastreado: true },
  autoridade: { pct: 0, done: false, rastreado: true },
  pilares: { pct: 0, done: false, rastreado: true },
  analise: { pct: 0, done: false, rastreado: false },
  plano: { pct: 0, done: false, rastreado: true },
  livre: { pct: 0, done: false, rastreado: false },
};

function readJSON(key: string): unknown {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function pctDe(vals: unknown[]): number {
  if (!vals.length) return 0;
  const feitos = vals.filter((x) => String(x ?? "").trim()).length;
  return Math.round((feitos / vals.length) * 100);
}

function calcular(): FluxoProgresso {
  // 1) Segundo cérebro — Documento Mestre
  const cerebro = docMestrePct(loadInitial());

  // 2) Criar autoridade — Pilar 2 (campos-sinal representativos)
  const p2 = (readJSON("leveza.pilar2.v1") as Record<string, unknown> | null) ?? {};
  const autoridade = pctDe([
    p2.nomeMetodo,
    p2.promessa,
    p2.posicionamento,
    p2.arquetipoDominante,
    p2.tomDeVoz,
  ]);

  // 3) Pilares de conteúdo — ≥3 pilares nomeados = 100%
  const arr = readJSON("leveza.pilares-conteudo.v1");
  const nomeados = Array.isArray(arr)
    ? arr.filter((p) => String((p as { nome?: string })?.nome ?? "").trim()).length
    : 0;
  const pilares = Math.min(Math.round((nomeados / 3) * 100), 100);

  // 5a) Plano de posts — meta de 4 posts agendados (com data) = 100%
  const plano = readJSON("leveza.plano-conteudo.v1") as { posts?: { data?: string }[] } | null;
  const agendados = Array.isArray(plano?.posts)
    ? plano!.posts.filter((p) => p?.data).length
    : 0;
  const META_PLANO = 4;
  const planoPct = Math.min(Math.round((agendados / META_PLANO) * 100), 100);

  const c = (pct: number, rastreado = true): CardProgresso => ({
    pct,
    done: rastreado && pct >= 100,
    rastreado,
  });

  return {
    cerebro: c(cerebro),
    autoridade: c(autoridade),
    pilares: c(pilares),
    analise: c(0, false), // ferramenta aberta — sem sinal de conclusão (pragmático)
    plano: c(planoPct),
    livre: c(0, false), // ferramenta aberta
  };
}

export function useFluxoProgresso(): FluxoProgresso {
  const [estado, setEstado] = useState<FluxoProgresso>(VAZIO);
  useEffect(() => {
    const atualizar = () => setEstado(calcular());
    atualizar();
    window.addEventListener("leveza:hydrated", atualizar);
    window.addEventListener("leveza:pilar2-changed", atualizar);
    window.addEventListener("storage", atualizar);
    return () => {
      window.removeEventListener("leveza:hydrated", atualizar);
      window.removeEventListener("leveza:pilar2-changed", atualizar);
      window.removeEventListener("storage", atualizar);
    };
  }, []);
  return estado;
}

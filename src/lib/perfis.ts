// Perfis — cada pessoa pode ter até 2 Documentos Mestres (perfis) e trabalhar
// com um de cada vez.
//
// Estratégia (mínimo impacto): o Documento Mestre do perfil ATIVO fica sempre
// em `leveza.doc-mestre.v1`, por isso tudo o que já lê o Doc Mestre continua a
// funcionar sem alterações. O perfil INATIVO fica guardado à parte, em
// `leveza.perfis.v1`. Trocar de perfil = trocar os dois de sítio.
//
// Ao trocar dispara-se o HYDRATED_EVENT (o mesmo que a sincronização usa), que
// a página do Doc Mestre e todos os leitores já escutam para recarregar.

import { useEffect, useState } from "react";
import { STORAGE_KEY as DOC_KEY, EMPTY, type DocState } from "./doc-mestre";
import { HYDRATED_EVENT } from "./master-doc-sync";

export const PERFIS_KEY = "leveza.perfis.v1";
// O Plano de Posts (plano de conteúdo) também troca com o perfil.
const PLANO_KEY = "leveza.plano-conteudo.v1";
export const PERFIL_EVENT = "leveza:perfil";
export const MAX_PERFIS = 2;

// Dados que pertencem a cada perfil: o Documento Mestre e o Plano de Posts.
type DadosPerfil = { doc: DocState; plano: unknown };

type PerfisState = {
  ativo: 0 | 1;
  nomes: string[]; // comprimento 1 (um perfil) ou 2 (dois perfis)
  guardado: DadosPerfil | null; // dados do perfil INATIVO (só quando há 2)
};

function ler(): PerfisState {
  if (typeof window === "undefined") return { ativo: 0, nomes: ["Perfil 1"], guardado: null };
  try {
    const s = JSON.parse(window.localStorage.getItem(PERFIS_KEY) || "null");
    if (s && Array.isArray(s.nomes) && s.nomes.length) {
      return {
        ativo: s.ativo === 1 ? 1 : 0,
        nomes: s.nomes.slice(0, 2),
        guardado: s.guardado ?? null,
      };
    }
  } catch { /* ignora */ }
  return { ativo: 0, nomes: ["Perfil 1"], guardado: null };
}

function gravar(s: PerfisState) {
  try { window.localStorage.setItem(PERFIS_KEY, JSON.stringify(s)); } catch { /* ignora */ }
}

function lerDadosAtivos(): DadosPerfil {
  let doc: DocState = { ...EMPTY };
  let plano: unknown = null;
  try {
    const raw = window.localStorage.getItem(DOC_KEY);
    if (raw) doc = { ...EMPTY, ...JSON.parse(raw) };
  } catch { /* ignora */ }
  try {
    const raw = window.localStorage.getItem(PLANO_KEY);
    if (raw) plano = JSON.parse(raw);
  } catch { /* ignora */ }
  return { doc, plano };
}

function gravarDadosAtivos(d: DadosPerfil) {
  try { window.localStorage.setItem(DOC_KEY, JSON.stringify(d.doc)); } catch { /* ignora */ }
  try {
    if (d.plano == null) window.localStorage.removeItem(PLANO_KEY);
    else window.localStorage.setItem(PLANO_KEY, JSON.stringify(d.plano));
  } catch { /* ignora */ }
}

function avisar() {
  window.dispatchEvent(new Event(PERFIL_EVENT));
  // Faz os leitores do Doc Mestre recarregarem (mesmo sinal da sincronização).
  window.dispatchEvent(new Event(HYDRATED_EVENT));
}

export type PerfisInfo = {
  ativo: 0 | 1;
  nomes: string[];
  count: number;
  nomeAtivo: string;
  podeAdicionar: boolean;
};

export function getPerfis(): PerfisInfo {
  const s = ler();
  return {
    ativo: s.ativo,
    nomes: s.nomes,
    count: s.nomes.length,
    nomeAtivo: s.nomes[s.ativo] || `Perfil ${s.ativo + 1}`,
    podeAdicionar: s.nomes.length < MAX_PERFIS,
  };
}

/**
 * Cria o 2.º perfil (Documento Mestre e Plano de Posts vazios) e passa logo a
 * trabalhar nele — a interface leva a pessoa ao Documento Mestre para o preencher.
 */
export function criarSegundoPerfil(nome: string): void {
  const s = ler();
  if (s.nomes.length >= MAX_PERFIS) return;
  s.nomes = [s.nomes[0] || "Perfil 1", (nome || "Perfil 2").trim() || "Perfil 2"];
  // Guarda o perfil atual e ativa o novo (vazio).
  s.guardado = lerDadosAtivos();
  s.ativo = 1;
  gravarDadosAtivos({ doc: { ...EMPTY }, plano: null });
  gravar(s);
  avisar();
}

/** Passa a trabalhar no perfil i (0 ou 1). Troca o Doc Mestre E o Plano de Posts. */
export function selecionarPerfil(i: 0 | 1): void {
  const s = ler();
  if (s.nomes.length < MAX_PERFIS || i === s.ativo) return;
  const atuais = lerDadosAtivos();
  const novos = s.guardado ?? { doc: { ...EMPTY }, plano: null };
  gravarDadosAtivos(novos);
  s.guardado = atuais;
  s.ativo = i;
  gravar(s);
  avisar();
}

export function renomearPerfil(i: 0 | 1, nome: string): void {
  const s = ler();
  if (i >= s.nomes.length) return;
  s.nomes[i] = (nome || `Perfil ${i + 1}`).trim() || `Perfil ${i + 1}`;
  gravar(s);
  avisar();
}

/** Hook reativo para a barra de perfis. */
export function usePerfis(): PerfisInfo {
  const [info, setInfo] = useState<PerfisInfo>(getPerfis);
  useEffect(() => {
    const on = () => setInfo(getPerfis());
    window.addEventListener(PERFIL_EVENT, on);
    window.addEventListener(HYDRATED_EVENT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(PERFIL_EVENT, on);
      window.removeEventListener(HYDRATED_EVENT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return info;
}

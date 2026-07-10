import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import Layout from "../components/Layout";
import VideoArea from "../components/curso/VideoArea";
import { getEncontros, setEncontros, criarUploadEncontro } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";
import type { Encontro, EncontroLink, EncontroFicheiro } from "@/lib/encontros";
import { extLabel } from "@/lib/encontros";
import {
  Users, MessageCircle, Play, Plus, Trash2, Save, X, Link2, FileText,
  Upload, Loader2, CalendarDays, ExternalLink,
} from "lucide-react";

const WHATSAPP_CATIA = "https://wa.link/jwr3yp";

function novoId() {
  return `e-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
}

export default function Encontros() {
  const bloqueado = useBloqueadoParaAlunos();
  const podeEditar = !bloqueado; // admin em vista de admin
  const fetchFn = useServerFn(getEncontros);
  const saveFn = useServerFn(setEncontros);

  const [encontros, setEncontrosState] = useState<Encontro[]>([]);
  const [selId, setSelId] = useState<string | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [editando, setEditando] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);

  useEffect(() => {
    let vivo = true;
    fetchFn()
      .then((lista) => {
        if (!vivo) return;
        const arr = (lista as Encontro[]) ?? [];
        setEncontrosState(arr);
        setSelId(arr[0]?.id ?? null);
      })
      .catch(() => {})
      .finally(() => vivo && setCarregado(true));
    return () => { vivo = false; };
  }, [fetchFn]);

  const sel = encontros.find((e) => e.id === selId) ?? null;

  async function guardar(prox: Encontro[]) {
    setEncontrosState(prox);
    setAGuardar(true);
    try {
      await saveFn({ data: { encontros: prox } });
    } finally {
      setAGuardar(false);
    }
  }

  function adicionar() {
    const e: Encontro = { id: novoId(), titulo: "Novo encontro", data: "" };
    const prox = [e, ...encontros];
    setEncontrosState(prox);
    setSelId(e.id);
    setEditando(true);
    void guardar(prox);
  }

  function atualizarSel(patch: Partial<Encontro>) {
    if (!sel) return;
    setEncontrosState((lista) => lista.map((e) => (e.id === sel.id ? { ...e, ...patch } : e)));
  }

  function removerSel() {
    if (!sel) return;
    const prox = encontros.filter((e) => e.id !== sel.id);
    setSelId(prox[0]?.id ?? null);
    setEditando(false);
    void guardar(prox);
  }

  return (
    <Layout>
      <section className="px-5 md:px-10 pt-10 md:pt-14 pb-20 max-w-6xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.24em] uppercase text-terracotta font-semibold mb-3">
          <Users size={13} /> Mentoria · Encontros
        </span>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight mb-2">Encontros</h1>
            <p className="text-ink/70 text-lg max-w-2xl">
              As gravações das nossas sessões ao vivo — com os materiais de cada encontro para descarregares.
            </p>
          </div>
          {podeEditar && (
            <button
              onClick={adicionar}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors shrink-0"
            >
              <Plus size={16} /> Novo encontro
            </button>
          )}
        </div>

        {!carregado ? (
          <div className="flex items-center gap-2 text-ink/50 text-sm py-16 justify-center">
            <Loader2 size={16} className="animate-spin" /> A carregar…
          </div>
        ) : encontros.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-cream-warm/30 p-10 text-center">
            <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 font-semibold mb-1">Encontros</p>
            <p className="text-ink/60 text-sm">
              {podeEditar
                ? "Ainda não há encontros. Carrega em “Novo encontro” para começar."
                : "As gravações dos encontros aparecem aqui em breve."}
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8 items-start">
            {/* ESQUERDA — vídeo + materiais */}
            <div className="min-w-0">
              {sel && (
                <>
                  {podeEditar && editando ? (
                    <input
                      value={sel.titulo}
                      onChange={(e) => atualizarSel({ titulo: e.target.value })}
                      className="w-full font-serif text-2xl md:text-3xl text-ink bg-transparent border-b border-border focus:border-terracotta outline-none mb-1 pb-1"
                      placeholder="Título do encontro"
                    />
                  ) : (
                    <h2 className="font-serif text-2xl md:text-3xl text-ink mb-1">{sel.titulo}</h2>
                  )}
                  {podeEditar && editando ? (
                    <input
                      value={sel.data ?? ""}
                      onChange={(e) => atualizarSel({ data: e.target.value })}
                      className="text-sm text-ink/60 bg-transparent border-b border-border/60 focus:border-terracotta outline-none mb-4"
                      placeholder="Data (ex.: 12 jul · 21h)"
                    />
                  ) : (
                    sel.data && (
                      <p className="inline-flex items-center gap-1.5 text-sm text-ink/55 mb-4">
                        <CalendarDays size={14} /> {sel.data}
                      </p>
                    )
                  )}

                  {/* Vídeo */}
                  {podeEditar && editando && (
                    <input
                      value={sel.videoUrl ?? ""}
                      onChange={(e) => atualizarSel({ videoUrl: e.target.value })}
                      className="w-full text-sm text-ink/80 bg-white border border-border rounded-lg px-3 py-2 mb-3 outline-none focus:border-terracotta"
                      placeholder="URL do vídeo (.mp4 ou embed YouTube/Vimeo)"
                    />
                  )}
                  {sel.videoUrl ? (
                    <VideoArea videoUrl={sel.videoUrl} titulo={sel.titulo} />
                  ) : (
                    <div className="aspect-video rounded-2xl bg-ink/5 border border-border flex items-center justify-center text-ink/40">
                      <Play size={40} strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Descrição / materiais */}
                  <div className="mt-6">
                    {podeEditar && editando ? (
                      <EditorMateriais
                        encontro={sel}
                        onChange={atualizarSel}
                        criarUpload={criarUploadEncontro}
                      />
                    ) : (
                      <VistaMateriais encontro={sel} />
                    )}
                  </div>

                  {/* Barra de edição */}
                  {podeEditar && (
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {editando ? (
                        <button
                          onClick={() => { setEditando(false); void guardar(encontros); }}
                          disabled={aGuardar}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors disabled:opacity-60"
                        >
                          {aGuardar ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                          Guardar
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditando(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white text-ink text-sm font-semibold hover:border-terracotta transition-colors"
                        >
                          Editar este encontro
                        </button>
                      )}
                      <button
                        onClick={removerSel}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-white text-ink/60 text-sm hover:text-red-600 hover:border-red-300 transition-colors"
                      >
                        <Trash2 size={15} /> Eliminar
                      </button>
                      {aGuardar && <span className="text-xs text-ink/40">a guardar…</span>}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* DIREITA — menu de encontros */}
            <aside className="lg:sticky lg:top-24">
              <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 font-semibold mb-3 px-1">
                Todos os encontros
              </p>
              <div className="flex flex-col gap-2">
                {encontros.map((e) => {
                  const ativo = e.id === selId;
                  return (
                    <button
                      key={e.id}
                      onClick={() => { setSelId(e.id); setEditando(false); }}
                      className={`text-left rounded-xl border px-4 py-3 transition-colors ${
                        ativo
                          ? "border-terracotta bg-terracotta/8"
                          : "border-border bg-white hover:border-terracotta/50"
                      }`}
                    >
                      <span className={`flex items-center gap-2 text-sm font-semibold ${ativo ? "text-terracotta-dark" : "text-ink"}`}>
                        <Play size={13} className="shrink-0" /> {e.titulo}
                      </span>
                      {e.data && <span className="block text-xs text-ink/50 mt-0.5 pl-5">{e.data}</span>}
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        )}

        {/* CTA WhatsApp */}
        <div className="mt-14 rounded-3xl bg-gradient-to-br from-terracotta-dark to-terracotta text-cream p-8 text-center">
          <h2 className="font-serif text-2xl mb-2">Queres participar ao vivo?</h2>
          <p className="text-cream/85 max-w-xl mx-auto leading-relaxed mb-5">
            Fala comigo para saberes as datas e como entrar nos próximos encontros.
          </p>
          <a
            href={WHATSAPP_CATIA}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1FB855] transition-colors"
          >
            <MessageCircle size={17} /> Falar com a Cátia no WhatsApp
          </a>
        </div>
      </section>
    </Layout>
  );
}

// ─────────────────────── Vista do aluno (só leitura) ───────────────────────
function VistaMateriais({ encontro }: { encontro: Encontro }) {
  const temDesc = !!encontro.descricao?.trim();
  const links = encontro.links ?? [];
  const ficheiros = encontro.ficheiros ?? [];
  if (!temDesc && !links.length && !ficheiros.length) return null;
  return (
    <div className="space-y-6">
      {temDesc && (
        <div className="text-ink/80 leading-relaxed whitespace-pre-wrap text-[15px]">{encontro.descricao}</div>
      )}
      {links.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 font-semibold mb-2">Links</p>
          <div className="flex flex-col gap-1.5">
            {links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta-dark text-sm font-medium w-fit"
              >
                <Link2 size={14} /> {l.nome || l.url} <ExternalLink size={12} className="opacity-60" />
              </a>
            ))}
          </div>
        </div>
      )}
      {ficheiros.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-ink/45 font-semibold mb-2">Materiais</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {ficheiros.map((f, i) => (
              <a
                key={i}
                href={f.url}
                target="_blank"
                rel="noreferrer"
                download
                className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:border-terracotta transition-colors group"
              >
                <span className="w-9 h-9 rounded-lg bg-terracotta/12 text-terracotta flex items-center justify-center shrink-0">
                  <FileText size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-ink font-medium truncate group-hover:text-terracotta-dark">{f.nome}</span>
                  <span className="block text-[11px] text-ink/45">{extLabel(f.nome)}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────── Editor (admin) ───────────────────────
function EditorMateriais({
  encontro,
  onChange,
  criarUpload,
}: {
  encontro: Encontro;
  onChange: (patch: Partial<Encontro>) => void;
  criarUpload: typeof criarUploadEncontro;
}) {
  const uploadFn = useServerFn(criarUpload);
  const fileRef = useRef<HTMLInputElement>(null);
  const [aEnviar, setAEnviar] = useState(false);
  const links = encontro.links ?? [];
  const ficheiros = encontro.ficheiros ?? [];

  function setLinks(l: EncontroLink[]) { onChange({ links: l }); }
  function setFicheiros(f: EncontroFicheiro[]) { onChange({ ficheiros: f }); }

  async function enviarFicheiro(file: File) {
    setAEnviar(true);
    try {
      const { path, token, publicUrl } = await uploadFn({ data: { nome: file.name } });
      const { error } = await supabase.storage.from("encontros").uploadToSignedUrl(path, token, file);
      if (error) throw error;
      setFicheiros([...ficheiros, { nome: file.name, url: publicUrl, tipo: file.type || undefined }]);
    } catch (err) {
      alert("Não foi possível enviar o ficheiro: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setAEnviar(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-cream-warm/20 p-5">
      {/* Descrição */}
      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-ink/45 font-semibold mb-2">Texto / descrição</label>
        <textarea
          value={encontro.descricao ?? ""}
          onChange={(e) => onChange({ descricao: e.target.value })}
          rows={5}
          className="w-full text-[15px] text-ink bg-white border border-border rounded-lg px-3 py-2.5 outline-none focus:border-terracotta leading-relaxed resize-y"
          placeholder="Escreve aqui as notas do encontro, resumo, próximos passos…"
        />
      </div>

      {/* Links */}
      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-ink/45 font-semibold mb-2">Links</label>
        <div className="space-y-2">
          {links.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={l.nome}
                onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, nome: e.target.value } : x)))}
                placeholder="Nome"
                className="w-40 text-sm bg-white border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-terracotta"
              />
              <input
                value={l.url}
                onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
                placeholder="https://…"
                className="flex-1 min-w-0 text-sm bg-white border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-terracotta"
              />
              <button onClick={() => setLinks(links.filter((_, j) => j !== i))} className="text-ink/40 hover:text-red-600 p-1">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setLinks([...links, { nome: "", url: "" }])}
          className="mt-2 inline-flex items-center gap-1.5 text-sm text-terracotta hover:text-terracotta-dark font-medium"
        >
          <Plus size={14} /> Adicionar link
        </button>
      </div>

      {/* Ficheiros */}
      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-ink/45 font-semibold mb-2">Ficheiros (PDF, docx, pptx…)</label>
        <div className="space-y-2 mb-2">
          {ficheiros.map((f, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2">
              <FileText size={15} className="text-terracotta shrink-0" />
              <span className="flex-1 min-w-0 text-sm text-ink truncate">{f.nome}</span>
              <span className="text-[10px] text-ink/40">{extLabel(f.nome)}</span>
              <button onClick={() => setFicheiros(ficheiros.filter((_, j) => j !== i))} className="text-ink/40 hover:text-red-600 p-1">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void enviarFicheiro(f); }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={aEnviar}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white text-ink text-sm font-semibold hover:border-terracotta transition-colors disabled:opacity-60"
        >
          {aEnviar ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {aEnviar ? "A enviar…" : "Carregar ficheiro"}
        </button>
      </div>
    </div>
  );
}

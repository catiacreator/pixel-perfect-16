import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import Layout from "../components/Layout";
import VideoArea from "../components/curso/VideoArea";
import {
  getEncontros, setEncontros, criarUploadEncontro,
  getComentarios, addComentario, removerComentario,
} from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { useBloqueadoParaAlunos } from "@/lib/admin-view";
import { useAccess } from "@/lib/use-access";
import { useProgresso } from "@/lib/use-progresso";
import type { Encontro, EncontroLink, EncontroFicheiro, EncontroComentario } from "@/lib/encontros";
import { extLabel } from "@/lib/encontros";
import {
  Users, Play, Plus, Trash2, Save, X, Link2, FileText,
  Upload, Loader2, CalendarDays, ExternalLink,
  CheckCircle2, Circle, MessageSquare, Send,
} from "lucide-react";

function novoId() {
  return `e-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
}

export default function Encontros() {
  const bloqueado = useBloqueadoParaAlunos();
  const podeEditar = !bloqueado; // admin em vista de admin
  const fetchFn = useServerFn(getEncontros);
  const saveFn = useServerFn(setEncontros);
  const uploadFn = useServerFn(criarUploadEncontro);

  const [encontros, setEncontrosState] = useState<Encontro[]>([]);
  const [selId, setSelId] = useState<string | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [editando, setEditando] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);
  const [aEnviarVideo, setAEnviarVideo] = useState(false);
  const videoRef = useRef<HTMLInputElement>(null);

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

  async function enviarVideo(file: File) {
    if (!sel) return;
    setAEnviarVideo(true);
    try {
      const { path, token, publicUrl } = await uploadFn({ data: { nome: file.name } });
      const { error } = await supabase.storage.from("encontros").uploadToSignedUrl(path, token, file);
      if (error) throw error;
      // guarda já o URL do vídeo no encontro selecionado
      const prox = encontros.map((e) => (e.id === sel.id ? { ...e, videoUrl: publicUrl } : e));
      await guardar(prox);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert("Não foi possível enviar o vídeo: " + msg + "\n\n(Limite ~50 MB por ficheiro. Vídeos maiores precisam de ser comprimidos.)");
    } finally {
      setAEnviarVideo(false);
      if (videoRef.current) videoRef.current.value = "";
    }
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
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.24em] uppercase text-berry font-semibold mb-3">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-berry text-cream text-sm font-semibold hover:bg-berry-dark transition-colors shrink-0"
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
                      className="w-full font-serif text-2xl md:text-3xl text-ink bg-transparent border-b border-border focus:border-berry outline-none mb-1 pb-1"
                      placeholder="Título do encontro"
                    />
                  ) : (
                    <h2 className="font-serif text-2xl md:text-3xl text-ink mb-1">{sel.titulo}</h2>
                  )}
                  {podeEditar && editando ? (
                    <input
                      value={sel.data ?? ""}
                      onChange={(e) => atualizarSel({ data: e.target.value })}
                      className="text-sm text-ink/60 bg-transparent border-b border-border/60 focus:border-berry outline-none mb-4"
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
                    <div className="mb-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          value={sel.videoUrl ?? ""}
                          onChange={(e) => atualizarSel({ videoUrl: e.target.value })}
                          className="flex-1 min-w-0 text-sm text-ink/80 bg-white border border-border rounded-lg px-3 py-2 outline-none focus:border-berry"
                          placeholder="Cola um URL (.mp4 ou embed YouTube/Vimeo)…"
                        />
                        <input
                          ref={videoRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) void enviarVideo(f); }}
                        />
                        <button
                          onClick={() => videoRef.current?.click()}
                          disabled={aEnviarVideo}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-berry text-cream text-sm font-semibold hover:bg-berry-dark transition-colors disabled:opacity-60 shrink-0"
                        >
                          {aEnviarVideo ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                          {aEnviarVideo ? "A enviar…" : "Carregar vídeo"}
                        </button>
                      </div>
                      <p className="text-[11px] text-ink/40 mt-1.5">
                        … ou carrega o ficheiro do teu computador (até ~50 MB).
                      </p>
                    </div>
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

                  {/* Barra de edição (admin) — logo a seguir aos materiais */}
                  {podeEditar && (
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {editando ? (
                        <button
                          onClick={() => { setEditando(false); void guardar(encontros); }}
                          disabled={aGuardar}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-berry text-cream text-sm font-semibold hover:bg-berry-dark transition-colors disabled:opacity-60"
                        >
                          {aGuardar ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                          Guardar
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditando(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-berry text-cream text-sm font-semibold hover:bg-berry-dark transition-colors"
                        >
                          <Save size={15} /> Editar este encontro
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

                  {/* Marcar como visto + Comentários (todos os alunos) */}
                  {!editando && (
                    <div className="mt-8 pt-8 border-t border-border space-y-10">
                      <MarcarVisto encontroId={sel.id} />
                      <Comentarios encontroId={sel.id} />
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
                          ? "border-berry bg-berry/8"
                          : "border-border bg-white hover:border-berry/50"
                      }`}
                    >
                      <span className={`flex items-center gap-2 text-sm font-semibold ${ativo ? "text-berry-dark" : "text-ink"}`}>
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
                className="inline-flex items-center gap-2 text-berry hover:text-berry-dark text-sm font-medium w-fit"
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
                className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 hover:border-berry transition-colors group"
              >
                <span className="w-9 h-9 rounded-lg bg-berry/12 text-berry flex items-center justify-center shrink-0">
                  <FileText size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-ink font-medium truncate group-hover:text-berry-dark">{f.nome}</span>
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
          className="w-full text-[15px] text-ink bg-white border border-border rounded-lg px-3 py-2.5 outline-none focus:border-berry leading-relaxed resize-y"
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
                className="w-40 text-sm bg-white border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-berry"
              />
              <input
                value={l.url}
                onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))}
                placeholder="https://…"
                className="flex-1 min-w-0 text-sm bg-white border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-berry"
              />
              <button onClick={() => setLinks(links.filter((_, j) => j !== i))} className="text-ink/40 hover:text-red-600 p-1">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setLinks([...links, { nome: "", url: "" }])}
          className="mt-2 inline-flex items-center gap-1.5 text-sm text-berry hover:text-berry-dark font-medium"
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
              <FileText size={15} className="text-berry shrink-0" />
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white text-ink text-sm font-semibold hover:border-berry transition-colors disabled:opacity-60"
        >
          {aEnviar ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {aEnviar ? "A enviar…" : "Carregar ficheiro"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────── Marcar como visto (por aluno) ───────────────────────
function MarcarVisto({ encontroId }: { encontroId: string }) {
  const { isFeita, marcar } = useProgresso();
  const tid = `encontro:${encontroId}`;
  const visto = isFeita(tid);
  return (
    <button
      onClick={() => void marcar(tid, "aula", !visto)}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
        visto
          ? "bg-berry text-cream hover:bg-berry-dark"
          : "border border-border bg-white text-ink hover:border-berry"
      }`}
    >
      {visto ? <CheckCircle2 size={17} /> : <Circle size={17} />}
      {visto ? "Visto" : "Marcar como visto"}
    </button>
  );
}

// ─────────────────────── Comentários (mural partilhado) ───────────────────────
function Avatar({ nome, avatar }: { nome: string; avatar?: string }) {
  if (avatar) return <img src={avatar} alt={nome} className="w-9 h-9 rounded-full object-cover shrink-0" />;
  const ini = (nome || "?").trim().charAt(0).toUpperCase();
  return (
    <span className="w-9 h-9 rounded-full bg-berry/15 text-berry font-semibold text-sm flex items-center justify-center shrink-0">
      {ini}
    </span>
  );
}

function fmtData(iso: string) {
  try {
    const d = new Date(iso);
    return (
      d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" }) +
      " · " +
      d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })
    );
  } catch {
    return "";
  }
}

function Comentarios({ encontroId }: { encontroId: string }) {
  const { isAdmin } = useAccess();
  const listFn = useServerFn(getComentarios);
  const addFn = useServerFn(addComentario);
  const delFn = useServerFn(removerComentario);
  const [lista, setLista] = useState<EncontroComentario[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [texto, setTexto] = useState("");
  const [aEnviar, setAEnviar] = useState(false);

  useEffect(() => {
    let vivo = true;
    setCarregado(false);
    listFn({ data: { encontroId } })
      .then((r) => { if (vivo) setLista((r as EncontroComentario[]) ?? []); })
      .catch(() => {})
      .finally(() => vivo && setCarregado(true));
    return () => { vivo = false; };
  }, [listFn, encontroId]);

  async function enviar() {
    const t = texto.trim();
    if (!t || aEnviar) return;
    setAEnviar(true);
    try {
      const novo = await addFn({ data: { encontroId, texto: t } });
      setLista((l) => [...l, novo as EncontroComentario]);
      setTexto("");
    } catch (err) {
      alert("Não foi possível comentar: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setAEnviar(false);
    }
  }

  async function remover(id: string) {
    setLista((l) => l.filter((c) => c.id !== id));
    try { await delFn({ data: { id } }); } catch { /* ignora */ }
  }

  return (
    <div>
      <h3 className="font-serif text-lg text-ink mb-4 inline-flex items-center gap-2">
        <MessageSquare size={18} className="text-berry" /> Comentários
        {carregado && lista.length > 0 && <span className="text-ink/40 text-sm font-sans">({lista.length})</span>}
      </h3>

      {/* Nova mensagem */}
      <div className="flex items-start gap-2 mb-6">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void enviar(); }}
          rows={2}
          placeholder="Escreve um comentário para o grupo…"
          className="flex-1 min-w-0 text-[15px] text-ink bg-white border border-border rounded-xl px-3.5 py-2.5 outline-none focus:border-berry resize-y leading-relaxed"
        />
        <button
          onClick={() => void enviar()}
          disabled={aEnviar || !texto.trim()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-berry text-cream text-sm font-semibold hover:bg-berry-dark transition-colors disabled:opacity-50 shrink-0"
        >
          {aEnviar ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          Comentar
        </button>
      </div>

      {/* Lista */}
      {!carregado ? (
        <div className="flex items-center gap-2 text-ink/40 text-sm">
          <Loader2 size={14} className="animate-spin" /> A carregar comentários…
        </div>
      ) : lista.length === 0 ? (
        <p className="text-ink/45 text-sm">Ainda não há comentários. Sê a primeira a comentar!</p>
      ) : (
        <div className="space-y-5">
          {lista.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <Avatar nome={c.nome} avatar={c.avatar} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{c.nome}</span>
                  <span className="text-[11px] text-ink/40">{fmtData(c.ts)}</span>
                  {isAdmin && (
                    <button
                      onClick={() => void remover(c.id)}
                      className="ml-auto text-ink/30 hover:text-red-600 p-0.5"
                      title="Apagar comentário"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <p className="text-[15px] text-ink/80 leading-relaxed whitespace-pre-wrap">{c.texto}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

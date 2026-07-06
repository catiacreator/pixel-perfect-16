import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserPlus, Trash2, Copy, Check, Link2, Phone } from "lucide-react";
import { PAISES } from "@/data/paises";
import { readContactos, writeContactos, normalizar, type Contacto } from "@/lib/estudio-contactos";

export const Route = createFileRoute("/_authenticated/admin/estudio")({
  component: EstudioPage,
});

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function EstudioPage() {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [nome, setNome] = useState("");
  const [dial, setDial] = useState(PAISES[0].dial);
  const [numero, setNumero] = useState("");
  const [erro, setErro] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [linkRegisto, setLinkRegisto] = useState("/registo");

  useEffect(() => {
    setContactos(readContactos());
    if (typeof window !== "undefined") setLinkRegisto(`${window.location.origin}/registo`);
  }, []);

  const persist = (list: Contacto[]) => { setContactos(list); writeContactos(list); };

  const adicionar = () => {
    const num = numero.trim();
    if (num.replace(/\D/g, "").length < 6) { setErro("Escreva um número de WhatsApp válido."); return; }
    const alvo = normalizar(dial, num);
    if (contactos.some((c) => normalizar(c.dial, c.numero) === alvo)) { setErro("Este contacto já está na lista."); return; }
    persist([{ id: uid(), nome: nome.trim(), dial, numero: num }, ...contactos]);
    setNome(""); setNumero(""); setErro("");
  };

  const remover = (id: string) => persist(contactos.filter((c) => c.id !== id));

  const copiarLink = () => {
    navigator.clipboard?.writeText(linkRegisto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1600);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Aluno do Estúdio Creator</h1>
      <p className="text-sm text-ink/55 mt-0.5">Adicione os contactos de WhatsApp aprovados. Só quem estiver nesta lista pode criar conta pelo link.</p>

      {/* Link único de registo */}
      <div className="mt-5 rounded-2xl border border-terracotta/25 bg-terracotta/5 p-4">
        <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-2 inline-flex items-center gap-1.5"><Link2 size={13} /> Link único de registo</p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="text-sm text-ink bg-white border border-[var(--color-border)] rounded-lg px-3 py-2 flex-1 min-w-[200px] truncate">{linkRegisto}</code>
          <button onClick={copiarLink} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors">
            {copiado ? <Check size={14} /> : <Copy size={14} />} {copiado ? "Copiado!" : "Copiar link"}
          </button>
        </div>
        <p className="text-xs text-ink/50 mt-2">Partilhe este link na sua comunidade. A pessoa coloca o WhatsApp; se estiver na lista, cria a conta.</p>
      </div>

      {/* Adicionar contacto */}
      <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <p className="text-sm font-semibold text-ink mb-3 inline-flex items-center gap-2"><UserPlus size={16} className="text-terracotta" /> Adicionar contacto</p>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[160px]">
            <label className="text-[11px] tracking-[0.1em] uppercase text-ink/45 mb-1.5 block">Nome (opcional)</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do aluno"
              className="w-full rounded-lg border border-[var(--color-border)] p-2.5 text-sm outline-none focus:border-terracotta" />
          </div>
          <div>
            <label className="text-[11px] tracking-[0.1em] uppercase text-ink/45 mb-1.5 block">Indicativo</label>
            <select value={dial} onChange={(e) => setDial(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] p-2.5 text-sm outline-none focus:border-terracotta bg-white">
              {PAISES.map((p) => <option key={p.nome} value={p.dial}>{p.flag} {p.dial} · {p.nome}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="text-[11px] tracking-[0.1em] uppercase text-ink/45 mb-1.5 block">WhatsApp</label>
            <input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="912 345 678" inputMode="tel"
              className="w-full rounded-lg border border-[var(--color-border)] p-2.5 text-sm outline-none focus:border-terracotta" />
          </div>
          <button onClick={adicionar} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors">
            <UserPlus size={15} /> Adicionar
          </button>
        </div>
        {erro && <p className="text-xs text-terracotta mt-2">{erro}</p>}
      </div>

      {/* Lista */}
      <div className="mt-5">
        <p className="text-sm font-semibold text-ink mb-2">{contactos.length} contacto{contactos.length === 1 ? "" : "s"} aprovado{contactos.length === 1 ? "" : "s"}</p>
        {contactos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-cream-warm/30 p-8 text-center text-sm text-ink/50">
            Ainda não adicionou contactos.
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-border)] bg-white divide-y divide-[var(--color-border)] overflow-hidden">
            {contactos.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-9 h-9 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0"><Phone size={15} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink truncate">{c.nome || "—"}</p>
                  <p className="text-xs text-ink/55">{c.dial} {c.numero}</p>
                </div>
                <button onClick={() => remover(c.id)} className="text-ink/40 hover:text-terracotta transition-colors" aria-label="Remover">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-ink/45 mt-4">
        Pré-visualização: os contactos guardam-se localmente por agora.
      </p>
    </div>
  );
}

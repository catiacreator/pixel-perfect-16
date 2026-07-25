import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@/lib/router-compat";
import { FileText, ArrowUpRight, ChevronDown, Check, Plus, Pencil, UserCircle2 } from "lucide-react";
import { usePerfis, selecionarPerfil, criarSegundoPerfil, renomearPerfil } from "@/lib/perfis";
import BuscaGlobal from "@/components/BuscaGlobal";
import NIaTopButton from "@/components/NIaTopButton";

// Segunda barra (por baixo do cabeçalho): o perfil ativo + o botão Documento
// Mestre. Cada pessoa pode ter até 2 perfis (Documentos Mestres) e trabalhar
// com um de cada vez.
export default function PerfilBar() {
  const perfis = usePerfis();
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [aberto]);

  const criar = () => {
    // Cria o 2.º perfil (vazio, já ativo) e leva a pessoa ao Documento Mestre
    // para o preencher.
    criarSegundoPerfil("Perfil 2");
    setAberto(false);
    navigate("/doc-mestre");
  };

  const renomear = (i: 0 | 1) => {
    const nome = window.prompt("Novo nome do perfil:", perfis.nomes[i]);
    if (nome === null) return;
    renomearPerfil(i, nome);
  };

  return (
    <div className="w-full border-b border-[var(--color-border)] bg-cream-warm/30">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-11 flex items-center justify-between gap-2">
        {/* Esquerda: pesquisa + Assistente N.IA */}
        <div className="flex items-center gap-2 min-w-0">
          <BuscaGlobal />
          <NIaTopButton />
        </div>

        {/* Direita: perfil ativo + Documento Mestre */}
        <div className="flex items-center gap-2 shrink-0">
        {/* Seletor de perfil */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setAberto((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[13px] pl-2.5 pr-2 py-1.5 rounded-full border border-ink/15 bg-white text-ink hover:border-terracotta/50 transition-colors"
            title="Perfil ativo"
          >
            <UserCircle2 size={14} className="text-terracotta" />
            <span className="font-medium max-w-[140px] truncate">{perfis.nomeAtivo}</span>
            <ChevronDown size={13} className={`transition-transform ${aberto ? "rotate-180" : ""}`} />
          </button>

          {aberto && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[var(--color-border)] rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] p-1.5 z-50">
              <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/35">
                Trabalhar no perfil
              </p>
              {perfis.nomes.map((nome, i) => {
                const ativo = i === perfis.ativo;
                return (
                  <div key={i} className="flex items-center gap-1">
                    <button
                      onClick={() => { selecionarPerfil(i as 0 | 1); setAberto(false); }}
                      className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${ativo ? "bg-terracotta/8" : "hover:bg-ink/5"}`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ativo ? "bg-terracotta text-cream" : "bg-ink/5 text-ink/50"}`}>
                        <UserCircle2 size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink truncate">{nome}</span>
                        <span className="block text-[11px] text-ink/45">{ativo ? "A trabalhar aqui" : "Tocar para mudar"}</span>
                      </span>
                      {ativo && <Check size={15} className="text-terracotta shrink-0" />}
                    </button>
                    <button onClick={() => renomear(i as 0 | 1)} className="w-8 h-8 rounded-lg text-ink/30 hover:text-ink hover:bg-ink/5 flex items-center justify-center shrink-0" aria-label="Renomear perfil">
                      <Pencil size={13} />
                    </button>
                  </div>
                );
              })}

              {perfis.podeAdicionar && (
                <button
                  onClick={criar}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 mt-1 rounded-xl border border-dashed border-terracotta/40 text-terracotta text-sm font-semibold hover:bg-terracotta/5 transition-colors"
                >
                  <Plus size={15} /> Criar 2.º perfil
                </button>
              )}

              <p className="px-3 pt-2 pb-1.5 text-[11px] text-ink/45 leading-snug">
                Cada perfil tem o seu Documento Mestre. Só trabalhas num de cada vez.
              </p>
            </div>
          )}
        </div>

        {/* Botão Documento Mestre */}
        <Link
          to="/doc-mestre"
          className="inline-flex items-center gap-1.5 text-[13px] pl-3 pr-2.5 py-1.5 bg-ink text-cream rounded-full font-medium transition-all hover:-translate-y-0.5 active:scale-[0.97]"
        >
          <FileText size={13} strokeWidth={2.25} /> Documento Mestre
          <ArrowUpRight size={13} strokeWidth={2.25} />
        </Link>
        </div>
      </div>
    </div>
  );
}

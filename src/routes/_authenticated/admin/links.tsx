import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link2, Copy, Check, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/links")({
  component: LinksPage,
});

const DOMINIO = "https://levezanodigital.com";

type Pagina = { nome: string; path: string };
type Seccao = { titulo: string; paginas: Pagina[] };

const SECCOES: Seccao[] = [
  {
    titulo: "Público",
    paginas: [
      { nome: "Início", path: "/" },
      { nome: "Entrar", path: "/auth" },
      { nome: "Registo (com código)", path: "/registo" },
      { nome: "Recuperar palavra-passe", path: "/reset-password" },
    ],
  },
  {
    titulo: "Geral (aluno)",
    paginas: [
      { nome: "Documento Mestre", path: "/doc-mestre" },
      { nome: "A minha jornada", path: "/minha-base" },
      { nome: "Vitórias", path: "/conquistas" },
      { nome: "Agenda", path: "/agenda" },
      { nome: "Assistente", path: "/assistente" },
      { nome: "Mensagens", path: "/mensagens" },
      { nome: "Glossário", path: "/glossario" },
      { nome: "Jornada (mapa dos pilares)", path: "/metodo" },
      { nome: "Leveza no Digital", path: "/protocolo" },
    ],
  },
  {
    titulo: "Pilar 1 — Crie com Leveza",
    paginas: [
      { nome: "Pilar 1 (início)", path: "/metodo/pilar-1" },
      { nome: "Revise e celebre", path: "/metodo/pilar-1/conclusao" },
    ],
  },
  {
    titulo: "Pilar 2 — Criar Autoridade",
    paginas: [
      { nome: "Pilar 2 (início)", path: "/metodo/pilar-2" },
      { nome: "Pesquisa de Mercado", path: "/metodo/pilar-2/pesquisa-mercado" },
      { nome: "Crie o seu método", path: "/metodo/pilar-2/metodo" },
      { nome: "Identidade de Marca", path: "/metodo/pilar-2/identidade" },
      { nome: "Tom de Voz", path: "/metodo/pilar-2/tom-de-voz" },
      { nome: "Identidade Visual", path: "/metodo/pilar-2/identidade-visual" },
      { nome: "Consultoria de Imagem", path: "/metodo/pilar-2/consultoria-imagem" },
      { nome: "Conclusão Pilar 2", path: "/metodo/pilar-2/conclusao" },
    ],
  },
  {
    titulo: "Conteúdo Todo Dia",
    paginas: [
      { nome: "Boas-vindas", path: "/metodo/pilar-2/redes-sociais?aba=boas-vindas" },
      { nome: "Posicionamento e Bio", path: "/metodo/pilar-2/redes-sociais?aba=bio" },
      { nome: "Formatos de Conteúdo", path: "/metodo/pilar-2/redes-sociais?aba=formatos" },
      { nome: "Criar Conteúdo", path: "/metodo/pilar-2/redes-sociais?aba=criar" },
      { nome: "Plano de Posts", path: "/metodo/pilar-2/redes-sociais?aba=plano" },
      { nome: "30 posts em 30 dias", path: "/metodo/pilar-2/redes-sociais?aba=desafio" },
      { nome: "Publicar", path: "/metodo/pilar-2/redes-sociais?aba=agendar" },
    ],
  },
  {
    titulo: "Pilar 3 — Criar Soluções Digitais",
    paginas: [
      { nome: "Pilar 3 (início)", path: "/metodo/pilar-3" },
      { nome: "Descobrir soluções", path: "/metodo/pilar-3/descobrir" },
      { nome: "Como entregar", path: "/metodo/pilar-3/como-entregar" },
      { nome: "Criar o produto", path: "/metodo/pilar-3/criar-produto" },
      { nome: "Validar o produto", path: "/metodo/pilar-3/validar-produto" },
      { nome: "Página de vendas", path: "/metodo/pilar-3/pagina-vendas" },
      { nome: "Revise e celebre", path: "/metodo/pilar-3/conclusao" },
    ],
  },
  {
    titulo: "Pilar 4 — Aprender a Vender",
    paginas: [
      { nome: "Pilar 4 (início)", path: "/metodo/pilar-4" },
      { nome: "Fundação da Venda", path: "/metodo/pilar-4/fundacao" },
      { nome: "Alto Ticket", path: "/metodo/pilar-4/alto-ticket" },
      { nome: "Lançamentos", path: "/metodo/pilar-4/lancamentos" },
      { nome: "Low Ticket", path: "/metodo/pilar-4/low-ticket" },
      { nome: "Eventos Presenciais", path: "/metodo/pilar-4/eventos-presenciais" },
      { nome: "Copy de Venda", path: "/metodo/pilar-4/copy" },
      { nome: "Tráfego Pago", path: "/metodo/pilar-4/trafego-pago" },
      { nome: "Conclusão Pilar 4", path: "/metodo/pilar-4/conclusao" },
    ],
  },
  {
    titulo: "Academia de IA",
    paginas: [
      { nome: "Academia (início)", path: "/metodo/pilar-1/aprenda-ia" },
      { nome: "Principais IAs", path: "/metodo/pilar-1/aprenda-ia/principais-ias" },
      { nome: "Vídeos profissionais com IA", path: "/metodo/pilar-1/aprenda-ia/videos" },
      { nome: "Ferramentas de produtividade", path: "/metodo/pilar-1/aprenda-ia/produtividade" },
      { nome: "Instalar Skills (Claude)", path: "/metodo/pilar-1/aprenda-ia/claude/instalar-skills" },
    ],
  },
  {
    titulo: "Caminhos especiais",
    paginas: [
      { nome: "Consultoria de IA", path: "/metodo/consultoria-ia" },
      { nome: "Área da Saúde", path: "/metodo/saude" },
    ],
  },
  {
    titulo: "Admin",
    paginas: [
      { nome: "Visão geral", path: "/admin" },
      { nome: "Alunos", path: "/admin/mentoradas" },
      { nome: "Turmas", path: "/admin/turmas" },
      { nome: "Códigos de acesso", path: "/admin/codigos" },
      { nome: "Estrutura & Bloqueios", path: "/admin/estrutura" },
      { nome: "Papéis & Permissões", path: "/admin/papeis" },
      { nome: "Links (esta página)", path: "/admin/links" },
      { nome: "Ranking", path: "/admin/ranking" },
      { nome: "Conteúdo", path: "/admin/conteudo" },
    ],
  },
];

function LinksPage() {
  const [copiado, setCopiado] = useState<string | null>(null);
  const total = SECCOES.reduce((n, s) => n + s.paginas.length, 0);

  async function copiar(url: string) {
    try { await navigator.clipboard?.writeText(url); setCopiado(url); setTimeout(() => setCopiado(null), 1500); } catch { /* ignora */ }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-3 mb-1">
        <Link2 size={22} className="text-terracotta mt-0.5" />
        <div>
          <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-terracotta mb-1">Leveza no Digital</p>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Links das páginas</h1>
          <p className="text-sm text-ink/60 mt-1">Todas as páginas do site com o endereço completo. {total} páginas.</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {SECCOES.map((s) => (
          <div key={s.titulo} className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--color-border)] bg-cream-warm/30">
              <h2 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-ink/60">{s.titulo}</h2>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {s.paginas.map((p) => {
                const url = DOMINIO + p.path;
                return (
                  <div key={p.path} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-sm text-ink font-medium w-48 shrink-0 truncate">{p.nome}</span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[13px] text-ink/55 hover:text-terracotta truncate flex-1 font-mono"
                      title={url}
                    >
                      {url.replace("https://", "")}
                    </a>
                    <button onClick={() => copiar(url)} className="text-ink/35 hover:text-ink shrink-0" aria-label="Copiar link">
                      {copiado === url ? <Check size={15} className="text-sage" /> : <Copy size={15} />}
                    </button>
                    <a href={url} target="_blank" rel="noreferrer" className="text-ink/35 hover:text-ink shrink-0" aria-label="Abrir">
                      <ExternalLink size={15} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

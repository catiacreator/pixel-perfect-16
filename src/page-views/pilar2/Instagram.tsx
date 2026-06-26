import { Link } from "@/lib/router-compat";
import Layout from "../../components/Layout";
import PilarBreadcrumb from "../../components/PilarBreadcrumb";

const FORMATOS = [
  { slug: "posts-unicos", titulo: "Posts Únicos", desc: "Imagem única que comunica uma ideia forte de uma vez só." },
  { slug: "carrossel", titulo: "Carrossel", desc: "Vários slides que conduzem o leitor por uma narrativa." },
  { slug: "stories", titulo: "Stories", desc: "Conteúdo do dia a dia que aproxima e gera intimidade." },
  { slug: "reels", titulo: "Reels", desc: "Vídeos curtos para alcance e descoberta de novos seguidores." },
];

export default function Instagram() {
  return (
    <Layout>
      <PilarBreadcrumb pilar="redes" pilarLabel="Criando para as Redes Sociais" backTo="/metodo/pilar-2/redes-sociais" backLabel="Voltar para Redes Sociais" />
      <div className="px-5 md:px-10 py-10 max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl text-ink mb-2">Instagram</h1>
        <p className="italic text-muted mb-6">Trabalhe os formatos do Instagram.</p>

        <div className="flex items-center justify-between mb-4">
          <p className="font-serif text-lg text-ink">Formatos</p>
          <p className="text-xs text-muted">Clique para entrar em cada jornada</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {FORMATOS.map((f) => (
            <Link key={f.slug} to={`/metodo/pilar-2/redes-sociais/instagram/${f.slug}`} className="rounded-2xl border border-border bg-white p-5 hover:border-terracotta">
              <p className="font-serif text-xl text-ink mb-2">{f.titulo}</p>
              <p className="text-sm text-muted mb-3">{f.desc}</p>
              <span className="text-sm font-semibold text-terracotta">Abrir jornada →</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link to="/metodo/pilar-2/redes-sociais" className="text-sm text-muted">← Voltar para Redes Sociais</Link>
          <Link to="/metodo/pilar-2/pagina-profissional" className="text-sm font-semibold px-4 py-2 rounded-full bg-ink text-cream">
            Página Profissional →
          </Link>
        </div>
      </div>
    </Layout>
  );
}

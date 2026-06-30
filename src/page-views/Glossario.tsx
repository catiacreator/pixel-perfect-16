import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { BookOpen, Search } from "lucide-react";

type Termo = { termo: string; def: string };

const TERMOS: Termo[] = [
  { termo: "IA (Inteligência Artificial)", def: "Tecnologia que faz o computador executar tarefas que normalmente exigiriam um humano — escrever, resumir, criar imagens, responder perguntas." },
  { termo: "LLM (Modelo de Linguagem)", def: "O 'cérebro' por trás de ferramentas como o ChatGPT, Claude e Gemini. Foi treinado com muito texto para prever e gerar linguagem." },
  { termo: "Prompt", def: "A instrução que escreves para a IA. Quanto mais claro e com contexto, melhor o resultado. É a tua 'pergunta' ou 'pedido'." },
  { termo: "Token", def: "Pedaços de palavras que a IA lê e gera. O 'tamanho' de um texto para a IA mede-se em tokens, não em caracteres." },
  { termo: "Contexto", def: "Tudo o que a IA 'tem em mente' numa conversa — as instruções e mensagens anteriores. Quando o contexto enche, ela pode esquecer o início." },
  { termo: "Alucinação", def: "Quando a IA inventa uma informação que parece verdadeira mas é falsa. Confirma sempre dados e fontes importantes." },
  { termo: "GPT / Gem", def: "Assistentes personalizados. Um GPT (ChatGPT) ou Gem (Gemini) é uma IA com instruções e conhecimento específicos para uma tarefa do teu negócio." },
  { termo: "Agente de IA", def: "Uma IA que não só responde, mas executa passos por ti (atender clientes, organizar tarefas) — funciona de forma mais autónoma." },
  { termo: "API", def: "A 'ponte' que liga dois programas. É como uma app fala com outra (ex.: a tua app a falar com o Supabase ou com a IA)." },
  { termo: "Skill (Claude)", def: "Uma capacidade extra que instalas no Claude para ele dominar uma tarefa específica (ex.: criar documentos, fazer ofertas)." },
  { termo: "MCP", def: "Forma de ligar o Claude a ferramentas externas (ficheiros, apps, bases de dados), para ele agir além da conversa." },
  { termo: "Supabase", def: "Base de dados na nuvem usada por apps. Guarda contas, conteúdos e compras — é onde a tua plataforma 'guarda tudo'." },
  { termo: "Claude Code", def: "O Claude a programar por ti: cria e edita código de apps e sites com base no que pedes em linguagem normal." },
  { termo: "Lovable", def: "Ferramenta de 'vibe coding' para criar apps e páginas sem programar — descreves o que queres e ela constrói." },
  { termo: "Vibe Coding", def: "Criar software conversando com a IA em linguagem natural, em vez de escrever código à mão." },
  { termo: "Webhook", def: "Um aviso automático entre sistemas. Ex.: a Hotmart 'avisa' a tua app quando alguém compra, e o acesso desbloqueia sozinho." },
  { termo: "RAG", def: "Técnica que dá à IA os teus documentos para ela responder com base no teu conteúdo, e não só no que aprendeu." },
  { termo: "Embedding", def: "Forma de transformar texto em números para a IA 'encontrar' o que é parecido — usado em buscas inteligentes e RAG." },
  { termo: "DALL·E / Geração de imagem", def: "IA que cria imagens a partir de uma descrição em texto. Útil para capas de Stories, posts e anúncios." },
  { termo: "Fine-tuning", def: "Treinar mais um modelo com os teus próprios exemplos para ele responder no teu estilo. Avançado — raramente necessário no início." },
];

export default function Glossario() {
  const [q, setQ] = useState("");
  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return TERMOS;
    return TERMOS.filter((x) => x.termo.toLowerCase().includes(t) || x.def.toLowerCase().includes(t));
  }, [q]);

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-5 md:px-10 py-12">
        <header className="flex items-start gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/15 flex items-center justify-center text-sky-600">
            <BookOpen size={26} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink tracking-tight">Glossário de IA</h1>
            <p className="text-ink/55 text-sm mt-2 max-w-2xl">
              Os termos técnicos da mentoria, explicados de forma simples. Sem complicação.
            </p>
          </div>
        </header>

        <div className="relative mb-6">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Procurar um termo (ex.: MCP, prompt, API…)"
            className="w-full h-12 pl-11 pr-4 rounded-full border border-[var(--color-border)] bg-white text-sm"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {filtrados.map((t) => (
            <div key={t.termo} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <p className="text-sm font-semibold text-ink">{t.termo}</p>
              <p className="text-sm text-ink/65 mt-2 leading-relaxed">{t.def}</p>
            </div>
          ))}
          {filtrados.length === 0 && (
            <p className="text-sm text-ink/50 sm:col-span-2 text-center py-10">Nenhum termo encontrado.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

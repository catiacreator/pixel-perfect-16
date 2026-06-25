export type Skill = {
  id: string;
  emoji: string;
  nome: string;
  descricao: string;
  file?: string;
};

export const SKILLS_GERAIS: Skill[] = [
  { id: "01", emoji: "🧠", nome: "Segundo Cérebro", descricao: "Cria o documento completo para a IA trabalhar como se fosse você.", file: "/skills/01-segundo-cerebro.md" },
  { id: "02", emoji: "🎯", nome: "Cliente Ideal", descricao: "Mapeia o cliente ideal — dores, desejos, objeções e linguagem.", file: "/skills/02-cliente-ideal.md" },
  { id: "03", emoji: "🕵️", nome: "Mapa do Tempo", descricao: "Mapeia onde perdes tempo, calcula o custo e indica o que automatizar.", file: "/skills/03-detetive-do-tempo.md" },
  { id: "04", emoji: "🎨", nome: "Identidade Visual", descricao: "Paleta, tipografia e mood board para o Instagram.", file: "/skills/04-identidade-visual.md" },
  { id: "05", emoji: "📲", nome: "Conteúdo para Redes Sociais", descricao: "Cria posts — carrossel, Reels, Stories — com estratégia completa.", file: "/skills/05-conteudo-redes-sociais.md" },
  { id: "06", emoji: "💰", nome: "Oferta, Método e Proposta", descricao: "Estrutura o método, precifica com payback e gera proposta e página de vendas.", file: "/skills/06-oferta-metodo-proposta.md" },
  { id: "07", emoji: "🧭", nome: "Bússola", descricao: "Ponto de partida — identifica onde está e direciona o caminho.", file: "/skills/07-bussola.md" },
  { id: "08", emoji: "🤖", nome: "Criar Robô / Skill / Sistema", descricao: "Criar robôs GPT e skills no Claude do zero.", file: "/skills/08-criar-robo-skill-sistema.md" },
  { id: "09", emoji: "🎬", nome: "Clone de Vídeo", descricao: "Workflow completo: foto → HeyGen → edição no CapCut/Captions.", file: "/skills/09-clone-video.md" },
  { id: "10", emoji: "💜", nome: "Lovable", descricao: "Primeiro prompt, poupar créditos, publicar e ligar domínio.", file: "/skills/10-lovable-guia.md" },
  { id: "11", emoji: "🛠️", nome: "Guia de Ferramentas", descricao: "Todas as ferramentas de IA organizadas por categoria.", file: "/skills/11-guia-ferramentas.md" },
  { id: "12", emoji: "🎤", nome: "Evento de IA para Negócios", descricao: "Planear um workshop, GPT Day ou imersão presencial do zero.", file: "/skills/12-evento-ia-negocios.md" },
  { id: "13", emoji: "📣", nome: "Tráfego Pago", descricao: "Quando investir, como criar o criativo e o que copiar do que funciona.", file: "/skills/13-trafego-pago.md" },
  { id: "14", emoji: "📊", nome: "Criar Slides", descricao: "Apresentações visuais em HTML, estilo revista.", file: "/skills/14-criar-slides.md" },
  { id: "15", emoji: "🌐", nome: "Portal Modelo Workshop", descricao: "Construir um portal de workshop no modelo da mentora.", file: "/skills/15-portal-modelo-workshop-anatex.md" },
];


export const SKILLS_NICHO: Skill[] = [
  { id: "saude", emoji: "🩺", nome: "Profissional da Saúde", descricao: "Diagnóstico, plano de 30 dias e prompts prontos.", file: "/skills/skill-saude.md" },
  { id: "direito", emoji: "⚖️", nome: "Direito Jurídico", descricao: "Posicionamento, captação e automação de processos.", file: "/skills/skill-direito.md" },
  { id: "educacao", emoji: "🎓", nome: "Educação", descricao: "Criar cursos, automatizar correções e atrair alunos.", file: "/skills/skill-educacao.md" },
  { id: "marketing", emoji: "📱", nome: "Marketing e Agências", descricao: "Estratégias, automatizar entregas e vender mais.", file: "/skills/skill-marketing.md" },
  { id: "coaching", emoji: "🧘", nome: "Coaches, Mentores e Dev. Humano", descricao: "Programas, follow-ups e como escalar o impacto.", file: "/skills/skill-coaching.md" },
  { id: "beleza", emoji: "✨", nome: "Beleza e Estética", descricao: "Agendamentos, conteúdo e como vender mais.", file: "/skills/skill-estetica.md" },
];

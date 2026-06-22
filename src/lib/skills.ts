export type Skill = {
  id: string;
  emoji: string;
  nome: string;
  descricao: string;
};

export const SKILLS_GERAIS: Skill[] = [
  { id: "01", emoji: "🧠", nome: "Segundo Cérebro", descricao: "Cria o documento completo para a IA trabalhar como se fosse você." },
  { id: "02", emoji: "🎯", nome: "Cliente Ideal", descricao: "Mapeia o cliente ideal — dores, desejos, objeções e linguagem." },
  { id: "03", emoji: "🕵️", nome: "Detetive do Tempo", descricao: "Mapeia onde perdes tempo, calcula o custo e indica o que automatizar." },
  { id: "04", emoji: "🎨", nome: "Identidade Visual", descricao: "Paleta, tipografia e mood board para o Instagram." },
  { id: "05", emoji: "📲", nome: "Conteúdo para Redes Sociais", descricao: "Cria posts — carrossel, Reels, Stories — com estratégia completa." },
  { id: "06", emoji: "💰", nome: "Oferta, Método e Proposta", descricao: "Estrutura o método, precifica com payback e gera proposta e página de vendas." },
  { id: "07", emoji: "🧭", nome: "Bússola", descricao: "Ponto de partida — identifica onde estás e direciona o caminho." },
  { id: "08", emoji: "🤖", nome: "Criar Robô / Skill / Sistema", descricao: "Criar robôs GPT e skills no Claude do zero." },
  { id: "09", emoji: "🎬", nome: "Clone de Vídeo", descricao: "Workflow completo: foto → HeyGen → edição no CapCut/Captions." },
  { id: "10", emoji: "💜", nome: "Lovable", descricao: "Primeiro prompt, poupar créditos, publicar e ligar domínio." },
  { id: "11", emoji: "🛠️", nome: "Guia de Ferramentas", descricao: "Todas as ferramentas de IA organizadas por categoria." },
  { id: "12", emoji: "🎤", nome: "Evento de IA para Negócios", descricao: "Planear um workshop, GPT Day ou imersão presencial do zero." },
  { id: "13", emoji: "📣", nome: "Tráfego Pago", descricao: "Quando investir, como criar o criativo e o que copiar do que funciona." },
  { id: "14", emoji: "📊", nome: "Criar Slides", descricao: "Apresentações visuais em HTML, estilo revista." },
  { id: "15", emoji: "🌐", nome: "Portal Modelo Workshop", descricao: "Construir um portal de workshop no modelo da mentora." },
];

export const SKILLS_NICHO: Skill[] = [
  { id: "saude", emoji: "🩺", nome: "Profissional da Saúde", descricao: "Diagnóstico, plano de 30 dias e prompts prontos." },
  { id: "direito", emoji: "⚖️", nome: "Direito Jurídico", descricao: "Posicionamento, captação e automação de processos." },
  { id: "educacao", emoji: "🎓", nome: "Educação", descricao: "Criar cursos, automatizar correções e atrair alunos." },
  { id: "marketing", emoji: "📱", nome: "Marketing e Agências", descricao: "Estratégias, automatizar entregas e vender mais." },
  { id: "coaching", emoji: "🧘", nome: "Coaches, Mentores e Dev. Humano", descricao: "Programas, follow-ups e como escalar o impacto." },
  { id: "beleza", emoji: "✨", nome: "Beleza e Estética", descricao: "Agendamentos, conteúdo e como vender mais." },
];

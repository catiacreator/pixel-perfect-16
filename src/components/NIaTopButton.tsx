import { Bot, ArrowUpRight } from "lucide-react";

// Assistente N.IA (guia da plataforma): abre o GPT no ChatGPT.
const N_IA_URL = "https://chatgpt.com/g/g-6a41b537791c8191a386fc6731cd45f6-n-ia";

export default function NIaTopButton() {
  return (
    <a
      href={N_IA_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="Assistente N.IA"
      className="hidden md:inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] pl-3.5 pr-3 py-2 border border-ink/20 text-ink rounded-full font-medium hover:bg-ink/5 transition-all"
    >
      <Bot size={14} strokeWidth={2} /> Assistente N.IA
      <ArrowUpRight size={13} strokeWidth={2.25} />
    </a>
  );
}

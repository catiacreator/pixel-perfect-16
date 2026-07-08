import { useState } from "react";
import Layout from "../components/Layout";

// Mini-curso "Carrosséis Virais" — guia de carrosséis de imagem no ChatGPT
// (estilos, cores e ajustes). Estilos com escopo em .cv-root para não vazar.

const CSS = `
.cv-root{
  --bg:#FBFAFF; --ink:#1C1533; --ink-soft:#635A80;
  --magenta:#E5218C; --orange:#FF7A2F; --purple:#7C3AED; --blue:#3B6EF5;
  --line:#EAE4F5; --card:#FFFFFF;
  --grad:linear-gradient(120deg,#E5218C,#FF7A2F);
  --grad2:linear-gradient(120deg,#7C3AED,#3B6EF5);
  --grad-full:linear-gradient(120deg,#E5218C 0%,#FF7A2F 35%,#7C3AED 70%,#3B6EF5 100%);
  --shadow:0 2px 4px rgba(28,21,51,.04),0 16px 34px -18px rgba(124,58,237,.28);
  background:var(--bg); color:var(--ink);
  font-family:'Poppins',system-ui,sans-serif; line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
.cv-root *{box-sizing:border-box;margin:0;padding:0}
.cv-root .wrap{max-width:940px;margin:0 auto;padding:0 24px}

.cv-root .hero{position:relative;padding:70px 0 60px;overflow:hidden}
.cv-root .blob{position:absolute;border-radius:50%;filter:blur(70px);opacity:.5;z-index:0}
.cv-root .blob.a{width:340px;height:340px;background:var(--magenta);top:-120px;right:-60px}
.cv-root .blob.b{width:300px;height:300px;background:var(--blue);bottom:-140px;left:-80px}
.cv-root .blob.c{width:220px;height:220px;background:var(--orange);top:40px;left:40%}
.cv-root .hero-inner{position:relative;z-index:1}
.cv-root .eyebrow{display:inline-block;font-family:'Space Mono',monospace;font-size:.76rem;letter-spacing:.16em;text-transform:uppercase;color:#fff;background:var(--grad);padding:7px 15px;border-radius:999px;font-weight:700}
.cv-root h1{font-weight:900;font-size:clamp(2.2rem,6vw,3.8rem);line-height:1;letter-spacing:-.02em;margin:22px 0 18px}
.cv-root h1 .g{background:var(--grad-full);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.cv-root .lede{font-size:1.12rem;color:var(--ink-soft);max-width:600px}
.cv-root .quick{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}
.cv-root .quick a{font-size:.85rem;font-weight:600;text-decoration:none;color:var(--ink);background:var(--card);border:1px solid var(--line);padding:9px 15px;border-radius:999px;transition:.18s}
.cv-root .quick a:hover{border-color:var(--purple);color:var(--purple);transform:translateY(-2px)}

.cv-root section{padding:56px 0;border-top:1px solid var(--line)}
.cv-root .sec-head{display:flex;align-items:baseline;gap:16px;margin-bottom:34px}
.cv-root .sec-num{font-family:'Space Mono',monospace;font-weight:700;font-size:.9rem;color:#fff;background:var(--grad2);border-radius:9px;padding:5px 10px;flex-shrink:0}
.cv-root h2{font-weight:800;font-size:clamp(1.6rem,4vw,2.3rem);letter-spacing:-.01em;line-height:1.08}
.cv-root .sec-sub{color:var(--ink-soft);margin-top:8px;font-size:1.02rem}
.cv-root .lead-p{color:var(--ink-soft);max-width:660px;font-size:1.05rem}
.cv-root .lead-p b{color:var(--ink)}

.cv-root .flow{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px}
.cv-root .step{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px;box-shadow:var(--shadow);position:relative}
.cv-root .step .n{font-family:'Space Mono',monospace;font-weight:700;font-size:2rem;background:var(--grad-full);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;line-height:1}
.cv-root .step h3{font-size:1.05rem;font-weight:700;margin:8px 0 5px}
.cv-root .step p{font-size:.9rem;color:var(--ink-soft)}

.cv-root .appr{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.cv-root .appr-card{background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:var(--shadow)}
.cv-root .appr-head{padding:16px 20px;font-weight:700;color:#fff;display:flex;align-items:center;gap:10px}
.cv-root .appr-card:nth-child(1) .appr-head{background:var(--grad)}
.cv-root .appr-card:nth-child(2) .appr-head{background:var(--grad2)}
.cv-root .appr-body{padding:20px}
.cv-root .appr-body p{font-size:.92rem;color:var(--ink-soft);margin-bottom:12px}
.cv-root .demo-slide{border-radius:12px;overflow:hidden;border:1px solid var(--line);aspect-ratio:4/5;position:relative;background:#F3EEFF}
.cv-root .demo-slide svg{width:100%;height:100%;display:block}
.cv-root .overlay-txt{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:16px;background:linear-gradient(transparent 40%,rgba(28,21,51,.72))}
.cv-root .overlay-txt .big{color:#fff;font-weight:800;font-size:1.15rem;line-height:1.1}
.cv-root .overlay-txt .small{color:rgba(255,255,255,.85);font-size:.78rem;margin-top:4px}
.cv-root .tip{font-family:'Space Mono',monospace;font-size:.76rem;color:var(--purple);margin-top:14px;background:#F3EEFF;padding:9px 12px;border-radius:8px}

.cv-root .style-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px}
.cv-root .style-card{background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:var(--shadow);transition:transform .2s,box-shadow .2s}
.cv-root .style-card:hover{transform:translateY(-4px);box-shadow:0 20px 40px -20px rgba(124,58,237,.4)}
.cv-root .style-vis{aspect-ratio:1/1;background:#F7F3FF;position:relative}
.cv-root .style-vis svg{width:100%;height:100%;display:block}
.cv-root .style-body{padding:16px 18px}
.cv-root .style-body .nm{font-weight:700;font-size:1.1rem}
.cv-root .style-body .en{font-family:'Space Mono',monospace;font-size:.72rem;color:var(--magenta);text-transform:uppercase;letter-spacing:.06em;display:block;margin:2px 0 8px}
.cv-root .style-body .ds{font-size:.86rem;color:var(--ink-soft);margin-bottom:12px}
.cv-root .style-prompt{background:var(--ink);color:#F0ECFF;border-radius:10px;padding:11px 13px;font-family:'Space Mono',monospace;font-size:.76rem;line-height:1.55;position:relative}
.cv-root .style-prompt .cp{position:absolute;top:8px;right:8px;background:rgba(255,255,255,.1);border:none;color:#F0ECFF;font-family:'Space Mono',monospace;font-size:.68rem;padding:3px 8px;border-radius:6px;cursor:pointer;transition:.15s}
.cv-root .style-prompt .cp:hover{background:var(--magenta)}
.cv-root .style-prompt .cp.done{background:#10B981}
.cv-root .style-prompt .txt{display:block;padding-right:52px}

.cv-root .tool{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:26px;box-shadow:var(--shadow)}
.cv-root .pal-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-bottom:22px}
.cv-root .pal{border-radius:14px;overflow:hidden;border:2px solid transparent;cursor:pointer;transition:transform .15s}
.cv-root .pal:hover{transform:scale(1.03)}
.cv-root .pal.active{border-color:var(--ink);box-shadow:0 0 0 3px var(--bg),0 0 0 5px var(--purple)}
.cv-root .pal .bars{display:flex;height:52px}
.cv-root .pal .bars i{flex:1}
.cv-root .pal .pn{font-size:.82rem;font-weight:600;padding:8px 10px;background:var(--card)}
.cv-root .pal-out{background:var(--ink);color:#F0ECFF;border-radius:12px;padding:15px 17px;font-family:'Space Mono',monospace;font-size:.82rem;line-height:1.6;display:flex;gap:12px;align-items:flex-start}
.cv-root .pal-out .cp{margin-left:auto;flex-shrink:0;background:rgba(255,255,255,.1);border:none;color:#F0ECFF;font-family:'Space Mono',monospace;font-size:.72rem;padding:5px 10px;border-radius:7px;cursor:pointer}
.cv-root .pal-out .cp:hover{background:var(--magenta)}
.cv-root .pal-out .cp.done{background:#10B981}

.cv-root .edit-list{display:grid;gap:13px}
.cv-root .edit{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:var(--shadow)}
.cv-root .edit summary{list-style:none;cursor:pointer;padding:18px 20px;display:flex;gap:14px;align-items:center;font-weight:600}
.cv-root .edit summary::-webkit-details-marker{display:none}
.cv-root .edit .ic{width:38px;height:38px;border-radius:10px;background:var(--grad-full);display:grid;place-items:center;flex-shrink:0;color:#fff;font-weight:700;font-size:1.1rem}
.cv-root .edit .chev{margin-left:auto;color:var(--ink-soft);font-family:'Space Mono',monospace;transition:transform .25s}
.cv-root .edit[open] .chev{transform:rotate(45deg)}
.cv-root .edit .body{padding:0 20px 20px 72px}
.cv-root .edit .body>p{color:var(--ink-soft);font-size:.92rem;margin-bottom:10px}
.cv-root .qbox{background:var(--ink);color:#F0ECFF;border-radius:9px;padding:11px 13px;font-family:'Space Mono',monospace;font-size:.8rem;line-height:1.5;margin-bottom:7px}
.cv-root .qbox::before{content:"\\275D ";color:var(--orange)}

.cv-root .rules{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
.cv-root .rule{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;box-shadow:var(--shadow)}
.cv-root .rule .rn{font-family:'Space Mono',monospace;font-weight:700;color:var(--magenta);font-size:.85rem;margin-bottom:6px}
.cv-root .rule p{font-size:.9rem;color:var(--ink-soft)}
.cv-root .rule b{color:var(--ink)}

.cv-root .cv-footer{padding:56px 0 40px;text-align:center;border-top:1px solid var(--line)}
.cv-root .cv-footer .m{font-weight:900;font-size:1.8rem;background:var(--grad-full);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.cv-root .cv-footer p{color:var(--ink-soft);margin-top:8px}

@media(max-width:640px){.cv-root .appr{grid-template-columns:1fr}.cv-root section{padding:44px 0}.cv-root .edit .body{padding-left:20px}}
`;

const STYLES = [
  { nm: "Traço contínuo", en: "Line art", ds: "Desenho feito de linhas finas, minimalista e elegante. Muito na moda.",
    prompt: "Cria uma ilustração em estilo line art (traço contínuo, linhas finas), minimalista, sobre [tema]. Fundo claro e liso.",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" fill="#FFF3F9"/><path d="M35 85 Q45 40 60 40 Q75 40 85 85" fill="none" stroke="#E5218C" stroke-width="2.5" stroke-linecap="round"/><circle cx="60" cy="32" r="12" fill="none" stroke="#E5218C" stroke-width="2.5"/><path d="M30 60 L90 60" stroke="#E5218C" stroke-width="2.5" stroke-linecap="round"/></svg>` },
  { nm: "Rabisco / mão", en: "Hand-drawn doodle", ds: "Ar de desenho à mão, informal e simpático. Sensação humana e próxima.",
    prompt: "Ilustração estilo hand-drawn doodle (desenho à mão, informal, com imperfeições charmosas) sobre [tema]. Cores [paleta].",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" fill="#FFF6EE"/><path d="M30 80 Q40 55 55 65 Q70 75 60 50 Q50 30 75 40 Q95 48 85 75" fill="none" stroke="#FF7A2F" stroke-width="3.5" stroke-linecap="round"/><circle cx="45" cy="45" r="4" fill="#E5218C"/><path d="M80 85 l8 -8 M84 88 l6 -6" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round"/></svg>` },
  { nm: "Colagem", en: "Collage / cutout", ds: "Formas recortadas e sobrepostas, tipo revista. Enérgico e criativo.",
    prompt: "Imagem em estilo collage / paper cutout (formas recortadas sobrepostas, ar de revista) sobre [tema]. Paleta [cores].",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" fill="#F3EEFF"/><rect x="20" y="25" width="45" height="55" fill="#E5218C" transform="rotate(-8 42 52)"/><rect x="55" y="35" width="42" height="50" fill="#FF7A2F" transform="rotate(6 76 60)"/><circle cx="45" cy="80" r="18" fill="#3B6EF5"/><path d="M70 20 L95 45" stroke="#1C1533" stroke-width="3"/></svg>` },
  { nm: "Vetorial plano", en: "Flat vector", ds: "Cores chapadas, formas limpas, sem sombras. Moderno e profissional.",
    prompt: "Ilustração flat vector (cores chapadas, formas geométricas limpas, sem gradientes) sobre [tema]. Cores [paleta].",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" fill="#EEF0FF"/><circle cx="60" cy="50" r="22" fill="#3B6EF5"/><rect x="35" y="72" width="50" height="28" rx="6" fill="#7C3AED"/><circle cx="50" cy="46" r="4" fill="#fff"/><circle cx="70" cy="46" r="4" fill="#fff"/></svg>` },
  { nm: "3D / render", en: "3D render", ds: "Volume, brilhos e sombras suaves. Ar polido tipo app moderna.",
    prompt: "Render 3D suave (formas com volume, brilhos, sombras leves, estilo claymorphism) sobre [tema]. Paleta [cores].",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" fill="#FFF3F9"/><defs><linearGradient id="cvg3d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E5218C"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs><ellipse cx="60" cy="95" rx="30" ry="8" fill="#1C1533" opacity="0.12"/><circle cx="60" cy="55" r="30" fill="url(#cvg3d)"/><ellipse cx="50" cy="45" rx="10" ry="7" fill="#fff" opacity="0.45"/></svg>` },
  { nm: "Aguarela", en: "Watercolor", ds: "Manchas suaves e translúcidas. Delicado, artístico, feminino.",
    prompt: "Ilustração em aguarela (watercolor, manchas suaves translúcidas, texturas de tinta) sobre [tema]. Cores [paleta].",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" fill="#FFFDF7"/><circle cx="50" cy="50" r="26" fill="#E5218C" opacity="0.5"/><circle cx="72" cy="62" r="24" fill="#FF7A2F" opacity="0.5"/><circle cx="58" cy="72" r="22" fill="#7C3AED" opacity="0.45"/></svg>` },
  { nm: "Retro / riso", en: "Risograph / retro print", ds: "Cores sobrepostas com desalinho, textura de impressão antiga. Charmoso e nostálgico.",
    prompt: "Imagem estilo risograph / retro print (cores sobrepostas, ligeiro desalinho, textura granulada) sobre [tema]. Cores [paleta].",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" fill="#FBF3E3"/><circle cx="55" cy="55" r="28" fill="#FF7A2F"/><circle cx="68" cy="60" r="28" fill="#E5218C" opacity="0.65" style="mix-blend-mode:multiply"/><rect x="30" y="85" width="60" height="6" fill="#3B6EF5"/></svg>` },
  { nm: "Isométrico", en: "Isometric", ds: "Objetos 3D vistos “de esquina”. Ótimo para explicar processos e apps.",
    prompt: "Ilustração isométrica (isometric, objetos 3D vistos em ângulo, linhas limpas) sobre [tema]. Paleta [cores].",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" fill="#EEF0FF"/><path d="M60 40 L88 55 L60 70 L32 55 Z" fill="#3B6EF5"/><path d="M32 55 L60 70 L60 95 L32 80 Z" fill="#7C3AED"/><path d="M88 55 L60 70 L60 95 L88 80 Z" fill="#E5218C"/></svg>` },
  { nm: "Geométrico", en: "Minimal geometric", ds: "Círculos, quadrados e triângulos simples. Sóbrio, ordenado, muito legível.",
    prompt: "Composição minimal geometric (formas geométricas simples, muito espaço em branco) sobre [tema]. Cores [paleta].",
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" fill="#F7F3FF"/><circle cx="45" cy="50" r="20" fill="#E5218C"/><rect x="60" y="35" width="34" height="34" fill="#3B6EF5"/><path d="M40 90 L70 90 L55 65 Z" fill="#FF7A2F"/></svg>` },
];

const PALETTES = [
  { nm: "Vibrante (a da tua marca)", short: "Vibrante", hex: "#E5218C, #FF7A2F, #7C3AED, #3B6EF5", cores: ["#E5218C", "#FF7A2F", "#7C3AED", "#3B6EF5"] },
  { nm: "Pastel suave", short: "Pastel suave", hex: "#F7C9DB, #FBE0C3, #D9C9F5, #C9DBF7", cores: ["#F7C9DB", "#FBE0C3", "#D9C9F5", "#C9DBF7"] },
  { nm: "Terracota quente", short: "Terracota", hex: "#C65D3B, #E3A857, #7A5C42, #F2E4CE", cores: ["#C65D3B", "#E3A857", "#7A5C42", "#F2E4CE"] },
  { nm: "Preto e branco minimal", short: "P&B minimal", hex: "#111111, #555555, #BBBBBB, #F5F5F5", cores: ["#111111", "#555555", "#BBBBBB", "#F5F5F5"] },
  { nm: "Verde natural", short: "Verde natural", hex: "#2F7A5B, #7FB77E, #C7E3B8, #F0F5E9", cores: ["#2F7A5B", "#7FB77E", "#C7E3B8", "#F0F5E9"] },
  { nm: "Azul corporativo", short: "Azul corporativo", hex: "#1E3A8A, #3B6EF5, #93B4FF, #EAF0FF", cores: ["#1E3A8A", "#3B6EF5", "#93B4FF", "#EAF0FF"] },
];

const AJUSTES = [
  { ic: "🎨", t: "Mudar a cor", p: "Nomeia o elemento e a cor nova (de preferência com o HEX).", q: ["Mantém tudo igual, mas muda o fundo para #F3EEFF.", "Deixa as figuras em tons de laranja em vez de azul."], open: true },
  { ic: "📐", t: "Mudar o enquadramento", p: "Pede para afastar, aproximar ou reposicionar o elemento.", q: ["Afasta um pouco a câmara, o elemento está demasiado colado às bordas.", "Deixa mais espaço vazio em cima para eu pôr o título depois."] },
  { ic: "➕", t: "Adicionar ou tirar algo", p: "Diz exatamente o que entra ou sai da imagem.", q: ["Adiciona um telemóvel na mão da personagem.", "Remove as estrelas do fundo, ficou demasiado cheio."] },
  { ic: "🔤", t: "Corrigir o texto na imagem", p: "A IA erra letras com frequência. Reescreve o texto certo entre aspas.", q: ['O texto tem erros. Escreve exatamente: "Postei e sumi".', "Tira todo o texto da imagem, eu escrevo por cima depois."] },
  { ic: "✨", t: "Ajustar o estilo / intensidade", p: "Se o estilo saiu demais ou de menos, calibra.", q: ["Deixa o traço mais fino e o desenho mais minimalista.", "Torna as cores menos saturadas, mais suaves."] },
  { ic: "🔁", t: "Manter a coerência entre slides", p: "O pedido mais importante de todos, para o slide 2, 3, 4…", q: ["Mantém exatamente o mesmo estilo, cores e composição da imagem anterior, mas agora sobre [novo tema]."] },
  { ic: "📱", t: "Acertar o formato", p: "Carrosséis de Instagram são quadrados (1:1) ou verticais (4:5). Pede logo no início.", q: ["Gera a imagem em formato vertical 4:5, para carrossel de Instagram."] },
];

const REGRAS = [
  ["01", "Um estilo só.", " Nunca mistures line art com 3D no mesmo carrossel."],
  ["02", "Uma paleta só.", " As mesmas cores do primeiro ao último slide."],
  ["03", "Formato certo à partida.", " Pede 1:1 ou 4:5 já no primeiro pedido."],
  ["04", "Revê sempre o texto.", " A IA troca letras. Lê antes de publicar."],
  ["05", "Espaço para o texto.", " Se vais escrever por cima, pede áreas mais vazias."],
  ["06", "Uma alteração de cada vez.", " Pedir 5 correções juntas confunde a IA."],
  ["07", "Contraste no texto.", " Texto claro sobre imagem escura, ou vice-versa. Nunca cinza sobre cinza."],
];

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className={`cp${done ? " done" : ""}`}
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "copiado ✓" : "copiar"}
    </button>
  );
}

function SecHead({ num, titulo, sub }: { num: string; titulo: string; sub: string }) {
  return (
    <div className="sec-head">
      <span className="sec-num">{num}</span>
      <div>
        <h2>{titulo}</h2>
        <p className="sec-sub">{sub}</p>
      </div>
    </div>
  );
}

export default function CarrosseisVirais() {
  const [pal, setPal] = useState(0);
  const palPrompt = `Usa esta paleta de cores: ${PALETTES[pal].hex}.`;

  return (
    <Layout>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cv-root">
        {/* HERO */}
        <header className="hero">
          <div className="blob a" /><div className="blob b" /><div className="blob c" />
          <div className="wrap hero-inner">
            <span className="eyebrow">Mini-curso · imagens com IA</span>
            <h1>Carrosséis lindos no <span className="g">ChatGPT</span>, sem saber desenhar.</h1>
            <p className="lede">Escolhe o estilo visual, define as cores, e aprende a pedir ao ChatGPT — e a corrigir — cada slide até ficar exatamente como imaginaste.</p>
            <nav className="quick">
              <a href="#fluxo">Como funciona</a>
              <a href="#abordagens">Imagem vs. texto</a>
              <a href="#estilos">Galeria de estilos</a>
              <a href="#cores">Cores</a>
              <a href="#ajustes">Ajustar slides</a>
            </nav>
          </div>
        </header>

        {/* 00 FLUXO */}
        <section id="fluxo">
          <div className="wrap">
            <SecHead num="00" titulo="Como se cria um carrossel de imagem" sub="Quatro passos. Repete o passo 3 para cada slide, mantendo o mesmo estilo." />
            <div className="flow">
              <div className="step"><div className="n">1</div><h3>Define o estilo</h3><p>Escolhe UM estilo visual e UMA paleta. Todos os slides têm de partilhar isto para o carrossel parecer coeso.</p></div>
              <div className="step"><div className="n">2</div><h3>Descreve o slide</h3><p>Diz o que aparece na imagem e, se quiseres, o texto por cima. Um slide, um pedido.</p></div>
              <div className="step"><div className="n">3</div><h3>Gera e repete</h3><p>Pede a imagem. Depois: “mesma estética, agora o slide 2 sobre…”. Assim mantém a linha visual.</p></div>
              <div className="step"><div className="n">4</div><h3>Ajusta</h3><p>Não saiu bem? Corriges com pedidos precisos (secção Ajustar). Raramente sai perfeito à primeira — é normal.</p></div>
            </div>
            <p className="lead-p" style={{ marginTop: 22 }}><b>Segredo da coerência:</b> a primeira imagem define o “molde”. A partir daí, começa sempre os pedidos seguintes com <b>“mantém exatamente o mesmo estilo, cores e composição”</b>. É isso que faz os slides parecerem uma família e não peças soltas.</p>
          </div>
        </section>

        {/* 01 ABORDAGENS */}
        <section id="abordagens">
          <div className="wrap">
            <SecHead num="01" titulo="Duas abordagens: só imagem ou imagem + texto" sub="Podes deixar o ChatGPT escrever o texto dentro da imagem, ou gerar só a imagem e pôr o texto depois." />
            <div className="appr">
              <div className="appr-card">
                <div className="appr-head">🖼️ Só imagem (texto depois)</div>
                <div className="appr-body">
                  <p>O ChatGPT gera apenas a ilustração. Tu escreves o texto por cima no Canva, no editor do Instagram ou no telemóvel.</p>
                  <div className="demo-slide" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="250" fill="#FCE8F3"/><circle cx="100" cy="105" r="46" fill="none" stroke="#E5218C" stroke-width="3"/><path d="M100 70 L100 140 M74 105 L126 105" stroke="#FF7A2F" stroke-width="3" stroke-linecap="round"/><path d="M55 190 Q100 165 145 190" fill="none" stroke="#7C3AED" stroke-width="3" stroke-linecap="round"/><circle cx="55" cy="190" r="5" fill="#3B6EF5"/><circle cx="145" cy="190" r="5" fill="#3B6EF5"/></svg>` }} />
                  <p style={{ marginTop: 12 }}><b style={{ color: "var(--ink)" }}>Vantagem:</b> controlas o texto ao 100%, corriges erros de ortografia, mudas a fonte quando quiseres.</p>
                  <div className="tip">Melhor quando o texto muda muito ou tem de estar perfeito.</div>
                </div>
              </div>
              <div className="appr-card">
                <div className="appr-head">✍️ Imagem + texto (tudo junto)</div>
                <div className="appr-body">
                  <p>O ChatGPT gera a imagem já com o texto integrado. Mais rápido, mas o texto pode sair com erros ou letras estranhas.</p>
                  <div className="demo-slide">
                    <div dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0;width:100%;height:100%"><rect width="200" height="250" fill="#EEF0FF"/><circle cx="100" cy="90" r="40" fill="none" stroke="#3B6EF5" stroke-width="3"/><path d="M82 90 L95 103 L120 76" fill="none" stroke="#7C3AED" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>` }} />
                    <div className="overlay-txt"><span className="big">3 erros que travam o teu perfil</span><span className="small">desliza para ver →</span></div>
                  </div>
                  <p style={{ marginTop: 12 }}><b style={{ color: "var(--ink)" }}>Vantagem:</b> um só passo, visual muito integrado. <b style={{ color: "var(--ink)" }}>Cuidado:</b> revê sempre o texto gerado.</p>
                  <div className="tip">Melhor para capas de impacto com pouca escrita.</div>
                </div>
              </div>
            </div>
            <p className="lead-p" style={{ marginTop: 22 }}><b>A minha sugestão:</b> capa com texto integrado para impacto, e os slides interiores só imagem com o texto posto por ti. O melhor dos dois mundos.</p>
          </div>
        </section>

        {/* 02 ESTILOS */}
        <section id="estilos">
          <div className="wrap">
            <SecHead num="02" titulo="Galeria de estilos visuais" sub="Cada estilo tem o nome (em inglês, que o ChatGPT entende melhor), uma amostra e um prompt pronto a copiar." />
            <div className="style-grid">
              {STYLES.map((s) => (
                <div className="style-card" key={s.en}>
                  <div className="style-vis" dangerouslySetInnerHTML={{ __html: s.svg }} />
                  <div className="style-body">
                    <div className="nm">{s.nm}</div>
                    <span className="en">{s.en}</span>
                    <p className="ds">{s.ds}</p>
                    <div className="style-prompt"><CopyBtn text={s.prompt} /><span className="txt">{s.prompt}</span></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="lead-p" style={{ marginTop: 24 }}><b>Como escolher:</b> pensa na sensação que queres passar. Aguarela e line art = delicado; colagem e riso = energia e criatividade; flat vector e isométrico = profissional e explicativo. <b>Escolhe UM só por carrossel.</b></p>
          </div>
        </section>

        {/* 03 CORES */}
        <section id="cores">
          <div className="wrap">
            <SecHead num="03" titulo="Cores — escolhe a paleta e copia o pedido" sub="Diz sempre as cores ao ChatGPT com os códigos HEX. É assim que garantes que combinam com a tua marca." />
            <div className="tool">
              <p style={{ fontWeight: 600, marginBottom: 14 }}>Clica numa paleta:</p>
              <div className="pal-grid">
                {PALETTES.map((p, idx) => (
                  <div className={`pal${idx === pal ? " active" : ""}`} key={p.short} onClick={() => setPal(idx)}>
                    <div className="bars">{p.cores.map((c, i) => <i key={i} style={{ background: c }} />)}</div>
                    <div className="pn">{p.short}</div>
                  </div>
                ))}
              </div>
              <div className="pal-out"><span>{palPrompt}</span><CopyBtn text={palPrompt} /></div>
              <p style={{ color: "var(--ink-soft)", fontSize: ".9rem", marginTop: 14 }}><b style={{ color: "var(--ink)" }}>Dica:</b> não uses as 4 cores em cada slide. Escolhe 1 dominante + 1 de destaque e vai variando qual domina. Assim o carrossel é colorido mas continua a parecer da mesma família.</p>
            </div>
          </div>
        </section>

        {/* 04 AJUSTES */}
        <section id="ajustes">
          <div className="wrap">
            <SecHead num="04" titulo="Ajustar um slide que não saiu bem" sub="Quase nunca sai perfeito à primeira. O truque é pedir UMA alteração de cada vez, com precisão. Clica para abrir." />
            <div className="edit-list">
              {AJUSTES.map((a) => (
                <details className="edit" key={a.t} open={a.open}>
                  <summary><span className="ic">{a.ic}</span> {a.t} <span className="chev">+</span></summary>
                  <div className="body">
                    <p>{a.p}</p>
                    {a.q.map((q, i) => <div className="qbox" key={i}>{q}</div>)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 05 REGRAS */}
        <section id="regras">
          <div className="wrap">
            <SecHead num="05" titulo="7 regras de ouro" sub="Guarda estas para o carrossel parecer profissional, não amador." />
            <div className="rules">
              {REGRAS.map(([n, forte, resto]) => (
                <div className="rule" key={n}><div className="rn">{n}</div><p><b>{forte}</b>{resto}</p></div>
              ))}
            </div>
          </div>
        </section>

        <footer className="cv-footer">
          <div className="wrap">
            <div className="m">Agora é criar.</div>
            <p>Escolhe o estilo, define as cores, e faz um slide de cada vez.</p>
          </div>
        </footer>
      </div>
    </Layout>
  );
}

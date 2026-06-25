import { useEffect, useRef, useState } from "react";
import { Upload, Download, ImageOff } from "lucide-react";

type CorFaixa = "terracota" | "sage" | "mostarda";

const CORES: Record<CorFaixa, { label: string; band: string; titulo: string; rodape: string; swatch: string }> = {
  terracota: { label: "Terracota", band: "#7C3D29", titulo: "#F5EFE3", rodape: "#E0A94E", swatch: "#7C3D29" },
  sage: { label: "Sage", band: "#6F8477", titulo: "#F5EFE3", rodape: "#E7D8B5", swatch: "#6F8477" },
  mostarda: { label: "Mostarda", band: "#D9A23C", titulo: "#2A1A10", rodape: "#5C2A1A", swatch: "#D9A23C" },
};

const FOTO_RATIO = 0.58; // fração da altura ocupada pela foto (resto é a faixa)
const TITLE_FONT = '"DM Serif Display", Georgia, serif';
const SANS_FONT = '"DM Sans", system-ui, sans-serif';

export default function ModeloPost() {
  const [titulo, setTitulo] = useState("Conteúdo fácil para publicar hoje");
  const [rodape, setRodape] = useState("Em 15 minutos · @catiacreator");
  const [cor, setCor] = useState<CorFaixa>("terracota");
  const [foto, setFoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const c = CORES[cor];

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setFoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(f);
  };

  // desenha texto com quebra de linha automática, centrado verticalmente num bloco
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ): string[] => {
    const linhas: string[] = [];
    for (const paragrafo of text.split("\n")) {
      const palavras = paragrafo.split(/\s+/).filter(Boolean);
      let linha = "";
      for (const p of palavras) {
        const teste = linha ? `${linha} ${p}` : p;
        if (ctx.measureText(teste).width > maxWidth && linha) {
          linhas.push(linha);
          linha = p;
        } else {
          linha = teste;
        }
      }
      if (linha) linhas.push(linha);
    }
    return linhas;
  };

  const baixarPNG = async () => {
    const W = 1080;
    const H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      await (document as any).fonts?.ready;
    } catch {
      /* segue mesmo sem fontes carregadas */
    }

    const bandTop = Math.round(H * FOTO_RATIO);

    // ---- foto (topo) ----
    if (foto) {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = foto;
      });
      const dw = W;
      const dh = bandTop;
      const scale = Math.max(dw / img.width, dh / img.height);
      const sw = dw / scale;
      const sh = dh / scale;
      const sx = (img.width - sw) / 2;
      const sy = (img.height - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
    } else {
      // cena de marcador de posição (céu / mar / areia)
      ctx.fillStyle = "#C9B79A";
      ctx.fillRect(0, 0, W, bandTop);
      ctx.fillStyle = "#BCD2CF";
      ctx.fillRect(0, 0, W, Math.round(bandTop * 0.55));
      ctx.fillStyle = "#E0A94E";
      ctx.beginPath();
      ctx.arc(W * 0.74, bandTop * 0.22, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6F9A93";
      ctx.fillRect(0, Math.round(bandTop * 0.45), W, Math.round(bandTop * 0.14));
    }

    // ---- faixa de cor (rodapé) ----
    ctx.fillStyle = c.band;
    ctx.fillRect(0, bandTop, W, H - bandTop);

    // ---- título ----
    const padX = 80;
    ctx.fillStyle = c.titulo;
    ctx.textBaseline = "alphabetic";
    ctx.font = `64px ${TITLE_FONT}`;
    const linhas = wrapText(ctx, titulo, W - padX * 2);
    const lineH = 80;
    const blocoH = linhas.length * lineH;
    const bandCenter = bandTop + (H - bandTop) / 2;
    let y = bandCenter - blocoH / 2 + 56;
    for (const l of linhas) {
      ctx.fillText(l, padX, y);
      y += lineH;
    }

    // ---- rodapé ----
    ctx.fillStyle = c.rodape;
    ctx.font = `28px ${SANS_FONT}`;
    try {
      (ctx as any).letterSpacing = "4px";
    } catch {
      /* navegadores sem suporte ignoram */
    }
    ctx.fillText(rodape.toUpperCase(), padX, y + 26);
    try {
      (ctx as any).letterSpacing = "0px";
    } catch {
      /* noop */
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "post-leveza.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
      {/* controlos */}
      <div className="rounded-2xl border border-border bg-white p-5 order-2 md:order-1">
        <h3 className="font-serif text-xl text-ink mb-1">Modelo de post — Foto + faixa</h3>
        <p className="text-sm text-muted mb-4">Edita o texto, escolhe a cor, carrega a tua foto e baixa em PNG (1080×1350).</p>

        <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1">Título</label>
        <textarea
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta resize-none mb-4"
        />

        <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1">Rodapé</label>
        <input
          value={rodape}
          onChange={(e) => setRodape(e.target.value)}
          className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta mb-4"
        />

        <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-2">Cor da faixa</label>
        <div className="flex gap-2 mb-4">
          {(Object.keys(CORES) as CorFaixa[]).map((k) => (
            <button
              key={k}
              onClick={() => setCor(k)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                cor === k ? "border-terracotta text-ink" : "border-border text-muted hover:border-terracotta/50"
              }`}
            >
              <span className="w-4 h-4 rounded-full" style={{ background: CORES[k].swatch }} />
              {CORES[k].label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-border text-ink hover:border-terracotta/50 transition-colors"
          >
            <Upload size={14} /> {foto ? "Trocar foto" : "Carregar foto"}
          </button>
          {foto && (
            <button
              onClick={() => setFoto(null)}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-border text-muted hover:text-terracotta transition-colors"
            >
              <ImageOff size={14} /> Remover
            </button>
          )}
          <button
            onClick={baixarPNG}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-terracotta text-cream hover:bg-terracotta-dark transition-colors"
          >
            <Download size={14} /> Baixar PNG
          </button>
        </div>
      </div>

      {/* pré-visualização */}
      <div className="order-1 md:order-2">
        <div className="relative w-full max-w-[320px] aspect-[4/5] rounded-xl overflow-hidden border border-border mx-auto shadow-sm">
          <div className="absolute top-0 left-0 right-0 overflow-hidden bg-[#C9B79A]" style={{ height: `${FOTO_RATIO * 100}%` }}>
            {foto ? (
              <img src={foto} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg width="100%" height="100%" viewBox="0 0 100 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <rect width="100" height="90" fill="#C9B79A" />
                <rect width="100" height="50" fill="#BCD2CF" />
                <circle cx="74" cy="18" r="9" fill="#E0A94E" />
                <rect y="42" width="100" height="14" fill="#6F9A93" />
              </svg>
            )}
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 flex flex-col justify-center px-5"
            style={{ height: `${(1 - FOTO_RATIO) * 100}%`, background: c.band }}
          >
            <p style={{ fontFamily: TITLE_FONT, color: c.titulo }} className="text-[19px] leading-[1.15] break-words">
              {titulo || "O teu título aqui"}
            </p>
            <p style={{ color: c.rodape, letterSpacing: "2px" }} className="text-[10px] mt-2 uppercase">
              {rodape}
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-muted mt-2">Pré-visualização · 4:5</p>
      </div>
    </div>
  );
}

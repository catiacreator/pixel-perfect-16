// Aula 1.1 — ChatGPT no desktop
//
// Edita este ficheiro para personalizar a página da aula.
// - videoUrl: link de embed (YouTube/Vimeo/Loom)
// - default: conteúdo livre que substitui os tópicos padrão (opcional)

export const videoUrl = "";

export default function Aula() {
  return (
    <div className="space-y-4 text-ink/85 leading-relaxed">
      <p>
        Escreve aqui o texto da aula <strong>ChatGPT no desktop</strong>. Pode usar
        parágrafos, listas, imagens, citações e links.
      </p>
      <p>
        Para colocar o vídeo, edita a constante <code>videoUrl</code> no topo deste
        ficheiro com o link de embed (ex: <code>https://www.youtube.com/embed/XXXX</code>).
      </p>
    </div>
  );
}

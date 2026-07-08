import { createFileRoute } from "@tanstack/react-router";
import CarrosseisVirais from "@/page-views/CarrosseisVirais";

export const Route = createFileRoute("/carrosseis-virais")({
  head: () => ({
    meta: [
      { title: "Carrosséis Virais — Mini-curso" },
      { name: "description", content: "Cria carrosséis de imagem lindos no ChatGPT: estilos, cores e como ajustar cada slide." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" },
    ],
  }),
  component: CarrosseisVirais,
});

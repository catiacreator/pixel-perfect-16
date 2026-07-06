import { createFileRoute } from "@tanstack/react-router";
import MinhaBase from "@/page-views/MinhaBase";

export const Route = createFileRoute("/meus-projetos")({
  head: () => ({ meta: [{ title: "Minha Base — Cátia Creator" }] }),
  component: MinhaBase,
});

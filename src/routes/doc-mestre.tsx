import { createFileRoute } from "@tanstack/react-router";
import DocMestre from "@/page-views/DocMestre";

export const Route = createFileRoute("/doc-mestre")({
  head: () => ({ meta: [{ title: "Doc Mestre — Paraíso Digital" }] }),
  component: DocMestre,
});

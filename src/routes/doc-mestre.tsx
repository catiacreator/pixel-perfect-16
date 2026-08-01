import { createFileRoute } from "@tanstack/react-router";
import DocMestre from "@/page-views/DocMestre";

export const Route = createFileRoute("/doc-mestre")({
  head: () => ({ meta: [{ title: "Doc Mestre — Cátia Creator" }] }),
  component: () => (
    <div className="theme-jornada">
      <DocMestre />
    </div>
  ),
});

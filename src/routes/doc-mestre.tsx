import { createFileRoute } from "@tanstack/react-router";
import PilarSidebar from "@/components/PilarSidebar";
import DocMestre from "@/page-views/DocMestre";

export const Route = createFileRoute("/doc-mestre")({
  head: () => ({ meta: [{ title: "Doc Mestre — Cátia Creator" }] }),
  component: () => (
    <div className="theme-jornada">
      <PilarSidebar pilar={1} />
      <div className="lg:pl-[280px]">
        <DocMestre />
      </div>
    </div>
  ),
});

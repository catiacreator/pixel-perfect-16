import { createFileRoute } from "@tanstack/react-router";
import PilarSidebar from "@/components/PilarSidebar";
import DocMestre from "@/page-views/DocMestre";

export const Route = createFileRoute("/doc-mestre")({
  head: () => ({ meta: [{ title: "Doc Mestre — Leveza no Digital" }] }),
  component: () => (
    <>
      <PilarSidebar pilar={1} />
      <div className="lg:pl-[280px]">
        <DocMestre />
      </div>
    </>
  ),
});

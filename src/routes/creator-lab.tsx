import { createFileRoute } from "@tanstack/react-router";
import CreatorLab from "@/page-views/CreatorLab";

export const Route = createFileRoute("/creator-lab")({
  head: () => ({ meta: [{ title: "Creator LAB — Interno" }] }),
  component: () => (
    <div className="theme-jornada">
      <CreatorLab />
    </div>
  ),
});

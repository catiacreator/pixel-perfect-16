import { createFileRoute } from "@tanstack/react-router";
import Vitrine from "@/page-views/Vitrine";

export const Route = createFileRoute("/vitrine 2")({
  head: () => ({ meta: [{ title: "Cátia Creator" }] }),
  component: Vitrine,
});

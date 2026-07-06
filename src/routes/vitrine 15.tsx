import { createFileRoute } from "@tanstack/react-router";
import Vitrine from "@/page-views/Vitrine";

export const Route = createFileRoute("/vitrine 15")({
  head: () => ({ meta: [{ title: "Cátia Creator" }] }),
  component: Vitrine,
});

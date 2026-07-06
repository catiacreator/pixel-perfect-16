import { createFileRoute } from "@tanstack/react-router";
import Mensagens from "@/page-views/Mensagens";

export const Route = createFileRoute("/mensagens")({
  head: () => ({ meta: [{ title: "Mensagens — Cátia Creator" }] }),
  component: Mensagens,
});

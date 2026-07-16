import { createFileRoute } from "@tanstack/react-router";
import VendasApps from "@/page-views/VendasApps";

export const Route = createFileRoute("/vendas-apps")({
  head: () => ({ meta: [{ title: "Página de vendas e aplicações profissionais — em breve" }] }),
  component: VendasApps,
});

import { createFileRoute } from "@tanstack/react-router";
import Home from "@/page-views/Home";

export const Route = createFileRoute("/metodo/")({
  head: () => ({ meta: [{ title: "Trilha Rápida — Paraíso Digital" }] }),
  component: Home,
});

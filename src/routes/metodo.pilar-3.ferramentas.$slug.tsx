import { createFileRoute } from "@tanstack/react-router";
import Ferramenta from "@/page-views/pilar3/Ferramenta";
export const Route = createFileRoute("/metodo/pilar-3/ferramentas/$slug")({ component: Ferramenta });

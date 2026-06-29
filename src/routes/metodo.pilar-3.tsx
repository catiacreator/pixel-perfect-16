import { createFileRoute, Outlet } from "@tanstack/react-router";
import PilarSidebar from "@/components/PilarSidebar";

export const Route = createFileRoute("/metodo/pilar-3")({
  component: () => (
    <div className="theme-jornada">
      <PilarSidebar pilar={3} />
      <div className="lg:pl-[280px]">
        <Outlet />
      </div>
    </div>
  ),
});

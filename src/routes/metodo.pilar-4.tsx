import { createFileRoute, Outlet } from "@tanstack/react-router";
import PilarSidebar from "@/components/PilarSidebar";

export const Route = createFileRoute("/metodo/pilar-4")({
  component: () => (
    <>
      <PilarSidebar pilar={4} />
      <div className="lg:pl-[280px]">
        <Outlet />
      </div>
    </>
  ),
});

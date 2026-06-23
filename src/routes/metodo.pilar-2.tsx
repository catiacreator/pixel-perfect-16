import { createFileRoute, Outlet } from "@tanstack/react-router";
import PilarSidebar from "@/components/PilarSidebar";

export const Route = createFileRoute("/metodo/pilar-2")({
  component: () => (
    <>
      <PilarSidebar pilar={2} />
      <div className="lg:pl-[280px]">
        <Outlet />
      </div>
    </>
  ),
});

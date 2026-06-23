import { createFileRoute, Outlet } from "@tanstack/react-router";
import PilarSidebar from "@/components/PilarSidebar";

export const Route = createFileRoute("/metodo/pilar-1")({
  component: () => (
    <>
      <PilarSidebar pilar={1} />
      <div className="lg:pl-[280px]">
        <Outlet />
      </div>
    </>
  ),
});

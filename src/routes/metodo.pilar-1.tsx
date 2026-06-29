import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import PilarSidebar from "@/components/PilarSidebar";

function Pilar1Layout() {
  const { pathname } = useLocation();
  const academia = pathname.startsWith("/metodo/pilar-1/aprenda-ia");
  return (
    <div className={academia ? "theme-academia" : "theme-jornada"}>
      <PilarSidebar pilar={academia ? "academia" : 1} />
      <div className="lg:pl-[280px]">
        <Outlet />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/metodo/pilar-1")({
  component: Pilar1Layout,
});

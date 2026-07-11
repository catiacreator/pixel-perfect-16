import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import PilarSidebar from "@/components/PilarSidebar";

function Pilar2Layout() {
  const { pathname } = useLocation();
  const redes = pathname.startsWith("/metodo/pilar-2/redes-sociais") || pathname.startsWith("/metodo/pilar-2/reels-em-serie");
  return (
    <div className={redes ? "theme-redes" : "theme-jornada"}>
      <PilarSidebar pilar={redes ? "redes" : 2} />
      <div className="lg:pl-[280px]">
        <Outlet />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/metodo/pilar-2")({
  component: Pilar2Layout,
});

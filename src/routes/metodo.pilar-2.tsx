import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

function Pilar2Layout() {
  const { pathname } = useLocation();
  const redes = pathname.startsWith("/metodo/pilar-2/redes-sociais") || pathname.startsWith("/metodo/pilar-2/reels-em-serie");
  return (
    <div className={redes ? "theme-redes" : "theme-jornada"}>
      <Outlet />
    </div>
  );
}

export const Route = createFileRoute("/metodo/pilar-2")({
  component: Pilar2Layout,
});

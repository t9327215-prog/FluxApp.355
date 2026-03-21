
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { MainHeader } from "../Componentes/ComponenteDeInterfaceDeUsuario/layout/MainHeader";
import { Footer } from "../Componentes/ComponenteDeInterfaceDeUsuario/layout/Footer";
// CORREÇÃO: O caminho para o Loading estava incorreto e o nome do componente também.
import { LoadingScreen } from "../Componentes/ComponenteDeInterfaceDeUsuario/LoadingScreen";

export const MainLayout = () => {
  return (
    <div className="main-layout">
      <MainHeader />
      <main className="main-content">
        {/* CORREÇÃO: Usando o nome correto do componente no fallback. */}
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

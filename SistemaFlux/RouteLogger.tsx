
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createLogger } from "../ServiçosFrontend/SistemaObservabilidade/Sistema.Mensageiro.Cliente.Backend";

const logger = createLogger("RouteLogger");

const RouteLogger = () => {
  const location = useLocation();

  useEffect(() => {
    logger.info("Navegou para:", { path: location.pathname });
  }, [location]);

  return null;
};

export default RouteLogger;

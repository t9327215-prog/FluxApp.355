
import { useEffect } from "react";
import { createLogger } from "../ServiçosFrontend/SistemaObservabilidade/Sistema.Mensageiro.Cliente.Backend";

const logger = createLogger("GlobalLogger");

const GlobalLogger = () => {
  useEffect(() => {
    logger.info("App iniciado");

    const onOnline = () => logger.info("Internet voltou");
    const onOffline = () => logger.warn("Sem internet");

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return null;
};

export default GlobalLogger;

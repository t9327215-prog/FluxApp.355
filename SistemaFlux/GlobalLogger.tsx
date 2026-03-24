
import { useEffect } from "react";

const GlobalLogger = () => {
  useEffect(() => {
    console.log("App iniciado");

    const onOnline = () => console.log("Internet voltou");
    const onOffline = () => console.log("Sem internet");

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

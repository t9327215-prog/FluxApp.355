
/**
 * Configura e valida o ambiente da aplicação (Nível 2).
 * Isso inclui verificar o modo (produção/desenvolvimento).
 */
export function configurarAmbiente() {
  const isProduction = import.meta.env.MODE === 'production';

  if (!isProduction) {
    // A lógica de simulação foi removida.
    console.log("ℹ️ Modo de Desenvolvimento ATIVADO. A simulação foi desativada.");
  } else {
    console.log("✅ Modo de Produção ATIVADO.");
  }

  console.log("✅ Ambiente (Nível 2) configurado.");
}

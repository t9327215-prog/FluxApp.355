
// ServiçosFrontend/ServiçoDeTelemetria/AuditorDeRequisições.js
import { SafeFetchPatcher } from '../SafeFetchPatcher'; // Corrigido para usar o patcher

const auditorState = {
  isInitialized: false,
};

export function initAuditorDeRequisições() {
  if (auditorState.isInitialized) {
    return;
  }
  auditorState.isInitialized = true;

  console.log("[TELEMETRIA] ✅ Auditor de Requisições inicializado e aplicado ao SafeFetchPatcher.");

  // Aplica o wrapper de telemetria usando o SafeFetchPatcher
  SafeFetchPatcher.apply(async (next, url, config) => {
    const startTime = performance.now();

    try {
      // Chama a próxima função na cadeia (seja o fetch nativo ou outro wrapper)
      const response = await next(url, config);

      const duration = performance.now() - startTime;
      const finalUrl = url.toString();

      // Clona a resposta para ler o status sem consumir o corpo
      const responseForLog = response.clone();
      
      console.log(`[TELEMETRIA] Requisição auditada: ${config?.method || 'GET'} ${finalUrl} - Status: ${responseForLog.status} (${duration.toFixed(2)}ms)`);

      return response; // Retorna a resposta original para a aplicação
    } catch (error) {
      const duration = performance.now() - startTime;
      const finalUrl = url.toString();
      console.error(`[TELEMETRIA] Falha na requisição: ${config?.method || 'GET'} ${finalUrl} (${duration.toFixed(2)}ms)`, error);
      throw error; // Re-lança o erro para não quebrar a aplicação
    }
  });
}

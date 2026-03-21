
// Importações para inicialização de serviços de baixo nível.
import './ServiçosFrontend/ServiçoDeSegurançaDeConteúdo/i18n.js';
import { initAuditorDeRequisições } from './ServiçosFrontend/ServiçoDeTelemetria/AuditorDeRequisições.js';

/**
 * Inicializa os serviços de boot da aplicação (Nível 1).
 * Estes são os primeiros serviços a serem executados, garantindo que o monitoramento de erros
 * e a internacionalização estejam prontos antes de qualquer outra lógica de negócio ou UI.
 */
export function inicializarBoot() {
  // Inicializa o auditor de requisições para telemetria.
  initAuditorDeRequisições();

  // A importação do i18n já garante sua inicialização.
  console.log("✅ Boot (Nível 1) inicializado: Erros, Telemetria, i18n.");
}

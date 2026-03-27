
import { createLogger } from './Sistema.Mensageiro.Cliente.Backend';

/**
 * Logger específico para o sistema de provedores do Flux.
 *
 * Use este logger para registrar eventos relacionados ao ciclo de vida e operação
 * dos provedores de contexto da aplicação (autenticação, interface, etc.).
 */
export const provedorLogger = createLogger('Sistema.Provedores');

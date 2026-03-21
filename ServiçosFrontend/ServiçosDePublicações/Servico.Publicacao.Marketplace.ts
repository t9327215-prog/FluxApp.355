// ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Marketplace.ts

import { config } from "../ValidaçãoDeAmbiente/config.ts";
import { apiMarketplacePublicationService } from "../APIs/APIsServicoPublicacao/API.Servico.Publicacao.Marketplace.ts";
import { mockMarketplacePublicationService } from "../ServiçoDeSimulação/simulacoes/Simulacao.Publicacao.Marketplace.ts";

/**
 * @file Serviço para gerenciar publicações no marketplace.
 *
 * Este arquivo exporta um serviço de publicação do marketplace que pode ser tanto a API real
 * quanto um mock de simulação, dependendo do ambiente configurado.
 * A variável de ambiente `VITE_APP_ENV` controla qual implementação é usada.
 */

// Determina qual serviço usar com base no ambiente
const isSimulation = config.VITE_APP_ENV === 'simulation';

/**
 * @const marketplacePublicationService
 * @description
 * Serviço de publicação do marketplace que se adapta ao ambiente.
 * - Em `production`, usa a API real (`apiMarketplacePublicationService`).
 * - Em `simulation`, usa a versão simulada (`mockMarketplacePublicationService`).
 */
export const marketplacePublicationService = isSimulation
  ? mockMarketplacePublicationService
  : apiMarketplacePublicationService;

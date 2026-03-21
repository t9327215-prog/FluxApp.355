// ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed.ts

import { config } from "../ValidaçãoDeAmbiente/config.ts";
import { apiFeedPublicationService } from "../APIs/APIsServicoPublicacao/API.Servico.Publicacao.Feed.ts";
import { mockFeedPublicationService } from "../ServiçoDeSimulação/simulacoes/Simulacao.Publicacao.Feed.ts";

/**
 * @file Serviço para gerenciar publicações no feed.
 *
 * Este arquivo exporta um serviço de publicação de feed que pode ser tanto a API real
 * quanto um mock de simulação, dependendo do ambiente configurado.
 * A variável de ambiente `VITE_APP_ENV` controla qual implementação é usada.
 */

// Determina qual serviço usar com base no ambiente
const isSimulation = config.VITE_APP_ENV === 'simulation';

/**
 * @const feedPublicationService
 * @description
 * Serviço de publicação de feed que se adapta ao ambiente.
 * - Em `production`, usa a API real (`apiFeedPublicationService`).
 * - Em `simulation`, usa a versão simulada (`mockFeedPublicationService`).
 */
export const feedPublicationService = isSimulation
  ? mockFeedPublicationService
  : apiFeedPublicationService;

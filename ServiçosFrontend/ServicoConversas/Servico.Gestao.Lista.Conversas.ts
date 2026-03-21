import { DadosChat } from '../../../types/Saida/Types.Estrutura.Chat';
import { api } from '../APIs/APIsServicoConversas/API.Servico.Gestao.Lista.Conversas';
import { simulacao } from '../ServiçoDeSimulação/simulacoes/Simulacao.Gestao.Lista.Conversas';
import { config } from '../ValidaçãoDeAmbiente/config';

export const ServicoGestaoListaConversas = {
  async listarConversas(): Promise<DadosChat[]> {
    if (config.VITE_APP_ENV === 'simulation') {
      return await simulacao.listarConversas();
    } else {
      return await api.listarConversas();
    }
  },
};

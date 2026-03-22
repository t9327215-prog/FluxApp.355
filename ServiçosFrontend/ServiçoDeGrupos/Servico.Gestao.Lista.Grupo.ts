import { Grupo } from '../../../types/Saida/Types.Estrutura.Grupos';
import { apiServicoGestaoListaGrupo } from '../APIs/APIsServicoGrupos/API.Servico.Gestao.Lista.Grupo';
import { mockMyGroups, mockPublicGroups } from '../ServiçoDeSimulação/simulacoes/Simulacao.Gestao.Lista.Grupo';
import { config } from '../ValidaçãoDeAmbiente/config';

class ServicoGestaoListaGrupo {

  async obterGrupos(): Promise<Grupo[]> {
    let publicGroupsData: Grupo[] = [];
    let myGroupsData: Grupo[] = [];

    try {
      if (config.VITE_APP_ENV === 'simulation') {
        console.log("[SIMULAÇÃO] Usando dados mocados para a lista de grupos.");
        publicGroupsData = mockPublicGroups;
        myGroupsData = mockMyGroups;
      } else {
        const [pub, mine] = await Promise.all([
          apiServicoGestaoListaGrupo.obterGruposPublicos(),
          apiServicoGestaoListaGrupo.obterMeusGrupos(),
        ]);
        publicGroupsData = pub;
        myGroupsData = mine;
      }

      const allGroupsData = [...(myGroupsData || []), ...(publicGroupsData || [])];
      const uniqueGroupsData = Array.from(new Map(allGroupsData.map(group => [group.id, group])).values());

      return uniqueGroupsData;

    } catch (error) {
      console.error("ServicoGestaoListaGrupo: Falha ao obter e processar grupos:", error);
      return [];
    }
  }

  async excluirGrupo(groupId: string): Promise<void> {
    if (config.VITE_APP_ENV === 'simulation') {
      console.log(`[SIMULAÇÃO] Grupo ${groupId} teria sido excluído.`);
      return Promise.resolve();
    }

    try {
      await apiServicoGestaoListaGrupo.excluirGrupo(groupId);
    } catch (error) {
      console.error(`ServicoGestaoListaGrupo: Erro ao solicitar a exclusão do grupo ${groupId}:`, error);
      throw error;
    }
  }
}

export const servicoGestaoListaGrupo = new ServicoGestaoListaGrupo();

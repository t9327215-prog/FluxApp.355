import ClienteBackend from '../../Cliente.Backend';
import {
    IReceitaServico,
    Receita, ReceitaSchema
} from '../../Contratos/Contrato.Grupo.Receita';

/**
 * @file Implementação do serviço de Receita, com validação de contrato.
 */
class ReceitaAPISupremo implements IReceitaServico {

    /**
     * Busca e valida os dados de receita de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<Receita>}
     */
    async obterReceita(idGrupo: string): Promise<Receita> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/revenue`);
        // Valida se a resposta do backend corresponde ao schema de receita.
        return ReceitaSchema.parse(resposta.data);
    }
}

export default new ReceitaAPISupremo();

import ClienteBackend from '../../Cliente.Backend';
import {
    IPaginaVendasServico,
    PaginaVendas, PaginaVendasSchema,
    AtualizarPaginaVendas, AtualizarPaginaVendasSchema
} from '../../Contratos/Contrato.Grupo.Pagina.Vendas';

/**
 * @file Implementação do serviço da Página de Vendas, com validação de contrato.
 */
class PaginaVendasAPISupremo implements IPaginaVendasServico {

    /**
     * Busca e valida os dados da página de vendas.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<PaginaVendas>}
     */
    async obterPaginaVendas(idGrupo: string): Promise<PaginaVendas> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/sales-page`);
        // Valida se a resposta do backend corresponde ao schema da página de vendas.
        return PaginaVendasSchema.parse(resposta.data);
    }

    /**
     * Valida e atualiza os dados da página de vendas.
     * @param {string} idGrupo - O ID do grupo.
     * @param {AtualizarPaginaVendas} dadosPagina - Os dados a serem atualizados.
     * @returns {Promise<PaginaVendas>}
     */
    async atualizarPaginaVendas(idGrupo: string, dadosPagina: AtualizarPaginaVendas): Promise<PaginaVendas> {
        // 1. Valida o payload de atualização antes de enviá-lo.
        const dadosValidados = AtualizarPaginaVendasSchema.parse(dadosPagina);
        
        // 2. Envia os dados validados para o backend.
        const resposta = await ClienteBackend.put(`/groups/${idGrupo}/sales-page`, dadosValidados);

        // 3. Valida a resposta do backend (geralmente o objeto atualizado).
        return PaginaVendasSchema.parse(resposta.data);
    }
}

export default new PaginaVendasAPISupremo();

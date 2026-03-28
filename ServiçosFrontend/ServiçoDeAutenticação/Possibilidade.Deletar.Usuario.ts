
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

// Interface para o resultado da operação de deleção.
export interface IResultadoDelecao {
    sucesso: boolean;
    mensagem: string;
}

// Interface para a dependência do provedor de infraestrutura (Injeção de Dependência).
interface IInfraProvider {
    delete<T = any>(url: string): Promise<{ data: T }>;
}

const logger = createServiceLogger('PossibilidadeDeletarUsuario');

/**
 * Encapsula a lógica de negócio para deletar um usuário.
 * @param id - O ID do usuário a ser deletado.
 * @param infraProvider - A instância do provedor de infraestrutura para realizar a chamada de API.
 * @returns Uma promise que resolve para o resultado da operação de deleção.
 */
export const deletarUsuario = async (
    id: string,
    infraProvider: IInfraProvider
): Promise<IResultadoDelecao> => {
    const operation = 'deletarUsuario';
    logger.logOperationStart(operation, { userId: id });

    try {
        // Usa o provedor injetado para fazer a chamada DELETE para o endpoint do usuário.
        await infraProvider.delete(`/usuarios/${id}`);

        logger.logOperationSuccess(operation, { userId: id });

        return {
            sucesso: true,
            mensagem: "Usuário deletado com sucesso!",
        };
    } catch (error: any) {
        logger.logOperationError(operation, error, { userId: id });

        return {
            sucesso: false,
            mensagem: error.message || "Ocorreu um erro ao deletar o usuário.",
        };
    }
};

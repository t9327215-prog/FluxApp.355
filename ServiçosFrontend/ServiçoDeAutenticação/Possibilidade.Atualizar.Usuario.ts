
import { IUsuario } from './Processo.Login';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

// Interface para os dados que podem ser atualizados no perfil do usuário.
// Usamos Partial<IUsuario> para indicar que nem todos os campos são obrigatórios.
export interface IAtualizacaoUsuarioParams extends Partial<IUsuario> {
    id: string; // O ID é obrigatório para saber qual usuário atualizar.
}

// Interface para o resultado da operação de atualização.
export interface IResultadoAtualizacao {
    sucesso: boolean;
    mensagem: string;
    usuarioAtualizado?: IUsuario;
}

// Interface para a dependência do provedor de infraestrutura (Injeção de Dependência).
interface IInfraProvider {
    put<T = any>(url: string, data?: any): Promise<{ data: T }>;
}

const logger = createServiceLogger('PossibilidadeAtualizarUsuario');

/**
 * Encapsula a lógica de negócio para atualizar o perfil de um usuário.
 * @param dadosAtualizacao - Os dados a serem atualizados, incluindo o ID do usuário.
 * @param infraProvider - A instância do provedor de infraestrutura para realizar a chamada de API.
 * @returns Uma promise que resolve para o resultado da operação de atualização.
 */
export const atualizarUsuario = async (
    dadosAtualizacao: IAtualizacaoUsuarioParams,
    infraProvider: IInfraProvider
): Promise<IResultadoAtualizacao> => {
    const { id, ...dadosParaAtualizar } = dadosAtualizacao;
    const operation = 'atualizarUsuario';
    logger.logOperationStart(operation, { userId: id });

    try {
        // Usa o provedor injetado para fazer a chamada PUT para o endpoint do usuário.
        const response = await infraProvider.put<IUsuario>(`/usuarios/${id}`, dadosParaAtualizar);
        const usuarioAtualizado = response.data;

        logger.logOperationSuccess(operation, { userId: id });

        return {
            sucesso: true,
            mensagem: "Perfil atualizado com sucesso!",
            usuarioAtualizado: usuarioAtualizado,
        };
    } catch (error: any) {
        logger.logOperationError(operation, error, { userId: id });

        return {
            sucesso: false,
            mensagem: error.message || "Ocorreu um erro ao atualizar o perfil.",
        };
    }
};

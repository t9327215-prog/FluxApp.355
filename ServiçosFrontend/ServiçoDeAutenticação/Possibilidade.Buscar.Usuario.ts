
import { IUsuario } from './Processo.Login';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

// Definindo uma interface mínima para a dependência que será injetada.
// Isso garante que qualquer objeto passado tenha o método `get`.
interface IInfraProvider {
    get<T = any>(url: string): Promise<{ data: T }>;
}

const logger = createServiceLogger('PossibilidadeBuscarUsuario');

/**
 * Encapsula a lógica de negócio para buscar um usuário por ID.
 * Recebe o provedor de infraestrutura como uma dependência (injeção de dependência).
 * @param id - O ID do usuário a ser buscado.
 * @param infraProvider - A instância do provedor de infraestrutura para realizar a chamada de API.
 * @returns A promise que resolve para os dados do usuário.
 */
export const buscarUsuario = async (
    id: string,
    infraProvider: IInfraProvider
): Promise<IUsuario> => {
    const operation = 'buscarUsuario';
    logger.logOperationStart(operation, { id });

    try {
        // Usa o provedor injetado para fazer a chamada.
        // O endpoint `/usuarios/${id}` corresponde à rota da API.
        const response = await infraProvider.get<IUsuario>(`/usuarios/${id}`);
        const usuario = response.data;

        logger.logOperationSuccess(operation, { usuarioId: usuario.id });
        return usuario;
    } catch (error) {
        logger.logOperationError(operation, error, { id });
        // Lança o erro para que o chamador (o serviço) possa tratá-lo.
        throw error;
    }
};

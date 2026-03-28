
import { IUsuario } from './Processo.Login';
import { IRegistroParams, IResultadoRegistro } from './Processo.Registrar';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

// Interface para a dependência do provedor de infraestrutura (Injeção de Dependência)
interface IInfraProvider {
    post<T = any>(url: string, data?: any): Promise<{ data: T }>;
}

const logger = createServiceLogger('PossibilidadeCriarUsuario');

/**
 * Encapsula a lógica de negócio para criar (registrar) um novo usuário.
 * @param dadosRegistro - Os dados para o registro do usuário (nome, email, senha, etc.).
 * @param infraProvider - A instância do provedor de infraestrutura para realizar a chamada de API.
 * @returns Uma promise que resolve para o resultado da operação de registro.
 */
export const criarUsuario = async (
    dadosRegistro: IRegistroParams,
    infraProvider: IInfraProvider
): Promise<IResultadoRegistro> => {
    const operation = 'criarUsuario';
    logger.logOperationStart(operation, { email: dadosRegistro.email });

    // 1. Validação de Regra de Negócio: Garante que as senhas fornecidas são idênticas.
    if (dadosRegistro.senha !== dadosRegistro.confirmacaoSenha) {
        const error = new Error("As senhas não conferem.");
        logger.logOperationError(operation, error, { email: dadosRegistro.email });
        return { sucesso: false, mensagem: error.message };
    }

    try {
        // 2. Chamada para a camada de infraestrutura via dependência injetada.
        const respostaAPI = await infraProvider.post<{ usuario: IUsuario }>('/auth/registrar', dadosRegistro);
        
        logger.logOperationSuccess(operation, { usuarioId: respostaAPI.data.usuario.id });
        
        // 3. Retorno do resultado de sucesso, encapsulado em um objeto.
        return { 
            sucesso: true, 
            mensagem: "Registro bem-sucedido!", 
            usuario: respostaAPI.data.usuario 
        };
    } catch (error: any) {
        logger.logOperationError(operation, error, { email: dadosRegistro.email });
        
        // 4. Tratamento de erro e retorno de uma resposta clara sobre a falha.
        return { 
            sucesso: false, 
            mensagem: error.message || "Ocorreu um erro desconhecido durante o registro." 
        };
    }
};


import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import { servicoGestaoPerfil } from '../ServiçosFrontend/ServiçoDeAutenticação/Servico.Gestao.Perfil';

// --- Tipos de Log (espelhado de Requisicao.Autenticacao.ts) ---
export type LogEntry = { level: 'log' | 'warn' | 'error'; messages: any[] };

// --- Definições de Tipos para Requisições de Gestão de Perfil ---

export interface RequisicaoGetOwnProfile {
    tipo: 'GET_OWN_PROFILE';
}

export interface RequisicaoGetPublicProfile {
    tipo: 'GET_PUBLIC_PROFILE';
    payload: { username: string };
}

export interface RequisicaoUpdateProfile {
    tipo: 'UPDATE_PROFILE';
    payload: { userId: string; profileData: Partial<Usuario> };
}

export type RequisicaoPerfil = 
    | RequisicaoGetOwnProfile 
    | RequisicaoGetPublicProfile 
    | RequisicaoUpdateProfile;

// A resposta da operação, separada dos logs.
export interface RespostaRequisicaoPerfil {
    sucesso: boolean;
    mensagem: string;
    dados?: any;
}

// O que o manipulador retorna: o resultado E os logs.
export interface RespostaComLogs {
    resposta: RespostaRequisicaoPerfil;
    logs: LogEntry[];
}

/**
 * Manipulador central para todas as requisições de gestão de perfil.
 * Retorna o resultado da operação e uma lista de eventos de log.
 */
export const manipularRequisicaoPerfil = async (req: RequisicaoPerfil): Promise<RespostaComLogs> => {
    const logs: LogEntry[] = [{ level: 'log', messages: [`Manipulando requisição de perfil: ${req.tipo}`] }];

    try {
        let resultado: any;
        switch (req.tipo) {
            case 'GET_OWN_PROFILE':
                resultado = await servicoGestaoPerfil.getOwnProfile();
                break;
            case 'GET_PUBLIC_PROFILE':
                resultado = await servicoGestaoPerfil.getPublicProfileByUsername(req.payload.username);
                break;
            case 'UPDATE_PROFILE':
                resultado = await servicoGestaoPerfil.updateProfile(req.payload.userId, req.payload.profileData);
                break;
            default:
                const _exhaustiveCheck: never = req;
                const errorMessage = `Tipo de requisição de perfil não suportado.`;
                logs.push({ level: 'error', messages: [errorMessage] });
                return {
                    resposta: { sucesso: false, mensagem: errorMessage },
                    logs: logs
                };
        }

        return {
            resposta: { sucesso: true, mensagem: `Operação ${req.tipo} realizada com sucesso.`, dados: resultado },
            logs: logs
        };

    } catch (erro) {
        const errorMessage = erro instanceof Error ? erro.message : "Ocorreu um erro desconhecido.";
        logs.push({ level: 'error', messages: [`Erro ao manipular requisição de perfil ${req.tipo}:`, erro] });

        return {
            resposta: { sucesso: false, mensagem: errorMessage },
            logs: logs
        };
    }
};

// --- Funções Fábrica (sem alterações) ---

export const criarRequisicaoGetOwnProfile = (): RequisicaoGetOwnProfile => ({
    tipo: 'GET_OWN_PROFILE',
});

export const criarRequisicaoGetPublicProfile = (username: string): RequisicaoGetPublicProfile => ({
    tipo: 'GET_PUBLIC_PROFILE',
    payload: { username },
});

export const criarRequisicaoUpdateProfile = (userId: string, profileData: Partial<Usuario>): RequisicaoUpdateProfile => ({
    tipo: 'UPDATE_PROFILE',
    payload: { userId, profileData },
});

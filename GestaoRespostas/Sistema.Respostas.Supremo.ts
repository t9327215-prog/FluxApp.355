
import { processarRespostaAutenticacao, RespostaAutenticacao } from "./Resposta.Autenticacao";
import { processarRespostaPerfil, RespostaPerfil } from "./Resposta.GestaoPerfil";

// --- Tipos Agregados ---

/**
 * Um tipo unificado que representa qualquer resposta que o sistema pode processar.
 * Isso permite que o sistema central trate diferentes tipos de respostas de forma polimórfica.
 */
export type RespostaSuprema = RespostaAutenticacao | RespostaPerfil;

// --- Type Guards para identificar o tipo da resposta ---

const isRespostaAutenticacao = (res: RespostaSuprema): res is RespostaAutenticacao => {
    // Verifica se a propriedade 'contexto' pertence ao domínio de Autenticação.
    return ['AUTENTICACAO_LOGIN', 'AUTENTICACAO_REGISTRO', 'AUTENTICACAO_LOGOUT'].includes(res.contexto);
};

const isRespostaPerfil = (res: RespostaSuprema): res is RespostaPerfil => {
    // Verifica se a propriedade 'contexto' pertence ao domínio de Gestão de Perfil.
    return ['PERFIL_PROPRIO', 'PERFIL_PUBLICO', 'PERFIL_ATUALIZACAO'].includes(res.contexto);
};


/**
 * Processador central para todas as respostas do sistema.
 * Recebe uma resposta, identifica seu contexto, e a delega para o manipulador correto.
 *
 * @param res A resposta a ser processada.
 * @returns O resultado do processamento da resposta, que pode variar conforme o manipulador.
 */
export const processarRespostaSuprema = (res: RespostaSuprema) => {
    if (isRespostaAutenticacao(res)) {
        return processarRespostaAutenticacao(res);
    }

    if (isRespostaPerfil(res)) {
        return processarRespostaPerfil(res);
    }

    // Fallback para contextos de resposta desconhecidos.
    console.error("Contexto de resposta desconhecido:", (res as any).contexto);
    // Pode-se optar por lançar um erro ou retornar um estado padrão.
    return { sucesso: false, mensagem: "Não foi possível processar a resposta de contexto desconhecido." };
};

// --- Re-exportando para um ponto de acesso único (se necessário no futuro) ---
export * from './Resposta.Autenticacao';
export * from './Resposta.GestaoPerfil';


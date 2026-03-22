
import { Usuario } from "../../types/Saida/Types.Estrutura.Usuario";

// --- Definições de Tipos para Respostas de Gestão de Perfil ---

/**
 * Define a estrutura de uma resposta de gestão de perfil.
 * @param contexto - A operação específica que gerou a resposta.
 * @param sucesso - Se a operação foi bem-sucedida.
 * @param dados - Os dados resultantes (ex: um objeto de usuário).
 * @param mensagem - Mensagem descritiva.
 */
export interface RespostaPerfil {
    contexto: 'PERFIL_PROPRIO' | 'PERFIL_PUBLICO' | 'PERFIL_ATUALIZACAO';
    sucesso: boolean;
    dados?: Partial<Usuario> | any;
    mensagem: string;
}

// --- Funções Fábrica para criar respostas de perfil ---

export const criarRespostaPerfilProprio = (sucesso: boolean, dados: Partial<Usuario>, mensagem: string): RespostaPerfil => ({
    contexto: 'PERFIL_PROPRIO',
    sucesso,
    dados,
    mensagem,
});

export const criarRespostaPerfilPublico = (sucesso: boolean, dados: any, mensagem: string): RespostaPerfil => ({
    contexto: 'PERFIL_PUBLICO',
    sucesso,
    dados,
    mensagem,
});

export const criarRespostaAtualizacaoPerfil = (sucesso: boolean, mensagem: string): RespostaPerfil => ({
    contexto: 'PERFIL_ATUALIZACAO',
    sucesso,
    mensagem,
});

/**
 * Processa uma resposta de gestão de perfil.
 * A lógica aqui seria primariamente para atualizar o estado da UI com os novos dados.
 *
 * @param res A resposta de gestão de perfil a ser processada.
 */
export const processarRespostaPerfil = (res: RespostaPerfil) => {
    console.log(`[Processador de Resposta de Perfil] Contexto: ${res.contexto}, Sucesso: ${res.sucesso}`);

    if (!res.sucesso) {
        // Lógica para falhas (ex: exibir notificação de erro)
        console.error(`Falha na operação de perfil: ${res.mensagem}`);
        return;
    }

    // Lógica para sucesso
    switch (res.contexto) {
        case 'PERFIL_PROPRIO':
            // Ex: Atualizar o estado global do usuário com os dados recebidos.
            console.log("Dados do perfil próprio recebidos:", res.dados);
            // Exemplo: store.dispatch(updateUser(res.dados));
            break;
        case 'PERFIL_PUBLICO':
            // Ex: Exibir os dados do perfil público na página correspondente.
            console.log("Dados do perfil público recebidos:", res.dados);
            // Exemplo: renderProfilePage(res.dados);
            break;
        case 'PERFIL_ATUALIZACAO':
            // Ex: Exibir uma notificação de sucesso.
            console.log("Perfil atualizado com sucesso.");
            // Exemplo: showSuccessToast("Seu perfil foi atualizado!");
            break;
    }

    return { sucesso: true, mensagem: "Resposta de perfil processada com sucesso." };
};


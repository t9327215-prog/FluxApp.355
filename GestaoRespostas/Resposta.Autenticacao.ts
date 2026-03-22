
// --- Definições de Tipos para Respostas de Autenticação ---

/**
 * Define a estrutura de uma resposta de autenticação.
 * @param contexto - Identifica a operação específica que gerou a resposta (ex: LOGIN, REGISTRO).
 * @param sucesso - Indica se a operação foi bem-sucedida.
 * @param dados - Contém os dados retornados pela operação (ex: token de usuário, informações de perfil).
 * @param mensagem - Uma mensagem descritiva sobre o resultado da operação.
 */
export interface RespostaAutenticacao {
    contexto: 'AUTENTICACAO_LOGIN' | 'AUTENTICACAO_REGISTRO' | 'AUTENTICACAO_LOGOUT';
    sucesso: boolean;
    dados?: any;
    mensagem: string;
}

// --- Funções Fábrica para criar respostas de autenticação ---

export const criarRespostaLogin = (sucesso: boolean, dados: any, mensagem: string): RespostaAutenticacao => ({
    contexto: 'AUTENTICACAO_LOGIN',
    sucesso,
    dados,
    mensagem,
});

export const criarRespostaRegistro = (sucesso: boolean, mensagem: string): RespostaAutenticacao => ({
    contexto: 'AUTENTICACAO_REGISTRO',
    sucesso,
    mensagem,
});

export const criarRespostaLogout = (sucesso: boolean, mensagem: string): RespostaAutenticacao => ({
    contexto: 'AUTENTICACAO_LOGOUT',
    sucesso,
    mensagem,
});

/**
 * Processa uma resposta de autenticação, executando a lógica de UI correspondente.
 * Por exemplo, pode redirecionar o usuário, atualizar o estado da UI, exibir notificações, etc.
 *
 * @param res A resposta de autenticação a ser processada.
 */
export const processarRespostaAutenticacao = (res: RespostaAutenticacao) => {
    console.log(`[Processador de Resposta de Autenticação] Contexto: ${res.contexto}, Sucesso: ${res.sucesso}`);

    if (!res.sucesso) {
        // Lógica para lidar com falhas (ex: exibir uma notificação de erro)
        // alert(`Erro: ${res.mensagem}`);
        console.error(`Falha na operação de autenticação: ${res.mensagem}`);
        return; // Interrompe o processamento se a operação falhou
    }

    // Lógica para lidar com sucesso
    switch (res.contexto) {
        case 'AUTENTICACAO_LOGIN':
            // Ex: Armazenar token, redirecionar para o dashboard
            console.log("Usuário logado com sucesso. Redirecionando...");
            // Exemplo: localStorage.setItem('userToken', res.dados.token);
            // Exemplo: window.location.href = '/dashboard';
            break;
        case 'AUTENTICACAO_REGISTRO':
            // Ex: Redirecionar para a página de login com uma mensagem de sucesso
            console.log("Registro bem-sucedido. Por favor, faça o login.");
            // Exemplo: window.location.href = '/login?status=registered';
            break;
        case 'AUTENTICACAO_LOGOUT':
            // Ex: Limpar dados de sessão, redirecionar para a página inicial
            console.log("Logout realizado com sucesso. Redirecionando...");
            // Exemplo: localStorage.removeItem('userToken');
            // Exemplo: window.location.href = '/';
            break;
    }

    // Retornar um resultado padronizado, se necessário
    return { sucesso: true, mensagem: "Resposta de autenticação processada com sucesso." };
};

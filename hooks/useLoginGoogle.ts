
import { useState } from 'react';
import { servicoDeAplicacaoDeAutenticacao } from '../ServiçosFrontend/ServicosDeAplicacao/Autenticacao.ServicoDeAplicacao';

/**
 * Hook para gerenciar o estado da UI durante o processo de login com Google.
 */
export const useLoginGoogle = () => {
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    /**
     * Inicia o fluxo de login com Google, delegando a lógica para o serviço de aplicação
     * e gerenciando o estado de carregamento e erro da UI.
     */
    const iniciarLoginComGoogle = () => {
        setProcessando(true);
        setErro(null);

        try {
            // Delega a lógica de negócio para a camada de aplicação
            servicoDeAplicacaoDeAutenticacao.iniciarLoginComGoogle();
            // Como a página é redirecionada, o estado de `processando` não será alterado para `false` aqui.
            // A navegação interrompe a execução deste código.

        } catch (err: any) {
            // Captura erros lançados pelo serviço de aplicação (ex: falha na configuração)
            setErro(err.message || 'Ocorreu um erro ao iniciar o login com Google.');
            setProcessando(false);
        }
    };

    return { 
        iniciarLoginComGoogle, 
        processandoLoginGoogle: processando, 
        erroLoginGoogle: erro 
    };
};

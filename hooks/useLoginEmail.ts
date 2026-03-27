
import { useState } from 'react';
import { servicoDeAplicacaoDeAutenticacao } from '../ServiçosFrontend/ServicosDeAplicacao/Autenticacao.ServicoDeAplicacao';
import { ILoginEmailParams } from '../ServiçosFrontend/Contratos/Contrato.Autenticacao';

export const useLoginEmail = () => {
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');

    const loginComEmail = async (params: ILoginEmailParams) => {
        const { email } = params;
        
        setProcessando(true);
        setErro('');

        try {
            // A única responsabilidade do Hook agora é chamar o serviço de aplicação
            // e gerenciar o estado da UI (processando, erro).
            await servicoDeAplicacaoDeAutenticacao.loginComEmail(params);
            
            // O sucesso é implícito; o estado é limpo e o processamento para.
            // A atualização do estado global da sessão é feita por outro mecanismo (useSessao)

        } catch (err: any) {
            // O serviço de aplicação lança um erro que é capturado aqui.
            setErro(err.message || 'Credenciais inválidas.');
        } finally {
            setProcessando(false);
        }
    };

    return {
        processandoLoginEmail: processando,
        erroLoginEmail: erro,
        setErroLoginEmail: setErro,
        loginComEmail,
    };
};


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoDeAplicacaoDeAutenticacao } from '../ServiçosFrontend/ServicosDeAplicacao/Autenticacao.ServicoDeAplicacao';

/**
 * Hook para gerenciar o estado da UI durante o processo de logout.
 */
export const useLogout = () => {
    const navigate = useNavigate();
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');

    /**
     * Executa o logout, delegando a lógica para o serviço de aplicação e cuidando
     * do estado da UI e do redirecionamento após a conclusão.
     */
    const submeterLogout = async () => {
        setProcessando(true);
        setErro('');
        
        try {
            // 1. Delega a lógica de negócio
            await servicoDeAplicacaoDeAutenticacao.logout();
            
            // 2. Lida com os efeitos colaterais da UI (redirecionamento)
            navigate('/login');

        } catch (err: any) {
            // 3. Gerencia o estado de erro da UI
            setErro(err.message || 'Falha ao fazer logout.');
        } finally {
            // 4. Garante que o estado de processamento seja limpo
            setProcessando(false);
        }
    };

    return {
        processandoLogout: processando,
        erroLogout: erro,
        submeterLogout,
    };
};

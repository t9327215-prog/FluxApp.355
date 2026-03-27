
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { createHookLogger } from '../ServiçosFrontend/SistemaObservabilidade/Log.Hook';
import { useSessao } from './useSessao';

const hookLogger = createHookLogger('useLogout');

export const useLogout = () => {
    const { usuario } = useSessao();
    const navigate = useNavigate();
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');

    const submeterLogout = async () => {
        hookLogger.logStart('submeterLogout', { userId: usuario?.id });
        setProcessando(true);
        setErro('');
        
        try {
            await servicoAutenticacao.logout();
            hookLogger.logSuccess('submeterLogout', { userId: usuario?.id });
            navigate('/login');
        } catch (err: any) {
            hookLogger.logError('submeterLogout', err, { userId: usuario?.id });
            setErro(err.message || 'Falha ao fazer logout.');
        } finally {
            setProcessando(false);
        }
    };

    return {
        processando,
        erro,
        setErro,
        submeterLogout,
    };
};

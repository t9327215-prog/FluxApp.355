
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';

export const HookBanido = () => {
    const navigate = useNavigate();
    const [reason, setReason] = useState('Violação das diretrizes da comunidade.');
    const user = SistemaAutenticacaoSupremo.getCurrentUser();

    useEffect(() => {
        if (user && user.isBanned) {
            setReason(user.banReason || 'Violação das diretrizes da comunidade.');
        } else if (user && !user.isBanned) {
            navigate('/feed', { replace: true });
        } else if (!user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const handleLogout = () => {
        SistemaAutenticacaoSupremo.logout();
        navigate('/', { replace: true });
    };

    return { reason, handleLogout };
};

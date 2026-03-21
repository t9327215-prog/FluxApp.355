import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const HookPonteSucesso = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleSuccess = async () => {
            const query = new URLSearchParams(location.search);
            const sessionId = query.get('session_id');

            if (sessionId) {
                // A lógica de redirecionamento precisa ser movida para um serviço apropriado.

                // Lógica de redirecionamento temporariamente comentada até movermos para o lugar certo.
                /*
                const percebe = await servicoDeRedirecionamento.resolver(sessionId);
                if (percebe.type === 'group') {
                    navigate(`/g/${percebe.groupId}`);
                } else if (percebe.type === 'marketplace') {
                    navigate(`/market/`);
                } else {
                    navigate(percebe.fallbackUrl || '/');
                }
                */
               // Navegação temporária para a home para evitar que o usuário fique preso.
               navigate('/');

            } else {
                navigate(`/`);
            }
        };

        handleSuccess();
    }, [location, navigate]);
};
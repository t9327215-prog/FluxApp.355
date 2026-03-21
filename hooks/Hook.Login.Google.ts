
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { trackingService } from '../ServiçosFrontend/ServiçoDeRastreamento/ServiçoDeRastreamento.js';

export const useGoogleLogin = () => {
    const location = useLocation();
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<any>(null);

    // Captura parâmetros de URL para tracking de afiliados
    useEffect(() => {
        try {
            trackingService.captureUrlParams();
        } catch (error) {
            console.error("Falha ao capturar parâmetros de URL para rastreamento:", error);
        }
    }, [location]);

    const submeterLoginGoogle = useCallback(async (credentialResponse: any) => {
        if (!credentialResponse || !credentialResponse.credential) {
            setErro(new Error("Credencial do Google inválida."));
            return;
        }

        setProcessando(true);
        setErro(null);

        try {
            // Obtém a referência de afiliado do serviço de rastreamento
            const referredBy = trackingService.getAffiliateRef() || undefined;
            // Apenas chama o serviço e aguarda a conclusão. 
            // O SistemaAutenticacaoSupremo cuidará de salvar a sessão e disparar o evento 'authChange'.
            await SistemaAutenticacaoSupremo.loginWithGoogle(credentialResponse.credential, referredBy);
            
            // A lógica de redirecionamento foi removida daqui.
            // A página Login.tsx irá lidar com o redirecionamento com base na atualização do hook useUsuarioSessao.

        } catch (err) {
            setErro(err);
        } finally {
            setProcessando(false);
        }
    }, []);

    return {
        processando,
        erro,
        submeterLoginGoogle,
    };
};

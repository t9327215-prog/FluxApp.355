
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../ServiçosFrontend/serviços/provedor/AuthProvider';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';

export const GoogleAuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { erro, autenticado, usuario } = useAuth();

    useEffect(() => {
        // CORREÇÃO: Procurar pelo 'code' na URL, não pelo 'token'.
        const code = searchParams.get('code');

        if (code) {
            // CORREÇÃO: Chamar a função correta que implementamos.
            servicoAutenticacao.finalizarLoginComGoogle(code);
        } else {
            console.error("Nenhum código de autorização encontrado no callback do Google.");
            navigate('/login?error=auth_failed');
        }
        // O array de dependências vazio garante que isso rode apenas uma vez.
    }, []);

    // Este useEffect lida com erros durante o processo.
    useEffect(() => {
        if (erro) {
            navigate(`/login?error=${erro}`);
        }
    }, [erro, navigate]);

    // Este useEffect já está correto e faz o redirecionamento que você quer!
    useEffect(() => {
        if (autenticado) {
            if (usuario && !usuario.perfilCompleto) {
                // A página de completar perfil que você já tem
                navigate('/CompleteProfile'); 
            } else {
                // A página de feed que você já tem
                navigate('/Feed');
            }
        }
    }, [autenticado, usuario, navigate]);

    return (
        <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
            <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
                Finalizando autenticação...
            </span>
        </div>
    );
};

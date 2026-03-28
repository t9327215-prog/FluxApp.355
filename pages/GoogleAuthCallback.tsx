
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../ServiçosFrontend/serviços/provedor/AuthProvider';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';

export const GoogleAuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { erro, autenticado, usuario } = useAuth(); 

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            servicoAutenticacao.finalizarLoginComToken(token);
        } else {
            console.error("Nenhum token encontrado no callback do Google.");
            navigate('/login?error=auth_failed');
        }
    }, [searchParams, navigate]);
    
    useEffect(() => {
        if (erro) {
            navigate(`/login?error=${erro}`);
        }
    }, [erro, navigate]);

    useEffect(() => {
        if (autenticado) {
            if (usuario && !usuario.perfilCompleto) {
                navigate('/complete-profile');
            } else {
                navigate('/feed');
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

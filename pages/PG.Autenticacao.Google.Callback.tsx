
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../hooks/Hook.Autenticacao';

const GoogleCallback: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { finalizarLoginComToken } = useAutenticacao();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            finalizarLoginComToken(token);
        } else {
            navigate('/login?error=google_auth_failed');
        }
    }, [location, navigate, finalizarLoginComToken]);

    return (
        <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
            <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
                Autenticando...
            </span>
        </div>
    );
};

export default GoogleCallback;

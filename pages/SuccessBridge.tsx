
import React from 'react';
import { HookPonteSucesso } from '../hooks/Hook.Ponte.Sucesso';

export const SuccessBridge: React.FC = () => {
    const { status, message, handleEnter } = HookPonteSucesso();

    return (
        <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
            <style>{`
                .success-pulse {
                    width: 100px; height: 100px;
                    background: rgba(0, 194, 255, 0.1);
                    border: 2px solid #00c2ff;
                    border-radius: 30px;
                    display: flex; align-items: center; justify-content: center;
                    color: #00c2ff; font-size: 32px; margin-bottom: 32px;
                    box-shadow: 0 0 30px rgba(0, 194, 255, 0.2);
                    animation: pulse-glow 2s infinite;
                }
                .status-ready { border-color: #00ff82; color: #00ff82; box-shadow: 0 0 30px rgba(0, 255, 130, 0.2); }
                @keyframes pulse-glow {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .loader-bar {
                    width: 200px; height: 4px; background: rgba(255,255,255,0.05);
                    border-radius: 10px; overflow: hidden; margin: 20px 0;
                }
                .loader-fill {
                    height: 100%; background: #00c2ff; width: 30%;
                    animation: loading-flow 2s infinite ease-in-out;
                }
                @keyframes loading-flow {
                    0% { transform: translateX(-100%); width: 30%; }
                    50% { width: 60%; }
                    100% { transform: translateX(200%); width: 30%; }
                }
                .btn-access {
                    width: 100%; max-width: 300px; padding: 18px;
                    background: #00ff82; color: #000;
                    border-radius: 16px; font-weight: 900; font-size: 16px;
                    text-transform: uppercase; letter-spacing: 1px;
                    border: none; cursor: pointer; transition: 0.3s;
                    box-shadow: 0 10px 25px rgba(0, 255, 130, 0.3);
                    animation: slideUp 0.5s ease;
                }
                .btn-access:active { transform: scale(0.98); }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>

            <div className={`success-pulse ${status === 'ready' ? 'status-ready' : ''}`}>
                <i className={`fa-solid ${status === 'ready' ? 'fa-check-double' : 'fa-shield-halved'}`}></i>
            </div>

            <h1 className="text-2xl font-black mb-2 uppercase tracking-tight">
                {status === 'ready' ? 'Pagamento Confirmado' : 'Preparando seu Acesso'}
            </h1>
            
            <p className="text-gray-500 text-sm font-medium mb-6">
                {message}
            </p>

            {status === 'validating' && (
                <div className="loader-bar">
                    <div className="loader-fill"></div>
                </div>
            )}

            {status === 'ready' && (
                <button className="btn-access" onClick={handleEnter}>
                    Acessar Agora <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>
            )}

            {status === 'error' && (
                <button onClick={() => window.location.reload()} className="text-[#00c2ff] text-xs font-bold uppercase underline">
                    Tentar Novamente
                </button>
            )}

            <div className="absolute bottom-10 opacity-20 text-[9px] font-black uppercase tracking-[5px]">
                Flux Synchronization Gateway
            </div>
        </div>
    );
};

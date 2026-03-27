
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../hooks/Hook.Autenticacao';
import { CardOpcoesLogin } from '../Componentes/ComponentesDeAuth/Componentes/Card.Opcoes.Login';
import { CardLoginEmailSenha } from '../Componentes/ComponentesDeAuth/Componentes/Card.Login.Email.Senha';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const {
        autenticado,
        processando,
        erro,
        loginComEmail,
        iniciarLoginComGoogle, // Corrigido para usar a nova função
    } = useAutenticacao();

    const [mostrarFormEmail, setMostrarFormEmail] = useState(false);
    const [email, definirEmail] = useState('');
    const [senha, definirSenha] = useState('');

    useEffect(() => {
        if (autenticado) {
            // A navegação agora é controlada pelo hook/serviço de aplicação
            // Esta lógica pode ser removida ou simplificada se o hook já faz o redirecionamento
            console.log("Usuário autenticado, aguardando redirecionamento...");
        }
    }, [autenticado, navigate]);

    const submeterLoginEmail = (e: React.FormEvent) => {
        e.preventDefault();
        loginComEmail({ email, senha });
    };

    if (processando && !mostrarFormEmail) { // Mostra o loading global apenas na tela inicial
        return (
            <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
                <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
                    Verificando Credenciais...
                </span>
            </div>
        );
    }

    const CamadaDeProcessamento = () => (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-[32px] flex items-center justify-center z-50">
            <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        </div>
    );

    const BotaoGoogle = () => {
        return (
            <button
                onClick={() => {
                    console.log("BOTAO LOGIN CLICADO");
                    iniciarLoginComGoogle();
                }}
                className="w-full bg-[#1a73e8] hover:bg-[#1a73e8]/90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all"
            >
                <i className="fa-brands fa-google text-xl"></i>
                Entrar com Google
            </button>
        );
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white font-['Inter'] relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px]"></div>
            </div>
            <div className="w-full max-w-[400px] mx-4 bg-white/5 backdrop-blur-2xl rounded-[32px] p-10 border border-white/10 shadow-2xl relative z-10 flex flex-col items-center">
                {mostrarFormEmail ? (
                    <CardLoginEmailSenha 
                        email={email}
                        definirEmail={definirEmail}
                        senha={senha}
                        definirSenha={definirSenha}
                        aoSubmeter={submeterLoginEmail}
                        aoVoltar={() => setMostrarFormEmail(false)}
                        carregando={processando}
                        erro={erro}
                    />
                ) : (
                    <CardOpcoesLogin 
                        onSelecionarEmail={() => setMostrarFormEmail(true)}
                        slotBotaoGoogle={<BotaoGoogle />}
                    />
                )}
                
                {processando && <CamadaDeProcessamento />}
            </div>
        </div>
    );
};


import { AppFluxo } from './Sistema/Core/Fluxo.Lançador';
import { AppAutenticacao } from './Sistema/Autenticacao/Fluxo.Autenticacao';

console.log('--- INICIANDO A APLICAÇÃO ---\n');

// 1. O fluxo principal da aplicação é iniciado.
AppFluxo.iniciarAplicativo();

// 2. SIMULAÇÃO DE INTERAÇÃO DO USUÁRIO
// Em um app real, o código abaixo seria acionado por um clique em um botão de login.
// Aqui, usamos um timeout para simular essa ação após a tentativa inicial de verificação de sessão.
setTimeout(() => {
    console.log('\n--- EVENTO: Usuário clica em "Login com Google" ---\n');
    // O usuário (simulado) inicia o processo de autenticação.
    AppAutenticacao.autenticarComGoogle();
}, 1000); // Simula o clique após 1 segundo.

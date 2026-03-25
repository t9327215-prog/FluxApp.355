
// --- IMPORTS ---
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';

import { setupErrorHandlers } from './backend/config/Processo.ErrorHandler.js';
import { configureExpress } from './backend/config/Processo.Express.js';
import { configureSocket } from './backend/config/Processo.Socket.js';
import { initializeDatabase } from './backend/database/Database.Init.js';

// --- CONFIGURAÇÃO INICIAL ---
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
setupErrorHandlers();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// --- INICIALIZAÇÃO DA APLICAÇÃO CORE ---
console.info({
    camada: 'Backend',
    componente: 'Core',
    arquivo: 'server.js',
    mensagem: '--- Inicializando o Servidor ---'
});

if (!process.env.JWT_SECRET) {
    console.error({
        camada: 'Backend',
        componente: 'Configuração',
        arquivo: 'server.js',
        mensagem: 'ERRO FATAL: A variável de ambiente JWT_SECRET não está definida. O servidor não pode iniciar.'
    });
    process.exit(1);
}

const app = express();
const httpServer = http.createServer(app);
const io = configureSocket(httpServer);

configureExpress(app, io);

// --- INICIALIZAÇÃO DO SERVIDOR ---
const startApp = async () => {
    console.info({ 
        camada: 'Backend', 
        componente: 'Core', 
        arquivo: 'server.js', 
        mensagem: "Iniciando a aplicação..."
    });
    try {
        await initializeDatabase();

        httpServer.listen(PORT, '0.0.0.0', () => {
            console.log({
                camada: 'Backend',
                componente: 'Core',
                arquivo: 'server.js',
                mensagem: `Servidor iniciado com sucesso na porta ${PORT}`,
                dados: { ambiente: process.env.NODE_ENV || 'development' }
            });
        });

    } catch (error) {
        console.error({
            camada: 'Backend',
            componente: 'Core',
            arquivo: 'server.js',
            mensagem: `Falha crítica durante a inicialização da aplicação: ${error.message}`,
            error
        });
        process.exit(1);
    }
};

startApp();

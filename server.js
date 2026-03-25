
// --- IMPORTS ---
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';

import { run as runMigrations } from './scripts/executar-migracoes.js';
import { setupMiddlewares } from './backend/config/Sistema.Middleware.js';
import { db, auditorDoPostgreSQL } from './backend/database/Sistema.Banco.Dados.js';
import apiRoutes from './backend/RotasBackend/Rotas.js';

// --- CONFIGURAÇÃO INICIAL ---
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// --- MANIPULADORES DE ERRO GLOBAIS ---
process.on('uncaughtException', (err, origin) => {
    console.error({
        camada: 'Backend',
        componente: 'Core',
        arquivo: 'server.js',
        mensagem: `Exceção Não Capturada: ${err.message}`,
        dados: { origin },
        error: err
    });
    // Garante que o log seja escrito antes de sair
    setTimeout(() => process.exit(1), 1000); 
});

process.on('unhandledRejection', (reason, promise) => {
    const error = reason instanceof Error ? reason : undefined;
    console.error({
        camada: 'Backend',
        componente: 'Core',
        arquivo: 'server.js',
        mensagem: 'Rejeição de Promise Não Tratada',
        dados: { reason: reason instanceof Error ? reason.message : String(reason) },
        error
    });
});

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
const io = new Server(httpServer, {
    cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'X-Flux-Client-ID', 'X-Flux-Trace-ID', 'X-Admin-Action', 'X-Protocol-Version'],
    }
});

// --- CONFIGURAÇÃO DE MIDDLEWARES ---
setupMiddlewares(app, io);

// --- CONFIGURAÇÃO DE ROTAS ---
app.use('/api', apiRoutes);

const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// Middleware para rotas de API não encontradas
app.use('/api', (req, res) => {
    console.warn({
        camada: 'Backend',
        componente: 'API',
        arquivo: 'server.js',
        mensagem: 'Endpoint da API não encontrado (404)',
        dados: { path: req.path, method: req.method, traceId: req.traceId }
    });
    res.status(404).json({ error: 'Endpoint da API não encontrado.', traceId: req.traceId });
});

// Rota para servir o frontend (deve vir depois da API)
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.warn({
            camada: 'Backend',
            componente: 'Servidor Web',
            arquivo: 'server.js',
            mensagem: 'Arquivo index.html não encontrado na pasta dist',
            dados: { path: req.path }
        });
        res.status(404).send('Build do frontend não encontrado. Verifique se o arquivo index.html existe na pasta /dist.');
    }
});

// --- MANIPULADOR DE ERRO GLOBAL DO EXPRESS ---
app.use((err, req, res, next) => {
    const traceId = req.traceId || 'untraced-error';
    const errorMessage = (err instanceof Error) ? err.message : 'Ocorreu um erro inesperado.';

    console.error({
        camada: 'Backend',
        componente: 'API',
        arquivo: 'server.js',
        mensagem: `Erro não tratado em uma rota do Express: ${errorMessage}`,
        dados: { path: req.path, method: req.method, traceId },
        error: err
    });

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Ocorreu um erro inesperado no servidor.',
        message: errorMessage,
        traceId
    });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const startApp = async () => {
    console.info({ 
        camada: 'Backend', 
        componente: 'Core', 
        arquivo: 'server.js', 
        mensagem: "Iniciando a aplicação..."
    });
    try {
        await runMigrations();
        console.info({
            camada: 'Backend',
            componente: 'Banco de Dados',
            arquivo: 'server.js',
            mensagem: 'Migrações do banco de dados aplicadas com sucesso.'
        });

        await db.init();
        console.info({
            camada: 'Backend',
            componente: 'Banco de Dados',
            arquivo: 'server.js',
            mensagem: 'Sistema de banco de dados inicializado com sucesso.'
        });

        setTimeout(() => {
            auditorDoPostgreSQL.inspectDatabases(console); // Este precisa ser adaptado no futuro
        }, 5000);

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

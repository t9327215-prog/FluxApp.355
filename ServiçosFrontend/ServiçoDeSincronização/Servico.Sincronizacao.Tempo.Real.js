// --- SERVIÇO DE CONEXÃO DE SOQUETE EM TEMPO REAL (VERSÃO ROBUSTA) ---

// Em uma aplicação real, você importaria a biblioteca de soquete aqui.
// import { io } from 'socket.io-client';

/**
 * Gerencia a conexão WebSocket com o servidor para eventos em tempo real,
 * com funcionalidades de reconexão, subscrição de eventos e gerenciamento de estado.
 */
class ServicoDeSoquete {
    constructor() {
        this.socket = null;
        this.eventHandlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 5000; // 5 segundos
    }

    /**
     * Retorna o estado da conexão.
     * @returns {boolean}
     */
    isConnected() {
        return this.socket ? this.socket.connected : false;
    }

    /**
     * Estabelece a conexão com o servidor de soquete.
     * Este método pode ser chamado para reconectar ou atualizar o token.
     */
    connect() {
        // Se já estiver conectado e o token não mudou, não faz nada.
        // A lógica de verificação de token pode ser mais sofisticada.
        if (this.isConnected()) {
            console.log('[Soquete] A conexão já está ativa.');
            return;
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.log('[Soquete] Nenhum token de autenticação, conexão não iniciada.');
            return;
        }
        
        // Se houver um socket antigo, desconecte-o antes de criar um novo.
        if (this.socket) {
            this.disconnect();
        }

        console.log('[Soquete] Conectando ao servidor...');

        // --- Configuração real do Socket.io-client ---
        // const socketUrl = process.env.REACT_APP_SOCKET_URL || 'https://api.meuservidor.com';
        // this.socket = io(socketUrl, {
        //     auth: { token },
        //     reconnection: false // Desativamos para controlar a lógica manualmente
        // });
        // this.setupEventListeners();
        
        // --- Mock da conexão para fins de demonstração ---
        this.socket = { 
            connected: true,
            on: (event, handler) => this.eventHandlers.set(event, handler),
            emit: (event, data) => console.log(`[Soquete Mock] Emitindo '${event}':`, data),
            disconnect: () => { 
                this.socket.connected = false; 
                console.log('🔌 [Soquete Mock] Desconectado.');
                // Simula o evento de desconexão
                const disconnectHandler = this.eventHandlers.get('disconnect');
                if (disconnectHandler) disconnectHandler('io client disconnect');
            }
        }; 
        console.log('✅ [Soquete] Mock de conexão estabelecido.');
        // --- Fim do Mock ---
    }

    /**
     * Configura os listeners de eventos base do soquete (conexão, erro, etc.).
     * Esta função seria chamada logo após a criação do `io()`.
     */
    setupEventListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('✅ [Soquete] Conectado com sucesso ao servidor!');
            this.reconnectAttempts = 0;
            // Re-registra os handlers de eventos
            this.eventHandlers.forEach((handler, event) => {
                this.socket.on(event, handler);
            });
        });

        this.socket.on('disconnect', (reason) => {
            console.log(`🔌 [Soquete] Desconectado do servidor. Razão: ${reason}`);
            // Só reconecta se não for uma desconexão intencional
            if (reason !== 'io client disconnect') {
                this.handleReconnect();
            }
        });

        this.socket.on('connect_error', (err) => {
            console.error('[Soquete] Erro de conexão:', err.message);
            this.handleReconnect();
        });
    }

    /**
     * Tenta reconectar ao servidor com um backoff.
     */
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectInterval * this.reconnectAttempts;
            console.log(`[Soquete] Tentando reconectar em ${delay / 1000}s... (Tentativa ${this.reconnectAttempts})`);
            setTimeout(() => this.connect(), delay);
        } else {
            console.error('[Soquete] Máximo de tentativas de reconexão atingido. O usuário pode precisar recarregar a página.');
        }
    }

    /**
     * Desconecta do servidor de soquete.
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('🔌 [Soquete] Conexão encerrada pelo cliente.');
        }
    }

    /**
     * Emite um evento para o servidor.
     * @param {string} event O nome do evento.
     * @param {any} data Os dados a serem enviados.
     */
    emit(event, data) {
        if (!this.isConnected()) {
            console.error(`[Soquete] Falha ao emitir '${event}'. Socket não conectado.`);
            return;
        }
        this.socket.emit(event, data);
    }

    /**
     * Registra um handler para um evento do servidor.
     * @param {string} event O nome do evento.
     * @param {Function} handler A função de callback.
     */
    on(event, handler) {
        this.eventHandlers.set(event, handler);
        if (this.isConnected()) {
            this.socket.on(event, handler);
        }
    }

    /**
     * Remove o handler de um evento.
     * @param {string} event O nome do evento.
     */
    off(event) {
        this.eventHandlers.delete(event);
        if (this.isConnected() && this.socket.off) { // .off() é o método padrão
            this.socket.off(event);
        }
    }

    /**
     * Método para atualizar o token e reconectar.
     * Deve ser chamado quando o sistema de autenticação renovar o token.
     */
    refreshAuthToken() {
        console.log('[Soquete] Atualizando token de autenticação e reconectando...');
        this.disconnect();
        this.connect();
    }
}

// Exporta uma instância singleton do serviço
export const socketService = new ServicoDeSoquete();

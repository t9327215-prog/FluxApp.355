
// backend/models/Models.Estrutura.Sessao.js

import createModelLogger from '../config/Log.Models.js';

const logger = createModelLogger('Models.Estrutura.Sessao.js');

class Sessao {
    constructor(data) {
        logger.info('Criando nova instância de Sessão.', { sessionId: data.id, userId: data.idUsuario });
        this.id = data.id;
        this.idUsuario = data.idUsuario;
        this.token = data.token;
        this.expiraEm = data.expiraEm;
        this.userAgent = data.userAgent;
        this.enderecoIp = data.enderecoIp;
        this.dataCriacao = data.dataCriacao || new Date();
    }

    paraBancoDeDados() {
        logger.info('Convertendo modelo de sessão para formato de banco de dados.', { sessionId: this.id });
        return {
            id: this.id,
            user_id: this.idUsuario,
            token: this.token,
            expires_at: this.expiraEm,
            user_agent: this.userAgent,
            ip_address: this.enderecoIp,
            created_at: this.dataCriacao
        };
    }

    static deBancoDeDados(dbData) {
        if (!dbData) {
            logger.warn('Tentativa de criar modelo de sessão a partir de dados nulos do banco de dados.');
            return null;
        }
        logger.info('Convertendo dados do banco de dados para modelo de sessão.', { sessionId: dbData.id });

        return new Sessao({
            id: dbData.id,
            idUsuario: dbData.user_id,
            token: dbData.token,
            expiraEm: dbData.expires_at,
            userAgent: dbData.user_agent,
            enderecoIp: dbData.ip_address,
            dataCriacao: dbData.created_at
        });
    }

    paraRespostaHttp() {
        logger.info('Convertendo modelo de sessão para formato de resposta HTTP.', { sessionId: this.id });
        return {
            id: this.id,
            idUsuario: this.idUsuario,
            expiraEm: this.expiraEm,
            dataCriacao: this.dataCriacao
        };
    }
}

export default Sessao;

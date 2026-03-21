
// backend/models/Models.Estrutura.Sessao.js

class Sessao {
    constructor(data) {
        this.id = data.id;
        this.idUsuario = data.idUsuario;
        this.token = data.token;
        this.expiraEm = data.expiraEm;
        this.userAgent = data.userAgent;
        this.enderecoIp = data.enderecoIp;
        this.dataCriacao = data.dataCriacao || new Date();
    }

    paraBancoDeDados() {
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
        if (!dbData) return null;

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
        return {
            id: this.id,
            idUsuario: this.idUsuario,
            expiraEm: this.expiraEm,
            dataCriacao: this.dataCriacao
        };
    }
}

export default Sessao;


// backend/models/Models.Estrutura.Usuario.js

import bcrypt from 'bcryptjs';
import createModelLogger from '../config/Log.Models.js';

const logger = createModelLogger('Models.Estrutura.Usuario.js');

class Usuario {
    constructor(data) {
        logger.info('Criando nova instância de Usuário.', { userId: data.id });
        this.id = data.id;
        this.nome = data.nome;
        this.email = data.email;
        this.senha = data.senha; 
        this.google_id = data.google_id;
        this.senha_hash = data.senha_hash;
        
        this.apelido = data.apelido;
        this.bio = data.bio;
        this.site = data.site;
        this.urlFoto = data.urlFoto;
        this.privado = data.privado || false;
        this.perfilCompleto = data.perfilCompleto || false;
        
        this.seguidores = data.seguidores || [];
        this.seguindo = data.seguindo || [];

        this.dataCriacao = data.dataCriacao;
        this.dataAtualizacao = data.dataAtualizacao;
    }

    async criptografarSenha() {
        if (this.senha) {
            logger.info('Iniciando criptografia de senha.', { userId: this.id });
            const salt = await bcrypt.genSalt(10);
            this.senha_hash = await bcrypt.hash(this.senha, salt);
            logger.info('Criptografia de senha concluída.', { userId: this.id });
        }
    }

    paraBancoDeDados() {
        logger.info('Convertendo modelo de usuário para formato de banco de dados.', { userId: this.id });
        const data = {
            id: this.id,
            name: this.nome,
            email: this.email,
            nickname: this.apelido,
            bio: this.bio,
            website: this.site,
            photo_url: this.urlFoto,
            is_private: this.privado,
            profile_completed: this.perfilCompleto,
        };
        if (this.senha_hash) {
            data.password_hash = this.senha_hash;
        }
        if (this.google_id) {
            data.google_id = this.google_id;
        }
        return data;
    }

    static deBancoDeDados(dbData) {
        if (!dbData) {
            logger.warn('Tentativa de criar modelo de usuário a partir de dados nulos do banco de dados.');
            return null;
        }
        logger.info('Convertendo dados do banco de dados para modelo de usuário.', { userId: dbData.id });

        return new Usuario({
            id: dbData.id,
            nome: dbData.name,
            email: dbData.email,
            google_id: dbData.google_id,
            senha_hash: dbData.password_hash,
            apelido: dbData.nickname,
            bio: dbData.bio,
            site: dbData.website,
            urlFoto: dbData.photo_url,
            privado: dbData.is_private,
            perfilCompleto: dbData.profile_completed,
            dataCriacao: dbData.created_at,
            dataAtualizacao: dbData.updated_at,
            seguidores: dbData.seguidores || [],
            seguindo: dbData.seguindo || [],
        });
    }

    paraRespostaHttp() {
        logger.info('Convertendo modelo de usuário para formato de resposta HTTP.', { userId: this.id });
        
        // Garante que o nome nunca seja nulo ou indefinido na resposta.
        const nomeGarantido = this.nome || (this.email ? this.email.split('@')[0] : 'Usuário Anônimo');

        return {
            id: this.id,
            nome: nomeGarantido, // Usa o nome garantido.
            email: this.email,
            apelido: this.apelido,
            bio: this.bio,
            site: this.site,
            urlFoto: this.urlFoto,
            privado: this.privado,
            perfilCompleto: this.perfilCompleto,
            contagemSeguidores: this.seguidores.length,
            contagemSeguindo: this.seguindo.length,
            seguidores: this.seguidores,
            seguindo: this.seguindo,
            dataCriacao: this.dataCriacao,
            dataAtualizacao: this.dataAtualizacao,
        };
    }
}

export default Usuario;

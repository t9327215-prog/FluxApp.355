
import bcrypt from 'bcryptjs';

class Usuario {
    constructor(data) {
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
        
        // Novas propriedades para seguidores e seguindo
        this.seguidores = data.seguidores || [];
        this.seguindo = data.seguindo || [];

        this.dataCriacao = data.dataCriacao;
        this.dataAtualizacao = data.dataAtualizacao;
    }

    async criptografarSenha() {
        if (this.senha) {
            const salt = await bcrypt.genSalt(10);
            this.senha_hash = await bcrypt.hash(this.senha, salt);
        }
    }

    paraBancoDeDados() {
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
        if (!dbData) return null;

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
            // Assumindo que a camada de serviço/repositório irá popular isso
            seguidores: dbData.seguidores || [],
            seguindo: dbData.seguindo || [],
        });
    }

    paraRespostaHttp() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            apelido: this.apelido,
            bio: this.bio,
            site: this.site,
            urlFoto: this.urlFoto,
            privado: this.privado,
            perfilCompleto: this.perfilCompleto,
            // Adicionando contagens e listas à resposta
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


class Comentario {
    constructor({
        id,
        postId,
        autorId,
        conteudo,
        dataCriacao,
        dataAtualizacao,
        autor
    }) {
        this.id = id;
        this.postId = postId;
        this.autorId = autorId;
        this.conteudo = conteudo;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.autor = autor; // Objeto com dados do autor
    }

    paraBancoDeDados() {
        return {
            post_id: this.postId,
            user_id: this.autorId,
            content: this.conteudo,
        };
    }

    static deBancoDeDados(dados) {
        if (!dados) return null;

        const autor = {
            username: dados.username,
            avatarUrl: dados.avatar_url
        };

        return new Comentario({
            id: dados.id,
            postId: dados.post_id,
            autorId: dados.user_id,
            conteudo: dados.content,
            dataCriacao: dados.created_at,
            dataAtualizacao: dados.updated_at,
            autor: autor
        });
    }

    paraRespostaHttp() {
        return {
            id: this.id,
            postId: this.postId,
            autorId: this.autorId,
            conteudo: this.conteudo,
            dataCriacao: this.dataCriacao,
            dataAtualizacao: this.dataAtualizacao,
            autor: this.autor
        };
    }
}

export default Comentario;

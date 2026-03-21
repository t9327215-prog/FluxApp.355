
class PublicacaoMarketplace {
    constructor({
        id,
        usuarioId,
        titulo,
        descricao,
        preco,
        categoria,
        localizacao,
        urlsImagens = [],
        dataCriacao,
        dataAtualizacao,
        autor
    }) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.titulo = titulo;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria;
        this.localizacao = localizacao;
        this.urlsImagens = urlsImagens;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.autor = autor; // Objeto com dados do autor
    }

    paraBancoDeDados() {
        return {
            user_id: this.usuarioId,
            title: this.titulo,
            description: this.descricao,
            price: this.preco,
            category: this.categoria,
            location: this.localizacao,
            image_urls: this.urlsImagens
        };
    }

    static deBancoDeDados(dados) {
        if (!dados) return null;

        const autor = {
            username: dados.username,
            avatarUrl: dados.avatar_url,
            informacaoContato: dados.contact_info // Campo pode ser nulo
        };

        return new PublicacaoMarketplace({
            id: dados.id,
            usuarioId: dados.user_id,
            titulo: dados.title,
            descricao: dados.description,
            preco: parseFloat(dados.price) || 0,
            categoria: dados.category,
            localizacao: dados.location,
            urlsImagens: Array.isArray(dados.image_urls) ? dados.image_urls : JSON.parse(dados.image_urls || '[]'),
            dataCriacao: dados.created_at,
            dataAtualizacao: dados.updated_at,
            autor: autor
        });
    }

    paraRespostaHttp() {
        return {
            id: this.id,
            usuarioId: this.usuarioId,
            titulo: this.titulo,
            descricao: this.descricao,
            preco: this.preco,
            categoria: this.categoria,
            localizacao: this.localizacao,
            urlsImagens: this.urlsImagens,
            dataCriacao: this.dataCriacao,
            dataAtualizacao: this.dataAtualizacao,
            autor: this.autor
        };
    }
}

export default PublicacaoMarketplace;

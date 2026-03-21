
/**
 * Representa as configurações de um grupo, garantindo a validação e consistência dos dados.
 */
class ModelsEstruturaConfiguracoesGrupo {
    constructor({ idGrupo, nome, descricao, privacidade, diretrizes, notificacoes }) {
        this.idGrupo = idGrupo;
        this.nome = nome;
        this.descricao = descricao;
        this.privacidade = privacidade; // ex: 'publico', 'privado'
        this.diretrizes = diretrizes; // ex: texto com as regras do grupo
        this.notificacoes = notificacoes; // ex: { todosOsPosts: true, mencoes: false }

        this.validar();
    }

    /**
     * Valida os dados essenciais do modelo.
     * Lança um erro se a validação falhar.
     */
    validar() {
        if (!this.idGrupo) {
            const erro = 'ID do grupo é obrigatório para as configurações.';
            throw new Error(erro);
        }
        if (this.nome !== undefined && (typeof this.nome !== 'string' || this.nome.trim().length === 0)) {
            const erro = 'O nome do grupo, se fornecido, não pode ser vazio.';
            throw new Error(erro);
        }
        // Adicionar outras validações essenciais aqui
    }

    /**
     * Converte a instância do modelo para um objeto simples, ideal para ser enviado em respostas de API ou salvo no banco.
     * @returns {Object} Um objeto com os dados do modelo.
     */
    toObject() {
        return {
            idGrupo: this.idGrupo,
            nome: this.nome,
            descricao: this.descricao,
            privacidade: this.privacidade,
            diretrizes: this.diretrizes,
            notificacoes: this.notificacoes,
        };
    }

    /**
     * Cria uma instância de ModelsEstruturaConfiguracoesGrupo a partir de um objeto de dados.
     * @param {Object} data - O objeto com os dados.
     * @returns {ModelsEstruturaConfiguracoesGrupo} Uma nova instância do modelo.
     */
    static fromObject(data) {
        return new ModelsEstruturaConfiguracoesGrupo(data);
    }
}

export default ModelsEstruturaConfiguracoesGrupo;

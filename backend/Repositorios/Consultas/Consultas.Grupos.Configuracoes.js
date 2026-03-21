
/**
 * @file Armazena as consultas SQL para a tabela de configurações de grupos.
 * Separar as queries em seu próprio arquivo melhora a manutenibilidade e a clareza do código do repositório.
 */

export const ConsultasGruposConfiguracoes = {
    /**
     * Query para atualizar as configurações gerais de um grupo.
     */
    ATUALIZAR_CONFIGURACOES: `
        UPDATE grupos_configuracoes 
        SET nome = ?, descricao = ?, privacidade = ?
        WHERE id_grupo = ?;
    `,

    /**
     * Query para buscar todas as configurações de um grupo pelo seu ID.
     */
    OBTER_CONFIGURACOES_POR_ID: `
        SELECT * FROM grupos_configuracoes WHERE id_grupo = ?;
    `,

    /**
     * Query para buscar as diretrizes de um grupo pelo seu ID.
     */
    OBTER_DIRETRIZES_POR_ID: `
        SELECT diretrizes FROM grupos_configuracoes WHERE id_grupo = ?;
    `,

    /**
     * Query para atualizar as diretrizes de um grupo.
     */
    ATUALIZAR_DIRETRIZES: `
        UPDATE grupos_configuracoes 
        SET diretrizes = ?
        WHERE id_grupo = ?;
    `,
};


import ClienteBackend from '../../Cliente.Backend';

const API_Criacao_Grupo_Publico = {
    /**
     * Envia os dados para o backend para criar um novo grupo público.
     * @param {object} dadosGrupo - O objeto contendo os dados do grupo (nome, descrição, etc.).
     * @returns {Promise<any>} A promessa da resposta do Axios.
     */
    criar(dadosGrupo: object): Promise<any> {
        return ClienteBackend.post('/groups/public', dadosGrupo);
    },
};

export default API_Criacao_Grupo_Publico;

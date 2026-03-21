
import ClienteBackend from '../../Cliente.Backend';

const API_Criacao_Grupo_Privado = {
    /**
     * Envia os dados para o backend para criar um novo grupo privado.
     * @param {object} dadosGrupo - O objeto contendo os dados do grupo.
     * @returns {Promise<any>} A promessa da resposta do Axios.
     */
    criar(dadosGrupo: object): Promise<any> {
        return ClienteBackend.post('/groups/private', dadosGrupo);
    },
};

export default API_Criacao_Grupo_Privado;

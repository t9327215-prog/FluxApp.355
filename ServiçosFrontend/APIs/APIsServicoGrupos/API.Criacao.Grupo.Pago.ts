
import ClienteBackend from '../../Cliente.Backend';

const API_Criacao_Grupo_Pago = {
    /**
     * Envia os dados para o backend para criar um novo grupo pago.
     * @param {object} dadosGrupo - O objeto contendo os dados do grupo (nome, preço, etc.).
     * @returns {Promise<any>} A promessa da resposta do Axios.
     */
    criar(dadosGrupo: object): Promise<any> {
        return ClienteBackend.post('/groups/paid', dadosGrupo);
    },
};

export default API_Criacao_Grupo_Pago;


import { AxiosResponse } from 'axios';
import ClienteBackend from '../Cliente.Backend';
import { LoginGoogleDTO } from '../../types/Entrada/Dto.Estrutura.Usuario';

const API_Servico_Metodo_Google = {
    /**
     * Envia o token do Google para o backend para autenticação.
     * @param {LoginGoogleDTO} dadosLoginGoogle - O objeto contendo o token de credencial do Google e, opcionalmente, o ID do usuário que indicou.
     * @returns {Promise<AxiosResponse<any>>} A promessa da resposta do Axios.
     */
    loginComGoogle(dadosLoginGoogle: LoginGoogleDTO): Promise<AxiosResponse<any>> {
        return ClienteBackend.post('/auth/google', dadosLoginGoogle);
    },
};

export default API_Servico_Metodo_Google;

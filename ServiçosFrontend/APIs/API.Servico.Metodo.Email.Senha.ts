
import { AxiosResponse } from 'axios';
import ClienteBackend from '../Cliente.Backend';
import { LoginDto } from '../../types/Entrada/Dto.Estrutura.Usuario';

const API_Servico_Metodo_Email_Senha = {
    /**
     * Envia as credenciais para o backend para autenticação.
     * @param {LoginDto} dadosLogin - Objeto contendo o email e a senha do usuário.
     * @returns {Promise<AxiosResponse<any>>} A promessa da resposta do Axios.
     */
    login(dadosLogin: LoginDto): Promise<AxiosResponse<any>> {
        return ClienteBackend.post('/auth/login', dadosLogin);
    },
};

export default API_Servico_Metodo_Email_Senha;

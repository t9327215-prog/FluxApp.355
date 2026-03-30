import { httpClient } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import { API_ENDPOINTS } from '../../src/constants/api';

class InfraProviderSessao {
    public async login(loginData: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.AUTH.LOGIN, loginData);
    }

    public async criarUsuario(dadosUsuario: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.AUTH.REGISTER, dadosUsuario);
    }

    public async lidarComLoginSocial(dadosLogin: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.AUTH.LOGIN + '/google', dadosLogin);
    }
}

export const infraProviderSessao = new InfraProviderSessao();

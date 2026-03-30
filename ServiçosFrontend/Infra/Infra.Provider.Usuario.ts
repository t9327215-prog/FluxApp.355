import { httpClient } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import { API_ENDPOINTS } from '../../src/constants/api';

class InfraProviderUsuario {
    public async completarPerfil(perfilData: any): Promise<any> {
        return httpClient.put(API_ENDPOINTS.USERS.BASE + '/perfil', perfilData);
    }

    public async buscarUsuarioPorId(id: string): Promise<any> {
        return httpClient.get(API_ENDPOINTS.USERS.PROFILE(id));
    }

    public async buscarUsuarioPorEmail(email: string): Promise<any> {
        const result = await httpClient.get(API_ENDPOINTS.USERS.BASE + `?email=${email}`);
        return Array.isArray(result) && result.length > 0 ? result[0] : result;
    }
}

export const infraProviderUsuario = new InfraProviderUsuario();

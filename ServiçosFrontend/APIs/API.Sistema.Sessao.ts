
import ClienteBackend from '../Cliente.Backend.js';
import {
    LoginRequest,
    LoginResponse,
    GoogleLoginRequest,
    GoogleLoginResponse,
    validateLoginRequest,
    validateGoogleLoginResponse
} from '../Contratos/Contrato.Autenticacao';
import { AxiosResponse } from 'axios';
import { createApiLogger } from '../SistemaObservabilidade/Log.API';
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';

const apiLogger = createApiLogger('SessaoAPI');

class SessaoAPI {
    
    async login(data: LoginRequest): Promise<LoginResponse> {
        apiLogger.logRequest('login', { email: data.email });
        try {
            // Agora usa a função de validação do contrato, que já loga o erro se falhar.
            const dadosValidados = validateLoginRequest(data);
            
            const response: AxiosResponse<any> = await ClienteBackend.post(ENDPOINTS_AUTH.LOGIN, dadosValidados);
            
            const responseData = response.data.dados;
            const transformedData = {
                ...responseData,
                usuario: responseData.user,
            };

            apiLogger.logSuccess('login', transformedData);
            return transformedData;
        } catch (error) {
            // A falha (seja da validação ou da API) é capturada e logada aqui.
            apiLogger.logFailure('login', error, { email: data.email });
            throw error;
        }
    }

    async resolverSessaoLogin(data: GoogleLoginRequest): Promise<GoogleLoginResponse> {
        apiLogger.logRequest('resolverSessaoLogin', { token: '[TOKEN OMITIDO]' });
        try {
            const response: AxiosResponse<any> = await ClienteBackend.post(ENDPOINTS_AUTH.GOOGLE_CALLBACK, data);
            
            const responseData = response.data.dados;
            const transformedData = {
                token: responseData.token,
                usuario: responseData.user,
                isNewUser: responseData.isNewUser
            };

            // Valida a resposta do backend usando a função do contrato.
            const dadosValidados = validateGoogleLoginResponse(transformedData);
            
            apiLogger.logSuccess('resolverSessaoLogin', dadosValidados);
            
            return dadosValidados;
        } catch (error) {
            // Captura e loga a falha (seja da validação da resposta ou da API).
            apiLogger.logFailure('resolverSessaoLogin', error);
            throw error;
        }
    }
}

export default new SessaoAPI();

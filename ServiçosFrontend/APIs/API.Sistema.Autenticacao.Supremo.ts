
import ClienteBackend from '../Cliente.Backend.js';
import {
    IAutenticacaoServico,
    LoginRequest,
    LoginResponse,
    LoginRequestSchema, 
    GoogleLoginRequest,
    GoogleLoginResponse,
    GoogleLoginResponseSchema,
} from '../Contratos/Contrato.Autenticacao';
import { AxiosResponse } from 'axios';
import { createApiLogger } from '../SistemaObservabilidade/Log.API';
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';

const apiLogger = createApiLogger('AutenticacaoSupremo');

class AutenticacaoAPISupremo implements IAutenticacaoServico {
    
    async login(data: LoginRequest): Promise<LoginResponse> {
        apiLogger.logRequest('login', { email: data.email });
        try {
            const dadosValidados = LoginRequestSchema.parse(data);
            const response: AxiosResponse<any> = await ClienteBackend.post(ENDPOINTS_AUTH.LOGIN, dadosValidados);
            
            const responseData = response.data.dados; // Extrai a propriedade 'dados'
            const transformedData = {
                ...responseData,
                usuario: responseData.user, // Renomeia 'user' para 'usuario'
            };

            apiLogger.logSuccess('login', transformedData);
            return transformedData;
        } catch (error) {
            apiLogger.logFailure('login', error, { email: data.email });
            throw error;
        }
    }

    async resolverSessaoLogin(data: GoogleLoginRequest): Promise<GoogleLoginResponse> {
        apiLogger.logRequest('resolverSessaoLogin', { token: '[TOKEN OMITIDO]' });
        try {
            const response: AxiosResponse<any> = await ClienteBackend.post(ENDPOINTS_AUTH.GOOGLE_CALLBACK, data);
            
            // Extrai e transforma os dados da resposta para corresponder ao esquema esperado.
            const responseData = response.data.dados; // Extrai a propriedade 'dados'
            const transformedData = {
                token: responseData.token,
                usuario: responseData.user,       // Renomeia 'user' para 'usuario'
                isNewUser: responseData.isNewUser
            };

            const dadosValidados = GoogleLoginResponseSchema.parse(transformedData);
            
            apiLogger.logSuccess('resolverSessaoLogin', dadosValidados);
            
            return dadosValidados;
        } catch (error) {
            apiLogger.logFailure('resolverSessaoLogin', error);
            throw error;
        }
    }
}

export default new AutenticacaoAPISupremo();

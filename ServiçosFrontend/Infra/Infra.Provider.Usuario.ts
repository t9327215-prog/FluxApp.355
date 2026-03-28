
import backend from '../Cliente.Backend.js'; 
import { IUsuarioRequest, validarUsuarioRequest } from '../Contratos/Def.Requisicao.Usuario';
import { IUsuarioResponse, validarUsuarioResponse } from '../Contratos/Def.Resposta.Usuario';
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';
import LoggerParaInfra from '../SistemaObservabilidade/Log.Infra';

const logger = new LoggerParaInfra('Provider.Usuario');

class InfraProviderUsuario {

    public realizarLoginComEmail(params: { email: string; senha?: string; }): Promise<any> {
        return backend.post(ENDPOINTS_AUTH.LOGIN, params).catch(error => {
            logger.error('Erro ao realizar login com email', error);
            throw error;
        });
    }

    public postUsuario(url: string, data: unknown): Promise<IUsuarioResponse> {
        try {
            const dadosValidos: IUsuarioRequest = validarUsuarioRequest(data);
            return backend.post<IUsuarioResponse>(url, dadosValidos)
              .then(res => validarUsuarioResponse(res.data))
              .catch(error => {
                  logger.error(`Erro ao fazer POST para ${url}`, error);
                  throw error;
              });
        } catch (error) {
            logger.error('Erro de validação síncrona em postUsuario', error);
            return Promise.reject(error);
        }
    }

    public get<T = any>(url: string, config?: any): Promise<any> {
        return backend.get<T>(url, config).catch(error => {
            logger.error(`Erro ao fazer GET para ${url}`, error);
            throw error;
        });
    }

    public post<T = any>(url: string, data?: any, config?: any): Promise<any> {
        return backend.post<T>(url, data, config).catch(error => {
            logger.error(`Erro ao fazer POST para ${url}`, error);
            throw error;
        });
    }

    public put<T = any>(url: string, data?: any, config?: any): Promise<any> {
        return backend.put<T>(url, data, config).catch(error => {
            logger.error(`Erro ao fazer PUT para ${url}`, error);
            throw error;
        });
    }

    public delete<T = any>(url: string, config?: any): Promise<any> {
        return backend.delete<T>(url, config).catch(error => {
            logger.error(`Erro ao fazer DELETE para ${url}`, error);
            throw error;
        });
    }
}

export const infraProvider = new InfraProviderUsuario();

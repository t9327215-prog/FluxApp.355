
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IUsuario } from '../Contratos/Contrato.Usuario';
import { IUsuarioRequest, validarUsuarioRequest } from '../Contratos/Def.Requisicao.Usuario';
import { IUsuarioResponse, validarUsuarioResponse } from '../Contratos/Def.Resposta.Usuario';
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';

// NOTA DE REATORAÇÃO: A dependência estática do serviço de autenticação foi removida daqui
// para quebrar a dependência circular. O serviço agora é carregado dinamicamente
// dentro dos interceptadores.

class InfraProviderUsuario {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: '/api/v1',
            headers: { 'Content-Type': 'application/json' },
        });

        this.api.interceptors.request.use((config: AxiosRequestConfig) => {
            // Importação dinâmica para quebrar o ciclo de dependência.
            // O serviço só é carregado quando uma requisição é feita.
            const { servicoAutenticacao } = require('../ServiçoDeAutenticação/Auth.Application');
            const token = servicoAutenticacao.getState().token;

            if (token && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Importação dinâmica para quebrar o ciclo de dependência.
                    const { servicoAutenticacao } = require('../ServiçoDeAutenticação/Auth.Application');
                    servicoAutenticacao.logout();
                }
                return Promise.reject(error);
            }
        );
    }

    // --- MÉTODOS ESPECIALIZADOS E CONTRATADOS ---

    /**
     * Realiza a chamada de login, utilizando o endpoint de autenticação correto.
     * O tipo LoginEmailParams foi internalizado para remover a dependência da camada de aplicação.
     */
    public realizarLoginComEmail(params: { email: string; senha?: string; }): Promise<AxiosResponse<{ token: string; usuario: IUsuario; isNewUser: boolean; }>> {
        return this.post<{ token: string; usuario: IUsuario; isNewUser: boolean; }>(ENDPOINTS_AUTH.LOGIN, params);
    }

    public postUsuario(url: string, data: unknown): Promise<IUsuarioResponse> {
        const dadosValidos: IUsuarioRequest = validarUsuarioRequest(data);

        return this.api.post<IUsuarioResponse>(url, dadosValidos)
          .then(res => {
            return validarUsuarioResponse(res.data);
          });
    }

    // --- MÉTODOS GENÉRICOS (para chamadas não contratadas) ---

    public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.get<T>(url, config);
    }

    public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.post<T>(url, data, config);
    }

    public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.put<T>(url, data, config);
    }

    public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.delete<T>(url, config);
    }
}

// A instância continua com o mesmo nome para manter a compatibilidade com os arquivos que a importam.
export const infraProvider = new InfraProviderUsuario();

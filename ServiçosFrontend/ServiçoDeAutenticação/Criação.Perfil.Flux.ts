
/**
 * @file Serviço para gestão de perfis de usuário no Flux em TypeScript.
 * Unifica a lógica de criação, busca e atualização de perfis, usando endpoints seguros (/me).
 */

import Sistema.Autenticacao.Supremo from './Sistema.Autenticacao.Supremo';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/profiles`;

// --- Interfaces ---

interface ProfileData {
    id: string;
    usuarioId: string;
    nome: string;
    apelido: string;
    bio?: string;
    urlFoto?: string;
    site?: string;
    privado?: boolean;
    perfilCompleto?: boolean;
    dataCriacao?: string | Date;
    dataAtualizacao?: string | Date;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const GestorRequisicoesPerfil = {
    async request<T>(method: HttpMethod, endpoint: string = '', data: object | null = null): Promise<T> {
        const token = Sistema.Autenticacao.Supremo.getToken();
        if (!token) {
            return Promise.reject(new Error('Token de autenticação não encontrado.'));
        }

        const config: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            
            const responseText = await response.text();

            if (!response.ok) {
                let errorMessage = `Erro ${response.status} na API de perfis.`;
                if (responseText) {
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                        errorMessage = responseText.trim().startsWith('<') ? 'Ocorreu um erro no servidor.' : responseText;
                    }
                }
                throw new Error(errorMessage);
            }

            if (response.status === 204 || !responseText) {
                return {} as T;
            }

            try {
                return JSON.parse(responseText) as T;
            } catch (error) {
                console.error('Falha ao parsear a resposta JSON do servidor:', responseText);
                throw new Error('A resposta do servidor não é um JSON válido.');
            }

        } catch (error) {
            console.error(`[GestorRequisicoesPerfil] Falha na requisição ${method} para ${API_BASE_URL}${endpoint}:`, error);
            throw error;
        }
    },

    get<T>(endpoint: string): Promise<T> { return this.request<T>('GET', endpoint); },
    post<T>(endpoint: string, data: object): Promise<T> { return this.request<T>('POST', endpoint, data); },
    put<T>(endpoint: string, data: object): Promise<T> { return this.request<T>('PUT', endpoint, data); },
    delete<T>(endpoint: string): Promise<T> { return this.request<T>('DELETE', endpoint); },
};

const profileService = {
    /**
     * Busca o perfil público de qualquer usuário pelo ID.
     */
    async getUserProfile(userId: string): Promise<ProfileData> {
        if (!userId) throw new Error('O ID do usuário é obrigatório para buscar o perfil.');
        return GestorRequisicoesPerfil.get<ProfileData>(`/${userId}`);
    },

    /**
     * Busca o perfil do usuário autenticado usando o endpoint /me.
     */
    async getMyProfile(): Promise<ProfileData> {
        return GestorRequisicoesPerfil.get<ProfileData>('/me');
    },

    /**
     * Atualiza o perfil do usuário autenticado.
     * @param profileData - Os dados do perfil a serem atualizados.
     */
    async atualizarPerfil(profileData: Partial<ProfileData>): Promise<ProfileData> {
        return GestorRequisicoesPerfil.put<ProfileData>('/me', profileData);
    },

    /**
     * Deleta o perfil do usuário autenticado.
     */
    async deletarPerfil(): Promise<{}> {
        console.warn(`[profileService] Iniciando exclusão do perfil do usuário logado.`);
        return GestorRequisicoesPerfil.delete<{}>('/me');
    },
};

export default profileService;

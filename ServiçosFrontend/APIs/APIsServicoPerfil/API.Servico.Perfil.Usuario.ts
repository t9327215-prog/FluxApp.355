
import backend from '../../Cliente.Backend.js';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';

const API_URL = '/api/users';

/**
 * API para o serviço de perfil de usuário.
 * Abstrai as chamadas de rede para operações de perfil.
 */

const getOwnProfile = async (): Promise<Usuario> => {
    const response = await backend.get(`${API_URL}/me`);
    return response.data;
};

const getPublicProfileByUsername = async (username: string): Promise<Usuario> => {
    const response = await backend.get(`${API_URL}/name/${username}`);
    return response.data;
};

const updateProfile = async (userId: string, profileData: Partial<Usuario>): Promise<Usuario> => {
    const response = await backend.put(`${API_URL}/${userId}`, profileData);
    return response.data;
};

export const apiPerfilUsuario = {
    getOwnProfile,
    getPublicProfileByUsername,
    updateProfile,
};

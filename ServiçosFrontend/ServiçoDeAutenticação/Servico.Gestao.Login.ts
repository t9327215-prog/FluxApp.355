
import { LoginUsuarioDTO as LoginDto } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import ClienteBackend from '../Cliente.Backend';
import { servicoGestaoSessao } from './Servico.Gestao.Sessao';
import { config } from '../ValidaçãoDeAmbiente/config';
import { servicoMetodoGoogle } from './Servico.Metodo.Google';
import { servicoMetodoEmailSenha } from './Servico.Metodo.EmailSenha';
import authApi from '../APIs/authApi';

interface User extends Usuario {}

// --- Central Session Handler ---
const handleSuccessfulLogin = (authResult: { token: string; user: Usuario | null }) => {
    const { token, user } = authResult;
    if (token && user) {
        localStorage.setItem('userToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        ClienteBackend.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { token, user };
    }
    throw new Error('Resultado de autenticação inválido.');
};

// --- Login Service Implementation ---
const loginService = {
    login: async (dadosLogin: LoginDto) => {
        const authResult = await servicoMetodoEmailSenha.autenticar(dadosLogin);
        return handleSuccessfulLogin(authResult);
    },

    loginComGoogle: async () => {
        const authResult = await servicoMetodoGoogle.autenticar();
        return handleSuccessfulLogin(authResult);
    },

    completeProfile: async (profileData: Partial<Usuario>): Promise<User> => {
        const { data } = await authApi.updateProfile(profileData);
        if (data && data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.user;
        }
        throw new Error('Resposta de atualização de perfil inválida.');
    },
};

// --- Simulated Profile Completion ---
const simulatedCompleteProfile = async (profileData: Partial<Usuario>): Promise<User> => {
    const currentUser = servicoGestaoSessao.getCurrentUser();
    if (!currentUser) throw new Error("Usuário não encontrado na simulação.");
    const updatedUser = { ...currentUser, ...profileData, perfilCompleto: true };
    await new Promise(resolve => setTimeout(resolve, 500));
    return updatedUser as User;
};

// --- Exporting the correct service ---
export const servicoGestaoLogin = {
    ...loginService,
    completeProfile: config.VITE_APP_ENV === 'simulation' 
        ? simulatedCompleteProfile 
        : loginService.completeProfile
};

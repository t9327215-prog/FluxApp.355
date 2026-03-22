
import { LoginUsuarioDTO as LoginDto } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import ClienteBackend from '../Cliente.Backend';
import { servicoMetodoGoogle } from './Servico.Metodo.Google';
import { servicoMetodoEmailSenha } from './Servico.Metodo.EmailSenha';

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
};

// --- Exporting the correct service ---
// No simulation is needed here as the core login logic is not simulated in this file.
export const servicoGestaoLogin = loginService;

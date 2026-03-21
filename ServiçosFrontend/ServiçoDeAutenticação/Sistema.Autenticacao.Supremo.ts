
import { config } from '../ValidaçãoDeAmbiente/config';
import logger from '../logger';
import { CriarUsuarioDTO, LoginUsuarioDTO as LoginDto } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import authApi from '../APIs/authApi';
import ClienteBackend from '../Cliente.Backend';
import { servicoPerfilUsuario } from './Servico.Perfil.Usuario';

// --- Types & Interfaces ---
interface User extends Usuario {}
interface AuthState {
    user: User | null;
    loading: boolean;
    error: Error | null;
}
type AuthChangeListener = (state: AuthState) => void;

// --- Real API Service Implementation ---
const realBaseService = {
    getCurrentUser: (): User | null => {
        try {
            const item = localStorage.getItem('user');
            return item ? JSON.parse(item) : null;
        } catch (error) {
            logger.error('[AuthService] Erro ao buscar usuário do localStorage:', error);
            return null;
        }
    },
    validateSession: async (signal: AbortSignal): Promise<User | null> => {
        const token = localStorage.getItem('userToken');
        if (!token) return null;
        ClienteBackend.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const { data } = await authApi.validateToken();
            if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
            const user = data.user;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            if (!signal.aborted) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('user');
                delete ClienteBackend.defaults.headers.common['Authorization'];
            }
            throw error;
        }
    },
    login: async (dadosLogin: LoginDto) => {
        const { data } = await authApi.login(dadosLogin.email, dadosLogin.password);
        if (data && data.token && data.user) {
            localStorage.setItem('userToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            ClienteBackend.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return data;
        }
        throw new Error('Resposta de login inválida do servidor.');
    },
    logout: () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        delete ClienteBackend.defaults.headers.common['Authorization'];
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

// --- Simulated Service Implementation ---
const simulatedBaseService = {
    getCurrentUser: (): User | null => {
        try {
            const item = localStorage.getItem('user');
            return item ? JSON.parse(item) : null;
        } catch { return null; }
    },
    validateSession: (signal: AbortSignal): Promise<User | null> => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => resolve(simulatedBaseService.getCurrentUser()), 300);
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        });
    },
    login: async (dados: LoginDto) => ({ token: 'abc-simulated', user: await servicoPerfilUsuario.getOwnProfile() as User }),
    logout: () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
    },
    completeProfile: async (profileData: Partial<Usuario>): Promise<User> => {
        const currentUser = simulatedBaseService.getCurrentUser();
        if (!currentUser) throw new Error("Usuário não encontrado na simulação.");
        const updatedUser = { ...currentUser, ...profileData, perfilCompleto: true };
        await new Promise(resolve => setTimeout(resolve, 500));
        return updatedUser as User;
    }
};

// --- The Brain: AuthService State Machine ---
const createAuthService = (baseService: any) => {
    let listeners: AuthChangeListener[] = [];
    let currentState: AuthState = { user: null, loading: true, error: null };
    let validationController: AbortController | null = null;

    const setState = (newState: Partial<AuthState>) => {
        const oldState = { ...currentState };
        currentState = { ...currentState, ...newState };
        const userChanged = JSON.stringify(oldState.user) !== JSON.stringify(currentState.user);
        if (oldState.loading !== currentState.loading || oldState.error !== currentState.error || userChanged) {
            notify();
        }
    };

    const notify = () => {
        logger.log('[AuthService] Notificando listeners:', currentState);
        listeners.forEach(listener => listener(currentState));
    };

    const initialize = async () => {
        if (validationController) validationController.abort();
        validationController = new AbortController();
        const { signal } = validationController;

        try {
            const userFromStorage = baseService.getCurrentUser();
            if (userFromStorage) setState({ user: userFromStorage });
            
            const validatedUser = await baseService.validateSession(signal);
            if (!signal.aborted) setState({ user: validatedUser, loading: false });

        } catch (error: any) {
            if (!signal.aborted) {
                logger.error('[AuthService] Falha na validação inicial:', error);
                setState({ user: null, loading: false, error });
            }
        }
    };

    const service = {
        getState: () => currentState,
        subscribe: (listener: AuthChangeListener) => {
            listeners.push(listener);
            return () => { listeners = listeners.filter(l => l !== listener); };
        },
        async login(dadosLogin: LoginDto) {
            setState({ loading: true, error: null });
            try {
                const data = await baseService.login(dadosLogin);
                setState({ user: data.user, loading: false });
                return data;
            } catch (error: any) {
                setState({ loading: false, error });
                throw error;
            }
        },
        logout() {
            baseService.logout();
            setState({ user: null, loading: false, error: null });
        },
        async completeProfile(profileData: Partial<Usuario>) {
            setState({ loading: true, error: null });
            try {
                const updatedUser = await baseService.completeProfile(profileData);
                setState({ user: updatedUser, loading: false });
                return updatedUser;
            } catch (error: any) {
                setState({ loading: false, error });
                throw error;
            }
        },
        reinitialize: initialize,
    };
    
    initialize();
    return service;
};

// --- Ponto de Decisão do Serviço ---
const baseService = config.VITE_APP_ENV === 'simulation' ? simulatedBaseService : realBaseService;

// --- Singleton Export ---
const SistemaAutenticacaoSupremo = createAuthService(baseService);

logger.log(`[AuthService] Sistema de Autenticação inicializado em modo: ${config.VITE_APP_ENV}`);

export default SistemaAutenticacaoSupremo;


import { config } from '../ValidaçãoDeAmbiente/config';
import logger from '../logger';
import { CriarUsuarioDTO, LoginUsuarioDTO as LoginDto } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import { metodoGoogle } from './Servico.Metodo.Google';
import { metodoEmailSenha } from './Servico.Metodo.Email.Senha';
import authApi from '../APIs/authApi';
import { mockServicoPerfilUsuario } from '../ServiçoDeSimulação/simulacoes/Simulacao.Perfil.Usuario';

// --- Types & Interfaces ---
interface User extends Usuario { /* ... existing properties ... */ }
interface AuthState {
    user: User | null;
    loading: boolean;
    error: Error | null;
}
type AuthChangeListener = (state: AuthState) => void;

// --- The Brain: AuthService State Machine ---
const createAuthService = (baseService: any) => {
    let listeners: AuthChangeListener[] = [];
    let currentState: AuthState = {
        user: null,
        loading: true,
        error: null,
    };
    let validationController: AbortController | null = null;

    const setState = (newState: Partial<AuthState>) => {
        const oldState = { ...currentState };
        currentState = { ...currentState, ...newState };

        const userChanged = oldState.user?.id !== currentState.user?.id || JSON.stringify(oldState.user) !== JSON.stringify(currentState.user);

        if (oldState.loading !== currentState.loading || oldState.error !== currentState.error || userChanged) {
            notify();
        }
    };

    const notify = () => {
        logger.log('[AuthService] Notificando listeners com novo estado:', currentState);
        listeners.forEach(listener => listener(currentState));
    };

    const initialize = async () => {
        if (validationController) {
            validationController.abort();
        }
        validationController = new AbortController();
        const { signal } = validationController;

        try {
            const userFromStorage = baseService.getCurrentUser();
            if (userFromStorage) {
                setState({ user: userFromStorage });
            }
            
            const validatedUser = await baseService.validateSession(signal);
            
            if (!signal.aborted) {
                setState({ user: validatedUser, loading: false });
            }

        } catch (error: any) {
            if (!signal.aborted) {
                logger.error('[AuthService] Falha na validação inicial', error);
                setState({ user: null, loading: false, error });
            }
        }
    };

    const service = {
        // Public state accessor
        getState: () => currentState,

        // Subscription
        subscribe: (listener: AuthChangeListener) => {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter(l => l !== listener);
            };
        },

        // Actions
        async login(dadosLogin: LoginDto) {
            setState({ loading: true, error: null });
            try {
                const data = await baseService.login(dadosLogin);
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setState({ user: data.user, loading: false });
                return data;
            } catch (error: any) {
                setState({ loading: false, error });
                throw error;
            }
        },

        logout() {
            baseService.logout(); // Clear storage
            setState({ user: null, loading: false, error: null });
        },

        async completeProfile(profileData: Partial<Usuario>) {
            setState({ loading: true, error: null });
            try {
                const updatedUser = await baseService.completeProfile(profileData);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setState({ user: updatedUser, loading: false });
                return updatedUser;
            } catch (error: any) {
                setState({ loading: false, error });
                throw error;
            }
        },
    };
    
    // Auto-initialize on creation
    initialize();

    return service;
};


// --- Base Implementations (Dummy) ---
const dummyBaseService = {
    getCurrentUser: (): User | null => {
        try {
            const item = localStorage.getItem('user');
            return item ? JSON.parse(item) : null;
        } catch { return null; }
    },
    validateSession: (signal: AbortSignal): Promise<User | null> => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => resolve(dummyBaseService.getCurrentUser()), 500);
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        });
    },
    login: async (dados: LoginDto) => ({ token: 'abc-simulated', user: await mockServicoPerfilUsuario.getOwnProfile() as User }),
    logout: () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
    },
    completeProfile: async (profileData: Partial<Usuario>): Promise<User> => {
        console.log("SIMULAÇÃO: Chamando completeProfile com dados:", profileData);
        const currentUser = dummyBaseService.getCurrentUser();
        if (!currentUser) {
            throw new Error("Usuário não encontrado na simulação.");
        }

        // Simula a atualização do perfil
        const updatedUser = {
            ...currentUser,
            ...profileData,
            perfilCompleto: true, // A mágica acontece aqui!
        };
        
        console.log("SIMULAÇÃO: Perfil do usuário atualizado:", updatedUser);
        
        // Simula uma pequena latência de rede
        await new Promise(resolve => setTimeout(resolve, 500));

        return updatedUser as User;
    }
};


// --- Singleton Export ---
const SistemaAutenticacaoSupremo = createAuthService(dummyBaseService);
export default SistemaAutenticacaoSupremo;

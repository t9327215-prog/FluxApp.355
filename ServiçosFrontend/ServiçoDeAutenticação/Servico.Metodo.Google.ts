
import { config } from '../ValidaçãoDeAmbiente/config';
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import { servicoGestaoPerfil } from './Servico.Gestao.Perfil';

// --- Interface ---
export interface IServicoGoogleAuth {
    autenticar(): Promise<{ token: string; user: Usuario | null }>;
}

// --- Real Implementation ---
class ServicoGoogleAuthReal implements IServicoGoogleAuth {
    async autenticar(): Promise<{ token: string; user: Usuario | null }> {
        console.log("Real Google Auth: Iniciando autenticação...");
        // Simulação de chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const fakeBackendResponse = {
            token: 'real-google-jwt-token-from-backend',
            user: {
                id: 'user-google-real-123',
                nome: 'Usuário Google Real',
                email: 'real.google.user@example.com',
                perfilCompleto: true,
            } as Usuario
        };
        
        console.log("Real Google Auth: Autenticação bem-sucedida.");
        return fakeBackendResponse;
    }
}

// --- Simulated Implementation ---
class ServicoGoogleAuthSimulado implements IServicoGoogleAuth {
    async autenticar(): Promise<{ token: string; user: Usuario | null }> {
        console.log("Simulated Google Auth: Iniciando autenticação...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Usando um perfil genérico para a simulação
        const user = await servicoGestaoPerfil.getPublicProfileByUsername('usuariopadrao');
        
        const simulatedResponse = {
            token: 'simulated-google-jwt-token',
            user: user
        };

        console.log("Simulated Google Auth: Autenticação bem-sucedida.");
        return simulatedResponse;
    }
}

// --- Service Selection ---
let servicoSelecionado: IServicoGoogleAuth;

if (config.VITE_APP_ENV === 'simulation') {
    console.log("INFO: Usando MODO DE SIMULAÇÃO para o Serviço de Autenticação Google.");
    servicoSelecionado = new ServicoGoogleAuthSimulado();
} else {
    console.log("INFO: Usando Serviço de Autenticação Google REAL (Produção).");
    servicoSelecionado = new ServicoGoogleAuthReal();
}

export const servicoMetodoGoogle = servicoSelecionado;

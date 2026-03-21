
import API_Servico_Metodo_Google from '../APIs/API.Servico.Metodo.Google';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import { Sessao } from '../../../types/Saida/Types.Estrutura.Sessao';

// --- Interfaces ---
interface User extends Usuario {
  username?: string;
  nickname?: string;
  avatar?: string;
  website?: string;
  isPrivate?: boolean;
  profile_completed?: boolean;
  photoUrl?: string;
  stats?: { posts: number; followers: number; following: number };
  products?: any[];
  profile?: any;
}

interface SessionData extends Sessao {
  token: string;
  user: User;
}

export const metodoGoogle = {
    /**
     * Intermedia a chamada de login com o Google para a camada de API.
     * @param googleCredential - A credencial (token) fornecida pelo Google.
     * @param referredBy - Opcional: ID do usuário que indicou.
     * @returns Retorna os dados da resposta da API.
     */
    async login(googleCredential: string, referredBy?: string): Promise<SessionData> {
        try {
            // Corrigido para passar os argumentos diretamente para a função da API
            const { data } = await API_Servico_Metodo_Google.loginComGoogle(googleCredential, referredBy);
            
            return data;

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Falha na autenticação com o Google.';
            throw new Error(errorMessage);
        }
    },
};

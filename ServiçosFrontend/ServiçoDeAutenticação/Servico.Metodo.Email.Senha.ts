
import API_Servico_Metodo_Email_Senha from '../APIs/API.Servico.Metodo.Email.Senha';
import { LoginUsuarioDTO as LoginDto } from '../../../types/Entrada/Dto.Estrutura.Usuario';
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

export const metodoEmailSenha = {
    /**
     * Intermedia a chamada de login com email e senha para a camada de API.
     * @param dadosLogin - Objeto contendo o email e a senha do usuário.
     * @returns Retorna os dados da resposta da API.
     */
    async login(dadosLogin: LoginDto): Promise<SessionData> {
        try {
            // A camada de API agora espera o objeto DTO diretamente
            const { data } = await API_Servico_Metodo_Email_Senha.login(dadosLogin);
            return data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Falha no login. Verifique suas credenciais.';
            throw new Error(errorMessage);
        }
    },
};

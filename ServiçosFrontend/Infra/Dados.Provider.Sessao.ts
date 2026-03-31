import { z } from 'zod';
import { DadosBase } from './Dados.Base';
import { infraProviderSessao } from './Infra.Provider.Sessao';
import { mapearFrontendParaBackend } from '../Contratos/Contrato.Comunicacao.Usuario';

const UsuarioRequestSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

const LoginSchema = z.object({
  email: z.string().email('Email inválido.'),
  senha: z.string().min(1, 'A senha é obrigatória.'),
});

const LoginSocialSchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    googleId: z.string(),
    avatarUrl: z.string().url().optional(),
    tokenProvider: z.string(),
});

const CompletarPerfilSchema = z.object({
  apelido: z.string().min(3, "O apelido deve ter pelo menos 3 caracteres."),
  nome: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
  bio: z.string().optional(),
});

class DadosProviderSessao extends DadosBase {
    constructor() {
        super('DadosProvider.Sessao');
    }

    async login(email: string, senha: string): Promise<any> {
        return this.handleRequest(LoginSchema, { email, senha }, (dadosValidos) => 
            infraProviderSessao.login(mapearFrontendParaBackend(dadosValidos))
        );
    }

    async lidarComLoginSocial(dadosLogin: unknown): Promise<any> {
        return this.handleRequest(LoginSocialSchema, dadosLogin, (dadosValidos) => 
            infraProviderSessao.lidarComLoginSocial(dadosValidos)
        );
    }

    async criarUsuario(dadosUsuario: unknown): Promise<any> {
        return this.handleRequest(UsuarioRequestSchema, dadosUsuario, (dadosValidos) => 
            infraProviderSessao.criarUsuario(mapearFrontendParaBackend(dadosValidos))
        );
    }

    async completarPerfil(idUsuario: string, apelido: string, nome: string, bio: string, avatar: File | null): Promise<any> {
        const formData = new FormData();
        formData.append('idUsuario', idUsuario);
        formData.append('apelido', apelido);
        formData.append('nome', nome);
        formData.append('bio', bio);
        if (avatar) {
          formData.append('avatar', avatar, avatar.name);
        }

        try {
            CompletarPerfilSchema.parse({ apelido, nome, bio });
            return await infraProviderSessao.completarPerfil(formData);
        } catch (error) {
            this.log.error('Erro de validação ou de requisição ao completar perfil', { error });
            throw error;
        }
    }
}

export const dadosProviderSessao = new DadosProviderSessao();

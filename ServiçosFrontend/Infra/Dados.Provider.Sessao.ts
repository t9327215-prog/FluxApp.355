import { z } from 'zod';
import { DadosBase } from './Dados.Base';
import { infraProviderSessao } from './Infra.Provider.Sessao';

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

class DadosProviderSessao extends DadosBase {
    constructor() {
        super('DadosProvider.Sessao');
    }

    async login(email: string, senha: string): Promise<any> {
        return this.handleRequest(LoginSchema, { email, senha }, (dadosValidos) => 
            infraProviderSessao.login(dadosValidos)
        );
    }

    async lidarComLoginSocial(dadosLogin: unknown): Promise<any> {
        return this.handleRequest(LoginSocialSchema, dadosLogin, (dadosValidos) => 
            infraProviderSessao.lidarComLoginSocial(dadosValidos)
        );
    }

    async criarUsuario(dadosUsuario: unknown): Promise<any> {
        return this.handleRequest(UsuarioRequestSchema, dadosUsuario, (dadosValidos) => 
            infraProviderSessao.criarUsuario(dadosValidos)
        );
    }
}

export const dadosProviderSessao = new DadosProviderSessao();

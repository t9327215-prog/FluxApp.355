import { z } from 'zod';
import { DadosBase } from './Dados.Base';
import { infraProviderUsuario } from './Infra.Provider.Usuario';

const UsuarioRequestSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
});

const PerfilUpdateRequestSchema = UsuarioRequestSchema.partial();

class DadosProviderUsuario extends DadosBase {
    constructor() {
        super('DadosProvider.Usuario');
    }

    async completarPerfil(perfilData: unknown): Promise<any> {
        return this.handleRequest(PerfilUpdateRequestSchema, perfilData, (dadosValidos) => 
            infraProviderUsuario.completarPerfil(dadosValidos)
        );
    }

    async buscarUsuarioPorId(id: string): Promise<any> {
        try {
            return await infraProviderUsuario.buscarUsuarioPorId(id);
        } catch (error) {
            this.logger.error(`Erro ao buscar usuário por ID: ${id}`, error);
            throw error;
        }
    }

    async buscarUsuarioPorEmail(email: string): Promise<any> {
        try {
            return await infraProviderUsuario.buscarUsuarioPorEmail(email);
        } catch (error) {
            this.logger.error(`Erro ao buscar usuário por Email: ${email}`, error);
            throw error;
        }
    }
}

export const dadosProviderUsuario = new DadosProviderUsuario();

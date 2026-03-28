
// ServiçosFrontend/Contratos/Def.Requisicao.Usuario.ts
import { z } from 'zod';

// Valida os dados para CRIAR ou ATUALIZAR um usuário.
export const UsuarioRequestSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  nickname: z.string().min(3, 'O nickname deve ter no mínimo 3 caracteres.'),
  email: z.string().email('Email inválido.'),
  // A senha é opcional. Será usada na criação do usuário ou na atualização da senha.
  // Em outras atualizações de perfil, pode ser omitida.
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.').optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  website: z.string().optional(),
});

// Tipo derivado do schema
export type IUsuarioRequest = z.infer<typeof UsuarioRequestSchema>;

// Função de validação exportada
export const validarUsuarioRequest = (data: unknown): IUsuarioRequest => {
  return UsuarioRequestSchema.parse(data);
};

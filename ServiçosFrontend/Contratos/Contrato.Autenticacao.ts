
import { z } from 'zod';
import { createContractLogger } from '../SistemaObservabilidade/Log.Contratos';

/**
 * @file Define os contratos (schemas) para o serviço de autenticação usando Zod.
 * Para cada schema, uma função de validação é exportada. Essa função encapsula
 * a lógica de parsing e logging, simplificando o uso nos serviços e garantindo
 * que todas as falhas de validação sejam registradas automaticamente.
 */

// Cria uma instância de logger para este contrato. 
// O nome 'Contrato.Autenticacao' agrupará todos os logs originados deste arquivo.
const log = createContractLogger('Contrato.Autenticacao');

// --- Schemas e Funções de Validação ---

// Schema para a requisição de login
export const LoginRequestSchema = z.object({
  email: z.string({
    required_error: "O e-mail é obrigatório.",
    invalid_type_error: "O e-mail deve ser um texto.",
  }).email("O formato do e-mail é inválido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

/**
 * Valida os dados de uma requisição de login.
 * @param data Os dados a serem validados.
 * @returns Os dados validados e tipados.
 * @throws Lança um erro se a validação falhar, após registrar o erro.
 */
export const validateLoginRequest = (data: unknown) => {
    try {
        return LoginRequestSchema.parse(data);
    } catch (err) {
        log.logValidationError('LoginRequest', err, data);
        throw err;
    }
};

// Schema para a requisição de login com Google
export const GoogleLoginRequestSchema = z.object({
  token: z.string(),
});

/**
 * Valida os dados de uma requisição de login com Google.
 */
export const validateGoogleLoginRequest = (data: unknown) => {
    try {
        return GoogleLoginRequestSchema.parse(data);
    } catch (err) {
        log.logValidationError('GoogleLoginRequest', err, data);
        throw err;
    }
};

// Schema para os dados do usuário autenticado
export const UsuarioAutenticadoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
});

// Schema para a resposta da API de login
export const LoginResponseSchema = z.object({
  token: z.string(),
  usuario: UsuarioAutenticadoSchema,
});

/**
 * Valida os dados da resposta de uma requisição de login.
 */
export const validateLoginResponse = (data: unknown) => {
    try {
        return LoginResponseSchema.parse(data);
    } catch (err) {
        log.logValidationError('LoginResponse', err, data);
        throw err;
    }
};

// Schema para a resposta da API de login com Google
export const GoogleLoginResponseSchema = z.object({
  token: z.string(),
  usuario: UsuarioAutenticadoSchema,
  isNewUser: z.boolean(),
});

/**
 * Valida os dados da resposta de uma requisição de login com Google.
 */
export const validateGoogleLoginResponse = (data: unknown) => {
    try {
        return GoogleLoginResponseSchema.parse(data);
    } catch (err) {
        log.logValidationError('GoogleLoginResponse', err, data);
        throw err;
    }
};

// --- Tipos Derivados ---
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type GoogleLoginRequest = z.infer<typeof GoogleLoginRequestSchema>;
export type GoogleLoginResponse = z.infer<typeof GoogleLoginResponseSchema>;
export type UsuarioAutenticado = z.infer<typeof UsuarioAutenticadoSchema>;


// --- Contrato do Serviço ---
export interface IAutenticacaoServico {
    login(data: LoginRequest): Promise<LoginResponse>;
    resolverSessaoLogin(data: GoogleLoginRequest): Promise<GoogleLoginResponse>;
}

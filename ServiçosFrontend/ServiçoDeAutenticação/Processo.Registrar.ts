
import { IUsuarioDto } from '../Contratos/Contrato.Comunicacao.Usuario';

/**
 * Interface para os parâmetros de registro original (vindo do formulário).
 */
export interface IRegistroParams {
    nome: string;
    email: string;
    senha: string;
    confirmacaoSenha?: string;
    termosAceitos?: boolean;
    indicadoPor?: string;
}

/**
 * Resultado da operação de registro.
 */
export interface IResultadoRegistro {
    sucesso: boolean;
    mensagem: string;
    usuarioId?: string;
    usuario?: IUsuarioDto;
    token?: string;
}

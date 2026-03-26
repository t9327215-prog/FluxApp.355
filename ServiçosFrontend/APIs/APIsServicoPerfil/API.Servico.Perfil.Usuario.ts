
import { IPerfilUsuarioServico } from "../../Contratos/Contrato.Perfil.Usuario";
import { PerfilUsuario } from "../../Contratos/Contrato.Perfil.Usuario";
import ClienteBackend from "../../Cliente.Backend";
import { ENDPOINTS_PERFIL } from "../../EndPoints/EndPoints.Perfil";


class PerfilUsuarioAPISupabase implements IPerfilUsuarioServico {
    async getPerfilUsuario(userId: string): Promise<PerfilUsuario> {
        const response = await ClienteBackend.get(ENDPOINTS_PERFIL.USUARIO_POR_ID(userId));
        return response.data;
    }

    async getPerfilUsuarioPorNome(username: string): Promise<PerfilUsuario> {
        const response = await ClienteBackend.get(ENDPOINTS_PERFIL.USUARIO_POR_NOME(username));
        return response.data;
    }

    async getMeuPerfil(): Promise<PerfilUsuario> {
        const response = await ClienteBackend.get(ENDPOINTS_PERFIL.ME);
        return response.data;
    }
}

export default new PerfilUsuarioAPISupabase();

import { IAuthService } from "../ServiçoDeAutenticação/Auth.Application";

export class FinalizarLoginComGoogleUseCase {
    constructor(private authService: IAuthService) {}

    async execute(idToken: string): Promise<string> {
        if (!idToken) {
            throw new Error("ID token é obrigatório para finalizar o login com Google.");
        }

        try {
            return await this.authService.finalizarLoginComGoogle(idToken);
        } catch (error) { 
            console.error("Erro ao finalizar login com Google no use case:", error);
            throw error;
        }
    }
}

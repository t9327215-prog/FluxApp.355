
import { IAuthService } from "../ServiçoDeAutenticação/Auth.Application";

export class IniciarLoginComGoogleUseCase {
    constructor(private authService: IAuthService) {}

    async execute(): Promise<void> {
        try {
            await this.authService.iniciarLoginComGoogle();
        } catch (error) {
            // Adicionar tratamento de erro, se necessário, ou propagar
            console.error("Erro ao iniciar login com Google no use case:", error);
            throw error;
        }
    }
}

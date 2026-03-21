
import express from 'express';

const router = express.Router();

/**
 * @route GET /api/v1/config/boot
 * @description Fornece as variáveis de configuração públicas necessárias para o frontend.
 * @access Público
 */
router.get('/boot', (req, res) => {
    try {
        // Objeto para armazenar as configurações públicas
        const publicConfig = {
            // O frontend precisa do Google Client ID para o botão de login do Google.
            // Esta variável é segura para ser exposta publicamente.
            googleClientId: process.env.GOOGLE_CLIENT_ID,

            // Adicione outras chaves públicas aqui no futuro, se necessário.
            // Ex: stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        };

        // Validação: Garante que o googleClientId não seja undefined.
        if (!publicConfig.googleClientId) {
            req.logger.error('CONFIG_BOOT_VALIDATION_FAILURE', {
                reason: 'A variável de ambiente GOOGLE_CLIENT_ID não está definida no servidor.'
            });
            // Responde com um erro 503 (Serviço Indisponível) porque o servidor está mal configurado.
            return res.status(503).json({ 
                error: 'Serviço temporariamente indisponível devido a erro de configuração.' 
            });
        }

        req.logger.log('CONFIG_BOOT_SUCCESS', { path: req.path });
        res.json(publicConfig);

    } catch (error) {
        req.logger.error('CONFIG_BOOT_UNEXPECTED_ERROR', { 
            error: { message: error.message, stack: error.stack }
        });
        res.status(500).json({ error: 'Erro inesperado ao buscar as configurações do servidor.' });
    }
});

export default router;

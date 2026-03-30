import VariaveisFrontend from '../Config/Variaveis.Frontend';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';
import { IUsuarioSocial } from './types';

const logger = createServiceLogger('GoogleOAuth');

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    logger.logError('Falha ao decodificar o JWT', e);
    return null;
  }
}

export class GoogleOAuth {
  private static readonly REDIRECT_URI = `${window.location.origin}/auth/google/callback`;
  private static readonly SCOPE = 'openid profile email';
  private static readonly RESPONSE_TYPE = 'id_token';

  static iniciar(): void {
    const operation = 'iniciar';
    logger.logOperationStart(operation);

    const clientId = VariaveisFrontend.googleClientId;
    if (!clientId || clientId === 'CHAVE_NAO_DEFINIDA') {
      logger.logOperationError(operation, new Error('Google Client ID não configurado'));
      alert('A autenticação com Google não está configurada.');
      return;
    }

    const nonce = Math.random().toString(36).substring(2, 15);
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', this.REDIRECT_URI);
    authUrl.searchParams.set('response_type', this.RESPONSE_TYPE);
    authUrl.searchParams.set('scope', this.SCOPE);
    authUrl.searchParams.set('nonce', nonce);

    window.location.href = authUrl.toString();
  }

  static extrairTokenDaUrl(): string | null {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('id_token');
  }

  static processarCallback(idToken: string): IUsuarioSocial {
    const operation = 'processarCallback';
    logger.logOperationStart(operation);

    const payload = decodeJwt(idToken);
    if (!payload) {
      throw new Error('Token JWT inválido');
    }

    const usuario: IUsuarioSocial = {
      nome: payload.name as string,
      email: payload.email as string,
      googleId: payload.sub as string,
      avatarUrl: payload.picture as string | undefined,
    };

    logger.logOperationSuccess(operation, { email: usuario.email });
    return usuario;
  }
}

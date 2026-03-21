
type EnvConfig = {
  VITE_API_URL: string;
  VITE_APP_ENV: 'production' | 'simulation';
};

const DEFAULT_CONFIG: EnvConfig = {
  VITE_API_URL: 'http://localhost:3000',
  VITE_APP_ENV: 'simulation',
};

const getRuntimeConfig = (): Partial<Pick<EnvConfig, 'VITE_API_URL'>> => {
  const viteEnv = (import.meta as any)?.env || {};
  const windowEnv = (window as any).__ENV__ || {};
  return {
    VITE_API_URL: viteEnv.VITE_API_URL || windowEnv.VITE_API_URL,
  };
};

const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const loadEnvironment = (): EnvConfig => {
  const runtime = getRuntimeConfig();

  // Detect environment using Vite's built-in `import.meta.env.DEV` flag
  const isDevelopment = (import.meta as any).env?.DEV;
  const appEnv = isDevelopment ? 'simulation' : 'production';

  const finalConfig: EnvConfig = {
    VITE_API_URL: runtime.VITE_API_URL || DEFAULT_CONFIG.VITE_API_URL,
    VITE_APP_ENV: appEnv,
  };

  const warnings: string[] = [];

  if (!runtime.VITE_API_URL) {
    warnings.push('VITE_API_URL não definida. Usando fallback para localhost:3000.');
  }

  if (!isValidUrl(finalConfig.VITE_API_URL)) {
    warnings.push(`VITE_API_URL inválida: \"${finalConfig.VITE_API_URL}\". O app pode não conseguir se conectar ao backend.`);
  }

  if (warnings.length > 0) {
    console.warn('[CONFIG WARNING]', warnings.join(' '));
  } else {
    console.log('[CONFIG] Environment configurado com sucesso.');
  }
  
  console.log(`[CONFIG] Ambiente detectado: ${finalConfig.VITE_APP_ENV} (isDevelopment: ${isDevelopment})`);

  return finalConfig;
};

// Load config immediately and export it
export const config = loadEnvironment();

// Make it globally available for easier access and debugging
(window as any).__CONFIG__ = config;


export const ENDPOINTS_PERFIL = {
    ME: "/api/users/me",
    USUARIO_POR_NOME: (username: string) => `/api/users/name/${username}`,
    USUARIO_POR_ID: (userId: string) => `/api/users/${userId}`,
};

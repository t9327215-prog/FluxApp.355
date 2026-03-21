
// backend/Repositorios/Repositorio.Estrutura.Comentarios.js
import ConsultasComentarios from '../database/GestaoDeDados/PostgreSQL/Consultas.Estrutura.Comentarios.js';

const criarComentario = (tableName, parentIdColumn) => async (commentData) => {
    return ConsultasComentarios.criar(tableName, parentIdColumn, commentData);
};

const buscarComentariosPorParentId = (tableName, parentIdColumn) => async (parentId, options) => {
    return ConsultasComentarios.buscarPorParentId(tableName, parentIdColumn, parentId, options);
};

const buscarComentarioPorId = (tableName) => async (commentId) => {
    return ConsultasComentarios.buscarPorId(tableName, commentId);
};

const atualizarComentario = (tableName) => async (commentId, updates) => {
    return ConsultasComentarios.atualizar(tableName, commentId, updates);
};

const deletarComentario = (tableName) => async (commentId) => {
    return ConsultasComentarios.remover(tableName, commentId);
};

// Factory para criar um repositório de comentários para uma entidade específica
const criarRepositorioDeComentarios = (tableName, parentIdColumn) => ({
    criarComentario: criarComentario(tableName, parentIdColumn),
    buscarComentariosPorParentId: buscarComentariosPorParentId(tableName, parentIdColumn),
    buscarComentarioPorId: buscarComentarioPorId(tableName),
    atualizarComentario: atualizarComentario(tableName),
    deletarComentario: deletarComentario(tableName),
});

export { criarRepositorioDeComentarios };

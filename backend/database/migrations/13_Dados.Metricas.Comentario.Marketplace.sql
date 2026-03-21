
-- Habilita a extensão para gerar UUIDs, se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Remove a tabela de métricas de comentários do marketplace se ela já existir
DROP TABLE IF EXISTS marketplace_comment_metrics CASCADE;

-- Cria a tabela de métricas para os comentários do marketplace
CREATE TABLE marketplace_comment_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL UNIQUE,
    likes_count INT DEFAULT 0,
    reports_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (comment_id) REFERENCES marketplace_comments(id) ON DELETE CASCADE
);

-- Cria um índice na coluna comment_id para otimizar as buscas
CREATE INDEX IF NOT EXISTS idx_marketplace_comment_metrics_comment_id ON marketplace_comment_metrics(comment_id);

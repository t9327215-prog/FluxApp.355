
-- Habilita a extensão para gerar UUIDs, se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Remove a tabela de métricas de publicações do feed se ela já existir
DROP TABLE IF EXISTS post_metrics CASCADE;

-- Cria a tabela de métricas para as publicações do feed
CREATE TABLE post_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL UNIQUE,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Cria um índice na coluna post_id para otimizar as buscas
CREATE INDEX IF NOT EXISTS idx_post_metrics_post_id ON post_metrics(post_id);

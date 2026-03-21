-- Cria a tabela de comentários para as publicações do feed
CREATE TABLE IF NOT EXISTS feed_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de comentários do feed
CREATE INDEX IF NOT EXISTS idx_feed_comments_post_id ON feed_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_comments_author_id ON feed_comments(author_id);

-- Aplica o gatilho de updated_at na tabela feed_comments
DROP TRIGGER IF EXISTS update_feed_comments_updated_at ON feed_comments;
CREATE TRIGGER update_feed_comments_updated_at
BEFORE UPDATE ON feed_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

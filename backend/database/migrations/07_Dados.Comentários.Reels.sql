-- Cria a tabela de comentários para os reels
CREATE TABLE IF NOT EXISTS reel_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reel_id UUID NOT NULL REFERENCES reels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de comentários de reels
CREATE INDEX IF NOT EXISTS idx_reel_comments_reel_id ON reel_comments(reel_id);
CREATE INDEX IF NOT EXISTS idx_reel_comments_user_id ON reel_comments(user_id);

-- Aplica o gatilho de updated_at na tabela reel_comments
DROP TRIGGER IF EXISTS update_reel_comments_updated_at ON reel_comments;
CREATE TRIGGER update_reel_comments_updated_at
BEFORE UPDATE ON reel_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
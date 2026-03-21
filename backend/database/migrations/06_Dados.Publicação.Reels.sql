-- Cria a tabela de reels
CREATE TABLE IF NOT EXISTS reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    description TEXT,
    music_id TEXT, -- Pode ser um ID de um serviço de música
    hashtags JSONB,
    location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de reels
CREATE INDEX IF NOT EXISTS idx_reels_user_id ON reels(user_id);

-- Aplica o gatilho de updated_at na tabela reels
DROP TRIGGER IF EXISTS update_reels_updated_at ON reels;
CREATE TRIGGER update_reels_updated_at
BEFORE UPDATE ON reels
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
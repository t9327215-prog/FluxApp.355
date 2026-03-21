-- Cria a tabela de posts para o feed
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    parent_post_id UUID REFERENCES posts(id) ON DELETE CASCADE, -- Para comentários/respostas
    type TEXT DEFAULT 'text', -- 'text', 'poll', 'image', 'video'
    poll_options JSONB, -- { "option1": 0, "option2": 0 }
    cta_link TEXT,
    cta_text TEXT,
    is_adult_content BOOLEAN NOT NULL DEFAULT FALSE, -- Adicionado para filtro de conteúdo
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de posts
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_parent_post_id ON posts(parent_post_id);

-- Aplica o gatilho de updated_at na tabela posts
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- Cria a tabela de comentários para os itens do marketplace
CREATE TABLE IF NOT EXISTS marketplace_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de comentários do marketplace
CREATE INDEX IF NOT EXISTS idx_marketplace_comments_item_id ON marketplace_comments(item_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_comments_author_id ON marketplace_comments(author_id);

-- Aplica o gatilho de updated_at na tabela marketplace_comments
DROP TRIGGER IF EXISTS update_marketplace_comments_updated_at ON marketplace_comments;
CREATE TRIGGER update_marketplace_comments_updated_at
BEFORE UPDATE ON marketplace_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
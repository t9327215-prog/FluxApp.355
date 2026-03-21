-- Cria a tabela de grupos com os campos necessários
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    group_type TEXT NOT NULL, -- 'pago', 'privado', 'publico'
    cover_image TEXT,
    is_vip BOOLEAN DEFAULT FALSE,
    price NUMERIC(10, 2),
    currency VARCHAR(3),
    access_type TEXT, -- 'direto', 'solicitacao'
    selected_provider_id TEXT,
    expiration_date DATE,
    vip_door TEXT,
    pixel_id TEXT,
    pixel_token TEXT,
    status TEXT, -- 'ativo', 'inativo', 'arquivado'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de grupos
CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_groups_group_type ON groups(group_type);

-- Cria a tabela de membros do grupo
CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de membros de grupos
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

-- Aplica o gatilho de updated_at na tabela groups
DROP TRIGGER IF EXISTS update_groups_updated_at ON groups;
CREATE TRIGGER update_groups_updated_at
BEFORE UPDATE ON groups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
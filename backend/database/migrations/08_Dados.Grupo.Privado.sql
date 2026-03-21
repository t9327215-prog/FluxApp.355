-- Cria a tabela de grupos privados
CREATE TABLE IF NOT EXISTS private_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de grupos privados
CREATE INDEX IF NOT EXISTS idx_private_groups_created_by ON private_groups(created_by);

-- Cria a tabela de membros de grupos privados
CREATE TABLE IF NOT EXISTS private_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES private_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de membros de grupos privados
CREATE INDEX IF NOT EXISTS idx_private_group_members_group_id ON private_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_private_group_members_user_id ON private_group_members(user_id);

-- Aplica o gatilho de updated_at na tabela private_groups
DROP TRIGGER IF EXISTS update_private_groups_updated_at ON private_groups;
CREATE TRIGGER update_private_groups_updated_at
BEFORE UPDATE ON private_groups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
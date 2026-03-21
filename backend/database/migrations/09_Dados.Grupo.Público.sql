-- Cria a tabela de grupos públicos
CREATE TABLE IF NOT EXISTS public_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de grupos públicos
CREATE INDEX IF NOT EXISTS idx_public_groups_created_by ON public_groups(created_by);

-- Cria a tabela de membros de grupos públicos
CREATE TABLE IF NOT EXISTS public_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para a tabela de membros de grupos públicos
CREATE INDEX IF NOT EXISTS idx_public_group_members_group_id ON public_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_public_group_members_user_id ON public_group_members(user_id);


-- Aplica o gatilho de updated_at na tabela public_groups
DROP TRIGGER IF EXISTS update_public_groups_updated_at ON public_groups;
CREATE TRIGGER update_public_groups_updated_at
BEFORE UPDATE ON public_groups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
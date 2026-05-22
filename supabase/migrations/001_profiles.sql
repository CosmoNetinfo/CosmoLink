CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL CHECK (username ~ '^[a-z0-9_-]{3,30}$'),
  display_name  TEXT CHECK (char_length(display_name) <= 60),
  bio           TEXT CHECK (char_length(bio) <= 200),
  avatar_url    TEXT,
  theme_slug    TEXT NOT NULL DEFAULT 'cosmo-dark',
  custom_theme  JSONB,
  social_links  JSONB NOT NULL DEFAULT '{}',
  plan          TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro')),
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read"  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_owner_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

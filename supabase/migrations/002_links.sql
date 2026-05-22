CREATE TABLE links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL CHECK (char_length(title) <= 100),
  url         TEXT NOT NULL CHECK (char_length(url) <= 2000),
  icon        TEXT,
  icon_color  TEXT,
  position    INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  link_type   TEXT NOT NULL DEFAULT 'link' CHECK (link_type IN ('link','header','divider','embed')),
  embed_type  TEXT CHECK (embed_type IN ('youtube','vimeo')),
  starts_at   TIMESTAMPTZ,
  ends_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX links_user_id_position ON links(user_id, position);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "links_public_read"  ON links FOR SELECT USING (is_active = true OR auth.uid() = user_id);
CREATE POLICY "links_owner_all"    ON links FOR ALL USING (auth.uid() = user_id);

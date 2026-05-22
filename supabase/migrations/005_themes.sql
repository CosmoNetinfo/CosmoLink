CREATE TABLE themes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  is_pro      BOOLEAN NOT NULL DEFAULT FALSE,
  preview_url TEXT,
  config      JSONB NOT NULL
);

ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "themes_public_read" ON themes FOR SELECT USING (true);

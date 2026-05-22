CREATE TABLE platforms (
  id               SERIAL PRIMARY KEY,
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  brand_color      TEXT NOT NULL,
  category         TEXT NOT NULL DEFAULT 'other',
  domain_patterns  TEXT[] NOT NULL DEFAULT '{}'
);

ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "platforms_public_read" ON platforms FOR SELECT USING (true);

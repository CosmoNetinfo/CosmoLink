CREATE TABLE link_clicks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id     UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  clicked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  country     TEXT,
  device      TEXT CHECK (device IN ('mobile','desktop','tablet')),
  browser     TEXT,
  referrer    TEXT
);

CREATE INDEX link_clicks_user_id ON link_clicks(user_id);
CREATE INDEX link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX link_clicks_clicked_at ON link_clicks(clicked_at);

CREATE TABLE profile_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  country     TEXT,
  device      TEXT CHECK (device IN ('mobile','desktop','tablet')),
  browser     TEXT,
  referrer    TEXT
);

CREATE INDEX profile_views_user_id ON profile_views(user_id);
CREATE INDEX profile_views_viewed_at ON profile_views(viewed_at);

ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clicks_insert_open"   ON link_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "clicks_owner_select"  ON link_clicks FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "views_insert_open"    ON profile_views FOR INSERT WITH CHECK (true);
CREATE POLICY "views_owner_select"   ON profile_views FOR SELECT USING (auth.uid() = user_id);

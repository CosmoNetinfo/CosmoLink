-- 010_security_hardening.sql
-- Eseguire in Supabase Dashboard -> SQL Editor (progetto CosmoLink), UNA volta sola.
--
-- Cosa fa:
-- 1. Impedisce agli utenti di cambiarsi da soli plan, is_verified e i campi Stripe
--    (prima la policy "profiles_owner_update" permetteva di scrivere plan = 'pro').
-- 2. Applica nel database i limiti del piano Free (max 5 link attivi, niente embed).
-- 3. Blocca schemi pericolosi (javascript:, data:, vbscript:) negli URL dei link.
-- 4. Chiude gli INSERT aperti su link_clicks / profile_views: il tracciamento passa
--    solo dalle rotte /api/track/* (che usano la service role).
--
-- Per attivare un utente PRO a mano: dal SQL Editor (nessun JWT, quindi il trigger
-- lascia passare):  UPDATE profiles SET plan = 'pro' WHERE username = 'nomeutente';

-- ------------------------------------------------------------------
-- 1. Colonne riservate di profiles
-- ------------------------------------------------------------------
CREATE OR REPLACE FUNCTION protect_profile_privileged_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo le richieste che arrivano dall'API pubblica (anon / authenticated) sono limitate.
  -- service_role e SQL Editor / connessione diretta restano liberi.
  IF auth.role() IN ('anon', 'authenticated') THEN
    IF TG_OP = 'INSERT' THEN
      NEW.plan := 'free';
      NEW.is_verified := FALSE;
      NEW.stripe_customer_id := NULL;
      NEW.stripe_subscription_id := NULL;
    ELSE
      NEW.plan := OLD.plan;
      NEW.is_verified := OLD.is_verified;
      NEW.stripe_customer_id := OLD.stripe_customer_id;
      NEW.stripe_subscription_id := OLD.stripe_subscription_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_protect_insert ON profiles;
CREATE TRIGGER profiles_protect_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION protect_profile_privileged_columns();

DROP TRIGGER IF EXISTS profiles_protect_update ON profiles;
CREATE TRIGGER profiles_protect_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION protect_profile_privileged_columns();

-- ------------------------------------------------------------------
-- 2. Limiti piano Free sui link
--    (volutamente piu' larghi dell'interfaccia: non possono mai bloccare
--     un utente che l'interfaccia lascia fare)
-- ------------------------------------------------------------------
CREATE OR REPLACE FUNCTION enforce_free_plan_link_limits()
RETURNS TRIGGER AS $$
DECLARE
  user_plan TEXT;
  active_links INTEGER;
BEGIN
  IF COALESCE(auth.role(), '') NOT IN ('anon', 'authenticated') THEN
    RETURN NEW;
  END IF;

  -- Un link gia' attivo che resta dello stesso tipo non viene ricontrollato:
  -- cosi' chi ha gia' piu' link del limite puo' comunque modificarli o riordinarli.
  IF TG_OP = 'UPDATE' AND OLD.is_active AND OLD.link_type = NEW.link_type THEN
    RETURN NEW;
  END IF;

  SELECT plan INTO user_plan FROM profiles WHERE id = NEW.user_id;

  IF COALESCE(user_plan, 'free') <> 'pro' THEN
    IF NEW.link_type = 'embed' THEN
      RAISE EXCEPTION 'Gli embed video sono disponibili solo con il piano PRO';
    END IF;

    IF NEW.link_type = 'link' AND NEW.is_active THEN
      SELECT COUNT(*) INTO active_links
      FROM links
      WHERE user_id = NEW.user_id
        AND link_type = 'link'
        AND is_active = TRUE
        AND id IS DISTINCT FROM NEW.id;

      IF active_links >= 5 THEN
        RAISE EXCEPTION 'Il piano Free permette fino a 5 link attivi. Passa a PRO per averne di piu''.';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS links_enforce_free_limits ON links;
CREATE TRIGGER links_enforce_free_limits
  BEFORE INSERT OR UPDATE ON links
  FOR EACH ROW EXECUTE FUNCTION enforce_free_plan_link_limits();

-- ------------------------------------------------------------------
-- 3. URL pericolosi (NOT VALID = non ricontrolla le righe gia' esistenti,
--    ma vale per tutte le nuove scritture)
-- ------------------------------------------------------------------
ALTER TABLE links DROP CONSTRAINT IF EXISTS links_url_safe_scheme;
ALTER TABLE links
  ADD CONSTRAINT links_url_safe_scheme
  CHECK (url !~* '^\s*(javascript|data|vbscript|file):')
  NOT VALID;

-- ------------------------------------------------------------------
-- 4. Tracciamento: niente piu' INSERT aperti con la chiave pubblica
-- ------------------------------------------------------------------
DROP POLICY IF EXISTS "clicks_insert_open" ON link_clicks;
DROP POLICY IF EXISTS "views_insert_open" ON profile_views;

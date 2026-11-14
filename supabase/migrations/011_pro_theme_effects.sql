-- 011_pro_theme_effects.sql
-- Eseguire in Supabase Dashboard -> SQL Editor (progetto CosmoLink). Si puo' rieseguire senza problemi.
--
-- Aggiunge ai 12 temi PRO un effetto animato di sfondo (aurora, stelle, griglia neon,
-- grana da pellicola, bolle di luce). Solo i profili PRO li vedono: per i profili Free
-- il sito li ignora. Non tocca i temi gratuiti e non cambia gli slug.

UPDATE themes SET config = config || '{"effect":"stars","effect_colors":["#ec4899","#8b5cf6"]}'::jsonb WHERE slug = 'nebula';
UPDATE themes SET config = config || '{"effect":"orbs","effect_colors":["#f59e0b","#ef4444","#fbbf24"]}'::jsonb WHERE slug = 'solar';
UPDATE themes SET config = config || '{"effect":"aurora","effect_colors":["#f43f5e","#fb7185","#a855f7"]}'::jsonb WHERE slug = 'rose';
UPDATE themes SET config = config || '{"effect":"aurora","effect_colors":["#06b6d4","#3b82f6","#22d3ee"]}'::jsonb WHERE slug = 'ocean';
UPDATE themes SET config = config || '{"effect":"grid","effect_colors":["#39ff14"]}'::jsonb WHERE slug = 'neon';
UPDATE themes SET config = config || '{"effect":"grain","effect_colors":[]}'::jsonb WHERE slug = 'mono';
UPDATE themes SET config = config || '{"effect":"orbs","effect_colors":["#f9a8d4","#fda4af","#fbcfe8"]}'::jsonb WHERE slug = 'sakura';
UPDATE themes SET config = config || '{"effect":"stars","effect_colors":["#6366f1","#10b981"]}'::jsonb WHERE slug = 'galaxy';
UPDATE themes SET config = config || '{"effect":"orbs","effect_colors":["#be123c","#9d174d","#e11d48"]}'::jsonb WHERE slug = 'vino';
UPDATE themes SET config = config || '{"effect":"grain","effect_colors":[]}'::jsonb WHERE slug = 'milano';
UPDATE themes SET config = config || '{"effect":"grid","effect_colors":["#8b5cf6","#06b6d4"]}'::jsonb WHERE slug = 'stream';
UPDATE themes SET config = config || '{"effect":"aurora","effect_colors":["#ca8a04","#65a30d","#4d7c0f"]}'::jsonb WHERE slug = 'oliva';

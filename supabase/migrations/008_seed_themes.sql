DELETE FROM themes;

INSERT INTO themes (name, slug, is_pro, config) VALUES
-- FREE (12 temi: 8 esistenti ottimizzati + 4 nuovi)
('Cosmo', 'cosmo', false, '{
  "bg_type":"gradient","bg_value":"linear-gradient(135deg,#0a051b 0%,#1c0a35 50%,#0d001a 100%)",
  "btn_bg":"#7c3aed","btn_text":"#ffffff","btn_style":"solid","btn_radius":14,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.7)",
  "ring":"#7c3aed","font_family":"Outfit"
}'),
('Arctic', 'arctic', false, '{
  "bg_type":"gradient","bg_value":"linear-gradient(135deg,#e0f2fe 0%,#bae6fd 50%,#f0f9ff 100%)",
  "btn_bg":"#0284c7","btn_text":"#ffffff","btn_style":"solid","btn_radius":12,
  "page_text":"#0f172a","page_bio":"#475569",
  "ring":"#0284c7","font_family":"Outfit"
}'),
('Sunset', 'sunset', false, '{
  "bg_type":"gradient","bg_value":"linear-gradient(135deg,#ff5e62 0%,#ff9966 100%)",
  "btn_bg":"#ffffff","btn_text":"#ff5e62","btn_style":"solid","btn_radius":50,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.85)",
  "ring":"#ffffff","font_family":"Outfit"
}'),
('Forest', 'forest', false, '{
  "bg_type":"gradient","bg_value":"linear-gradient(160deg,#041e12 0%,#092e1b 50%,#05170d 100%)",
  "btn_bg":"#10b981","btn_text":"#ffffff","btn_style":"solid","btn_radius":10,
  "page_text":"#e6f4ea","page_bio":"rgba(230,244,234,0.7)",
  "ring":"#10b981","font_family":"Outfit"
}'),
('Sand', 'sand', false, '{
  "bg_type":"solid","bg_value":"#faf6f0",
  "btn_bg":"#8c6239","btn_text":"#ffffff","btn_style":"solid","btn_radius":8,
  "page_text":"#2b2621","page_bio":"#70645c",
  "ring":"#8c6239","font_family":"Playfair Display"
}'),
('Lavender', 'lavender', false, '{
  "bg_type":"gradient","bg_value":"linear-gradient(135deg,#faf5ff 0%,#f3e8ff 50%,#e9d5ff 100%)",
  "btn_bg":"#8b5cf6","btn_text":"#ffffff","btn_style":"solid","btn_radius":50,
  "page_text":"#4c1d95","page_bio":"#6d28d9",
  "ring":"#8b5cf6","font_family":"DM Sans"
}'),
('Midnight', 'midnight', false, '{
  "bg_type":"solid","bg_value":"#09090b",
  "btn_bg":"transparent","btn_text":"#ffffff","btn_style":"outline","btn_radius":4,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.6)",
  "ring":"#ffffff","font_family":"Outfit"
}'),
('Cloud', 'cloud', false, '{
  "bg_type":"gradient","bg_value":"linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)",
  "btn_bg":"#0f172a","btn_text":"#ffffff","btn_style":"solid","btn_radius":12,
  "page_text":"#0f172a","page_bio":"#475569",
  "ring":"#0f172a","font_family":"DM Sans"
}'),
-- Nuovi FREE aggiunti
('Chalkboard', 'chalkboard', false, '{
  "bg_type":"solid","bg_value":"#1e293b",
  "btn_bg":"transparent","btn_text":"#ffffff","btn_style":"outline","btn_radius":8,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.75)",
  "ring":"#ffffff","font_family":"Outfit"
}'),
('Terracotta', 'terracotta', false, '{
  "bg_type":"gradient","bg_value":"linear-gradient(135deg,#fdf4f5 0%,#f5e6e8 50%,#e8c5c8 100%)",
  "btn_bg":"#9a3412","btn_text":"#ffffff","btn_style":"solid","btn_radius":16,
  "page_text":"#431407","page_bio":"#7c2d12",
  "ring":"#9a3412","font_family":"DM Sans"
}'),
('Peppermint', 'peppermint', false, '{
  "bg_type":"gradient","bg_value":"linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)",
  "btn_bg":"#166534","btn_text":"#ffffff","btn_style":"solid","btn_radius":50,
  "page_text":"#14532d","page_bio":"#166534",
  "ring":"#166534","font_family":"Nunito"
}'),
('Steel', 'steel', false, '{
  "bg_type":"solid","bg_value":"#f1f5f9",
  "btn_bg":"#334155","btn_text":"#ffffff","btn_style":"solid","btn_radius":4,
  "page_text":"#0f172a","page_bio":"#475569",
  "ring":"#334155","font_family":"Outfit"
}'),

-- PRO (12 temi: 8 esistenti ottimizzati + 4 nuovi)
('Nebula', 'nebula', true, '{
  "bg_type":"gradient","bg_value":"linear-gradient(135deg,#0d0722 0%,#1d0d40 35%,#44115b 70%,#0d0722 100%)",
  "btn_bg":"linear-gradient(135deg,#ec4899,#8b5cf6)","btn_text":"#ffffff","btn_style":"gradient","btn_radius":20,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.75)",
  "ring":"#ec4899","font_family":"Syne"
}'),
('Solar', 'solar', true, '{
  "bg_type":"gradient","bg_value":"linear-gradient(160deg,#0a0802 0%,#1b1304 50%,#2e1e07 100%)",
  "btn_bg":"#f59e0b","btn_text":"#0a0802","btn_style":"shadow","btn_radius":12,
  "page_text":"#fef3c7","page_bio":"rgba(254,243,199,0.7)",
  "ring":"#f59e0b","font_family":"Outfit"
}'),
('Rose', 'rose', true, '{
  "bg_type":"gradient","bg_value":"linear-gradient(160deg,#1c060e 0%,#2f0b18 50%,#1c060e 100%)",
  "btn_bg":"rgba(244,63,94,0.12)","btn_text":"#f43f5e","btn_style":"glass","btn_radius":16,
  "page_text":"#ffe4e6","page_bio":"rgba(255,228,230,0.7)",
  "ring":"#f43f5e","font_family":"Outfit"
}'),
('Ocean', 'ocean', true, '{
  "bg_type":"gradient","bg_value":"linear-gradient(180deg,#020813 0%,#041938 50%,#08346e 100%)",
  "btn_bg":"transparent","btn_text":"#06b6d4","btn_style":"outline","btn_radius":14,
  "page_text":"#e0f7fa","page_bio":"rgba(224,247,250,0.75)",
  "ring":"#06b6d4","font_family":"Outfit"
}'),
('Neon City', 'neon', true, '{
  "bg_type":"solid","bg_value":"#020205",
  "btn_bg":"transparent","btn_text":"#39ff14","btn_style":"outline","btn_radius":0,
  "page_text":"#39ff14","page_bio":"rgba(255,255,255,0.8)",
  "ring":"#39ff14","font_family":"Space Mono"
}'),
('Mono', 'mono', true, '{
  "bg_type":"solid","bg_value":"#ffffff",
  "btn_bg":"#000000","btn_text":"#ffffff","btn_style":"solid","btn_radius":6,
  "page_text":"#000000","page_bio":"#52525b",
  "ring":"#000000","font_family":"Outfit"
}'),
('Sakura', 'sakura', true, '{
  "bg_type":"gradient","bg_value":"linear-gradient(135deg,#fff1f2 0%,#ffe4e6 100%)",
  "btn_bg":"#db2777","btn_text":"#ffffff","btn_style":"solid","btn_radius":50,
  "page_text":"#9d174d","page_bio":"#be185d",
  "ring":"#db2777","font_family":"Nunito"
}'),
('Galaxy', 'galaxy', true, '{
  "bg_type":"gradient","bg_value":"linear-gradient(135deg,#03000a 0%,#0f0226 35%,#1f0545 70%,#03000a 100%)",
  "btn_bg":"linear-gradient(135deg,#6366f1 0%,#3b82f6 50%,#10b981 100%)","btn_text":"#ffffff","btn_style":"gradient","btn_radius":14,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.75)",
  "ring":"#ec4899","font_family":"Syne"
}'),
-- Nuovi PRO aggiunti
('Vino', 'vino', true, '{
  "bg_type":"gradient","bg_value":"linear-gradient(135deg,#1e0510 0%,#3b071e 50%,#1a020c 100%)",
  "btn_bg":"rgba(251,113,133,0.08)","btn_text":"#fbcfe8","btn_style":"glass","btn_radius":12,
  "page_text":"#fce7f3","page_bio":"rgba(252,231,243,0.7)",
  "ring":"#db2777","font_family":"Playfair Display"
}'),
('Milano', 'milano', true, '{
  "bg_type":"solid","bg_value":"#fafaf9",
  "btn_bg":"#000000","btn_text":"#ffffff","btn_style":"shadow","btn_radius":0,
  "page_text":"#1c1917","page_bio":"#57534e",
  "ring":"#000000","font_family":"Outfit"
}'),
('Cyber Stream', 'stream', true, '{
  "bg_type":"solid","bg_value":"#0b031a",
  "btn_bg":"linear-gradient(135deg,#8b5cf6 0%,#06b6d4 100%)","btn_text":"#ffffff","btn_style":"gradient","btn_radius":10,
  "page_text":"#e0f7fa","page_bio":"rgba(224,247,250,0.7)",
  "ring":"#06b6d4","font_family":"Space Mono"
}'),
('Oliva', 'oliva', true, '{
  "bg_type":"solid","bg_value":"#142210",
  "btn_bg":"#ca8a04","btn_text":"#142210","btn_style":"solid","btn_radius":30,
  "page_text":"#fef9c3","page_bio":"rgba(254,249,195,0.75)",
  "ring":"#ca8a04","font_family":"DM Sans"
}');

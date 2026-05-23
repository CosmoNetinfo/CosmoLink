DELETE FROM themes;

INSERT INTO themes (name, slug, is_pro, config) VALUES

-- FREE (8 temi)
('Cosmo', 'cosmo', false, '{
  "bg_type":"gradient","bg_value":"135deg,#0f0f18,#1a1025",
  "btn_bg":"#6c5ce7","btn_text":"#ffffff","btn_style":"filled","btn_radius":14,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.55)",
  "ring":"#6c5ce7","font_family":"Outfit"
}'),

('Arctic', 'arctic', false, '{
  "bg_type":"solid","bg_value":"#f4f7fb",
  "btn_bg":"#0ea5e9","btn_text":"#ffffff","btn_style":"filled","btn_radius":12,
  "page_text":"#0f172a","page_bio":"#64748b",
  "ring":"#0ea5e9","font_family":"Outfit"
}'),

('Sunset', 'sunset', false, '{
  "bg_type":"gradient","bg_value":"135deg,#ff6b6b,#feca57",
  "btn_bg":"#ffffff","btn_text":"#ff6b6b","btn_style":"filled","btn_radius":50,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.8)",
  "ring":"#ffffff","font_family":"Outfit"
}'),

('Forest', 'forest', false, '{
  "bg_type":"gradient","bg_value":"160deg,#0d2818,#0a1f10",
  "btn_bg":"#4ade80","btn_text":"#052e16","btn_style":"filled","btn_radius":10,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.6)",
  "ring":"#4ade80","font_family":"Outfit"
}'),

('Sand', 'sand', false, '{
  "bg_type":"solid","bg_value":"#faf9f5",
  "btn_bg":"#c2855c","btn_text":"#ffffff","btn_style":"filled","btn_radius":8,
  "page_text":"#1c1917","page_bio":"#78716c",
  "ring":"#c2855c","font_family":"Playfair Display"
}'),

('Lavender', 'lavender', false, '{
  "bg_type":"gradient","bg_value":"135deg,#e8d5f5,#c4b5fd",
  "btn_bg":"#7c3aed","btn_text":"#ffffff","btn_style":"pill","btn_radius":50,
  "page_text":"#3b0764","page_bio":"#6d28d9",
  "ring":"#7c3aed","font_family":"DM Sans"
}'),

('Midnight', 'midnight', false, '{
  "bg_type":"solid","bg_value":"#000000",
  "btn_bg":"transparent","btn_text":"#ffffff","btn_style":"outline","btn_radius":4,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.5)",
  "ring":"#ffffff","font_family":"Outfit"
}'),

('Cloud', 'cloud', false, '{
  "bg_type":"gradient","bg_value":"160deg,#ffffff,#e0f2fe",
  "btn_bg":"#0284c7","btn_text":"#ffffff","btn_style":"filled","btn_radius":12,
  "page_text":"#0c4a6e","page_bio":"#0369a1",
  "ring":"#0284c7","font_family":"DM Sans"
}'),

-- PRO (8 temi)
('Nebula', 'nebula', true, '{
  "bg_type":"gradient","bg_value":"160deg,#1a0a2e,#2d1b69,#0f2027",
  "btn_bg":"linear-gradient(135deg,#ff6eb4,#a855f7)","btn_text":"#ffffff","btn_style":"gradient","btn_radius":20,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.6)",
  "ring":"#ff6eb4","font_family":"Syne"
}'),

('Solar', 'solar', true, '{
  "bg_type":"gradient","bg_value":"160deg,#150f00,#1f1500",
  "btn_bg":"#f59e0b","btn_text":"#1a0f00","btn_style":"shadow","btn_radius":12,
  "page_text":"#fef3c7","page_bio":"rgba(254,243,199,0.6)",
  "ring":"#f59e0b","font_family":"Outfit"
}'),

('Rose', 'rose', true, '{
  "bg_type":"gradient","bg_value":"160deg,#1f0a10,#2d1220",
  "btn_bg":"rgba(251,113,133,0.15)","btn_text":"#fb7185","btn_style":"glass","btn_radius":16,
  "page_text":"#ffe4e6","page_bio":"rgba(255,228,230,0.6)",
  "ring":"#fb7185","font_family":"Outfit"
}'),

('Ocean', 'ocean', true, '{
  "bg_type":"gradient","bg_value":"180deg,#030d20,#041a38",
  "btn_bg":"transparent","btn_text":"#06b6d4","btn_style":"outline","btn_radius":14,
  "page_text":"#e0f7fa","page_bio":"rgba(224,247,250,0.6)",
  "ring":"#06b6d4","font_family":"Outfit"
}'),

('Neon City', 'neon', true, '{
  "bg_type":"solid","bg_value":"#020203",
  "btn_bg":"transparent","btn_text":"#39ff14","btn_style":"outline","btn_radius":0,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.5)",
  "ring":"#39ff14","font_family":"Space Mono"
}'),

('Mono', 'mono', true, '{
  "bg_type":"solid","bg_value":"#ffffff",
  "btn_bg":"#0a0a0a","btn_text":"#ffffff","btn_style":"filled","btn_radius":6,
  "page_text":"#0a0a0a","page_bio":"#6b7280",
  "ring":"#0a0a0a","font_family":"Outfit"
}'),

('Sakura', 'sakura', true, '{
  "bg_type":"gradient","bg_value":"135deg,#fce4ec,#f8bbd9",
  "btn_bg":"#e91e8c","btn_text":"#ffffff","btn_style":"pill","btn_radius":50,
  "page_text":"#880e4f","page_bio":"#c2185b",
  "ring":"#e91e8c","font_family":"Nunito"
}'),

('Galaxy', 'galaxy', true, '{
  "bg_type":"gradient","bg_value":"135deg,#0d0221,#190741,#0d0221",
  "btn_bg":"linear-gradient(135deg,#6c5ce7,#00cec9)","btn_text":"#ffffff","btn_style":"gradient","btn_radius":14,
  "page_text":"#ffffff","page_bio":"rgba(255,255,255,0.55)",
  "ring":"#00cec9","font_family":"Syne"
}');

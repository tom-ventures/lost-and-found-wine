-- Seed: wines
INSERT INTO wines (slug, name, collection, region, variety, vintage, description, tasting_notes, region_story, winemakers, alcohol_pct, display_order) VALUES
(
  'uncharted-pinot-gris-2021',
  'Uncharted Pinot Gris — Waiheke Island 2021',
  'uncharted',
  'Waiheke Island, Auckland',
  'Pinot Gris',
  2021,
  'A journey to the island. Rich, textural, and alive with the warmth of Waiheke — this is a wine that asks you to slow down and pay attention.',
  'Aromas of ripe pear, white peach and honeysuckle. On the palate, generous fruit weight is balanced by a lively acidity. A long, satisfying finish.',
  'Waiheke Island sits in the Hauraki Gulf, 35 minutes from Auckland by ferry. The island''s warm, dry summers and free-draining soils produce wines of exceptional concentration and character.',
  'Lost and Found Wines',
  13.5,
  10
),
(
  'uncharted-rose-2021',
  'Uncharted Rosé — Waiheke Island 2021',
  'uncharted',
  'Waiheke Island, Auckland',
  'Rosé',
  2021,
  'Not your ordinary rosé. Pale, precise and purposeful — made for explorers who know that the best discoveries come in unexpected shades.',
  'Delicate salmon pink in colour. Fresh red berry aromas with a hint of citrus peel. Dry and crisp on the palate with a clean, lingering finish.',
  'Waiheke Island''s maritime climate creates ideal conditions for delicate, aromatic styles. The gentle sea breezes moderate temperatures and preserve natural acidity.',
  'Lost and Found Wines',
  13.0,
  20
),
(
  'uncharted-syrah-2019',
  'Uncharted Syrah — Waiheke Island 2019',
  'uncharted',
  'Waiheke Island, Auckland',
  'Syrah',
  2019,
  'Rare. Limited. Found. The Uncharted Syrah is a wine for those who seek the extraordinary — deep, complex and deeply New Zealand.',
  'Dark ruby in colour with a brooding nose of blackberry, olive, cracked pepper and smoked meat. Full-bodied and structured with silky tannins and impressive length.',
  'Only the finest vintages from Waiheke''s warmest sites produce Syrah of this calibre. The 2019 season was exceptional — long, warm and perfectly ripening.',
  'Lost and Found Wines',
  14.5,
  30
),
(
  'uncharted-island-red-2019',
  'Uncharted Island Red — Waiheke Island 2019',
  'uncharted',
  'Waiheke Island, Auckland',
  'Bordeaux Blend',
  2019,
  'A blend born of the island. Generous, warm and complex — the Island Red brings together the very best of Waiheke in a single bottle.',
  'Deep ruby with purple hues. Aromas of dark cherry, plum, cedar and tobacco. Full-bodied with firm but ripe tannins and a long, complex finish.',
  'Waiheke Island''s volcanic soils and warm, dry autumns create the perfect conditions for Bordeaux varieties to achieve full ripeness.',
  'Lost and Found Wines',
  14.0,
  40
),
(
  'origin-pinot-gris-2022',
  'Origin Pinot Gris — Central Otago 2022',
  'origin',
  'Central Otago',
  'Pinot Gris',
  2022,
  'Return to the source. Central Otago''s ancient schist soils and dramatic climate produce a Pinot Gris of extraordinary precision and terroir expression.',
  'Pale golden in colour. A complex nose of ripe peach, quince and spice with a subtle mineral thread. Rich and textural on the palate with balanced acidity and a long, elegant finish.',
  'Central Otago is New Zealand''s only continental climate wine region. High altitude, hot summers and cold winters produce wines of remarkable intensity and focus.',
  'Lost and Found Wines',
  13.5,
  50
),
(
  'origin-pinot-noir-2022',
  'Origin Pinot Noir — Nelson 2022',
  'origin',
  'Nelson',
  'Pinot Noir',
  2022,
  'Where the mountains meet the sea. Nelson''s unique geography — framed by national parks and washed by Tasman sunshine — produces a Pinot Noir of real beauty and place.',
  'Bright ruby in colour. Fragrant nose of fresh cherry, raspberry and subtle earthy notes. Medium-bodied with silky tannins, vibrant acidity and a pure, long finish.',
  'Nelson is one of New Zealand''s sunniest regions, blessed with a diversity of soils and sheltered valleys. The region is known for producing elegant, terroir-expressive Pinot Noir.',
  'Lost and Found Wines',
  13.0,
  60
),
(
  'ad-astra-nv',
  'Ad Astra — Méthode Traditionnelle NV',
  'ad-astra',
  'New Zealand',
  'Méthode Traditionnelle',
  NULL,
  'To the stars. Ad Astra is our celebration wine — crafted in the traditional method, aged on lees, and released when the moment demands it. This is wine for the milestones, the achievements, the discoveries worth marking.',
  'Fine persistent bubbles with a creamy mousse. Complex aromas of brioche, lemon curd, green apple and toasted almonds. Fresh and bright on the palate with a long, satisfying finish.',
  'Sourced from New Zealand''s finest cool-climate regions, the Ad Astra is a blend designed to express the very best of what our land can offer in sparkling form.',
  'Lost and Found Wines',
  12.5,
  5
),
(
  'gift-voucher',
  'Lost and Found Gift Voucher',
  'gift',
  NULL,
  NULL,
  NULL,
  'Give the gift of discovery. A Lost and Found Gift Voucher lets someone special choose their own journey — redeemable against any wine in our collection.',
  NULL,
  NULL,
  NULL,
  NULL,
  100
);

-- Seed: products
INSERT INTO products (wine_id, name, sku, price_nzd, stock_qty, sold_out, collection)
SELECT id, name, 'UNCHPG21', 32.90, 50, false, 'uncharted' FROM wines WHERE slug = 'uncharted-pinot-gris-2021';

INSERT INTO products (wine_id, name, sku, price_nzd, stock_qty, sold_out, collection)
SELECT id, name, 'UNCHR21', 32.90, 50, false, 'uncharted' FROM wines WHERE slug = 'uncharted-rose-2021';

INSERT INTO products (wine_id, name, sku, price_nzd, stock_qty, sold_out, collection)
SELECT id, name, 'UNCHS19', 100.00, 0, true, 'uncharted' FROM wines WHERE slug = 'uncharted-syrah-2019';

INSERT INTO products (wine_id, name, sku, price_nzd, stock_qty, sold_out, collection)
SELECT id, name, 'UNCHIR19', 48.90, 0, true, 'uncharted' FROM wines WHERE slug = 'uncharted-island-red-2019';

INSERT INTO products (wine_id, name, sku, price_nzd, stock_qty, sold_out, collection)
SELECT id, name, 'ORIGPG22', 27.50, 50, false, 'origin' FROM wines WHERE slug = 'origin-pinot-gris-2022';

INSERT INTO products (wine_id, name, sku, price_nzd, stock_qty, sold_out, collection)
SELECT id, name, 'ORIGPN22', 28.00, 50, false, 'origin' FROM wines WHERE slug = 'origin-pinot-noir-2022';

INSERT INTO products (wine_id, name, sku, price_nzd, stock_qty, sold_out, collection)
SELECT id, name, 'ADAST', 48.90, 0, true, 'ad-astra' FROM wines WHERE slug = 'ad-astra-nv';

INSERT INTO products (wine_id, name, sku, price_nzd, stock_qty, sold_out, collection)
SELECT id, 'Lost and Found Gift Voucher', 'GIFT25', 25.00, 999, false, 'gift' FROM wines WHERE slug = 'gift-voucher';

-- Seed: team members
INSERT INTO team_members (name, title, bio, email, display_order) VALUES
(
  'Tom Morton',
  'Director and Co-owner',
  'I have been on the wine trail since before I could legally purchase a bottle. This has included growing, making, and finally bringing hand-crafted New Zealand wines to loyal customers. Wine is a testament to a time and place. It tells stories of its environment, the year and the people. Countless experiences with my own family and friends are punctuated and remembered by the wine which we shared, and I am wanting to create more of these experiences for our customers. Lost and Found has been created for you in the hope that you, like me, find the exploration and celebration in one of life''s great pleasures.',
  'tom@lostandfoundwine.co.nz',
  10
),
(
  'Sarah Wilson',
  'Co-owner',
  'I''m originally from Wales, an area not celebrated for its wine production. My background is in creative writing, marketing and events management. Since emigrating to New Zealand, I have had so many opportunities in the areas of art, architecture, history and music — fields that I love for the stories they tell, the emotions they evoke and the individuality of interpretation. My personal passion is creative writing and I get very wrapped up in a good story which, of course, is all about the journey. When I heard about Lost and Found and its experience-based, customer-driven philosophy — the idea that good wine is not only about taste but should also evoke geography, memory and the spirit of adventure — I knew I had to be involved. I am so excited to start our journey together... unless there are spiders or mushrooms... then I''m out.',
  'sarah@lostandfoundwine.co.nz',
  20
);

-- Seed: site content
INSERT INTO site_content (key, value) VALUES
('hero_title', 'A Journey of Discovery'),
('hero_subtitle', 'Lost and Found is on a journey of DISCOVERY. We''d love you to join us.'),
('hero_cta', 'Explore Our Wines'),
('about_text', 'Lost and Found is a New Zealand wine company built on the belief that great wine is about more than what''s in the glass. It''s about the place it came from, the story behind it, and the moment you share it.'),
('collections_intro', 'Two collections, one spirit of adventure. Origin celebrates the terroir of New Zealand''s great wine regions. Uncharted pushes into new territory on Waiheke Island.'),
('signup_title', 'Get Lost With Us'),
('signup_subtitle', 'Join our community of explorers. Be first to hear about new releases and discoveries.');

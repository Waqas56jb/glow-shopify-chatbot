-- ============================================================
--  GlowUp Goods — Dummy Seed Data
--  Run AFTER supabase_schema.sql
--  Supabase → SQL Editor → New Query → Paste → Run
-- ============================================================


-- ── 1. PRODUCTS ─────────────────────────────────────────────
INSERT INTO products (name, price, description, url, materials, sizing_note, important, category, sizes, colors, images, in_stock, featured) VALUES

('Unisex Hoodie',
 '$39.99',
 'The softest hoodie you will ever own. Classic streetwear with a pouch pocket and warm hood.',
 'https://glowupgoodsshop.com/products/unisex-hoodie',
 '65% ring-spun cotton, 35% polyester. 3-panel hood.',
 'Runs SMALL — order one size up.',
 NULL,
 ARRAY['men','women','hoodie'],
 ARRAY['S','M','L','XL','2XL','3XL'],
 ARRAY['Black','White','Navy','Grey'],
 ARRAY[]::TEXT[],
 TRUE, TRUE),

('Crop Hoodie – Good Luck',
 '$46.00',
 'Trendy cropped hoodie with raw hem and matching drawstrings. A wardrobe staple.',
 'https://glowupgoodsshop.com/products/crop-hoodie-good-luck',
 '52% airlume combed cotton, 48% poly fleece. 6.5 oz/yd².',
 NULL, NULL,
 ARRAY['women','hoodie'],
 ARRAY['S','M','L','XL','2XL'],
 ARRAY['Black','Pink','Beige'],
 ARRAY[]::TEXT[],
 TRUE, FALSE),

('Glow Up Unisex Premium Sweatshirt',
 '$34.99',
 'Classic crew-neck sweatshirt with soft fleece inside. Perfect for everyday wear.',
 'https://glowupgoodsshop.com/products/glow-up-unisex-premium-sweatshirt',
 '65% cotton, 35% polyester.',
 'Runs SMALL — order one size up.',
 NULL,
 ARRAY['men','women','hoodie'],
 ARRAY['S','M','L','XL','2XL','3XL'],
 ARRAY['Black','White','Grey'],
 ARRAY[]::TEXT[],
 TRUE, FALSE),

('Blank Black Screen T-Shirt',
 '$29.99',
 'Gildan Softstyle unisex tee. Clean minimal design, perfect for any occasion.',
 'https://glowupgoodsshop.com/products/blank-black-screen-t-shirt',
 '100% ring-spun cotton. Light fabric.',
 'Runs true to size.',
 NULL,
 ARRAY['men','women','t-shirt'],
 ARRAY['XS','S','M','L','XL','2XL','3XL'],
 ARRAY['Black','White'],
 ARRAY[]::TEXT[],
 TRUE, FALSE),

('Men''s Windbreaker',
 'From $49.99',
 'Lightweight water-resistant windbreaker. Breathable mesh lining. Perfect for outdoors.',
 'https://glowupgoodsshop.com/products/men-s-windbreaker',
 '100% polyester. Elastic cuffs, hood, side pockets, zippable front.',
 NULL, NULL,
 ARRAY['men','outerwear'],
 ARRAY['XS','S','M','L','XL','2XL','3XL'],
 ARRAY['Black','Navy','Olive'],
 ARRAY[]::TEXT[],
 TRUE, FALSE),

('One-Piece Swimsuit',
 'From $40.99',
 'Flattering one-piece for all figures. Scoop neckline, low scoop back. Chlorine-resistant.',
 'https://glowupgoodsshop.com/products/one-piece-swimsuit',
 '75% recycled polyester, 25% elastane. Four-way stretch.',
 NULL, NULL,
 ARRAY['women','swimsuit'],
 ARRAY['XS','S','M','L','XL','2XL','3XL'],
 ARRAY['Black','White','Gold','Pink'],
 ARRAY[]::TEXT[],
 TRUE, TRUE),

('Tie-Strap Midi Dress',
 'From $45.55',
 'Floaty midi dress with side slit, adjustable tie straps and built-in bra.',
 'https://glowupgoodsshop.com/collections/dress/products/tie-strap-midi-dress',
 '100% heavy polyester chiffon. V-neckline. Relaxed fit.',
 NULL, NULL,
 ARRAY['women','dress'],
 ARRAY['XS','S','M','L','XL'],
 ARRAY['Black','Beige','Red','White'],
 ARRAY[]::TEXT[],
 TRUE, FALSE),

('Snapback Hat',
 '$25.55',
 'Structured classic fit cap with flat brim. Plastic snap closure. One-size-fits-most.',
 'https://glowupgoodsshop.com/collections/cap/products/snapback-hat',
 '80% acrylic, 20% wool. 6-panel high-profile.',
 NULL, NULL,
 ARRAY['cap'],
 ARRAY['One Size'],
 ARRAY['Black','White','Navy'],
 ARRAY[]::TEXT[],
 TRUE, FALSE),

('Women''s Pajama Pants',
 'From $35.79',
 'Luxurious silky pajama pants with decorative side seam piping.',
 'https://glowupgoodsshop.com/collections/glow-up-pajamas/products/women-s-pajama-pants',
 '100% polyester. Straight relaxed fit.',
 NULL, NULL,
 ARRAY['women','pajamas'],
 ARRAY['XS','S','M','L','XL','2XL'],
 ARRAY['Black','Pink','Beige'],
 ARRAY[]::TEXT[],
 TRUE, FALSE),

('Skater Dress',
 'From $45.98',
 'Sleeveless skater dress with elegant flared skirt and intricate all-over print.',
 'https://glowupgoodsshop.com/collections/dress/products/skater-dress',
 '75% recycled polyester, 25% elastane. Mid-thigh flared skirt.',
 NULL, NULL,
 ARRAY['women','dress'],
 ARRAY['XS','S','M','L','XL'],
 ARRAY['Black','White','Blue'],
 ARRAY[]::TEXT[],
 TRUE, FALSE);


-- ── 2. CONVERSATIONS ────────────────────────────────────────
INSERT INTO conversations (session_id, customer_name, customer_email, status, lead_captured, message_count, last_message) VALUES

('sess-001', 'Sarah Johnson',  'sarah.j@email.com',   'active',  TRUE,  8,  'Can I get the hoodie in XL?'),
('sess-002', 'Marcus Lee',     'marcus.lee@email.com', 'closed',  TRUE,  6,  'What is the return policy?'),
('sess-003', 'Priya Sharma',   'priya.s@email.com',   'active',  FALSE, 4,  'Do you have free shipping on swimwear?'),
('sess-004', 'James Carter',   'james.c@email.com',   'closed',  TRUE,  10, 'Track my order GU-4821'),
('sess-005', 'Aisha Patel',    'aisha.p@email.com',   'active',  FALSE, 3,  'Show me something for summer'),
('sess-006', 'Noah Williams',  'noah.w@email.com',    'closed',  TRUE,  7,  'I want the black t-shirt'),
('sess-007', 'Lily Chen',      'lily.c@email.com',    'active',  TRUE,  5,  'Is the sweatshirt available in white?'),
('sess-008', 'Ethan Brown',    'ethan.b@email.com',   'closed',  TRUE,  12, 'What sizes does the windbreaker come in?');


-- ── 3. MESSAGES ─────────────────────────────────────────────
-- Messages for sess-001 (Sarah Johnson)
INSERT INTO messages (conversation_id, session_id, role, content) VALUES
((SELECT id FROM conversations WHERE session_id = 'sess-001'),
 'sess-001', 'assistant',
 'Hey! Welcome to GlowUp Goods 👋 I am Glow, your personal stylist. What are we shopping for today?'),

((SELECT id FROM conversations WHERE session_id = 'sess-001'),
 'sess-001', 'user',
 'Hi! I am looking for a hoodie'),

((SELECT id FROM conversations WHERE session_id = 'sess-001'),
 'sess-001', 'assistant',
 'Love it! Our **Unisex Hoodie** at $39.99 is an absolute fan favourite — super soft, great for any vibe 🔥 Quick heads up: it runs small, so I always recommend sizing up. What size do you normally wear?'),

((SELECT id FROM conversations WHERE session_id = 'sess-001'),
 'sess-001', 'user',
 'Usually a L, so I should get XL then?'),

((SELECT id FROM conversations WHERE session_id = 'sess-001'),
 'sess-001', 'assistant',
 'Exactly right! XL will fit you perfectly 💪 By the way — GlowUp members get **10% off** their first order 🎁 Want me to grab that for you? Just drop your name and email!'),

((SELECT id FROM conversations WHERE session_id = 'sess-001'),
 'sess-001', 'user',
 'Yes! I am Sarah, sarah.j@email.com'),

((SELECT id FROM conversations WHERE session_id = 'sess-001'),
 'sess-001', 'assistant',
 'Done, Sarah! 🎉 Use code **GLOWUP10** at checkout for 10% off. Here is your hoodie link: https://glowupgoodsshop.com/products/unisex-hoodie — takes under 60 seconds to order! 🚀'),

((SELECT id FROM conversations WHERE session_id = 'sess-001'),
 'sess-001', 'user',
 'Can I get it in XL?');

-- Messages for sess-002 (Marcus Lee)
INSERT INTO messages (conversation_id, session_id, role, content) VALUES
((SELECT id FROM conversations WHERE session_id = 'sess-002'),
 'sess-002', 'assistant',
 'Hey! Welcome to GlowUp Goods. What can I help you find today?'),

((SELECT id FROM conversations WHERE session_id = 'sess-002'),
 'sess-002', 'user',
 'What is the return policy?'),

((SELECT id FROM conversations WHERE session_id = 'sess-002'),
 'sess-002', 'assistant',
 'Great question! We accept refunds for **wrong items** or **damaged/defective products** within **30 days** of purchase. Just email us at ana1987milosevic@gmail.com and we sort it out fast ✅ Anything else I can help with?'),

((SELECT id FROM conversations WHERE session_id = 'sess-002'),
 'sess-002', 'user',
 'Thanks! Also do you ship internationally?'),

((SELECT id FROM conversations WHERE session_id = 'sess-002'),
 'sess-002', 'assistant',
 'Yes! We ship worldwide 🌍 International orders over **$100 get free shipping**. Delivery takes 4–15 business days depending on your location. Anything you are interested in checking out?');


-- ── 4. LEADS ────────────────────────────────────────────────
INSERT INTO leads (conversation_id, name, email, phone, product_interest, discount_sent, status, source) VALUES

((SELECT id FROM conversations WHERE session_id = 'sess-001'),
 'Sarah Johnson',  'sarah.j@email.com',   '+1-555-0101', 'Unisex Hoodie',    TRUE,  'contacted', 'chatbot'),

((SELECT id FROM conversations WHERE session_id = 'sess-002'),
 'Marcus Lee',     'marcus.lee@email.com', '+1-555-0102', 'Return Policy',    FALSE, 'new',       'chatbot'),

((SELECT id FROM conversations WHERE session_id = 'sess-004'),
 'James Carter',   'james.c@email.com',   '+1-555-0104', 'Men''s Windbreaker',TRUE,  'converted', 'chatbot'),

((SELECT id FROM conversations WHERE session_id = 'sess-006'),
 'Noah Williams',  'noah.w@email.com',    '+1-555-0106', 'Blank Black T-Shirt',TRUE, 'contacted', 'chatbot'),

((SELECT id FROM conversations WHERE session_id = 'sess-007'),
 'Lily Chen',      'lily.c@email.com',    '+1-555-0107', 'Glow Up Sweatshirt',FALSE, 'new',      'chatbot'),

((SELECT id FROM conversations WHERE session_id = 'sess-008'),
 'Ethan Brown',    'ethan.b@email.com',   '+1-555-0108', 'Men''s Windbreaker',TRUE,  'converted', 'chatbot'),

(NULL,
 'Mia Davis',      'mia.d@email.com',     '+1-555-0109', 'Skater Dress',      FALSE, 'new',      'chatbot'),

(NULL,
 'Liam Garcia',    'liam.g@email.com',    '+1-555-0110', 'Snapback Hat',      TRUE,  'new',      'chatbot');


-- ── 5. ORDER INQUIRIES ──────────────────────────────────────
INSERT INTO order_inquiries (conversation_id, session_id, order_number, customer_email, inquiry_status, shopify_response) VALUES

((SELECT id FROM conversations WHERE session_id = 'sess-001'),
 'sess-001', NULL, 'sarah.j@email.com', 'pending',
 '{"product":"Unisex Hoodie","size":"XL","name":"Sarah Johnson","phone":"+1-555-0101","address":"123 Main St, New York, NY 10001, USA"}'::JSONB),

((SELECT id FROM conversations WHERE session_id = 'sess-004'),
 'sess-004', 'GU-4821', 'james.c@email.com', 'processed',
 '{"product":"Men''s Windbreaker","size":"L","name":"James Carter","phone":"+1-555-0104","address":"456 Oak Ave, Los Angeles, CA 90001, USA"}'::JSONB),

((SELECT id FROM conversations WHERE session_id = 'sess-006'),
 'sess-006', NULL, 'noah.w@email.com', 'pending',
 '{"product":"Blank Black T-Shirt","size":"M","name":"Noah Williams","phone":"+1-555-0106","address":"789 Pine St, Chicago, IL 60601, USA"}'::JSONB),

((SELECT id FROM conversations WHERE session_id = 'sess-008'),
 'sess-008', 'GU-4819', 'ethan.b@email.com', 'processed',
 '{"product":"Men''s Windbreaker","size":"XL","name":"Ethan Brown","phone":"+1-555-0108","address":"321 Elm Rd, Houston, TX 77001, USA"}'::JSONB),

(NULL,
 NULL, NULL, 'mia.d@email.com', 'cancelled',
 '{"product":"Skater Dress","size":"S","name":"Mia Davis","phone":"+1-555-0109","address":"654 Birch Blvd, Phoenix, AZ 85001, USA"}'::JSONB);


-- ── Verify all inserts ───────────────────────────────────────
SELECT 'products'      AS table_name, COUNT(*) AS records FROM products
UNION ALL
SELECT 'conversations',               COUNT(*)             FROM conversations
UNION ALL
SELECT 'messages',                    COUNT(*)             FROM messages
UNION ALL
SELECT 'leads',                       COUNT(*)             FROM leads
UNION ALL
SELECT 'order_inquiries',             COUNT(*)             FROM order_inquiries;

-- ============================================================
--  Expected result:
--  products       | 10
--  conversations  |  8
--  messages       | 13
--  leads          |  8
--  order_inquiries|  5
-- ============================================================

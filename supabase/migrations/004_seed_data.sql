-- ============================================
-- Seed Data for Development
-- ============================================

-- Categories
insert into categories (id, name, slug) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sapphires', 'sapphires'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Rubies', 'rubies'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Emeralds', 'emeralds'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Diamonds', 'diamonds'),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Aquamarines', 'aquamarines'),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'Topaz', 'topaz'),
  ('a7b8c9d0-e1f2-3456-abcd-567890123456', 'Opals', 'opals'),
  ('b8c9d0e1-f2a3-4567-bcde-678901234567', 'Amethyst', 'amethyst');

-- Products
insert into products (id, sku, title, description, category_id, images, metadata) values
  (
    '11111111-1111-1111-1111-111111111111',
    'SAP-001',
    'Kashmir Blue Sapphire',
    'A magnificent 5.23 carat Kashmir sapphire with velvety blue color and exceptional clarity. This museum-quality specimen exhibits the rare cornflower blue hue that Kashmir sapphires are celebrated for.',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    ARRAY['/placeholder-sapphire-1.jpg', '/placeholder-sapphire-2.jpg'],
    '{"carat": 5.23, "cut": "Oval", "clarity": "VS1", "origin": "Kashmir", "certification": "GIA"}'::jsonb
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'RBY-001',
    'Burmese Pigeon Blood Ruby',
    'An extraordinary 3.78 carat Burmese ruby displaying the coveted pigeon blood red color. Fluorescent under UV light, this stone represents the pinnacle of ruby quality.',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    ARRAY['/placeholder-ruby-1.jpg', '/placeholder-ruby-2.jpg'],
    '{"carat": 3.78, "cut": "Cushion", "clarity": "Eye Clean", "origin": "Mogok, Burma", "certification": "Gübelin"}'::jsonb
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'EMD-001',
    'Colombian Muzo Emerald',
    'A stunning 4.56 carat emerald from the legendary Muzo mine. Rich green color with excellent transparency and the characteristic Colombian verdant hue.',
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    ARRAY['/placeholder-emerald-1.jpg', '/placeholder-emerald-2.jpg'],
    '{"carat": 4.56, "cut": "Emerald Cut", "clarity": "VS2", "origin": "Muzo, Colombia", "certification": "SSEF"}'::jsonb
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'DIA-001',
    'Golconda Diamond',
    'A rare 2.15 carat Golconda diamond with D color and Type IIa purity. Historical provenance from the ancient mines of Golconda, India.',
    'd4e5f6a7-b8c9-0123-defa-234567890123',
    ARRAY['/placeholder-diamond-1.jpg', '/placeholder-diamond-2.jpg'],
    '{"carat": 2.15, "cut": "Round Brilliant", "clarity": "IF", "color": "D", "origin": "Golconda", "certification": "GIA"}'::jsonb
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'AQU-001',
    'Santa Maria Aquamarine',
    'A pristine 8.92 carat aquamarine with the deep saturated blue known as Santa Maria. Exceptional transparency and size.',
    'e5f6a7b8-c9d0-1234-efab-345678901234',
    ARRAY['/placeholder-aquamarine-1.jpg'],
    '{"carat": 8.92, "cut": "Pear", "clarity": "Loupe Clean", "origin": "Brazil", "certification": "GIA"}'::jsonb
  );

-- Auctions
insert into auctions (id, product_id, start_time, end_time, starting_price, reserve_price, min_increment, status, buy_now_price) values
  (
    'aaaa1111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    now() - interval '2 hours',
    now() + interval '5 hours',
    15000.00,
    25000.00,
    500.00,
    'live',
    45000.00
  ),
  (
    'aaaa2222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    now() - interval '1 hour',
    now() + interval '8 hours',
    20000.00,
    35000.00,
    500.00,
    'live',
    55000.00
  ),
  (
    'aaaa3333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    now() + interval '1 day',
    now() + interval '3 days',
    10000.00,
    18000.00,
    250.00,
    'scheduled',
    30000.00
  ),
  (
    'aaaa4444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    now() - interval '3 hours',
    now() + interval '30 minutes',
    25000.00,
    40000.00,
    1000.00,
    'live',
    75000.00
  ),
  (
    'aaaa5555-5555-5555-5555-555555555555',
    '55555555-5555-5555-5555-555555555555',
    now() + interval '2 days',
    now() + interval '5 days',
    5000.00,
    8000.00,
    250.00,
    'scheduled',
    15000.00
  );

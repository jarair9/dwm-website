-- ============================================
-- Fix: Set correct types on existing categories
-- ============================================

-- Gemstone categories
UPDATE categories SET type = 'gemstone' WHERE slug IN (
  'sapphires', 'rubies', 'emeralds', 'diamonds',
  'aquamarines', 'topaz', 'opals', 'amethyst'
);

-- If any categories have no type, default them to 'gemstone'
-- (user can change via admin panel)
UPDATE categories SET type = 'gemstone' WHERE type IS NULL OR type = '';

-- Ensure the type column has a proper default
ALTER TABLE categories ALTER COLUMN type SET DEFAULT 'gemstone';

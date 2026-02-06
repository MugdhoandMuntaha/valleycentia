-- Add more dummy products to the database with enhanced fields

-- First, let's add more categories if needed
INSERT INTO categories (name, slug, description, image_url) VALUES
('Bracelets', 'bracelets', 'Elegant bracelets for every occasion', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'),
('Watches', 'watches', 'Luxury timepieces', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800')
ON CONFLICT (slug) DO NOTHING;

-- Add 20 dummy products with realistic jewelry data including ratings, reviews, and discounts
INSERT INTO products (name, description, price, original_price, discount_percentage, image_url, category_id, stock, featured, rating, review_count, selling_fast, promo_code, promo_price) VALUES
-- Necklaces
('Diamond Pendant Necklace', 'Stunning 18K white gold pendant with 0.5ct diamond', 1104.99, 1299.99, 15, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', 
  (SELECT id FROM categories WHERE slug = 'necklaces'), 15, true, 4.7, 89, true, 'DIAMOND20', 1039.99),
('Pearl Strand Necklace', 'Classic freshwater pearl necklace with sterling silver clasp', 297.49, 349.99, 15, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', 
  (SELECT id FROM categories WHERE slug = 'necklaces'), 25, true, 4.8, 156, true, 'PEARL15', 279.99),
('Gold Chain Necklace', 'Delicate 14K yellow gold chain necklace', 599.99, NULL, 0, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', 
  (SELECT id FROM categories WHERE slug = 'necklaces'), 30, false, 4.5, 67, false, NULL, NULL),
('Emerald Drop Necklace', 'Elegant emerald and diamond drop necklace in white gold', 2124.99, 2499.99, 15, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 
  (SELECT id FROM categories WHERE slug = 'necklaces'), 8, true, 4.9, 234, true, 'LUXURY25', 1999.99),

-- Rings
('Solitaire Diamond Ring', 'Classic 1ct diamond solitaire in platinum setting', 3399.99, 3999.99, 15, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', 
  (SELECT id FROM categories WHERE slug = 'rings'), 12, true, 4.9, 312, true, 'RING30', 3199.99),
('Sapphire Halo Ring', 'Blue sapphire surrounded by diamond halo', 1614.99, 1899.99, 15, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800', 
  (SELECT id FROM categories WHERE slug = 'rings'), 18, true, 4.7, 178, true, 'SAPPHIRE20', 1519.99),
('Rose Gold Band', 'Simple yet elegant 14K rose gold wedding band', 449.99, NULL, 0, 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800', 
  (SELECT id FROM categories WHERE slug = 'rings'), 40, false, 4.6, 92, false, NULL, NULL),
('Ruby Cocktail Ring', 'Bold ruby statement ring with diamond accents', 2199.99, NULL, 0, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', 
  (SELECT id FROM categories WHERE slug = 'rings'), 10, false, 4.8, 145, false, NULL, NULL),
('Stackable Ring Set', 'Set of 3 delicate stackable rings in mixed metals', 254.99, 299.99, 15, 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800', 
  (SELECT id FROM categories WHERE slug = 'rings'), 35, true, 4.5, 203, false, 'STACK10', 239.99),

-- Earrings
('Diamond Stud Earrings', 'Timeless 0.75ct total weight diamond studs', 1359.99, 1599.99, 15, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 
  (SELECT id FROM categories WHERE slug = 'earrings'), 22, true, 4.8, 267, true, 'STUD25', 1279.99),
('Pearl Drop Earrings', 'Elegant freshwater pearl drop earrings', 249.99, NULL, 0, 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800', 
  (SELECT id FROM categories WHERE slug = 'earrings'), 28, false, 4.4, 87, false, NULL, NULL),
('Gold Hoop Earrings', 'Classic 14K gold hoop earrings - medium size', 339.99, 399.99, 15, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 
  (SELECT id FROM categories WHERE slug = 'earrings'), 45, true, 4.6, 198, false, 'HOOP15', 319.99),
('Emerald Dangle Earrings', 'Stunning emerald and diamond dangle earrings', 1799.99, NULL, 0, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', 
  (SELECT id FROM categories WHERE slug = 'earrings'), 14, false, 4.7, 123, false, NULL, NULL),

-- Bracelets
('Tennis Bracelet', 'Classic diamond tennis bracelet in white gold', 2464.99, 2899.99, 15, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', 
  (SELECT id FROM categories WHERE slug = 'bracelets'), 16, true, 4.9, 289, true, 'TENNIS30', 2319.99),
('Gold Bangle Set', 'Set of 3 14K gold bangles', 799.99, NULL, 0, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', 
  (SELECT id FROM categories WHERE slug = 'bracelets'), 20, false, 4.5, 112, false, NULL, NULL),
('Charm Bracelet', 'Sterling silver charm bracelet with 5 charms', 297.49, 349.99, 15, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', 
  (SELECT id FROM categories WHERE slug = 'bracelets'), 32, true, 4.6, 176, false, 'CHARM20', 279.99),
('Leather Wrap Bracelet', 'Bohemian leather wrap bracelet with crystals', 89.99, NULL, 0, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', 
  (SELECT id FROM categories WHERE slug = 'bracelets'), 50, false, 4.3, 54, false, NULL, NULL),

-- Watches
('Diamond Watch', 'Luxury diamond-encrusted watch with mother of pearl dial', 4249.99, 4999.99, 15, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800', 
  (SELECT id FROM categories WHERE slug = 'watches'), 8, true, 4.8, 167, true, 'WATCH40', 3999.99),
('Classic Gold Watch', 'Elegant gold-tone watch with leather strap', 764.99, 899.99, 15, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800', 
  (SELECT id FROM categories WHERE slug = 'watches'), 15, true, 4.7, 134, true, 'GOLD20', 719.99),
('Rose Gold Minimalist Watch', 'Modern minimalist design in rose gold', 299.99, NULL, 0, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800', 
  (SELECT id FROM categories WHERE slug = 'watches'), 25, false, 4.6, 98, false, NULL, NULL);

-- Update some existing products to be featured
UPDATE products SET featured = true WHERE name IN ('Gold Necklace', 'Silver Ring');

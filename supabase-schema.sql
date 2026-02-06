-- Create tables for Sparkle Afterglow E-commerce

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  discount_percentage INTEGER DEFAULT 0,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  selling_fast BOOLEAN DEFAULT false,
  promo_code TEXT,
  promo_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Cart items table
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_postal_code TEXT NOT NULL,
  shipping_country TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Categories: Public read access
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Products: Public read access
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Cart items: Users can only access their own cart
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Orders: Users can only access their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items: Users can view items from their own orders
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Jewelry', 'jewelry', 'Elegant and timeless jewelry pieces', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'),
  ('Accessories', 'accessories', 'Stylish accessories to complete your look', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800'),
  ('Home Decor', 'home-decor', 'Beautiful items to sparkle up your home', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'),
  ('Gifts', 'gifts', 'Perfect gifts for your loved ones', 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800');

-- Insert sample products
INSERT INTO products (name, description, price, original_price, discount_percentage, image_url, category_id, stock, featured, rating, review_count, selling_fast, promo_code, promo_price) VALUES
  ('Diamond Sparkle Necklace', 'Elegant diamond necklace with a stunning sparkle', 254.99, 299.99, 15, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', (SELECT id FROM categories WHERE slug = 'jewelry'), 15, true, 4.6, 110, true, 'FLAT35', 219.99),
  ('Rose Gold Bracelet', 'Delicate rose gold bracelet with intricate design', 127.49, 149.99, 15, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', (SELECT id FROM categories WHERE slug = 'jewelry'), 20, true, 4.8, 245, true, 'SAVE20', 119.99),
  ('Crystal Earrings', 'Beautiful crystal drop earrings', 89.99, NULL, 0, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', (SELECT id FROM categories WHERE slug = 'jewelry'), 30, false, 4.3, 78, false, NULL, NULL),
  ('Leather Handbag', 'Premium leather handbag with gold accents', 169.99, 199.99, 15, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', (SELECT id FROM categories WHERE slug = 'accessories'), 12, true, 4.7, 156, true, 'BAG15', 154.99),
  ('Silk Scarf', 'Luxurious silk scarf with floral pattern', 79.99, NULL, 0, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800', (SELECT id FROM categories WHERE slug = 'accessories'), 25, false, 4.4, 92, false, NULL, NULL),
  ('Crystal Candle Holder', 'Elegant crystal candle holder set', 129.99, NULL, 0, 'https://images.unsplash.com/photo-1602874801006-e0c1c9e9c2c9?w=800', (SELECT id FROM categories WHERE slug = 'home-decor'), 18, false, 4.5, 134, false, NULL, NULL),
  ('Gift Box Set', 'Luxury gift box with assorted items', 212.49, 249.99, 15, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800', (SELECT id FROM categories WHERE slug = 'gifts'), 10, true, 4.9, 203, true, 'GIFT25', 187.49);


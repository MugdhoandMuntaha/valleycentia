-- Migration: Add Product Sections Feature
-- This migration adds tables to support custom product sections in the admin panel

-- Product sections table (e.g., "Featured Products", "Summer Sale", etc.)
CREATE TABLE IF NOT EXISTS product_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Junction table for products in sections (many-to-many relationship)
CREATE TABLE IF NOT EXISTS product_section_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES product_sections(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(section_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE product_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_section_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Product sections are viewable by everyone" ON product_sections;
DROP POLICY IF EXISTS "Authenticated users can manage product sections" ON product_sections;
DROP POLICY IF EXISTS "Product section items are viewable by everyone" ON product_section_items;
DROP POLICY IF EXISTS "Authenticated users can manage section items" ON product_section_items;

-- RLS Policies: Public read access for active sections
CREATE POLICY "Product sections are viewable by everyone" ON product_sections
  FOR SELECT USING (is_active = true);

-- Admin users can manage sections (for now, allow all authenticated users)
CREATE POLICY "Authenticated users can manage product sections" ON product_sections
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Section items follow section visibility
CREATE POLICY "Product section items are viewable by everyone" ON product_section_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM product_sections
      WHERE product_sections.id = product_section_items.section_id
      AND product_sections.is_active = true
    )
  );

CREATE POLICY "Authenticated users can manage section items" ON product_section_items
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance (drop if exists first)
DROP INDEX IF EXISTS idx_product_sections_active;
DROP INDEX IF EXISTS idx_product_sections_display_order;
DROP INDEX IF EXISTS idx_product_section_items_section;
DROP INDEX IF EXISTS idx_product_section_items_product;
DROP INDEX IF EXISTS idx_product_section_items_display_order;

CREATE INDEX idx_product_sections_active ON product_sections(is_active);
CREATE INDEX idx_product_sections_display_order ON product_sections(display_order);
CREATE INDEX idx_product_section_items_section ON product_section_items(section_id);
CREATE INDEX idx_product_section_items_product ON product_section_items(product_id);
CREATE INDEX idx_product_section_items_display_order ON product_section_items(section_id, display_order);

-- Trigger to automatically update updated_at (only if function exists)
DROP TRIGGER IF EXISTS update_product_sections_updated_at ON product_sections;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE TRIGGER update_product_sections_updated_at BEFORE UPDATE ON product_sections
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert default "Featured Products" section (if not exists)
INSERT INTO product_sections (name, description, slug, display_order, is_active) 
VALUES ('Featured Products', 'Handpicked selections that sparkle with elegance and style', 'featured-products', 1, true)
ON CONFLICT (slug) DO NOTHING;

-- Migrate existing featured products to the new section (if products exist)
DO $$
DECLARE
  section_id_var UUID;
  featured_count INTEGER;
BEGIN
  -- Get the featured products section ID
  SELECT id INTO section_id_var FROM product_sections WHERE slug = 'featured-products';
  
  -- Check if there are any featured products
  SELECT COUNT(*) INTO featured_count FROM products WHERE featured = true;
  
  -- Only migrate if we have featured products
  IF featured_count > 0 AND section_id_var IS NOT NULL THEN
    INSERT INTO product_section_items (section_id, product_id, display_order)
    SELECT 
      section_id_var,
      id,
      ROW_NUMBER() OVER (ORDER BY created_at) - 1
    FROM products
    WHERE featured = true
    ON CONFLICT (section_id, product_id) DO NOTHING;
  END IF;
END $$;

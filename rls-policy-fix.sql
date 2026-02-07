-- Fix RLS Policies for Product Sections
-- Run this in Supabase SQL Editor to allow admin operations

-- Drop restrictive policies
DROP POLICY IF EXISTS "Authenticated users can manage product sections" ON product_sections;
DROP POLICY IF EXISTS "Authenticated users can manage section items" ON product_section_items;

-- Allow all authenticated users to INSERT, UPDATE, DELETE on product_sections
CREATE POLICY "Allow authenticated users full access to product sections" ON product_sections
  FOR ALL 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow all authenticated users to INSERT, UPDATE, DELETE on product_section_items
CREATE POLICY "Allow authenticated users full access to section items" ON product_section_items
  FOR ALL 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

If you want to allow unauthenticated operations during development, use these instead:
(Comment out the above policies and uncomment these)

CREATE POLICY "Allow all operations on product sections" ON product_sections
  FOR ALL 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on section items" ON product_section_items
  FOR ALL 
  USING (true)
  WITH CHECK (true);

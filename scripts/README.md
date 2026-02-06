# Seeding Products

This directory contains scripts to populate your Supabase database with dummy products for testing.

## Quick Start

### Option 1: Run the Node.js Script (Recommended)

```bash
node scripts/seed.js
```

This will:
- Add 2 new categories (Bracelets, Watches)
- Add 20 realistic jewelry products
- Show progress with ✅ and ❌ indicators

### Option 2: Run SQL Directly in Supabase

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `seed-products.sql`
4. Run the SQL script

## What Gets Added

### Categories (2 new)
- **Bracelets**: Elegant bracelets for every occasion
- **Watches**: Luxury timepieces

### Products (20 total)

#### Necklaces (4)
- Diamond Pendant Necklace - $1,299.99
- Pearl Strand Necklace - $349.99
- Gold Chain Necklace - $599.99
- Emerald Drop Necklace - $2,499.99

#### Rings (5)
- Solitaire Diamond Ring - $3,999.99
- Sapphire Halo Ring - $1,899.99
- Rose Gold Band - $449.99
- Ruby Cocktail Ring - $2,199.99
- Stackable Ring Set - $299.99

#### Earrings (4)
- Diamond Stud Earrings - $1,599.99
- Pearl Drop Earrings - $249.99
- Gold Hoop Earrings - $399.99
- Emerald Dangle Earrings - $1,799.99

#### Bracelets (4)
- Tennis Bracelet - $2,899.99
- Gold Bangle Set - $799.99
- Charm Bracelet - $349.99
- Leather Wrap Bracelet - $89.99

#### Watches (3)
- Diamond Watch - $4,999.99
- Classic Gold Watch - $899.99
- Rose Gold Minimalist Watch - $299.99

## Prerequisites

Make sure you have:
1. Created a Supabase project
2. Run the main database schema (`supabase-schema.sql`)
3. Added your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Troubleshooting

### "Missing Supabase credentials"
Make sure your `.env.local` file has the correct Supabase URL and anon key.

### "Error adding product"
The product might already exist. The script will show which products failed and which succeeded.

### Products not showing on website
1. Refresh the page (Ctrl+R or Cmd+R)
2. Check that the dev server is running (`npm run dev`)
3. Verify products were added in Supabase dashboard

## Notes

- All products have realistic prices, descriptions, and stock quantities
- 12 products are marked as "featured" and will appear on the homepage
- Product images use Unsplash URLs (free stock photos)
- You can run the script multiple times - it will skip existing categories

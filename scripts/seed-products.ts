import { createClient } from '@/lib/supabase/server';

async function seedProducts() {
    const supabase = await createClient();

    // Add additional categories
    const categories = [
        {
            name: 'Bracelets',
            slug: 'bracelets',
            description: 'Elegant bracelets for every occasion',
            image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'
        },
        {
            name: 'Watches',
            slug: 'watches',
            description: 'Luxury timepieces',
            image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'
        }
    ];

    for (const category of categories) {
        const { error } = await supabase
            .from('categories')
            .upsert(category, { onConflict: 'slug' });

        if (error) console.error('Error adding category:', error);
    }

    // Get category IDs
    const { data: categoriesData } = await supabase.from('categories').select('id, slug');
    const categoryMap = Object.fromEntries(categoriesData?.map(c => [c.slug, c.id]) || []);

    // Add 20 dummy products
    const products = [
        // Necklaces
        {
            name: 'Diamond Pendant Necklace',
            description: 'Stunning 18K white gold pendant with 0.5ct diamond',
            price: 1299.99,
            image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
            category_id: categoryMap['necklaces'],
            stock: 15,
            featured: true
        },
        {
            name: 'Pearl Strand Necklace',
            description: 'Classic freshwater pearl necklace with sterling silver clasp',
            price: 349.99,
            image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
            category_id: categoryMap['necklaces'],
            stock: 25,
            featured: true
        },
        {
            name: 'Gold Chain Necklace',
            description: 'Delicate 14K yellow gold chain necklace',
            price: 599.99,
            image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
            category_id: categoryMap['necklaces'],
            stock: 30,
            featured: false
        },
        {
            name: 'Emerald Drop Necklace',
            description: 'Elegant emerald and diamond drop necklace in white gold',
            price: 2499.99,
            image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
            category_id: categoryMap['necklaces'],
            stock: 8,
            featured: true
        },
        // Rings
        {
            name: 'Solitaire Diamond Ring',
            description: 'Classic 1ct diamond solitaire in platinum setting',
            price: 3999.99,
            image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
            category_id: categoryMap['rings'],
            stock: 12,
            featured: true
        },
        {
            name: 'Sapphire Halo Ring',
            description: 'Blue sapphire surrounded by diamond halo',
            price: 1899.99,
            image_url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800',
            category_id: categoryMap['rings'],
            stock: 18,
            featured: true
        },
        {
            name: 'Rose Gold Band',
            description: 'Simple yet elegant 14K rose gold wedding band',
            price: 449.99,
            image_url: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800',
            category_id: categoryMap['rings'],
            stock: 40,
            featured: false
        },
        {
            name: 'Ruby Cocktail Ring',
            description: 'Bold ruby statement ring with diamond accents',
            price: 2199.99,
            image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
            category_id: categoryMap['rings'],
            stock: 10,
            featured: false
        },
        {
            name: 'Stackable Ring Set',
            description: 'Set of 3 delicate stackable rings in mixed metals',
            price: 299.99,
            image_url: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800',
            category_id: categoryMap['rings'],
            stock: 35,
            featured: true
        },
        // Earrings
        {
            name: 'Diamond Stud Earrings',
            description: 'Timeless 0.75ct total weight diamond studs',
            price: 1599.99,
            image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
            category_id: categoryMap['earrings'],
            stock: 22,
            featured: true
        },
        {
            name: 'Pearl Drop Earrings',
            description: 'Elegant freshwater pearl drop earrings',
            price: 249.99,
            image_url: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800',
            category_id: categoryMap['earrings'],
            stock: 28,
            featured: false
        },
        {
            name: 'Gold Hoop Earrings',
            description: 'Classic 14K gold hoop earrings - medium size',
            price: 399.99,
            image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
            category_id: categoryMap['earrings'],
            stock: 45,
            featured: true
        },
        {
            name: 'Emerald Dangle Earrings',
            description: 'Stunning emerald and diamond dangle earrings',
            price: 1799.99,
            image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
            category_id: categoryMap['earrings'],
            stock: 14,
            featured: false
        },
        // Bracelets
        {
            name: 'Tennis Bracelet',
            description: 'Classic diamond tennis bracelet in white gold',
            price: 2899.99,
            image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
            category_id: categoryMap['bracelets'],
            stock: 16,
            featured: true
        },
        {
            name: 'Gold Bangle Set',
            description: 'Set of 3 14K gold bangles',
            price: 799.99,
            image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
            category_id: categoryMap['bracelets'],
            stock: 20,
            featured: false
        },
        {
            name: 'Charm Bracelet',
            description: 'Sterling silver charm bracelet with 5 charms',
            price: 349.99,
            image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
            category_id: categoryMap['bracelets'],
            stock: 32,
            featured: true
        },
        {
            name: 'Leather Wrap Bracelet',
            description: 'Bohemian leather wrap bracelet with crystals',
            price: 89.99,
            image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
            category_id: categoryMap['bracelets'],
            stock: 50,
            featured: false
        },
        // Watches
        {
            name: 'Diamond Watch',
            description: 'Luxury diamond-encrusted watch with mother of pearl dial',
            price: 4999.99,
            image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
            category_id: categoryMap['watches'],
            stock: 8,
            featured: true
        },
        {
            name: 'Classic Gold Watch',
            description: 'Elegant gold-tone watch with leather strap',
            price: 899.99,
            image_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800',
            category_id: categoryMap['watches'],
            stock: 15,
            featured: true
        },
        {
            name: 'Rose Gold Minimalist Watch',
            description: 'Modern minimalist design in rose gold',
            price: 299.99,
            image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800',
            category_id: categoryMap['watches'],
            stock: 25,
            featured: false
        }
    ];

    for (const product of products) {
        const { error } = await supabase.from('products').insert(product);
        if (error) console.error('Error adding product:', product.name, error);
        else console.log('Added product:', product.name);
    }

    console.log('Seeding complete!');
}

seedProducts();

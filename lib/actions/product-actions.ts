'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server'; // Keep for read ops if needed, but safe to use admin for all admin actions
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export async function createProduct(formData: FormData) {
    const user = await currentUser();

    // Authorization check
    if (!user || user.publicMetadata.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    const supabase = createAdminClient();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : 0;
    const category_id = formData.get('category_id') as string || null;
    const image_url = formData.get('image_url') as string || null;
    const featured = formData.get('featured') === 'on';
    const selling_fast = formData.get('selling_fast') === 'on';

    const original_price_raw = formData.get('original_price');
    const original_price = original_price_raw ? parseFloat(original_price_raw as string) : null;

    const discount_percentage_raw = formData.get('discount_percentage');
    const discount_percentage = discount_percentage_raw ? parseInt(discount_percentage_raw as string) : 0;

    const promo_code = formData.get('promo_code') as string || null;
    const promo_price_raw = formData.get('promo_price');
    const promo_price = promo_price_raw ? parseFloat(promo_price_raw as string) : null;

    const { error } = await supabase
        .from('products')
        .insert({
            name,
            description,
            price,
            stock,
            category_id,
            image_url,
            featured,
            selling_fast,
            original_price,
            discount_percentage,
            promo_code,
            promo_price
        });


    if (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product: ' + error.message); // Add message for better debugging
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    const user = await currentUser();

    if (!user || user.publicMetadata.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    const supabase = createAdminClient();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : 0;
    const category_id = formData.get('category_id') as string || null;
    const image_url = formData.get('image_url') as string || null;
    const featured = formData.get('featured') === 'on';
    const selling_fast = formData.get('selling_fast') === 'on';

    const original_price_raw = formData.get('original_price');
    const original_price = original_price_raw ? parseFloat(original_price_raw as string) : null;

    const discount_percentage_raw = formData.get('discount_percentage');
    const discount_percentage = discount_percentage_raw ? parseInt(discount_percentage_raw as string) : 0;

    const promo_code = formData.get('promo_code') as string || null;
    const promo_price_raw = formData.get('promo_price');
    const promo_price = promo_price_raw ? parseFloat(promo_price_raw as string) : null;

    const { error } = await supabase
        .from('products')
        .update({
            name,
            description,
            price,
            stock,
            category_id,
            image_url,
            featured,
            selling_fast,
            original_price,
            discount_percentage,
            promo_code,
            promo_price,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id);

    if (error) {
        console.error('Error updating product:', error);
        throw new Error('Failed to update product: ' + error.message);
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    const user = await currentUser();

    if (!user || user.publicMetadata.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    const supabase = createAdminClient();

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        throw new Error('Failed to delete product: ' + error.message);
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
}

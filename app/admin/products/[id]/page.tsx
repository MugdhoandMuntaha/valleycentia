import ProductForm from '@/components/admin/ProductForm';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch product and categories in parallel
    const [productRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').eq('id', id).single(),
        supabase.from('categories').select('id, name')
    ]);

    if (productRes.error || !productRes.data) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <ProductForm
                product={productRes.data}
                categories={categoriesRes.data || []}
            />
        </div>
    );
}

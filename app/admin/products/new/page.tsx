import ProductForm from '@/components/admin/ProductForm';
import { createClient } from '@/lib/supabase/server';

export default async function NewProductPage() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from('categories').select('id, name');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <ProductForm categories={categories || []} />
        </div>
    );
}

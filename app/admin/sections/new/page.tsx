import { createClient } from '@/lib/supabase/server';
import SectionForm from '@/components/admin/SectionForm';

export default async function NewSectionPage() {
    const supabase = await createClient();

    // Fetch all products for the product selector
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Create New Section</h1>
                <p className="text-gray-400 mt-2">Add a new product section to your homepage</p>
            </div>

            <SectionForm products={products || []} />
        </div>
    );
}

import { createClient } from '@/lib/supabase/server';
import { getSectionById, getSectionProducts } from '@/lib/supabase/sections';
import SectionForm from '@/components/admin/SectionForm';
import { notFound } from 'next/navigation';

export default async function EditSectionPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    try {
        // Fetch the section
        const section = await getSectionById(params.id);

        // Fetch section products
        const sectionProducts = await getSectionProducts(params.id);
        const selectedProductIds = sectionProducts?.map((item: any) => item.product_id) || [];

        // Fetch all products
        const { data: products } = await supabase
            .from('products')
            .select('*')
            .order('name', { ascending: true });

        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Edit Section</h1>
                    <p className="text-gray-400 mt-2">Update the section details and products</p>
                </div>

                <SectionForm
                    section={section}
                    products={products || []}
                    selectedProductIds={selectedProductIds}
                />
            </div>
        );
    } catch (error) {
        notFound();
    }
}

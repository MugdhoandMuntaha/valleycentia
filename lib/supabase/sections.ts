import { createClient } from '@/lib/supabase/server';

export interface ProductSection {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductSectionItem {
    id: string;
    section_id: string;
    product_id: string;
    display_order: number;
    created_at: string;
}

export interface ProductSectionWithProducts extends ProductSection {
    products: any[]; // Will be Product[] from database.types.ts
}

/**
 * Fetch all product sections (for admin)
 */
export async function getAllSections() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('product_sections')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) throw error;
    return data as ProductSection[];
}

/**
 * Fetch active product sections with their products (for homepage)
 */
export async function getActiveSectionsWithProducts() {
    try {
        const supabase = await createClient();

        // First, get active sections
        const { data: sections, error: sectionsError } = await supabase
            .from('product_sections')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (sectionsError) {
            console.error('Error fetching sections:', sectionsError);
            return [];
        }
        if (!sections) return [];

        // For each section, get its products
        const sectionsWithProducts = await Promise.all(
            sections.map(async (section) => {
                const { data: items, error: itemsError } = await supabase
                    .from('product_section_items')
                    .select('product_id, display_order')
                    .eq('section_id', section.id)
                    .order('display_order', { ascending: true });

                if (itemsError) {
                    console.error('Error fetching section items:', itemsError);
                    return { ...section, products: [] };
                }

                // Fetch the actual products
                const productIds = items?.map(item => item.product_id) || [];
                if (productIds.length === 0) {
                    return { ...section, products: [] };
                }

                const { data: products, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .in('id', productIds);

                if (productsError) {
                    console.error('Error fetching products:', productsError);
                    return { ...section, products: [] };
                }

                // Sort products according to display_order
                const sortedProducts = productIds
                    .map(id => products?.find(p => p.id === id))
                    .filter(Boolean);

                return { ...section, products: sortedProducts };
            })
        );

        return sectionsWithProducts as ProductSectionWithProducts[];
    } catch (error) {
        console.error('Error in getActiveSectionsWithProducts:', error);
        return [];
    }
}

/**
 * Get a single section by ID
 */
export async function getSectionById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('product_sections')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as ProductSection;
}

/**
 * Get products for a specific section
 */
export async function getSectionProducts(sectionId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('product_section_items')
        .select('product_id, display_order, products(*)')
        .eq('section_id', sectionId)
        .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
}

/**
 * Create a new product section
 */
export async function createSection(section: {
    name: string;
    description?: string;
    slug: string;
    display_order?: number;
    is_active?: boolean;
}) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('product_sections')
        .insert([section])
        .select()
        .single();

    if (error) throw error;
    return data as ProductSection;
}

/**
 * Update an existing product section
 */
export async function updateSection(id: string, updates: Partial<ProductSection>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('product_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as ProductSection;
}

/**
 * Delete a product section
 */
export async function deleteSection(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('product_sections')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

/**
 * Update products in a section
 */
export async function updateSectionProducts(sectionId: string, productIds: string[]) {
    const supabase = await createClient();

    // First, delete existing items
    await supabase
        .from('product_section_items')
        .delete()
        .eq('section_id', sectionId);

    // Then insert new items
    if (productIds.length > 0) {
        const items = productIds.map((productId, index) => ({
            section_id: sectionId,
            product_id: productId,
            display_order: index,
        }));

        const { error } = await supabase
            .from('product_section_items')
            .insert(items);

        if (error) throw error;
    }
}
